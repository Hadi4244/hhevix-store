import { put } from '@vercel/blob';
import { writeStore } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set in Vercel yet.' });
  if (b.password !== pw) return res.status(401).json({ error: 'Wrong password.' });
  try {
    if (b.action === 'check') return res.json({ ok: true });
    if (b.action === 'save') {
      const s = b.store;
      if (!s || !Array.isArray(s.products) || !Array.isArray(s.categories)) return res.status(400).json({ error: 'Bad data.' });
      await writeStore(s);
      return res.json({ ok: true });
    }
    if (b.action === 'upload') {
      const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(b.data || '');
      if (!m) return res.status(400).json({ error: 'Use a JPG, PNG or WebP photo.' });
      const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
      const r = await put('images/' + Date.now() + '.' + ext, Buffer.from(m[2], 'base64'), {
        access: 'public',
        contentType: 'image/' + m[1],
      });
      return res.json({ url: r.url });
    }
    return res.status(400).json({ error: 'Unknown action.' });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
