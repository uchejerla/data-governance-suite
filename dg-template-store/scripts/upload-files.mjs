// Uploads the paid template files in files/ to your PRIVATE Vercel Blob store.
// Run once after creating the store, and again whenever a file changes:
//   BLOB_READ_WRITE_TOKEN=... node scripts/upload-files.mjs
// (or `vercel env pull .env.local` first, then `node --env-file=.env.local scripts/upload-files.mjs`)
import { put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { TEMPLATES } from '../src/data/catalog.js';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Set BLOB_READ_WRITE_TOKEN (from your private Blob store) first. See SETUP.md.');
  process.exit(1);
}

let count = 0;
let missing = 0;
for (const tpl of TEMPLATES.filter((t) => t.fileReady)) {
  for (const f of tpl.files || []) {
    const local = new URL(`../files/${tpl.slug}/${f.name}`, import.meta.url);
    if (!existsSync(local)) { console.error(`MISSING  files/${tpl.slug}/${f.name}`); missing++; continue; }
    const body = await readFile(local);
    await put(`products/${tpl.slug}/${f.name}`, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log(`uploaded products/${tpl.slug}/${f.name} (${Math.round(body.length / 1024)} KB)`);
    count++;
  }
}
console.log(`${count} files uploaded${missing ? `, ${missing} missing` : ''}.`);
process.exit(missing ? 1 : 0);
