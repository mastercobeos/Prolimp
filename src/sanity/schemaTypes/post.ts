import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post del blog",
  type: "document",
  groups: [
    { name: "basico", title: "Básico", default: true },
    { name: "contenido", title: "Contenido" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "titulo", type: "string", group: "basico", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basico",
      options: { source: "titulo", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto (listing)",
      type: "text",
      group: "basico",
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      group: "basico",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
    }),
    defineField({
      name: "fechaPublicacion",
      title: "Fecha de publicación",
      type: "datetime",
      group: "basico",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: "autor", type: "string", group: "basico", initialValue: "Equipo Prolimp" }),
    defineField({
      name: "categorias",
      title: "Categorías",
      description:
        "Selecciona una o varias categorías. Para crear nuevas, ve a 'Categorías del blog' en el menú lateral.",
      type: "array",
      group: "basico",
      of: [{ type: "reference", to: [{ type: "categoriaBlog" }] }],
      initialValue: [],
    }),
    defineField({
      name: "contenido",
      title: "Contenido",
      type: "array",
      group: "contenido",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
        { type: "tabla" },
      ],
    }),
    defineField({
      name: "destacado",
      title: "Destacar en home",
      type: "boolean",
      group: "basico",
      initialValue: false,
    }),
    defineField({ name: "metaTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({ name: "metaDescription", title: "SEO description", type: "text", group: "seo", rows: 2 }),
    defineField({
      name: "originalUrl",
      title: "URL original (si viene del blog anterior)",
      type: "url",
      group: "seo",
    }),
  ],
  orderings: [
    { title: "Más recientes", name: "recent", by: [{ field: "fechaPublicacion", direction: "desc" }] },
  ],
  preview: {
    select: { title: "titulo", subtitle: "excerpt", media: "imagenPortada" },
  },
});
