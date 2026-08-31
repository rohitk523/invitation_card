// Renders overlay.html to transparent PNG frames by pausing all CSS
// animations and stepping their currentTime deterministically.
// Usage: node render-overlay.mjs [durationSeconds=13] [fps=30]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DURATION = Number(process.argv[2] ?? 13);
const FPS = Number(process.argv[3] ?? 30);
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out", "overlay");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 720, height: 1280 },
  deviceScaleFactor: 1,
});
await page.goto("file://" + join(here, "overlay.html"));
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  document.getAnimations({ subtree: true }).forEach((a) => a.pause());
});

const total = Math.round(DURATION * FPS);
for (let f = 0; f < total; f++) {
  const t = (f / FPS) * 1000;
  await page.evaluate((ms) => {
    document.getAnimations({ subtree: true }).forEach((a) => { a.currentTime = ms; });
  }, t);
  await page.screenshot({
    path: join(outDir, `f_${String(f).padStart(4, "0")}.png`),
    omitBackground: true,
  });
  if (f % 60 === 0) console.log(`frame ${f}/${total}`);
}
await browser.close();
console.log(`Rendered ${total} frames to ${outDir}`);
