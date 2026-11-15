// Every Buy and bundle button goes through checkoutPath(). The Checkout page
// POSTs the product slug to /api/checkout (a Vercel function), which creates a
// Stripe Checkout Session from the prices in src/data/catalog.js and returns
// Stripe's payment page URL.
//
// The single-file preview build has no server, so checkout stays off there.
export const CHECKOUT_LIVE = import.meta.env.VITE_ROUTER !== 'memory';

export function checkoutPath(slug) {
  return `/checkout/${slug}`;
}

export async function startCheckout(slug) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout. Please try again.');
  return data.url;
}

export async function fetchOrder(sessionId) {
  const res = await fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not load your order.');
  return data;
}

// Sends the browser to Stripe. The flow test swaps this out (jsdom cannot leave the page).
export function goTo(url) {
  if (typeof window.__dgtsNavigate === 'function') return window.__dgtsNavigate(url);
  window.location.assign(url);
}
