// Extrae del mockup las fotos que son arte propio de Prolimp y hoy están
// sustituidas por imágenes de banco.
//
// Sólo se extraen las que NO llevan marca de agua encima: en las láminas
// conviven fotos propias de Prolimp (limpias) con fotos de banco de Canva
// (enrejado + "Canva" sobre la imagen). Las segundas quedan fuera a propósito.
//
// La marca de agua de la página cae fuera de la tarjeta, así que recortando su
// interior la foto sale limpia. Se escala con Real-ESRGAN porque el recorte
// ronda los 500px y los heroes se muestran a ~570.
//
// Uso: node scripts/extraer-fotos-mockup.mjs [--solo=nombre]

import { existsSync } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const BASE = "C:/Users/cobeo/OneDrive/Escritorio/Web Prolimp 2026";
const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const TMP_DIR = "./upscale-tmp";
const DIR = "./public/img/redesign";
const ANCHO = 1200;

// Rectángulos medidos sobre las láminas de 1366px de ancho, metidos unos
// píxeles hacia adentro para no arrastrar la esquina redondeada de la tarjeta.
const FOTOS = [
  { nombre: "sucursales-hero", lamina: "4.png", rect: { left: 786, top: 242, width: 509, height: 469 } },
  { nombre: "dilucion-hero", lamina: "3.png", rect: { left: 770, top: 259, width: 518, height: 496 } },
  { nombre: "hospitales-hero", lamina: "8.png", rect: { left: 790, top: 207, width: 510, height: 495 } },
  { nombre: "lactea-hero", lamina: "10.png", rect: { left: 791, top: 207, width: 508, height: 529 } },
  { nombre: "distribuidor-retrato", lamina: "4.png", rect: { left: 212, top: 1705, width: 338, height: 395 } },
  { nombre: "distribuidor-form", lamina: "4.png", rect: { left: 193, top: 3697, width: 327, height: 458 } },
];

const soloArg = process.argv.find((a) => a.startsWith("--solo="));
const solo = soloArg ? soloArg.split("=")[1] : null;

function runPython(args) {
  return new Promise((res, rej) => {
    const p = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c === 0 ? res() : rej(new Error(err))));
    p.on("error", rej);
  });
}

await mkdir(TMP_DIR, { recursive: true });

for (const f of FOTOS) {
  if (solo && f.nombre !== solo) continue;
  const lamina = `${BASE}/${f.lamina}`;
  const destino = join(DIR, `${f.nombre}.webp`);
  try {
    const meta = await sharp(lamina).metadata();
    if (f.rect.top + f.rect.height > meta.height) throw new Error("el recorte se sale de la lámina");

    const recorte = join(TMP_DIR, `${f.nombre}.png`);
    await sharp(lamina).extract(f.rect).png().toFile(recorte);

    await runPython([recorte, String(ANCHO)]);
    const escalado = recorte.replace(/\.png$/, "_4k_ai.png");
    if (!existsSync(escalado)) throw new Error("salida del upscaler no encontrada");

    await sharp(escalado).webp({ quality: 86, effort: 6 }).toFile(destino);
    const m = await sharp(destino).metadata();
    const kb = Math.round((await sharp(destino).toBuffer()).length / 1024);
    console.log(`✓ ${f.nombre.padEnd(19)} ${f.rect.width}x${f.rect.height} → ${m.width}x${m.height}, ${kb}KB`);

    await unlink(recorte).catch(() => {});
    await unlink(escalado).catch(() => {});
  } catch (e) {
    console.error(`✗ ${f.nombre} — ${e.message}`);
  }
}
