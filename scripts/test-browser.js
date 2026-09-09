/**
 * NOIRÉ — Production browser regression suite (replaces the obsolete cart-era tests).
 *
 * The previous suite targeted a removed cart/checkout experience (Add to Bag,
 * quantity controls, Proceed to Checkout). This suite targets the current
 * concierge-first showcase experience:
 *
 *   Test 1 — Page boot ........... loads, title, hero, skip link, no page/console errors
 *   Test 2 — Eight acts .......... #act-1 … #act-8 all present
 *   Test 3 — Desktop navigation .. Origin / Craft / Sensory / Collection + Request a Tasting
 *   Test 4 — Product switcher .... all four bars swap name/subtitle/description/cacao%/
 *                                    tasting notes/origin/ingredients/allergen/CTA
 *   Test 5 — Concierge CTA ....... Request This Bar / Request a Tasting → concierge mailto
 *   Test 6 — Chocolate Room ...... open / focus / Escape / close button / scroll lock
 *   Test 7 — Mobile .............. 375×812 + 390×844: no overflow, menu, product, modal
 *   Test 8 — Reduced motion ...... no Lenis smoothing, snap/static frame, no particles,
 *                                  CSS motion neutralised, page remains navigable/readable
 *   Test 9 — OpenDesign additions . Nocturne is the default hero (?hero=classic
 *                                  restores Craving, no hydration errors),
 *                                  #tasting interlude present/ordered/clean at 375px
  *   Test 10 — Reserve Drop ........ #reserve-drop present/ordered/clean at 375px
  *   Test 11 — Interactivity ....... #origins marquee (origins, aria-hidden dup,
  *                                  running + velocity-reactive animation,
  *                                  clean at 375px),
  *                                  #tasting-timer (begin counts down, reset),
  *                                  #atelier-notes accordion (click + keyboard),
  *                                  Reveal on scroll
  *
 * Environment:
 *   CHROME_PATH  (default: C:\Program Files\Google\Chrome\Application\chrome.exe)
 *   BASE_URL     (default: http://localhost:3000)
 *
 * Run:
 *   Terminal 1:  npm run build && npm start
 *   Terminal 2:  node scripts/test-browser.js
 */
"use strict";

const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3000";

// Screenshots land in the git-ignored probe-artifacts/ tree (kept out of public/).
const shotDir = path.join(
  __dirname,
  "..",
  "probe-artifacts",
  "browser-regression"
);
if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });

// Assertion oracle for the four reserve bars. The authoritative copy lives in
// src/data/products.ts — keep these expectations in sync when that file changes.
const PRODUCTS = [
  {
    id: "origin-72",
    name: "ORIGIN 72",
    cacao: "72%",
    subtitle: "Pure Single Origin Dark Chocolate",
    origin: "Tumaco, Colombia",
    desc: "A resolute, pure bar born from deep Colombian",
    notes: ["Black Currant", "Leather & Oak", "Dried Plum", "Dark Molasses"],
    ingredient: "Organic Tumaco Cacao Beans",
    allergen: "dedicated tree-nut free atelier",
  },
  {
    id: "dark-sea-salt",
    name: "DARK SEA SALT",
    cacao: "70%",
    subtitle: "70% Arriba Cacao with Flaked Maldon",
    origin: "Esmeraldas, Ecuador",
    desc: "Wild floral Arriba Nacional cacao",
    notes: ["Floral Jasmine", "Wild Citrus", "Flaked Sea Mineral", "Smoked Toffee"],
    ingredient: "Ecuadorian Arriba Nacional Cacao",
    allergen: "traces of dairy",
  },
  {
    id: "roasted-hazelnut",
    name: "ROASTED HAZELNUT",
    cacao: "68%",
    subtitle: "68% Cacao with Piedmont Nocciola",
    origin: "Chanchamayo, Peru & Alta Langa, Italy",
    desc: "Slowly toasted Alta Langa IGP hazelnuts",
    notes: ["Toasted Praline", "Brown Butter", "Honeyed Walnut", "Warm Spice"],
    ingredient: "Peruvian Cacao Beans",
    allergen: "Contains tree nuts",
  },
  {
    id: "madagascar-milk",
    name: "MADAGASCAR MILK",
    cacao: "55%",
    subtitle: "55% High-Percentage Dark-Milk",
    origin: "Sambirano Valley, Madagascar",
    desc: "A revelation for those who think milk chocolate",
    notes: ["Red Berries", "Clotted Cream", "Clementine", "Soft Caramel"],
    ingredient: "Madagascar Cacao",
    allergen: "Contains Milk",
  },
];

const NAV = [
  { label: "Origin", target: "#act-2" },
  { label: "Craft", target: "#act-4" },
  { label: "Sensory", target: "#act-6" },
  { label: "Collection", target: "#act-7" },
];

/* ── small test harness ─────────────────────────────────────────────── */
let failures = 0;
const results = [];

const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const shot = (page, name) =>
  page.screenshot({ path: path.join(shotDir, `${name}.png`) });

