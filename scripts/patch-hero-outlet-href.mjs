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
const nuevoHref = "https://mailchi.mp/prolimp/outlet-bodega-qro-2025";

await client
  .patch("home-singleton")
  .set({ [`heroImagenes[_key=="${OUTLET_KEY}"].ctaHref`]: nuevoHref })
  .commit();

console.log(`✓ slide outlet: ctaHref → ${nuevoHref}`);
