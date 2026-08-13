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

const rows = await client.fetch(
  `*[_type == "linea"] | order(orden asc, nombre asc){
     _id, nombre, "slug": slug.current, orden,
     "imgFile": imagen.asset->originalFilename,
     "imgDims": imagen.asset->metadata.dimensions
   }`
);

console.log(`Total líneas en Sanity: ${rows.length}\n`);
rows.forEach((r, i) => {
  const dim = r.imgDims ? `${r.imgDims.width}x${r.imgDims.height}` : "-";
  console.log(`[${i}] ${r.nombre.padEnd(22)} slug=${(r.slug ?? "-").padEnd(18)} img=${r.imgFile ?? "(sin img)"} (${dim})`);
});
