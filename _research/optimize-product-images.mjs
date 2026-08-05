// Convierte todas las imágenes descargadas del scraper a WebP optimizado.
// Input:  ./product-scrape/images/*.{jpg,jpeg,png}
// Output: ./product-scrape/images-webp/*.webp
// Idempotente: no reprocesa si el .webp ya existe con mismo mtime.

import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";

const SRC = "./product-scrape/images";
const OUT = "./product-scrape/images-webp";

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = await readdir(SRC);
  let inSize = 0, outSize = 0, count = 0, skipped = 0;
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
    const src = join(SRC, f);
    const name = basename(f, ext);
    const outPath = join(OUT, `${name}.webp`);
    const stIn = await stat(src);
    if (existsSync(outPath)) {
      const stOut = await stat(outPath);
      if (stOut.mtimeMs > stIn.mtimeMs) {
        skipped++;
        outSize += stOut.size;
        inSize += stIn.size;
        continue;
      }
    }
    try {
      const img = sharp(src);
      const meta = await img.metadata();
      const pipeline = img.webp({ quality: 82, effort: 5 });
      if (meta.width && meta.width > 1600) pipeline.resize({ width: 1600, withoutEnlargement: true });
      await pipeline.toFile(outPath);
      const stOut = await stat(outPath);
      inSize += stIn.size;
      outSize += stOut.size;
      count++;
      if (count % 25 === 0) console.log(`  [${count}] ${f} → ${name}.webp (${(stOut.size / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.error(`  ✗ ${f}: ${e.message}`);
    }
  }
  const savings = inSize > 0 ? (100 - (outSize / inSize) * 100).toFixed(0) : 0;
  console.log(`\n✓ Converted ${count} | Skipped ${skipped}`);
  console.log(`  ${(inSize / 1024 / 1024).toFixed(2)} MB → ${(outSize / 1024 / 1024).toFixed(2)} MB (${savings}% menos)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
