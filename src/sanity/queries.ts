import { groq } from "next-sanity";

const imgFields = `_type, asset, alt, hotspot, crop`;

export const homeQuery = groq`
  *[_type == "home" && _id == "home-singleton"][0]{
    heroEyebrow,
    heroTituloParte1,
    heroTituloAcento,
    heroLede,
    "heroImagenes": heroImagenes[]{${imgFields}, ctaLabel, ctaHref},
    stats,
    diferenciadores[]{
      titulo,
      descripcion,
      "icon": icon{${imgFields}}
    },
    ctaCierreTitulo,
    ctaCierreLede
  }
`;

export const sistemasDilucionQuery = groq`
  *[_type == "sistemasDilucion" && _id == "sistemas-dilucion-singleton"][0]{
    titulo,
    descripcion,
    "heroImagen": heroImagen{${imgFields}},
    intro,
    beneficios,
    secciones[]{
      titulo,
      contenido,
      "imagen": imagen{${imgFields}}
    },
    "galeria": galeria[]{${imgFields}}
  }
`;

export const empresaQuery = groq`
  *[_type == "empresa" && _id == "empresa-singleton"][0]{
    ...,
    "certificaciones": certificaciones[]{titulo, descripcion, "logo": logo{${imgFields}}}
  }
`;

export const lineasQuery = groq`
  *[_type == "linea"] | order(orden asc, nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    "imagen": imagen{${imgFields}},
    aplicaciones
  }
`;

export const lineaBySlugQuery = groq`
  *[_type == "linea" && slug.current == $slug][0]{
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    descripcionLarga,
    "imagen": imagen{${imgFields}},
    aplicaciones,
    "productos": *[_type == "producto" && references(^._id) && activo == true] | order(nombre asc){
      _id, nombre, "slug": slug.current, descripcionCorta, sku,
      "imagenPrincipal": imagenPrincipal{${imgFields}}
    }
  }
`;

export const categoriasQuery = groq`
  *[_type == "categoria"] | order(orden asc, nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    destacada,
    "imagen": imagen{${imgFields}}
  }
`;

export const categoriaBySlugQuery = groq`
  *[_type == "categoria" && slug.current == $slug][0]{
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    "imagen": imagen{${imgFields}},
    "productos": *[_type == "producto" && categoria._ref == ^._id && activo == true] | order(nombre asc){
      _id, nombre, "slug": slug.current, descripcionCorta, sku, linkExterno,
      "imagenPrincipal": imagenPrincipal{${imgFields}},
      "marca": marca->{nombre, "slug": slug.current}
    }
  }
`;

export const marcasQuery = groq`
  *[_type == "marca"] | order(propia desc, orden asc){
    _id,
    nombre,
    "slug": slug.current,
    "logo": logo{${imgFields}},
    propia,
    "productos": count(*[_type == "producto" && marca._ref == ^._id && activo == true])
  }
`;

export const productosDestacadosQuery = groq`
  *[_type == "producto" && activo == true && destacado == true] | order(nombre asc) [0...12] {
    _id, nombre, "slug": slug.current, sku, descripcionCorta, linkExterno,
    "imagenPrincipal": imagenPrincipal{${imgFields}},
    "categoria": categoria->{nombre, "slug": slug.current},
    "marca": marca->nombre
  }
`;

export const productosByCategoriaYSubcatQuery = groq`
  *[_type == "producto" && activo == true
    && categoria->slug.current == $categoriaSlug
    && $subcatNombre in aplicaciones] | order(nombre asc) {
    _id, nombre, "slug": slug.current, sku, descripcionCorta, linkExterno,
    "imagenPrincipal": imagenPrincipal{${imgFields}},
    "marca": marca->{nombre, "slug": slug.current}
  }
`;

export const marcaBySlugQuery = groq`
  *[_type == "marca" && slug.current == $slug][0]{
    _id, nombre, "slug": slug.current, propia, descripcion,
    "logo": logo{${imgFields}},
    "productos": *[_type == "producto" && marca._ref == ^._id && activo == true] | order(nombre asc){
      _id, nombre, "slug": slug.current, sku, descripcionCorta,
      "imagenPrincipal": imagenPrincipal{${imgFields}},
      "categoria": categoria->{nombre, "slug": slug.current}
    }
  }
`;

export const productoBySlugQuery = groq`
  *[_type == "producto" && slug.current == $slug && activo == true][0]{
    _id, nombre, "slug": slug.current, sku,
    descripcionCorta, descripcion, aplicaciones, beneficios, presentaciones,
    "imagenPrincipal": imagenPrincipal{${imgFields}},
    "galeria": galeria[]{${imgFields}},
    "fichaTecnica": fichaTecnica.asset->{url, originalFilename},
    "hojaSeguridad": hojaSeguridad.asset->{url, originalFilename},
    "categoria": categoria->{nombre, "slug": slug.current},
    "marca": marca->{nombre, "slug": slug.current, "logo": logo{${imgFields}}},
    "linea": linea->{nombre, "slug": slug.current},
    linkExterno,
    metaTitle, metaDescription
  }
`;

export const postsQuery = groq`
  *[_type == "post"] | order(fechaPublicacion desc){
    _id, titulo, "slug": slug.current, excerpt, autor, categoria,
    fechaPublicacion, destacado,
    // El ancho real evita pedirle a Sanity más de lo que la portada tiene:
    // 32 de 49 son menores a 720px y se veían borrosas al agrandarlas.
    "imagenPortada": imagenPortada{${imgFields},
      "ancho": asset->metadata.dimensions.width,
      "alto": asset->metadata.dimensions.height
    }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id, titulo, "slug": slug.current, excerpt, autor, categoria,
    fechaPublicacion,
    // Las imágenes del cuerpo llevan su tamaño real para no pedirle a Sanity
    // más ancho del que tienen (eso las agrandaba y las reventaba).
    contenido[]{
      ...,
      _type == "image" => {
        ...,
        "ancho": asset->metadata.dimensions.width,
        "alto": asset->metadata.dimensions.height
      }
    },
    "imagenPortada": imagenPortada{${imgFields}},
    metaTitle, metaDescription, originalUrl
  }
`;

export const sucursalesQuery = groq`
  *[_type == "sucursal"] | order(tipo asc, esPrincipal desc, orden asc, ciudad asc){
    _id, tipo, nombre, ciudad, estado, esPrincipal, telefono, telefonoAlt, whatsapp,
    email, emailAlt, direccion, codigoPostal, horario, mapaEmbed
  }
`;
