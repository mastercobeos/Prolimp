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
  `*[_type == "sucursal"]{_id, tipo, ciudad, estado, nombre, direccion} | order(estado asc, ciudad asc)`
);
console.log(`Total: ${rows.length}\n`);
for (const r of rows) {
  const dir = (r.direccion ?? "").split("\n")[0].slice(0, 60);
  console.log(
    `[${r.tipo ?? "?"}] ${r.ciudad} — ${r.estado}${r.nombre ? " (" + r.nombre + ")" : ""}\n    id=${r._id}\n    ${dir}`
  );
}
