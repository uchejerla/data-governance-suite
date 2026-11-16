// Payment and delivery tests. Stripe, storage and email are replaced with fakes,
// so nothing here needs a Stripe account, network access or real keys.
// Webhook signatures are made and checked with Stripe's own library code.
// Run with: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';

const SECRET = 'whsec_test_secret_for_unit_tests';
Object.assign(process.env, {
  STRIPE_SECRET_KEY: 'sk_test_fake',
  STRIPE_WEBHOOK_SECRET: SECRET,
  DOWNLOAD_LINK_SECRET: 'unit-test-download-secret-0123456789abcdef',
  SITE_URL: 'https://shop.example.test',
  DOWNLOAD_LINK_HOURS: '72',
  RESEND_API_KEY: '',
  EMAIL_FROM: '',
});
delete process.env.LOCAL_FILES_DIR;

const { setStripeForTests } = await import('../server/stripeClient.js');
const { setStorageForTests, AlreadyExists } = await import('../server/storage.js');
const { setEmailSenderForTests } = await import('../server/email.js');
const { makeToken, readToken } = await import('../server/tokens.js');
const { sellable } = await import('../server/products.js');
const { TEMPLATES } = await import('../src/data/catalog.js');
const checkout = await import('../api/checkout.js');
const webhook = await import('../api/stripe-webhook.js');
const order = await import('../api/order.js');
const download = await import('../api/download.js');

// ── Fakes ────────────────────────────────────────────────────────────────────
let created; // params passed to checkout.sessions.create
let sessions; // id -> session returned by retrieve
let orders; // id -> stored order record
let emails; // messages "sent"
const fileBytes = (key) => Buffer.from(`contents of ${key}`);

beforeEach(() => {
  created = [];
  sessions = new Map();
  orders = new Map();
  emails = [];
  setStripeForTests({
    checkout: {
      sessions: {
        async create(params) {
          created.push(params);
          return { id: 'cs_test_created123456', url: 'https://checkout.stripe.com/c/pay/cs_test_created123456' };
        },
        async retrieve(id) {
          if (!sessions.has(id)) throw Object.assign(new Error('No such session'), { statusCode: 404, code: 'resource_missing' });
          return sessions.get(id);
        },
      },
    },
  });
  setStorageForTests({
    async readFile(key) {
      const known = TEMPLATES.some((t) => t.fileReady && t.files?.some((f) => `${t.slug}/${f.name}` === key));
      return known ? { stream: fileBytes(key), size: fileBytes(key).length } : null;
    },
    async createOrder(id, record) {
      if (orders.has(id)) throw new AlreadyExists(id);
      orders.set(id, record);
    },
    async readOrder(id) {
      return orders.get(id) || null;
    },
  });
  setEmailSenderForTests(async (msg) => { emails.push(msg); return 'sent'; });
});

function paidSession(slug, overrides = {}) {
  const p = sellable(slug);
  return {
    id: `cs_test_${slug.replace(/-/g, '')}0001`,
    object: 'checkout.session',
    mode: 'payment',
    status: 'complete',
    payment_status: 'paid',
    amount_total: p.amountCents,
    currency: 'usd',
    created: Math.floor(Date.now() / 1000),
    metadata: { product_slug: slug },
    customer_details: { email: 'buyer@example.test' },
    ...overrides,
  };
}

function signedEvent(type, object, secret = SECRET) {
  const payload = JSON.stringify({ id: `evt_${Math.random().toString(36).slice(2)}`, object: 'event', type, data: { object } });
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  return new Request('https://shop.example.test/api/stripe-webhook', {
    method: 'POST',
    headers: { 'stripe-signature': header, 'content-type': 'application/json' },
    body: payload,
  });
}

const post = (body) => new Request('https://shop.example.test/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const tokenFromUrl = (url) => new URL(url).searchParams.get('t');

// ── Checkout session creation ────────────────────────────────────────────────
test('checkout: creates a Stripe session with the catalog price, not the browser\'s', async () => {
  const res = await checkout.POST(post({ slug: 'governance-charter', price: 1, amount: 1 }));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).url, 'https://checkout.stripe.com/c/pay/cs_test_created123456');
  const p = created[0];
  assert.equal(p.mode, 'payment');
  assert.equal(p.line_items.length, 1);
  assert.equal(p.line_items[0].price_data.unit_amount, 4900);
  assert.equal(p.line_items[0].price_data.currency, 'usd');
  assert.equal(p.line_items[0].price_data.product_data.name, 'Data Governance Charter');
  assert.equal(p.metadata.product_slug, 'governance-charter');
  assert.equal(p.success_url, 'https://shop.example.test/thanks?session_id={CHECKOUT_SESSION_ID}');
  assert.equal(p.cancel_url, 'https://shop.example.test/checkout/governance-charter?cancelled=1');
});

