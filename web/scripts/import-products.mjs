// Importa productos scrapeados de prolimp.com al Sanity Studio.
// Lee _research/product-scrape/products-scraped.json + assets (imágenes y PDFs) y crea
// documentos "producto" idempotentes (_id = producto-{slug}).
// Enlaza referencias a categoría/marca/línea que ya existen en Sanity.

import { createClient } from "@sanity/client";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, extname } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const repoRoot = resolve(projectRoot, "..");
const scrapeDir = join(repoRoot, "_research", "product-scrape");
const imagesWebpDir = join(scrapeDir, "images-webp");
const imagesOrigDir = join(scrapeDir, "images");
const pdfsDir = join(scrapeDir, "pdfs");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// Mapeo Prolimp slug (top-level y sub-categorías) → Sanity slug de categoría
const CATEGORY_MAP = {
  // Top-level
  detergentes: "detergentes",
  dosificadores: "dosificadores",
  jarcieria: "jarceria",
  jarceria: "jarceria",
  papel: "higienicos",
  higienicos: "higienicos",
  "plasticos-y-desechables": "plasticos-desechables",
  "plasticos-desechables": "plasticos-desechables",
  quimicos: "quimicos",
  seguridad: "seguridad",
  varios: "varios",
  // Detergentes sub
  "jabon-de-tocador": "detergentes",
  "jabon-hotelero": "detergentes",
  "jabon-de-lavanderia": "detergentes",
  // Dosificadores sub
  "despachador-de-higienicos": "dosificadores",
  "despachador-de-toalla": "dosificadores",
  "dosificador-de-aroma": "dosificadores",
  jaboneras: "dosificadores",
  "secador-de-manos": "dosificadores",
  servilleteros: "dosificadores",
  // Jarcería sub
  "accesorios-para-bano": "jarceria",
  atomizadores: "jarceria",
  bastones: "jarceria",
  cepillos: "jarceria",
  cubetas: "jarceria",
  discos: "jarceria",
  escobas: "jarceria",
  "escobetas-y-escobillones": "jarceria",
  extensiones: "jarceria",
  fibras: "jarceria",
  "franelas-y-microfibras": "jarceria",
  jaladores: "jarceria",
  "limpia-vidrios": "jarceria",
  "trapeadores-mops": "jarceria",
  recogedores: "jarceria",
  // Papel sub → higienicos
  panuelos: "higienicos",
  servilletas: "higienicos",
  servitoallas: "higienicos",
  "toalla-para-manos": "higienicos",
  // Plásticos sub
  "aluminio-y-plasticos-desechables": "plasticos-desechables",
  bolsas: "plasticos-desechables",
  // Seguridad sub
  cubrebocas: "seguridad",
  "gorros-y-cofias": "seguridad",
  guantes: "seguridad",
  tapetes: "seguridad",
  // Varios sub
  "botes-de-basura": "varios",
  "carrito-de-limpieza": "varios",
};

// Sub-categorías de químicos → líneas Sanity (solo para marca Prolimp)
const LINEA_MAP = {
  "albercas-2": "albercas",
  albercas: "albercas",
  "aseo-general-2": "aseo-general",
  "aseo-general": "aseo-general",
  automotriz: "automotriz",
  "banos-2": "banos",
  banos: "banos",
  "cocina-2": "cocina",
  cocina: "cocina",
  "control-de-aromas-2": "control-aromas",
  "control-de-aromas": "control-aromas",
  desinfectantes: "higiene",
  especializados: "especializados",
  higiene: "higiene",
  industrial: "industrial",
  "lavanderia-2": "lavanderia",
  lavanderia: "lavanderia",
  "pisos-2": "pisos",
  pisos: "pisos",
  plec: "plec",
};

// Slug de marca en prolimp.com → slug en Sanity
const MARCA_MAP = {
  prolimp: "prolimp",
  rubermaid: "rubbermaid",
  rubbermaid: "rubbermaid",
  scf: "scf",
  wiese: "wiese",
  "3m": "3m",
  castor: "castor",
  "kimberly-clark": "kimberly-clark",
};

