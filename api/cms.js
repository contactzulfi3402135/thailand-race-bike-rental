let memoryCms = null;

export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json(memoryCms);
  if (req.method === 'POST') {
    memoryCms = req.body || null;
    return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
  }
  if (req.method === 'DELETE') {
    memoryCms = null;
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ ok: false });
}
