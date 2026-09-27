// Renders one still per stop of the 3D yard for the plain (document) view: public/stills/<stop>.jpg
//
//   npm run build && npm run stills && npm run build
//
// Serves ./build itself, or pass --url=http://localhost:3000/ to render from a running dev server.
// Needs a local Chrome (set CHROME_PATH if it isn't in the default macOS location).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'stills');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const STOPS = ['gate', 'notice', 'bay', 'file-1', 'file-2', 'file-3', 'file-4', 'file-5', 'signals', 'dispatch'];

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2' };

// Static server for ./build, honouring the "homepage" sub-path from package.json
const serveBuild = () =>
  new Promise((resolve) => {
    const base = new URL(require(path.join(ROOT, 'package.json')).homepage || 'http://x/').pathname.replace(/\/$/, '');
    const server = http.createServer((req, res) => {
      let file = decodeURIComponent(req.url.split('?')[0]);
      if (base && file.startsWith(base)) file = file.slice(base.length);
      file = path.join(ROOT, 'build', file === '/' || file === '' ? 'index.html' : file);
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, () => resolve({ server, url: `http://localhost:${server.address().port}${base}/` }));
  });

(async () => {
  const arg = process.argv.find((a) => a.startsWith('--url='));
  const hosted = arg ? { server: null, url: arg.slice(6) } : await serveBuild();
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  for (const stop of STOPS) {
    await page.goto(`${hosted.url}?still=${stop}#/`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.documentElement.dataset.still === 'ready', null, { timeout: 60000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${stop}.jpg`), type: 'jpeg', quality: 78 });
    console.log(`stills/${stop}.jpg`);
  }
  await browser.close();
  if (hosted.server) hosted.server.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
