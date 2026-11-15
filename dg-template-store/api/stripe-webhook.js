import { config } from '../server/config.js';
import { verifyWebhook } from '../server/stripeClient.js';
import { fulfil } from '../server/orders.js';
import { json, errorJson } from '../server/http.js';

// Stripe calls this after checkout. Point a webhook endpoint at /api/stripe-webhook
// for these events: checkout.session.completed, checkout.session.async_payment_succeeded,
// checkout.session.async_payment_failed, checkout.session.expired.
export async function POST(request) {
  const { stripeWebhookSecret } = config();
  if (!stripeWebhookSecret) return errorJson(503, 'Webhook secret not set.');

  const signature = request.headers.get('stripe-signature');
  if (!signature) return errorJson(400, 'Missing signature.');
  const raw = await request.text(); // the exact bytes Stripe signed

  let event;
  try {
    event = verifyWebhook(raw, signature, stripeWebhookSecret);
  } catch {
    return errorJson(400, 'Bad signature.');
  }

  const session = event.data?.object;
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Card payments arrive paid. Delayed methods arrive unpaid and are
        // fulfilled on async_payment_succeeded instead.
        if (session.payment_status !== 'paid') return json({ received: true, result: 'awaiting payment' });
        return json({ received: true, result: (await fulfil(session)).status });
      case 'checkout.session.async_payment_succeeded':
        return json({ received: true, result: (await fulfil(session)).status });
      case 'checkout.session.async_payment_failed':
        console.warn('Payment failed for checkout session', session.id);
        return json({ received: true, result: 'payment failed, nothing delivered' });
      case 'checkout.session.expired':
        return json({ received: true, result: 'expired, nothing delivered' });
      default:
        return json({ received: true, result: 'ignored' });
    }
  } catch (err) {
    // A 500 makes Stripe retry later; fulfil() is safe to repeat.
    console.error('Fulfilment failed', session?.id, err?.message);
    return errorJson(500, 'Fulfilment failed, Stripe will retry.');
  }
}
