import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./env";

// Live Content API requiere apiVersion >= 2025-02-19
const liveClient = client.withConfig({ apiVersion: "2025-02-19" });

// serverToken: usado server-side para escuchar cambios y disparar revalidacion.
// browserToken se omite: la app publica solo necesita ver contenido publicado,
// y SanityLive escucha los sync tags publicos sin token en el cliente.
export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  serverToken: readToken,
});
