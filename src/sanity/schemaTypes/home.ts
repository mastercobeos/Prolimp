import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Home (contenido)",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Etiqueta pequeña (arriba del título)",
      type: "string",
      initialValue: "Fabricantes desde 1971 · ISO 9001",
    }),
    defineField({
      name: "heroTituloParte1",
      title: "Título hero — parte 1",
      type: "string",
      initialValue: "Un mundo más limpio es un lugar",
    }),
    defineField({
      name: "heroTituloAcento",
      title: "Título hero — parte con acento",
      type: "string",
      initialValue: "más seguro y saludable.",
    }),
    defineField({
      name: "heroLede",
      title: "Descripción hero",
      type: "text",
      rows: 3,
      initialValue:
        "Fabricamos 11 líneas de químicos de limpieza profesional y distribuimos las mejores marcas. Soluciones para hoteles, hospitales, restaurantes, industria y hogar en todo México.",
    }),
    defineField({
      name: "heroImagenes",
      title: "Imágenes hero (slider)",
      description: "Si hay más de una, alternan cada 5 segundos con transición suave.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Texto alternativo" }],
        },
      ],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({
      name: "stats",
      title: "Estadísticas (barra bajo el hero)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "valor", title: "Número (ej. 11, 200+)", type: "string" },
            { name: "etiqueta", title: "Etiqueta", type: "string" },
          ],
          preview: { select: { title: "valor", subtitle: "etiqueta" } },
        },
      ],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: "diferenciadores",
      title: "Diferenciadores (3 columnas)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "titulo", type: "string" },
            { name: "descripcion", type: "text", rows: 3 },
            { name: "icon", title: "Icono", type: "image", options: { hotspot: true } },
          ],
          preview: { select: { title: "titulo", subtitle: "descripcion", media: "icon" } },
        },
      ],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "ctaCierreTitulo",
      title: "Título del CTA de cierre",
      type: "string",
      initialValue: "¿Listo para elevar el estándar de limpieza de tu empresa?",
    }),
    defineField({
      name: "ctaCierreLede",
      title: "Descripción del CTA de cierre",
      type: "text",
      rows: 2,
      initialValue: "Nuestros asesores institucionales te ayudan a elegir los productos ideales para tu operación. Cotización sin compromiso.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home — contenido" }),
  },
});
