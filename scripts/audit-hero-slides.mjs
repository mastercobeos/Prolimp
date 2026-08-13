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
     heroImagenes[]{_key, alt, caption, ctaLabel, ctaHref, "assetRef": asset._ref}
   }`
);

if (!doc?.heroImagenes) {
  console.log("Sin slides");
  process.exit(0);
}
doc.heroImagenes.forEach((s, i) => {
  console.log(`\n[${i}] _key=${s._key}`);
  console.log(`    alt: ${s.alt ?? "-"}`);
  console.log(`    caption: ${s.caption ?? "(vacío)"}`);
  console.log(`    cta: ${s.ctaLabel ?? "-"} → ${s.ctaHref ?? "-"}`);
  console.log(`    asset: ${s.assetRef}`);
});
