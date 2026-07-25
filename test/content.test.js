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
  Object.keys(song).sort(), ['audio', 'blurb', 'cover', 'featured', 'links', 'releaseDate', 'status', 'title']);
eq('song.audio absent when the sheet has no preview column', song.audio, null);

// ---- Mini-player preview clip ----
// The header is hand-typed, so the column must be found whatever the casing —
// the live sheet says "Preview url", not "Preview URL".
const songMap = C.TABS.find((t) => t.key === 'songs').map;
const clipRow = (header) => songMap(C.rowsFromGviz(gviz(
  ['Title', 'Status', 'Release Date', 'Cover', 'Blurb', 'Featured', 'Spotify', 'Apple Music', 'YouTube', 'Amazon', 'Pre-Save Link', header],
  [['Beautiful Life', 'Upcoming', 'Date(2026,6,31)', 'c.jpg', 'b', 'yes', null, null, null, null, null, 'https://cdn/clip.mp4']]
))[0]);
eq('song.audio from "Preview url" (live sheet casing)', clipRow('Preview url').audio, 'https://cdn/clip.mp4');
eq('song.audio from "Preview URL"', clipRow('Preview URL').audio, 'https://cdn/clip.mp4');
eq('song.audio from legacy "Audio" header', clipRow('Audio').audio, 'https://cdn/clip.mp4');
eq('song.audio blank cell -> null', songMap(C.rowsFromGviz(gviz(
  ['Title', 'Preview url'], [['Beautiful Life', '   ']]
))[0]).audio, null);

// ---- Songs now read from the band's Gig Calendar, "Music" tab (gid-pinned) ----
// The old standalone website sheet is retired: BOTH sections read one band sheet.
const songsSource = C.TABS.find((t) => t.key === 'songs').source;
const showsSource = C.TABS.find((t) => t.key === 'shows').source;
eq('songs source = band sheet + Music gid (rename-safe, no tab-by-name)',
  songsSource, { sheetId: showsSource.sheetId, gid: 1231124488 });
eq('songs + shows share ONE band sheet (old website sheet retired)',
  songsSource.sheetId, showsSource.sheetId);

// ---- Shows: now from the Gig Calendar (Venue | Address | Date | Time) ----
// Address IS the city line; there's no ticket column, so we synthesize a Maps
// link. A fully blank row is a spacer and must be dropped (map -> null).
const showsMap = C.TABS.find((t) => t.key === 'shows').map;
const showRows = C.rowsFromGviz(gviz(
  ['Venue', 'Address', 'Date', 'Time'],
  [
    ['Tolchester', 'Chestertown, MD', 'Date(2026,6,17)', 'Date(1899,11,30,19,0,0)'],
    ["Natalie's", 'Fallston, MD', 'Date(2026,6,24)', '8:30 PM'],   // apostrophe + text time
    ['', '', '', ''],                                               // blank spacer -> skipped
    ['Backyard Jam', '', 'Date(2026,7,1)', 'Date(1899,11,30,18,0,0)'], // no address -> ticketUrl null
  ]
));
const shows = showRows.map(showsMap).filter(Boolean);              // handler drops the nulls
eq('shows count (blank spacer dropped)', shows.length, 3);
eq('show[0] full (Address->city, synth maps link)', shows[0], {
  venue: 'Tolchester',
  date: '2026-07-17',
  city: 'Chestertown, MD',
  time: '7:00 PM',
  ticketUrl: 'https://www.google.com/maps/search/Tolchester+Chestertown%2C+MD',
});
eq('show[1].city comes from Address', shows[1].city, 'Fallston, MD');
eq('show[1].date (from gviz Date())', shows[1].date, '2026-07-24');
eq('show[1] apostrophe venue survives in maps link', shows[1].ticketUrl,
  "https://www.google.com/maps/search/Natalie's+Fallston%2C+MD");
eq('show[2] no address -> ticketUrl null', shows[2].ticketUrl, null);
eq('show[2] venue-only row is kept', shows[2].venue, 'Backyard Jam');
eq('row-skip rule: blank venue AND address -> null', showsMap({ Venue: '', Address: '', Date: '', Time: '' }), null);

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

// ---- mapsUrl: exact link, spaces -> "+", comma stays encoded ----
eq('mapsUrl basic', C.mapsUrl('Tolchester', 'Chestertown, MD'),
  'https://www.google.com/maps/search/Tolchester+Chestertown%2C+MD');