test('checkout: every launch template can be bought at its listed price', async () => {
  const expected = { 'governance-charter': 4900, 'operating-model-guide': 7900, 'business-case-roi': 9900, 'policy-bundle': 12900, 'glossary-kit': 14900 };
  for (const [slug, cents] of Object.entries(expected)) {
    const res = await checkout.POST(post({ slug }));
    assert.equal(res.status, 200, slug);
    assert.equal(created.at(-1).line_items[0].price_data.unit_amount, cents, slug);
  }
});

test('checkout: coming-soon templates and unfinished bundles are refused', async () => {
  for (const slug of ['exec-powerbi-dashboard', 'measurement-bundle', 'complete-suite', 'no-such-thing', '../etc/passwd']) {
    const res = await checkout.POST(post({ slug }));
    assert.equal(res.status, 404, slug);
  }
  assert.equal(created.length, 0);
});

test('checkout: bad JSON is refused and missing keys give 503', async () => {
  const bad = new Request('https://x.test/api/checkout', { method: 'POST', body: 'not json' });
  assert.equal((await checkout.POST(bad)).status, 400);
  const saved = process.env.STRIPE_SECRET_KEY;
  process.env.STRIPE_SECRET_KEY = '';
  assert.equal((await checkout.POST(post({ slug: 'governance-charter' }))).status, 503);
  process.env.STRIPE_SECRET_KEY = saved;
});

test('checkout: uses a Stripe Price ID when one is set in the catalog', async () => {
  const tpl = TEMPLATES.find((t) => t.slug === 'glossary-kit');
  tpl.stripePriceId = 'price_test_123';
  try {
    await checkout.POST(post({ slug: 'glossary-kit' }));
    assert.deepEqual(created[0].line_items[0], { price: 'price_test_123', quantity: 1 });
  } finally {
    tpl.stripePriceId = null;
  }
});

// ── Webhook ──────────────────────────────────────────────────────────────────
test('webhook: a correctly signed paid event records the order and emails the links once', async () => {
  const s = paidSession('policy-bundle');
  const res = await webhook.POST(signedEvent('checkout.session.completed', s));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).result, 'fulfilled');
  const rec = orders.get(s.id);
  assert.equal(rec.product, 'policy-bundle');
  assert.equal(rec.files.length, 7);
  assert.equal(rec.email, 'buyer@example.test');
  assert.equal(emails.length, 1);
  assert.equal(emails[0].to, 'buyer@example.test');
  assert.equal((emails[0].text.match(/\/api\/download\?t=/g) || []).length, 7);
  assert.ok(emails[0].text.includes('/thanks?session_id='));
});

test('webhook: the same event delivered twice is recorded and emailed only once', async () => {
  const s = paidSession('governance-charter');
  await webhook.POST(signedEvent('checkout.session.completed', s));
  const again = await webhook.POST(signedEvent('checkout.session.completed', s));
  assert.equal(again.status, 200);
  assert.equal((await again.json()).result, 'duplicate');
  assert.equal(orders.size, 1);
  assert.equal(emails.length, 1);
});

test('webhook: wrong signature, missing signature and edited body are all refused', async () => {
  const s = paidSession('governance-charter');
  assert.equal((await webhook.POST(signedEvent('checkout.session.completed', s, 'whsec_someone_else'))).status, 400);

  const noSig = new Request('https://x.test/api/stripe-webhook', { method: 'POST', body: '{}' });
  assert.equal((await webhook.POST(noSig)).status, 400);

  const good = signedEvent('checkout.session.completed', s);
  const tampered = new Request(good.url, {
    method: 'POST',
    headers: { 'stripe-signature': good.headers.get('stripe-signature') },
    body: (await good.text()).replace('governance-charter', 'glossary-kit'),
  });
  assert.equal((await webhook.POST(tampered)).status, 400);
  assert.equal(orders.size, 0);
  assert.equal(emails.length, 0);
});