// Slugs de sub-categorías fuera de químicos → guardar como aplicaciones (tags)
function subCatToTag(slug, name) {
  return name;
}

const cache = { images: new Map(), files: new Map() };

async function uploadAsset(kind, absPath) {
  const cacheKey = absPath;
  const cacheMap = kind === "image" ? cache.images : cache.files;
  if (cacheMap.has(cacheKey)) return cacheMap.get(cacheKey);
  if (!existsSync(absPath)) return null;
  const buffer = await readFile(absPath);
  const filename = absPath.split(/[\\\/]/).pop();
  const asset = await client.assets.upload(kind, buffer, { filename });
  cacheMap.set(cacheKey, asset._id);
  return asset._id;
}

function toPortableText(text) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: line }],
      markDefs: [],
    }));
}

function pickCategoria(product) {
  const primary = CATEGORY_MAP[product.primaryCategorySlug];
  if (primary) return primary;
  // Fallback: intentar por breadcrumb
  for (const c of product.categories || []) {
    if (CATEGORY_MAP[c.slug]) return CATEGORY_MAP[c.slug];
  }
  return null;
}

function pickMarca(product) {
  for (const c of product.categories || []) {
    if (MARCA_MAP[c.slug]) return MARCA_MAP[c.slug];
  }
  // Heurística por SKU/nombre — la mayoría son Prolimp por default
  return "prolimp";
}

function pickLinea(product, marca) {
  if (marca !== "prolimp") return null;
  for (const c of product.categories || []) {
    if (LINEA_MAP[c.slug]) return LINEA_MAP[c.slug];
  }
  return null;
}

function pickTags(product) {
  const tags = new Set();
  for (const c of product.categories || []) {
    if (CATEGORY_MAP[c.slug]) continue;
    if (LINEA_MAP[c.slug]) continue;
    if (MARCA_MAP[c.slug]) continue;
    if (c.name) tags.add(c.name);
  }
  return Array.from(tags);
}

