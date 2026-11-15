import { config } from './config.js';
import { sellable } from './products.js';
import { makeToken } from './tokens.js';
import { storage, AlreadyExists } from './storage.js';
import { sendEmail, buildDeliveryEmail } from './email.js';

// Checks a Stripe Checkout Session really paid for a product we sell, at our price.
// Returns { product } or { problem }.
export function checkPaidSession(session) {
  if (!session || session.object !== 'checkout.session') return { problem: 'not a checkout session' };
  if (session.mode !== 'payment') return { problem: 'not a one-time payment' };
  if (session.payment_status !== 'paid') return { problem: 'not paid', unpaid: true };
  const product = sellable(session.metadata?.product_slug);
  if (!product) return { problem: 'unknown product' };
  // If a Stripe Price ID is configured the amount is Stripe's; otherwise it must match catalog.js.
  if (!product.stripePriceId && (session.amount_total !== product.amountCents || session.currency !== product.currency)) {
    return { problem: 'amount does not match the catalog' };
  }
  return { product };
}

export function buyerEmail(session) {
  return session.customer_details?.email || session.customer_email || null;
}

export function signedLinks(sessionId, product, now = Date.now()) {
  const c = config();
  const expiresAt = now + c.linkHours * 3600 * 1000;
  return {
    expiresAt,
    links: product.files.map((f) => ({
      label: f.label,
      name: f.name,
      template: f.template,
      url: `${c.siteUrl}/api/download?t=${makeToken({ order: sessionId, key: f.key, expiresAt }, c.downloadSecret)}`,
    })),
  };
}

export function orderPageUrl(sessionId) {
  return `${config().siteUrl}/thanks?session_id=${encodeURIComponent(sessionId)}`;
}

// Called by the webhook. Safe to call many times for the same session: only the
// first call records the order and sends the email.
export async function fulfil(session, now = Date.now()) {
  const check = checkPaidSession(session);
  if (check.problem) return { status: 'ignored', reason: check.problem };
  const { product } = check;
  const email = buyerEmail(session);
  const record = {
    session: session.id,
    product: product.slug,
    files: product.files.map((f) => f.key),
    amount: session.amount_total,
    currency: session.currency,
    email,
    paidAt: new Date(now).toISOString(),
  };
  try {
    await storage().createOrder(session.id, record);
  } catch (err) {
    if (err instanceof AlreadyExists) return { status: 'duplicate' };
    throw err;
  }
  let emailStatus = 'skipped';
  if (email) {
    const c = config();
    const { links } = signedLinks(session.id, product, now);
    emailStatus = await sendEmail(
      buildDeliveryEmail({ to: email, productName: product.name, links, orderPageUrl: orderPageUrl(session.id), linkHours: c.linkHours, supportEmail: c.supportEmail }),
    );
  }
  return { status: 'fulfilled', email: emailStatus };
}
