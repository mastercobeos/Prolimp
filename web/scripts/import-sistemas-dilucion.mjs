// Importa el contenido scrapeado de Sistemas de Dilución al Sanity Studio.
// Sube imágenes optimizadas y crea:
//   - Un documento singleton "sistemasDilucion" (para la página /sistemas-dilucion)
//   - Un post en blog (para /blog/sistemas-de-dilucion-y-dosificacion)

import { createClient } from "@sanity/client";
import { readFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename, extname } from "node:path";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const repoRoot = resolve(projectRoot, "..");
const scrapeDir = join(repoRoot, "_research", "sistemas-dilucion-scrape");
const imagesDir = join(scrapeDir, "images");
const imagesWebpDir = join(scrapeDir, "images-webp");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

async function optimizeAll() {
  await mkdir(imagesWebpDir, { recursive: true });
  const files = await readdir(imagesDir);
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
    const src = join(imagesDir, f);
    const out = join(imagesWebpDir, `${basename(f, ext)}.webp`);
    if (existsSync(out)) continue;
    try {
      await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(out);
    } catch (e) {
      console.warn(`  ⚠ ${f}: ${e.message}`);
    }
  }
}

async function uploadImage(absPath, alt = "") {
  const buffer = await readFile(absPath);
  const filename = basename(absPath);
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

function toPortableText(paragraphs) {
  return paragraphs.filter((p) => p && p.length > 5).map((line, i) => ({
    _key: `p${i}`,
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: line, _key: `s${i}` }],
    markDefs: [],
  }));
}

async function main() {
  const data = JSON.parse(await readFile(join(scrapeDir, "sistemas-dilucion.json"), "utf8"));

  console.log("→ Optimizando imágenes a WebP...");
  await optimizeAll();

  // Sube hero + galería
  const localImages = data.localImages || [];
  console.log(`→ Subiendo ${localImages.length} imágenes a Sanity...`);

  const uploads = [];
  for (const img of localImages) {
    const webpPath = join(imagesWebpDir, `${basename(img.filename, extname(img.filename))}.webp`);
    const origPath = join(imagesDir, img.filename);
    const abs = existsSync(webpPath) ? webpPath : origPath;
    if (!existsSync(abs)) continue;
    try {
      const asset = await uploadImage(abs, img.alt || "");
      uploads.push({ ...asset, _key: asset.asset._ref.slice(-8) });
    } catch (e) {
      console.warn(`  ⚠ ${img.filename}: ${e.message}`);
    }
  }
  console.log(`   ✓ ${uploads.length} imágenes subidas`);

  const heroImage = uploads[0];
  const galeria = uploads.slice(1, 12);

  // 1) Singleton para la página dedicada
  const singleton = {
    _id: "sistemas-dilucion-singleton",
    _type: "sistemasDilucion",
    titulo: "Sistemas de Dilución",
    descripcion: data.description || "Sistemas de dosificación y de dilución de limpiadores químicos Prolimp. Reduce costos, prolonga la vida útil de tus concentrados y optimiza el uso de químicos.",
    heroImagen: heroImage,
    intro: toPortableText(data.paragraphs.slice(0, 4)),
    beneficios: data.listItems.slice(0, 8),
    secciones: data.headings.slice(0, 4).map((h, i) => ({
      _key: `sec${i}`,
      _type: "object",
      titulo: h,
      contenido: toPortableText(data.paragraphs.slice(4 + i * 3, 4 + (i + 1) * 3)),
      imagen: uploads[1 + i] || undefined,
    })),
    galeria,
  };
  await client.createOrReplace(singleton);
  console.log("   ✓ Singleton sistemasDilucion creado");

  // 2) Blog post (esquema post con imagenPortada + fechaPublicacion + categoria)
  const postDoc = {
    _id: "post-sistemas-de-dilucion-y-dosificacion",
    _type: "post",
    titulo: "Sistemas de Dilución y Dosificación de Químicos de Limpieza",
    slug: { _type: "slug", current: "sistemas-de-dilucion-y-dosificacion" },
    excerpt: (data.description?.slice(0, 220)) || "Cómo los sistemas de dilución de Prolimp optimizan el uso de químicos de limpieza y reducen costos operativos.",
    imagenPortada: heroImage,
    autor: "Equipo Prolimp",
    categoria: "guias",
    contenido: [
      ...toPortableText(data.paragraphs.slice(0, 3)),
      ...data.headings.slice(0, 4).flatMap((h, i) => ([
        {
          _key: `h${i}`,
          _type: "block",
          style: "h2",
          children: [{ _type: "span", text: h, _key: `hs${i}` }],
          markDefs: [],
        },
        ...toPortableText(data.paragraphs.slice(3 + i * 3, 3 + (i + 1) * 3)).map((b, j) => ({ ...b, _key: `h${i}p${j}` })),
      ])),
    ],
    fechaPublicacion: new Date().toISOString(),
    destacado: true,
  };
  await client.createOrReplace(postDoc);
  console.log("   ✓ Post de blog creado");

  console.log("\n✓ Todo importado.");
  console.log("  Studio → Sistemas de Dilución (singleton)");
  console.log("  Studio → Blog → 'Sistemas de Dilución y Dosificación...'");
}

main().catch((e) => { console.error(e); process.exit(1); });
