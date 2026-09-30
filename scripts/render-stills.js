// Photographs every place in the 3D yard for the plain view, by night and by day, and renders the social
// preview image. What to photograph comes from the site itself (see STILLS in src/site/stops.ts), so adding
// or removing a project in src/data/profile.ts changes the set with no edits here. Photographs of places that
// no longer exist are deleted.
//
//   npm run build && npm run stills          → public/stills (commit them; the README uses a few)
//   npm run stills -- --out=build/stills     → straight into a build (what the deploy workflow does)
//
// Options:  --url=http://localhost:3000/   render from a running dev server instead of serving ./build
//           --out=<dir>                    where to write (default public/stills)
//           --jobs=<n>                     photographs rendered at once (default 1; CI uses 3)
// Needs Chrome: the macOS default location, /usr/bin/google-chrome on Linux, or CHROME_PATH. Without a GPU
// (CI runners) Chrome falls back to software WebGL; it's slower but renders the same image.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const option = (name, fallback) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : fallback;
};
const OUT = path.resolve(ROOT, option('out', path.join('public', 'stills')));
const JOBS = Math.max(1, Number(option('jobs', '1')) || 1);
const LINUX = process.platform === 'linux';
const CHROME =
  process.env.CHROME_PATH ||
  (LINUX ? '/usr/bin/google-chrome' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
// GPU where there is one (macOS: Metal); software WebGL on Linux CI runners, which have no GPU
const GPU_ARGS = LINUX
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox']
  : ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'];

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

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

const shoot = async (page, url, file, size) => {
  await page.setViewportSize(size);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.dataset.still === 'ready', null, { timeout: 180000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: file, type: 'jpeg', quality: 78 });
  console.log(path.relative(ROOT, file));
};

(async () => {
  const given = option('url', null);
  const hosted = given ? { server: null, url: given } : await serveBuild();
  const browser = await chromium.launch({ executablePath: CHROME, args: GPU_ARGS });
  const PHOTO = { width: 1600, height: 900 };

  // Ask the site what to photograph
  const probe = await browser.newPage({ viewport: PHOTO });
  await probe.goto(`${hosted.url}?still=gate#/`, { waitUntil: 'load' });
  await probe.waitForFunction(() => document.documentElement.dataset.stills, null, { timeout: 180000 });
  const stills = JSON.parse(await probe.evaluate(() => document.documentElement.dataset.stills));
  await probe.close();

  const times = [
    { time: 'night', dir: OUT },
    { time: 'day', dir: path.join(OUT, 'day') },
  ];
  const tasks = [];
  for (const { time, dir } of times) {
    fs.mkdirSync(dir, { recursive: true });
    // Remove photographs of places that are gone (a project deleted or renamed)
    const wanted = new Set(stills.map((s) => `${s.name}.jpg`));
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.jpg') && !wanted.has(f) && !(dir === OUT && f === 'og.jpg'))
      .forEach((f) => {
        fs.unlinkSync(path.join(dir, f));
        console.log(`removed ${path.relative(ROOT, path.join(dir, f))}`);
      });
    stills.forEach((s) =>
      tasks.push({ url: `${hosted.url}?still=${s.stop}&time=${time}#/`, file: path.join(dir, `${s.name}.jpg`), size: PHOTO }),
    );
  }
  // Social preview (Open Graph / Twitter card): the name on the containers at night
  tasks.push({ url: `${hosted.url}?still=gate&time=night#/`, file: path.join(OUT, 'og.jpg'), size: { width: 1200, height: 630 } });

  // A few pages at once; each takes the next task until none are left
  const queue = [...tasks];
  await Promise.all(
    Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
      const page = await browser.newPage();
      for (let task = queue.shift(); task; task = queue.shift()) await shoot(page, task.url, task.file, task.size);
      await page.close();
    }),
  );

  await browser.close();
  if (hosted.server) hosted.server.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
