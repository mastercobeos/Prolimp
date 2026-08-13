// Upscale con Real-ESRGAN (GPU) de los 3 íconos de "Qué hace diferentes":
// Ecológicos, Económicos, Especializados. Los originales en Sanity y locales
// son 100x100 y se ven pixeleados al renderizarse a 80px CSS con retina.
//
// Flujo: lee los locales de public/img/nosotros/, respalda, upscale a 480px,
// reemplaza local. Después sube a Sanity y actualiza el ref del ícono.
//
// Uso: node scripts/upscale-diferenciadores-icons.mjs

import { copyFile, mkdir, unlink, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, basename, extname } from "node:path";
import sharp from "sharp";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const DIR = "./public/img/nosotros";
const BACKUP_DIR = join(DIR, "_original");
const TMP_DIR = "./upscale-tmp";
const TARGET_WIDTH = 480;

const TARGETS = [
  { file: "ecologicos.webp",            titulo: "Ecológicos" },
  { file: "economicos.webp",            titulo: "Económicos" },
  { file: "especializados-icon.webp",   titulo: "Especializados" },
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

async function upscaleLocal({ file }) {
  const src = join(DIR, file);
  const ext = extname(file);
  const backup = join(BACKUP_DIR, file);

  if (!existsSync(backup)) await copyFile(src, backup);

  const work = join(TMP_DIR, file);
  const out = join(TMP_DIR, `${basename(file, ext)}_4k_ai${ext}`);
  await copyFile(backup, work);

  const before = await sharp(backup).metadata();
  const t0 = Date.now();
  await runPython([work, String(TARGET_WIDTH)]);
  const ms = Date.now() - t0;

  if (!existsSync(out)) throw new Error("salida upscaler no encontrada");

  const buf = await sharp(out).webp({ quality: 92, effort: 6 }).toBuffer();
  await sharp(buf).toFile(src);
  await unlink(work).catch(() => {});
  await unlink(out).catch(() => {});

  const after = await sharp(src).metadata();
  console.log(`  ✓ local ${file.padEnd(26)} ${before.width}x${before.height} → ${after.width}x${after.height} (${(ms / 1000).toFixed(1)}s, ${(buf.length / 1024).toFixed(0)}KB)`);
  return { src, buf };
}

async function updateSanity({ titulo, src, buf }) {
  const fileName = basename(src);
  const asset = await client.assets.upload("image", buf, { filename: fileName });
  console.log(`  ✓ upload   ${titulo.padEnd(15)} → asset ${asset._id}`);

  const doc = await client.fetch(
    `*[_type == "home" && _id == "home-singleton"][0]{ "index": diferenciadores[titulo == $titulo][0]{titulo}, diferenciadores }`,
    { titulo }
  );
  const idx = doc?.diferenciadores?.findIndex((d) => d.titulo === titulo);
  if (idx == null || idx < 0) {
    console.error(`  ! No encontré diferenciador con titulo="${titulo}" en Sanity`);
    return;
  }
  await client
    .patch("home-singleton")
    .set({
      [`diferenciadores[${idx}].icon`]: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();
  console.log(`  ✓ patch    home-singleton.diferenciadores[${idx}].icon → ${asset._id}`);
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });
  await mkdir(TMP_DIR, { recursive: true });

  for (const t of TARGETS) {
    console.log(`\n→ ${t.titulo}`);
    try {
      const { src, buf } = await upscaleLocal(t);
      await updateSanity({ titulo: t.titulo, src, buf });
    } catch (e) {
      console.error(`  ✗ ${t.file}: ${e.message}`);
    }
  }
  console.log(`\n✓ Listo. Backups en ${BACKUP_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