// mailto query values are URLSearchParams-encoded: spaces become '+', which
// decodeURIComponent keeps as-is. Parse via URL so subject/body round-trip
// exactly (e.g. "Request a Tasting — NOIRÉ Atelier").
const decodeMailto = (href) => {
  try {
    const url = new URL(href);
    return `${url.searchParams.get("subject") || ""}\n${url.searchParams.get("body") || ""}`;
  } catch {
    return decodeURIComponent(href.replace(/\+/g, "%20"));
  }
};

async function clickDesktopNav(page, label) {
  await page.evaluate((lbl) => {
    const btn = Array.from(document.querySelectorAll("header nav button")).find(
      (b) => b.textContent.trim() === lbl
    );
    if (!btn) throw new Error(`Desktop nav button not found: ${lbl}`);
    btn.click();
  }, label);
}

async function sectionPosition(page, sel) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return { ok: false, detail: "section missing" };
    const r = el.getBoundingClientRect();
    return {
      ok: r.top > -window.innerHeight / 2 && r.top < window.innerHeight * 0.6,
      detail: `top=${Math.round(r.top)}`,
    };
  }, sel);
}

// Elements whose bounding rect escapes the viewport horizontally (robust
// overflow probe — body{overflow-x:hidden} alone can hide visual clipping).
// Elements masked by a deliberate non-body clipping ancestor (e.g. an
// overflow-hidden marquee section masking its w-max track) are skipped:
// they cannot cause page-level scroll, the mask is the design.
async function horizontalOffenders(page, scopeSel = "body *") {
  return page.evaluate((sel) => {
    const vw = window.innerWidth;
    const offenders = [];
    const maskedByDesign = (el) => {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === "hidden" || ox === "clip" || ox === "auto" || ox === "scroll") return true;
        p = p.parentElement;
      }
      return false;
    };
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        if (maskedByDesign(el)) return;
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === "string" ? el.className : "").slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    });
    return offenders.slice(0, 10);
  }, scopeSel);
}
(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle", "--enable-webgl"],
  });
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.log("   [console.error]", msg.text().slice(0, 160));
    }
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.toString());
    console.log("   [pageerror]", err.toString().slice(0, 160));
  });

  // ── Test 1: Page boot ────────────────────────────────────────────────
  console.log("\n[Test 1] Page boot");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1200);

  const title = await page.title();
  check("Page title present", /NOIRÉ/i.test(title), title);

  const h1 = await page.evaluate(
    () => document.querySelector("h1")?.textContent?.trim() ?? ""
  );
  check("Hero h1 rendered", h1.length > 0, h1.slice(0, 40));

  const hasSkipLink = await page.evaluate(() => !!document.querySelector("a.skip-link"));
  check("Skip-to-content link present", hasSkipLink);

  // P3 — SEO plumbing present in the served document
  const seo = await page.evaluate(() => {
    const head = document.head;
    const g = (rel) => head.querySelector(`link[rel="${rel}"]`)?.getAttribute("href") || "";
    return { manifest: g("manifest"), apple: g("apple-touch-icon"), canonical: g("canonical") };
  });
  check("Web manifest linked", seo.manifest.includes("manifest.webmanifest"), seo.manifest || "(missing)");
  check("Apple touch icon linked", seo.apple.includes("apple-touch-icon"), seo.apple || "(missing)");
  check("Canonical URL present", /noireee\.vercel\.app/.test(seo.canonical), seo.canonical || "(missing)");

  await shot(page, "01-desktop-hero");

  // ── Test 2: Eight acts ────────────────────────────────────────────────
  console.log("\n[Test 2] Eight acts present");
  for (let act = 1; act <= 8; act++) {
    const ok = await page.evaluate((n) => !!document.getElementById(`act-${n}`), act);
    check(`Act ${act} (#act-${act}) present`, ok);
  }

  // ── Test 3: Desktop navigation ────────────────────────────────────────
  console.log("\n[Test 3] Desktop navigation");
  for (const { label, target } of NAV) {
    await clickDesktopNav(page, label);
    await wait(2600); // Lenis scrollTo duration is 1.8s
    const pos = await sectionPosition(page, target);
    check(`Nav "${label}" scrolls to ${target}`, pos.ok, pos.detail);
  }

  const tastingHref = await page.evaluate(() => {
    const a = document.querySelector('header a[aria-label*="Request a tasting"]');
    return a ? a.getAttribute("href") || "" : "";
  });
  const decodedTasting = tastingHref ? decodeMailto(tastingHref) : "";
  check(
    "Nav 'Request a Tasting' opens the concierge mailto",
    tastingHref.startsWith("mailto:concierge@noire-chocolate.com") &&
      decodedTasting.includes("Tasting request — NOIRÉ Atelier"),
    tastingHref.slice(0, 120)
  );
