// Adapter Sanity → shape que usa la UI (mismo que lib/content.ts).
// Toda la app lee de acá. Si Sanity está vacío o falla, cae a lib/content.ts.

import "server-only";
import { sanityFetch } from "@/sanity/live";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  homeQuery,
  empresaQuery,
  lineasQuery,
  lineaBySlugQuery,
  categoriasQuery,
  categoriaBySlugQuery,
  marcasQuery,
  postsQuery,
  postBySlugQuery,
  categoriasBlogQuery,
  sucursalesQuery,
  sistemasDilucionQuery,
  productoBySlugQuery,
  productosDestacadosQuery,
  marcaBySlugQuery,
  productosByCategoriaYSubcatQuery,
  productosPorSlugsMarcaQuery,
  productosCountPorSlugsQuery,
} from "@/sanity/queries";
import { PLEC_PRODUCTOS_SLUGS } from "./plecProductos";
import type { SanityImageSource } from "@sanity/image-url";
import * as fallback from "./content";
import { allPosts as fallbackPosts } from "./blog";

const imgUrl = (source: SanityImageSource | undefined | null, w = 800): string | undefined => {
  if (!source) return undefined;
  try {
    return urlForImage(source).width(w).auto("format").url();
  } catch {
    return undefined;
  }
};

const cachedFetch = async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
  const { data } = await sanityFetch({ query, params: params ?? {} });
  return data as T;
};

// Bypass Live para queries usadas en generateStaticParams (build-time, sin request).
const staticFetch = <T>(query: string, params?: Record<string, unknown>) =>
  client.fetch<T>(query, params ?? {}, { next: { revalidate: 3600 } });

// -------- home
export type HeroSlide = { url: string; caption?: string; ctaLabel?: string; ctaHref?: string };

