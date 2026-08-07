import { defineField, defineType } from "sanity";

export const sucursal = defineType({
  name: "sucursal",
  title: "Sucursal",
  type: "document",
  fields: [
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Sucursal propia", value: "sucursal" },
          { title: "Distribuidor autorizado", value: "distribuidor" },
        ],
        layout: "radio",
      },
      initialValue: "sucursal",
      validation: (r) => r.required(),
    }),
    defineField({ name: "nombre", title: "Nombre (opcional, para distribuidores)", type: "string" }),
    defineField({ name: "ciudad", type: "string", validation: (r) => r.required() }),
    defineField({ name: "estado", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "esPrincipal",
      title: "Matriz / oficinas centrales",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "telefono", title: "Teléfono", type: "string" }),
    defineField({ name: "telefonoAlt", title: "Teléfono alterno", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "emailAlt", title: "Email alterno", type: "string" }),
    defineField({ name: "direccion", title: "Dirección", type: "text", rows: 3 }),
    defineField({ name: "codigoPostal", title: "Código postal", type: "string" }),
    defineField({
      name: "horario",
      title: "Horario de atención",
      type: "text",
      rows: 3,
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
    select: { title: "ciudad", subtitle: "estado", principal: "esPrincipal", tipo: "tipo", nombre: "nombre" },
    prepare: ({ title, subtitle, principal, tipo, nombre }) => ({
      title: tipo === "distribuidor" && nombre ? `${nombre} — ${title}` : (principal ? `${title} · matriz` : title),
      subtitle: tipo === "distribuidor" ? `Distribuidor · ${subtitle}` : subtitle,
    }),
  },
});
