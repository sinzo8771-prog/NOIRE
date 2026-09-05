/**
 * Targeted verification for the bugs fixed in this debugging pass:
 *  1. next/font variables actually win (Cormorant Garamond / Inter resolve)
 *  2. tailwindcss-animate classes now exist in generated CSS
 *  3. Header nav buttons scroll to real sections (Lenis-routed)
 *  4. Mobile menu navigation works
 *  5. No console/page errors during all of the above
 */
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--enable-webgl'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.toString()));

  let failures = 0;
  const check = (name, ok, detail = '') => {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
    if (!ok) failures++;
  };

  // ── Desktop ──────────────────────────────────────────────
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Fonts: next/font variables must resolve (hashed families start with __)
  const fonts = await page.evaluate(() => ({
    h1: getComputedStyle(document.querySelector('h1')).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
  }));
  console.log('h1 font:', fonts.h1);
  console.log('body font:', fonts.body);
  check('Serif display font resolves via next/font', /__Cormorant_Garamond/i.test(fonts.h1), fonts.h1);
  check('Body sans font resolves via next/font', /__Inter/i.test(fonts.body), fonts.body);

  // 2. tailwindcss-animate utilities are now generated
  const hasAnimateIn = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules) {
        if (rule.cssText && rule.cssText.includes('animate-in')) return true;
      }
    }
    return false;
  });
  check('tailwindcss-animate utilities present in CSS', hasAnimateIn);


  // 3. Header navigation actually scrolls (previously dead: #story etc. missing)
  const navProbe = async (label, expectedSelector) => {
    await page.evaluate((lbl) => {
      const btn = Array.from(document.querySelectorAll('header button')).find(
        (b) => b.textContent.trim() === lbl
      );
      if (btn) btn.click();
    }, label);
    await new Promise((r) => setTimeout(r, 2600)); // lenis scrollTo duration 1.8s
    return page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { ok: false, detail: 'element missing' };
      const rect = el.getBoundingClientRect();
      return {
        ok: rect.top > -window.innerHeight && rect.top < window.innerHeight * 0.5,
        detail: 'top=' + Math.round(rect.top),
      };
    }, expectedSelector);
  };

  let res = await navProbe('Origin', '#act-2');
  check('Header "Origin" scrolls to #act-2', res.ok, res.detail);

  res = await navProbe('Collection', '#act-7');
  check('Header "Collection" scrolls to #act-7', res.ok, res.detail);

  res = await navProbe('Craft', '#act-4');
  check('Header "Craft" scrolls to #act-4', res.ok, res.detail);

  res = await navProbe('Sensory', '#act-6');
  check('Header "Sensory" scrolls to #act-6', res.ok, res.detail);

  // Brand wordmark → act-1
  await page.evaluate(() => {
    const brand = document.querySelector('header a[aria-label="NOIRÉ Home"]');
    if (brand) brand.click();
  });
  await new Promise((r) => setTimeout(r, 2600));
  const brandOk = await page.evaluate(() => {
    const el = document.querySelector('#act-1');
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    return top > -window.innerHeight && top < window.innerHeight * 0.5;
  });
  check('Brand wordmark scrolls to #act-1', brandOk);

  // 4. Mobile menu navigation
  await page.setViewport({ width: 375, height: 812 });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => {
    const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
    if (menuBtn) menuBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Reserve Collection')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 2600));
  const mobileOk = await page.evaluate(() => {
    const el = document.querySelector('#act-7');
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    return top > -window.innerHeight && top < window.innerHeight * 0.5;
  });
  check('Mobile menu "Reserve Collection" scrolls to #act-7', mobileOk);

  // 5. Chocolate Room modal opens (dialog + animations intact)
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    document.getElementById('act-8').scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Enter the Chocolate Room')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const modalOk = await page.evaluate(() =>
    !!Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent.includes('THE CHOCOLATE ROOM')
    )
  );
  check('Chocolate Room modal opens', modalOk);

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log('Console errors:', consoleErrors.length, consoleErrors.slice(0, 5));
  console.log('Page errors:', pageErrors.length, pageErrors.slice(0, 5));
  console.log(failures === 0 && pageErrors.length === 0 ? 'ALL CHECKS PASSED' : 'FAILURES: ' + failures);
  await browser.close();
  if (failures > 0 || pageErrors.length > 0) process.exit(1);
})().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