// ── Test 4: Product switcher ──────────────────────────────────────────
  console.log("\n[Test 4] Product switcher");
  await clickDesktopNav(page, "Collection");
  await wait(2600);
  await shot(page, "02-collection");

  const tabCount = await page.evaluate(
    () => document.querySelectorAll('#act-7 [role="tab"]').length
  );
  check("Four product tabs present", tabCount === 4, `tabs=${tabCount}`);

  // P1.9 / P4.3 — tablist/tab/tabpanel ARIA wiring
  const tabAttrs = await page.evaluate(() => {
    const tab = document.querySelector('#act-7 [role="tab"]');
    return tab
      ? {
          id: tab.id,
          controls: tab.getAttribute("aria-controls"),
          selected: tab.getAttribute("aria-selected"),
        }
      : null;
  });
  check(
    "Tab ARIA wiring (id / aria-controls / aria-selected)",
    !!tabAttrs &&
      tabAttrs.id.startsWith("tab-") &&
      tabAttrs.controls === "noire-product-panel" &&
      ["true", "false"].includes(tabAttrs.selected ?? ""),
    JSON.stringify(tabAttrs)
  );
  const panelState = await page.evaluate(() => {
    const el = document.getElementById("noire-product-panel");
    return el
      ? { role: el.getAttribute("role"), labelledby: el.getAttribute("aria-labelledby") }
      : null;
  });
  check(
    "Panel role=tabpanel + aria-labelledby present",
    !!panelState && panelState.role === "tabpanel" && !!panelState.labelledby,
    JSON.stringify(panelState)
  );

  for (const p of PRODUCTS) {
    const clicked = await page.evaluate((name) => {
      const tab = Array.from(document.querySelectorAll('#act-7 [role="tab"]')).find(
        (t) => t.textContent.trim().startsWith(name)
      );
      if (!tab) return false;
      tab.click();
      return true;
    }, p.name);
    check(`${p.name} — tab clickable`, clicked);
    await wait(500);

    // P7 — product_selected analytics observed for the correct product
    const selectionEvents = await page.evaluate(() =>
      (window.__NOIRE_EVENTS__ ?? []).filter((e) => e.name === "product_selected")
    );
    check(
      `${p.name} — product_selected analytics fired`,
      selectionEvents.some((e) => e.props?.product === p.id),
      selectionEvents.map((e) => e.props?.product).join(",")
    );

    const state = await page.evaluate(() => {
      const act7 = document.getElementById("act-7");
      const txt = act7 ? act7.textContent : "";
      const h3 = act7?.querySelector("h3")?.textContent?.trim() ?? "";
      const cacao =
        Array.from(act7?.querySelectorAll("span.text-2xl") ?? [])
          .map((s) => s.textContent.trim())
          .find((t) => /^\d+%$/.test(t)) ?? "";
      const cta = Array.from(document.querySelectorAll("a[href^='mailto:']")).find((a) =>
        a.textContent.includes("Request This Bar")
      )?.getAttribute("href") ?? "";
      const allSpans = Array.from(act7?.querySelectorAll("span") ?? []).map((s) =>
        s.textContent.trim()
      );
      const valueAfter = (label) => {
        const idx = allSpans.indexOf(label);
        if (idx < 0) return "";
        const els = act7.querySelectorAll("span");
        return els[idx + 1]?.textContent?.trim() ?? "";
      };
      return {
        txt,
        h3,
        cacao,
        cta,
        terroir: valueAfter("Terroir"),
        ingredients: valueAfter("Ingredients"),
        allergen: valueAfter("Allergen"),
      };
    });

    check(`${p.name} — name updates`, state.h3 === p.name, state.h3);
    check(`${p.name} — subtitle updates`, state.txt.includes(p.subtitle));
    check(`${p.name} — description updates`, state.txt.includes(p.desc));
    check(`${p.name} — cacao percentage updates`, state.cacao === p.cacao, state.cacao);
    check(
      `${p.name} — tasting notes update`,
      p.notes.every((n) => state.txt.includes(n))
    );
    check(`${p.name} — origin updates`, state.terroir.includes(p.origin), state.terroir.slice(0, 60));
    check(`${p.name} — ingredients update`, state.ingredients.includes(p.ingredient), state.ingredients.slice(0, 60));
    check(`${p.name} — allergen information updates`, state.allergen.includes(p.allergen), state.allergen.slice(0, 60));

    const decodedCta = state.cta ? decodeMailto(state.cta) : "";
    check(
      `${p.name} — CTA carries product context`,
      state.cta.startsWith("mailto:concierge@noire-chocolate.com") &&
        decodedCta.includes(p.name) &&
        decodedCta.includes(p.cacao.replace("%", "% cacao")) &&
        decodedCta.includes(p.origin) &&
        /availability/i.test(decodedCta),
      state.cta.slice(0, 140)
    );
  }
