"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/config-types";
import { DEFAULT_CONFIG } from "@/lib/config-types";

type CheckResult = Record<string, { ok: boolean; message: string }>;

const FIELDS: { key: keyof SiteConfig; label: string; hint: string }[] = [
  { key: "price",              label: "Preço",                hint: "Ex: €2,99" },
  { key: "checkoutUrl",        label: "URL de Checkout",      hint: "https://..." },
  { key: "firstButtonText",    label: "Botão inicial (Hero)", hint: "Ex: CREAR MI CROMO" },
  { key: "purchaseButtonText", label: "Botão de compra",      hint: "Ex: ⚽ DESBLOQUEAR MI CROMO" },
  { key: "locale",             label: "Locale",               hint: "Ex: es-ES" },
  { key: "currency",           label: "Moeda",                hint: "Ex: EUR" },
];

export default function ConfigPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"config" | "check">("config");
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<CheckResult | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then(r => {
        if (r.status === 401) { router.replace("/painel"); return null; }
        return r.json();
      })
      .then(d => { if (d) setConfig(d); })
      .catch(() => router.replace("/painel"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (r.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true); setCheckResults(null);
    try {
      const r = await fetch("/api/config/check");
      if (r.ok) setCheckResults(await r.json());
    } finally {
      setChecking(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#FABD00", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontWeight: 700, fontSize: 18 }}>Cargando...</p>
    </div>
  );

  return (
    <main style={{
      minHeight: "100vh", background: "#FABD00",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "32px 16px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#C60B1E", letterSpacing: ".06em" }}>
            ⚙️ Configuración del sitio
          </h1>
          <a href="/painel" style={{ fontSize: 13, color: "rgba(0,0,0,.5)", textDecoration: "underline" }}>← Painel</a>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["config", "check"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 13, letterSpacing: ".06em",
              background: tab === t ? "#C60B1E" : "rgba(0,0,0,.1)",
              color: tab === t ? "#fff" : "#333",
            }}>
              {t === "config" ? "Configuração" : "Verificação"}
            </button>
          ))}
        </div>

        {tab === "config" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {FIELDS.map(({ key, label, hint }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: ".08em", textTransform: "uppercase" }}>
                    {label}
                  </label>
                  <input
                    value={config[key]}
                    onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={hint}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      border: "2px solid #e2e8f0", borderRadius: 10, padding: "12px 14px",
                      fontSize: 15, outline: "none", color: "#0f172a",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "14px 28px", border: "none", borderRadius: 12, cursor: saving ? "default" : "pointer",
                  background: "linear-gradient(135deg, #E2101F 0%, #AA151B 100%)", color: "#fff",
                  fontSize: 15, fontWeight: 800, letterSpacing: ".08em", opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Guardando..." : "GUARDAR"}
              </button>
              {saved && <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✓ Guardado</span>}
            </div>
          </div>
        )}

        {tab === "check" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b" }}>
              Verifica os segredos configurados no Vercel (DATABASE_URL, BLOB_READ_WRITE_TOKEN, OPENAI_API_KEY).
            </p>
            <button
              onClick={handleCheck}
              disabled={checking}
              style={{
                padding: "14px 28px", border: "none", borderRadius: 12, cursor: checking ? "default" : "pointer",
                background: "linear-gradient(135deg, #E2101F 0%, #AA151B 100%)", color: "#fff",
                fontSize: 15, fontWeight: 800, letterSpacing: ".08em", opacity: checking ? 0.7 : 1,
                marginBottom: 20,
              }}
            >
              {checking ? "Verificando..." : "VERIFICAR SEGREDOS"}
            </button>

            {checkResults && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(checkResults).map(([key, { ok, message }]) => (
                  <div key={key} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "14px 16px", borderRadius: 12,
                    background: ok ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
                  }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{ok ? "✅" : "❌"}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: ok ? "#166534" : "#991b1b" }}>{key}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: ok ? "#15803d" : "#dc2626" }}>{message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
