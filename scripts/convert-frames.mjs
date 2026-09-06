/**
 * NOIRÉ frame-sequence converter (Phase 1.1 of noire-website-plan.md)
 *
 * Converts the raw 192× 1280x720 JPG frames in public/frames/ into:
 *   1. public/frames/webp/        — 192 desktop frames, 1152w WebP q42 (~4.4MB total budget)
 *   2. public/frames/webp-mobile/ — every 3rd frame (64 total), 768w WebP q55 (mobile scrubber)
 *   3. public/og-image.jpg        — 1200x630 social card generated from frame_0096
 *
 * Desktop budget note (2026-09-06 audit): 1280w q60 shipped ~6.5MB; 1152w q42
 * ships ~4.4MB with no visible loss on atmospheric plates (verified
 * side-by-side on frame_0001). Keep desktop under ~4.5MB on regeneration —
 * prefer lowering quality before touching resolution or frame count, so the
 * scrubber's temporal resolution never changes silently.
 *
 * Usage:
 *   node scripts/convert-frames.mjs            # convert only
 *   node scripts/convert-frames.mjs --clean    # convert AND delete original JPGs
 *
 * Original JPGs remain recoverable from git history after --clean.
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "frames");
const DESKTOP_DIR = path.join(SRC, "webp");
const MOBILE_DIR = path.join(SRC, "webp-mobile");

const CLEAN = process.argv.includes("--clean");

mkdirSync(DESKTOP_DIR, { recursive: true });
mkdirSync(MOBILE_DIR, { recursive: true });

const files = readdirSync(SRC)
  .filter((f) => /^frame_\d{4}\.jpg$/.test(f))
  .sort();

if (files.length === 0) {
  console.error("No frame_XXXX.jpg files found in", SRC);
  process.exit(1);
}

const formatKB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

let desktopTotal = 0;
let mobileTotal = 0;
let desktopCount = 0;
let mobileCount = 0;

for (const f of files) {
  const num = parseInt(f.match(/\d{4}/)[0], 10); // 1..192
  const srcPath = path.join(SRC, f);
  const outName = f.replace(/\.jpg$/, ".webp");
  const img = sharp(srcPath);

  // Desktop: 1152w WebP q42 (audit budget — see header note)
  const dInfo = await img
    .clone()
    .resize({ width: 1152 })
    .webp({ quality: 42, effort: 4, smartSubsample: true })
    .toFile(path.join(DESKTOP_DIR, outName));
  desktopTotal += dInfo.size;
  desktopCount += 1;

  // Mobile subset: every 3rd source frame (num-1 divisible by 3), 768w WebP q55
  if ((num - 1) % 3 === 0) {
    const mInfo = await img
      .clone()
      .resize({ width: 768 })
      .webp({ quality: 55, effort: 4, smartSubsample: true })
      .toFile(path.join(MOBILE_DIR, outName));
    mobileTotal += mInfo.size;
    mobileCount += 1;
  }

  if (CLEAN) {
    rmSync(srcPath);
  }
}

// Social share card (PNG-free zone: JPEG for maximum scraper compatibility)
const ogInfo = await sharp(path.join(SRC, "frame_0096.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82 })
  .toFile(path.join(ROOT, "public", "og-image.jpg"));

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;

console.log(`Desktop frames : ${desktopCount} files, total ${mb(desktopTotal)} (avg ${kb(desktopTotal / desktopCount)})`);
console.log(`Mobile frames  : ${mobileCount} files, total ${mb(mobileTotal)} (avg ${kb(mobileTotal / mobileCount)})`);
console.log(`OG image       : ${formatKB(ogInfo.size)} -> public/og-image.jpg`);
console.log(`Originals      : ${CLEAN ? "deleted (recoverable from git history)" : "kept — run with --clean to remove"}`);
