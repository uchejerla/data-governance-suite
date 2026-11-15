import { get, put, head } from '@vercel/blob';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';

// Paid files and order records live in a PRIVATE Vercel Blob store:
//   products/<template-slug>/<file name>   uploaded once with scripts/upload-files.mjs
//   orders/<checkout session id>.json      written by the webhook
// Private blobs have no public URL; only our functions can read them.

export class AlreadyExists extends Error {}

const blobStore = {
  kind: 'blob',
  async readFile(key) {
    // useCache: false so a file uploaded after an earlier miss is found straight away.
    const result = await get(`products/${key}`, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return { stream: result.stream, size: result.blob.size };
  },
  async createOrder(id, record) {
    const pathname = `orders/${id}.json`;
    if (await head(pathname).catch(() => null)) throw new AlreadyExists(id);
    try {
      await put(pathname, JSON.stringify(record, null, 2), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'application/json',
      });
    } catch (err) {
      if (/exist/i.test(err?.message || '')) throw new AlreadyExists(id);
      throw err;
    }
  },
  async readOrder(id) {
    const result = await get(`orders/${id}.json`, { access: 'private', useCache: false }).catch(() => null);
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  },
};

// Local development only (LOCAL_FILES_DIR=./files). Never set this on Vercel.
function localStore(dir) {
  const ordersDir = path.join(dir, '..', '.local-orders');
  const safe = (key) => {
    const full = path.resolve(dir, key);
    if (!full.startsWith(path.resolve(dir) + path.sep)) throw new Error('bad key');
    return full;
  };
  return {
    kind: 'local',
    async readFile(key) {
      try {
        const full = safe(key);
        const info = await stat(full);
        return { stream: (await readFile(full)), size: info.size };
      } catch {
        return null;
      }
    },
    async createOrder(id, record) {
      await mkdir(ordersDir, { recursive: true });
      try {
        await writeFile(path.join(ordersDir, `${id}.json`), JSON.stringify(record, null, 2), { flag: 'wx' });
      } catch (err) {
        if (err.code === 'EEXIST') throw new AlreadyExists(id);
        throw err;
      }
    },
    async readOrder(id) {
      try {
        return JSON.parse(await readFile(path.join(ordersDir, `${id}.json`), 'utf8'));
      } catch {
        return null;
      }
    },
  };
}

let override = null;
export function setStorageForTests(fake) {
  override = fake;
}

export function storage() {
  if (override) return override;
  const { localFilesDir } = config();
  if (localFilesDir && !process.env.VERCEL) return localStore(path.resolve(localFilesDir));
  return blobStore;
}
