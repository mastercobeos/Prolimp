// Adapter Sanity → shape que usa la UI (mismo que lib/content.ts).
// Toda la app lee de acá. Si Sanity está vacío o falla, cae a lib/content.ts.

import "server-only";
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
  sucursalesQuery,
  sistemasDilucionQuery,
  productoBySlugQuery,
  productosDestacadosQuery,
  marcaBySlugQuery,
} from "@/sanity/queries";
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

const cachedFetch = <T>(query: string, params?: Record<string, unknown>) =>
  client.fetch<T>(query, params ?? {}, {
    next: { revalidate: 60, tags: ["sanity"] },
  });

// -------- home
export async function getHomeContent() {
  const data = await cachedFetch<{
    heroEyebrow?: string;
    heroTituloParte1?: string;
    heroTituloAcento?: string;
    heroLede?: string;
    heroImagen?: SanityImageSource;
    stats?: { valor: string; etiqueta: string }[];
    diferenciadores?: { titulo: string; descripcion: string; icon?: SanityImageSource }[];
    ctaCierreTitulo?: string;
    ctaCierreLede?: string;
  }>(homeQuery);
  return {
    heroEyebrow: data?.heroEyebrow ?? "Fabricantes desde 1971 · ISO 9001",
    heroTituloParte1: data?.heroTituloParte1 ?? "Un mundo más limpio es un lugar",
    heroTituloAcento: data?.heroTituloAcento ?? "más seguro y saludable.",
    heroLede: data?.heroLede ?? "Fabricamos 11 líneas de químicos de limpieza profesional...",
    heroImagen:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&q=85&auto=format&fit=crop",
    stats: data?.stats?.length
      ? data.stats
      : [
          { valor: "11", etiqueta: "Líneas químicos propios" },
          { valor: "200+", etiqueta: "Productos en catálogo" },
          { valor: "50+", etiqueta: "Años de experiencia" },
        ],
    diferenciadores: data?.diferenciadores?.length
      ? data.diferenciadores.map((d) => ({
          titulo: d.titulo,
          descripcion: d.descripcion,
          icon: imgUrl(d.icon, 96) ?? "/img/nosotros/especializados-icon.webp",
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
    image: imgUrl(l.imagen, 500) ?? "/img/lineas/automotriz.webp",
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
    image: imgUrl(c.imagen, 500) ?? "/img/categorias/quimicos.webp",
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
  return data.map((m) => ({
    slug: m.slug,
    nombre: m.nombre,
    image: imgUrl(m.logo, 300) ?? "/img/marcas/prolimp.webp",
    productos: m.productos ?? 0,
  }));
}

// -------- marca por slug (para landing dedicada)
export async function getMarcaBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    nombre: string;
    slug: string;
    propia?: boolean;
    descripcion?: string;
    logo?: SanityImageSource;
    productos?: {
      _id: string;
      nombre: string;
      slug: string;
      sku?: string;
      descripcionCorta?: string;
      imagenPrincipal?: SanityImageSource;
      categoria?: { nombre: string; slug: string };
    }[];
  } | null>(marcaBySlugQuery, { slug });
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
export async function getSucursales() {
  const data = await cachedFetch<{
    _id: string;
    ciudad: string;
    estado: string;
    esPrincipal?: boolean;
    telefono?: string;
    whatsapp?: string;
    email?: string;
    direccion?: string;
    horario?: string;
    mapaEmbed?: string;
  }[]>(sucursalesQuery);
  if (!data?.length) return fallback.sucursales;
  return data;
}

// -------- blog
export type BlogListItem = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  destacado?: boolean;
  categoria?: string;
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
    galeria: (data.galeria ?? []).map((g) => imgUrl(g, 1200)).filter(Boolean) as string[],
  };
}

export async function getPosts(): Promise<BlogListItem[]> {
  const data = await cachedFetch<{
    _id: string; titulo: string; slug: string; excerpt: string;
    fechaPublicacion?: string; destacado?: boolean; categoria?: string;
    imagenPortada?: SanityImageSource;
  }[]>(postsQuery);
  if (!data?.length) {
    return fallbackPosts.map((p) => ({
      slug: p.slug, title: p.title, description: p.description, image: p.image, date: p.date,
    }));
  }
  return data.map((p) => ({
    slug: p.slug,
    title: p.titulo,
    description: p.excerpt,
    image: imgUrl(p.imagenPortada, 1200),
    date: p.fechaPublicacion,
    destacado: p.destacado,
    categoria: p.categoria,
  }));
}

export async function getPostBySlug(slug: string) {
  return cachedFetch<{
    _id: string;
    titulo: string;
    slug: string;
    excerpt: string;
    autor?: string;
    categoria?: string;
    fechaPublicacion?: string;
    contenido?: unknown[];
    imagenPortada?: SanityImageSource;
    metaTitle?: string;
    metaDescription?: string;
    originalUrl?: string;
  } | null>(postBySlugQuery, { slug });
}

// -------- slugs (para generateStaticParams)
export async function getAllCategoriaSlugs() {
  return cachedFetch<{ slug: string }[]>(
    `*[_type == "categoria" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllLineaSlugs() {
  return cachedFetch<{ slug: string }[]>(
    `*[_type == "linea" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllPostSlugs() {
  return cachedFetch<{ slug: string }[]>(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllProductoSlugs() {
  return cachedFetch<{ slug: string }[]>(
    `*[_type == "producto" && activo == true && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getAllMarcaSlugs() {
  return cachedFetch<{ slug: string }[]>(
    `*[_type == "marca" && defined(slug.current)]{ "slug": slug.current }`
  );
}
