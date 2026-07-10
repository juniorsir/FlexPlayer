module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { message, data } = req.body;
    console.log(`[CLIENT-DEBUG] ${message}`, data || '');
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Log error:", e);
    return res.status(500).end();
  }
};
