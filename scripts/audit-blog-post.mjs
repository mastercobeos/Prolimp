// node scripts/audit-blog-post.mjs <slug>
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

const slug = process.argv[2] ?? "limpieza-lavanderia-hospitalaria";
const post = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]{ _id, titulo, contenido }`,
  { slug }
);

if (!post) { console.log("post no encontrado:", slug); process.exit(0); }
console.log(`post: ${post.titulo} (${post._id})`);
console.log(`bloques: ${post.contenido?.length ?? 0}\n`);

const counts = {};
(post.contenido ?? []).forEach((b, i) => {
  const kind = b._type === "block" ? `block/${b.style || "normal"}${b.listItem ? "-listItem" : ""}` : b._type;
  counts[kind] = (counts[kind] ?? 0) + 1;
  const text = b._type === "block"
    ? (b.children ?? []).map((c) => c.text).join("").slice(0, 80)
    : `<${b._type}>`;
  console.log(`[${i.toString().padStart(3)}] ${kind.padEnd(28)} ${text}`);
});
console.log("\nresumen:", counts);
