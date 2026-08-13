// Cada landing ofrece el PDF que le corresponde, no el catálogo general.
// Los archivos viven en Sanity (documento "catalogo"), así que Prolimp puede
// reemplazar un folleto desde el Studio sin tocar código ni hacer deploy.
// Si Sanity está vacío o falla, cae al catálogo general que sigue en public/pdf.

import "server-only";
import { cache } from "react";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";

export type Catalogo = {
  href: string;
  /** Nombre con el que se guarda en la máquina del visitante. */
  nombre: string;
};

export const CATALOGO_GENERAL: Catalogo = {
  href: "/pdf/catalogo-prolimp.pdf",
  nombre: "Catalogo-Prolimp.pdf",
};

const catalogosQuery = groq`
  *[_type == "catalogo" && defined(archivo.asset)]{
    "slug": slug.current,
    nombreDescarga,
    "url": archivo.asset->url,
    "originalFilename": archivo.asset->originalFilename
  }
`;

type CatalogoDoc = {
  slug?: string;
  nombreDescarga?: string;
  url?: string;
  originalFilename?: string;
};

/** cache() de React: por render se consulta una vez aunque la llamen varias páginas. */
const getCatalogos = cache(async (): Promise<Record<string, Catalogo>> => {
  let docs: CatalogoDoc[] = [];
  try {
    docs = await client.fetch<CatalogoDoc[]>(catalogosQuery, {}, { next: { revalidate: 3600 } });
  } catch {
    return {};
  }

  const mapa: Record<string, Catalogo> = {};
  for (const d of docs ?? []) {
    if (!d.slug || !d.url) continue;
    const nombre = d.nombreDescarga || d.originalFilename || "catalogo.pdf";
    // ?dl= hace que el CDN responda con Content-Disposition: attachment y este nombre.
    mapa[d.slug] = { href: `${d.url}?dl=${encodeURIComponent(nombre)}`, nombre };
  }
  return mapa;
});

export async function catalogoPara(slug?: string): Promise<Catalogo> {
  const mapa = await getCatalogos();
  if (slug && mapa[slug]) return mapa[slug];
  return mapa.general ?? CATALOGO_GENERAL;
}
