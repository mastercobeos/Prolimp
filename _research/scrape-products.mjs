// Scraper de productos Prolimp — WooCommerce
// Crawlea todas las categorías, extrae productos, descarga imágenes y PDFs.
// Output: _research/product-scrape/{products-scraped.json, images/*, pdfs/*}

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "./product-scrape";
const IMAGES_DIR = join(OUT_DIR, "images");
const PDFS_DIR = join(OUT_DIR, "pdfs");

const UA = "Mozilla/5.0 (compatible; ProlimpMigration/1.0; +https://prolimp.com)";
const DELAY_LIST = 400;
const DELAY_PRODUCT = 300;

// Categorías top-level Prolimp (WooCommerce)
const CATEGORIES = [
  { slug: "detergentes", name: "Detergentes", url: "https://www.prolimp.com/product-category/detergentes/" },
  { slug: "dosificadores", name: "Dosificadores", url: "https://www.prolimp.com/product-category/dosificadores/" },
  { slug: "jarcieria", name: "Jarcería", url: "https://www.prolimp.com/product-category/jarcieria/" },
  { slug: "papel", name: "Papel", url: "https://www.prolimp.com/product-category/papel/" },
  { slug: "plasticos-y-desechables", name: "Plásticos y desechables", url: "https://www.prolimp.com/product-category/plasticos-y-desechables/" },
  { slug: "quimicos", name: "Químicos", url: "https://www.prolimp.com/product-category/quimicos/" },
  { slug: "seguridad", name: "Seguridad", url: "https://www.prolimp.com/product-category/seguridad/" },
  { slug: "varios", name: "Varios", url: "https://www.prolimp.com/product-category/varios/" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === retries) throw e;
      await sleep(1000 * (i + 1));
    }
  }
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
  } catch {
    return null;
  }
}

function extractProductUrls(html) {
  const urls = new Set();
  // Prolimp usa /product/ (WooCommerce inglés)
  for (const m of html.matchAll(/href="(https:\/\/www\.prolimp\.com\/product\/[^"?#]+)"/gi)) {
    urls.add(m[1]);
  }
  return Array.from(urls).map((u) => u.split("?")[0].split("#")[0]);
}

function extractNextPage(html) {
  const m = html.match(/<a[^>]+class="[^"]*next[^"]*"[^>]+href="([^"]+)"/i)
    || html.match(/<a[^>]+href="([^"]+)"[^>]*class="[^"]*next[^"]*"/i);
  return m ? m[1] : null;
}

async function scrapeCategoryProducts(cat) {
  console.log(`\n== ${cat.name} ==`);
  const urls = new Set();
  let pageUrl = cat.url;
  let pageCount = 0;
  while (pageUrl && pageCount < 30) {
    pageCount++;
    try {
      const html = await fetchHtml(pageUrl);
      const products = extractProductUrls(html);
      products.forEach((u) => urls.add(u));
      console.log(`  p${pageCount}: +${products.length} (total ${urls.size})`);
      const next = extractNextPage(html);
      if (!next || next === pageUrl) break;
      pageUrl = next;
      await sleep(DELAY_LIST);
    } catch (e) {
      console.error(`  ERR p${pageCount}: ${e.message}`);
      break;
    }
  }
  return Array.from(urls);
}

