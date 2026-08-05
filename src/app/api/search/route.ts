import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

export const runtime = "nodejs";
export const revalidate = 60;

const query = groq`
  *[_type == "producto" && activo == true && (
    nombre match $q ||
    sku match $q ||
    descripcionCorta match $q
  )] | order(nombre asc) [0...20] {
    _id,
    nombre,
    "slug": slug.current,
    sku,
    descripcionCorta,
    "imagen": imagenPrincipal.asset->url,
    "categoria": categoria->{ nombre, "slug": slug.current },
    "marca": marca->nombre
  }
`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });
  const term = `${q}*`;
  const results = await client.fetch(query, { q: term });
  return NextResponse.json({ results });
}
