/**
 * Writes src/content/blur.json: a tiny preview of every photo in public/photos,
 * keyed by its path ("/photos/home-hero.jpg"). <Photo> paints it as the frame's
 * background, so a photo that is still loading shows a soft color preview of
 * itself instead of an empty box. About 200 characters per photo.
 *
 * Run after adding or replacing photos:  npm run photos:blur
 * Uses the sharp that ships with Next.js (no extra install).
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("scripts/blur.mjs: sharp is not available here; src/content/blur.json was left as it is.");
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/photos");
const out = {};
for (const file of (await readdir(dir)).sort()) {
  // JPEGs only: PNG cutouts keep their transparency and get no preview.
  if (!/\.jpe?g$/i.test(file)) continue;
  const buf = await sharp(path.join(dir, file)).resize({ width: 16 }).webp({ quality: 50 }).toBuffer();
  out[`/photos/${file}`] = `data:image/webp;base64,${buf.toString("base64")}`;
}
await writeFile(path.join(root, "src/content/blur.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(`src/content/blur.json: ${Object.keys(out).length} photos, ${JSON.stringify(out).length} bytes`);
