import type { StructureResolver } from "sanity/structure";

// Singletons agrupan documentos únicos (home, empresa) para que se editen como una sola entrada.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Home")
        .id("home")
        .icon(() => "🏠")
        .child(S.document().schemaType("home").documentId("home-singleton").title("Home")),
      S.listItem()
        .title("Empresa")
        .id("empresa")
        .icon(() => "🏢")
        .child(S.document().schemaType("empresa").documentId("empresa-singleton").title("Empresa")),
      S.listItem()
        .title("Sistemas de Dilución")
        .id("sistemasDilucion")
        .icon(() => "💧")
        .child(S.document().schemaType("sistemasDilucion").documentId("sistemas-dilucion-singleton").title("Sistemas de Dilución")),
      S.divider(),
      S.documentTypeListItem("producto").title("Productos").icon(() => "📦"),
      S.documentTypeListItem("categoria").title("Categorías").icon(() => "🗂️"),
      S.documentTypeListItem("linea").title("Limpiadores Prolimp®").icon(() => "🧪"),
      S.documentTypeListItem("marca").title("Marcas").icon(() => "🏷️"),
      S.divider(),
      S.documentTypeListItem("sucursal").title("Sucursales").icon(() => "📍"),
      S.divider(),
      S.documentTypeListItem("post").title("Blog").icon(() => "📝"),
      S.documentTypeListItem("categoriaBlog").title("Categorías del blog").icon(() => "🏷️"),
      S.divider(),
      S.documentTypeListItem("suscripcion").title("Suscripciones newsletter").icon(() => "📧"),
    ]);
