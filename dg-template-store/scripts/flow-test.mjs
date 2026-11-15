// Clicks through the main journeys in a simulated browser (jsdom).
// Run with: npm run test:flows
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};

const { mount, act } = await import('../.ssr-test/entry-test.js');
const $ = (sel) => document.querySelector(sel);
const text = () => document.body.textContent;
const byText = (tag, t) => [...document.querySelectorAll(tag)].find((el) => el.textContent.trim().startsWith(t));
const click = (el) => act(() => { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0 })); });
let failures = 0;
const check = (name, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) failures++; };

// 1. Assessment end to end
let root = mount($('#root'), '/assessment');
click(byText('button', 'Start the assessment'));
const pattern = [2, 3, 1, 2, 2, 3];
for (let step = 0; step < 6; step++) {
  for (let q = 0; q < 5; q++) click(document.getElementById(`q${step * 5 + q}-${pattern[step]}`));
  const next = byText('button', step === 5 ? 'See my results' : 'Next');
  check(`section ${step + 1}: continue button enabled after 5 answers`, next && !next.disabled);
  click(next);
}
check('results page shows a level', /Level \d: /.test(text()));
check('results page shows radar chart', !!$('svg.radar polygon.radar-shape'));
check('results page has "Download report (PDF)" button', !!byText('button', 'Download report (PDF)'));
const getBundle = byText('a', 'See the bundle (coming soon)');
check('results link to the recommended bundle, marked coming soon', !!getBundle);
check('results offer the templates from that bundle that can be bought now', !!byText('h2', 'Available now from this bundle') && !!byText('a', 'Buy'));
click(getBundle);
check('bundle link opens a bundle page', !!byText('h2', 'Included templates') && !text().includes('Page not found'));
check('unfinished bundle page lists templates to buy now', !!byText('p', 'Available now on their own') && !!byText('a', 'Buy '));
check('unfinished bundle shows "Coming soon" instead of a buy button', !!byText('span', 'Coming soon') && !byText('a', 'Get template bundle'));
act(() => root.unmount());

// 2. Catalog filter and Preview
document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/templates');
check('catalog lists 20 templates plus the 5 available now', document.querySelectorAll('.tcard').length === 25 && !!byText('h2', 'Available now'));
check('catalog cards for ready templates have Buy, others say Coming soon', document.querySelectorAll('.tcard a.btn[href^="/checkout/"]').length === 10 && document.querySelectorAll('.soon-tag').length === 15);
click(byText('a', 'Measurement'));
check('tier filter narrows to 5', document.querySelectorAll('.tcard').length === 5);
click(byText('a', 'Preview'));
check('Preview opens a preview page', text().includes('PREVIEW') && text().includes('Contents'));
click(byText('a', 'Back to details'));
check('Back to details opens the detail page', !!byText('h2', 'What is inside'));
check('template without files shows "Coming soon", not Buy', !!byText('span', 'Coming soon') && !byText('a', 'Buy'));
act(() => root.unmount());

// 3. A launch template with real files
document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/templates/governance-charter');
check('ready template shows real length, not an estimate', text().includes('13-page charter') && !text().includes('(estimate)'));
check('ready template lists its files', text().includes('Data-Governance-Charter'.replace(/-/g, ' ')) || text().includes('(DOCX, 13 pages)'));
click(byText('a', 'Preview pages'));
check('ready template preview shows 3 real page images', document.querySelectorAll('.real-page img').length === 3);
click(byText('a', 'Buy'));
check('Buy on a ready template opens checkout with a pay button', text().includes('Your order') && !!byText('button', 'Pay $49 with Stripe'));
act(() => root.unmount());

// 4. Checkout calls the server and goes to Stripe; cancel and thank-you pages
const calls = [];
let assigned = null;
window.__dgtsNavigate = (u) => { assigned = u; };
globalThis.fetch = async (url, opts = {}) => {
  calls.push({ url, opts });
  if (url === '/api/checkout') return new Response(JSON.stringify({ url: 'https://checkout.stripe.com/c/pay/cs_test_1' }), { status: 200 });
  if (url.startsWith('/api/order')) {
    return new Response(JSON.stringify({
      status: 'paid', product: { name: 'Data Governance Charter', kind: 'template' }, email: 'b••••@example.test', emailDelivery: true,
      links: [{ label: 'Charter', name: 'Data-Governance-Charter.docx', url: 'https://x.test/api/download?t=a' }, { label: 'One-page executive summary', name: 'Charter-Executive-Summary.docx', url: 'https://x.test/api/download?t=b' }],
      expiresAt: new Date(Date.now() + 72 * 3600e3).toISOString(), freshLinksDays: 30,
    }), { status: 200 });
  }
  return new Response('{}', { status: 404 });
};
const flush = () => act(async () => { for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0)); });
document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/checkout/governance-charter');
click(byText('button', 'Pay $49 with Stripe'));
await flush();
const sent = calls.find((c) => c.url === '/api/checkout');
check('Pay sends only the product slug to the server', sent && sent.opts.body === JSON.stringify({ slug: 'governance-charter' }));
check('Pay goes to the Stripe payment page', assigned === 'https://checkout.stripe.com/c/pay/cs_test_1');
act(() => root.unmount());

document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/checkout/governance-charter?cancelled=1');
check('cancelled checkout says nothing was charged', text().includes('Payment cancelled. You have not been charged.'));
act(() => root.unmount());

document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/checkout/foundation-bundle');
check('checkout for an unfinished bundle shows Coming soon and no pay button', text().includes('Coming soon') && !byText('button', 'Pay'));
act(() => root.unmount());

document.body.innerHTML = '<div id="root"></div>';
root = mount($('#root'), '/thanks?session_id=cs_test_abc1234567');
await flush();
check('thank-you page lists a download button per file', document.querySelectorAll('.download-list a').length === 2 && text().includes('Thank you, your files are ready'));
check('thank-you page says links were emailed', text().includes('We also emailed them to b••••@example.test'));
act(() => root.unmount());

console.log(failures ? `\n${failures} failure(s)` : '\nAll flows pass.');
process.exit(failures ? 1 : 0);
