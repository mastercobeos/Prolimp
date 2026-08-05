// Mapping slug → nombre exacto de sub-categorías por categoría padre.
// Las sub-categorías se guardan como tags de texto en el campo `aplicaciones` de cada producto.
// Este archivo permite generar rutas /productos/[categoria]/[subcategoria] y filtrar por nombre.

export const SUBCATEGORIAS: Record<string, { slug: string; nombre: string }[]> = {
  detergentes: [
    { slug: "jabon-de-tocador", nombre: "Jabón de Tocador" },
    { slug: "jabon-hotelero", nombre: "Jabón Hotelero" },
    { slug: "jabon-de-lavanderia", nombre: "Jabón de Lavandería" },
  ],
  dosificadores: [
    { slug: "despachador-de-higienicos", nombre: "Despachador de higiénicos" },
    { slug: "despachador-de-toalla", nombre: "Despachador de toalla" },
    { slug: "dosificador-de-aroma", nombre: "Dosificador de aroma" },
    { slug: "jaboneras", nombre: "Jaboneras" },
    { slug: "secador-de-manos", nombre: "Secador de Manos" },
    { slug: "servilleteros", nombre: "Servilleteros" },
  ],
  jarceria: [
    { slug: "accesorios-para-bano", nombre: "Accesorios para baño" },
    { slug: "atomizadores", nombre: "Atomizadores" },
    { slug: "bastones", nombre: "Bastones" },
    { slug: "cepillos", nombre: "Cepillos" },
    { slug: "cubetas", nombre: "Cubetas" },
    { slug: "discos", nombre: "Discos" },
    { slug: "escobas", nombre: "Escobas" },
    { slug: "escobetas-y-escobillones", nombre: "Escobetas y escobillones" },
    { slug: "extensiones", nombre: "Extensiones" },
    { slug: "fibras", nombre: "Fibras" },
    { slug: "franelas-y-microfibras", nombre: "Franelas y microfibras" },
    { slug: "jaladores", nombre: "Jaladores" },
    { slug: "limpia-vidrios", nombre: "Limpia Vidrios" },
    { slug: "trapeadores-mops", nombre: "Trapeadores/Mops" },
    { slug: "recogedores", nombre: "Recogedores" },
  ],
  higienicos: [
    { slug: "higienicos", nombre: "Higiénicos" },
    { slug: "panuelos", nombre: "Pañuelos" },
    { slug: "servilletas", nombre: "Servilletas" },
    { slug: "servitoallas", nombre: "Servitoallas" },
    { slug: "toalla-para-manos", nombre: "Toalla para manos" },
  ],
  "plasticos-desechables": [
    { slug: "aluminio-y-plasticos-desechables", nombre: "Aluminio y plásticos desechables" },
    { slug: "bolsas", nombre: "Bolsas" },
  ],
  seguridad: [
    { slug: "cubrebocas", nombre: "Cubrebocas" },
    { slug: "gorros-y-cofias", nombre: "Gorros y Cofias" },
    { slug: "guantes", nombre: "Guantes" },
    { slug: "tapetes", nombre: "Tapetes" },
  ],
  varios: [
    { slug: "botes-de-basura", nombre: "Botes de basura" },
    { slug: "carrito-de-limpieza", nombre: "Carrito de Limpieza" },
  ],
};

/** Obtiene la sub-categoría por slugs de categoría + sub */
export function getSubcategoria(catSlug: string, subSlug: string) {
  return SUBCATEGORIAS[catSlug]?.find((s) => s.slug === subSlug) ?? null;
}

/** Lista sub-categorías de una categoría */
export function getSubcategorias(catSlug: string) {
  return SUBCATEGORIAS[catSlug] ?? [];
}

/** Todas las combinaciones para generateStaticParams */
export function getAllSubcategoriaParams() {
  return Object.entries(SUBCATEGORIAS).flatMap(([catSlug, subs]) =>
    subs.map((s) => ({ categoria: catSlug, subcategoria: s.slug }))
  );
}
