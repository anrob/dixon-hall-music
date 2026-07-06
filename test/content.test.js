// Offline unit test for site/api/content.js — proves gviz parsing + field
// mapping + date/boolean normalization produce exactly the shape index.html
// renders. Run: node test/content.test.js   (no network, no sheet sharing needed)
const C = require('../site/api/content.js');

let fails = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? '  ✓ ' : '  ✗ ') + label + (ok ? '' : `\n      got:  ${JSON.stringify(got)}\n      want: ${JSON.stringify(want)}`));
  if (!ok) fails++;
};

// A gviz body exactly as Google returns it (wrapper + cols[].label headers).
const gviz = (cols, rows) =>
  `/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify({
    version: '0.6', status: 'ok',
    table: {
      cols: cols.map((label, i) => ({ id: String.fromCharCode(65 + i), label, type: 'string' })),
      rows: rows.map((cells) => ({ c: cells.map((v) => (v === null ? null : { v })) })),
    },
  })});`;

// ---- rowsFromGviz keys rows by header ----
const songRows = C.rowsFromGviz(gviz(
  ['Title', 'Status', 'Release Date', 'Cover', 'Blurb', 'Featured', 'Spotify', 'Apple Music', 'YouTube', 'Amazon', 'Pre-Save Link'],
  [['Beautiful Life', 'Upcoming', 'Date(2026,6,31)', 'assets/beautiful-life.jpg', 'A blurb', 'yes', null, null, null, null, null]]
));
const song = C.TABS.find((t) => t.key === 'songs').map(songRows[0]);
eq('song.title', song.title, 'Beautiful Life');
eq('song.status', song.status, 'Upcoming');
eq('song.releaseDate (from gviz Date())', song.releaseDate, '2026-07-31');
eq('song.cover', song.cover, 'assets/beautiful-life.jpg');
eq('song.featured (from "yes")', song.featured, true);
eq('song.links shape', song.links, { spotify: null, apple: null, youtube: null, amazon: null, presave: null });
eq('song has exactly the keys index.html reads',
  Object.keys(song).sort(), ['blurb', 'cover', 'featured', 'links', 'releaseDate', 'status', 'title']);

// ---- Shows: text date + comma-in-city survive ----
const showRows = C.rowsFromGviz(gviz(
  ['Venue', 'Date', 'City', 'Time', 'Ticket Link'],
  [
    ["Admiral's Cups", '2026-07-08', 'Baltimore, MD', 'Date(1899,11,30,19,0,0)', 'https://maps/x'],
    ['Twains Tavern', 'Date(2026,6,11)', 'Pasadena, MD', '8:30 PM', null],
  ]
));
const shows = showRows.map(C.TABS.find((t) => t.key === 'shows').map);
eq('shows count', shows.length, 2);
eq('show[0] full', shows[0], { venue: "Admiral's Cups", date: '2026-07-08', city: 'Baltimore, MD', time: '7:00 PM', ticketUrl: 'https://maps/x' });
eq('show[1].date (from gviz Date())', shows[1].date, '2026-07-11');
eq('show[1].ticketUrl empty -> null', shows[1].ticketUrl, null);

// ---- helpers ----
eq('toISO ISO passthrough', C.toISO('2026-07-31'), '2026-07-31');
eq('toISO US format', C.toISO('7/31/2026'), '2026-07-31');
eq('toISO gviz Date()', C.toISO('Date(2026,0,5)'), '2026-01-05');
eq('toISO empty', C.toISO(''), null);
eq('truthy yes', C.truthy('yes'), true);
eq('truthy TRUE bool', C.truthy(true), true);
eq('truthy blank', C.truthy(''), false);
eq('truthy no', C.truthy('no'), false);
eq('toTime gviz 19:00 -> 7:00 PM', C.toTime('Date(1899,11,30,19,0,0)'), '7:00 PM');
eq('toTime gviz 08:30 -> 8:30 AM', C.toTime('Date(1899,11,30,8,30,0)'), '8:30 AM');
eq('toTime gviz 00:00 -> 12:00 AM', C.toTime('Date(1899,11,30,0,0,0)'), '12:00 AM');
eq('toTime text passthrough', C.toTime('5:30 PM'), '5:30 PM');
eq('toTime empty', C.toTime(''), '');

console.log(fails ? `\n${fails} FAILED` : '\nAll passed');
process.exit(fails ? 1 : 0);
