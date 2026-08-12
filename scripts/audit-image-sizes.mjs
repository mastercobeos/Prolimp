// Audita la resolución real de los assets de Sanity usados en la home.
// Uso: node scripts/audit-image-sizes.mjs
import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const groups = {
  lineas: `*[_type == "linea" && defined(imagen.asset)]{ "slug": slug.current,
    "w": imagen.asset->metadata.dimensions.width, "h": imagen.asset->metadata.dimensions.height }`,
  categorias: `*[_type == "categoria" && defined(imagen.asset)]{ "slug": slug.current,
    "w": imagen.asset->metadata.dimensions.width, "h": imagen.asset->metadata.dimensions.height }`,
  marcas: `*[_type == "marca" && defined(logo.asset)]{ "slug": slug.current,
    "w": logo.asset->metadata.dimensions.width, "h": logo.asset->metadata.dimensions.height }`,
  heroHome: `*[_type == "home"][0].heroImagenes[]{ "w": asset->metadata.dimensions.width,
    "h": asset->metadata.dimensions.height }`,
  diferenciadores: `*[_type == "home"][0].diferenciadores[]{ titulo,
    "w": icon.asset->metadata.dimensions.width, "h": icon.asset->metadata.dimensions.height }`,
};

for (const [name, query] of Object.entries(groups)) {
  const rows = await client.fetch(query);
  console.log(`\n== ${name} (${rows?.length ?? 0}) ==`);
  for (const r of rows ?? []) {
    const label = r.slug ?? r.titulo ?? "";
    console.log(`  ${String(label).padEnd(22)} ${r.w}x${r.h}`);
  }
}