export async function getHomeContent() {
  const data = await cachedFetch<{
    heroEyebrow?: string;
    heroTituloParte1?: string;
    heroTituloAcento?: string;
    heroLede?: string;
    heroImagenes?: (SanityImageSource & { caption?: string; ctaLabel?: string; ctaHref?: string })[];
    stats?: { valor: string; etiqueta: string }[];
    diferenciadores?: { titulo: string; descripcion: string; icon?: SanityImageSource }[];
    ctaCierreTitulo?: string;
    ctaCierreLede?: string;
  }>(homeQuery);
  const imagenes: HeroSlide[] = (data?.heroImagenes ?? [])
    .map<HeroSlide | null>((i) => {
      const url = imgUrl(i, 1600);
      if (!url) return null;
      const slide: HeroSlide = { url };
      if (i.caption) slide.caption = i.caption;
      if (i.ctaLabel) slide.ctaLabel = i.ctaLabel;
      if (i.ctaHref) slide.ctaHref = i.ctaHref;
      return slide;
    })
    .filter((s): s is HeroSlide => s !== null);
  return {
    heroEyebrow: data?.heroEyebrow ?? "Fabricantes desde 1997",
    heroTituloParte1: data?.heroTituloParte1 ?? "Creamos espacios limpios,",
    heroTituloAcento: data?.heroTituloAcento ?? "seguros y saludables",
    heroLede: data?.heroLede ?? "Todo para la limpieza de tu empresa: limpiadores profesionales, herramientas resistentes, insumos especializados y asesoría para elegir mejor.",
    heroImagenes: imagenes.length
      ? imagenes
      : [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&q=85&auto=format&fit=crop" }],
    stats: data?.stats?.length
      ? data.stats
      : [
          { valor: "11", etiqueta: "Líneas de limpiadores propios" },
          { valor: "+2000", etiqueta: "Productos en catálogo" },
          { valor: "+35", etiqueta: "Años de experiencia" },
        ],
    diferenciadores: data?.diferenciadores?.length
      ? data.diferenciadores.map((d) => ({
          titulo: d.titulo,
          descripcion: d.descripcion,
          icon: imgUrl(d.icon, 320) ?? "/img/nosotros/especializados-icon.webp",
        }))
      : fallback.diferenciadores.map((d) => ({ ...d, icon: d.icon })),
    ctaCierreTitulo: data?.ctaCierreTitulo ?? "¿Listo para elevar el estándar de limpieza de tu empresa?",
    ctaCierreLede: data?.ctaCierreLede ?? "Nuestros asesores institucionales te ayudan a elegir los productos ideales para tu operación. Cotización sin compromiso.",
  };
}

// -------- empresa
export async function getEmpresa() {
  const data = await cachedFetch<{
    nombre?: string;
    nombreLegal?: string;
    tagline?: string;
    descripcion?: string;
    fundacion?: string;
    whatsapp?: string;
    whatsappDisplay?: string;
    email?: string;
    redes?: { plataforma: string; url: string }[];
  }>(empresaQuery);
  return {
    nombre: data?.nombre ?? fallback.empresa.nombre,
    nombreLegal: data?.nombreLegal ?? fallback.empresa.nombreLegal,
    tagline: data?.tagline ?? fallback.empresa.tagline,
    descripcion: data?.descripcion ?? fallback.empresa.descripcion,
    fundacion: data?.fundacion ?? fallback.empresa.fundacion,
    whatsapp: data?.whatsapp ?? fallback.empresa.whatsapp,
    whatsappDisplay: data?.whatsappDisplay ?? fallback.empresa.whatsappDisplay,
    email: data?.email ?? fallback.empresa.email,
    facebook: data?.redes?.find((r) => r.plataforma === "Facebook")?.url ?? fallback.empresa.facebook,
    instagram: data?.redes?.find((r) => r.plataforma === "Instagram")?.url ?? fallback.empresa.instagram,
    linkedin: data?.redes?.find((r) => r.plataforma === "LinkedIn")?.url ?? fallback.empresa.linkedin,
    youtube: data?.redes?.find((r) => r.plataforma === "YouTube")?.url ?? fallback.empresa.youtube,
    copyright: `${data?.nombreLegal ?? fallback.empresa.nombreLegal}. © ${new Date().getFullYear()}. Todos los derechos reservados.`,
  };
}

// -------- líneas
export async function getLineas() {
  const data = await cachedFetch<{ _id: string; nombre: string; slug: string; descripcion: string; imagen?: SanityImageSource }[]>(lineasQuery);
  if (!data?.length) return fallback.lineas;
  return data.map((l) => ({
    slug: l.slug,
    nombre: l.nombre,
    descripcion: l.descripcion,
    image: imgUrl(l.imagen, 900) ?? "/img/lineas/automotriz.webp",
  }));
}

export async function getLineaBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    descripcionLarga?: unknown[];
    imagen?: SanityImageSource;
    aplicaciones?: string[];
    productos?: { _id: string; nombre: string; slug: string; descripcionCorta?: string; sku?: string; imagenPrincipal?: SanityImageSource }[];
  } | null>(lineaBySlugQuery, { slug });
}

// -------- categorías
export async function getCategorias() {
  const data = await cachedFetch<{ _id: string; nombre: string; slug: string; descripcion: string; destacada?: boolean; imagen?: SanityImageSource }[]>(categoriasQuery);
  if (!data?.length) return fallback.categorias;
  return data.map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
    descripcion: c.descripcion,
    image: imgUrl(c.imagen, 900) ?? "/img/categorias/quimicos.webp",
    destacada: c.destacada,
  }));
}

export async function getCategoriaBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    imagen?: SanityImageSource;
    productos?: {
      _id: string;
      nombre: string;
      slug: string;
      descripcionCorta?: string;
      sku?: string;
      linkExterno?: string;
      imagenPrincipal?: SanityImageSource;
      marca?: { nombre: string; slug: string };
    }[];
  } | null>(categoriaBySlugQuery, { slug });
}

