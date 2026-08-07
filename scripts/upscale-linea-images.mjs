// Upscale x4 con Real-ESRGAN (GPU) todas las imágenes hero de las 12 líneas.
// Overwrite: crea asset nuevo WebP y patchea el _ref de cada linea.

import { createClient } from "@sanity/client";
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: ".env.local" });

const TARGET_WIDTH = 1600;
const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const TMP_DIR = "./upscale-tmp";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

function runPython(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", [scriptPath, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`python exit ${code}: ${stderr}`));
    });
    proc.on("error", reject);
  });
}

async function main() {
  await mkdir(TMP_DIR, { recursive: true });
  console.log("→ Fetching lineas con imagen...");
  const lineas = await client.fetch(`
    *[_type == "linea" && defined(imagen.asset)]{
      _id, "slug": slug.current,
      "asset": imagen.asset->{_id, url, originalFilename, extension}
    }
  `);
  console.log(`  ${lineas.length} líneas encontradas\n`);

  let i = 0;
  for (const l of lineas) {
    i++;
    const ext = l.asset.extension || "webp";
    const orig = join(TMP_DIR, `linea-${l.slug}.${ext}`);
    const upscaled = orig.replace(new RegExp(`\\.${ext}$`), `_4k_ai.${ext}`);

    try {
      const res = await fetch(l.asset.url);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      await writeFile(orig, Buffer.from(await res.arrayBuffer()));

      const t0 = Date.now();
      await runPython(UPSCALE_SCRIPT, [orig, String(TARGET_WIDTH)]);
      const upMs = Date.now() - t0;

      if (!existsSync(upscaled)) throw new Error("upscaled output missing");

      const webpBuf = await sharp(upscaled)
        .webp({ quality: 88, effort: 5 })
        .toBuffer();

      const newAsset = await client.assets.upload("image", webpBuf, {
        filename: `linea-${l.slug}-hd.webp`,
        contentType: "image/webp",
      });

      await client.patch(l._id).set({
        "imagen.asset._ref": newAsset._id,
      }).commit();

      await unlink(orig).catch(() => {});
      await unlink(upscaled).catch(() => {});

      console.log(`[${i}/${lineas.length}] ✓ ${l.slug.padEnd(20)} — ${(upMs / 1000).toFixed(1)}s GPU, ${(webpBuf.length / 1024).toFixed(0)}KB webp`);
    } catch (e) {
      console.error(`[${i}/${lineas.length}] ✗ ${l.slug} — ${e.message}`);
    }
  }
  console.log("\n✓ Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
