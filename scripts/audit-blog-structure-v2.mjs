import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const posts = await client.fetch(
  `*[_type == "post"] | order(titulo asc){ "slug": slug.current, titulo, contenido }`
);

const problemas = [];
for (const p of posts) {
  const blocks = p.contenido ?? [];
  const flags = [];

  // 1. Rachas de ≥4 párrafos cortitos (<4 palabras) seguidos = tabla/grid roto
  let runShorts = 0;
  let maxShorts = 0;
  for (const b of blocks) {
    if (b._type === "block" && !b.listItem) {
      const text = (b.children ?? []).map((c) => c.text).join("").trim();
      const words = text.split(/\s+/).length;
      if (words <= 4 && text.length > 0) {
        runShorts++;
        if (runShorts > maxShorts) maxShorts = runShorts;
      } else runShorts = 0;
    } else runShorts = 0;
  }
  if (maxShorts >= 5) flags.push(`párrafos-cortos-run=${maxShorts}`);

  // 2. Contenido total muy corto (posiblemente vacío o roto)
  const totalText = blocks
    .filter((b) => b._type === "block")
    .flatMap((b) => (b.children ?? []).map((c) => c.text))
    .join("")
    .trim();
  if (totalText.length < 300 && blocks.length > 0) flags.push(`contenido-muy-corto=${totalText.length}ch`);
  if (blocks.length === 0) flags.push("sin-contenido");

  // 3. No hay NINGÚN heading (h2/h3/h4) en un post largo → jerarquía pobre
  const hasHeading = blocks.some((b) => b._type === "block" && ["h2", "h3", "h4"].includes(b.style));
  if (totalText.length > 1500 && !hasHeading) flags.push("sin-heading");

  // 4. Runs de 10+ listItems (probable tabla que se escapó)
  let runList = 0;
  let maxList = 0;
  for (const b of blocks) {
    if (b._type === "block" && b.listItem) {
      runList++;
      if (runList > maxList) maxList = runList;
    } else runList = 0;
  }
  if (maxList >= 10) flags.push(`listItem-run=${maxList}`);

  if (flags.length > 0) problemas.push({ slug: p.slug, titulo: p.titulo, bloques: blocks.length, flags });
}

console.log(`Total posts: ${posts.length}`);
console.log(`Con problemas potenciales: ${problemas.length}\n`);
problemas.forEach((p) => {
  console.log(`- ${p.slug.padEnd(52)} bloques=${p.bloques}  ${p.flags.join(", ")}`);
});
