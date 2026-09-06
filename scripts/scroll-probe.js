/**
 * Scroll-animation probe for the NOIRÉ cinematic scrubber.
 *
 * Drives real scrolling (mouse wheel + programmatic) in headless Chrome and
 * fingerprints the 2D cinematic canvas at multiple scroll depths to verify:
 *   - frames actually load (counts HTTP statuses for /frames/*)
 *   - the canvas repaints as scroll progresses (distinct pixel fingerprints)
 *   - behavior under prefers-reduced-motion: reduce
 *   - behavior at mobile viewport (webp-mobile set selected)
 *
 * Usage:
 *   node scripts/scroll-probe.js [baseUrl]     (default http://localhost:3100)
 * Artifacts (screenshots) land in probe-artifacts/.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:3100';
const artifactDir = path.join(__dirname, '..', 'probe-artifacts');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fingerprint(page) {
  return page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    for (const c of canvases) {
      const ctx = c.getContext('2d');
      if (ctx && c.width > 0) {
        const d = ctx.getImageData(0, 0, c.width, Math.min(300, c.height)).data;
        let hash = 0;
        for (let i = 0; i < d.length; i += 397) hash = (hash * 31 + d[i]) | 0;
        return { hash, w: c.width, h: c.height };
      }
    }
    return null;
  });
}

function attachCollectors(page, bucket) {
  page.on('console', (m) => {
    if (m.type() === 'error') bucket.consoleErrors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => bucket.pageErrors.push(String(e).slice(0, 200)));
  page.on('requestfailed', (r) => {
    const err = r.failure() && r.failure().errorText;
    bucket.failed.push(`${r.url().split('/').pop()} :: ${err}`);
  });
  page.on('response', (r) => {
    const u = r.url();
    if (u.includes('/frames/')) {
      bucket.frameResponses[r.status()] = (bucket.frameResponses[r.status()] || 0) + 1;
    }
    if (r.status() >= 400) bucket.httpErrors.push(`${r.status()} ${u}`);
  });
}

async function scrollSuite(page, bucket, label) {
  const fps = [];
  const snap = async (name) => {
    const buf = await page.screenshot();
    fs.writeFileSync(path.join(artifactDir, `${label}-${name}.png`), buf);
  };

  const fp0 = await fingerprint(page);
  fps.push(fp0 ? fp0.hash : 'null');
  await snap('0-top');

  // 1) Wheel-driven scrolling (exercises the Lenis path)
  await page.mouse.move(720, 450);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel({ deltaY: 900 });
    await sleep(220);
  }
  await sleep(1300);
  const fpWheel = await fingerprint(page);
  fps.push(fpWheel ? fpWheel.hash : 'null');
  await snap('1-wheel');

  // 2) Precise programmatic steps
  const fracs = [0.25, 0.5, 0.75, 1];
  for (const f of fracs) {
    await page.evaluate(
      (frac) =>
        window.scrollTo(
          0,
          (document.documentElement.scrollHeight - window.innerHeight) * frac
        ),
      f
    );
    await sleep(1200);
    const fp = await fingerprint(page);
    fps.push(fp ? fp.hash : 'null');
    await snap(`2-pos-${String(f).replace('.', '_')}`);
  }

  bucket.scrollYAfterSuite = await page.evaluate(() => window.scrollY);
  bucket.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const real = fps.filter((v) => v !== 'null');
  bucket.distinctCanvasStates = new Set(real).size;
  bucket.fingerprints = fps;
}

(async () => {
  fs.mkdirSync(artifactDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--enable-webgl'],
  });

  async function scenario(label, { viewport, reduceMotion }) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.emulateMediaFeatures([
      {
        name: 'prefers-reduced-motion',
        value: reduceMotion ? 'reduce' : 'no-preference',
      },
    ]);
    const bucket = {
      consoleErrors: [],
      pageErrors: [],
      failed: [],
      httpErrors: [],
      frameResponses: {},
    };
    attachCollectors(page, bucket);
    try {
      await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    } catch (e) {
      console.log(`[${label}] LOAD FAILED: ${e.message}`);
      await page.close();
      return;
    }
    await sleep(2500); // let hydration + priority frames settle
    bucket.pageMedia = await page.evaluate(() => ({
      reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      mobileQuery: window.matchMedia('(max-width: 767px)').matches,
    }));
    await scrollSuite(page, bucket, label);
    console.log(`\n===== ${label} =====`);
    console.log(JSON.stringify(bucket, null, 1));
    await page.close();
  }

  await scenario('desktop-motion', {
    viewport: { width: 1440, height: 900 },
    reduceMotion: false,
  });

  await scenario('desktop-reduced', {
    viewport: { width: 1440, height: 900 },
    reduceMotion: true,
  });

  await scenario('mobile-motion', {
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    reduceMotion: false,
  });

  // D: visitor forces motion OFF via the in-site toggle (localStorage) while
  // the OS reports no preference — snap scrub through the 64-frame set.
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);
    await page.evaluateOnNewDocument(() => {
      window.localStorage.setItem('noire-motion', 'off');
    });
    const bucket = {
      consoleErrors: [],
      pageErrors: [],
      failed: [],
      httpErrors: [],
      frameResponses: {},
    };
    attachCollectors(page, bucket);
    await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
    await sleep(2500);
    await scrollSuite(page, bucket, 'desktop-override-off');
    console.log('\n===== desktop-override-off =====');
    console.log(JSON.stringify(bucket, null, 1));
    await page.close();
  }

  await browser.close();
  console.log('\nPROBE COMPLETE');
})();

