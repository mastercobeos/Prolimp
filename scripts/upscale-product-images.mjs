// Upscale x4 con Real-ESRGAN (GPU) todas las imágenes de productos de Sanity.
// Overwrite: crea asset nuevo WebP y patchea el _ref de cada producto.
// Requiere: python + PIL + upscale_ai.py en escritorio + realesrgan-ncnn-vulkan.exe

import { createClient } from "@sanity/client";
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, basename } from "node:path";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: ".env.local" });

const TARGET_WIDTH = 1600;
const UPSCALE_SCRIPT = "C:\\Users\\cobeo\\OneDrive\\Escritorio\\upscale_ai.py";
const TMP_DIR = "./upscale-tmp";
const PROGRESS_FILE = "./upscale-progress.json";

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

async function loadProgress() {
  if (!existsSync(PROGRESS_FILE)) return { done: [] };
  return JSON.parse(await readFile(PROGRESS_FILE, "utf8"));
}
async function saveProgress(p) {
  await writeFile(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

async function main() {
  await mkdir(TMP_DIR, { recursive: true });
  const progress = await loadProgress();
  const doneSet = new Set(progress.done);

  console.log("→ Fetching productos con imagen...");
  const products = await client.fetch(`
    *[_type == "producto" && defined(imagenPrincipal.asset)]{
      _id,
      "asset": imagenPrincipal.asset->{_id, url, originalFilename, mimeType, extension}
    }
  `);

  // Dedupe by asset._id
  const uniqueAssets = new Map();
  for (const p of products) {
    if (!p.asset?._id) continue;
    if (!uniqueAssets.has(p.asset._id)) {
      uniqueAssets.set(p.asset._id, {
        oldAssetId: p.asset._id,
        url: p.asset.url,
        filename: p.asset.originalFilename || `img-${p.asset._id}`,
        extension: p.asset.extension || "png",
        productIds: [p._id],
      });
    } else {
      uniqueAssets.get(p.asset._id).productIds.push(p._id);
    }
  }

  const items = Array.from(uniqueAssets.values());
  console.log(`  ${products.length} productos, ${items.length} imágenes únicas (${products.length - items.length} compartidas)`);
  console.log(`  ${doneSet.size} ya procesadas — skip`);
  console.log("");

  let i = 0;
  const total = items.length;
  for (const item of items) {
    i++;
    if (doneSet.has(item.oldAssetId)) continue;

    const orig = join(TMP_DIR, `orig-${item.oldAssetId}.${item.extension}`);
    // upscale_ai.py preserva extensión original: <name>_4k_ai.<ext>
    const upscaled = orig.replace(new RegExp(`\\.${item.extension}$`), `_4k_ai.${item.extension}`);

    try {
      // 1) download from CDN
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      await writeFile(orig, Buffer.from(await res.arrayBuffer()));

      // 2) upscale via python (GPU)
      const t0 = Date.now();
      await runPython(UPSCALE_SCRIPT, [orig, String(TARGET_WIDTH)]);
      const upscaleMs = Date.now() - t0;

      if (!existsSync(upscaled)) throw new Error("upscaled output missing");

      // 3) convert to WebP high quality
      const webpBuf = await sharp(upscaled)
        .webp({ quality: 88, effort: 5 })
        .toBuffer();

      // 4) upload new asset
      const newAsset = await client.assets.upload("image", webpBuf, {
        filename: item.filename.replace(/\.[^.]+$/, "") + "-hd.webp",
        contentType: "image/webp",
      });

      // 5) patch all products referencing old asset
      for (const productId of item.productIds) {
        await client.patch(productId).set({
          "imagenPrincipal.asset._ref": newAsset._id,
        }).commit();
      }

      // cleanup temp files
      await unlink(orig).catch(() => {});
      await unlink(upscaled).catch(() => {});

      doneSet.add(item.oldAssetId);
      progress.done = Array.from(doneSet);
      await saveProgress(progress);

      console.log(`[${i}/${total}] ✓ ${item.filename.slice(0, 40)} — ${(upscaleMs / 1000).toFixed(1)}s GPU, ${(webpBuf.length / 1024).toFixed(0)}KB webp, ${item.productIds.length} productos actualizados`);
    } catch (e) {
      console.error(`[${i}/${total}] ✗ ${item.filename.slice(0, 40)} — ${e.message}`);
    }
  }

  console.log(`\n✓ Done. ${doneSet.size}/${total} procesadas`);
}

main().catch((e) => { console.error(e); process.exit(1); });
