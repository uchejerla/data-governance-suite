# Payments setup, click by click (about 20 minutes)

Short version of SETUP.md. Stay in Stripe's **sandbox / test mode** the whole time.
Keep a note open to paste four values into: `sk_test_...`, `whsec_...`, your site address, and a random secret.

## A. Vercel project (gives you a site address)
1. vercel.com → **Add New… → Project** → import this folder's repo (keep the repo **private**), or run `vercel` in the folder.
2. **Root Directory: `dg-template-store`** (the app lives in that folder of the GitHub repo). Framework preset **Vite**, build command `npm run build`, output `dist` → **Deploy**.
3. Copy the production address, e.g. `https://<project>.vercel.app`. Use this one, not a preview address:
   preview addresses sit behind Vercel's login by default, which blocks Stripe's webhook.
   If Stripe later shows `401` on webhook deliveries, check Settings → Deployment Protection.
4. Project → **Storage → Create Database → Blob** → name it → Access **Private** → **Create** →
   connect to the project, all environments.

## B. Stripe (dashboard.stripe.com)
5. Create the account. Switch on **Test mode / Sandbox** (top bar).
6. **Developers → API keys** → Secret key → **Reveal** → copy `sk_test_...`.
7. **Workbench → Webhooks → Create an event destination**:
   Your account → payload **Snapshot** (not Thin) → tick
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired` →
   Continue → **Webhook endpoint** → URL `https://<project>.vercel.app/api/stripe-webhook` → Create.
8. On the endpoint page → Signing secret → **Reveal** → copy `whsec_...`.

## C. Settings on Vercel
9. Make the random secret on your machine:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
10. Project → **Settings → Environment Variables** → add for Production:
    `STRIPE_SECRET_KEY` = `sk_test_...`, `STRIPE_WEBHOOK_SECRET` = `whsec_...`,
    `DOWNLOAD_LINK_SECRET` = the random secret, `SITE_URL` = `https://<project>.vercel.app` (no slash at the end).
    Email is optional; skip it for the first test.
11. **Deployments** → latest → **⋯ → Redeploy**.

## D. Upload the paid files (once)
12. In the project folder: `vercel link`, then `vercel env pull .env.local`.
13. The paid files are not on GitHub (on purpose). Unzip `files-for-upload.zip` from this project into
    `dg-template-store/files/` on your machine, then run `npm install` and
    `node --env-file=.env.local scripts/upload-files.mjs`.
    It should end with `15 files uploaded.` (If it says the token is missing, copy
    `BLOB_READ_WRITE_TOKEN` from the Blob store's page into `.env.local` and run it again.)

## What you should see
Only the 5 launch templates (Charter, Operating Model Guide, Business Case and ROI, Policy Bundle,
Glossary Kit) have a **Buy** button. The other 15 templates and all 5 bundles say **Coming soon**
until their files exist. There is no cart: each Buy is its own checkout.

## E. Tell Claude it's done
14. Say "Stripe is set up" in this task. Then we run the test purchase together:
    card `4242 4242 4242 4242`, any future date, any CVC.

Never paste the `sk_` or `whsec_` values into a chat. They only go into Vercel's settings.
