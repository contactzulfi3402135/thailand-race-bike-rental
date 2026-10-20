let enquiries = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(enquiries);
  }
  if (req.method === 'POST') {
    const id = (req.body && req.body.id) || `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    const entry = {
      id,
      createdAt: new Date().toISOString(),
      ...(req.body || {}),
    };
    enquiries.unshift(entry);
    return res.status(201).json({ ok: true, enquiry: entry });
  }
  return res.status(405).json({ ok: false });
}
