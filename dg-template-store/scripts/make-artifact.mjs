// Turns the single-file build into a page body for a Claude Artifact preview
// (the Artifact host supplies its own <html>/<head>/<body> wrapper).
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist-artifact/index.html', 'utf8');
// The inlined JavaScript can itself contain strings like "<head>" or "<body>",
// so find the one real <script> element first and read the rest around it.
const script = html.match(/<script[\s\S]*?<\/script>/);
const before = html.slice(0, script.index);
const after = html.slice(script.index + script[0].length);
const scripts = script[0];
const styles = [...after.matchAll(/<style[\s\S]*?<\/style>/g)].map((m) => m[0]).join('\n');
const body = after.match(/<body>([\s\S]*?)<\/body>/)[1];
const fonts = [...before.matchAll(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g)].map((m) => m[0]).join('\n');

const out = `<title>DG Template Suite</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
${styles}
${body.trim()}
${scripts}
`;
writeFileSync('dist-artifact/dg-template-suite.html', out);
console.log(`Wrote dist-artifact/dg-template-suite.html (${(out.length / 1024).toFixed(0)} KB)`);
