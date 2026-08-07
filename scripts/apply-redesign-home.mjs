// Rediseño 2026 — actualiza el hero de la home con el copy y la foto del mockup.
// Idempotente: patch sobre home-singleton + upload del asset del hero.

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
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

const heroPath = join(projectRoot, "public", "img", "redesign", "hero-corazon.png");
const buffer = await readFile(heroPath);
const asset = await client.assets.upload("image", buffer, { filename: "hero-corazon.png" });
console.log("hero asset:", asset._id);

const result = await client
  .patch("home-singleton")
  .set({
    heroEyebrow: "Fabricantes desde 1997",
    heroTituloParte1: "Creamos espacios limpios,",
    heroTituloAcento: "seguros y saludables",
    heroLede:
      "Todo para la limpieza de tu empresa, limpiadores profesionales, herramientas resistentes, insumos especializados y asesoría para elegir mejor.",
    heroImagen: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Personal de limpieza profesional con productos Prolimp",
    },
  })
  .commit();
console.log("home patched:", result._id, result._rev);
