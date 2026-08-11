// Migra hero singleton: mueve heroImagen (single) a heroImagenes[] (array)
// y agrega la nueva imagen de Ofertas Rebajas.
// Idempotente: si heroImagenes ya existe con la nueva, no duplica.

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";
config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const key = () => randomBytes(6).toString("hex");
const newImagePath = join(projectRoot, "public", "img", "hero", "2daimagenhero.webp");
const NEW_ALT = "Ofertas y rebajas Prolimp";
const NEW_FILENAME = "hero-ofertas-rebajas.webp";

const doc = await client.getDocument("home-singleton");
if (!doc) throw new Error("home-singleton no existe");

// Reutiliza asset si ya se subió antes con el mismo filename.
const existingAsset = await client.fetch(
  `*[_type == "sanity.imageAsset" && originalFilename == $fn][0]{_id}`,
  { fn: NEW_FILENAME },
);
let newAssetId = existingAsset?._id;
if (!newAssetId) {
  const buffer = await readFile(newImagePath);
  const asset = await client.assets.upload("image", buffer, { filename: NEW_FILENAME });
  newAssetId = asset._id;
  console.log("Subida nueva imagen:", newAssetId);
} else {
  console.log("Reutilizando asset existente:", newAssetId);
}

// Construye array final de heroImagenes.
const currentArray = Array.isArray(doc.heroImagenes) ? doc.heroImagenes : [];
const legacySingle = doc.heroImagen;

const items = [];

// 1) imagen legacy (si existe y no está ya en el array)
if (legacySingle?.asset?._ref) {
  const alreadyIn = currentArray.some((i) => i?.asset?._ref === legacySingle.asset._ref);
  if (!alreadyIn) {
    items.push({
      _key: key(),
      _type: "image",
      asset: { _type: "reference", _ref: legacySingle.asset._ref },
      alt: legacySingle.alt ?? "Personal de limpieza profesional Prolimp",
    });
  }
}

// 2) items ya existentes en el array (preserva orden)
for (const i of currentArray) {
  if (!i?.asset?._ref) continue;
  items.push({
    _key: i._key ?? key(),
    _type: "image",
    asset: { _type: "reference", _ref: i.asset._ref },
    alt: i.alt ?? undefined,
    hotspot: i.hotspot ?? undefined,
    crop: i.crop ?? undefined,
  });
}

// 3) nueva imagen (si no está ya)
const alreadyHasNew = items.some((i) => i.asset._ref === newAssetId);
if (!alreadyHasNew) {
  items.push({
    _key: key(),
    _type: "image",
    asset: { _type: "reference", _ref: newAssetId },
    alt: NEW_ALT,
  });
}

const patch = client.patch("home-singleton").set({ heroImagenes: items }).unset(["heroImagen"]);
const result = await patch.commit();
console.log("Migración ok. heroImagenes:", result.heroImagenes?.length ?? 0);
