export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const ip = body.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
    const subject = encodeURIComponent('New Website Visitor - Sahani Digital Cable');
    const message = [
      'New visitor opened Sahani Digital Cable website',
      `IP Address: ${ip}`,
      `Location: ${body.location || 'Unavailable'}`,
      `Latitude: ${body.latitude || 'Unavailable'}`,
      `Longitude: ${body.longitude || 'Unavailable'}`,
      `Nepal Time: ${body.nepal_time || 'Unavailable'}`,
      `UTC Time: ${body.utc_time || 'Unavailable'}`,
      `Location Source: ${body.location_source || 'Unknown'}`
    ].join('\n');
    const url = `https://formsubmit.co/ajax/info@sahanidigitalcable.com.np?subject=${subject}`;
    const form = new URLSearchParams({ _captcha: 'false', message });
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: form });
    const data = await r.text();
    if (!r.ok) return res.status(502).json({ error: 'Email service failed', detail: data });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: 'Visitor notification failed' }); }
}