// ── Test 5: Concierge CTA ─────────────────────────────────────────────
  console.log("\n[Test 5] Concierge CTA");
  const requestBar = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll("a[href^='mailto:']")).find((x) =>
      x.textContent.includes("Request This Bar")
    );
    return {
      visible: !!a && a.getBoundingClientRect().width > 0,
      href: a?.getAttribute("href") ?? "",
    };
  });
  const decodedBar = requestBar.href ? decodeMailto(requestBar.href) : "";
  check("'Request This Bar' visible on stage", requestBar.visible);
  check(
    "'Request This Bar' pre-fills availability + tasting/date inquiry",
    /availability/i.test(decodedBar) && /tasting dates/i.test(decodedBar)
  );

  // ── Test 5b: Contact trust (P2.4) ─────────────────────────────────────
  console.log("\n[Test 5b] Footer contact links");
  const contactLinks = await page.evaluate(() => {
    const href = (a) => a.getAttribute("href") || "";
    const tel = document.querySelector('footer a[href^="tel:"]');
    const wa = document.querySelector('a[href^="https://wa.me/"]');
    const mailto = document.querySelector('footer a[href^="mailto:"]');
    return {
      telHref: tel ? href(tel) : "",
      waHref: wa ? href(wa) : "",
      mailtoHref: mailto ? href(mailto) : "",
      telEvent: tel?.getAttribute("data-noire-event") ?? "",
      waEvent: wa?.getAttribute("data-noire-event") ?? "",
      mailtoEvent: mailto?.getAttribute("data-noire-event") ?? "",
    };
  });
  // P1 gate: phone/WhatsApp rows render ONLY when ATELIER_PHONE_CONFIGURED
  // is true in src/lib/site.ts. While the placeholder is unconfigured they
  // must be ABSENT (no live links to a fake number); flip these assertions
  // back to presence checks the day the real line goes live.
  check(
    "tel: correctly absent while placeholder unconfigured",
    contactLinks.telHref === "",
    contactLinks.telHref.slice(0, 40) || "(absent as intended)"
  );
  check(
    "WhatsApp correctly absent while placeholder unconfigured",
    contactLinks.waHref === "",
    contactLinks.waHref.slice(0, 90) || "(absent as intended)"
  );
  check(
    "Footer concierge mailto present",
    contactLinks.mailtoHref.startsWith("mailto:concierge@noire-chocolate.com"),
    contactLinks.mailtoHref.slice(0, 70) || "(missing)"
  );
  check("phone_click analytics unwired while absent", contactLinks.telEvent === "");
  check("whatsapp_click analytics unwired while absent", contactLinks.waEvent === "");
  check("contact_click analytics wired", contactLinks.mailtoEvent === "contact_click");

  // ── Test 6: Chocolate Room modal ──────────────────────────────────────
  console.log("\n[Test 6] Chocolate Room modal");

  await page.evaluate(() => {
    document.getElementById("act-8").scrollIntoView({ behavior: "auto" });
  });
  await wait(1000);
  await shot(page, "03-epilogue");

  const openModal = async () => {
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Enter the Chocolate Room")
      );
      if (!btn) return false;
      btn.focus(); // focus first so focus-return is assertable after close
      btn.click();
      return true;
    });
    return clicked;
  };

  check("Trigger 'Enter the Chocolate Room' found", await openModal());
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {});
  await wait(400);

  const dialog = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return { open: false };
    return {
      open: true,
      titled: !!Array.from(d.querySelectorAll("h2")).find((h) =>
        h.textContent.includes("THE CHOCOLATE ROOM")
      ),
      focusedInside: !!document.activeElement?.closest('[role="dialog"]'),
      scrollLocked: document.body.hasAttribute("data-scroll-locked"),
    };
  });
  check("Modal opens", dialog.open);
  check("Modal shows 'THE CHOCOLATE ROOM' title", dialog.titled);
  check("Focus moves into the dialog", dialog.focusedInside);
  check("Page scroll locked while open", dialog.scrollLocked);
  const roomEvents = await page.evaluate(() =>
    (window.__NOIRE_EVENTS__ ?? []).some((e) => e.name === "chocolate_room_open")
  );
  check("chocolate_room_open analytics fired", roomEvents);
  await shot(page, "04-chocolate-room-modal");

  await page.keyboard.press("Escape");
  await wait(500);
  const closedByEsc = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
  check("Escape closes the modal", closedByEsc);
  check(
    "Focus returns to trigger after Escape",
    await page.evaluate(() =>
      !!document.activeElement?.textContent?.includes("Enter the Chocolate Room")
    )
  );

  await openModal();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {});
  await wait(400);

  const closeByButton = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
      b.textContent.trim() === "Close"
    );
    if (!btn) return { clicked: false };
    btn.click();
    return { clicked: true };
  });
  check("Close button exists in the modal", closeByButton.clicked);
  await wait(500);

  const afterClose = await page.evaluate(() => ({
    gone: !document.querySelector('[role="dialog"]'),
    focusReturned: !!document.activeElement?.textContent?.includes("Enter the Chocolate Room"),
    scrollLocked: document.body.hasAttribute("data-scroll-locked"),
  }));
  check("Close button closes the modal", afterClose.gone);
  check("Focus returns to the trigger after close", afterClose.focusReturned);
  check("Page scroll lock released after close", !afterClose.scrollLocked);

  const scrollMoves = await page.evaluate(() => {
    const before = window.scrollY;
    window.scrollTo(0, Math.max(0, before - 400));
    return window.scrollY < before;
  });
  check("Page scrollable again after close", scrollMoves);
