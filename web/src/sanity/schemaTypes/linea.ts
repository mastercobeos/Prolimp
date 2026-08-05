import { defineField, defineType } from "sanity";

export const linea = defineType({
  name: "linea",
  title: "Línea de químicos",
  type: "document",
  fields: [
    defineField({ name: "nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción corta (aparece en cards)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción larga (página de línea)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagen",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
    }),
    defineField({ name: "orden", type: "number", initialValue: 100 }),
    defineField({
      name: "aplicaciones",
      title: "Aplicaciones típicas",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: { select: { title: "nombre", media: "imagen", subtitle: "descripcion" } },
});
