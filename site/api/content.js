// Vercel serverless function — proxies Airtable reads so the token stays server-side.
// The static site fetches /api/content; John edits the "Dixon Hall Music" Airtable base.
// Env vars (Vercel dashboard + local .env): AIRTABLE_TOKEN, AIRTABLE_BASE_ID
// Response is CDN-cached 5 min (s-maxage), so Airtable rate limits never matter.

const TTL_MS = 60 * 1000; // in-memory cache for warm lambdas / local dev
let cache = { ts: 0, body: null };

async function fetchTable(base, token, table) {
  let records = [];
  let offset;
  do {
    const url = new URL('https://api.airtable.com/v0/' + base + '/' + encodeURIComponent(table));
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error(table + ': HTTP ' + r.status);
    const data = await r.json();
    records = records.concat(data.records || []);
    offset = data.offset;
  } while (offset);
  return records;
}

// First attachment URL, or null. (Airtable attachment URLs expire after a few
// hours — fine here because responses are re-fetched/cached every 5 minutes.)
function att(v) {
  return Array.isArray(v) && v[0] && v[0].url ? v[0].url : null;
}

module.exports = async (req, res) => {
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TOKEN = process.env.AIRTABLE_TOKEN;

  res.setHeader('Content-Type', 'application/json');

  if (!BASE || !TOKEN) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'backend not configured' }));
  }

  if (cache.body && Date.now() - cache.ts < TTL_MS) {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.end(cache.body);
  }

  try {
    const [songs, shows] = await Promise.all([
      fetchTable(BASE, TOKEN, 'Songs'),
      fetchTable(BASE, TOKEN, 'Shows')
    ]);

    const out = {
      songs: songs.map((r) => {
        const f = r.fields || {};
        return {
          title: f['Title'] || '',
          status: f['Status'] || 'Upcoming',           // Upcoming | Released | Hidden
          releaseDate: f['Release Date'] || null,       // YYYY-MM-DD
          cover: att(f['Cover Art']),
          blurb: f['Blurb'] || '',
          featured: !!f['Featured'],
          links: {
            spotify: f['Spotify'] || null,
            apple: f['Apple Music'] || null,
            youtube: f['YouTube'] || null,
            amazon: f['Amazon'] || null,
            presave: f['Pre-Save Link'] || null
          }
        };
      }),
      shows: shows.map((r) => {
        const f = r.fields || {};
        return {
          venue: f['Venue'] || '',
          date: f['Date'] || null,                      // YYYY-MM-DD
          city: f['City'] || '',
          time: f['Time'] || '',
          ticketUrl: f['Ticket Link'] || null
        };
      })
    };

    const body = JSON.stringify(out);
    cache = { ts: Date.now(), body };
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.end(body);
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'airtable fetch failed' }));
  }
};
