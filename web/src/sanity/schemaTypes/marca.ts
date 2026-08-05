import { defineField, defineType } from "sanity";

export const marca = defineType({
  name: "marca",
  title: "Marca",
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
      name: "logo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
    }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 3 }),
    defineField({
      name: "propia",
      title: "Marca propia (Prolimp)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "orden", type: "number", initialValue: 100 }),
  ],
  orderings: [
    { title: "Propias primero", name: "propias", by: [{ field: "propia", direction: "desc" }, { field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", media: "logo" },
  },
});
