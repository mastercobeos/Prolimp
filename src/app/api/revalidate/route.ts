import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import type { NextRequest } from "next/server";

// Runtime Node (necesita crypto para verificar firma HMAC de Sanity).
export const runtime = "nodejs";

type WebhookBody = {
  _type?: string;
  slug?: string;
  categoriaSlug?: string;
  lineaSlug?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Missing SANITY_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return Response.json({ error: "Missing signature header" }, { status: 401 });
  }

  const raw = await req.text();
  const valid = await isValidSignature(raw, signature, secret);
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paths = pathsFor(body);
  paths.forEach((p) => revalidatePath(p.path, p.type));

  return Response.json({ revalidated: true, paths });
}

// Mapeo _type → rutas a invalidar. Incluye listings + detail.
function pathsFor({ _type, slug, categoriaSlug, lineaSlug }: WebhookBody): {
  path: string;
  type: "page" | "layout";
}[] {
  switch (_type) {
    case "home":
      return [{ path: "/", type: "page" }];

    case "empresa":
      // Afecta Header + Footer del layout → invalida todo el árbol del site.
      return [{ path: "/", type: "layout" }];

    case "producto":
      return [
        { path: "/", type: "page" },
        { path: "/productos", type: "page" },
        ...(slug ? [{ path: `/producto/${slug}`, type: "page" as const }] : []),
        ...(categoriaSlug ? [{ path: `/productos/${categoriaSlug}`, type: "page" as const }] : []),
        ...(lineaSlug ? [{ path: `/productos/quimicos/${lineaSlug}`, type: "page" as const }] : []),
      ];

    case "categoria":
      return [
        { path: "/", type: "page" },
        { path: "/productos", type: "page" },
        ...(slug ? [{ path: `/productos/${slug}`, type: "page" as const }] : []),
      ];

    case "linea":
      return [
        { path: "/", type: "page" },
        ...(slug ? [{ path: `/productos/quimicos/${slug}`, type: "page" as const }] : []),
      ];

    case "marca":
      return [
        { path: "/", type: "page" },
        ...(slug ? [{ path: `/marca/${slug}`, type: "page" as const }] : []),
      ];

    case "post":
      return [
        { path: "/", type: "page" },
        { path: "/blog", type: "page" },
        ...(slug ? [{ path: `/blog/${slug}`, type: "page" as const }] : []),
      ];

    case "sucursal":
      return [
        { path: "/sucursales", type: "page" },
        { path: "/contacto", type: "page" },
      ];

    case "sistemasDilucion":
      return [{ path: "/sistemas-dilucion", type: "page" }];

    default:
      // Fallback: nuke completo del árbol.
      return [{ path: "/", type: "layout" }];
  }
}
