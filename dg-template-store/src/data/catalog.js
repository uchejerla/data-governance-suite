// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA: the one place to change names, prices, outlines and bundles.
//
// source: 'chat'     → name and price came from Uday's June 2026 chat summary.
// source: 'invented' → drafted for this rebuild; Uday to confirm, rename or drop.
// Every outline, summary and page count is a DRAFT until Uday reviews it.
//
// Later launch steps hook in here:
//   fileReady       → set true once the real downloadable file exists. Ready
//                     templates also carry length (shown on the page) and files
//                     (the files in files/<slug>/ that a buyer receives) and
//                     previews (captions for src/assets/previews/<slug>-N.jpg).
//   stripePriceId   → paste the Stripe Price ID (price_...) when checkout goes live.
// ─────────────────────────────────────────────────────────────────────────────

export const CURRENCY = 'USD';

export const TIERS = [
  {
    id: 'foundation',
    name: 'Foundation',
    step: 1,
    tagline: 'Stand up the program',
    description:
      'Charter, operating model, roles and the business case. The documents you need before anyone is asked to steward data.',
  },
  {
    id: 'implementation',
    name: 'Implementation',
    step: 2,
    tagline: 'Put it to work',
    description:
      'Policies, glossary, stewardship routines and quality rules that turn the charter into day-to-day practice.',
  },
  {
    id: 'measurement',
    name: 'Measurement',
    step: 3,
    tagline: 'Prove it is working',
    description:
      'Dashboards, KPIs and scorecards that show leadership what governance is changing, in numbers.',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    step: 4,
    tagline: 'Extend the program',
    description:
      'AI governance, MDM, privacy classification, lineage and regulatory mapping for mature programs.',
  },
];

const t = (o) => ({ fileReady: false, stripePriceId: null, ...o });

