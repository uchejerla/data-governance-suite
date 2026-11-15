// ─────────────────────────────────────────────────────────────────────────────
// FREE MATURITY ASSESSMENT: 6 dimensions x 5 questions = 30 questions.
// The dimension names, question wording, level names and recommendations were
// DRAFTED for this rebuild (the June originals were not reachable). Uday to review.
// ─────────────────────────────────────────────────────────────────────────────

export const SCALE = [
  { value: 1, label: 'Not in place', hint: 'Nothing exists today.' },
  { value: 2, label: 'Ad hoc', hint: 'Happens in pockets, depends on individuals.' },
  { value: 3, label: 'Defined', hint: 'Written down and agreed, adoption is uneven.' },
  { value: 4, label: 'Managed', hint: 'Followed across teams and tracked.' },
  { value: 5, label: 'Optimized', hint: 'Measured, reviewed and improved on a cycle.' },
];

export const LEVELS = [
  {
    level: 1,
    name: 'Initial',
    min: 1.0,
    summary:
      'Governance happens informally, if at all. The fastest win is a charter, named owners and a business case leadership will fund.',
    bundle: 'foundation-bundle',
  },
  {
    level: 2,
    name: 'Developing',
    min: 1.8,
    summary:
      'Some pieces exist, mostly in individual teams. Formalize the operating model and roles so the work stops depending on a few people.',
    bundle: 'foundation-bundle',
  },
  {
    level: 3,
    name: 'Defined',
    min: 2.6,
    summary:
      'The program is defined on paper. Now make it routine: adopt policies, stand up the glossary and give stewards a playbook.',
    bundle: 'implementation-bundle',
  },
  {
    level: 4,
    name: 'Managed',
    min: 3.4,
    summary:
      'Governance is running across teams. Measure it: scorecards and an executive dashboard turn activity into evidence.',
    bundle: 'measurement-bundle',
  },
  {
    level: 5,
    name: 'Optimized',
    min: 4.2,
    summary:
      'A mature, measured program. Extend it to AI, master data, privacy and regulatory mapping.',
    bundle: 'advanced-bundle',
  },
];

export const DIMENSIONS = [
  {
    id: 'strategy',
    name: 'Strategy and Sponsorship',
    short: 'Strategy',
    recommends: ['governance-charter', 'business-case-roi', 'operating-model-guide'],
    questions: [
      'Data governance has a named executive sponsor who actively supports it.',
      'There is a written charter or mandate that sets the scope and authority of the program.',
      'Governance goals are tied to business outcomes leadership already cares about.',
      'The program has a funded budget or committed headcount.',
      'Governance priorities are reviewed with leadership at least twice a year.',
    ],
  },
  {
    id: 'roles',
    name: 'Roles and Stewardship',
    short: 'Stewardship',
    recommends: ['roles-raci-matrix', 'steward-playbook', 'council-kit'],
    questions: [
      'Data owners are named for each major data domain.',
      'Data stewards have written responsibilities and time set aside for them.',
      'A governance council or forum meets regularly and makes decisions.',
      'Decision rights and escalation paths are documented and used.',
      'New stewards are onboarded with training or a playbook.',
    ],
  },
  {
    id: 'policy',
    name: 'Policies and Standards',
    short: 'Policies',
    recommends: ['policy-bundle', 'privacy-classification-kit', 'regulatory-mapping-pack'],
    questions: [
      'Core data policies (governance, quality, access) are written and approved.',
      'Policies have owners and a scheduled review date.',
      'There is a process for requesting and approving policy exceptions.',
      'Sensitive data is classified using a consistent scheme.',
      'Teams are aware of the policies that apply to their work.',
    ],
  },
  {
    id: 'quality',
    name: 'Data Quality',
    short: 'Quality',
    recommends: ['dq-rules-catalog', 'dq-scorecard', 'issue-log'],
    questions: [
      'Critical data elements are identified for key business processes.',
      'Data quality rules are documented with thresholds and owners.',
      'Quality is measured on a regular schedule, not only when something breaks.',
      'Data issues are logged and tracked to resolution with root causes.',
      'Quality results are reported to the people who own the data.',
    ],
  },
  {
    id: 'metadata',
    name: 'Metadata and Lineage',
    short: 'Metadata',
    recommends: ['glossary-kit', 'metadata-onboarding-kit', 'lineage-kit'],
    questions: [
      'A business glossary exists with agreed definitions for key terms.',
      'Glossary terms have owners and an approval workflow.',
      'Key data sources are documented in a catalog or inventory.',
      'Lineage is documented for critical reports and regulatory data.',
      'People can find trusted data without asking someone directly.',
    ],
  },
  {
    id: 'measurement',
    name: 'Measurement and Value',
    short: 'Measurement',
    recommends: ['kpi-library', 'exec-powerbi-dashboard', 'maturity-workbook'],
    questions: [
      'Governance has defined KPIs with targets.',
      'Program results are shared with leadership on a regular cadence.',
      'Benefits of governance (time saved, risk reduced) are quantified.',
      'Maturity is reassessed at least once a year.',
      'Lessons from measurement feed back into the program plan.',
    ],
  },
];

export const QUESTION_COUNT = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);

// Flat list in display order, each with a stable index used in the results link.
export const QUESTIONS = DIMENSIONS.flatMap((d, di) =>
  d.questions.map((text, qi) => ({ dimension: d.id, dimensionIndex: di, text, index: di * 5 + qi })),
);
