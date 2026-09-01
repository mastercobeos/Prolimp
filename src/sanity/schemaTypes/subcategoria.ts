import { defineField, defineType } from "sanity";

export const subcategoria = defineType({
  name: "subcategoria",
  title: "Subcategoría",
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
      name: "categoria",
      title: "Categoría padre",
      type: "reference",
      to: [{ type: "categoria" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "descripcion", title: "Descripción corta", type: "text", rows: 3 }),
    defineField({
      name: "orden",
      type: "number",
      description: "Orden de aparición (menor primero)",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", subtitle: "categoria.nombre" },
  },
});
