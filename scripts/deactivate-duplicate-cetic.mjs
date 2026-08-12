// Desactiva el documento duplicado de Cetic 100 (slug con guion bajo, artefacto de migración).
// Uso: node scripts/deactivate-duplicate-cetic.mjs
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = await client.fetch(
  `*[_type == "producto" && slug.current match "cetic-100*"]{ _id, nombre, "slug": slug.current, activo }`
);
console.log("Encontrados:", docs);

const dup = docs.find((d) => d.slug === "cetic-100-acido_peracetico");
if (!dup) {
  console.log("No se encontró el duplicado con guion bajo. Sin cambios.");
  process.exit(0);
}
await client.patch(dup._id).set({ activo: false }).commit();
console.log(`Desactivado: ${dup._id} (${dup.slug})`);
