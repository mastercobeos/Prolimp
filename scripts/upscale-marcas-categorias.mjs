// Upscale x4 con Real-ESRGAN (GPU) de los logos de marca ("Aliados estratégicos")
// y las imágenes de categoría ("Encuentra por categoría") de la home.
// Ambos grupos venían de origen a 300x300 y se renderizan a ~270-310 CSS, así que
// en pantallas retina se veían pixeleados.
//
// No borra nada: sube un asset nuevo y repunta el _ref. El asset viejo queda
// huérfano en el dataset, así que revertir es cambiar el _ref de vuelta.
// Uso: node scripts/upscale-marcas-categorias.mjs

import { writeFile, mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: ".env.local" });

const TARGET_WIDTH = 1200;
const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const TMP_DIR = "./upscale-tmp";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const GRUPOS = [
  {
    nombre: "marca",
    campo: "logo",
    query: `*[_type == "marca" && defined(logo.asset)]{ _id, "slug": slug.current,
      "asset": logo.asset->{_id, url, extension, "w": metadata.dimensions.width} }`,
  },
  {
    nombre: "categoria",
    campo: "imagen",
    query: `*[_type == "categoria" && defined(imagen.asset)]{ _id, "slug": slug.current,
      "asset": imagen.asset->{_id, url, extension, "w": metadata.dimensions.width} }`,
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
  await mkdir(TMP_DIR, { recursive: true });

  for (const grupo of GRUPOS) {
    const docs = await client.fetch(grupo.query);
    // Solo tiene sentido escalar lo que está por debajo del objetivo.
    const pendientes = docs.filter((d) => (d.asset?.w ?? 0) < TARGET_WIDTH);
    console.log(`\n== ${grupo.nombre} — ${pendientes.length}/${docs.length} por escalar ==`);

    let i = 0;
    for (const doc of pendientes) {
      i++;
      const ext = doc.asset.extension || "webp";
      const orig = join(TMP_DIR, `${grupo.nombre}-${doc.slug}.${ext}`);
      const out = orig.replace(new RegExp(`\\.${ext}$`), `_4k_ai.${ext}`);

      try {
        const res = await fetch(doc.asset.url);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        await writeFile(orig, Buffer.from(await res.arrayBuffer()));

        const t0 = Date.now();
        await runPython([orig, String(TARGET_WIDTH)]);
        const ms = Date.now() - t0;
        if (!existsSync(out)) throw new Error("salida del upscaler no encontrada");

        const buf = await sharp(out).webp({ quality: 88, effort: 5 }).toBuffer();
        const meta = await sharp(buf).metadata();

        const nuevo = await client.assets.upload("image", buf, {
          filename: `${grupo.nombre}-${doc.slug}-hd.webp`,
          contentType: "image/webp",
        });

        await client.patch(doc._id).set({ [`${grupo.campo}.asset._ref`]: nuevo._id }).commit();

        await unlink(orig).catch(() => {});
        await unlink(out).catch(() => {});

        console.log(
          `[${i}/${pendientes.length}] ✓ ${doc.slug.padEnd(24)} ${doc.asset.w}px → ${meta.width}px` +
          `  ${(ms / 1000).toFixed(1)}s GPU, ${(buf.length / 1024).toFixed(0)}KB webp`
        );
      } catch (e) {
        console.error(`[${i}/${pendientes.length}] ✗ ${doc.slug} — ${e.message}`);
      }
    }
  }

  console.log("\n✓ Listo.");
}

main().catch((e) => { console.error(e); process.exit(1); });
