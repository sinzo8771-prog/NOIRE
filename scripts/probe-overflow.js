const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));
  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 90),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    });
    return { vw, scrollW: document.documentElement.scrollWidth, count: bad.length, bad: bad.slice(0, 15) };
  });
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