export const TEMPLATES = [
  // ── Foundation ─────────────────────────────────────────────────────────────
  t({
    slug: 'governance-charter',
    name: 'Data Governance Charter',
    tier: 'foundation',
    price: 49,
    source: 'chat',
    format: 'DOCX',
    pages: 14,
    fileReady: true,
    length: '13-page charter and a 1-page executive summary',
    summary:
      'A ready-to-edit charter that sets the purpose, scope, authority and decision rights of your data governance program.',
    audience: 'CDO office, program sponsor, governance lead',
    outline: [
      'Purpose and mission statement',
      'Scope: data domains, systems and business units in and out',
      'Guiding principles (ownership, accountability, transparency)',
      'Governance bodies: council, working groups, domain owners',
      'Decision rights and escalation path',
      'Success measures for year one',
      'Approval and sign-off page',
      'Roles with a RACI for core governance decisions',
      'Appendix: key terms and a launch readiness checklist',
    ],
    includes: ['Charter document (DOCX, 13 pages)', 'One-page charter summary for executives (DOCX)'],
    previews: ['Cover', 'Decision rights and RACI', 'Approval and sign-off'],
    files: [
      { name: 'Data-Governance-Charter.docx', label: 'Charter', size: '13 pages' },
      { name: 'Charter-Executive-Summary.docx', label: 'One-page executive summary', size: '1 page' },
    ],
  }),
  t({
    slug: 'operating-model-guide',
    name: 'Operating Model Guide',
    tier: 'foundation',
    price: 79,
    source: 'chat',
    format: 'DOCX + PPTX',
    pages: 12,
    fileReady: true,
    length: '12-page guide and a 14-slide leadership deck',
    summary:
      'Choose between centralized, federated and hybrid models, then document how your program actually runs week to week.',
    audience: 'Governance lead, data platform lead, domain owners',
    outline: [
      'Operating model options compared',
      'Choosing a model: a decision worksheet',
      'Org chart patterns with sample reporting lines',
      'Meeting cadence: council, steward forum, working sessions',
      'Intake and request workflow',
      'Funding and resourcing assumptions',
      'Ninety-day rollout plan',
      'Common failure modes and how to avoid them',
      'Leadership deck with speaker notes for the sponsor',
    ],
    includes: ['Guide (DOCX, 12 pages)', 'Leadership deck with speaker notes (PPTX, 14 slides)'],
    previews: ['Guide cover', 'Decision worksheet', 'Leadership deck: first ninety days'],
    files: [
      { name: 'Operating-Model-Guide.docx', label: 'Guide', size: '12 pages' },
      { name: 'Operating-Model-Leadership-Deck.pptx', label: 'Leadership deck with speaker notes', size: '14 slides' },
    ],
  }),
  t({
    slug: 'business-case-roi',
    name: 'Business Case and ROI Model',
    tier: 'foundation',
    price: 99,
    source: 'chat',
    format: 'XLSX + DOCX',
    pages: 9,
    fileReady: true,
    length: '7-sheet ROI model and a 9-page business case',
    summary:
      'A spreadsheet model and narrative that put a dollar value on better data, sized for a budget request.',
    audience: 'Program sponsor, finance partner, CDO',
    outline: [
      'Problem statement with cost-of-poor-data examples',
      'Benefit drivers: rework, regulatory risk, decision speed',
      'Three-year cost and benefit model (editable inputs)',
      'Payback period and NPV summary',
      'Risks and assumptions register',
      'Executive narrative template',
      'Sensitivity analysis: conservative, base and optimistic cases',
      'Stakeholder interview guide and reviewer checklist',
    ],
    includes: ['ROI model with worked example (XLSX, 7 sheets)', 'Business case narrative (DOCX, 9 pages)'],
    previews: ['Narrative cover', 'Executive summary', 'ROI model: summary sheet'],
    files: [
      { name: 'Business-Case-ROI-Model.xlsx', label: 'ROI model with sensitivity and risk sheets', size: '7 sheets' },
      { name: 'Business-Case-Narrative.docx', label: 'Business case narrative', size: '9 pages' },
    ],
  }),
  t({
    slug: 'roles-raci-matrix',
    name: 'Roles and RACI Matrix',
    tier: 'foundation',
    price: 39,
    source: 'invented',
    format: 'XLSX',
    pages: 6,
    summary:
      'Role descriptions for owners, stewards and custodians, plus a RACI across the governance activities that matter.',
    audience: 'Governance lead, HR partner, domain owners',
    outline: [
      'Role definitions: executive sponsor, data owner, data steward, custodian',
      'Time commitment guidance per role',
      'RACI across 30 governance activities',
      'Domain assignment sheet',
      'Role nomination email template',
    ],
    includes: ['RACI workbook (XLSX)'],
  }),
  t({
    slug: 'council-kit',
    name: 'Governance Council Kit',
    tier: 'foundation',
    price: 49,
    source: 'invented',
    format: 'DOCX + XLSX',
    pages: 10,
    summary:
      'Everything to run a governance council that decides things: agenda, minutes, decision log and an action tracker.',
    audience: 'Council chair, governance program manager',
    outline: [
      'Council terms of reference',
      'Standing agenda template',
      'Minutes template',
      'Decision log with rationale fields',
      'Action and escalation tracker',
    ],
    includes: ['Council documents (DOCX)', 'Decision and action log (XLSX)'],
  }),

  // ── Implementation ─────────────────────────────────────────────────────────
  t({
    slug: 'policy-bundle',
    name: 'Data Policy Bundle',
    tier: 'implementation',
    price: 129,
    source: 'chat',
    format: 'DOCX',
    pages: 33,
    fileReady: true,
    length: '7 documents, 33 pages in all',
    summary:
      'A set of core data policies and standards written to be adopted, with clear ownership, exceptions and review dates.',
    audience: 'Governance lead, compliance, legal reviewers',
    outline: [
      'Enterprise data governance policy',
      'Data quality standard',
      'Data access and classification policy',
      'Data retention and disposal standard',
      'Metadata standard',
      'Policy exception request form',
      'Policy review and attestation schedule',
    ],
    includes: ['Six policy and standard documents (DOCX, 31 pages)', 'Exception request form (DOCX, 2 pages)'],
    previews: ['Enterprise data governance policy', 'Classification handling rules', 'Exception request form'],
    files: [
      { name: 'DP-00-Policy-Framework-and-Review-Schedule.docx', label: 'Policy framework and review schedule', size: '7 pages' },
      { name: 'DP-01-Enterprise-Data-Governance-Policy.docx', label: 'Enterprise data governance policy', size: '5 pages' },
      { name: 'DP-02-Data-Quality-Standard.docx', label: 'Data quality standard', size: '5 pages' },
      { name: 'DP-03-Data-Access-and-Classification-Policy.docx', label: 'Data access and classification policy', size: '5 pages' },
      { name: 'DP-04-Data-Retention-and-Disposal-Standard.docx', label: 'Data retention and disposal standard', size: '5 pages' },
      { name: 'DP-05-Metadata-Standard.docx', label: 'Metadata standard', size: '4 pages' },
      { name: 'DP-06-Policy-Exception-Request-Form.docx', label: 'Policy exception request form', size: '2 pages' },
    ],
  }),
  t({
    slug: 'glossary-kit',
    name: 'Business Glossary Kit',
    tier: 'implementation',
    price: 149,
    source: 'chat',
    format: 'XLSX + DOCX',
    pages: 9,
    fileReady: true,
    length: '8-sheet workbook with 155 starter terms and a 9-page guide',
    summary:
      'Stand up a business glossary people trust: term structure, approval workflow and 155 starter terms for P&C insurance.',
    audience: 'Data stewards, glossary owner, business analysts',
    outline: [
      'Term attribute model (definition, owner, steward, status)',
      'Writing good definitions: rules and examples',
      'Term approval workflow',
      'Starter term list (155 P&C insurance terms)',
      'Import layout for common catalog tools',
      'Glossary adoption checklist',
      'Dashboard of terms by domain and status, with quality checks',
      'Choosing the first 50 terms and running definition workshops',
    ],
    includes: ['Glossary workbook with 155 starter terms (XLSX, 8 sheets)', 'Glossary guide (DOCX, 9 pages)'],
    previews: ['Guide cover', 'Writing good definitions', 'Term attribute model and approval workflow'],
    files: [
      { name: 'Business-Glossary-Workbook.xlsx', label: 'Glossary workbook with 155 starter terms, dashboard and import layout', size: '8 sheets' },
      { name: 'Business-Glossary-Guide.docx', label: 'Glossary guide', size: '9 pages' },
    ],
  }),
  t({
    slug: 'steward-playbook',
    name: 'Data Steward Playbook',
    tier: 'implementation',
    price: 89,
    source: 'invented',
    format: 'DOCX',
    pages: 24,
    summary:
      'A practical handbook for new stewards: what to do in week one, month one and every quarter.',
    audience: 'New and existing data stewards, steward managers',
    outline: [
      'What a steward is, and is not',
      'First 30 days checklist',
      'Recurring routines: weekly, monthly, quarterly',
      'Handling data issues end to end',
      'Working with IT and data engineering',
      'Steward self-assessment',
    ],
    includes: ['Playbook (DOCX)'],
  }),
  t({
    slug: 'dq-rules-catalog',
    name: 'Data Quality Rules Catalog',
    tier: 'implementation',
    price: 99,
    source: 'invented',
    format: 'XLSX',
    pages: 8,
    summary:
      'A structured catalog for documenting quality rules by dimension, with 80 sample rules for policy, claims and party data.',
    audience: 'Data quality analysts, stewards, data engineers',
    outline: [
      'Rule attribute model (dimension, threshold, owner, severity)',
      'Six quality dimensions explained',
      '80 sample rules across policy, claims and party data',
      'Threshold-setting worksheet',
      'Rule change log',
    ],
    includes: ['Rules catalog (XLSX)'],
  }),
  t({
    slug: 'metadata-onboarding-kit',
    name: 'Metadata Onboarding Kit',
    tier: 'implementation',
    price: 89,
    source: 'invented',
    format: 'XLSX + DOCX',
    pages: 14,
    summary:
      'Onboard data sources to your catalog in a repeatable way: intake form, minimum metadata and certification steps.',
    audience: 'Catalog administrator, stewards, platform team',
    outline: [
      'Source intake questionnaire',
      'Minimum viable metadata per asset type',
      'Certification criteria and badges',
      'Onboarding runbook',
      'Catalog coverage tracker',
    ],
    includes: ['Intake and tracker workbook (XLSX)', 'Onboarding runbook (DOCX)'],
  }),

  // ── Measurement ────────────────────────────────────────────────────────────
  t({
    slug: 'exec-powerbi-dashboard',
    name: 'Executive Governance Dashboard (Power BI)',
    tier: 'measurement',
    price: 199,
    source: 'chat',
    format: 'PBIX + XLSX',
    pages: 5,
    summary:
      'A Power BI report that shows leadership program health at a glance: adoption, quality trends, issues and maturity.',
    audience: 'CDO, governance council, program sponsor',
    outline: [
      'Program health overview page',
      'Data quality trend by domain',
      'Issue backlog and time to resolve',
      'Stewardship coverage and glossary growth',
      'Maturity score over time',
      'Sample data workbook and connection guide',
    ],
    includes: ['Power BI report (PBIX)', 'Sample data model (XLSX)', 'Setup guide (PDF)'],
  }),
  t({
    slug: 'kpi-library',
    name: 'Governance KPI Library',
    tier: 'measurement',
    price: 79,
    source: 'invented',
    format: 'XLSX',
    pages: 6,
    summary:
      '45 defined governance and quality KPIs with formulas, data sources, targets and who owns each one.',
    audience: 'Governance lead, data quality lead, analysts',
    outline: [
      'KPI definitions with formulas',
      'Leading versus lagging indicators',
      'Suggested targets by maturity level',
      'Data source mapping',
      'KPI ownership sheet',
    ],
    includes: ['KPI library (XLSX)'],
  }),
  t({
    slug: 'dq-scorecard',
    name: 'Data Quality Scorecard',
    tier: 'measurement',
    price: 99,
    source: 'invented',
    format: 'XLSX + PPTX',
    pages: 7,
    summary:
      'A domain-level quality scorecard with weighted dimensions and a monthly slide for the governance council.',
    audience: 'Data quality lead, domain owners, council',
    outline: [
      'Scorecard layout by domain and dimension',
      'Weighting and scoring method',
      'Red, amber and green thresholds',
      'Trend tracking sheet',
      'Monthly council slide',
    ],
    includes: ['Scorecard workbook (XLSX)', 'Council slide (PPTX)'],
  }),
  t({
    slug: 'maturity-workbook',
    name: 'Maturity Assessment Workbook',
    tier: 'measurement',
    price: 59,
    source: 'invented',
    format: 'XLSX',
    pages: 6,
    summary:
      'The full version of the free assessment as a workbook, so you can survey many teams and compare results over time.',
    audience: 'Governance lead, consultants, internal audit',
    outline: [
      'The 30 assessment questions with scoring guidance',
      'Multi-respondent survey sheet',
      'Results by dimension and business unit',
      'Radar and trend charts',
      'Target-state planning sheet',
    ],
    includes: ['Assessment workbook (XLSX)'],
  }),
  t({
    slug: 'issue-log',
    name: 'Data Issue and Exception Log',
    tier: 'measurement',
    price: 49,
    source: 'invented',
    format: 'XLSX',
    pages: 4,
    summary:
      'Track data issues from report to resolution, with severity, root cause and aging built in.',
    audience: 'Stewards, data quality analysts, support teams',
    outline: [
      'Issue intake fields',
      'Severity and priority matrix',
      'Root cause categories',
      'Aging and SLA tracking',
      'Monthly summary view',
    ],
    includes: ['Issue log (XLSX)'],
  }),

  // ── Advanced ───────────────────────────────────────────────────────────────
  t({
    slug: 'ai-governance-framework',
    name: 'AI Governance Framework',
    tier: 'advanced',
    price: 149,
    source: 'chat',
    format: 'DOCX + XLSX',
    pages: 32,
    summary:
      'Extend data governance to AI and machine learning: use-case intake, risk tiers, model inventory and review gates.',
    audience: 'CDO, AI or ML leads, risk and compliance',
    outline: [
      'AI governance principles and scope',
      'Use-case intake and risk tiering',
      'Model and AI system inventory',
      'Training data requirements and lineage',
      'Review gates from idea to production',
      'Monitoring and incident handling',
      'Mapping to common AI regulations and frameworks',
    ],
    includes: ['Framework (DOCX)', 'AI inventory and risk register (XLSX)'],
  }),
  t({
    slug: 'mdm-playbook',
    name: 'Master Data Management Playbook',
    tier: 'advanced',
    price: 149,
    source: 'invented',
    format: 'DOCX + XLSX',
    pages: 30,
    summary:
      'Plan and govern an MDM program domain by domain: match rules, survivorship, stewardship workflows and rollout.',
    audience: 'MDM lead, domain owners, data architects',
    outline: [
      'Choosing and sequencing master data domains',
      'Golden record attribute design',
      'Match and merge rule worksheet',
      'Survivorship rules',
      'Stewardship workflows and queues',
      'Rollout plan per domain',
    ],
    includes: ['Playbook (DOCX)', 'Match, merge and survivorship workbook (XLSX)'],
  }),
  t({
    slug: 'privacy-classification-kit',
    name: 'Data Privacy and Classification Kit',
    tier: 'advanced',
    price: 129,
    source: 'invented',
    format: 'DOCX + XLSX',
    pages: 20,
    summary:
      'Classify sensitive data consistently and tie each class to handling rules: masking, access and retention.',
    audience: 'Privacy office, security, governance lead',
    outline: [
      'Classification scheme (public to restricted)',
      'Sensitive data element catalog',
      'Handling rules per class',
      'Classification review workflow',
      'Privacy impact screening questions',
    ],
    includes: ['Classification standard (DOCX)', 'Sensitive data catalog (XLSX)'],
  }),
  t({
    slug: 'lineage-kit',
    name: 'Data Lineage Documentation Kit',
    tier: 'advanced',
    price: 99,
    source: 'invented',
    format: 'XLSX + DOCX',
    pages: 12,
    summary:
      'Document lineage for critical data elements, even before you buy a lineage tool, and keep it current.',
    audience: 'Data architects, stewards, regulatory reporting teams',
    outline: [
      'Critical data element selection',
      'Lineage capture template (source to report)',
      'Transformation documentation standard',
      'Lineage review cadence',
      'Tool readiness checklist',
    ],
    includes: ['Lineage workbook (XLSX)', 'Lineage standard (DOCX)'],
  }),
  t({
    slug: 'regulatory-mapping-pack',
    name: 'Regulatory Mapping Pack',
    tier: 'advanced',
    price: 149,
    source: 'invented',
    format: 'XLSX',
    pages: 9,
    summary:
      'Map regulatory data requirements to your data elements, owners and controls, starting with insurance and financial services.',
    audience: 'Compliance, regulatory reporting, governance lead',
    outline: [
      'Requirement inventory layout',
      'Requirement to data element mapping',
      'Control and evidence register',
      'Gap tracking',
      'Starter mappings for insurance and financial services',
    ],
    includes: ['Mapping workbook (XLSX)'],
  }),
];