function extractProduct(html, url) {
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const clean = strip(html);
  const grab = (re) => (clean.match(re)?.[1] || "").trim();
  const gAll = (re) => Array.from(clean.matchAll(re));

  const name = grab(/<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
    || grab(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
    || grab(/<meta property="og:title" content="([^"]+)"/i);

  const sku = grab(/<span class="sku">([\s\S]*?)<\/span>/i).replace(/<[^>]+>/g, "").trim();

  const price = grab(/<p class="price">([\s\S]*?)<\/p>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const shortDescHtml = grab(/<div[^>]+class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const shortDesc = shortDescHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // Full description: try woocommerce-Tabs-panel--description, then tab-description, then fallback
  const fullDescHtml = grab(/<div[^>]+id="tab-description"[^>]*>([\s\S]*?)(?=<div[^>]+id="tab-|<\/div>\s*<\/div>\s*<\/div>)/i)
    || grab(/<div[^>]+class="[^"]*woocommerce-Tabs-panel--description[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]+class="[^"]*woocommerce-Tabs-panel|<div[^>]+id=)/i);
  const fullDescText = fullDescHtml.replace(/<[^>]+>/g, "\n").replace(/\n{2,}/g, "\n").trim();

  // Images — extraer todas de wp-content/uploads, priorizar versiones full-size
  const imgSet = new Set();
  const ogImage = grab(/<meta property="og:image" content="([^"]+)"/i);
  if (ogImage) imgSet.add(ogImage);
  for (const m of gAll(/<a[^>]+data-thumb="([^"]+\.(?:jpe?g|png|webp))"/gi)) imgSet.add(m[1]);
  for (const m of gAll(/<a[^>]+href="(https:\/\/www\.prolimp\.com\/wp-content\/uploads\/[^"]+\.(?:jpe?g|png|webp))"[^>]*(?:class="[^"]*woocommerce-product-gallery)/gi)) imgSet.add(m[1]);
  for (const m of gAll(/<img[^>]+data-large_image="([^"]+)"/gi)) imgSet.add(m[1]);
  // Normalizar: quitar sufijos de thumbnail (-300x300, -150x150, etc.)
  const images = Array.from(imgSet)
    .map((u) => u.replace(/-\d+x\d+(\.(jpe?g|png|webp))$/i, "$1"))
    .filter((u, i, a) => a.indexOf(u) === i);

  // Categories (breadcrumb + posted_in)
  const categories = [];
  for (const m of gAll(/<a[^>]+href="[^"]*\/product-category\/([^\/"]+)\/[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const slug = m[1];
    const name = m[2].replace(/<[^>]+>/g, "").trim();
    if (name && !categories.find((c) => c.slug === slug)) {
      categories.push({ slug, name });
    }
  }

  // External link (Mercado Libre)
  const externalLink = grab(/href="(https?:\/\/(?:articulo\.mercadolibre|www\.mercadolibre|listado\.mercadolibre|mercadolibre)[^"]*)"/i);

  // PDFs
  const pdfs = [];
  for (const m of gAll(/<a[^>]+href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    pdfs.push({ url: m[1], label: m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() });
  }

  // Attributes (Additional information table)
  const attributes = {};
  for (const m of gAll(/<th[^>]+class="[^"]*woocommerce-product-attributes-item__label[^"]*"[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td[^>]+class="[^"]*woocommerce-product-attributes-item__value[^"]*"[^>]*>([\s\S]*?)<\/td>/gi)) {
    const key = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const val = m[2].replace(/<[^>]+>/g, ", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
    if (key) attributes[key] = val;
  }

  // Variations (presentaciones with sizes)
  const variations = [];
  const varMatch = clean.match(/data-product_variations="([^"]+)"/);
  if (varMatch) {
    try {
      const decoded = varMatch[1].replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed)) {
        for (const v of parsed) {
          variations.push({
            attributes: v.attributes,
            sku: v.sku,
            price: v.display_price,
            image: v.image?.src,
          });
        }
      }
    } catch {}
  }

  const slug = decodeURIComponent(url.split("/").filter(Boolean).pop() || "");

  return {
    url, slug, name, sku, price,
    shortDesc, fullDesc: fullDescText,
    categories, images: Array.from(images),
    externalLink: externalLink || null,
    pdfs, attributes, variations,
  };
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });
  await mkdir(PDFS_DIR, { recursive: true });

  // Phase 1: collect all unique product URLs across all top-level categories
  const urlToCat = new Map();
  for (const cat of CATEGORIES) {
    const urls = await scrapeCategoryProducts(cat);
    for (const url of urls) {
      if (!urlToCat.has(url)) urlToCat.set(url, cat.slug);
    }
  }

  const total = urlToCat.size;
  console.log(`\n\n=== TOTAL PRODUCTS: ${total} ===\n`);
  await writeFile(join(OUT_DIR, "product-urls.json"), JSON.stringify(Array.from(urlToCat.entries()), null, 2));

  // Phase 2: scrape each product page + download assets
  const products = [];
  let i = 0;
  for (const [url, catSlug] of urlToCat) {
    i++;
    try {
      const html = await fetchHtml(url);
      const p = extractProduct(html, url);
      p.primaryCategorySlug = catSlug;

      // Download images
      const localImages = [];
      for (const imgUrl of p.images) {
        const fn = await download(imgUrl, IMAGES_DIR);
        if (fn) localImages.push({ original: imgUrl, filename: fn });
      }
      p.localImages = localImages;

      // Download PDFs
      const localPdfs = [];
      for (const pdf of p.pdfs) {
        const fn = await download(pdf.url, PDFS_DIR);
        if (fn) localPdfs.push({ ...pdf, filename: fn });
      }
      p.localPdfs = localPdfs;

      products.push(p);
      console.log(`[${i}/${total}] ✓ ${p.name || p.slug} — imgs:${localImages.length} pdfs:${localPdfs.length}`);
    } catch (e) {
      console.error(`[${i}/${total}] ✗ ${url} — ${e.message}`);
      products.push({ url, error: e.message });
    }
    // Save intermediate every 10
    if (i % 10 === 0) {
      await writeFile(join(OUT_DIR, "products-scraped.json"), JSON.stringify(products, null, 2));
    }
    await sleep(DELAY_PRODUCT);
  }

  await writeFile(join(OUT_DIR, "products-scraped.json"), JSON.stringify(products, null, 2));
  console.log(`\n\n✓ DONE. ${products.length} products saved.`);
  console.log(`  Errors: ${products.filter((p) => p.error).length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
