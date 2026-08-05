// Re-fetch cada producto y extrae las categorías reales desde el <div id="product-NNNN" class="... product_cat-SLUG ...">
// No baja imágenes ni PDFs — solo actualiza categories/tags/marca en products-scraped.json.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const IN = "./product-scrape/products-scraped.json";
const UA = "Mozilla/5.0 (compatible; ProlimpMigration/1.0)";
const DELAY = 250;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA } });
      if (r.ok) return await r.text();
    } catch {}
    await sleep(500 * (i + 1));
  }
  throw new Error("fetch failed");
}

// Mapea sub-cat slugs a nombres legibles conocidos
const SLUG_TO_NAME = {
  detergentes: "Detergentes",
  "jabon-de-tocador": "Jabón de Tocador",
  "jabon-hotelero": "Jabón Hotelero",
  "jabon-de-lavanderia": "Jabón de Lavandería",
  dosificadores: "Dosificadores",
  "despachador-de-higienicos": "Despachador de higiénicos",
  "despachador-de-toalla": "Despachador de toalla",
  "dosificador-de-aroma": "Dosificador de aroma",
  jaboneras: "Jaboneras",
  "secador-de-manos": "Secador de Manos",
  servilleteros: "Servilleteros",
  jarcieria: "Jarcería",
  "accesorios-para-bano": "Accesorios para baño",
  atomizadores: "Atomizadores",
  bastones: "Bastones",
  cepillos: "Cepillos",
  cubetas: "Cubetas",
  discos: "Discos",
  escobas: "Escobas",
  "escobetas-y-escobillones": "Escobetas y escobillones",
  extensiones: "Extensiones",
  fibras: "Fibras",
  "franelas-y-microfibras": "Franelas y microfibras",
  jaladores: "Jaladores",
  "limpia-vidrios": "Limpia Vidrios",
  "trapeadores-mops": "Trapeadores/Mops",
  recogedores: "Recogedores",
  papel: "Papel",
  higienicos: "Higiénicos",
  panuelos: "Pañuelos",
  servilletas: "Servilletas",
  servitoallas: "Servitoallas",
  "toalla-para-manos": "Toalla para manos",
  "plasticos-y-desechables": "Plásticos y desechables",
  "aluminio-y-plasticos-desechables": "Aluminio y plásticos desechables",
  bolsas: "Bolsas",
  quimicos: "Químicos",
  "albercas-2": "Albercas",
  "aseo-general-2": "Aseo General",
  automotriz: "Automotriz",
  "banos-2": "Baños",
  "cocina-2": "Cocina",
  "control-de-aromas-2": "Control de aromas",
  desinfectantes: "Desinfectantes",
  especializados: "Especializados",
  higiene: "Higiene",
  industrial: "Industrial",
  "lavanderia-2": "Lavandería",
  "pisos-2": "Pisos",
  plec: "PLEC",
  seguridad: "Seguridad",
  cubrebocas: "Cubrebocas",
  "gorros-y-cofias": "Gorros y Cofias",
  guantes: "Guantes",
  tapetes: "Tapetes",
  varios: "Varios",
  "botes-de-basura": "Botes de basura",
  "carrito-de-limpieza": "Carrito de Limpieza",
  prolimp: "Prolimp",
  rubermaid: "Rubbermaid",
  rubbermaid: "Rubbermaid",
  scf: "SCF",
  wiese: "Wiese",
  "3m": "3M",
  castor: "Castor",
  "kimberly-clark": "Kimberly Clark",
};

function extractCats(html) {
  // Busca el <div id="product-NNNN" class="... product_cat-SLUG ... product_tag-SLUG ...">
  const m = html.match(/<div[^>]+id="product-\d+"[^>]+class="([^"]+)"/i);
  if (!m) return { cats: [], tags: [] };
  const classes = m[1];
  const cats = Array.from(classes.matchAll(/product_cat-([a-z0-9-]+)/gi)).map((c) => c[1]);
  const tags = Array.from(classes.matchAll(/product_tag-([a-z0-9-]+)/gi)).map((c) => c[1]);
  return { cats, tags };
}

async function main() {
  const products = JSON.parse(await readFile(IN, "utf8"));
  const total = products.length;
  let updated = 0;
  for (let i = 0; i < total; i++) {
    const p = products[i];
    if (!p.url || p.error) continue;
    try {
      const html = await fetchHtml(p.url);
      const { cats, tags } = extractCats(html);
      p.realCategorySlugs = cats;
      p.productTagSlugs = tags;
      p.categories = cats.map((slug) => ({ slug, name: SLUG_TO_NAME[slug] || slug }));
      updated++;
      if (i % 25 === 0) console.log(`[${i + 1}/${total}] ${p.slug} → cats:${cats.join(",")} tags:${tags.length}`);
    } catch (e) {
      console.error(`[${i + 1}/${total}] ✗ ${p.slug} — ${e.message}`);
    }
    await sleep(DELAY);
    if (i % 25 === 0) await writeFile(IN, JSON.stringify(products, null, 2));
  }
  await writeFile(IN, JSON.stringify(products, null, 2));
  console.log(`\n✓ Updated ${updated}/${total} products`);
}

main().catch((e) => { console.error(e); process.exit(1); });
