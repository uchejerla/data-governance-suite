import { config, paymentsConfigured } from '../server/config.js';
import { sellable } from '../server/products.js';
import { getStripe } from '../server/stripeClient.js';
import { json, errorJson } from '../server/http.js';

// POST /api/checkout  { "slug": "governance-charter" }  →  { "url": "https://checkout.stripe.com/..." }
// Only the slug comes from the browser. Name, price and files come from catalog.js.
export async function POST(request) {
  const c = config();
  if (!paymentsConfigured(c)) return errorJson(503, 'Payments are not set up yet.');

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson(400, 'Send JSON with a product slug.');
  }
  const product = sellable(body?.slug);
  if (!product) return errorJson(404, 'That product is not on sale yet.');

  const lineItem = product.stripePriceId
    ? { price: product.stripePriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.amountCents,
          product_data: { name: product.name, description: product.description },
        },
      };

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      metadata: { product_slug: product.slug },
      payment_intent_data: { metadata: { product_slug: product.slug } },
      // Stripe asks for the buyer's email; we ask for nothing else.
      billing_address_collection: 'auto',
      customer_creation: 'if_required',
      submit_type: 'pay',
      success_url: `${c.siteUrl}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${c.siteUrl}/checkout/${product.slug}?cancelled=1`,
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('Checkout session failed', err?.type, err?.message);
    return errorJson(502, 'Could not start checkout. Please try again.');
  }
}

export function GET() {
  return errorJson(405, 'Use POST.');
}