test('webhook: unpaid, failed and expired sessions deliver nothing', async () => {
  const pending = paidSession('glossary-kit', { payment_status: 'unpaid' });
  assert.equal((await (await webhook.POST(signedEvent('checkout.session.completed', pending))).json()).result, 'awaiting payment');
  assert.equal((await webhook.POST(signedEvent('checkout.session.async_payment_failed', pending))).status, 200);
  assert.equal((await webhook.POST(signedEvent('checkout.session.expired', paidSession('glossary-kit', { status: 'expired', payment_status: 'unpaid' })))).status, 200);
  assert.equal(orders.size, 0);
  assert.equal(emails.length, 0);
});

test('webhook: a delayed payment that clears is delivered', async () => {
  const s = paidSession('business-case-roi');
  const res = await webhook.POST(signedEvent('checkout.session.async_payment_succeeded', s));
  assert.equal((await res.json()).result, 'fulfilled');
  assert.equal(orders.get(s.id).files.length, 2);
});

test('webhook: a paid amount that does not match the catalog delivers nothing', async () => {
  const s = paidSession('glossary-kit', { amount_total: 100 });
  const res = await webhook.POST(signedEvent('checkout.session.completed', s));
  assert.equal((await res.json()).result, 'ignored');
  assert.equal(orders.size, 0);
});

test('webhook: a storage failure returns 500 so Stripe retries, and the retry delivers', async () => {
  const s = paidSession('governance-charter');
  setStorageForTests({ async createOrder() { throw new Error('blob store down'); } });
  assert.equal((await webhook.POST(signedEvent('checkout.session.completed', s))).status, 500);
  assert.equal(emails.length, 0);
  setStorageForTests({ async createOrder(id, r) { orders.set(id, r); } });
  assert.equal((await (await webhook.POST(signedEvent('checkout.session.completed', s))).json()).result, 'fulfilled');
  assert.equal(emails.length, 1);
});

test('webhook: email failure does not fail the order', async () => {
  setEmailSenderForTests(async () => 'failed');
  const s = paidSession('governance-charter');
  const res = await webhook.POST(signedEvent('checkout.session.completed', s));
  assert.equal(res.status, 200);
  assert.ok(orders.has(s.id));
});

// ── Order page and links ─────────────────────────────────────────────────────
const getOrder = (id) => order.GET(new Request(`https://shop.example.test/api/order?session_id=${id}`));

test('order page: a paid order gets links for exactly the files bought', async () => {
  const s = paidSession('operating-model-guide');
  sessions.set(s.id, s);
  const data = await (await getOrder(s.id)).json();
  assert.equal(data.status, 'paid');
  assert.deepEqual(data.links.map((l) => l.name).sort(), ['Operating-Model-Guide.docx', 'Operating-Model-Leadership-Deck.pptx']);
  for (const l of data.links) {
    const t = readToken(tokenFromUrl(l.url), process.env.DOWNLOAD_LINK_SECRET);
    assert.ok(t.ok);
    assert.equal(t.order, s.id);
    assert.ok(t.key.startsWith('operating-model-guide/'));
  }
  assert.equal(data.email, 'b••••@example.test');
});

test('order page: unpaid, unknown, malformed and old orders get no links', async () => {
  const unpaid = paidSession('glossary-kit', { payment_status: 'unpaid', status: 'open' });
  sessions.set(unpaid.id, unpaid);
  assert.deepEqual(await (await getOrder(unpaid.id)).json(), { status: 'unpaid' });

  const processing = paidSession('glossary-kit', { id: 'cs_test_processing0001', payment_status: 'unpaid', status: 'complete' });
  sessions.set(processing.id, processing);
  assert.deepEqual(await (await getOrder(processing.id)).json(), { status: 'processing' });

  assert.equal((await getOrder('cs_test_doesnotexist01')).status, 404);
  assert.equal((await getOrder('not-a-session')).status, 400);

  const old = paidSession('glossary-kit', { id: 'cs_test_oldorder00001', created: Math.floor(Date.now() / 1000) - 40 * 86400 });
  sessions.set(old.id, old);
  const data = await (await getOrder(old.id)).json();
  assert.equal(data.status, 'too_old');
  assert.equal(data.links, undefined);
});

// ── Downloads ────────────────────────────────────────────────────────────────
const dl = (t) => download.GET(new Request(`https://shop.example.test/api/download?t=${encodeURIComponent(t)}`));
const secret = () => process.env.DOWNLOAD_LINK_SECRET;

