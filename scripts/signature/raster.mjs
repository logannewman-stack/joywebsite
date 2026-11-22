// Step 1 of 2 for the signature's pen path (see trace.py): rasterize the handwritten part of
// the wordmark, white on black, at 3 px per SVG unit.
//   node scripts/signature/raster.mjs public/brand/dr-joy-rdh-wordmark-cream.svg /tmp/script3.png
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const [src, out] = process.argv.slice(2);
const SCALE = 3;
const svg = readFileSync(src, "utf8");
const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const W = Math.round(w * SCALE), H = Math.round(h * SCALE);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0;background:#000">${svg.replace("<svg ", `<svg width="${W}" height="${H}" style="display:block" shape-rendering="crispEdges" `)}</body>`);
// The serif capitals (paths 1 to 3 in the file) are type, not handwriting: they are not traced.
await page.evaluate(() => {
  const paths = [...document.querySelectorAll("path")];
  [1, 2, 3].forEach((i) => (paths[i].style.display = "none"));
  paths.forEach((el) => (el.style.fill = "#fff"));
});
await page.screenshot({ path: out });
await browser.close();
console.log(out, W, H);
