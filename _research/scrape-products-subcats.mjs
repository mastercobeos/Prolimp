// Segundo pase: crawlea sub-categorías con productos que no aparecen en las categorías padre.
// Detecta productos nuevos comparando contra products-scraped.json y los agrega.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "./product-scrape";
const IMAGES_DIR = join(OUT_DIR, "images");
const PDFS_DIR = join(OUT_DIR, "pdfs");
const UA = "Mozilla/5.0 (compatible; ProlimpMigration/1.0)";

const SUBCATS = [
  { slug: "botes-de-basura", parent: "varios", name: "Botes de basura", url: "https://www.prolimp.com/product-category/botes-de-basura/" },
  { slug: "carrito-de-limpieza", parent: "varios", name: "Carrito de Limpieza", url: "https://www.prolimp.com/product-category/carrito-de-limpieza/" },
  { slug: "bolsas", parent: "plasticos-y-desechables", name: "Bolsas", url: "https://www.prolimp.com/product-category/bolsas/" },
  { slug: "aluminio-y-plasticos-desechables", parent: "plasticos-y-desechables", name: "Aluminio y plásticos desechables", url: "https://www.prolimp.com/product-category/aluminio-y-plasticos-desechables/" },
  // Marcas que quizás tienen productos exclusivos no en top-cats
  { slug: "scf", parent: null, name: "SCF", url: "https://www.prolimp.com/product-category/scf/" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
      if (r.ok) return await r.text();
    } catch {}
    await sleep(500 * (i + 1));
  }
  throw new Error("fetch failed");
}

async function download(url, targetDir) {
  try {
    const cleanUrl = url.split("?")[0];
    const rawFilename = decodeURIComponent(cleanUrl.split("/").pop() || "");
    const filename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
    if (!filename) return null;
    const target = join(targetDir, filename);
    if (existsSync(target)) return filename;
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    await mkdir(targetDir, { recursive: true });
    await writeFile(target, buffer);
    return filename;
  } catch { return null; }
}

function extractProductUrls(html) {
  const urls = new Set();
  for (const m of html.matchAll(/href="(https:\/\/www\.prolimp\.com\/product\/[^"?#]+)"/gi)) {
    urls.add(m[1].split("?")[0].split("#")[0]);
  }
  return Array.from(urls);
}

function extractNextPage(html) {
  const m = html.match(/<a[^>]+class="[^"]*next[^"]*"[^>]+href="([^"]+)"/i)
    || html.match(/<a[^>]+href="([^"]+)"[^>]*class="[^"]*next[^"]*"/i);
  return m ? m[1] : null;
}