test('download: a valid link returns the file as an attachment', async () => {
  const key = 'governance-charter/Data-Governance-Charter.docx';
  const res = await dl(makeToken({ order: 'cs_test_x', key, expiresAt: Date.now() + 60_000 }, secret()));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-disposition'), 'attachment; filename="Data-Governance-Charter.docx"');
  assert.match(res.headers.get('content-type'), /wordprocessingml/);
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  assert.equal(Buffer.from(await res.arrayBuffer()).toString(), `contents of ${key}`);
});

test('download: an expired link is refused and points to fresh links', async () => {
  const t = makeToken({ order: 'cs_test_abc', key: 'governance-charter/Data-Governance-Charter.docx', expiresAt: Date.now() - 1000 }, secret());
  const res = await dl(t);
  assert.equal(res.status, 410);
  assert.ok((await res.text()).includes('/thanks?session_id=cs_test_abc'));
});

test('download: a link cannot be edited to fetch a file that was not bought', async () => {
  const good = makeToken({ order: 'cs_test_x', key: 'governance-charter/Data-Governance-Charter.docx', expiresAt: Date.now() + 60_000 }, secret());
  const [, mac] = good.split('.');
  const swapped = Buffer.from(JSON.stringify({ o: 'cs_test_x', k: 'glossary-kit/Business-Glossary-Workbook.xlsx', e: Math.floor(Date.now() / 1000) + 60 })).toString('base64url');
  assert.equal((await dl(`${swapped}.${mac}`)).status, 403);
  const longer = Buffer.from(JSON.stringify({ o: 'cs_test_x', k: 'governance-charter/Data-Governance-Charter.docx', e: Math.floor(Date.now() / 1000) + 9e8 })).toString('base64url');
  assert.equal((await dl(`${longer}.${mac}`)).status, 403);
  assert.equal((await dl(makeToken({ order: 'x', key: 'governance-charter/Data-Governance-Charter.docx', expiresAt: Date.now() + 60_000 }, 'another-secret'))).status, 403);
  assert.equal((await dl('')).status, 403);
  assert.equal((await dl('garbage.token')).status, 403);
});

test('download: files are not in the public folder or the static build', async () => {
  const { existsSync, readdirSync } = await import('node:fs');
  const publicFiles = existsSync('public') ? readdirSync('public', { recursive: true }) : [];
  assert.ok(!publicFiles.some((f) => /\.(docx|xlsx|pptx)$/i.test(String(f))), 'paid files found in public/');
  if (existsSync('dist')) {
    const built = readdirSync('dist', { recursive: true });
    assert.ok(!built.some((f) => /\.(docx|xlsx|pptx)$/i.test(String(f))), 'paid files found in dist/');
  }
});

// ── Bundles ──────────────────────────────────────────────────────────────────
test('bundles: a bundle sells only when all its templates are ready, and delivers all their files', async () => {
  for (const slug of ['foundation-bundle', 'implementation-bundle', 'advanced-bundle']) assert.ok(sellable(slug), slug);
  assert.equal(sellable('measurement-bundle'), null);
  const measurement = TEMPLATES.filter((t) => t.tier === 'measurement');
  const saved = measurement.map((t) => ({ t, fileReady: t.fileReady, files: t.files }));
  for (const t of measurement) if (!t.fileReady) Object.assign(t, { fileReady: true, files: [{ name: `${t.slug}.docx`, label: t.name, size: '1 page' }] });
  try {
    const b = sellable('measurement-bundle');
    assert.ok(b);
    assert.equal(b.kind, 'bundle');
    assert.equal(b.amountCents, 33900);
    const expectedFiles = measurement.reduce((n, t) => n + t.files.length, 0);
    assert.equal(b.files.length, expectedFiles);

    const s = paidSession('measurement-bundle');
    sessions.set(s.id, s);
    await webhook.POST(signedEvent('checkout.session.completed', s));
    assert.equal(orders.get(s.id).files.length, expectedFiles);
    const data = await (await getOrder(s.id)).json();
    assert.equal(data.links.length, expectedFiles);
    const slugs = new Set(data.links.map((l) => readToken(tokenFromUrl(l.url), secret()).key.split('/')[0]));
    assert.deepEqual([...slugs].sort(), measurement.map((t) => t.slug).sort());
  } finally {
    for (const { t, fileReady, files } of saved) Object.assign(t, { fileReady, files });
  }
});
