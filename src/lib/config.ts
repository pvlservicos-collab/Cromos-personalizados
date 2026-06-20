import { getDb } from "@/lib/db";
export type { SiteConfig } from "@/lib/config-types";
export { DEFAULT_CONFIG } from "@/lib/config-types";
import type { SiteConfig } from "@/lib/config-types";
import { DEFAULT_CONFIG } from "@/lib/config-types";

let cached: SiteConfig | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

export async function getConfig(): Promise<SiteConfig> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_MS) return cached;

  try {
    const sql = getDb();
    const rows = await sql<{ data: SiteConfig }[]>`
      SELECT data FROM site_config WHERE id = 1 LIMIT 1
    `;
    if (rows.length > 0) {
      cached = { ...DEFAULT_CONFIG, ...(rows[0].data as object) };
      cachedAt = now;
      return cached;
    }
  } catch {
    // tabela pode não existir ainda — usa defaults
  }

  return DEFAULT_CONFIG;
}

export async function saveConfig(data: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getConfig();
  const next = { ...current, ...data };

  const sql = getDb();
  await sql`
    INSERT INTO site_config (id, data, updated_at)
    VALUES (1, ${JSON.stringify(next)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(next)}::jsonb, updated_at = NOW()
  `;

  cached = next;
  cachedAt = Date.now();
  return next;
}

export function invalidateConfigCache() {
  cached = null;
  cachedAt = 0;
}
