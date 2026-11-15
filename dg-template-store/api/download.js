import { config } from '../server/config.js';
import { readToken } from '../server/tokens.js';
import { storage } from '../server/storage.js';

const TYPES = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

function page(status, title, body) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="font-family:Arial,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;line-height:1.5;color:#111"><h1 style="font-size:22px">${esc(title)}</h1>${body}<p><a href="/">DG Template Suite</a></p></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// GET /api/download?t=<signed token>  Streams one paid file from private storage.
export async function GET(request) {
  const c = config();
  const token = new URL(request.url).searchParams.get('t') || '';
  const check = readToken(token, c.downloadSecret);

  if (!check.ok && check.reason === 'expired') {
    const fresh = `/thanks?session_id=${encodeURIComponent(check.order)}`;
    return page(410, 'This download link has expired', `<p>Links work for ${c.linkHours} hours. <a href="${esc(fresh)}">Get fresh links for your order</a>.</p>`);
  }
  if (!check.ok) return page(403, 'This download link is not valid', '<p>Use the link from your order email or order page.</p>');

  let file = null;
  try {
    file = await storage().readFile(check.key);
  } catch (err) {
    // Usually a storage setup problem (no Blob credentials, wrong store). Shows in Vercel's logs.
    console.error('Download failed: could not read', `products/${check.key}`, err?.message || err);
    return page(500, 'Download unavailable right now', '<p>Please try again in a few minutes, or contact us and we will send the file to you.</p>');
  }
  if (!file) {
    console.error('Download failed: not found in storage', `products/${check.key}`);
    return page(404, 'File not found', '<p>Please contact us and we will send it to you.</p>');
  }

  const name = check.key.split('/').pop();
  const ext = name.split('.').pop().toLowerCase();
  return new Response(file.stream, {
    headers: {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
      ...(file.size ? { 'Content-Length': String(file.size) } : {}),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
