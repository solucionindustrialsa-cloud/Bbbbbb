import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useSite, type CatId } from "@/lib/store";
import { IconBasket, IconGourd, IconThermo, Kicker, fmt } from "./common";

type Item = {
  key: string;
  cat: CatId;
  kind: "image" | "spec";
  title: string;
  sub: string;
  img?: string;
  price: string;
  tag?: string;
  stats?: { k: string; v: string }[];
};

const catIcon = { mates: IconGourd, termos: IconThermo, canastas: IconBasket };
const shortLabel: Record<CatId, string> = { mates: "Mates", termos: "Termos", canastas: "Canastas" };

/** Distancia a la que queda la tarjeta del frente (igual que antes con 6 paneles). */
const FRONT_Z = 433;
const PER_CAT = 3;

export default function Equipo3D() {
  const { data, img } = useSite();

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const c of data.categories) {
      data.products
        .filter((p) => p.category === c.id && p.status !== "hidden")
        .slice(0, PER_CAT)
        .forEach((p) =>
          out.push({
            key: p.id,
            cat: c.id,
            kind: "image",
            title: p.name,
            sub: p.sub,
            img: p.image || img(c.id),
            price: fmt(p.price),
            tag: p.status === "soldout" ? "agotado" : p.grabable ? "grabable" : "",
          }),
        );
      out.push({
        key: `spec-${c.id}`,
        cat: c.id,
        kind: "spec",
        title: "Ficha técnica",
        sub: c.title,
        price: `desde ${fmt(c.priceFrom)}`,
        stats: c.ringStats.slice(0, 5),
      });
    }
    return out;
  }, [data.categories, data.products, img]);

  const N = items.length;
  const step = 360 / N;
  const radius = Math.max(330, Math.round(250 / Math.tan(Math.PI / N)));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const offsetTarget = useMotionValue(0);
  const offset = useSpring(offsetTarget, { stiffness: 70, damping: 18, mass: 0.5 });
  const spin = useTransform(scrollYProgress, [0, 1], [0, step * (N - 1)]);
  const ringRot = useTransform([spin, offset], ([a, b]: number[]) => a + b);

  const [front, setFront] = useState(0);
  useMotionValueEvent(ringRot, "change", (v) => {
    const idx = ((Math.round(-v / step) % N) + N) % N;
    setFront((c) => (c === idx ? c : idx));
  });

  const drag = useRef<{ x: number; base: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, base: offsetTarget.get() };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    offsetTarget.set(drag.current.base + (e.clientX - drag.current.x) * 0.28);
  };
  const onUp = () => {
    if (!drag.current) return;
    const raw = offsetTarget.get() / step;
    offsetTarget.set(Math.round(raw) * step);
    drag.current = null;
  };

  const active = items[Math.min(front, N - 1)];
  const ActiveIcon = catIcon[active.cat];

  return (
    <section id="equipo" ref={ref} className="relative h-[380vh] bg-yerba-950">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 100%, rgba(61,122,63,0.35), transparent 60%), radial-gradient(60% 40% at 50% 0%, rgba(201,146,42,0.18), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 hairline-grid opacity-30" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5 pt-20 lg:pt-14">
            <div>
              <Kicker>El equipo matero</Kicker>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] font-black text-kraft-50">
                Todo lo que entra
                <br />
                <span className="text-gold-400">en la canasta</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => offsetTarget.set(offsetTarget.get() + step)}
                aria-label="Anterior"
                className="grid size-11 place-items-center rounded-full border border-yerba-600/60 text-kraft-100 transition-all duration-300 hover:border-gold-400 hover:text-gold-300 active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                  <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <button
                onClick={() => offsetTarget.set(offsetTarget.get() - step)}
                aria-label="Siguiente"
                className="grid size-11 place-items-center rounded-full border border-yerba-600/60 text-kraft-100 transition-all duration-300 hover:border-gold-400 hover:text-gold-300 active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                  <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ring */}
          <div
            className="relative mx-auto h-[230px] w-full max-w-[900px] origin-center scale-[0.56] cursor-grab touch-pan-y active:cursor-grabbing sm:h-[340px] sm:scale-[0.82] lg:h-[460px] lg:scale-100"
            style={{ perspective: "1700px", perspectiveOrigin: "50% 45%" }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <div
              className="preserve-3d absolute inset-0"
              style={{ transform: `translateZ(${FRONT_Z - radius}px)` }}
            >
              <motion.div className="preserve-3d absolute inset-0" style={{ rotateY: ringRot, rotateX: 4 }}>
                {items.map((it, i) => {
                  const Icon = catIcon[it.cat];
                  return (
                    <div
                      key={it.key}
                      className="backface-hidden absolute top-1/2 left-1/2 h-[360px] w-[290px] sm:h-[390px] sm:w-[320px]"
                      style={{
                        transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
                      }}
                    >
                      {it.kind === "image" ? (
                        <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-yerba-600/60 bg-yerba-900">
                          <div className="relative h-[62%] overflow-hidden">
                            <img
                              src={it.img}
                              alt={it.title}
                              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-yerba-900 via-transparent to-transparent" />
                            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-yerba-950/80 px-2.5 py-1 text-[9.5px] font-black tracking-[0.18em] text-gold-300 uppercase backdrop-blur">
                              <Icon className="size-3.5" /> {shortLabel[it.cat]}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                              <p className="line-clamp-2 font-display text-[21px] leading-tight font-black text-kraft-50">
                                {it.title}
                              </p>
                              <p className="mt-1.5 line-clamp-2 text-[11.5px] text-kraft-200/60">{it.sub}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-yerba-800 pt-3">
                              <span className="font-display text-lg font-black text-gold-300">{it.price}</span>
                              {it.tag && (
                                <span className="text-[10px] font-bold tracking-[0.18em] text-yerba-300/70 uppercase">
                                  {it.tag}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col rounded-[28px] border border-gold-500/35 bg-gradient-to-b from-yerba-850 to-yerba-950 p-6">
                          <Icon className="size-8 text-gold-400" />
                          <p className="mt-4 text-[10.5px] font-black tracking-[0.24em] text-yerba-300 uppercase">
                            {it.sub}
                          </p>
                          <p className="font-display text-[26px] leading-none font-black text-kraft-50">{it.title}</p>
                          <dl className="mt-5 flex-1 space-y-2.5">
                            {it.stats?.map((s) => (
                              <div key={s.k} className="border-b border-yerba-800 pb-2">
                                <dt className="text-[9.5px] font-bold tracking-[0.18em] text-kraft-200/40 uppercase">
                                  {s.k}
                                </dt>
                                <dd className="text-[12.5px] text-kraft-100/85">{s.v}</dd>
                              </div>
                            ))}
                          </dl>
                          <span className="font-display text-xl font-black text-gold-300">{it.price}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* floor glow */}
            <div
              className="pointer-events-none absolute bottom-[-40px] left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] opacity-70 blur-2xl"
              style={{ background: "radial-gradient(ellipse, rgba(201,146,42,0.35), transparent 70%)" }}
            />
          </div>

          {/* readout */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2.5 text-kraft-100">
              <ActiveIcon className="size-5 text-gold-300" />
              <span className="font-display text-xl font-black">{shortLabel[active.cat]}</span>
            </span>
            <span className="hidden h-4 w-px bg-yerba-700 sm:block" />
            <span className="text-[11.5px] font-bold tracking-[0.2em] text-kraft-200/50 uppercase">
              arrastrá o seguí scrolleando para girar
            </span>
            <span className="hidden h-4 w-px bg-yerba-700 sm:block" />
            <span className="text-[11.5px] text-yerba-300/70">
              {String(Math.min(front, N - 1) + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