function extractProduct(html, url) {
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const clean = strip(html);
  const grab = (re) => (clean.match(re)?.[1] || "").trim();
  const gAll = (re) => Array.from(clean.matchAll(re));

  const name = grab(/<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
    || grab(/<meta property="og:title" content="([^"]+)"/i);
  const sku = grab(/<span class="sku">([\s\S]*?)<\/span>/i).replace(/<[^>]+>/g, "").trim();
  const price = grab(/<p class="price">([\s\S]*?)<\/p>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const shortDescHtml = grab(/<div[^>]+class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const shortDesc = shortDescHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const fullDescHtml = grab(/<div[^>]+id="tab-description"[^>]*>([\s\S]*?)(?=<div[^>]+id="tab-|<\/div>\s*<\/div>\s*<\/div>)/i)
    || grab(/<div[^>]+class="[^"]*woocommerce-Tabs-panel--description[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]+class="[^"]*woocommerce-Tabs-panel|<div[^>]+id=)/i);
  const fullDescText = fullDescHtml.replace(/<[^>]+>/g, "\n").replace(/\n{2,}/g, "\n").trim();

  const imgSet = new Set();
  const ogImage = grab(/<meta property="og:image" content="([^"]+)"/i);
  if (ogImage) imgSet.add(ogImage);
  for (const m of gAll(/<a[^>]+data-thumb="([^"]+\.(?:jpe?g|png|webp))"/gi)) imgSet.add(m[1]);
  for (const m of gAll(/<a[^>]+href="(https:\/\/www\.prolimp\.com\/wp-content\/uploads\/[^"]+\.(?:jpe?g|png|webp))"[^>]*(?:class="[^"]*woocommerce-product-gallery)/gi)) imgSet.add(m[1]);
  for (const m of gAll(/<img[^>]+data-large_image="([^"]+)"/gi)) imgSet.add(m[1]);
  const images = Array.from(imgSet)
    .map((u) => u.replace(/-\d+x\d+(\.(jpe?g|png|webp))$/i, "$1"))
    .filter((u, i, a) => a.indexOf(u) === i);

  // Categorías reales del <div id="product-NNNN">
  const catsMatch = clean.match(/<div[^>]+id="product-\d+"[^>]+class="([^"]+)"/i);
  const cats = catsMatch ? Array.from(catsMatch[1].matchAll(/product_cat-([a-z0-9-]+)/gi)).map((c) => c[1]) : [];
  const tags = catsMatch ? Array.from(catsMatch[1].matchAll(/product_tag-([a-z0-9-]+)/gi)).map((c) => c[1]) : [];

  const externalLink = grab(/href="(https?:\/\/(?:articulo\.mercadolibre|www\.mercadolibre|listado\.mercadolibre|mercadolibre)[^"]*)"/i);
  const pdfs = gAll(/<a[^>]+href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi)
    .map((m) => ({ url: m[1], label: m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() }));
  const attributes = {};
  for (const m of gAll(/<th[^>]+class="[^"]*woocommerce-product-attributes-item__label[^"]*"[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td[^>]+class="[^"]*woocommerce-product-attributes-item__value[^"]*"[^>]*>([\s\S]*?)<\/td>/gi)) {
    const key = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const val = m[2].replace(/<[^>]+>/g, ", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
    if (key) attributes[key] = val;
  }
  const slug = decodeURIComponent(url.split("/").filter(Boolean).pop() || "");

  return {
    url, slug, name, sku, price, shortDesc, fullDesc: fullDescText,
    categories: cats.map((s) => ({ slug: s, name: s })),
    realCategorySlugs: cats, productTagSlugs: tags,
    images, externalLink: externalLink || null, pdfs, attributes, variations: [],
  };
}

async function main() {
  const jsonPath = join(OUT_DIR, "products-scraped.json");
  const products = JSON.parse(await readFile(jsonPath, "utf8"));
  const existingUrls = new Set(products.map((p) => p.url));
  console.log(`Existing scraped: ${existingUrls.size}`);

  // Collect all product URLs from sub-cats
  const newUrls = new Map(); // url -> primaryCategorySlug (padre)
  for (const cat of SUBCATS) {
    console.log(`\n== ${cat.name} (parent: ${cat.parent}) ==`);
    let pageUrl = cat.url;
    let pageCount = 0;
    while (pageUrl && pageCount < 20) {
      pageCount++;
      try {
        const html = await fetchHtml(pageUrl);
        const urls = extractProductUrls(html);
        console.log(`  p${pageCount}: ${urls.length} URLs`);
        for (const u of urls) {
          if (!existingUrls.has(u) && !newUrls.has(u)) newUrls.set(u, cat.parent || cat.slug);
        }
        const next = extractNextPage(html);
        if (!next || next === pageUrl) break;
        pageUrl = next;
        await sleep(300);
      } catch (e) {
        console.error(`  ERR: ${e.message}`);
        break;
      }
    }
  }

  console.log(`\n=== NEW PRODUCTS: ${newUrls.size} ===\n`);

  // Scrape each new product
  await mkdir(IMAGES_DIR, { recursive: true });
  const total = newUrls.size;
  let i = 0;
  for (const [url, catSlug] of newUrls) {
    i++;
    try {
      const html = await fetchHtml(url);
      const p = extractProduct(html, url);
      p.primaryCategorySlug = catSlug;
      const localImages = [];
      for (const imgUrl of p.images) {
        const fn = await download(imgUrl, IMAGES_DIR);
        if (fn) localImages.push({ original: imgUrl, filename: fn });
      }
      p.localImages = localImages;
      p.localPdfs = [];
      products.push(p);
      console.log(`[${i}/${total}] ✓ ${p.name || p.slug} — imgs:${localImages.length}`);
    } catch (e) {
      console.error(`[${i}/${total}] ✗ ${url} — ${e.message}`);
    }
    await sleep(300);
  }

  await writeFile(jsonPath, JSON.stringify(products, null, 2));
  console.log(`\n✓ Merged. Total ahora: ${products.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
