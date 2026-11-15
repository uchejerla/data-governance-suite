import Stripe from 'stripe';
import { config } from './config.js';

let override = null;
let cached = null;

// Tests swap in a fake client; production builds one from STRIPE_SECRET_KEY.
export function setStripeForTests(fake) {
  override = fake;
  cached = null;
}

export function getStripe() {
  if (override) return override;
  if (!cached) {
    const { stripeSecretKey } = config();
    if (!stripeSecretKey) throw new Error('STRIPE_SECRET_KEY is not set');
    cached = new Stripe(stripeSecretKey);
  }
  return cached;
}

// Signature check uses Stripe's own verifier, which needs no network or account.
export function verifyWebhook(rawBody, signature, secret) {
  return Stripe.webhooks.constructEvent(rawBody, signature, secret);
}
