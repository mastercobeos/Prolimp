// Rehace logos del muro de marcas a partir del arte OFICIAL de cada marca, en
// vez de los PNG de ~150px que se scrapearon del mockup. Con ese origen tan
// chico ni el upscaler por GPU lograba bordes limpios (el óvalo de Rubbermaid
// salía escalonado).
//
// Cada entrada declara si necesita IA:
//   upscale: false -> el arte oficial ya supera el destino, sólo se reescala.
//   upscale: true  -> el arte es limpio pero corto; se pasa por Real-ESRGAN.
//                     Partir de arte limpio da un resultado muy superior a
//                     partir del scrape del mockup, aunque intervenga la IA.
//
// Uso: node scripts/procesar-marcas-oficiales.mjs

import { existsSync } from "node:fs";
import { copyFile, mkdir, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const DIR = "./public/img/redesign";
const ORIGINALES = join(DIR, "_original");
const TMP_DIR = "./upscale-tmp";
const ANCHO = 600; // >2x del mayor tamaño de despliegue (140 CSS)

const MARCAS = [
  { slug: "rubbermaid", origen: "rubbermaid-oficial.png", upscale: false },
  { slug: "kimberly", origen: "kimberly-clark-oficial.png", upscale: true },
];

function runPython(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c === 0 ? resolve() : reject(new Error(err))));
    p.on("error", reject);
  });
}

await mkdir(TMP_DIR, { recursive: true });

for (const m of MARCAS) {
  const origen = join(ORIGINALES, m.origen);
  const destino = join(DIR, `marca-${m.slug}.webp`);
  if (!existsSync(origen)) {
    console.error(`✗ ${m.slug} — falta ${origen}`);
    continue;
  }

  try {
    const antes = await sharp(origen).metadata();

    // Recorta el margen del lienzo para quedarnos sólo con el logo.
    const recortado = join(TMP_DIR, `oficial-${m.slug}.png`);
    await sharp(origen).ensureAlpha().trim({ threshold: 5 }).png().toFile(recortado);
    const rec = await sharp(recortado).metadata();

    let fuente = recortado;
    let via = "lanczos";
    if (m.upscale) {
      // Modelo de arte plano: estos logos son color sólido con texto.
      await runPython([recortado, String(ANCHO), "realesrgan-x4plus-anime"]);
      const salida = recortado.replace(/\.png$/, "_4k_ai.png");
      if (!existsSync(salida)) throw new Error("salida del upscaler no encontrada");
      fuente = salida;
      via = "IA + lanczos";
    }

    await sharp(fuente)
      .resize({ width: ANCHO, kernel: "lanczos3" })
      .webp({ quality: 92, effort: 6, alphaQuality: 100 })
      .toFile(destino);

    const fin = await sharp(destino).metadata();
    const kb = Math.round((await sharp(destino).toBuffer()).length / 1024);
    console.log(
      `✓ marca-${m.slug}.webp — oficial ${antes.width}x${antes.height}, ` +
      `logo ${rec.width}x${rec.height} → ${fin.width}x${fin.height} (${via}), ${kb}KB`
    );

    await unlink(recortado).catch(() => {});
    await unlink(recortado.replace(/\.png$/, "_4k_ai.png")).catch(() => {});
  } catch (e) {
    console.error(`✗ ${m.slug} — ${e.message}`);
  }
}
