# For Uday to review

The June code wasn't reachable, so this was rebuilt. Items below were drafted and need your call.

## From your June chat (kept as given)
Charter $49, Operating Model Guide $79, Business Case and ROI $99, Policy Bundle $129,
Glossary Kit $149, Executive Power BI Dashboard $199, AI Governance Framework $149.
The first five now have real files (see below). The Power BI and AI listings are still drafts.

## Drafted (shown on the site with a "Draft listing" tag)
- 13 templates: Roles and RACI Matrix $39, Governance Council Kit $49, Data Steward Playbook $89,
  Data Quality Rules Catalog $99, Metadata Onboarding Kit $89, Governance KPI Library $79,
  Data Quality Scorecard $99, Maturity Assessment Workbook $59, Data Issue and Exception Log $49,
  MDM Playbook $149, Privacy and Classification Kit $129, Lineage Documentation Kit $99,
  Regulatory Mapping Pack $149.
- Bundle prices: Foundation $219, Implementation $389, Measurement $339, Advanced $469, Complete Suite $999.
- All 30 assessment statements, the 6 dimension names, the 5 level names and cutoffs
  (1.8 / 2.6 / 3.4 / 4.2), and which bundle each level recommends.
- Page counts ("about N pages") are estimates.
- Legal pages (terms, refunds, privacy) are placeholder text, not legal advice.

## Launch files for task 3 sign-off (built Nov 15)
All five are in `files/`. Open each one and read it as a buyer would. Every file carries the footer
"licensed for use inside one organization" and the publisher name "DG Template Suite".

| Template | Price | Files | Old listing said |
|---|---|---|---|
| Data Governance Charter | $49 | Charter 13 pages, executive summary 1 page | 14 pages |
| Operating Model Guide | $79 | Guide 12 pages, leadership deck 14 slides with speaker notes | 26 pages |
| Business Case and ROI Model | $99 | ROI workbook 7 sheets, narrative 9 pages | 12 pages |
| Data Policy Bundle | $129 | 7 documents, 33 pages (DP-00 to DP-05 plus DP-06 exception form) | 38 pages |
| Business Glossary Kit | $149 | Workbook 8 sheets with 155 starter terms, guide 9 pages | 18 pages, 150 terms |

The site's listings now show these real lengths and files, and the Preview pages show three
watermarked real pages for each.

### Please check
1. **Prices against content.** The Operating Model Guide and Business Case came out shorter in
   pages than listed, but each has a second file (deck, workbook). Say if any price should move.
2. **ROI example numbers.** The workbook ships with a worked example for a mid-sized P&C insurer
   ($800M written premium). Base case: NPV about $904K, ROI 31.9%, payback about 2 years; the
   conservative case is negative. Buyers replace the blue cells, but the example should look
   believable to your audience.
3. **Glossary starter terms.** 155 P&C insurance definitions in plain language, US usage, all
   marked Draft. Worth a skim by someone from insurance. The Collibra and Purview field names on
   the Tool mapping sheet are typical, not checked against current product templates; the sheet
   tells buyers to check their tool's own template.
4. **Retention periods.** DP-04's schedule is illustrative and says so. Legal must set real periods.
5. **Licence wording and publisher name** on every file and cover. Change if you sell under
   another name.
6. **Assessment PDF report.** Built from the drafted assessment. The 90-day plan for each level
   in `src/lib/reportPdf.js` is drafted. The PDF was generated and checked outside a browser;
   click the button once in a real browser before launch. The preview link can't
   save files, so the button does nothing there; it works on the real site.
7. **Industry focus.** The glossary and the ROI example are insurance-flavoured. Everything else
   is industry-neutral. Say if you want the listings to say "P&C insurance" more plainly.

## Payments (task 4, built Nov 15)
Setup steps for your Stripe and Vercel accounts are in `SETUP.md`. Your calls:
1. **Bundles are not on sale.** Every bundle includes templates without files yet, so bundle pages
   show "Coming soon". Option: a launch bundle of the five ready templates (list $505) at a price you pick.
2. **Link lifetime.** Download links last 72 hours; the order page gives fresh ones for 30 days.
   Change with `DOWNLOAD_LINK_HOURS` and `ORDER_LOOKUP_DAYS`.
3. **What buyers give.** Only an email, collected on Stripe's page. The privacy page now says that.
4. **Sales tax / VAT** is not charged. Turn on Stripe Tax if you need it.
5. **Email** is optional (Resend). Without it, buyers get links only on the page after paying.
