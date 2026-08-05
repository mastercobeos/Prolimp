// Import inicial: seed de home, empresa, líneas, categorías, marcas, sucursales y posts.
// Sube las imágenes locales de /public/img/* como assets de Sanity y crea documentos publicados.
// Idempotente: usa _id fijos (slug) para no duplicar en re-runs.

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing env vars. Ensure .env.local has NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const publicDir = join(projectRoot, "public");

async function uploadImage(relPath, alt = "") {
  const abs = join(publicDir, relPath);
  if (!existsSync(abs)) {
    console.warn(`  ⚠ image not found: ${relPath}`);
    return null;
  }
  const buffer = await readFile(abs);
  const filename = relPath.split("/").pop();
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

async function createOrReplace(doc) {
  return client.createOrReplace(doc);
}

// ---------- data (mirrors src/lib/content.ts) ----------
const empresaSeed = {
  _id: "empresa-singleton",
  _type: "empresa",
  nombre: "Prolimp",
  nombreLegal: "Prolimp del Centro",
  tagline: "Fabricantes de químicos y productos de limpieza profesional",
  descripcion:
    "Fabricamos una extensa línea de productos químicos de gran calidad marca propia Prolimp® para limpieza industrial, comercial y de hogar. Además distribuimos las herramientas necesarias para llevar a cabo todos los procesos de limpieza.",
  fundacion: "1971",
  whatsapp: "5212291406981",
  whatsappDisplay: "+52 1 229 140 6981",
  email: "contacto@prolimp.com",
  redes: [{ _key: "fb", plataforma: "Facebook", url: "https://www.facebook.com/prolimpdelcentro" }],
};

const lineasSeed = [
  { slug: "automotriz", nombre: "Automotriz", descripcion: "Champús, ceras, desengrasantes y limpiadores especializados para vehículos y talleres.", image: "img/lineas/automotriz.webp" },
  { slug: "banos", nombre: "Baños", descripcion: "Desincrustantes, aromatizantes y limpiadores diseñados para sanitarios de alto tráfico.", image: "img/lineas/banos.webp" },
  { slug: "especializados", nombre: "Especializados", descripcion: "Fórmulas técnicas para problemas específicos y superficies delicadas.", image: "img/lineas/especializados.webp" },
  { slug: "higiene", nombre: "Higiene", descripcion: "Desinfectantes con retos microbianos y virucidas para ambientes críticos.", image: "img/lineas/higiene.webp" },
  { slug: "industrial", nombre: "Industrial", descripcion: "Desengrasantes de alta concentración para planta, taller y maquinaria pesada.", image: "img/lineas/industrial.webp" },
  { slug: "plec", nombre: "PLEC", descripcion: "Productos de limpieza para la industria de alimentos y áreas de proceso.", image: "img/lineas/plec.webp" },
  { slug: "albercas", nombre: "Albercas", descripcion: "Cloro, algicidas y clarificadores para el mantenimiento profesional de albercas.", image: "img/lineas/albercas.webp" },
  { slug: "cocina", nombre: "Cocina", descripcion: "Desengrasantes, sanitizantes y lavaloza para cocinas industriales.", image: "img/lineas/cocina.webp" },
  { slug: "control-aromas", nombre: "Control de aromas", descripcion: "Aromatizantes ambientales y bloqueadores de olor de larga duración.", image: "img/lineas/control-aromas.webp" },
  { slug: "pisos", nombre: "Pisos", descripcion: "Selladores, ceras y limpiadores para cada tipo de superficie.", image: "img/lineas/pisos.webp" },
  { slug: "lavanderia", nombre: "Lavandería", descripcion: "Detergentes, blanqueadores y suavizantes para lavandería institucional.", image: "img/lineas/lavanderia.webp" },
  { slug: "aseo-general", nombre: "Aseo General", descripcion: "Limpiadores multiusos, desinfectantes y aromatizantes de uso diario.", image: "img/lineas/aseo-general.webp" },
];

const categoriasSeed = [
  { slug: "quimicos", nombre: "Químicos", descripcion: "Nuestras 11 líneas de químicos de fabricación propia.", image: "img/categorias/quimicos.webp", destacada: true, orden: 10 },
  { slug: "higienicos", nombre: "Higiénicos", descripcion: "Papel higiénico, pañuelos, servilletas y toallas.", image: "img/categorias/higienicos.webp", destacada: true, orden: 20 },
  { slug: "dosificadores", nombre: "Dosificadores", descripcion: "Despachadores de jabón, aromas, papel y toallas.", image: "img/categorias/dosificadores.webp", destacada: true, orden: 30 },
  { slug: "jarceria", nombre: "Jarciería", descripcion: "Escobas, trapeadores, cepillos, atomizadores, cubetas y más.", image: "img/categorias/jarceria.webp", destacada: true, orden: 40 },
  { slug: "detergentes", nombre: "Detergentes", descripcion: "Detergentes de tocador, hotelero y lavandería.", image: "img/categorias/detergentes.webp", destacada: false, orden: 50 },
  { slug: "seguridad", nombre: "Seguridad", descripcion: "Cubrebocas, guantes, cofias y equipo de protección.", image: "img/categorias/seguridad.webp", destacada: false, orden: 60 },
  { slug: "plasticos-desechables", nombre: "Plásticos y desechables", descripcion: "Bolsas, aluminio, cubiertos y desechables.", image: "img/categorias/plasticos-desechables.webp", destacada: false, orden: 70 },
  { slug: "varios", nombre: "Varios", descripcion: "Botes de basura, carritos de limpieza y accesorios.", image: "img/categorias/varios.webp", destacada: false, orden: 80 },
];

const marcasSeed = [
  { slug: "prolimp", nombre: "Prolimp", image: "img/marcas/prolimp.webp", propia: true, orden: 10 },
  { slug: "rubbermaid", nombre: "Rubbermaid", image: "img/marcas/rubbermaid.webp", propia: false, orden: 20 },
  { slug: "scf", nombre: "SCF", image: "img/marcas/scf.webp", propia: false, orden: 30 },
  { slug: "wiese", nombre: "Wiese", image: "img/marcas/wiese.webp", propia: false, orden: 40 },
  { slug: "3m", nombre: "3M", image: "img/marcas/3m.webp", propia: false, orden: 50 },
  { slug: "castor", nombre: "Castor", image: "img/marcas/castor.webp", propia: false, orden: 60 },
  { slug: "kimberly-clark", nombre: "Kimberly-Clark", image: "img/marcas/kimberly-clark.webp", propia: false, orden: 70 },
];

const sucursalesSeed = [
  { ciudad: "Xalapa", estado: "Veracruz", esPrincipal: true, orden: 10 },
  { ciudad: "Veracruz", estado: "Veracruz", orden: 20 },
  { ciudad: "Coatzacoalcos", estado: "Veracruz", orden: 30 },
  { ciudad: "Ciudad de México", estado: "CDMX", orden: 40 },
  { ciudad: "Puebla", estado: "Puebla", orden: 50 },
  { ciudad: "Villahermosa", estado: "Tabasco", orden: 60 },
];

// ---------- utilities ----------
function paragraphsToBlocks(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- main ----------
async function main() {
  console.log(`Import → project=${projectId} dataset=${dataset}\n`);

  // Home
  console.log("📌 Home...");
  const heroImg = await uploadImage("img/nosotros/chica-limpieza.webp", "Personal de limpieza profesional Prolimp");
  await createOrReplace({
    _id: "home-singleton",
    _type: "home",
    heroEyebrow: "Fabricantes desde 1971 · ISO 9001",
    heroTituloParte1: "Un mundo más limpio es un lugar",
    heroTituloAcento: "más seguro y saludable.",
    heroLede:
      "Fabricamos 11 líneas de químicos de limpieza profesional y distribuimos las mejores marcas. Soluciones para hoteles, hospitales, restaurantes, industria y hogar en todo México.",
    heroImagen: heroImg,
    stats: [
      { _key: "s1", valor: "11", etiqueta: "Líneas químicos propios" },
      { _key: "s2", valor: "200+", etiqueta: "Productos en catálogo" },
      { _key: "s3", valor: "50+", etiqueta: "Años de experiencia" },
    ],
    diferenciadores: [
      { _key: "d1", titulo: "Ecológicos", descripcion: "Certificados de biodegradabilidad que garantizan la protección al medio ambiente en cada uso.", icon: await uploadImage("img/nosotros/ecologicos.webp") },
      { _key: "d2", titulo: "Económicos", descripcion: "Por su alta concentración, con menos producto se logra mayor limpieza. Menor costo por metro cuadrado.", icon: await uploadImage("img/nosotros/economicos.webp") },
      { _key: "d3", titulo: "Especializados", descripcion: "Un limpiador para cada necesidad. Fórmulas específicas según el tipo de suciedad y superficie.", icon: await uploadImage("img/nosotros/especializados-icon.webp") },
    ],
    ctaCierreTitulo: "¿Listo para elevar el estándar de limpieza de tu empresa?",
    ctaCierreLede: "Nuestros asesores institucionales te ayudan a elegir los productos ideales para tu operación. Cotización sin compromiso.",
  });

  // Empresa
  console.log("📌 Empresa...");
  await createOrReplace(empresaSeed);

  // Categorías
  console.log("📌 Categorías...");
  for (const c of categoriasSeed) {
    const img = await uploadImage(c.image, c.nombre);
    await createOrReplace({
      _id: `categoria-${c.slug}`,
      _type: "categoria",
      nombre: c.nombre,
      slug: { current: c.slug, _type: "slug" },
      descripcion: c.descripcion,
      imagen: img,
      destacada: c.destacada,
      orden: c.orden,
    });
    console.log(`  ✓ ${c.nombre}`);
  }

  // Marcas
  console.log("📌 Marcas...");
  for (const m of marcasSeed) {
    const logo = await uploadImage(m.image, m.nombre);
    await createOrReplace({
      _id: `marca-${m.slug}`,
      _type: "marca",
      nombre: m.nombre,
      slug: { current: m.slug, _type: "slug" },
      logo,
      propia: m.propia,
      orden: m.orden,
    });
    console.log(`  ✓ ${m.nombre}`);
  }

  // Líneas
  console.log("📌 Líneas de químicos...");
  for (let i = 0; i < lineasSeed.length; i++) {
    const l = lineasSeed[i];
    const img = await uploadImage(l.image, l.nombre);
    await createOrReplace({
      _id: `linea-${l.slug}`,
      _type: "linea",
      nombre: l.nombre,
      slug: { current: l.slug, _type: "slug" },
      descripcion: l.descripcion,
      imagen: img,
      orden: (i + 1) * 10,
    });
    console.log(`  ✓ ${l.nombre}`);
  }

  // Sucursales
  console.log("📌 Sucursales...");
  for (const s of sucursalesSeed) {
    const id = `sucursal-${slugify(s.ciudad)}`;
    await createOrReplace({
      _id: id,
      _type: "sucursal",
      ciudad: s.ciudad,
      estado: s.estado,
      esPrincipal: s.esPrincipal ?? false,
      orden: s.orden,
      horario: "Lunes a viernes: 9:00 – 18:00\nSábados: 9:00 – 14:00",
    });
    console.log(`  ✓ ${s.ciudad}`);
  }

  // Posts
  console.log("📌 Blog posts...");
  const postsRaw = JSON.parse(await readFile(join(projectRoot, "src/lib/blog-posts.json"), "utf-8"));
  const slugMap = {
    "diferentes-tipos-de-desengrasantes": "diferentes-tipos-de-desengrasantes",
    "los-diferentes-tipos-de-desengrasantes-clasificación-y-cómo-elegir-el-mejor": "tipos-desengrasantes-clasificacion",
    "cómo-limpiar-canastilla-freidora": "como-limpiar-canastilla-freidora",
    "cómo-limpiar-plancha-decocina-0": "como-quitar-sarro-alberca",
    "aromatizante-para-baño": "aromatizante-para-bano",
    "cómo-limpiar-un-mingitorio-seco-1": "como-limpiar-mingitorio-seco",
    "qué-papel-higiénico-elijo-para-mi-negocio": "papel-higienico-para-negocio",
    "como-limpiar-y-cuidar-tu-piso-epóxico-para-prolongar-su-durabilidad": "cuidar-piso-epoxico",
    "trapeadores": "hablemos-sobre-trapeadores",
    "como-limpiar-un-piso-ceramico": "como-limpiar-piso-ceramico",
  };
  for (let i = 0; i < postsRaw.length; i++) {
    const p = postsRaw[i];
    const slug = slugMap[p.slug] ?? slugify(p.slug);
    await createOrReplace({
      _id: `post-${slug}`,
      _type: "post",
      titulo: p.title,
      slug: { current: slug, _type: "slug" },
      excerpt: (p.description || p.paragraphs[0] || "").slice(0, 210),
      autor: "Equipo Prolimp",
      categoria: "guias",
      fechaPublicacion: p.date || new Date(2026, 0, i + 1).toISOString(),
      contenido: paragraphsToBlocks(p.paragraphs.slice(0, 30)),
      destacado: i === 0,
      originalUrl: p.url,
    });
    console.log(`  ✓ ${p.title.slice(0, 60)}`);
  }

  console.log("\n✅ Import completo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
