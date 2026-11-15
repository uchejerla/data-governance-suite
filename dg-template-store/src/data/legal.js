// Details used on the terms, licence, refund, privacy and contact pages.
// Fill in every value in [brackets] before launch. Each one appears on the live pages.
export const LEGAL = {
  // Legal name of whoever sells the templates: your own name, or your LLC's name.
  seller: '[Business name]',
  // Where buyers write for help, refunds and privacy requests.
  supportEmail: '[support email]',
  // The day these pages take effect, for example 'December 1, 2026'.
  effective: '[effective date]',

  // Choices with suggested defaults. Change any of them here.
  state: 'Texas',
  refundDays: 14,
  recordYears: 7, // how long order records are kept for tax and accounting
  replyDays: 2, // business days you aim to answer support email in

  // Must match DOWNLOAD_LINK_HOURS and ORDER_LOOKUP_DAYS in the Vercel settings.
  linkHours: 72,
  orderLookupDays: 30,
};

export const hasEmail = (email = LEGAL.supportEmail) => /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(email);
