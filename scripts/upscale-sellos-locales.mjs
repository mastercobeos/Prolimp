// Upscale con Real-ESRGAN (GPU) de los sellos locales que se muestran más grandes
// que su resolución original (sección "certificaciones y pruebas" de la home).
// Salida en WebP: a 4x de resolución pesa ~10x menos que el PNG equivalente, y con
// images.unoptimized el archivo se sirve tal cual al usuario.
// Los originales quedan respaldados en public/img/redesign/_original/.
// Uso: node scripts/upscale-sellos-locales.mjs

import { copyFile, mkdir, unlink, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const DIR = "./public/img/redesign";
const BACKUP_DIR = join(DIR, "_original");
const TMP_DIR = "./upscale-tmp";

// Ancho destino ≈ 2.6x el tamaño CSS máximo al que se renderiza cada sello.
//
// model: "realesrgan-x4plus" (default, fotos) rinde mejor en los sellos con
// degradados; "realesrgan-x4plus-anime" gana en los de texto plano sobre color.
// Se eligió comparando la salida de ambos, sello por sello.
//
// source: origen alternativo cuando canva-ref tiene una versión de más
// resolución que la que se bajó en su momento a public/.
//
// sharpen: máscara de enfoque posterior, para los sellos cuyo origen es tan
// pequeño que la IA ya no recupera detalle real.
//
// OJO: el sello Kosher NO va aquí. El cliente entregó arte limpio a 270x270
// (_original/kosher-cliente.webp) que no necesita IA — lo genera
// scripts/procesar-sello-kosher.mjs. Si se agrega a esta lista, se pisa el
// archivo bueno con una versión reconstruida desde el PNG viejo de 150x101.
const TARGETS = [
  { file: "sello-nsf.png", width: 600 },
  { file: "sello-desinfeccion.png", width: 600 },
  {
    file: "sello-virus.png",
    width: 600,
    model: "realesrgan-x4plus-anime",
    source: "./canva-ref/images/img-068-200x63.png",
  },
];

function runPython(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", [UPSCALE_SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("close", (code) => (code === 0 ? resolve(true) : reject(new Error(`python exit ${code}: ${stderr}`))));
    proc.on("error", reject);
  });
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });
  await mkdir(TMP_DIR, { recursive: true });

  let i = 0;
  for (const { file, width, model, source, sharpen } of TARGETS) {
    i++;
    const src = join(DIR, file);
    const ext = extname(file);
    const dest = join(DIR, `${basename(file, ext)}.webp`);
    if (!existsSync(src) && !existsSync(dest)) {
      console.error(`[${i}/${TARGETS.length}] ✗ ${file} — no existe`);
      continue;
    }

    try {
      // Respaldo del original (solo la primera vez).
      const backup = join(BACKUP_DIR, file);
      if (!existsSync(backup) && existsSync(src)) await copyFile(src, backup);

      // De dónde partimos: origen alternativo si se indicó, si no el respaldo.
      const origen = source && existsSync(source) ? source : backup;
      if (!existsSync(origen)) throw new Error("no hay origen para escalar");
      const before = await sharp(origen).metadata();

      // Trabajamos sobre una copia en tmp: upscale_ai.py escribe <name>_4k_ai.<ext> al lado.
      const work = join(TMP_DIR, file);
      const out = join(TMP_DIR, `${basename(file, ext)}_4k_ai${ext}`);
      await copyFile(origen, work);

      const t0 = Date.now();
      await runPython([work, String(width), ...(model ? [model] : [])]);
      const ms = Date.now() - t0;

      if (!existsSync(out)) throw new Error("salida del upscaler no encontrada");

      // WebP conservando canal alfa; reemplaza al PNG original.
      let pipe = sharp(out);
      if (sharpen) pipe = pipe.sharpen(sharpen);
      const buf = await pipe.webp({ quality: 90, effort: 6 }).toBuffer();
      await sharp(buf).toFile(dest);
      if (ext !== ".webp") await unlink(src).catch(() => {});

      const after = await sharp(dest).metadata();
      await unlink(work).catch(() => {});
      await unlink(out).catch(() => {});

      console.log(
        `[${i}/${TARGETS.length}] ✓ ${file.padEnd(26)} ${before.width}x${before.height} → ${after.width}x${after.height}` +
        `  ${(ms / 1000).toFixed(1)}s GPU, ${(buf.length / 1024).toFixed(0)}KB webp`
      );
    } catch (e) {
      console.error(`[${i}/${TARGETS.length}] ✗ ${file} — ${e.message}`);
    }
  }

  const backups = await readdir(BACKUP_DIR).catch(() => []);
  console.log(`\n✓ Listo. Originales respaldados en ${BACKUP_DIR} (${backups.length} archivos).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
