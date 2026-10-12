import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/lib/store";
import { IconArrow, IconBasket, IconLaser, IconThermo, Kicker, Reveal, fmt } from "./common";

const buildItems = (addr: string, free: string) => [
  {
    n: "01",
    Icon: IconBasket,
    t: "Retiro en el día",
    d: `Comprás online y pasás por el local en ${addr}. Si está grabado, te esperamos dos horas después.`,
  },
  {
    n: "02",
    Icon: IconArrow,
    t: "Envíos a todo el país",
    d: `Despacho en 24 h con embalaje rígido y seguimiento. Gratis superando los ${free}.`,
  },
  {
    n: "03",
    Icon: IconThermo,
    t: "Garantía de vacío",
    d: "Cinco años contra pérdida de temperatura en todos los termos de acero de la casa.",
  },
  {
    n: "04",
    Icon: IconLaser,
    t: "Taller propio",
    d: "Nada se terceriza: vectorizamos, calibramos y grabamos acá mismo, delante tuyo si querés.",
  },
];

export default function Servicios({ onGo }: { onGo: (id: string) => void }) {
  const { data } = useSite();
  const items = buildItems(data.settings.address.split("·")[0].trim(), fmt(data.settings.freeShipping));
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-yerba-800 bg-yerba-950 py-20 lg:py-24">
      <motion.div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ x }} aria-hidden>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 font-display text-[22vw] leading-none font-black whitespace-nowrap text-kraft-100">
          SERVICIO · TALLER · ENVÍOS · SERVICIO · TALLER · ENVÍOS
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>La casa</Kicker>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] font-black text-kraft-50">
              Cuatro cosas que nunca fallan
            </h2>
          </div>
          <Reveal delay={0.1}>
            <button
              onClick={() => onGo("grabado")}
              className="group flex items-center gap-2 rounded-full border border-yerba-600 px-5 py-3 text-[12.5px] font-bold text-kraft-100 transition-all duration-300 hover:border-gold-400 hover:text-gold-300"
            >
              Ir al taller láser
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>

        <div className="mt-12 grid divide-y divide-yerba-800 border-y border-yerba-800 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.07}>
              <div className="group relative h-full px-1 py-7 transition-colors duration-500 hover:bg-yerba-900/60 sm:px-6 lg:py-9">
                <span className="absolute top-3 right-2 font-display text-xs font-black tracking-[0.2em] text-yerba-700 transition-colors duration-500 group-hover:text-gold-500/70 lg:right-5">
                  {it.n}
                </span>
                <span className="grid size-12 place-items-center rounded-xl border border-yerba-700 text-yerba-300 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold-400/60 group-hover:text-gold-300">
                  <it.Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-black text-kraft-50">{it.t}</h3>
                <p className="mt-2 max-w-[34ch] text-[13.5px] leading-relaxed text-kraft-200/60">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
