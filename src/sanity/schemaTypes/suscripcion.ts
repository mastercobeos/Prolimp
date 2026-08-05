import { defineField, defineType } from "sanity";

export const suscripcion = defineType({
  name: "suscripcion",
  title: "Suscripción newsletter",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "fecha", type: "datetime", initialValue: () => new Date().toISOString(), readOnly: true }),
    defineField({ name: "origen", type: "string", initialValue: "footer" }),
  ],
  preview: {
    select: { title: "email", subtitle: "fecha" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleString("es-MX") : "",
    }),
  },
  orderings: [{ title: "Más recientes", name: "recent", by: [{ field: "fecha", direction: "desc" }] }],
});
