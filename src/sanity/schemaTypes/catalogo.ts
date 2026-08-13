import { defineField, defineType } from "sanity";

export const catalogo = defineType({
  name: "catalogo",
  title: "Catálogo / folleto PDF",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      description: "Cómo se llama el folleto internamente. No se muestra en el sitio.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Clave de la página",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
      description:
        "Define qué botón descarga este PDF. Usa el slug de la página: hospitales, " +
        "industria-alimentaria, industria-lactea, plec, lavanderia, tekstil-pro, proomni. " +
        'Usa "general" para el catálogo completo, que es el que cae por defecto donde no hay folleto propio.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "archivo",
      title: "PDF",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "nombreDescarga",
      title: "Nombre al descargar",
      type: "string",
      description:
        "Con el que se guarda en la computadora del visitante. Sin acentos ni espacios " +
        "(usa guiones) y terminado en .pdf — algunos navegadores estropean los demás caracteres.",
      validation: (r) =>
        r.custom((v) =>
          !v || v.endsWith(".pdf") ? true : "Debe terminar en .pdf"
        ),
    }),
  ],
  preview: { select: { title: "nombre", subtitle: "slug.current" } },
});
