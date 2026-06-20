import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const results: Record<string, { ok: boolean; message: string }> = {};

  // DATABASE_URL
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    results.DATABASE_URL = { ok: true, message: "Conectado" };
  } catch (e) {
    results.DATABASE_URL = { ok: false, message: e instanceof Error ? e.message : "Erro" };
  }

  // BLOB_READ_WRITE_TOKEN
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Não configurado");
    const { list } = await import("@vercel/blob");
    await list({ limit: 1 });
    results.BLOB_READ_WRITE_TOKEN = { ok: true, message: "Configurado e acessível" };
  } catch (e) {
    results.BLOB_READ_WRITE_TOKEN = { ok: false, message: e instanceof Error ? e.message : "Erro" };
  }

  // OPENAI_API_KEY
  if (!process.env.OPENAI_API_KEY) {
    results.OPENAI_API_KEY = { ok: false, message: "Não configurado" };
  } else {
    results.OPENAI_API_KEY = { ok: true, message: "Configurado" };
  }

  return NextResponse.json(results);
}
