import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export default defineConfig({
  name: "prolimp",
  title: "Prolimp CMS",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Bloquea que se creen múltiples "home" o "empresa" desde el botón +
    templates: (prev) =>
      prev.filter((t) => !["home", "empresa", "sistemasDilucion"].includes(t.schemaType)),
  },
  document: {
    // Oculta acciones de duplicar/borrar para singletons
    actions: (prev, ctx) => {
      if (["home", "empresa", "sistemasDilucion"].includes(ctx.schemaType)) {
        return prev.filter(({ action }) => !["duplicate", "delete", "unpublish"].includes(action ?? ""));
      }
      return prev;
    },
  },
});
