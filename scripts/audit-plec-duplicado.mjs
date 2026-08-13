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

// Perspective "raw" muestra published + drafts.
const raw = await client
  .withConfig({ perspective: "raw" })
  .fetch(`*[_type == "linea" && slug.current == "plec"]{ _id, _rev, _createdAt, _updatedAt, nombre, orden }`);
console.log("Raw (published + drafts):");
raw.forEach((r) => console.log("  ", r._id, "orden=", r.orden, "created=", r._createdAt));

// Perspective "published" solo docs publicados.
const pub = await client
  .withConfig({ perspective: "published" })
  .fetch(`*[_type == "linea" && slug.current == "plec"]{ _id, orden }`);
console.log("\nPublished only:");
pub.forEach((r) => console.log("  ", r._id, "orden=", r.orden));
