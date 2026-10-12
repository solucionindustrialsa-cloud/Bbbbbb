import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconLeaf, IconStar } from "./common";
import { cn } from "@/utils/cn";

const quotes = [
  {
    q: "Me grabaron el mate con las iniciales de mi abuelo y la fecha del club. Quedó perfecto, se nota que está quemado en la madera y no pintado.",
    n: "Federico R.",
    r: "Tacuarembó · mate de algarrobo + grabado",
  },
  {
    q: "Pedí 40 canastas materas con el logo de la empresa para fin de año. Maqueta en dos días, entrega en una semana y ninguna pieza llegó marcada.",
    n: "Valentina P.",
    r: "Montevideo · pedido corporativo",
  },
  {
    q: "Fui a comprar Canarias y terminé saliendo con termo, canasta y una clase de cómo cebar. Te explican la molienda de cada yerba sin apuro.",
    n: "Diego M.",
    r: "Canelones · equipo completo",
  },
  {
    q: "El termo grabado con fibra quedó negro mate sobre el acero, se lava todos los días y ni se movió. Vale cada peso.",
    n: "Lucía A.",
    r: "Paysandú · termo 1,2 L grabado",
  },
];

export default function Testimonios() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % quotes.length), 5200);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <section
      className="paper relative overflow-hidden py-20 text-yerba-950 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute -right-16 -bottom-24 size-[380px] rounded-full opacity-20 blur-2xl"
        style={{ background: "radial-gradient(circle,#c9922a,transparent 65%)" }}
      />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 lg:grid-cols-[0.55fr_1fr] lg:px-10">
        <div>
          <span className="font-display text-[7rem] leading-[0.6] font-black text-yerba-900/12 select-none">“</span>
          <p className="mt-4 text-[11px] font-black tracking-[0.24em] text-yerba-900/55 uppercase">
            La ronda dice
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-gold-500">
            {Array.from({ length: 5 }).map((_, k) => (
              <IconStar key={k} className="size-4" />
            ))}
            <span className="ml-2 text-[12px] font-bold text-yerba-900/65">4,9 · 612 reseñas</span>
          </div>
          <div className="mt-7 flex gap-2">
            {quotes.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Testimonio ${k + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  k === i ? "w-10 bg-yerba-800" : "w-4 bg-yerba-900/20 hover:bg-yerba-900/40",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[230px]" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, rotateY: 12, x: 60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -12, x: -60 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="preserve-3d rounded-[28px] border border-yerba-900/12 bg-kraft-50/80 p-8 shadow-[0_28px_60px_-40px_rgba(12,26,16,0.65)] sm:p-10"
            >
              <p className="font-display text-[clamp(1.25rem,2.5vw,2rem)] leading-[1.22] font-bold text-yerba-950">
                {quotes[i].q}
              </p>
              <footer className="mt-7 flex items-center gap-3 border-t border-yerba-900/10 pt-5">
                <span className="grid size-10 place-items-center rounded-full bg-yerba-800 text-gold-300">
                  <IconLeaf className="size-5" />
                </span>
                <span>
                  <span className="block text-[13.5px] font-black text-yerba-950">{quotes[i].n}</span>
                  <span className="block text-[11.5px] text-yerba-900/60">{quotes[i].r}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
