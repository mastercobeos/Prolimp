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

const posts = await client.fetch(`*[_type == "post"] | order(titulo asc){ "slug": slug.current, titulo, contenido }`);

const problematicos = [];
for (const p of posts) {
  const blocks = p.contenido ?? [];
  let listBursts = 0;   // rachas de >= 6 listItems seguidos = probablemente tabla
  let runList = 0;
  let shortRunsBursts = 0;   // rachas de párrafos cortos (<3 palabras) seguidos = tabla plana
  let runShorts = 0;
  let imgs = 0;
  for (const b of blocks) {
    if (b._type !== "block") { runList = 0; runShorts = 0; if (b._type === "image") imgs++; continue; }
    if (b.listItem) {
      runList++;
      runShorts = 0;
      if (runList === 6) listBursts++;
    } else {
      const text = (b.children ?? []).map((c) => c.text).join("");
      if (text.trim().split(/\s+/).length <= 3 && text.trim().length > 0) {
        runShorts++;
        if (runShorts === 6) shortRunsBursts++;
      } else {
        runShorts = 0;
      }
      runList = 0;
    }
  }
  if (listBursts > 0 || shortRunsBursts > 0) {
    problematicos.push({ slug: p.slug, titulo: p.titulo, bloques: blocks.length, tablasComoLista: listBursts, tablasPlanas: shortRunsBursts, imgs });
  }
}

console.log(`Total posts: ${posts.length}`);
console.log(`Con estructura sospechosa: ${problematicos.length}\n`);
problematicos.forEach((p) => {
  console.log(`- ${p.slug.padEnd(50)} bloques=${p.bloques} tabla-como-list=${p.tablasComoLista} tabla-plana=${p.tablasPlanas} imgs=${p.imgs}`);
});
