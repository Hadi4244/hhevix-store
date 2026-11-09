import { put, list } from '@vercel/blob';
import { DEFAULT } from './_default.js';

export async function readStore() {
  try {
    const { blobs } = await list({ prefix: 'store.json' });
    const b = blobs.find((x) => x.pathname === 'store.json');
    if (!b) return DEFAULT;
    const r = await fetch(b.url + '?t=' + Date.now(), { cache: 'no-store' });
    return r.ok ? await r.json() : DEFAULT;
  } catch (e) {
    return DEFAULT; // storage not connected yet: show starter products
  }
}

export async function writeStore(store) {
  await put('store.json', JSON.stringify(store), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
