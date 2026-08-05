import { defineField, defineType } from "sanity";

export const empresa = defineType({
  name: "empresa",
  title: "Empresa (info general)",
  type: "document",
  fields: [
    defineField({ name: "nombre", type: "string", initialValue: "Prolimp" }),
    defineField({ name: "nombreLegal", title: "Razón social", type: "string", initialValue: "Prolimp del Centro" }),
    defineField({ name: "rfc", title: "RFC", type: "string" }),
    defineField({ name: "tagline", type: "string", initialValue: "Fabricantes de químicos y productos de limpieza profesional" }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "fundacion", title: "Año de fundación", type: "string", initialValue: "1971" }),
    defineField({ name: "whatsapp", title: "WhatsApp (sin +)", type: "string", initialValue: "5212291406981" }),
    defineField({ name: "whatsappDisplay", title: "WhatsApp (formato display)", type: "string", initialValue: "+52 1 229 140 6981" }),
    defineField({ name: "email", type: "string", initialValue: "contacto@prolimp.com" }),
    defineField({
      name: "redes",
      title: "Redes sociales",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "plataforma",
              type: "string",
              options: { list: ["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok"] },
            },
            { name: "url", type: "url" },
          ],
          preview: { select: { title: "plataforma", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "certificaciones",
      title: "Certificaciones y reconocimientos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "titulo", type: "string" },
            { name: "descripcion", type: "text", rows: 2 },
            { name: "logo", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
          ],
          preview: { select: { title: "titulo", media: "logo" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Empresa — información general" }) },
});
