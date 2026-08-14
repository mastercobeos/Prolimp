import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "node:crypto";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const DOC_ID = "sistemas-dilucion-singleton";
const newKey = () => crypto.randomBytes(6).toString("hex");

const doc = await client.getDocument(DOC_ID);
if (!doc) throw new Error(`Doc ${DOC_ID} no existe`);

const galeria = (doc.galeria ?? []).map((item) => ({ ...item, _key: newKey() }));

await client.patch(DOC_ID).set({ galeria }).commit();

console.log(`✓ galeria: ${galeria.length} items con _key regenerado`);
