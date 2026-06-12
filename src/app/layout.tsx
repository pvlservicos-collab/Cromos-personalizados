import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O Teu Cromo Panini do Mundial 2026 | Cria o teu agora",
  description:
    "Cria o teu cromo Panini personalizado do Mundial 2026! A tua foto com o estilo dos campeões. Ficheiro digital.",
  robots: "index, follow",
  openGraph: {
    title: "O Teu Cromo Panini do Mundial 2026",
    description: "Cria o teu cromo Panini personalizado do Mundial 2026!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.utmify.com.br" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: `window.pixelId = "6a1915dda9b3c3e00a76276a"; var a = document.createElement("script"); a.setAttribute("async", ""); a.setAttribute("defer", ""); a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js"); document.head.appendChild(a);` }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