// ── Test 7: Mobile ────────────────────────────────────────────────────
  const mobileViewports = [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
  ];

  for (const vp of mobileViewports) {
    const tag = `${vp.width}x${vp.height}`;
    console.log(`\n[Test 7] Mobile ${tag}`);
    await page.setViewport(vp);
    await wait(600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(400);

    const offenders = await horizontalOffenders(page);
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    check(
      `${tag} — no horizontal overflow`,
      scrollW <= vp.width + 1 && offenders.length === 0,
      offenders.length
        ? offenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
        : `scrollW=${scrollW}`
    );
    await shot(page, `05-mobile-${vp.width}-hero`);

    // Menu opens
    const menuTrigger = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (!btn) return false;
      btn.click();
      return true;
    });
    await wait(400);
    check(`${tag} — menu opens`, menuTrigger);
    const menuVisible = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#noire-mobile-menu button")).some((b) =>
        b.textContent.includes("The Craving")
      )
    );
    check(`${tag} — menu contents visible`, menuVisible);

    // P1.5 — toggle reflects state
    const expanded = await page.evaluate(
      () => document.querySelector('button[aria-label="Toggle navigation menu"]')?.getAttribute("aria-expanded")
    );
    check(`${tag} — menu toggle aria-expanded=true`, expanded === "true", expanded ?? "(missing)");

    // Menu navigates + auto-closes (P1 nav-unification: all eight canonical
    // chapters; target via data attribute, not positional index)
    await page.evaluate(() => {
      const btn = document.querySelector(
        '#noire-mobile-menu button[data-noire-target="#act-6"]'
      );
      if (btn) btn.click();
    });
    await wait(2600);
    const sensory = await sectionPosition(page, "#act-6");
    check(`${tag} — menu item navigates to #act-6`, sensory.ok, sensory.detail);
    const menuClosed = await page.evaluate(
      () => !document.querySelector("#noire-mobile-menu")
    );
    check(`${tag} — menu closes after selection`, menuClosed);

    // P1.5/P4.2 — focus returns to the toggle after a selection closes the menu
    const focusBack = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-label") === "Toggle navigation menu"
    );
    check(`${tag} — focus returns to menu toggle after selection`, focusBack);

    // P1.5 — Escape closes the menu and restores body scroll
    await page.evaluate(() => {
      document.querySelector('button[aria-label="Toggle navigation menu"]')?.click();
    });
    await wait(300);
    await page.keyboard.press("Escape");
    await wait(300);
    const escClosed = await page.evaluate(() => !document.querySelector("#noire-mobile-menu"));
    check(`${tag} — Escape closes the mobile menu`, escClosed);
    const scrollRestored = await page.evaluate(() => document.body.style.overflow === "");
    check(`${tag} — body scroll restored after menu close`, scrollRestored);

    // Primary CTA remains reachable in the fixed header
    const ctaVisible = await page.evaluate(() => {
      const a = document.querySelector('header a[aria-label*="Request a tasting"]');
      if (!a) return false;
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    check(`${tag} — header CTA reachable on mobile`, ctaVisible);

    // Product selector usable + product detail does not clip
    await page.evaluate(() => {
      document.getElementById("act-7").scrollIntoView({ behavior: "auto" });
    });
    await wait(1200);
    const switched = await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('#act-7 [role="tab"]')).find((t) =>
        t.textContent.trim().startsWith("DARK SEA SALT")
      );
      if (!tab) return false;
      tab.click();
      return true;
    });
    await wait(400);
    const productName = await page.evaluate(
      () => document.querySelector("#act-7 h3")?.textContent?.trim() ?? ""
    );
    check(
      `${tag} — product switcher usable (DARK SEA SALT)`,
      switched && productName === "DARK SEA SALT",
      productName
    );

    const detailOffenders = await horizontalOffenders(page, "#act-7 *");
    check(
      `${tag} — product detail does not clip`,
      detailOffenders.length === 0,
      detailOffenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
    );
    await shot(page, `06-mobile-${vp.width}-product`);

    // Modal fits viewport
    await page.evaluate(() => {
      document.getElementById("act-8").scrollIntoView({ behavior: "auto" });
    });
    await wait(1000);
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Enter the Chocolate Room")
      );
      if (btn) btn.click();
    });
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 }).catch(() => {});
    await wait(500);
    const fit = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return { fit: false, rect: "no dialog", vw: "" };
      const r = d.getBoundingClientRect();
      return {
        fit:
          r.left >= -1 &&
          r.right <= window.innerWidth + 1 &&
          r.top >= -1 &&
          r.bottom <= window.innerHeight + 1,
        rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.right)},${Math.round(r.bottom)}`,
        vw: `${window.innerWidth}x${window.innerHeight}`,
      };
    });
    check(`${tag} — modal fits viewport`, fit.fit, `${fit.rect} in ${fit.vw}`);
    await shot(page, `07-mobile-${vp.width}-modal`);
    await page.keyboard.press("Escape");
    await wait(400);
  }
// ── Test 7b: Additional viewport overflow sweep (P8) ──────────────────
  console.log("\n[Test 7b] Viewport overflow sweep");
  for (const vp of [
    { width: 414, height: 896 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    const tag = `${vp.width}x${vp.height}`;
    await page.setViewport(vp);
    await wait(500);
    const offenders = await horizontalOffenders(page);
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    check(
      `${tag} — no horizontal overflow`,
      scrollW <= vp.width + 1 && offenders.length === 0,
      offenders.length
        ? offenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
        : `scrollW=${scrollW}`
    );
    await shot(page, `09-viewport-${vp.width}`);
  }
// ── Test 8: Reduced motion ────────────────────────────────────────────
  console.log("\n[Test 8] Reduced motion");
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(1500);

  const motionToggle = await page.evaluate(() => {
    const btn = document.querySelector('header button[aria-label="Enable cinematic scroll motion"]');
    return btn
      ? { present: true, pressed: btn.getAttribute("aria-pressed"), text: btn.textContent.trim() }
      : { present: false };
  });
  check(
    "Motion toggle reflects reduced motion",
    motionToggle.present &&
      motionToggle.pressed === "true" &&
      /Motion Off/.test(motionToggle.text),
    JSON.stringify(motionToggle)
  );

  const cssMotion = await page.evaluate(() => {
    // Probe the Act I scroll cue (animate-drift; legacy animate-bounce).
    const el = document.querySelector(".animate-drift, .animate-bounce");
    if (!el) return "no-element";
    return getComputedStyle(el).animationDuration;
  });
  check(
    "CSS motion neutralised under reduced motion",
    cssMotion === "0.01ms" || parseFloat(cssMotion) < 1,
    cssMotion
  );

  const canvasState = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll("canvas"));
    const main = canvases.find((c) => c.getAttribute("role") === "img");
    const dims = main ? `${main.width}x${main.height}` : "none";
    return {
      count: canvases.length,
      mainExists: !!main,
      mainPainted: dims.split("x")[0] !== "0" && dims.split("x")[1] !== "0",
      mainDims: dims,
    };
  });
  check(
    "Cinematic canvas renders a static frame",
    canvasState.mainExists && canvasState.mainPainted,
    canvasState.mainDims
  );
  check(
    "Ambient particles not mounted under reduced motion",
    canvasState.count === 1,
    `canvases=${canvasState.count}`
  );

  await shot(page, "08-reduced-motion-hero");

  // Keyboard: first Tab targets the skip link (P4.1)
  await page.keyboard.press("Tab");
  const focusTarget = await page.evaluate(() => {
    const el = document.activeElement;
    return el
      ? el.classList.contains("skip-link")
        ? "skip-link"
        : `${el.tagName}:${(el.textContent || "").trim().slice(0, 30)}`
      : "none";
  });
  check("First Tab focuses skip-to-content link", focusTarget === "skip-link", focusTarget);

  // Native scrolling works — no Lenis smoothing active
  await page.evaluate(() => {
    const target = document.getElementById("act-7");
    if (target) window.scrollTo(0, target.offsetTop);
  });
  await wait(600);
  const scrollY = await page.evaluate(() => window.scrollY);
  check("Native scroll reaches deep sections under reduced motion", scrollY > 1000, `y=${scrollY}`);

  // Navigation still works via the non-Lenis fallback path
  await clickDesktopNav(page, "Origin");
  await wait(900);
  const originPos = await sectionPosition(page, "#act-2");
  check("Nav still navigates under reduced motion", originPos.ok, originPos.detail);

  // P4.1 — keyboard-only: focus a nav button and press Enter
  const keyboardFocusable = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("header nav button")).find(
      (b) => b.textContent.trim() === "Collection"
    );
    if (!btn) return false;
    btn.focus();
    return document.activeElement === btn;
  });
  check("Keyboard can focus a desktop nav button", keyboardFocusable);
  await page.keyboard.press("Enter");
  await wait(2600);
  const afterEnter = await sectionPosition(page, "#act-7");
  check("Enter activates nav scroll (P4.1)", afterEnter.ok, afterEnter.detail);

  let actsOk = true;
  for (let act = 1; act <= 8; act++) {
    const ok = await page.evaluate((n) => !!document.getElementById(`act-${n}`), act);
    actsOk = actsOk && ok;
  }
  check("All eight acts readable under reduced motion", actsOk);

  // ── Test 9: OpenDesign additions — hero variant + tasting interlude ──
  console.log("\n[Test 9] Hero variant + tasting interlude");
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const errBase = consoleErrors.length;
  const pageErrBase = pageErrors.length;
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1500);
  const defaultHero = await page.$eval("#act-1", (el) => el.innerText).catch(() => "");
  check(
    "Default route renders Nocturne headline",
    /Darkness,/.test(defaultHero) && /tempered/.test(defaultHero),
    defaultHero.replace(/\s+/g, " ").slice(0, 80)
  );
  check(
    "Default route replaces classic hero",
    !/Something worth waiting for/.test(defaultHero)
  );
  check(
    "Default hero adds no console/page errors (no hydration mismatch)",
    consoleErrors.length === errBase && pageErrors.length === pageErrBase,
    `console+${consoleErrors.length - errBase} page+${pageErrors.length - pageErrBase}`
  );
  const nocturneMailto = await page.$eval(
    '#act-1 a[data-noire-event="request_tasting_click"]',
    (el) => el.getAttribute("href")
  ).catch(() => null);
  check(
    "Nocturne tasting CTA targets concierge mailto",
    !!nocturneMailto && decodeMailto(nocturneMailto).includes("Request a Tasting"),
    (nocturneMailto || "missing").slice(0, 60)
  );
  await shot(page, "10-hero-nocturne");

  await page.goto(`${BASE}/?hero=classic`, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1500);
  const classicHero = await page.$eval("#act-1", (el) => el.innerText).catch(() => "");
  check(
    "Classic route restores original hero",
    /Something worth waiting for/.test(classicHero) && !/Darkness,/.test(classicHero),
    classicHero.replace(/\s+/g, " ").slice(0, 80)
  );

  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1500);
  const tasting = await page.$eval("#tasting", (el) => el.innerText).catch(() => "");
  check(
    "Tasting interlude present with heading",
    /THE TASTING RITUAL/.test(tasting) && /movements/.test(tasting),
    tasting.replace(/\s+/g, " ").slice(0, 80)
  );
  const movements = await page.$$eval("#tasting h3", (els) =>
    els.map((el) => el.textContent.trim()).join(",")
  ).catch(() => "");
  check("Tasting renders all three movements", movements === "Look,Breathe,Melt", movements);
  const tastingMailto = await page.$eval(
    '#tasting a[data-noire-event="request_tasting_click"]',
    (el) => el.getAttribute("href")
  ).catch(() => null);
  check(
    "Tasting mailto CTA targets concierge",
    !!tastingMailto && decodeMailto(tastingMailto).includes("Request a Tasting"),
    (tastingMailto || "missing").slice(0, 60)
  );
  const roomBtn = await page.$('#tasting button[data-noire-event="chocolate_room_open"]');
  check("Tasting Chocolate Room button present", !!roomBtn);
  const order = await page.evaluate(() => {
    const tops = ["act-8", "tasting"].map((id) => document.getElementById(id)?.offsetTop ?? -1);
    const footerTop = document.querySelector("footer")?.offsetTop ?? -1;
    return { act8: tops[0], tasting: tops[1], footer: footerTop };
  });
  check(
    "Tasting sits between Act VIII and footer",
    order.act8 >= 0 && order.act8 < order.tasting && order.tasting < order.footer,
    `act-8=${order.act8} tasting=${order.tasting} footer=${order.footer}`
  );
  await page.setViewport({ width: 375, height: 812 });
  await wait(500);
  const tastingOffenders = await horizontalOffenders(page, "#tasting *");
  check(
    "Tasting has no horizontal offenders at 375px",
    tastingOffenders.length === 0,
    tastingOffenders.length
      ? tastingOffenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
      : "clean"
  );
  await shot(page, "10-tasting-375");

  // ── Test 10: Reserve Drop interlude ───────────────────────────────────
  console.log("\n[Test 10] Reserve Drop interlude");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1500);
  const drop = await page.$eval("#reserve-drop", (el) => el.innerText).catch(() => "");
  check(
    "Reserve Drop present with heading",
    /THE RESERVE DROP/.test(drop) && /gone quietly/.test(drop),
    drop.replace(/\s+/g, " ").slice(0, 80)
  );
  const dropMailto = await page.$eval(
    '#reserve-drop a[data-noire-event="request_bar_click"]',
    (el) => el.getAttribute("href")
  ).catch(() => null);
  check(
    "Reserve List CTA targets concierge mailto",
    !!dropMailto && decodeMailto(dropMailto).includes("Join the Reserve List"),
    (dropMailto || "missing").slice(0, 60)
  );
  const dropExplore = await page.$('#reserve-drop button[data-noire-label="reserve drop explore collection"]');
  check("Reserve Drop collection button present", !!dropExplore);
  const dropOrder = await page.evaluate(() => {
    const tops = ["tasting", "reserve-drop"].map((id) => document.getElementById(id)?.offsetTop ?? -1);
    const footerTop = document.querySelector("footer")?.offsetTop ?? -1;
    return { tasting: tops[0], drop: tops[1], footer: footerTop };
  });
  check(
    "Reserve Drop sits between tasting and footer",
    dropOrder.tasting >= 0 && dropOrder.tasting < dropOrder.drop && dropOrder.drop < dropOrder.footer,
    `tasting=${dropOrder.tasting} drop=${dropOrder.drop} footer=${dropOrder.footer}`
  );
  await page.setViewport({ width: 375, height: 812 });
  await wait(500);
  const dropOffenders = await horizontalOffenders(page, "#reserve-drop *");
  check(
    "Reserve Drop has no horizontal offenders at 375px",
    dropOffenders.length === 0,
    dropOffenders.length
      ? dropOffenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
      : "clean"
  );
  await shot(page, "10-reserve-drop-375");

  // ── Test 11: Interactivity (marquee / timer / accordion / reveal) ─────
  console.log("\n[Test 11] Interactivity");
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 90000 });
  await wait(1500);

  const marqueeText = await page.$eval("#origins", (el) => el.innerText).catch(() => "");
  check(
    "Origins marquee present with product origins",
    /TUMACO, COLOMBIA/i.test(marqueeText) && /SAMBIRANO VALLEY, MADAGASCAR/i.test(marqueeText),
    marqueeText.replace(/\s+/g, " ").slice(0, 80)
  );
  const marqueeDup = await page.$$eval("#origins > div > span", (els) =>
    els.length > 0 && els[els.length - 1].getAttribute("aria-hidden") === "true"
  ).catch(() => false);
  check("Marquee loop half is aria-hidden", marqueeDup);
  const marqueeAnim = await page.evaluate(() => {
    const el = document.querySelector("#origins .animate-marquee");
    return el ? getComputedStyle(el).animationName : "missing";
  });
  check("Marquee animation running", marqueeAnim === "noire-marquee", marqueeAnim);
  await page.evaluate(() => window.scrollTo(0, 2500));
  await wait(600);
  const marqueeBoost = await page.evaluate(() => {
    const el = document.querySelector("#origins .animate-marquee");
    return el ? getComputedStyle(el).animationDuration : "missing";
  });
  check(
    "Marquee reacts to scroll velocity",
    marqueeBoost !== "missing" && parseFloat(marqueeBoost) < 36,
    `duration=${marqueeBoost}`
  );
  await page.setViewport({ width: 375, height: 812 });
  await wait(500);
  const marqueeOffenders = await horizontalOffenders(page, "#origins *");
  const marqueeScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  check(
    "Marquee has no horizontal offenders at 375px",
    marqueeOffenders.length === 0 && marqueeScrollW <= 376,
    marqueeOffenders.length
      ? marqueeOffenders.map((o) => `${o.tag}:${o.cls}`).slice(0, 3).join(", ")
      : `scrollW=${marqueeScrollW}`
  );
  await page.setViewport({ width: 1440, height: 900 });
  await wait(500);

  const timerInit = await page.$eval('[data-testid="timer-time"]', (el) => el.textContent?.trim() ?? "").catch(() => "");
  check("Timer starts at 01:30 with Begin", timerInit === "01:30", timerInit);
  await page.evaluate(() => {
    document.querySelector("#tasting-timer button")?.scrollIntoView({ block: "center" });
  });
  await wait(400);
  await page.evaluate(() => {
    const timerBtn0 = document.querySelector("#tasting-timer button");
    if (timerBtn0) timerBtn0.click();
  });
  await wait(1600);
  const timerAfter = await page.$eval('[data-testid="timer-time"]', (el) => el.textContent?.trim() ?? "").catch(() => "");
  const timerBtn = await page.$eval("#tasting-timer button", (el) => el.textContent?.trim() ?? "").catch(() => "");
  check("Timer counts down after Begin", timerAfter !== "" && timerAfter < "01:30", `${timerInit} -> ${timerAfter}`);
  check("Timer button toggles to Pause while running", timerBtn === "Pause", timerBtn);
  await page.evaluate(() => {
    const btns = document.querySelectorAll("#tasting-timer button");
    if (btns[1]) btns[1].click();
  });
  await wait(400);
  const timerReset = await page.$eval('[data-testid="timer-time"]', (el) => el.textContent?.trim() ?? "").catch(() => "");
  check("Timer Reset restores 01:30", timerReset === "01:30", timerReset);

  const notesInit = await page.$$eval("#atelier-notes button[aria-expanded]", (els) =>
    els.map((el) => el.getAttribute("aria-expanded")).join(",")
  ).catch(() => "");
  check("Accordion has 4 notes, all collapsed", notesInit === "false,false,false,false", notesInit);
  await page.evaluate(() => {
    document.getElementById("atelier-note-btn-0")?.scrollIntoView({ block: "center" });
  });
  await wait(400);
  await page.click("#atelier-note-btn-0");
  await wait(400);
  const note0 = await page.evaluate(() => ({
    expanded: document.getElementById("atelier-note-btn-0")?.getAttribute("aria-expanded"),
    panel: !!document.getElementById("atelier-note-panel-0"),
  }));
  check("Accordion click expands first note", note0.expanded === "true" && note0.panel, JSON.stringify(note0));
  await page.focus("#atelier-note-btn-1");
  await page.keyboard.press("Enter");
  await wait(400);
  const note1 = await page.evaluate(() =>
    document.getElementById("atelier-note-btn-1")?.getAttribute("aria-expanded")
  );
  check("Accordion keyboard Enter expands second note", note1 === "true", `aria-expanded=${note1}`);
  await shot(page, "11-atelier-notes-open");

  await page.evaluate(() => {
    document.getElementById("tasting-heading")?.scrollIntoView({ block: "center" });
  });
  await wait(1000);
  const revealOpacity = await page.evaluate(() => {
    const h = document.getElementById("tasting-heading");
    const wrap = h?.closest("div[class*='opacity-']") ?? h?.parentElement;
    return wrap ? getComputedStyle(wrap).opacity : "unknown";
  });
  check("Reveal shows tasting heading on scroll", revealOpacity === "1", `opacity=${revealOpacity}`);

  // ── Summary ───────────────────────────────────────────────────────────
  console.log("\n──────────────────────────────────────────────────");
  console.log("BROWSER REGRESSION SUMMARY");
  console.log(`Checks passed : ${results.filter((r) => r.ok).length}/${results.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Page errors   : ${pageErrors.length}`);
  console.log(`Screenshots   : ${shotDir}`);
  if (consoleErrors.length) console.log(consoleErrors.slice(0, 8));
  await browser.close();

  if (failures > 0 || pageErrors.length > 0) {
    console.error(`\nFAILED (${failures} check(s) failed, ${pageErrors.length} runtime error(s))`);
    process.exit(1);
  }
  console.log("\nALL REGRESSION CHECKS PASSED.");
})().catch((err) => {
  console.error("Regression suite crashed:", err);
  process.exit(1);
});