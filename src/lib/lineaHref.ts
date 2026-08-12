// PLEC es marca propia, no una de las 11 líneas: su contenido vive en la landing
// /plec y su página de línea sólo redirige ahí. Enlazamos directo para no
// mandar al usuario por un salto de redirección.
export function lineaHref(slug: string) {
  return slug === "plec" ? "/plec" : `/productos/quimicos/${slug}`;
}
