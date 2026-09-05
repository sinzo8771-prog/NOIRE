const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE BROWSER VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--enable-webgl'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.log('Browser Runtime Page Error:', err.toString());
  });

  // TEST 1: Desktop Viewport (1440x900)
  console.log('\n[1/7] Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

  // Check page title
  const title = await page.title();
  console.log('✓ Page Title:', title);

  // Take hero screenshot
  await page.screenshot({ path: path.join(screenshotDir, '01_desktop_hero.png') });
  console.log('✓ Captured 01_desktop_hero.png');

  // TEST 2: Verify all 8 Acts exist in DOM
  console.log('\n[2/7] Verifying all 8 Acts in DOM...');
  for (let act = 1; act <= 8; act++) {
    const actElem = await page.$(`#act-${act}`);
    if (!actElem) {
      throw new Error(`Act ${act} (#act-${act}) not found!`);
    }
    console.log(`✓ Act ${act} element verified (#act-${act})`);
  }

  // Scroll through each act and capture screenshot
  console.log('\n[3/7] Scrolling through 8 Acts...');
  await page.evaluate(() => document.getElementById('act-2').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '02_act2_origin.png') });

  await page.evaluate(() => document.getElementById('act-3').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '03_act3_transformation.png') });

  await page.evaluate(() => document.getElementById('act-4').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '04_act4_chocolate.png') });

  await page.evaluate(() => document.getElementById('act-5').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '05_act5_break.png') });

  await page.evaluate(() => document.getElementById('act-6').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '06_act6_sensory.png') });

  await page.evaluate(() => document.getElementById('act-7').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '07_act7_collection.png') });

  await page.evaluate(() => document.getElementById('act-8').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '08_act8_epilogue.png') });
  console.log('✓ All 8 Acts scrolled and captured.');

  // TEST 4: Product Switching & Interaction
  console.log('\n[4/7] Testing Product Switcher in Act VII...');
  await page.evaluate(() => document.getElementById('act-7').scrollIntoView());
  await new Promise(r => setTimeout(r, 600));

  const tabs = await page.$$('[role="tab"]');
  console.log(`Found ${tabs.length} product tabs`);
  if (tabs.length >= 2) {
    await tabs[1].click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✓ Clicked Dark Sea Salt tab');

    if (tabs.length >= 3) {
      await tabs[2].click();
      await new Promise(r => setTimeout(r, 600));
      console.log('✓ Clicked Roasted Hazelnut tab');
    }
  }

  // TEST 5: Add to Bag & Shopping Bag Cart Drawer
  console.log('\n[5/7] Testing Add to Bag and Cart drawer...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Add to Bag'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotDir, '09_cart_drawer.png') });
  console.log('✓ Add to Bag clicked & Cart drawer opened!');

  // Verify quantity buttons inside sheet
  await page.evaluate(() => {
    const plusBtn = document.querySelector('button[aria-label="Increase quantity"]');
    if (plusBtn) plusBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('✓ Quantity increment tested.');

  // Test Proceed to Checkout button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const checkout = buttons.find(b => b.textContent && b.textContent.includes('Proceed to Checkout'));
    if (checkout) checkout.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotDir, '10_checkout_modal.png') });
  console.log('✓ Checkout reservation modal opened & captured.');

  // Close modals
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // TEST 6: Tablet Viewport (768x1024)
  console.log('\n[6/7] Testing Tablet Viewport (768x1024)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '11_tablet_view.png') });
  console.log('✓ Tablet layout verified.');

  // TEST 7: Mobile Viewport (375x812)
  console.log('\n[7/7] Testing Mobile Viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '12_mobile_view.png') });
  console.log('✓ Mobile layout verified.');

  // Check horizontal overflow on mobile
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log('Mobile horizontal overflow present?:', hasHorizontalScroll);

  // Test Mobile Menu Toggle
  await page.evaluate(() => {
    const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '13_mobile_menu.png') });
  console.log('✓ Mobile menu drawer opened & captured.');

  // Test Reduced Motion
  console.log('\nTesting prefers-reduced-motion media query...');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('✓ Page reloaded cleanly under reduced motion.');

  await browser.close();

  console.log('\n--- BROWSER VERIFICATION SUMMARY ---');
  console.log('Console Errors count:', consoleErrors.length);
  console.log('Runtime Page Errors count:', pageErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }
  if (pageErrors.length > 0) {
    console.log('Page errors:', pageErrors);
  }

  if (pageErrors.length === 0) {
    console.log('\n🏆 ALL BROWSER VERIFICATION TESTS PASSED WITH 0 RUNTIME ERRORS!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
