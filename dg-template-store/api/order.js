import { config, paymentsConfigured } from '../server/config.js';
import { getStripe } from '../server/stripeClient.js';
import { checkPaidSession, signedLinks, buyerEmail } from '../server/orders.js';
import { emailConfigured } from '../server/email.js';
import { json, errorJson } from '../server/http.js';

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

function maskEmail(email) {
  if (!email) return null;
  const [user, domain] = email.split('@');
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(1, Math.min(user.length - 1, 6)))}@${domain}`;
}

// GET /api/order?session_id=cs_...  The success page calls this to show fresh,
// time-limited links. It asks Stripe directly, so it works even if the webhook
// has not arrived yet.
export async function GET(request) {
  const c = config();
  if (!paymentsConfigured(c)) return errorJson(503, 'Payments are not set up yet.');
  const id = new URL(request.url).searchParams.get('session_id') || '';
  if (!SESSION_ID.test(id)) return errorJson(400, 'That order link is not valid.');

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(id);
  } catch (err) {
    if (err?.statusCode === 404 || err?.code === 'resource_missing') return errorJson(404, 'Order not found.');
    console.error('Order lookup failed', err?.message);
    return errorJson(502, 'Could not look up the order. Please try again.');
  }

  const ageDays = (Date.now() / 1000 - session.created) / 86400;
  if (ageDays > c.orderLookupDays) {
    return json({ status: 'too_old', message: 'This order page has expired. Contact us and we will resend your files.' });
  }

  const check = checkPaidSession(session);
  if (check.unpaid) {
    const status = session.status === 'complete' ? 'processing' : 'unpaid';
    return json({ status });
  }
  if (check.problem) return errorJson(404, 'Order not found.');

  const { links, expiresAt } = signedLinks(session.id, check.product);
  return json({
    status: 'paid',
    product: { name: check.product.name, kind: check.product.kind },
    email: maskEmail(buyerEmail(session)),
    emailDelivery: emailConfigured(c),
    links,
    expiresAt: new Date(expiresAt).toISOString(),
    freshLinksDays: c.orderLookupDays,
  });
}
