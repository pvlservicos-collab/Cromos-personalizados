"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

const FAQ_ITEMS = [
  {
    q: "¿Cuándo voy a recibir mi cromo?",
    a: "Tu cromo se genera automáticamente y puedes acceder a él en el área de descargas con tu número de WhatsApp.",
  },
  {
    q: "¿Cómo descargo mi cromo?",
    a: "Introduce tu número abajo, accede al área de descargas y haz clic en '⬇ Descargar PNG'.",
  },
  {
    q: "Compré más de 1 producto",
    a: "Introduce tu número en el formulario de abajo para acceder al área de descargas con todos tus productos.",
  },
  {
    q: "¿El cromo es digital o físico?",
    a: "Tu cromo es una imagen digital (PNG) lista para compartir en WhatsApp, redes sociales o imprimir en casa.",
  },
];

function FaqBubble() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [labelVisible, setLabelVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setLabelVisible(true), 8000);
    const hide = setTimeout(() => setLabelVisible(false), 14000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", bottom: 24, right: 20, zIndex: 1000, display: "flex", alignItems: "center", gap: 12 }}>
        {labelVisible && !open && (
          <div style={{
            background: "#fff", color: "#C8102E", fontWeight: 700, fontSize: 13,
            borderRadius: 20, padding: "8px 14px", boxShadow: "0 4px 20px rgba(0,0,0,.25)",
            whiteSpace: "nowrap", animation: "fadeInLabel .3s ease",
          }}>
            ¿Alguna duda?
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => { setOpen(o => !o); setLabelVisible(false); }}
            className="faq-bubble-btn"
            style={{
              borderRadius: "50%", border: "none", cursor: "pointer",
              background: "#C8102E",
              boxShadow: "0 6px 28px rgba(200,16,46,.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0, overflow: "hidden",
              transition: "transform .2s",
            }}
            aria-label="Preguntas frecuentes"
          >
            {open ? (
              <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>✕</span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/fotosuporte.png"
                alt="Soporte"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </button>
          <div style={{
            background: "#C8102E", color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: ".08em",
            borderRadius: 6, padding: "3px 10px",
          }}>
            SOPORTE
          </div>
        </div>
      </div>

      {open && (
        <div style={{
          position: "fixed", bottom: 140, right: 20, zIndex: 999,
          width: "min(340px, calc(100vw - 40px))",
          background: "#fff", borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,.35)",
          overflow: "hidden", animation: "slideUp .25s ease",
        }}>
          <div style={{ background: "linear-gradient(135deg, #C8102E, #E61E3D)", padding: "16px 20px" }}>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 15, margin: 0 }}>Preguntas frecuentes</p>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 12, margin: "2px 0 0" }}>Respuestas rápidas para ti</p>
          </div>
          <div style={{ padding: "8px 0", maxHeight: 340, overflowY: "auto" }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "14px 20px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{item.q}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{expanded === i ? "▲" : "▼"}</span>
                </button>
                {expanded === i && (
                  <p style={{ margin: 0, padding: "0 20px 14px", fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <a
              href="https://api.whatsapp.com/send?phone=559294621319&text=Hola%2C%20compr%C3%A9%20un%20cromo%20y%20necesito%20ayuda."
              target="_blank" rel="noopener noreferrer"
              style={{ color: "#25d366", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            >
              💬 Hablar con soporte
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default function Obrigado() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    track("obrigado");

    const params = new URLSearchParams(window.location.search);
    const foneParam = params.get("fone");
    if (foneParam) {
      const digits = foneParam.replace(/\D/g, "").slice(0, 15);
      if (digits.length >= 9) { router.replace(`/membros?fone=${digits}`); return; }
    }
  }, [router]);

  const handleLogin = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) { setError("Introduce un número de móvil válido (9 dígitos)."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/membros?fone=${digits}`);
      if (res.status === 404) { setError("No se encontró ninguna compra para ese número."); return; }
      if (!res.ok) throw new Error();
      router.push(`/membros?fone=${digits}`);
    } catch {
      setError("Error al verificar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh", background: "#FABD00",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "36px 16px 56px",
    }}>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(198,11,30,.15)", borderRadius: 12, padding: "8px 18px", marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>⚽</span>
          <span style={{ color: "#C60B1E", fontWeight: 800, fontSize: 13, letterSpacing: ".1em" }}>CROMO MUNDIAL 2026</span>
        </div>
        <h1 style={{ color: "#C60B1E", fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: ".08em", fontFamily: "var(--font-titulo, 'Arial Black', sans-serif)" }}>
          ¡GRACIAS!
        </h1>
        <p style={{ color: "#1a1a1a", fontSize: 16, margin: 0, fontWeight: 600 }}>
          Tu pago ha sido confirmado ✓
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#C8102E", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
            📱 Descarga tu cromo con tu número:
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", fontFamily: "var(--font-papernotes)" }}>
            Escribe el número que indicaste al principio para acceder a tu cromo y a todos tus productos.
          </p>

          <input
            type="tel"
            inputMode="numeric"
            placeholder="Ej: 612345678"
            value={phone}
            maxLength={15}
            disabled={loading}
            autoFocus
            onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(null); }}
            onKeyDown={e => e.key === "Enter" && !loading && handleLogin()}
            style={{
              width: "100%", boxSizing: "border-box",
              border: `2px solid ${error ? "#ef4444" : "#C8102E"}`,
              borderRadius: 14, padding: "16px 18px",
              fontSize: 18, outline: "none", color: "#0f172a",
              fontWeight: 600, letterSpacing: ".04em",
              marginBottom: 12, textAlign: "center",
            }}
          />

          {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "0 0 10px", fontWeight: 600 }}>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "18px", border: "none", borderRadius: 14,
              cursor: loading ? "default" : "pointer",
              background: "linear-gradient(135deg, #E2101F 0%, #AA151B 100%)", color: "#fff",
              fontSize: 17, fontWeight: 800, letterSpacing: ".1em",
              fontFamily: "var(--font-titulo)", opacity: loading ? 0.7 : 1,
              boxShadow: "0 6px 24px rgba(170,21,27,.4)",
            }}
          >
            {loading ? "VERIFICANDO..." : "ACCEDER A MI CROMO →"}
          </button>
        </div>

        <a
          href="/"
          onClick={() => { try { localStorage.removeItem("figurinha_sticker_id"); sessionStorage.removeItem("figurinha_sticker_url"); sessionStorage.removeItem("figurinha_sticker_id"); } catch {/**/ } }}
          style={{ display: "block", textAlign: "center", color: "rgba(0,0,0,.5)", fontSize: 13, textDecoration: "underline", padding: "16px 8px" }}
        >
          Crear nuevo cromo
        </a>
      </div>

      <FaqBubble />

      <style>{`
        @keyframes fadeInLabel { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .faq-bubble-btn { width:46px; height:46px }
        @media(min-width:641px){.faq-bubble-btn{width:92px;height:92px}}
      `}</style>
    </main>
  );
}

