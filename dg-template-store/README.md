# DG Template Suite

Store site for paid data governance templates plus a free 30-question maturity assessment.
Vite + React + React Router, plus four Vercel functions in `api/` for Stripe checkout and file delivery.
Payments setup for Uday: see **SETUP.md**.

## Run it
    npm install
    npm run dev            # local site at http://localhost:5173
    npm run build          # static site in dist/ (deploys to Vercel as-is; vercel.json handles routes)

## Checks
    npm run check:links    # renders every page and follows every link; fails on any dead link
    npm run test:flows     # clicks through assessment → results → bundle, catalog → preview → buy → Stripe, thank-you page
    npm test               # payment and delivery tests (Stripe, storage and email mocked; no keys needed)

## Where to change things
- `src/data/catalog.js`: every template, tier, bundle and price. `source: 'invented'` marks drafted listings.
- `src/data/assessment.js`: the 30 questions, 6 dimensions, 5 levels and which templates each dimension recommends.
- `src/pages/Legal.jsx`: terms, refund and privacy placeholder text.

## Template files (what buyers download)
The five launch templates are built by Python scripts in `build-files/` and written to `files/<slug>/`.
`files/` is in .gitignore and outside `public/` on purpose: these are the paid products, so they must
never be committed to a public repo or served from the site. Delivery (task 4) should hand them out
from private storage through a signed link after payment.

    cd build-files
    python3 charter.py && python3 opmodel.py && python3 opmodel_deck.py
    python3 roi_model.py && python3 business_case.py && python3 policies.py
    python3 glossary_xlsx.py && python3 glossary_guide.py
    python3 <xlsx skill>/scripts/recalc.py ../files/business-case-roi/Business-Case-ROI-Model.xlsx
    python3 <xlsx skill>/scripts/recalc.py ../files/glossary-kit/Business-Glossary-Workbook.xlsx
    python3 make_previews.py ../src/assets/previews   # watermarked sample pages for the Preview pages

Needs python-docx, python-pptx, openpyxl, Pillow, LibreOffice (page counts and contents page numbers)
and poppler-utils. `docgen.py` is the shared Word builder; `glossary_terms.py` holds the 155 starter terms.
After changing a file, update its `length`, `files` and `previews` in `src/data/catalog.js`.

## Free assessment report
The results page has a "Download report (PDF)" button. `src/lib/reportPdf.js` builds a 4-page PDF in
the browser with jsPDF (loaded only when clicked): level and score, radar chart, dimension table, the
two focus areas, a 90-day plan for the level, the recommended bundle and all 30 answers. Nothing is sent
to a server.

## Payments and delivery
- `api/checkout.js`: POST `{slug}` → Stripe Checkout Session from catalog.js prices (or `stripePriceId` if set).
- `api/stripe-webhook.js`: verifies Stripe's signature, records the order in private Blob once, emails links (Resend, optional).
- `api/order.js`: the `/thanks` page asks this for fresh signed links; it checks the session with Stripe directly.
- `api/download.js`: checks the signed, expiring token and streams the file from the private Blob store.
- `server/`: shared code (config, tokens, storage, email, products). `scripts/upload-files.mjs` uploads `files/` to Blob.
- What can be sold: `isBuyable()` in catalog.js. Templates need `fileReady`; bundles need every template ready.
- Local dev: `vercel dev` (Vite alone has no `api/`). `LOCAL_FILES_DIR=./files` serves files from disk locally.

## Preview build
    npm run build:artifact # one self-contained HTML file in dist-artifact/ (uses in-memory routing)
