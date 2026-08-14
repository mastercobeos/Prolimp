import { defineField, defineType } from "sanity";

export const categoriaBlog = defineType({
  name: "categoriaBlog",
  title: "Categoría del blog",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción (opcional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "orden",
      title: "Orden (menor = primero)",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Orden manual", name: "orden", by: [{ field: "orden", direction: "asc" }] },
    { title: "Alfabético", name: "abc", by: [{ field: "nombre", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", subtitle: "slug.current" },
  },
});
