import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, relative, dirname, extname, basename } from 'node:path';
import sharp from 'sharp';

const srcRoot = '../web/public/originals';
const outRoot = '../web/public/img';

async function* walk(dir) {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalIn = 0, totalOut = 0, count = 0;
for await (const src of walk(srcRoot)) {
  const ext = extname(src).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const rel = relative(srcRoot, src);
  const outDir = join(outRoot, dirname(rel));
  await mkdir(outDir, { recursive: true });
  const name = basename(src, ext);
  const outPath = join(outDir, `${name}.webp`);
  const stIn = await stat(src);
  totalIn += stIn.size;
  const img = sharp(src);
  const meta = await img.metadata();
  const pipeline = img.webp({ quality: 82, effort: 5 });
  if (meta.width && meta.width > 1920) pipeline.resize({ width: 1920, withoutEnlargement: true });
  await pipeline.toFile(outPath);
  const stOut = await stat(outPath);
  totalOut += stOut.size;
  count++;
  console.log(`${rel} (${(stIn.size/1024).toFixed(0)}KB) -> webp (${(stOut.size/1024).toFixed(0)}KB) ${(100 - stOut.size/stIn.size*100).toFixed(0)}% smaller`);
}
console.log(`\n${count} images | ${(totalIn/1024/1024).toFixed(2)}MB -> ${(totalOut/1024/1024).toFixed(2)}MB (${(100 - totalOut/totalIn*100).toFixed(0)}% savings)`);
