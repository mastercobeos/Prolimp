// El logo blanco del pie venía a 264x92 y se ve pixeleado. El upscaler rompe el
// canal alfa, así que se aplana sobre un fondo oscuro (es arte blanco: sobre
// blanco desaparecería), se escala, y luego se le devuelve el alfa original
// escalado con lanczos.
//
// Uso: node scripts/upscale-logo-white.mjs

import { existsSync } from "node:fs";
import { copyFile, mkdir, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import sharp from "sharp";

const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const DIR = "./public/img/logo";
const BACKUP = join(DIR, "_original");
const TMP = "./upscale-tmp";
const ANCHO = 800;
const ARCHIVO = "logo-white.webp";

function runPython(args) {
  return new Promise((res, rej) => {
    const p = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c === 0 ? res() : rej(new Error(err))));
    p.on("error", rej);
  });
}

await mkdir(BACKUP, { recursive: true });
await mkdir(TMP, { recursive: true });

const src = join(DIR, ARCHIVO);
const backup = join(BACKUP, ARCHIVO);
if (!existsSync(backup)) await copyFile(src, backup);

const antes = await sharp(backup).metadata();
console.log(`origen: ${antes.width}x${antes.height}, alfa=${antes.hasAlpha}`);

// 1) Aplanar sobre azul marino para que el arte blanco sea visible al escalar.
const plano = join(TMP, "logo-white-plano.png");
await sharp(backup).flatten({ background: "#0c1f6e" }).png().toFile(plano);

// 2) Upscale con el modelo de arte plano (es logotipo, no foto).
await runPython([plano, String(ANCHO), "realesrgan-x4plus-anime"]);
const grande = plano.replace(/\.png$/, "_4k_ai.png");
if (!existsSync(grande)) throw new Error("salida del upscaler no encontrada");
const m = await sharp(grande).metadata();

// 3) Devolver la transparencia con el alfa del original escalado.
const alfa = await sharp(backup).ensureAlpha().extractChannel("alpha")
  .resize({ width: m.width, height: m.height, kernel: "lanczos3" }).raw().toBuffer();
const rgb = await sharp(grande).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(m.width * m.height * 4);
for (let p = 0; p < m.width * m.height; p++) {
  rgba[p * 4] = rgb[p * 3];
  rgba[p * 4 + 1] = rgb[p * 3 + 1];
  rgba[p * 4 + 2] = rgb[p * 3 + 2];
  rgba[p * 4 + 3] = alfa[p];
}

await sharp(rgba, { raw: { width: m.width, height: m.height, channels: 4 } })
  .webp({ quality: 95, effort: 6, alphaQuality: 100 })
  .toFile(src);

const fin = await sharp(src).metadata();
const kb = Math.round((await sharp(src).toBuffer()).length / 1024);
console.log(`✓ ${ARCHIVO} — ${antes.width}x${antes.height} → ${fin.width}x${fin.height}, alfa=${fin.hasAlpha}, ${kb}KB`);

await unlink(plano).catch(() => {});
await unlink(grande).catch(() => {});
