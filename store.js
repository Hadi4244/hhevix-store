import { readStore } from './_lib.js';

export default async function handler(req, res) {
  const store = await readStore();
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
  res.status(200).json(store);
}
