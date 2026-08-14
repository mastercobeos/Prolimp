import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "node:crypto";
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

const DOC_ID = "sistemas-dilucion-singleton";
const newKey = () => crypto.randomBytes(6).toString("hex");

const EQUIPOS = [
  {
    titulo: "Dilutor Dema",
    descripcion:
      "Cuerpo de latón niquelado que se adhiere a cualquier grifo estándar y dispensa producto mezclado con agua del fregadero con sólo presionar o empujar un botón.",
    file: "public/img/redesign/dilutor-dema.jpg",
  },
  {
    titulo: "Sprite Ware Wash DM-420",
    descripcion:
      "Dosificador para máquina lavaloza, la dosificación de los productos se lleva a cabo con este equipo, que recibe las señales de lavado y enjuague, dosificando el producto adecuado en la cantidad programada.",
    file: "public/img/redesign/sprite-pared.jpg",
  },
  {
    titulo: "Autodose",
    descripcion:
      "Dosificador para trampa de grasa. Dosifica de forma automática la cantidad de producto programada en los tiempos establecidos. Puede elegir hasta 24 periodos de dosificación por 24 horas. Elección del día, la hora y dosificaciones.",
    file: "public/img/redesign/autodose-sala.jpg",
  },
  {
    titulo: "Accupro",
    descripcion:
      "Dilutor para 1 producto, proporciona de manera fácil y constante la solución con sólo pulsar un botón. Este equipo permite la dosificación exacta de detergente y desinfectante para los procesos de lavado y desinfección de frutas y verduras así como de loza.",
    file: "public/img/redesign/accupro.jpg",
  },
];

async function uploadImage(filePath, filename) {
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const doc = await client.getDocument(DOC_ID);
if (doc?.equipos?.length) {
  console.log(`✗ El doc ya tiene ${doc.equipos.length} equipos. Aborto para no sobreescribir.`);
  process.exit(0);
}

const items = [];
for (const e of EQUIPOS) {
  const imagen = await uploadImage(path.resolve(e.file), path.basename(e.file));
  items.push({
    _key: newKey(),
    _type: "object",
    titulo: e.titulo,
    descripcion: e.descripcion,
    imagen: { ...imagen, alt: e.titulo },
  });
  console.log(`  ↑ ${e.titulo} → ${imagen.asset._ref}`);
}

await client.patch(DOC_ID).set({ equipos: items }).commit();
console.log(`✓ ${items.length} equipos sembrados en ${DOC_ID}`);
