// Importa las 12 sucursales propias + 3 distribuidores a Sanity.
// Datos scrapeados de https://www.prolimp.com/sucursales-y-distribuidores/

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

const sucursales = [
  {
    _id: "sucursal-orizaba",
    tipo: "sucursal",
    ciudad: "Orizaba",
    estado: "Veracruz",
    direccion: "Sur 13 No. 313, Col. Centro",
    codigoPostal: "94300",
    telefono: "272 724 5600",
    email: "orizaba@prolimp.com",
    horario: "Lunes a viernes: 9:00 – 14:00, 16:00 – 18:00\nSábados: 9:00 – 14:00",
    orden: 10,
  },
  {
    _id: "sucursal-boca-del-rio",
    tipo: "sucursal",
    ciudad: "Boca del Río",
    estado: "Veracruz",
    direccion: "Bv. Adolfo Ruiz Cortines 1517, Costa de Oro",
    codigoPostal: "94299",
    telefono: "229 130 0056",
    email: "veracruz@prolimp.com",
    horario: "Lunes a viernes: 8:30 – 14:00, 15:00 – 18:00\nSábados: 8:30 – 14:00",
    orden: 20,
  },
  {
    _id: "sucursal-xalapa",
    tipo: "sucursal",
    ciudad: "Xalapa",
    estado: "Veracruz",
    direccion: "Araucarias 7, Colonia Badillo",
    codigoPostal: "91090",
    telefono: "228 890 4077",
    email: "xalapa@prolimp.com",
    horario: "Lunes a viernes: 8:30 – 14:00, 15:00 – 18:00\nSábados: 8:30 – 14:00",
    orden: 30,
  },
  {
    _id: "sucursal-coatzacoalcos",
    tipo: "sucursal",
    ciudad: "Coatzacoalcos",
    estado: "Veracruz",
    direccion: "Av. Gutiérrez Zamora No. 1004, Col. Centro",
    telefono: "921 212 7087",
    telefonoAlt: "921 212 6653",
    email: "coatzacoalcos@prolimp.com",
    horario: "Lunes a viernes: 8:00 – 14:00, 15:00 – 18:00",
    orden: 40,
  },
  {
    _id: "sucursal-poza-rica",
    tipo: "sucursal",
    ciudad: "Poza Rica",
    estado: "Veracruz",
    direccion: "Blvd. Adolfo Ruíz Cortines, Carretera Poza Rica-Cazones Km. 51, Col. Reforma",
    telefono: "782 822 4771",
    telefonoAlt: "782 822 4793",
    email: "pozarica@prolimp.com",
    horario: "Lunes a viernes: 8:00 – 14:00, 15:00 – 18:00",
    orden: 50,
  },
  {
    _id: "sucursal-villahermosa",
    tipo: "sucursal",
    ciudad: "Villahermosa",
    estado: "Tabasco",
    direccion: "Carretera Villahermosa-Cárdenas Km 6.2, Bodega 4, R/A Anacleto Canabal 4ta sección",
    codigoPostal: "86287",
    telefono: "993 161 0780",
    telefonoAlt: "993 161 0674",
    email: "villahermosa@prolimp.com",
    horario: "Lunes a viernes: 8:30 – 14:00, 15:00 – 18:00\nSábados: 9:00 – 14:00",
    orden: 60,
  },
  {
    _id: "sucursal-cdmx",
    tipo: "sucursal",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    direccion: "Eje 5 Sur 96 A, Lote 11, Col. Central de Abasto Zona Norte, Iztapalapa",
    codigoPostal: "09040",
    telefono: "551 713 7678",
    email: "cdmx@prolimp.com",
    horario: "Lunes a viernes: 8:00 – 14:00, 15:00 – 18:00",
    orden: 70,
  },
  {
    _id: "sucursal-san-miguel-allende",
    tipo: "sucursal",
    ciudad: "San Miguel de Allende",
    estado: "Guanajuato",
    direccion: "Boulevard de la Conspiración 185, Local 15, Plaza La Conspiración",
    codigoPostal: "37746",
    telefono: "415 688 1491",
    telefonoAlt: "442 824 0961",
    email: "sucursalsma@prolimp.com",
    emailAlt: "hrojas@prolimp.com",
    horario: "Lunes a viernes: 9:30 – 18:00\nSábados: 9:30 – 14:00",
    orden: 80,
  },
  {
    _id: "sucursal-queretaro-industrial",
    tipo: "sucursal",
    ciudad: "Querétaro (Zona Industrial)",
    estado: "Querétaro",
    direccion: "Acceso III No. 16 A int. 16, Zona Industrial Benito Juárez",
    telefono: "442 220 8035",
    telefonoAlt: "442 824 0961",
    email: "queretaro@prolimp.com",
    horario: "Lunes a viernes: 8:30 – 17:00",
    orden: 90,
  },
  {
    _id: "sucursal-queretaro-sierrita",
    tipo: "sucursal",
    ciudad: "Querétaro (La Sierrita)",
    estado: "Querétaro",
    direccion: "Av. 5 de Febrero No. 795, Local 1, Col. La Sierrita",
    telefono: "442 215 7696",
    telefonoAlt: "442 824 0961",
    email: "centroprolimpqro@prolimp.com",
    horario: "Lunes a viernes: 9:30 – 18:00\nSábados: 9:30 – 14:00",
    orden: 100,
  },
  {
    _id: "sucursal-queretaro-pathe",
    tipo: "sucursal",
    ciudad: "Querétaro (Pathé)",
    estado: "Querétaro",
    direccion: "Bernardo Quintana No. 27 B, Local 2, Col. Pathé",
    telefono: "442 223 4737",
    telefonoAlt: "442 824 0961",
    email: "sucursalqro@prolimp.com",
    horario: "Lunes a viernes: 9:30 – 18:00\nSábados: 9:30 – 14:00",
    orden: 110,
  },
  {
    _id: "sucursal-merida",
    tipo: "sucursal",
    ciudad: "Mérida",
    estado: "Yucatán",
    direccion: "Periférico Poniente No. 44, Col. Nora Quintana",
    telefono: "999 461 0389",
    telefonoAlt: "999 461 0390",
    email: "merida@prolimp.com",
    horario: "Lunes a viernes: 8:00 – 14:00, 15:00 – 18:00",
    orden: 120,
  },
  // Distribuidores autorizados
  {
    _id: "distribuidor-quimicosas",
    tipo: "distribuidor",
    nombre: "Quimicosas",
    ciudad: "Colima",
    estado: "Colima",
    telefono: "312 314 2022",
    email: "quimicosasdecolima@gmail.com",
    orden: 200,
  },
  {
    _id: "distribuidor-hielo-seco",
    tipo: "distribuidor",
    nombre: "Hielo Seco",
    ciudad: "Piedras Negras",
    estado: "Coahuila",
    telefono: "878 688 2025",
    email: "erodriguez@hielosecoproveedoraindustrial.com",
    orden: 210,
  },
  {
    _id: "distribuidor-rich-trade",
    tipo: "distribuidor",
    nombre: "Rich Trade and Services Group",
    ciudad: "Naucalpan",
    estado: "Estado de México",
    telefono: "55 5357 2441",
    email: "ventas@richtrade.com.mx",
    orden: 220,
  },
];

async function main() {
  console.log(`→ Importando ${sucursales.length} sucursales/distribuidores...`);
  let ok = 0;
  let fail = 0;
  for (const s of sucursales) {
    const doc = { _type: "sucursal", ...s };
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${s.tipo === "distribuidor" ? "[DIST] " : ""}${s.ciudad}, ${s.estado}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${s.ciudad}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n✓ Done. ${ok} ok, ${fail} fail`);
}

main().catch((e) => { console.error(e); process.exit(1); });
