// Google Sheets → site content proxy (Vercel serverless function).
// ───────────────────────────────────────────────────────────────────────────
// The site fetches /api/content; this reads each source's public gviz JSON — NO
// API key. A sheet just has to be shared "Anyone with the link can VIEW".
// It's public band data, nothing secret. Two sources feed the site:
//   • Songs — the website sheet ("Dixon Hall — Website"), "Songs" tab (SHEET_ID).
//   • Shows — the band's own "Dixon Hall Gig Calendar" sheet (GIG_SHEET_ID). The
//            band just keeps that calendar current; we read its FIRST tab pinned
//            by gid=0, so renaming the tab never breaks the site.
// A sheet id is the long code in its URL: docs.google.com/spreadsheets/d/<ID>/edit
//
// If a fetch fails, the page keeps its baked-in content (see index.html) — the
// site can never look broken.

const SHEET_ID = process.env.SHEET_ID || '15GA2gv4DY5XhEJtmtUbAK-VL8ZVCrjv3q6XV6Ngwwts';
const GIG_SHEET_ID = process.env.GIG_SHEET_ID || '1jkGXOEikpxS_c54ga34SUMnT6j_53G_vQAgSR0ttfis';

// key    = what the site reads (data.<key>).
// source = where the rows come from: { sheetId, tab } addresses a tab by name;
//          { sheetId, gid } pins a tab by its stable id (survives tab renames).
// map    = a row (keyed by the header in row 1) -> the shape the page renders;
//          return null to drop a row (e.g. a blank spacer).
const TABS = [
  {
    key: 'songs',
    source: { sheetId: SHEET_ID, tab: 'Songs' },
    map: (r) => ({
      title: r['Title'] || '',
      status: r['Status'] || 'Upcoming',          // Upcoming | Released | Hidden
      releaseDate: toISO(r['Release Date']),        // -> YYYY-MM-DD
      cover: r['Cover'] || null,                    // an image URL John pastes
      blurb: r['Blurb'] || '',
      featured: truthy(r['Featured']),
      links: {
        spotify: r['Spotify'] || null,
        apple: r['Apple Music'] || null,
        youtube: r['YouTube'] || null,
        amazon: r['Amazon'] || null,
        presave: r['Pre-Save Link'] || null,
      },
    }),
  },
  {
    key: 'shows',
    // The band's Gig Calendar — pinned by gid so a tab rename can't break us.
    // Columns: Venue | Address | Date | Time. There's no ticket-link column, so
    // we synthesize a Google Maps search link from venue + address.
    source: { sheetId: GIG_SHEET_ID, gid: 0 },
    map: (r) => {
      const venue = r['Venue'] || '';
      const address = r['Address'] || '';           // "City, ST" text, e.g. "Chestertown, MD"
      if (!venue && !address) return null;           // blank spacer row -> drop it
      return {
        venue,
        date: toISO(r['Date']),                      // -> YYYY-MM-DD
        city: address,                               // the Address column IS the city line
        time: toTime(r['Time']),                      // -> "7:00 PM"
        ticketUrl: address ? mapsUrl(venue, address) : null,
      };
    },
  },
];

const TTL_MS = 60 * 1000; // in-memory cache for warm lambdas / local dev
let cache = { ts: 0, body: null };

// Google's checkbox comes back as a real boolean; also accept text truthy values.
function truthy(v) {
  return v === true || /^(true|yes|y|1|x|✓)$/i.test(String(v == null ? '' : v).trim());
}

// Normalize whatever a date cell gives us into YYYY-MM-DD.
// gviz returns real dates as "Date(2026,6,31)" (month 0-indexed); text cells
// come as "2026-07-31" or "7/31/2026".
function toISO(v) {
  if (!v) return null;
  const s = String(v).trim();
  let m = /^Date\((\d+),(\d+),(\d+)/.exec(s);
  if (m) return m[1] + '-' + String(+m[2] + 1).padStart(2, '0') + '-' + String(+m[3]).padStart(2, '0');
  m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (m) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
  if (m) return m[3] + '-' + m[1].padStart(2, '0') + '-' + m[2].padStart(2, '0');
  return s;
}

// A "Time" cell typed as a real time comes from gviz as "Date(1899,11,30,H,M,S)".
// Turn that into a friendly "7:00 PM"; pass plain text ("7:00 PM") straight through.
function toTime(v) {
  if (!v) return '';
  const s = String(v).trim();
  const m = /^Date\(\d+,\d+,\d+,(\d+),(\d+)/.exec(s);
  if (!m) return s;
  let h = +m[1];
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + String(+m[2]).padStart(2, '0') + ' ' + ap;
}

// The Gig Calendar has no ticket column, so shows get a Google Maps search link
// built from "<venue> <address>" — matching the hand-entered maps links we used
// before (spaces as "+"). Pure so it can be unit-tested.
function mapsUrl(venue, address) {
  return 'https://www.google.com/maps/search/' +
    encodeURIComponent(venue + ' ' + address).replace(/%20/g, '+');
}

// Parse a gviz response body into row objects keyed by the header in row 1.
// Pure (no network) so it can be unit-tested.
// Body is wrapped: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
function rowsFromGviz(text) {
  const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  const cols = (json.table.cols || []).map((c) => (c.label || c.id || '').trim());
  return (json.table.rows || []).map((row) => {
    const obj = {};
    (row.c || []).forEach((cell, i) => {
      const key = cols[i];
      if (key) obj[key] = cell ? (cell.v != null ? cell.v : cell.f) : null;
    });
    return obj;
  });
}

// Build the public gviz URL for a source. Pin by gid when given (survives tab
// renames; note gid can be 0, so test against null — not truthiness); otherwise
// address the tab by name. Pure so it can be unit-tested.
function gvizUrl(source) {
  const base = 'https://docs.google.com/spreadsheets/d/' + source.sheetId +
    '/gviz/tq?tqx=out:json&headers=1';
  return source.gid != null
    ? base + '&gid=' + encodeURIComponent(source.gid)
    : base + '&sheet=' + encodeURIComponent(source.tab);
}

// Read one source (a tab of a sheet) via the public gviz endpoint.
async function fetchTab(source) {
  const r = await fetch(gvizUrl(source));
  if (!r.ok) throw new Error((source.tab || 'gid ' + source.gid) + ': HTTP ' + r.status);
  return rowsFromGviz(await r.text());
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // Public read-only data; CORS open so clones can share this backend.
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  if (!SHEET_ID) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'backend not configured' }));
  }

  if (cache.body && Date.now() - cache.ts < TTL_MS) {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.end(cache.body);
  }

  try {
    const rowSets = await Promise.all(TABS.map((t) => fetchTab(t.source)));
    const out = {};
    // map() may return null for rows to drop (blank spacers) — filter them out.
    TABS.forEach((t, i) => { out[t.key] = rowSets[i].map((row) => t.map(row)).filter(Boolean); });

    const body = JSON.stringify(out);
    cache = { ts: Date.now(), body };
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.end(body);
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'sheet fetch failed' }));
  }
};

// Exposed for offline unit tests (Vercel ignores extra props on the handler).
module.exports.rowsFromGviz = rowsFromGviz;
module.exports.toISO = toISO;
module.exports.toTime = toTime;
module.exports.truthy = truthy;
module.exports.mapsUrl = mapsUrl;
module.exports.gvizUrl = gvizUrl;
module.exports.TABS = TABS;
