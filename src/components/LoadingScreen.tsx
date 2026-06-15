"use client";

import { useState, useEffect, useRef } from "react";


interface LoadingScreenProps {
  title: string;
  gifUrl: string;
  longWait?: boolean;
  startTime?: number;
}

const curiosidades = [
  "¿Sabías? El Mundial 2026 será el primero con 48 selecciones. ¡Va a ser histórico!",
  "¿Sabías? España es campeona del mundo desde 2010, tras vencer a Holanda en la final.",
  "¿Sabías? La Roja conquistó la Eurocopa 2024, su cuarto título continental.",
  "¿Sabías? El primer Mundial fue en 1930, en Uruguay.",
  "¿Sabías? El récord de goles en un Mundial pertenece a Just Fontaine: 13 goles en 1958.",
  "¿Sabías? Iniesta marcó el gol que dio a España su primer Mundial, en la final de 2010.",
  "¿Sabías? El Santiago Bernabéu tiene capacidad para más de 80.000 espectadores.",
  "¿Sabías? El Mundial 2026 se disputará en EE.UU., México y Canadá.",
  "¿Sabías? El gol más rápido en la historia de los Mundiales se marcó a los 10,8 segundos.",
  "¿Sabías? España venció a Italia 4-0 en la final de la Eurocopa 2012, la mayor goleada en una final.",
  "¿Sabías? Miroslav Klose es el máximo goleador histórico de los Mundiales con 16 goles.",
  "¿Sabías? España es una de las pocas selecciones en ganar tres grandes torneos consecutivos (Eurocopa 2008, Mundial 2010 y Eurocopa 2012).",
  "¿Sabías? La camiseta roja de España es conocida como 'La Roja' en todo el mundo.",
  "¿Sabías? Lamine Yamal se convirtió en el goleador más joven en la historia de la Eurocopa en 2024.",
  "¿Sabías? El Camp Nou es uno de los estadios más grandes de Europa.",
  "¿Sabías? España ganó la Liga de Naciones de la UEFA en 2023.",
  "¿Sabías? El Real Madrid es el club con más Champions League de la historia, con 15 títulos.",
  "¿Sabías? El Athletic Club de Bilbao solo alinea jugadores formados en el País Vasco.",
  "¿Sabías? David Villa es el máximo goleador histórico de la selección española.",
  "¿Sabías? La 'tiki-taka' española marcó una época en el fútbol mundial entre 2008 y 2012.",
  "¿Sabías? Sergio Ramos es el jugador con más partidos disputados con la selección española.",
  "¿Sabías? El FC Barcelona y su cantera, La Masia, formaron a leyendas como Iniesta, Xavi y Messi.",
  "¿Sabías? España, Portugal y Marruecos coorganizarán el Mundial de 2030.",
  "¿Sabías? El Atlético de Madrid ganó LaLiga en la temporada 2020-21.",
  "¿Sabías? Andrés Iniesta y Xavi Hernández son considerados los grandes maestros del centro del campo español.",
  "¿Sabías? España debutó en los Mundiales en 1934 y nunca ha dejado de crecer como potencia futbolística.",
];

export default function LoadingScreen({ title, gifUrl, longWait, startTime }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [curiosidadeIndex, setCuriosidadeIndex] = useState(0);
  const start = useRef(startTime || Date.now());


  useEffect(() => {
    start.current = startTime || Date.now();
    setPercent(0);
    setElapsed(0);
    setCuriosidadeIndex(Math.floor(Math.random() * curiosidades.length));
  }, [startTime]);

  useEffect(() => {
    if (!longWait) return;
    const interval = setInterval(() => {
      setCuriosidadeIndex((prev) => (prev + 1) % curiosidades.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [longWait]);

  useEffect(() => {
    if (!longWait) {
      const duration = 3000;
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = Math.min(100, Math.round(((now - start.current) / duration) * 100));
        setPercent(progress);
        if (progress >= 100) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - start.current;
      setElapsed(Math.floor(elapsedMs / 1000));

      let newPercent: number;
      if (elapsedMs < 60000) {
        newPercent = Math.round((elapsedMs / 60000) * 80);
      } else if (elapsedMs < 180000) {
        const extra = ((elapsedMs - 60000) / 120000) * 18;
        newPercent = Math.round(80 + extra);
      } else {
        newPercent = 99;
      }

      setPercent((prev) => Math.max(prev, newPercent));
    }, 200);

    return () => clearInterval(interval);
  }, [longWait]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4" style={{ background: "#FABD00" }}>
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slide-up">
        <h2
          className="text-3xl md:text-4xl font-bold text-copa-blue tracking-[0.1em] text-center"
          style={{ fontFamily: "var(--font-titulo)" }}
        >
          {title}
        </h2>

        {longWait && (
          <p className="text-sm font-bold text-copa-blue text-center -mt-4" style={{ fontFamily: "var(--font-papernotes)" }}>
            No cierres esta pantalla, puede tardar hasta 2 minutos.
          </p>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.giphy.com/media/yPNVFnPOyo3E4Peg8C/giphy.gif"
          alt="Futbolista"
          style={{ height: 260, width: "auto", borderRadius: 16, objectFit: "cover", display: "block" }}
        />

        {longWait && (
          <div className="text-center leading-snug">
            <p className="text-base font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              ¡Consigue tu cromo HOY y participa en el sorteo de una entrada para el Mundial!
            </p>
            <p className="text-4xl font-black text-copa-green my-1" style={{ fontFamily: "var(--font-titulo)" }}>
              Copa del Mundo 2026
            </p>
            <p className="text-sm text-copa-blue mt-2" style={{ fontFamily: "var(--font-papernotes)" }}>
              Sorteo el 11/07/2026, inicio del Mundial.
            </p>
          </div>
        )}

        <p
          className="text-base text-center min-h-[3rem] transition-opacity duration-500"
          style={{ fontFamily: "var(--font-papernotes)" }}
        >
          {longWait ? (
            <span className="text-copa-blue font-bold">{curiosidades[curiosidadeIndex]}</span>
          ) : (
            "¡Este es un crack!"
          )}
        </p>

        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {"Cargando..."}
            </span>
            <span className="text-sm font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {percent}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-copa-blue rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
