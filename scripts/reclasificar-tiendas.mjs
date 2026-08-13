// Reclasifica 5 documentos a tipo=tienda, crea sucursal Veracruz (por completar),
// y llena el doc Puebla con el aviso de rutas de entrega.

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

// Reclasificaciones: cada entrada aplica set() sobre el doc existente.
const reclasificar = [
  { id: "sucursal-boca-del-rio",       set: { tipo: "tienda", ciudad: "Ruiz Cortines" } },
  { id: "sucursal-xalapa",             set: { tipo: "tienda" } },
  { id: "sucursal-san-miguel-allende", set: { tipo: "tienda" } },
  { id: "sucursal-queretaro-pathe",    set: { tipo: "tienda", ciudad: "Pathé" } },
  { id: "sucursal-queretaro-sierrita", set: { tipo: "tienda", ciudad: "5 de Febrero" } },
];

// Nueva sucursal Veracruz con datos por completar.
const sucursalVeracruz = {
  _id: "sucursal-veracruz",
  _type: "sucursal",
  tipo: "sucursal",
  ciudad: "Veracruz",
  estado: "Veracruz",
  direccion: "Por completar",
  telefono: "Por completar",
  email: "veracruz@prolimp.com",
  horario: "Por completar",
  orden: 25,
};

// Puebla: sin tienda ni sucursal — se atiende desde CDMX.
const pueblaSet = {
  tipo: "sucursal",
  ciudad: "Puebla",
  estado: "Puebla",
  direccion: "Sin sucursal ni tienda física. Se atiende con rutas de entrega desde la sucursal CDMX.",
  telefono: "551 713 7678",
  email: "cdmx@prolimp.com",
  horario: "Lunes a viernes: 8:00 – 14:00, 15:00 – 18:00",
  orden: 75,
};

async function main() {
  let ok = 0;
  let fail = 0;

  for (const { id, set } of reclasificar) {
    try {
      await client.patch(id).set(set).commit();
      console.log(`  ✓ patch ${id} → ${JSON.stringify(set)}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ patch ${id}: ${e.message}`);
      fail++;
    }
  }

  try {
    await client.createOrReplace(sucursalVeracruz);
    console.log(`  ✓ createOrReplace ${sucursalVeracruz._id}`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${sucursalVeracruz._id}: ${e.message}`);
    fail++;
  }

  try {
    await client.patch("sucursal-puebla").set(pueblaSet).commit();
    console.log(`  ✓ patch sucursal-puebla → aviso de rutas de entrega`);
    ok++;
  } catch (e) {
    console.error(`  ✗ patch sucursal-puebla: ${e.message}`);
    fail++;
  }

  console.log(`\n✓ Done. ${ok} ok, ${fail} fail`);
}

main().catch((e) => { console.error(e); process.exit(1); });
