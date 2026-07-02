// Zero-dependency static dev server for the Dixon Hall site.
// Serves ./site on 0.0.0.0 so it's reachable over the LAN (open on your phone).
// Usage: npm run dev   (optional: PORT=4000 npm run dev)

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, 'site');
const HOST = '0.0.0.0';
const START_PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {          // block path traversal
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 — Not found</h1>');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

function lanIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

function listen(port) {
  server.listen(port, HOST, () => {
    console.log('\n  Dixon Hall Music — dev server\n');
    console.log('  Local:    http://localhost:' + port);
    console.log('  Network:  http://' + lanIP() + ':' + port + '   <- open this on your phone\n');
  });
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('  Port ' + START_PORT + ' in use, trying ' + (START_PORT + 1) + '...');
    listen(START_PORT + 1);
  } else {
    throw e;
  }
});

listen(START_PORT);
