# Payments setup (Stripe + Vercel)

What you create yourself, in order. About 30 minutes. For a short click-by-click version, see **SETUP-CHECKLIST.md**. Do everything in Stripe's
**sandbox / test mode** first; switch to live keys only after a test purchase works.

## How it works
1. A buyer clicks **Buy** → the site calls `/api/checkout` → Stripe's own payment page opens.
   The price comes from `src/data/catalog.js` on the server, never from the browser.
2. After paying, Stripe sends the buyer to `/thanks`, which shows a download button per file.
3. Stripe also calls `/api/stripe-webhook`. That records the order and (if email is set up)
   emails the same links. A repeated webhook is ignored, so nobody gets two emails.
4. Each download link is signed and works for 72 hours. The order page gives fresh links
   for 30 days. Links only ever cover the files in what was bought.
5. The paid files sit in a **private Vercel Blob store**. They have no public address and are
   left out of every deployment (`.vercelignore`). Only `/api/download` can read them.

Why Vercel Blob: it lives inside the Vercel project you already need, private stores are on
every plan, and it needs no second account (Supabase or S3 would). Orders are small JSON files
in the same store, so there is no database to run.

Templates without finished files show **Coming soon**, and checkout refuses them. A bundle goes
on sale only when every template in it has files. Today no bundle qualifies.

## 1. Stripe (dashboard.stripe.com)
1. Create your Stripe account and finish the business details Stripe asks for (needed before
   live payouts, not for testing).
2. **API keys** (Developers → API keys, in sandbox/test mode): copy the **Secret key**
   (`sk_test_...`). You don't need the publishable key.
3. Products and prices: **nothing to create.** Checkout builds each line item from
   `catalog.js`. Optional: if you prefer Stripe products, create one per item and paste its
   Price ID (`price_...`) into that item's `stripePriceId` in `catalog.js`.
4. **Webhook** (Workbench → Webhooks → Create an event destination), after the site has an address:
   - Events from: **Your account**
   - Payload format: **Snapshot** (not Thin; the handler reads the full session)
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed`, `checkout.session.expired`
   - Destination: Webhook endpoint, URL `https://<your-domain>/api/stripe-webhook`
   - Reveal the **Signing secret** (`whsec_...`) and copy it.
5. Settings → Payments → Payment methods: cards are enough. Delayed methods (bank debits)
   also work; their files are released when the payment clears.
6. Settings → Branding and Public details: business name, support email, statement descriptor
   (what shows on the buyer's card statement).
7. Optional: Stripe Tax if you need to charge sales tax or VAT. Not wired in yet.

## 2. Vercel
1. Create the project from this folder (framework preset **Vite**; build `npm run build`,
   output `dist`). Push to a **private** repo, or deploy with `vercel` from your machine.
2. **Storage → Create → Blob → Access: Private**, and connect it to the project
   (all environments). Vercel adds the Blob credentials for you.
3. Upload the paid files once (and again whenever a file changes):
   ```
   vercel env pull .env.local
   node --env-file=.env.local scripts/upload-files.mjs
   ```
   If the pulled file has no `BLOB_READ_WRITE_TOKEN`, copy one from the store's settings page
   into `.env.local` first. It should print `15 files uploaded.`
4. **Settings → Environment Variables** (Production, and Preview if you test there):

   | Name | Value |
   |---|---|
   | `STRIPE_SECRET_KEY` | `sk_test_...` now, `sk_live_...` at launch |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` from step 1.4 (test and live endpoints have different secrets) |
   | `DOWNLOAD_LINK_SECRET` | 64 random hex characters: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `SITE_URL` | `https://<your-domain>` with no trailing slash |
   | `RESEND_API_KEY` | optional, from resend.com, for emailed links |
   | `EMAIL_FROM` | optional, e.g. `DG Template Suite <orders@your-domain.com>` (domain verified in Resend) |
   | `SUPPORT_EMAIL` | optional, used as reply-to and shown in the email |

   Redeploy after changing variables. Without email set, buyers still get links on the page.
5. Never set `LOCAL_FILES_DIR` on Vercel (it is for local testing and is ignored there anyway).

## 3. Test purchase (sandbox)
1. Open a launch template, e.g. `/templates/governance-charter`, click **Buy**, then **Pay**.
2. On Stripe's page use card `4242 4242 4242 4242`, any future date, any CVC, any email you can read.
3. You should land on **Thank you, your files are ready** with two download buttons.
4. In Stripe → Workbench → Webhooks → your endpoint → Event deliveries, the
   `checkout.session.completed` delivery should show `200`.
5. If email is set up, the email arrives with the same links.
6. Try **Cancel** on Stripe's page: you return to checkout with "Payment cancelled".
7. Card `4000 0000 0000 0002` is declined; nothing is delivered.

Local test instead of a deployed preview: `vercel dev` with `.env.local` filled in, plus
`stripe login` and `stripe listen --forward-to localhost:3000/api/stripe-webhook`
(use the `whsec_` that `stripe listen` prints). Set `LOCAL_FILES_DIR=./files` to skip Blob locally.

## 4. Going live
Swap `STRIPE_SECRET_KEY` to `sk_live_...`, create the same webhook in live mode and use its
new `whsec_...`, redeploy, and make one real small purchase (then refund it in Stripe).

## If a buyer says the links don't work
Their order page is `https://<your-domain>/thanks?session_id=<Checkout Session id>`; the id is on
the payment in Stripe (Payments → the payment → Checkout Session). It gives fresh links for 30 days.
