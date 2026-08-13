// Vuelve transparente el fondo gris (#f2f2f2) de public/img/categorias/marcas-banda.webp
// usando flood-fill desde las cuatro esquinas (no toca grises internos de los logos).

import sharp from "sharp";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";

const src = "public/img/categorias/marcas-banda.webp";
const backup = "public/img/categorias/marcas-banda.original.webp";
const dst = src;

const TOLERANCIA = 18;          // distancia RGB máx respecto al color semilla
const SEED = { r: 242, g: 242, b: 242 };

if (!existsSync(backup)) {
  copyFileSync(src, backup);
  console.log(`→ backup guardado en ${backup}`);
}

const img = sharp(src).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const buf = Buffer.from(data); // mutable copy

const idx = (x, y) => (y * width + x) * channels;

function similar(i) {
  const dr = Math.abs(buf[i]     - SEED.r);
  const dg = Math.abs(buf[i + 1] - SEED.g);
  const db = Math.abs(buf[i + 2] - SEED.b);
  return dr <= TOLERANCIA && dg <= TOLERANCIA && db <= TOLERANCIA;
}

const visited = new Uint8Array(width * height);
const queue = [];

// Semillas: las 4 esquinas
for (const [sx, sy] of [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]]) {
  queue.push([sx, sy]);
}

let cleared = 0;
while (queue.length) {
  const [x, y] = queue.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;
  const key = y * width + x;
  if (visited[key]) continue;
  visited[key] = 1;
  const i = idx(x, y);
  if (!similar(i)) continue;
  buf[i + 3] = 0; // alpha 0
  cleared++;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

console.log(`→ pixeles hechos transparentes: ${cleared} / ${width * height}`);

const out = await sharp(buf, { raw: { width, height, channels } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toBuffer();

let lastErr;
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    writeFileSync(dst, out);
    console.log(`✓ ${dst} regrabado (${out.length} bytes) en intento ${attempt}`);
    lastErr = null;
    break;
  } catch (e) {
    lastErr = e;
    await new Promise((r) => setTimeout(r, 400));
  }
}
if (lastErr) {
  const fallback = "public/img/categorias/marcas-banda-nofondo.webp";
  writeFileSync(fallback, out);
  console.warn(`! No se pudo sobrescribir ${dst} (¿dev server bloqueando?). Guardado en ${fallback}`);
  console.warn(`  Para reemplazar: detén el dev server y mueve ${fallback} → ${dst}`);
}
