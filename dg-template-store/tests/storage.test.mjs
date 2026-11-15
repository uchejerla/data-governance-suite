// Checks the local-folder storage used for development, the path guard, and the email text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('local storage: reads a file, refuses paths outside the folder, records an order once', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dgts-'));
  const dir = path.join(root, 'files');
  await mkdir(path.join(dir, 'governance-charter'), { recursive: true });
  await writeFile(path.join(dir, 'governance-charter', 'A.docx'), 'hello');
  await writeFile(path.join(root, 'secret.txt'), 'nope');
  process.env.LOCAL_FILES_DIR = dir;
  delete process.env.VERCEL;
  const { storage, AlreadyExists } = await import('../server/storage.js');
  const s = storage();
  assert.equal(s.kind, 'local');
  assert.equal(String(await (await s.readFile('governance-charter/A.docx')).stream), 'hello');
  assert.equal(await s.readFile('../secret.txt'), null);
  assert.equal(await s.readFile('governance-charter/missing.docx'), null);
  await s.createOrder('cs_test_1', { a: 1 });
  await assert.rejects(s.createOrder('cs_test_1', { a: 2 }), AlreadyExists);
  assert.deepEqual(await s.readOrder('cs_test_1'), { a: 1 });
  process.env.VERCEL = '1';
  assert.equal(storage().kind, 'blob', 'local folder must never be used on Vercel');
  delete process.env.VERCEL;
  delete process.env.LOCAL_FILES_DIR;
  await rm(root, { recursive: true, force: true });
});

test('email: lists every link, escapes names, and names the order page', async () => {
  const { buildDeliveryEmail } = await import('../server/email.js');
  const msg = buildDeliveryEmail({
    to: 'b@example.test',
    productName: 'Charter <b>',
    links: [{ label: 'Charter', name: 'A.docx', url: 'https://x.test/api/download?t=1' }, { label: 'Summary', name: 'B.docx', url: 'https://x.test/api/download?t=2' }],
    orderPageUrl: 'https://x.test/thanks?session_id=cs_test_1',
    linkHours: 72,
  });
  assert.equal(msg.subject, 'Your download: Charter <b>');
  assert.ok(msg.html.includes('Charter &lt;b&gt;'));
  assert.ok(!msg.html.includes('<b>'));
  assert.equal((msg.text.match(/api\/download/g) || []).length, 2);
  assert.ok(msg.text.includes('72 hours'));
});
