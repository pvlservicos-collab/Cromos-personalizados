import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Rate limiting: 10 req/IP/minuto
const membrosRL = new Map<string, { count: number; resetAt: number }>();
function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = membrosRL.get(ip);
  if (!e || now > e.resetAt) { membrosRL.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (e.count >= 10) return false;
  e.count++;
  return true;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRL(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase().slice(0, 255);

  if (!email || email.length < 5 || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const [pedidos, items] = await Promise.all([
    sql`
      SELECT id, nome, clube, sticker_url, preview_url, pdf_url, status, created_at
      FROM pedidos
      WHERE email = ${email}
        AND sticker_url IS NOT NULL
      ORDER BY created_at DESC
    `,
    sql`
      SELECT item_type, offer_name, product_name, price, status, created_at
      FROM pedido_items
      WHERE email = ${email}
      ORDER BY created_at DESC
    `.catch(() => []),
  ]);

  const nome = pedidos[0]?.nome || null;

  if (!pedidos.length && !items.length) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ nome, pedidos, items });
}
