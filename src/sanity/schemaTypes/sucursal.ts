import { defineField, defineType } from "sanity";

export const sucursal = defineType({
  name: "sucursal",
  title: "Sucursal",
  type: "document",
  fields: [
    defineField({ name: "ciudad", type: "string", validation: (r) => r.required() }),
    defineField({ name: "estado", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "esPrincipal",
      title: "Matriz / oficinas centrales",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "telefono", title: "Teléfono", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "direccion", title: "Dirección", type: "text", rows: 3 }),
    defineField({
      name: "horario",
      title: "Horario de atención",
      type: "text",
      rows: 2,
      initialValue: "Lunes a viernes: 9:00 – 18:00\nSábados: 9:00 – 14:00",
    }),
    defineField({
      name: "mapaEmbed",
      title: "URL embed de Google Maps",
      type: "url",
      description: "Copia el src del iframe de Google Maps",
    }),
    defineField({ name: "orden", type: "number", initialValue: 100 }),
  ],
  orderings: [
    { title: "Principal primero", name: "principal", by: [{ field: "esPrincipal", direction: "desc" }, { field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "ciudad", subtitle: "estado", principal: "esPrincipal" },
    prepare: ({ title, subtitle, principal }) => ({
      title: principal ? `${title} · matriz` : title,
      subtitle,
    }),
  },
});
