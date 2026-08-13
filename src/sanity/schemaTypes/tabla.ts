import { defineField, defineType } from "sanity";

// Bloque tabular reutilizable dentro de portable text. Guarda encabezados y filas
// como arrays de strings; el renderer lo convierte a <table>. Sin celdas ricas: si
// alguna vez hace falta negrita o enlace en una celda, migramos a un array de blocks.
export const tabla = defineType({
  name: "tabla",
  title: "Tabla",
  type: "object",
  fields: [
    defineField({
      name: "titulo",
      title: "Título (opcional, aparece arriba)",
      type: "string",
    }),
    defineField({
      name: "headers",
      title: "Encabezados (fila superior)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "rows",
      title: "Filas",
      type: "array",
      of: [
        {
          type: "object",
          name: "fila",
          fields: [
            defineField({
              name: "celdas",
              title: "Celdas",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { celdas: "celdas" },
            prepare: ({ celdas }) => ({
              title: Array.isArray(celdas) ? celdas.filter(Boolean).join(" · ").slice(0, 80) || "Fila vacía" : "Fila",
            }),
          },
        },
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { titulo: "titulo", rows: "rows", headers: "headers" },
    prepare: ({ titulo, rows, headers }) => ({
      title: titulo || "Tabla",
      subtitle: `${Array.isArray(headers) ? headers.length : 0} cols · ${Array.isArray(rows) ? rows.length : 0} filas`,
    }),
  },
});