eq('mapsUrl multiword venue', C.mapsUrl('Smoke on the Rail BBQ Fest', 'New Freedom, PA'),
  'https://www.google.com/maps/search/Smoke+on+the+Rail+BBQ+Fest+New+Freedom%2C+PA');

// ---- gvizUrl: both tabs pinned by gid (gid 0 and a real gid); tab-by-name still supported ----
eq('gvizUrl pins by gid (gid 0, not falsy-skipped)', C.gvizUrl({ sheetId: 'ABC', gid: 0 }),
  'https://docs.google.com/spreadsheets/d/ABC/gviz/tq?tqx=out:json&headers=1&gid=0');
eq('gvizUrl pins by a real gid (the Music tab)', C.gvizUrl({ sheetId: 'ABC', gid: 1231124488 }),
  'https://docs.google.com/spreadsheets/d/ABC/gviz/tq?tqx=out:json&headers=1&gid=1231124488');
eq('gvizUrl addresses tab by name', C.gvizUrl({ sheetId: 'XYZ', tab: 'Songs' }),
  'https://docs.google.com/spreadsheets/d/XYZ/gviz/tq?tqx=out:json&headers=1&sheet=Songs');
eq('gvizUrl encodes spaces in a tab name', C.gvizUrl({ sheetId: 'XYZ', tab: 'My Shows' }),
  'https://docs.google.com/spreadsheets/d/XYZ/gviz/tq?tqx=out:json&headers=1&sheet=My%20Shows');

// ---- formatPriceRange: GHL price amounts -> the "Gear Up" price string ----
eq('formatPriceRange single amount', C.formatPriceRange([19.99]), '$19.99');
eq('formatPriceRange same amount repeated (variants, one price) -> collapses, not a range',
  C.formatPriceRange([21.55, 21.55, 21.55]), '$21.55');
eq('formatPriceRange distinct amounts -> en-dash range, min–max order',
  C.formatPriceRange([35.43, 16.32, 28.54]), '$16.32–$35.43');
eq('formatPriceRange always two decimals — flat $22 stays "$22.00", never shortened',
  C.formatPriceRange([22, 22]), '$22.00');
eq('formatPriceRange empty -> null', C.formatPriceRange([]), null);
eq('formatPriceRange null -> null', C.formatPriceRange(null), null);

// ---- mapProduct: GHL product + resolved prices -> { name, image, price } | null ----
// Fixture shaped like the real /products/ + /products/{id}/price payloads
// (trimmed to the fields mapProduct reads).
const merchTee = {
  _id: 'p1', name: 'Short Sleeve Tee', productType: 'PHYSICAL',
  availableInStore: true, image: 'https://cdn.example.com/tee.png',
};
const teePrices = [
  { amount: 23.34, deleted: false }, { amount: 23.34, deleted: false }, { amount: 28.54, deleted: false },
];
eq('mapProduct: in-store physical good with art + prices -> mapped, range price',
  C.mapProduct(merchTee, teePrices),
  { name: 'Short Sleeve Tee', image: 'https://cdn.example.com/tee.png', price: '$23.34–$28.54' });
eq('mapProduct: single price -> single amount, not a range',
  C.mapProduct(merchTee, [{ amount: 23.26, deleted: false }]),
  { name: 'Short Sleeve Tee', image: 'https://cdn.example.com/tee.png', price: '$23.26' });
eq('mapProduct: not availableInStore -> dropped',
  C.mapProduct(Object.assign({}, merchTee, { availableInStore: false }), teePrices), null);
eq('mapProduct: productType DIGITAL -> dropped (e.g. a deposit / add-on product)',
  C.mapProduct(Object.assign({}, merchTee, { productType: 'DIGITAL' }), teePrices), null);
eq('mapProduct: no image -> dropped',
  C.mapProduct(Object.assign({}, merchTee, { image: '' }), teePrices), null);
eq('mapProduct: zero prices -> dropped',
  C.mapProduct(merchTee, []), null);
eq('mapProduct: only a deleted price -> treated as zero prices, dropped',
  C.mapProduct(merchTee, [{ amount: 23.34, deleted: true }]), null);
eq('mapProduct: mix of deleted + live price -> deleted one excluded from the range',
  C.mapProduct(merchTee, [{ amount: 99.99, deleted: true }, { amount: 23.26, deleted: false }]),
  { name: 'Short Sleeve Tee', image: 'https://cdn.example.com/tee.png', price: '$23.26' });

console.log(fails ? `\n${fails} FAILED` : '\nAll passed');
process.exit(fails ? 1 : 0);
