// Upscale con Real-ESRGAN (GPU) del muro de logos "Distribuidores de marcas
// reconocidas" (/nosotros). Venían del mockup a ~150px y se muestran hasta a
// 140 CSS, o sea la mitad de lo que pide una pantalla retina; al quitarles el
// filtro de blanco y negro el pixelado quedó a la vista.
//
// Salida en WebP (pesa ~10x menos que el PNG a la misma resolución) y los
// originales quedan respaldados en public/img/redesign/_original/.
// Uso: node scripts/upscale-marcas-locales.mjs

import { copyFile, mkdir, unlink, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const DIR = "./public/img/redesign";
const BACKUP_DIR = join(DIR, "_original");
const TMP_DIR = "./upscale-tmp";
const ANCHO = 600; // >2x del mayor tamaño de despliegue (140 CSS)

// Modelo "anime" = arte plano con bordes duros y texto, que es justo lo que son
// estos logos. Se comparó contra el modelo de fotos en los sellos.
const MODELO = "realesrgan-x4plus-anime";

function runPython(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("close", (c) => (c === 0 ? resolve(true) : reject(new Error(`python exit ${c}: ${stderr}`))));
    proc.on("error", reject);
  });
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });
  await mkdir(TMP_DIR, { recursive: true });

  // Procesa todo el muro. Los que ya quedaron en .webp no se vuelven a tocar
  // porque el filtro sólo toma los .png pendientes.
  const archivos = (await readdir(DIR)).filter((f) => f.startsWith("marca-") && f.endsWith(".png"));
  console.log(`${archivos.length} logos por procesar (destino ${ANCHO}px, modelo ${MODELO})\n`);

  const dims = [];
  let i = 0;
  for (const file of archivos) {
    i++;
    const src = join(DIR, file);
    const ext = extname(file);
    const dest = join(DIR, `${basename(file, ext)}.webp`);

    try {
      const backup = join(BACKUP_DIR, file);
      if (!existsSync(backup) && existsSync(src)) await copyFile(src, backup);
      const origen = existsSync(backup) ? backup : src;
      const before = await sharp(origen).metadata();

      const work = join(TMP_DIR, file);
      const out = join(TMP_DIR, `${basename(file, ext)}_4k_ai${ext}`);
      await copyFile(origen, work);

      const t0 = Date.now();
      await runPython([work, String(ANCHO), MODELO]);
      const ms = Date.now() - t0;
      if (!existsSync(out)) throw new Error("salida del upscaler no encontrada");

      const buf = await sharp(out).webp({ quality: 90, effort: 6, alphaQuality: 100 }).toBuffer();
      await sharp(buf).toFile(dest);
      if (existsSync(src)) await unlink(src).catch(() => {});

      const after = await sharp(dest).metadata();
      dims.push({ file: `${basename(file, ext)}.webp`, w: after.width, h: after.height });
      await unlink(work).catch(() => {});
      await unlink(out).catch(() => {});

      console.log(
        `[${i}/${archivos.length}] ✓ ${file.padEnd(22)} ${before.width}x${before.height} → ${after.width}x${after.height}` +
        `  ${(ms / 1000).toFixed(1)}s GPU, ${(buf.length / 1024).toFixed(0)}KB webp`
      );
    } catch (e) {
      console.error(`[${i}/${archivos.length}] ✗ ${file} — ${e.message}`);
    }
  }

  console.log("\nDimensiones nuevas (para el array de marcas en nosotros/page.tsx):");
  for (const d of dims) console.log(`  { src: "/img/redesign/${d.file}", width: ${d.w}, height: ${d.h} },`);
}

main().catch((e) => { console.error(e); process.exit(1); });
