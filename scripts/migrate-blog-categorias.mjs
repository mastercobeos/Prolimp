import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "node:crypto";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// Mapa slug → nombre display. Cualquier slug nuevo se auto-genera con titleCase.
const NOMBRES = {
  "guias": "Guías",
  "tips": "Tips",
  "productos": "Productos",
  "casos": "Casos de uso",
  "noticias": "Noticias",
  "aseo-general": "Aseo general",
  "banos": "Baños",
  "albercas": "Albercas",
  "automotriz": "Automotriz",
  "cocina": "Cocina",
  "industria-alimentaria": "Industria alimentaria",
  "desinfeccion": "Desinfección",
  "pisos": "Pisos",
  "lavanderia": "Lavandería",
};

const titleize = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const newKey = () => crypto.randomBytes(6).toString("hex");
const catDocId = (slug) => `categoriaBlog-${slug}`;

// 1. Descubrir todos los slugs usados
const posts = await client.fetch(`*[_type=="post"]{_id, _rev, categoria}`);
const slugSet = new Set();
for (const p of posts) {
  const raw = p.categoria;
  if (Array.isArray(raw)) raw.forEach((s) => typeof s === "string" && slugSet.add(s));
  else if (typeof raw === "string") slugSet.add(raw);
}
const slugs = [...slugSet].sort();
console.log(`→ ${posts.length} posts, ${slugs.length} categorías únicas: ${slugs.join(", ")}`);

// 2. Crear los categoriaBlog (idempotente con createOrReplace).
let orden = 10;
for (const slug of slugs) {
  const doc = {
    _id: catDocId(slug),
    _type: "categoriaBlog",
    nombre: NOMBRES[slug] ?? titleize(slug),
    slug: { _type: "slug", current: slug },
    orden,
  };
  await client.createOrReplace(doc);
  console.log(`  ✓ categoriaBlog: ${doc.nombre} (${slug})`);
  orden += 10;
}

// 3. Migrar cada post: strings → referencias.
let migrated = 0;
for (const p of posts) {
  const raw = p.categoria;
  const arr = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  const refs = arr
    .filter((s) => typeof s === "string" && s.length)
    .map((slug) => ({
      _key: newKey(),
      _type: "reference",
      _ref: catDocId(slug),
    }));
  await client
    .patch(p._id)
    .set({ categorias: refs })
    .unset(["categoria"])
    .commit();
  migrated++;
}
console.log(`✓ ${migrated} posts migrados (categoria → categorias como referencias)`);