// -------- marcas
export async function getMarcas() {
  const data = await cachedFetch<{ _id: string; nombre: string; slug: string; logo?: SanityImageSource; propia?: boolean; productos?: number }[]>(marcasQuery);
  if (!data?.length) return fallback.marcas;
  // PLEC no tiene productos con marca asignada en Sanity: contamos los de su landing.
  const plecCount = data.some((m) => m.slug === "plec" && !m.productos)
    ? await cachedFetch<number>(productosCountPorSlugsQuery, { slugs: PLEC_PRODUCTOS_SLUGS })
    : 0;
  return data.map((m) => ({
    slug: m.slug,
    nombre: m.nombre,
    image: imgUrl(m.logo, 700) ?? "/img/marcas/prolimp.webp",
    productos: m.productos || (m.slug === "plec" ? plecCount : 0),
  }));
}

// -------- marca por slug (para landing dedicada)
type MarcaProducto = {
  _id: string;
  nombre: string;
  slug: string;
  sku?: string;
  descripcionCorta?: string;
  imagenPrincipal?: SanityImageSource;
  categoria?: { nombre: string; slug: string };
};

export async function getMarcaBySlug(slug: string) {
  const marca = await cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    propia?: boolean;
    descripcion?: string;
    logo?: SanityImageSource;
    productos?: MarcaProducto[];
  } | null>(marcaBySlugQuery, { slug });
  // PLEC: mismos productos que la landing /plec (no hay productos con marca PLEC en Sanity).
  if (marca && slug === "plec" && !marca.productos?.length) {
    const fetched = await cachedFetch<MarcaProducto[]>(productosPorSlugsMarcaQuery, { slugs: PLEC_PRODUCTOS_SLUGS });
    const orden = PLEC_PRODUCTOS_SLUGS;
    marca.productos = [...(fetched ?? [])].sort((a, b) => orden.indexOf(a.slug) - orden.indexOf(b.slug));
  }
  return marca;
}

// -------- productos por categoría + subcategoría (aplicación tag)
export async function getProductosBySubcategoria(categoriaSlug: string, subcatNombre: string) {
  return cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    sku?: string;
    descripcionCorta?: string;
    linkExterno?: string;
    imagenPrincipal?: SanityImageSource;
    marca?: { nombre: string; slug: string };
  }[]>(productosByCategoriaYSubcatQuery, { categoriaSlug, subcatNombre });
}

// -------- productos destacados (para slider en home)
export async function getProductosDestacados() {
  const data = await cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    sku?: string;
    descripcionCorta?: string;
    linkExterno?: string;
    imagenPrincipal?: SanityImageSource;
    categoria?: { nombre: string; slug: string };
    marca?: string;
  }[]>(productosDestacadosQuery);
  return data ?? [];
}

// -------- producto individual
export async function getProductoBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    sku?: string;
    descripcionCorta?: string;
    descripcion?: unknown[];
    aplicaciones?: string[];
    beneficios?: string[];
    presentaciones?: { medida?: string; codigo?: string }[];
    imagenPrincipal?: SanityImageSource;
    galeria?: SanityImageSource[];
    fichaTecnica?: { url: string; originalFilename?: string };
    hojaSeguridad?: { url: string; originalFilename?: string };
    categoria?: { nombre: string; slug: string };
    marca?: { nombre: string; slug: string; logo?: SanityImageSource };
    linea?: { nombre: string; slug: string };
    linkExterno?: string;
    metaTitle?: string;
    metaDescription?: string;
  } | null>(productoBySlugQuery, { slug });
}

// -------- sucursales
export type SucursalItem = {
  _id: string;
  tipo?: "sucursal" | "tienda" | "distribuidor" | "cobertura";
  nombre?: string;
  ciudad: string;
  estado: string;
  esPrincipal?: boolean;
  telefono?: string;
  telefonoAlt?: string;
  whatsapp?: string;
  email?: string;
  emailAlt?: string;
  direccion?: string;
  codigoPostal?: string;
  horario?: string;
  mapaEmbed?: string;
};
export async function getSucursales(): Promise<SucursalItem[]> {
  const data = await cachedFetch<SucursalItem[]>(sucursalesQuery);
  if (!data?.length) return fallback.sucursales as SucursalItem[];
  return data;
}

