import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "nodejs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { email, origen } = await req.json();
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }
    // Slug-based ID → idempotente, un email = un doc
    const _id = `suscripcion-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    await client.createIfNotExists({
      _id,
      _type: "suscripcion",
      email: email.toLowerCase().trim(),
      fecha: new Date().toISOString(),
      origen: origen || "footer",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
