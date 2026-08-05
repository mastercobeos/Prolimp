// Descarga imágenes de Pexels API (búsqueda semántica de calidad).
// Requires PEXELS_API_KEY in .env.local

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: ".env.local" });

const PEXELS_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_KEY) { console.error("Missing PEXELS_API_KEY"); process.exit(1); }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// slug → primary query (en inglés — Pexels prefiere inglés) + alt text español
const POSTS = [
  {
    slug: "aromatizante-para-bano",
    query: "air freshener spray",
    alt: "Aromatizante para baño",
  },
  {
    slug: "como-limpiar-canastilla-freidora",
    query: "deep fryer basket",
    alt: "Canastilla de freidora industrial",
  },
  {
    slug: "como-limpiar-mingitorio-seco",
    query: "urinal clean bathroom",
    alt: "Mingitorio de baño público",
  },
  {
    slug: "como-limpiar-piso-ceramico",
    query: "ceramic tile floor clean",
    alt: "Piso cerámico limpio",
  },
  {
    slug: "como-quitar-sarro-alberca",
    query: "swimming pool tiles clean",
    alt: "Alberca con azulejos limpios",
  },
  {
    slug: "cuidar-piso-epoxico",
    query: "epoxy floor garage warehouse",
    alt: "Piso epóxico industrial",
  },
  {
    slug: "diferentes-tipos-de-desengrasantes",
    query: "cleaning spray bottles kitchen",
    alt: "Desengrasantes y limpiadores de cocina",
  },
  {
    slug: "hablemos-sobre-trapeadores",
    query: "mop cleaning floor",
    alt: "Trapeador limpiando piso",
  },
  {
    slug: "papel-higienico-para-negocio",
    query: "toilet paper roll",
    alt: "Rollos de papel higiénico",
  },
  {
    slug: "tipos-desengrasantes-clasificacion",
    query: "cleaning products bottles industrial",
    alt: "Productos de limpieza y desengrasantes",
  },
];

async function pexelsSearch(query, perPage = 5) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
  const data = await res.json();
  return data.photos || [];
}

async function main() {
  for (const p of POSTS) {
    console.log(`\n→ ${p.slug}`);
    console.log(`  query: "${p.query}"`);
    try {
      const photos = await pexelsSearch(p.query);
      if (photos.length === 0) { console.error("  ✗ no results"); continue; }
      // Pick the first (most relevant per Pexels ranking)
      const photo = photos[0];
      const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;
      console.log(`  ✓ pexels #${photo.id} · by ${photo.photographer}`);
      console.log(`  ✓ ${photo.alt || "(no alt)"}`);
      const res = await fetch(imageUrl);
      const raw = Buffer.from(await res.arrayBuffer());
      const webp = await sharp(raw)
        .resize({ width: 1600, height: 900, fit: "cover" })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();
      const asset = await client.assets.upload("image", webp, {
        filename: `blog-${p.slug}-pexels.webp`,
        contentType: "image/webp",
      });
      const postId = await client.fetch(`*[_type == "post" && slug.current == $slug][0]._id`, { slug: p.slug });
      await client.patch(postId).set({
        imagenPortada: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: p.alt,
        },
      }).commit();
      console.log(`  ✓ patched (${(webp.length / 1024).toFixed(0)}KB webp)`);
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
    }
  }
  console.log("\n✓ Done");
}

main().catch((e) => { console.error(e); process.exit(1); });