// Bundles. Prices are DRAFTS (about 30% off each tier, about half off everything).
export const BUNDLES = [
  {
    slug: 'foundation-bundle',
    name: 'Foundation Bundle',
    tier: 'foundation',
    price: 219,
    stripePriceId: null,
    summary: 'Every Foundation template to launch a governance program.',
  },
  {
    slug: 'implementation-bundle',
    name: 'Implementation Bundle',
    tier: 'implementation',
    price: 389,
    stripePriceId: null,
    summary: 'Every Implementation template to make governance part of daily work.',
  },
  {
    slug: 'measurement-bundle',
    name: 'Measurement Bundle',
    tier: 'measurement',
    price: 339,
    stripePriceId: null,
    summary: 'Every Measurement template to show results to leadership.',
  },
  {
    slug: 'advanced-bundle',
    name: 'Advanced Bundle',
    tier: 'advanced',
    price: 469,
    stripePriceId: null,
    summary: 'Every Advanced template for AI, MDM, privacy, lineage and regulation.',
  },
  {
    slug: 'complete-suite',
    name: 'Complete Suite',
    tier: null,
    price: 999,
    stripePriceId: null,
    summary: 'All 20 templates across the four tiers.',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
export const tierById = (id) => TIERS.find((x) => x.id === id);
export const templateBySlug = (slug) => TEMPLATES.find((x) => x.slug === slug);
export const bundleBySlug = (slug) => BUNDLES.find((x) => x.slug === slug);
export const templatesInTier = (tierId) => TEMPLATES.filter((x) => x.tier === tierId);
export const bundleForTier = (tierId) => BUNDLES.find((b) => b.tier === tierId);

export function bundleTemplates(bundle) {
  return bundle.tier ? templatesInTier(bundle.tier) : TEMPLATES;
}

export function bundleListPrice(bundle) {
  return bundleTemplates(bundle).reduce((sum, x) => sum + x.price, 0);
}

export function formatPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 }).format(n);
}

// A single lookup for checkout: kind is 'template' or 'bundle'.
export function productBySlug(slug) {
  const tpl = templateBySlug(slug);
  if (tpl) return { kind: 'template', item: tpl };
  const b = bundleBySlug(slug);
  if (b) return { kind: 'bundle', item: b };
  return null;
}

// ── Selling ──────────────────────────────────────────────────────────────────
// A template can be bought once its real files exist (fileReady). A bundle can
// be bought only when every template in it is ready, so nobody pays for files
// that do not exist yet. Everything else shows "Coming soon".
export function isBuyable(product) {
  if (!product) return false;
  if (product.kind === 'template') return Boolean(product.item.fileReady && product.item.files?.length);
  return bundleTemplates(product.item).every((x) => x.fileReady && x.files?.length);
}

// The files a buyer of this product receives. key is the path in private storage.
export function deliverableFiles(product) {
  const templates = product.kind === 'template' ? [product.item] : bundleTemplates(product.item);
  return templates.flatMap((tpl) =>
    (tpl.files || []).map((f) => ({ key: `${tpl.slug}/${f.name}`, name: f.name, label: f.label, template: tpl.name })),
  );
}