function cleanSlug(raw) {
  return raw
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[″"'`]/g, "in") // pulgadas → in
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function attributesToPresentaciones(attrs) {
  const presentaciones = [];
  for (const [key, val] of Object.entries(attrs || {})) {
    if (/tama[nñ]o|presentaci[oó]n|contenido|medida|peso|capacidad/i.test(key)) {
      for (const item of val.split(/[,;/]/)) {
        const medida = item.trim();
        if (medida) presentaciones.push({ _type: "object", medida });
      }
    }
  }
  return presentaciones;
}

async function importProduct(p, existingIds) {
  if (!p.slug || p.error) return { skipped: true, reason: p.error || "no slug" };

  const safeSlug = cleanSlug(p.slug);
  const docId = `producto-${safeSlug}`;
  if (existingIds.has(docId)) return { skipped: true, reason: "already in Sanity" };

  const categoria = pickCategoria(p);
  const marca = pickMarca(p);
  const linea = pickLinea(p, marca);
  const tags = pickTags(p);

  if (!categoria) return { skipped: true, reason: "no categoria" };

  // Sube imágenes (WebP optimizadas si existen, sino la original)
  const imageAssets = [];
  for (const img of p.localImages || []) {
    const nameWithoutExt = img.filename.replace(/\.(jpe?g|png|webp)$/i, "");
    const webpPath = join(imagesWebpDir, `${nameWithoutExt}.webp`);
    const origPath = join(imagesOrigDir, img.filename);
    const absPath = existsSync(webpPath) ? webpPath : origPath;
    const assetId = await uploadAsset("image", absPath);
    if (assetId) {
      imageAssets.push({
        _type: "image",
        _key: assetId.slice(-8),
        asset: { _type: "reference", _ref: assetId },
        alt: p.name || p.slug,
      });
    }
  }
  const imagenPrincipal = imageAssets[0] || null;
  const galeria = imageAssets.slice(1);

  // Sube PDFs (busca ficha técnica y hoja de seguridad por nombre)
  let fichaTecnica = null;
  let hojaSeguridad = null;
  for (const pdf of p.localPdfs || []) {
    const absPath = join(pdfsDir, pdf.filename);
    const assetId = await uploadAsset("file", absPath);
    if (!assetId) continue;
    const asset = { _type: "file", asset: { _type: "reference", _ref: assetId } };
    if (/seguridad|hoja|hds|msds/i.test(pdf.label + " " + pdf.filename)) {
      hojaSeguridad ??= asset;
    } else if (/ficha|t[eé]cnica|ft/i.test(pdf.label + " " + pdf.filename)) {
      fichaTecnica ??= asset;
    } else {
      fichaTecnica ??= asset;
    }
  }

  const presentaciones = attributesToPresentaciones(p.attributes);

  const doc = {
    _id: docId,
    _type: "producto",
    nombre: p.name || p.slug,
    slug: { _type: "slug", current: safeSlug },
    sku: p.sku || undefined,
    descripcionCorta: p.shortDesc?.slice(0, 220) || undefined,
    descripcion: toPortableText(p.fullDesc),
    aplicaciones: tags.length ? tags : undefined,
    presentaciones: presentaciones.length ? presentaciones : undefined,
    imagenPrincipal: imagenPrincipal || undefined,
    galeria: galeria.length ? galeria : undefined,
    fichaTecnica: fichaTecnica || undefined,
    hojaSeguridad: hojaSeguridad || undefined,
    categoria: { _type: "reference", _ref: `categoria-${categoria}` },
    marca: marca ? { _type: "reference", _ref: `marca-${marca}` } : undefined,
    linea: linea ? { _type: "reference", _ref: `linea-${linea}` } : undefined,
    activo: true,
    destacado: false,
    linkExterno: p.externalLink || undefined,
    metaTitle: p.name || undefined,
    metaDescription: p.shortDesc?.slice(0, 160) || undefined,
  };

  await client.createOrReplace(doc);
  return {
    ok: true,
    categoria,
    marca,
    linea,
    images: imageAssets.length,
    pdfs: (fichaTecnica ? 1 : 0) + (hojaSeguridad ? 1 : 0),
  };
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    console.error("Missing env vars in .env.local");
    process.exit(1);
  }

  const jsonPath = join(scrapeDir, "products-scraped.json");
  if (!existsSync(jsonPath)) {
    console.error(`Missing ${jsonPath}. Run scrape-products.mjs first.`);
    process.exit(1);
  }
  const products = JSON.parse(await readFile(jsonPath, "utf8"));

  // Query existing product _ids to skip (avoid re-uploading images)
  console.log("Fetching existing products...");
  const existingArr = await client.fetch(`*[_type == "producto"]._id`);
  const existingIds = new Set(existingArr);
  console.log(`  ${existingIds.size} existing productos in Sanity — will skip these`);

  console.log(`\nImporting ${products.length} products...`);
  let ok = 0, skipped = 0, failed = 0;
  const errors = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const r = await importProduct(p, existingIds);
      if (r.skipped) { skipped++; console.log(`[${i + 1}/${products.length}] ↷ ${p.slug} — ${r.reason}`); }
      else { ok++; console.log(`[${i + 1}/${products.length}] ✓ ${p.slug} — ${r.categoria}/${r.marca}${r.linea ? "/" + r.linea : ""} imgs:${r.images} pdfs:${r.pdfs}`); }
    } catch (e) {
      failed++;
      errors.push({ slug: p.slug, error: e.message });
      console.error(`[${i + 1}/${products.length}] ✗ ${p.slug} — ${e.message}`);
    }
  }
  console.log(`\n✓ Imported ${ok}   ↷ skipped ${skipped}   ✗ failed ${failed}`);
  if (errors.length) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log(`  ${e.slug}: ${e.error}`));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
