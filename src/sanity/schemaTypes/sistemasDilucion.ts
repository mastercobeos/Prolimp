import { defineField, defineType } from "sanity";

export const sistemasDilucion = defineType({
  name: "sistemasDilucion",
  title: "Sistemas de Dilución",
  type: "document",
  fields: [
    defineField({ name: "titulo", type: "string", validation: (r) => r.required(), initialValue: "Sistemas de Dilución" }),
    defineField({ name: "descripcion", title: "Descripción / meta", type: "text", rows: 3 }),
    defineField({ name: "heroImagen", title: "Imagen hero", type: "image", options: { hotspot: true } }),
    defineField({
      name: "intro",
      title: "Intro (bloque de texto)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "beneficios",
      title: "Beneficios / puntos clave",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "secciones",
      title: "Secciones adicionales",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "titulo", type: "string" },
            { name: "contenido", type: "array", of: [{ type: "block" }] },
            { name: "imagen", type: "image", options: { hotspot: true } },
          ],
          preview: { select: { title: "titulo", media: "imagen" } },
        },
      ],
    }),
    defineField({
      name: "equipos",
      title: "Otros equipos de dosificación (tarjetas)",
      description: "Tarjetas que aparecen en la sección 'Otros equipos de dosificación' al final de la página.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "titulo", type: "string", validation: (r) => r.required() },
            { name: "descripcion", type: "text", rows: 4, validation: (r) => r.required() },
            {
              name: "imagen",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string" }],
              validation: (r) => r.required(),
            },
          ],
          preview: { select: { title: "titulo", subtitle: "descripcion", media: "imagen" } },
        },
      ],
    }),
    defineField({
      name: "galeria",
      title: "Galería",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Sistemas de Dilución" }) },
});
