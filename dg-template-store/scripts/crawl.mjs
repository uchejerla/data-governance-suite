// Link check: renders every reachable route with the real app and router,
// follows every <a href>, and fails if any internal link lands on "Page not found"
// or any link is empty or "#". Run with: npm run check:links
import { render } from '../.ssr/entry-server.js';

const seeds = ['/'];
// The assessment's "See my results" button builds this link; seed one per level.
for (const v of [1, 2, 3, 4, 5]) seeds.push(`/assessment/results?a=${String(v).repeat(30)}`);
seeds.push('/assessment/results?a=343212433423211243341234554321'); // mixed answers

const seen = new Map(); // url -> { notFound, from }
const queue = seeds.map((u) => ({ url: u, from: '(seed)' }));
const problems = [];
const external = new Set();

while (queue.length) {
  const { url, from } = queue.shift();
  if (seen.has(url)) continue;
  let html;
  try {
    html = render(url);
  } catch (e) {
    problems.push(`${url} (linked from ${from}) threw: ${e.message}`);
    seen.set(url, { notFound: true, from });
    continue;
  }
  const notFound = html.includes('data-not-found="true"');
  seen.set(url, { notFound, from });
  if (notFound) { problems.push(`DEAD: ${url} (linked from ${from})`); continue; }

  for (const m of html.matchAll(/<a\b[^>]*?href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!href || href === '#') { problems.push(`EMPTY LINK on ${url}`); continue; }
    if (/^(https?|mailto):/.test(href)) { external.add(href); continue; }
    if (href.startsWith('/')) {
      const clean = href.split('#')[0];
      if (!seen.has(clean)) queue.push({ url: clean, from: url });
    } else {
      problems.push(`RELATIVE OR ODD LINK "${href}" on ${url}`);
    }
  }
}

const pages = [...seen.keys()].sort();
console.log(`Pages rendered: ${pages.length}`);
for (const p of pages) console.log(`  ${seen.get(p).notFound ? 'DEAD' : 'ok  '} ${p}`);
if (external.size) console.log(`External links (not followed): ${[...external].join(', ')}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log('\nZero dead links.');
