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

const doc = await client.fetch(
  `*[_type == "home" && _id == "home-singleton"][0]{
     diferenciadores[]{titulo, "iconMeta": icon.asset->{ _id, originalFilename, url, metadata{ dimensions } }}
   }`
);

if (!doc?.diferenciadores) {
  console.log("Sin diferenciadores en Sanity");
  process.exit(0);
}
doc.diferenciadores.forEach((d, i) => {
  const m = d.iconMeta;
  console.log(`[${i}] ${d.titulo}`);
  if (!m) { console.log(`    (sin ícono cargado)`); return; }
  console.log(`    file: ${m.originalFilename}`);
  console.log(`    dims: ${m.metadata?.dimensions?.width}x${m.metadata?.dimensions?.height}`);
  console.log(`    url : ${m.url}`);
});
