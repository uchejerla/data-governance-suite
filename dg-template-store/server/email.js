import { config } from './config.js';

let sender = null;
export function setEmailSenderForTests(fn) {
  sender = fn;
}

export function emailConfigured(c = config()) {
  return Boolean(c.resendApiKey && c.emailFrom);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

export function buildDeliveryEmail({ to, productName, links, orderPageUrl, linkHours, supportEmail }) {
  const list = links.map((l) => `<li><a href="${esc(l.url)}">${esc(l.label)}</a> <span style="color:#666">(${esc(l.name)})</span></li>`).join('');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Thank you for buying ${esc(productName)}.</p>
<p>Your files:</p><ul>${list}</ul>
<p>These links work for ${linkHours} hours. If they expire, get fresh links from your <a href="${esc(orderPageUrl)}">order page</a>.</p>
${supportEmail ? `<p>Questions? Reply to this email or write to ${esc(supportEmail)}.</p>` : ''}
<p>DG Template Suite</p></div>`;
  const text = [
    `Thank you for buying ${productName}.`,
    '',
    'Your files:',
    ...links.map((l) => `- ${l.label} (${l.name}): ${l.url}`),
    '',
    `These links work for ${linkHours} hours. If they expire, get fresh links here: ${orderPageUrl}`,
    '',
    'DG Template Suite',
  ].join('\n');
  return { to, subject: `Your download: ${productName}`, html, text };
}

// Sends through Resend when RESEND_API_KEY and EMAIL_FROM are set.
// Returns 'sent', 'skipped' (not configured) or 'failed'. Never throws:
// the success page still delivers the links if email is off or down.
export async function sendEmail(message) {
  if (sender) return sender(message);
  const c = config();
  if (!emailConfigured(c)) return 'skipped';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: c.emailFrom,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(c.supportEmail ? { reply_to: c.supportEmail } : {}),
      }),
    });
    if (!res.ok) {
      console.error('Delivery email failed', res.status);
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error('Delivery email failed', err?.message);
    return 'failed';
  }
}
