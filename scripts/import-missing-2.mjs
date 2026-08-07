// Importa 2 productos faltantes: Desin HT + Hipoclorito de Sodio 13%.
// Descarga imagen original en alta resolución (650x650), la sube y crea el documento.

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import sharp from "sharp";
import crypto from "node:crypto";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const productos = [
  {
    _id: "producto-desin-ht-ablandador-de-hielo-y-desinfectante",
    slug: "desin-ht-ablandador-de-hielo-y-desinfectante",
    nombre: "Desin HT. Ablandador de Hielo y Desinfectante",
    descripcionCorta:
      "Líquido formulado para superficies de cámaras frigoríficas y de congelación. Ablandador de hielo y desinfectante en un solo producto.",
    descripcionPlain:
      "Producto basado en una mezcla anticongelante que garantiza limpieza y desinfección eficiente a temperaturas bajo cero, sin necesidad de descongelar previamente la cámara.",
    aplicaciones: [
      "Superficies de cámaras frigoríficas",
      "Superficies de cámaras de congelación",
      "Remoción de hielo y escarcha",
      "Limpieza de mantenimiento diario",
    ],
    beneficios: [
      "Funciona sin descongelar la cámara previamente",
      "Previene acumulación de hielo",
      "Eficiente a temperaturas bajo cero",
      "Doble acción: limpieza y desinfección",
    ],
    imageUrl: "https://www.prolimp.com/wp-content/uploads/2022/12/Desin-HT.png",
    imageFallback: "https://www.prolimp.com/wp-content/uploads/2022/12/Desin-HT-300x300.png",
    categoriaSlug: "quimicos",
    lineaSlug: "higiene",
    marcaSlug: "prolimp",
    linkExterno: "https://www.prolimp.com/product/desin-ht-ablandador-de-hielo-y-desinfectante/",
  },
  {
    _id: "producto-hipoclorito-de-sodio-al-13",
    slug: "hipoclorito-de-sodio-al-13",
    nombre: "Hipoclorito de Sodio al 13%. Útil para sanitizar superficies, pisos y paredes",
    sku: "200080",
    descripcionCorta:
      "Remueve y elimina residuos de mugre y manchas en tejidos textiles. Elimina malos olores causados por bacterias.",
    descripcionPlain:
      "Utilice directo o diluido según el proceso de limpieza a realizar. Aplique con aspersor o trapee con la solución.",
    aplicaciones: [
      "Sanitización de superficies",
      "Limpieza de pisos y paredes",
      "Eliminación de manchas en textiles",
      "Remoción de residuos de suciedad",
    ],
    beneficios: [
      "Elimina mugre y manchas",
      "Erradica bacterias causantes de malos olores",
      "Versátil: aplicación directa o diluida",
      "Aplicable con aspersor o trapeador",
    ],
    imageUrl: "https://www.prolimp.com/wp-content/uploads/2020/09/hipoclorito_sodio_ficha650.png",
    imageFallback: "https://www.prolimp.com/wp-content/uploads/2020/09/hipoclorito_sodio_ficha650-300x300.png",
    categoriaSlug: "quimicos",
    lineaSlug: "higiene",
    marcaSlug: "prolimp",
    linkExterno: "https://www.prolimp.com/product/hipoclorito-de-sodio-al-13/",
  },
];

const k = () => crypto.randomBytes(6).toString("hex");
const richBlock = (text) => ({
  _type: "block",
  _key: k(),
  style: "normal",
  children: [{ _type: "span", _key: k(), text, marks: [] }],
  markDefs: [],
});

async function refIdFor(type, slug) {
  const d = await client.fetch(`*[_type == $type && slug.current == $slug][0]{_id}`, { type, slug });
  return d?._id ?? null;
}

async function uploadImage(url, fallbackUrl, filename) {
  const tryUrls = [url, fallbackUrl].filter(Boolean);
  for (const u of tryUrls) {
    try {
      const res = await fetch(u);
      if (!res.ok) { console.log(`  ↷ ${res.status} ${u}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      const webp = await sharp(buf).webp({ quality: 88, effort: 5 }).toBuffer();
      const asset = await client.assets.upload("image", webp, {
        filename: `${filename}.webp`,
        contentType: "image/webp",
      });
      console.log(`  ✓ image ${(webp.length / 1024).toFixed(0)}KB from ${u}`);
      return asset._id;
    } catch (e) {
      console.log(`  ↷ fetch fail: ${e.message}`);
    }
  }
  throw new Error("no image url worked");
}

async function main() {
  const catRef = await refIdFor("categoria", "quimicos");
  const lineaRef = await refIdFor("linea", "higiene");
  const marcaRef = await refIdFor("marca", "prolimp");
  if (!catRef || !lineaRef || !marcaRef) {
    throw new Error(`Missing refs: cat=${catRef} linea=${lineaRef} marca=${marcaRef}`);
  }
  console.log(`refs → cat=${catRef} linea=${lineaRef} marca=${marcaRef}\n`);

  for (const p of productos) {
    console.log(`→ ${p.nombre}`);
    const assetId = await uploadImage(p.imageUrl, p.imageFallback, p.slug);
    const doc = {
      _id: p._id,
      _type: "producto",
      nombre: p.nombre,
      slug: { _type: "slug", current: p.slug },
      ...(p.sku ? { sku: p.sku } : {}),
      descripcionCorta: p.descripcionCorta,
      descripcion: [richBlock(p.descripcionPlain)],
      aplicaciones: p.aplicaciones,
      beneficios: p.beneficios,
      imagenPrincipal: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      },
      categoria: { _type: "reference", _ref: catRef },
      linea: { _type: "reference", _ref: lineaRef },
      marca: { _type: "reference", _ref: marcaRef },
      activo: true,
      destacado: false,
      linkExterno: p.linkExterno,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${p.slug}\n`);
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
