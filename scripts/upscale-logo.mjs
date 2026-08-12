// El logo venía a 264x92 y se muestra a ~126 CSS en el pie y ~115 en la barra:
// apenas 1.05x de lo que pide una pantalla retina, por eso se veía pixeleado.
// Se escala con el modelo de arte plano (es logotipo, no foto).
// El original queda respaldado en public/img/logo/_original/.
//
// Uso: node scripts/upscale-logo.mjs

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

const src = join(DIR, "logo.webp");
const backup = join(BACKUP, "logo.webp");
if (!existsSync(backup)) await copyFile(src, backup);

const antes = await sharp(backup).metadata();
const work = join(TMP, "logo.png");
await sharp(backup).ensureAlpha().png().toFile(work);

await runPython([work, String(ANCHO), "realesrgan-x4plus-anime"]);
const out = join(TMP, "logo_4k_ai.png");
if (!existsSync(out)) throw new Error("salida del upscaler no encontrada");

await sharp(out).webp({ quality: 95, effort: 6, alphaQuality: 100 }).toFile(src);

const fin = await sharp(src).metadata();
const kb = Math.round((await sharp(src).toBuffer()).length / 1024);
console.log(`✓ logo.webp — ${antes.width}x${antes.height} → ${fin.width}x${fin.height}, alfa=${fin.hasAlpha}, ${kb}KB`);

await unlink(work).catch(() => {});
await unlink(out).catch(() => {});