// -------- blog
export type BlogCategoria = { nombre: string; slug: string };
export type BlogListItem = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  destacado?: boolean;
  categorias: BlogCategoria[];
};

// -------- sistemas de dilución
export async function getSistemasDilucion() {
  const data = await cachedFetch<{
    titulo: string;
    descripcion?: string;
    heroImagen?: SanityImageSource;
    intro?: unknown[];
    beneficios?: string[];
    secciones?: { titulo: string; contenido?: unknown[]; imagen?: SanityImageSource }[];
    equipos?: { titulo: string; descripcion: string; imagen?: SanityImageSource }[];
    galeria?: SanityImageSource[];
  }>(sistemasDilucionQuery);
  if (!data) return null;
  return {
    titulo: data.titulo,
    descripcion: data.descripcion,
    heroImagen: imgUrl(data.heroImagen, 1600),
    intro: data.intro ?? [],
    beneficios: data.beneficios ?? [],
    secciones: (data.secciones ?? []).map((s) => ({
      titulo: s.titulo,
      contenido: s.contenido ?? [],
      imagen: imgUrl(s.imagen, 1200),
    })),
    equipos: (data.equipos ?? []).map((e) => ({
      titulo: e.titulo,
      descripcion: e.descripcion,
      imagen: imgUrl(e.imagen, 800),
    })),
    galeria: (data.galeria ?? []).map((g) => imgUrl(g, 1200)).filter(Boolean) as string[],
  };
}

export async function getPosts(): Promise<BlogListItem[]> {
  const data = await cachedFetch<{
    _id: string; titulo: string; slug: string; excerpt: string;
    fechaPublicacion?: string; destacado?: boolean;
    categorias?: BlogCategoria[];
    imagenPortada?: SanityImageSource & { ancho?: number; alto?: number };
  }[]>(postsQuery);
  if (!data?.length) {
    return fallbackPosts.map((p) => ({
      slug: p.slug, title: p.title, description: p.description, image: p.image, date: p.date,
      categorias: [],
    }));
  }
  return data.map((p) => ({
    slug: p.slug,
    title: p.titulo,
    description: p.excerpt,
    // Nunca pedir más ancho del que tiene el archivo: agrandarlo desde Sanity
    // sólo interpola y la portada sale borrosa.
    image: imgUrl(p.imagenPortada, Math.min(p.imagenPortada?.ancho ?? 720, 720)),
    date: p.fechaPublicacion,
    destacado: p.destacado,
    categorias: p.categorias ?? [],
  }));
}

export async function getCategoriasBlog() {
  const data = await cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    postCount: number;
  }[]>(categoriasBlogQuery);
  return (data ?? []).filter((c) => c.postCount > 0);
}

export async function getPostBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    titulo: string;
    slug: string;
    excerpt: string;
    autor?: string;
    categorias?: BlogCategoria[];
    fechaPublicacion?: string;
    contenido?: unknown[];
    imagenPortada?: SanityImageSource;
    metaTitle?: string;
    metaDescription?: string;
    originalUrl?: string;
  } | null>(postBySlugQuery, { slug });
}

// -------- slugs (para generateStaticParams) — usan staticFetch, NO Live
// Live/sanityFetch invoca draftMode(), no permitido en build sin request.
export async function getAllCategoriaSlugs() {
  return staticFetch<{ slug: string }[]>(
    `*[_type == "categoria" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllLineaSlugs() {
  return staticFetch<{ slug: string }[]>(
    `*[_type == "linea" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllPostSlugs() {
  return staticFetch<{ slug: string }[]>(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllProductoSlugs() {
  return staticFetch<{ slug: string }[]>(
    `*[_type == "producto" && activo == true && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllMarcaSlugs() {
  return staticFetch<{ slug: string }[]>(
    `*[_type == "marca" && defined(slug.current)]{ "slug": slug.current }`
  );
}
