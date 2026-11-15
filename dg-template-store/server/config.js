// All settings come from environment variables. See .env.example and SETUP.md.
export function config() {
  const env = process.env;
  return {
    stripeSecretKey: env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    downloadSecret: env.DOWNLOAD_LINK_SECRET || '',
    siteUrl: (env.SITE_URL || '').replace(/\/+$/, ''),
    linkHours: Number(env.DOWNLOAD_LINK_HOURS || 72),
    orderLookupDays: Number(env.ORDER_LOOKUP_DAYS || 30),
    resendApiKey: env.RESEND_API_KEY || '',
    emailFrom: env.EMAIL_FROM || '',
    supportEmail: env.SUPPORT_EMAIL || '',
    // Local development only: read files from this folder instead of Vercel Blob.
    localFilesDir: env.LOCAL_FILES_DIR || '',
  };
}

export function paymentsConfigured(c = config()) {
  return Boolean(c.stripeSecretKey && c.downloadSecret && c.siteUrl);
}
