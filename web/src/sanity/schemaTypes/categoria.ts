import { defineField, defineType } from "sanity";

export const categoria = defineType({
  name: "categoria",
  title: "Categoría",
  type: "document",
  fields: [
    defineField({ name: "nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "descripcion", title: "Descripción corta", type: "text", rows: 3 }),
    defineField({
      name: "imagen",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt (accesibilidad)" }],
    }),
    defineField({
      name: "orden",
      type: "number",
      description: "Orden de aparición (menor primero)",
      initialValue: 100,
    }),
    defineField({
      name: "destacada",
      title: "Mostrar en home",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", media: "imagen", subtitle: "descripcion" },
  },
});
