import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSite, type Category, type CatId } from "@/lib/store";
import {
  IconArrow,
  IconBasket,
  IconCheck,
  IconGourd,
  IconLaser,
  IconThermo,
  Kicker,
  LineMask,
  Reveal,
  fmt,
} from "./common";

const icons: Record<CatId, typeof IconGourd> = { mates: IconGourd, termos: IconThermo, canastas: IconBasket };

const curado = [
  { n: "01", t: "Lavá con agua tibia", d: "Sin jabón, nunca. Solo agua y una bombilla limpia." },
  { n: "02", t: "Yerba usada y 24 h", d: "Cargá yerba usada, humedecé y dejalo reposar un día entero." },
  { n: "03", t: "Raspá las paredes", d: "Con una cuchara sacá el excedente sin lastimar la madera." },
  { n: "04", t: "Aceite de oliva fino", d: "En mates de madera: una gota frotada con paño, cada tanto." },
];

function CategoryRow({ c, i, onGo }: { c: Category; i: number; onGo: (id: string) => void }) {
  const { data, img } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const rotY = useTransform(scrollYProgress, [0, 1], i % 2 === 0 ? [12, -8] : [-12, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);
  const Icon = icons[c.id];
  const flipped = i % 2 === 1;
  const products = data.products.filter((p) => p.category === c.id && p.status !== "hidden");

  return (
    <div ref={ref} className="relative border-t border-yerba-800/80 py-20 first:border-0 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className={flipped ? "lg:order-2" : ""} style={{ perspective: 1300 }}>
          <motion.div
            className="preserve-3d relative overflow-hidden rounded-[32px] border border-yerba-700/70"
            style={{ y, rotateY: rotY }}
          >
            <motion.img
              src={img(c.id)}
              alt={c.title}
              className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
              style={{ scale }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-yerba-950/85 via-transparent to-yerba-950/25" />
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-gold-500/40 bg-yerba-950/75 px-3.5 py-1.5 backdrop-blur">
              <Icon className="size-4 text-gold-300" />
              <span className="text-[10px] font-black tracking-[0.22em] text-gold-200 uppercase">{c.label}</span>
            </div>
            <div
              className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-2xl border border-yerba-600/50 bg-yerba-950/80 px-4 py-3 backdrop-blur"
              style={{ transform: "translateZ(60px)" }}
            >
              <span className="text-[10.5px] font-bold tracking-[0.18em] text-kraft-200/55 uppercase">
                precio desde
              </span>
              <span className="font-display text-2xl font-black text-gold-300">{fmt(c.priceFrom)}</span>
            </div>
          </motion.div>
        </div>

        <div className={flipped ? "lg:order-1" : ""}>
          <Reveal>
            <span className="font-display text-[clamp(3.4rem,7vw,6rem)] leading-none font-black text-yerba-800 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="-mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.95] font-black text-kraft-50">
              <LineMask>{c.title}</LineMask>
            </h3>
            <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-kraft-200/70">{c.lede}</p>
          </Reveal>

          <ul className="mt-7 space-y-3">
            {c.bullets.map((b, k) => (
              <Reveal as="li" key={b} delay={0.05 * k} y={20}>
                <span className="flex items-start gap-3 text-[14px] text-kraft-100/80">
                  <IconCheck className="mt-1 size-4 shrink-0 text-yerba-300" />
                  {b}
                </span>
              </Reveal>
            ))}
          </ul>

          <dl className="mt-8 divide-y divide-yerba-800 border-y border-yerba-800">
            {c.specs.map((s, k) => (
              <Reveal key={s.k} delay={0.04 * k} y={16}>
                <div className="flex items-baseline gap-3 py-2.5">
                  <dt className="w-[110px] shrink-0 text-[10px] font-black tracking-[0.18em] text-kraft-200/40 uppercase">
                    {s.k}
                  </dt>
                  <span className="mb-1.5 hidden flex-1 border-b border-dotted border-yerba-700 sm:block" />
                  <dd className="text-right text-[13px] font-medium text-kraft-100/85">{s.v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          {products.length > 0 && (
            <Reveal className="mt-8">
              <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-kraft-200/40 uppercase">En vitrina</p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="group flex items-center gap-3 rounded-2xl border border-yerba-700/70 bg-yerba-950/50 p-2.5 pr-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50"
                  >
                    <img
                      src={p.image || img(c.id)}
                      alt=""
                      className="size-14 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-kraft-50">{p.name}</span>
                      <span className="block truncate text-[11px] text-kraft-200/50">
                        {p.status === "soldout" ? "Agotado por ahora" : p.sub}
                      </span>
                    </span>
                    <span className="font-display text-[15px] font-black text-gold-300">{fmt(p.price)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onGo("grabado")}
              className="group flex items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-[12.5px] font-bold text-yerba-950 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              <IconLaser className="size-4" />
              Personalizar con grabado
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <span className="text-[11.5px] font-semibold tracking-[0.14em] text-kraft-200/45 uppercase">
              retiro en el día
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Categorias({ onGo }: { onGo: (id: string) => void }) {
  const { data } = useSite();
  return (
    <section id="categorias" className="relative overflow-hidden bg-yerba-900">
      <div className="grain absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 15% 10%, rgba(61,122,63,0.35), transparent 60%), radial-gradient(50% 40% at 90% 80%, rgba(157,108,26,0.28), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 lg:px-10 lg:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>Catálogo · equipo matero</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.88] font-black text-kraft-50">
              <LineMask>Mates, termos</LineMask>
              <LineMask delay={0.08}>
                y <span className="text-gold-400">canastas materas</span>
              </LineMask>
            </h2>
          </div>
          <Reveal delay={0.15} className="max-w-[42ch]">
            <p className="text-[15px] leading-relaxed text-kraft-200/65">
              Trabajamos con talleres de Montevideo, Tacuarembó y el litoral entrerriano. Cada pieza se revisa una por
              una antes de salir del local.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        {data.categories.map((c, i) => (
          <CategoryRow key={c.id} c={c} i={i} onGo={onGo} />
        ))}
      </div>

      {/* curado */}
      <div className="relative mx-auto mb-24 max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <div className="paper overflow-hidden rounded-[32px] p-8 text-yerba-950 sm:p-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Kicker tone="dark">Manual del buen cebador</Kicker>
                <h3 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-none font-black">
                  Cómo curar un mate nuevo
                </h3>
              </div>
              <p className="max-w-[38ch] text-[14px] leading-relaxed text-yerba-900/70">
                Un mate sin curar presta sabores amargos y puede rajarse. Cuatro pasos y queda listo para toda la vida.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {curado.map((c, i) => (
                <Reveal key={c.n} delay={i * 0.08}>
                  <div className="group relative h-full rounded-2xl border border-yerba-900/12 bg-kraft-50/70 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-yerba-700/40 hover:bg-kraft-50 hover:shadow-[0_18px_40px_-18px_rgba(12,26,16,0.5)]">
                    <span className="font-display text-4xl font-black text-yerba-900/15 transition-colors duration-500 group-hover:text-brick-500/70">
                      {c.n}
                    </span>
                    <p className="mt-2 font-display text-lg font-black">{c.t}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-yerba-900/70">{c.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
