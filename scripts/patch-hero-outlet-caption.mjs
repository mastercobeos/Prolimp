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

const OUTLET_KEY = "79e8def991a7";
const caption = "Aproveche y adquiera una herramienta de limpieza profesional a un súper precio";
const ctaLabel = "Comprar ahora";

await client
  .patch("home-singleton")
  .set({
    [`heroImagenes[_key=="${OUTLET_KEY}"].caption`]: caption,
    [`heroImagenes[_key=="${OUTLET_KEY}"].ctaLabel`]: ctaLabel,
  })
  .commit();

console.log(`✓ slide outlet actualizado: caption + ctaLabel="${ctaLabel}"`);
