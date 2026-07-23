// Fan club signup → GHL contact (Vercel serverless function).
// ───────────────────────────────────────────────────────────────────────────
// The "Never Miss A Drop" form POSTs { email } here; we upsert a contact in
// the Dixon Hall GHL location (dedupes by email) and tag it so automations
// can fire. Same env vars as the products feed: GHL_API_KEY + GHL_LOCATION_ID.
// No env / GHL failure → the form shows its "try again" state; nothing breaks.

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

const TAGS = ['fan club', 'website'];

function validEmail(s) {
  return typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 10000) reject(new Error('too big'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'POST only' }));
  }

  let body = {};
  try { body = JSON.parse((await readBody(req)) || '{}'); } catch (e) { /* falls through to 400 */ }

  // Honeypot: bots fill the hidden "company" field — swallow silently.
  if (body.company) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!validEmail(email)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'bad email' }));
  }

  const firstName = String(body.firstName || '').trim().slice(0, 100);
  const lastName = String(body.lastName || '').trim().slice(0, 100);

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'not configured' }));
  }

  try {
    const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + GHL_API_KEY,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign(
        {
          locationId: GHL_LOCATION_ID,
          email: email,
          tags: TAGS,
          source: 'dixonhallmusic.com — fan club form',
        },
        firstName ? { firstName: firstName } : null,
        lastName ? { lastName: lastName } : null
      )),
    });
    if (!r.ok) throw new Error('GHL ' + r.status);
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'signup failed' }));
  }
};

module.exports.validEmail = validEmail; // exposed for tests
