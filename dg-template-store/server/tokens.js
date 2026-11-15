import { createHmac, timingSafeEqual } from 'node:crypto';

// A download link carries a small signed token: which order, which file, and
// when it stops working. Nothing is stored; the HMAC proves we issued it.
const b64 = (buf) => Buffer.from(buf).toString('base64url');

function sign(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function makeToken({ order, key, expiresAt }, secret) {
  if (!secret) throw new Error('DOWNLOAD_LINK_SECRET is not set');
  const payload = b64(JSON.stringify({ o: order, k: key, e: Math.floor(expiresAt / 1000) }));
  return `${payload}.${sign(payload, secret)}`;
}

// Returns { ok: true, order, key } or { ok: false, reason: 'invalid' | 'expired' }.
// An expired token still says which order it was for, so the page can offer fresh links.
export function readToken(token, secret, now = Date.now()) {
  if (!secret || typeof token !== 'string' || token.length > 2048) return { ok: false, reason: 'invalid' };
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'invalid' };
  const [payload, mac] = parts;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: 'invalid' };
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (typeof data.k !== 'string' || typeof data.o !== 'string' || typeof data.e !== 'number') return { ok: false, reason: 'invalid' };
  if (data.e * 1000 <= now) return { ok: false, reason: 'expired', order: data.o };
  return { ok: true, order: data.o, key: data.k };
}
