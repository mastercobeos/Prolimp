// Extrae la foto del hero de PLEC (botellas en estrella) desde la lámina del
// mockup, porque es arte propio de Prolimp y no existe como archivo suelto.
//
// La marca de agua de Canva cae FUERA de la tarjeta, así que recortando sólo su
// interior la imagen sale limpia. A 542px es corta para un hero, así que se
// pasa por Real-ESRGAN antes de guardar.
//
// Uso: node scripts/extraer-hero-plec.mjs

import { existsSync } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const LAMINA = "C:/Users/cobeo/OneDrive/Escritorio/Web Prolimp 2026/11.png";
const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const TMP_DIR = "./upscale-tmp";
const DESTINO = "./public/img/redesign/plec-hero.webp";
const ANCHO = 1200;

// Interior de la tarjeta, medido sobre la lámina de 1366px. Va metido unos
// píxeles hacia adentro para que no entren las esquinas redondeadas.
const RECORTE = { left: 800, top: 208, width: 522, height: 514 };

function runPython(args) {
  return new Promise((res, rej) => {
    const p = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c === 0 ? res() : rej(new Error(err))));
    p.on("error", rej);
  });
}

if (!existsSync(LAMINA)) {
  console.error(`No existe la lámina: ${LAMINA}`);
  process.exit(1);
}
await mkdir(TMP_DIR, { recursive: true });

const recorte = join(TMP_DIR, "plec-hero-recorte.png");
await sharp(LAMINA).extract(RECORTE).png().toFile(recorte);
console.log(`recorte: ${RECORTE.width}x${RECORTE.height}`);

await runPython([recorte, String(ANCHO)]);
const escalado = recorte.replace(/\.png$/, "_4k_ai.png");
if (!existsSync(escalado)) throw new Error("salida del upscaler no encontrada");

await sharp(escalado).webp({ quality: 86, effort: 6 }).toFile(DESTINO);

const m = await sharp(DESTINO).metadata();
const kb = Math.round((await sharp(DESTINO).toBuffer()).length / 1024);
console.log(`✓ ${DESTINO} — ${m.width}x${m.height}, ${kb}KB`);

await unlink(recorte).catch(() => {});
await unlink(escalado).catch(() => {});
