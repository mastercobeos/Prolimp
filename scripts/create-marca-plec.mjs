import { createClient } from "@sanity/client";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const DOC_ID = "marca-plec";

const existing = await client.getDocument(DOC_ID);
if (existing) {
  console.log(`✗ Ya existe ${DOC_ID}. Aborto.`);
  process.exit(0);
}

const logoPath = path.resolve("public/img/lineas/plec.webp");
const buffer = fs.readFileSync(logoPath);
const asset = await client.assets.upload("image", buffer, { filename: "plec-logo.webp" });
console.log(`  ↑ logo subido: ${asset._id}`);

await client.createIfNotExists({
  _id: DOC_ID,
  _type: "marca",
  nombre: "PLEC",
  slug: { _type: "slug", current: "plec" },
  logo: {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: "Logo PLEC",
  },
  propia: false,
  orden: 50,
});
console.log(`✓ Marca PLEC creada (${DOC_ID}). Reemplaza el logo en Studio si tienes uno oficial.`);
