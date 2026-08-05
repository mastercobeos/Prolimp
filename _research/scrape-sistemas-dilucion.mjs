// Scrapea la página Sistemas de Dilución de Prolimp
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const URL = "https://www.prolimp.com/sistemas-de-dosificacion-y-de-dilucion-de-limpiadores-quimicos/";
const OUT_DIR = "./sistemas-dilucion-scrape";
const IMG_DIR = join(OUT_DIR, "images");
const UA = "Mozilla/5.0 (compatible; ProlimpMigration/1.0)";

async function download(url, target) {
  const cleanUrl = url.split("?")[0];
  const rawFilename = decodeURIComponent(cleanUrl.split("/").pop() || "");
  const filename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
  if (!filename) return null;
  const path = join(target, filename);
  if (existsSync(path)) return filename;
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    await mkdir(target, { recursive: true });
    await writeFile(path, buffer);
    return filename;
  } catch { return null; }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const res = await fetch(URL, { headers: { "user-agent": UA } });
  const html = await res.text();
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const clean = strip(html);
  const grab = (re) => (clean.match(re)?.[1] || "").trim();
  const gAll = (re) => Array.from(clean.matchAll(re));

  const title = grab(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || grab(/<title>([\s\S]*?)<\/title>/i);
  const description = grab(/<meta name="description" content="([^"]+)"/i);

  const mainMatch = clean.match(/<main[\s\S]*?<\/main>/i)
    || clean.match(/<article[\s\S]*?<\/article>/i)
    || clean.match(/<div[^>]+class="[^"]*(entry-content|elementor)[^"]*"[\s\S]*?<\/div>\s*<\/div>/i);
  const mainHtml = mainMatch ? mainMatch[0] : clean;

  const paragraphs = Array.from(mainHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 20);

  const headings = Array.from(mainHtml.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi))
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  const listItems = Array.from(mainHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 3 && l.length < 500);

  const imageUrls = Array.from(mainHtml.matchAll(/<img[^>]+src="([^"]+\.(?:jpe?g|png|webp))"[^>]*(?:alt="([^"]*)")?/gi))
    .map((m) => ({ src: m[1], alt: m[2] || "" }))
    .filter((i) => !i.src.includes("data:") && !/logo|favicon|social/i.test(i.src));

  const localImages = [];
  for (const img of imageUrls) {
    const fn = await download(img.src, IMG_DIR);
    if (fn) localImages.push({ original: img.src, alt: img.alt, filename: fn });
  }

  const pdfs = gAll(/<a[^>]+href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi)
    .map((m) => ({ url: m[1], label: m[2].replace(/<[^>]+>/g, "").trim() }));

  const out = {
    url: URL, title, description,
    headings, paragraphs, listItems,
    images: imageUrls, localImages, pdfs,
  };

  await writeFile(join(OUT_DIR, "sistemas-dilucion.json"), JSON.stringify(out, null, 2));
  console.log(`✓ Sistemas de Dilución: ${paragraphs.length} párrafos, ${localImages.length} imágenes, ${pdfs.length} PDFs`);
}

main().catch((e) => { console.error(e); process.exit(1); });
