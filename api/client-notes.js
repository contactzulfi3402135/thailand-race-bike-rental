let notes = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(notes);
  }
  if (req.method === 'POST') {
    const entry = {
      id: `NOTE-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...(req.body || {}),
    };
    notes.unshift(entry);
    return res.status(201).json({ ok: true, entry });
  }
  return res.status(405).json({ ok: false });
}
