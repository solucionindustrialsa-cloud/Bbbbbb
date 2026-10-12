import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Yerba } from "@/lib/data";
import { useSite } from "@/lib/store";
import { IconArrow, IconCheck, IconLeaf, Intensity, Kicker, LineMask, Reveal, fmt } from "./common";
import { cn } from "@/utils/cn";

const filters = ["Todas", "Tradicional", "Con palo", "Despalada", "Compuesta", "Orgánica"] as const;
type Filter = (typeof filters)[number];

type Pack = { bg: string; fg: string; accent: string; tag: string; ray: string };

/* vintage package palettes — each label drawn in SVG, no two alike */
const packStyles: Record<string, Pack> = {
  canarias: { bg: "#d9b32c", fg: "#152a17", accent: "#b3402a", tag: "elaborada · tipo uruguayo", ray: "#c99f22" },
  playadito: { bg: "#f2d34b", fg: "#1c3f6e", accent: "#2f7a3f", tag: "suave · con palo", ray: "#e3c33c" },
  rosamonte: { bg: "#1b3520", fg: "#e9d6a3", accent: "#c9922a", tag: "despalada · 18 meses", ray: "#24462b" },
  taragui: { bg: "#b3402a", fg: "#f6ecd8", accent: "#f0cf7a", tag: "liviana · con palo", ray: "#a13723" },
  amanda: { bg: "#2c5c3a", fg: "#f0e3bb", accent: "#9ccb5e", tag: "menta & poleo", ray: "#356b45" },
  kraus: { bg: "#e7dabd", fg: "#2b4a2a", accent: "#6b8f3a", tag: "agroecológica · sin humo", ray: "#dccca9" },
  cbse: { bg: "#4d3272", fg: "#f3e6c9", accent: "#e3b23f", tag: "guaraná · energizante", ray: "#5b3d85" },
  tranquera: { bg: "#7c4a24", fg: "#f3e3c2", accent: "#e3b23f", tag: "premium · hoja elegida", ray: "#8a552c" },
};

/* paletas para las yerbas que agrega el dueño */
const fallbackPalettes: Omit<Pack, "tag">[] = [
  { bg: "#c9922a", fg: "#1a1109", accent: "#8c2f1e", ray: "#b8841f" },
  { bg: "#3d7a3f", fg: "#f6ecd8", accent: "#f0cf7a", ray: "#478a49" },
  { bg: "#8c2f1e", fg: "#f6ecd8", accent: "#e3b23f", ray: "#7b2819" },
  { bg: "#e7dabd", fg: "#1d3b25", accent: "#b3402a", ray: "#dccca9" },
  { bg: "#1d3b25", fg: "#f0cf7a", accent: "#9ccb5e", ray: "#254b30" },
  { bg: "#2f5d8a", fg: "#f6ecd8", accent: "#f0cf7a", ray: "#386ca0" },
];

function paletteFor(y: Yerba): Pack {
  const known = packStyles[y.id];
  if (known) return known;
  let h = 0;
  for (const ch of y.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const p = fallbackPalettes[h % fallbackPalettes.length];
  return { ...p, tag: `${y.type.toLowerCase()} · intensidad ${y.intensity}` };
}

function Label({ y }: { y: Yerba }) {
  const s = paletteFor(y);
  const brand = (y.brand || "YERBA").toUpperCase();
  const fs = Math.max(21, Math.min(46, 340 / brand.length));
  const uid = `arc-${y.id}`;
  const uid2 = `ray-${y.id}`;
  return (
    <svg viewBox="0 0 300 230" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <path id={uid} d="M40 104a110 110 0 0 1 220 0" fill="none" />
        <radialGradient id={uid2} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor={s.ray} />
          <stop offset="100%" stopColor={s.bg} />
        </radialGradient>
      </defs>

      <rect width="300" height="230" fill={`url(#${uid2})`} />
      {/* sunburst */}
      <g opacity="0.28" stroke={s.fg} strokeWidth="1.1">
        {Array.from({ length: 26 }).map((_, k) => {
          const a = (k / 26) * Math.PI * 2;
          return (
            <line
              key={k}
              x1={150 + Math.cos(a) * 34}
              y1={96 + Math.sin(a) * 34}
              x2={150 + Math.cos(a) * 190}
              y2={96 + Math.sin(a) * 190}
            />
          );
        })}
      </g>
      {/* frame */}
      <rect x="11" y="11" width="278" height="208" fill="none" stroke={s.fg} strokeOpacity="0.55" strokeWidth="3" />
      <rect x="18" y="18" width="264" height="194" fill="none" stroke={s.fg} strokeOpacity="0.3" strokeWidth="1" />

      {/* arc text */}
      <text
        fill={s.fg}
        fillOpacity="0.8"
        style={{ fontFamily: "Archivo, sans-serif", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.42em" }}
      >
        <textPath href={`#${uid}`} startOffset="50%" textAnchor="middle">
          YERBA MATE
        </textPath>
      </text>

      {/* emblem */}
      <g transform="translate(150 74)">
        <circle r="15" fill="none" stroke={s.fg} strokeWidth="2" />
        <circle r="9" fill={s.accent} opacity="0.9" />
        {Array.from({ length: 12 }).map((_, k) => {
          const a = (k / 12) * Math.PI * 2;
          return (
            <line
              key={k}
              x1={Math.cos(a) * 17}
              y1={Math.sin(a) * 17}
              x2={Math.cos(a) * 23}
              y2={Math.sin(a) * 23}
              stroke={s.fg}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* brand */}
      <text
        x="150"
        y="140"
        textAnchor="middle"
        fill={s.fg}
        textLength={Math.min(brand.length * fs * 0.68, 246)}
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "Fraunces, serif", fontSize: fs, fontWeight: 900, letterSpacing: "-0.01em" }}
      >
        {brand}
      </text>

      {/* rule + tagline */}
      <line x1="70" y1="152" x2="230" y2="152" stroke={s.fg} strokeOpacity="0.4" strokeWidth="1" />
      <text
        x="150"
        y="166"
        textAnchor="middle"
        fill={s.fg}
        fillOpacity="0.75"
        style={{ fontFamily: "Archivo, sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em" }}
      >
        {s.tag.toUpperCase()}
      </text>

      {/* footer row */}
      <text
        x="34"
        y="200"
        fill={s.fg}
        fillOpacity="0.6"
        style={{ fontFamily: "Archivo, sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.18em" }}
      >
        ORIGEN MISIONES
      </text>
      <text
        x="266"
        y="200"
        textAnchor="end"
        fill={s.fg}
        style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 900 }}
      >
        {y.weight}
      </text>
    </svg>
  );
}

function Card({ y, i }: { y: Yerba; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const soldOut = y.status === "soldout";

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 12, y: px * 15 });
  };

  const add = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soldOut) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      style={{ perspective: 1400 }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          setTilt({ x: 0, y: 0 });
        }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={`Ver ficha de ${y.brand}`}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
        className={cn(
          "preserve-3d relative h-[440px] cursor-pointer transition-[transform] ease-out will-change-transform",
          hovering ? "duration-150" : "duration-[750ms] ease-[cubic-bezier(.16,1,.3,1)]",
        )}
        style={{
          transform: `rotateX(${flipped ? 0 : tilt.x}deg) rotateY(${flipped ? 180 + tilt.y : tilt.y}deg)`,
        }}
      >
        {/* FRONT */}
        <div className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-[26px] border border-yerba-700/70 bg-gradient-to-b from-yerba-850 to-yerba-950 shadow-[0_24px_50px_-34px_rgba(6,13,8,0.9)] transition-shadow duration-500 group-hover:shadow-[0_38px_70px_-38px_rgba(6,13,8,1)]">
          <div className="relative h-[52%] overflow-hidden">
            <div
              className={cn(
                "h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]",
                soldOut && "opacity-60 saturate-50",
              )}
            >
              {y.image ? (
                <img
                  src={y.image}
                  alt={`Yerba mate ${y.brand}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Label y={y} />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-yerba-950 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[1100ms] group-hover:translate-x-full" />
            {soldOut ? (
              <span className="absolute top-3 left-3 rounded-full bg-kraft-100 px-2.5 py-1 text-[9.5px] font-black tracking-[0.16em] text-yerba-950 uppercase shadow-lg">
                Agotado
              </span>
            ) : (
              y.badge && (
                <span className="absolute top-3 left-3 rounded-full bg-brick-500 px-2.5 py-1 text-[9.5px] font-black tracking-[0.16em] text-kraft-50 uppercase shadow-lg">
                  {y.badge}
                </span>
              )
            )}
            <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-yerba-950/70 px-2.5 py-1 text-[9.5px] font-bold tracking-[0.18em] text-kraft-100/70 uppercase backdrop-blur">
              girá la ficha
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
                <path d="M4 9a8 8 0 0 1 14-3M20 15a8 8 0 0 1-14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 2v4h-4M6 22v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <p className="font-display text-[26px] leading-none font-black text-kraft-50">{y.brand}</p>
              <p className="mt-1.5 text-[11.5px] tracking-wide text-kraft-200/55">{y.name}</p>
              <div className="mt-3.5 flex items-center gap-3">
                <Intensity level={y.intensity} />
                <span className="text-[10px] font-bold tracking-[0.16em] text-yerba-300/80 uppercase">{y.type}</span>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-yerba-800 pt-3.5">
              <span className="font-display text-2xl font-black text-gold-300">{fmt(y.price)}</span>
              <button
                onClick={add}
                disabled={soldOut}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-bold transition-all duration-300 active:scale-95",
                  soldOut
                    ? "cursor-not-allowed bg-yerba-800 text-kraft-200/40"
                    : added
                      ? "bg-yerba-400 text-yerba-950"
                      : "bg-kraft-100 text-yerba-950 hover:bg-gold-400",
                )}
              >
                {soldOut ? (
                  "Sin stock"
                ) : added ? (
                  <>
                    <IconCheck className="size-3.5" /> Agregado
                  </>
                ) : (
                  <>
                    Sumar <IconArrow className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-[26px] border border-gold-500/40 bg-yerba-900 p-5 shadow-[0_24px_50px_-34px_rgba(6,13,8,0.9)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between">
            <Kicker tone="gold">Ficha de cata</Kicker>
            <span className="font-display text-lg font-black text-kraft-50">{y.brand}</span>
          </div>
          <ul className="mt-5 space-y-3 text-[13px] text-kraft-100/80">
            {y.notes.map((n) => (
              <li key={n} className="flex items-start gap-2.5">
                <IconLeaf className="mt-0.5 size-4 shrink-0 text-yerba-300" />
                {n}
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-yerba-700 pt-4 text-[11.5px]">
            {[
              ["Origen", y.origin],
              ["Molienda", y.cut],
              ["Añejado", y.aging],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="w-20 shrink-0 font-bold tracking-[0.14em] text-kraft-200/45 uppercase">{k}</dt>
                  <dd className="text-kraft-100/75">{v}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-auto flex items-end justify-between">
            <span className="font-display text-2xl font-black text-gold-300">{fmt(y.price)}</span>
            <button
              onClick={add}
              disabled={soldOut}
              className={cn(
                "rounded-full px-4 py-2 text-[11.5px] font-bold transition-all duration-300 active:scale-95",
                soldOut
                  ? "cursor-not-allowed bg-yerba-800 text-kraft-200/40"
                  : added
                    ? "bg-yerba-400 text-yerba-950"
                    : "bg-gold-400 text-yerba-950 hover:bg-kraft-100",
              )}
            >
              {soldOut ? "Sin stock" : added ? "¡Listo!" : "Agregar al pedido"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Yerbas() {
  const { data } = useSite();
  const [filter, setFilter] = useState<Filter>("Todas");

  const visible = useMemo(() => data.yerbas.filter((y) => y.status !== "hidden"), [data.yerbas]);
  const list = useMemo(
    () => (filter === "Todas" ? visible : visible.filter((y) => y.type === filter)),
    [filter, visible],
  );

  return (
    <section id="yerbas" className="paper relative overflow-hidden py-24 text-yerba-950 lg:py-32">
      <div
        className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle,#3d7a3f,transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Kicker tone="dark">La yerbera · 14 marcas</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,6.6vw,5.4rem)] leading-[0.88] font-black">
              <LineMask>Yerbas que</LineMask>
              <LineMask delay={0.08}>
                <span className="text-yerba-600">conocemos</span> de memoria
              </LineMask>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[15.5px] leading-relaxed text-yerba-900/75">
              Compramos directo a los secaderos de Misiones y Corrientes y probamos cada partida antes de ponerla en la
              estantería. Tocá cualquier ficha para ver molienda, añejamiento y notas de cata.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] font-bold tracking-[0.14em] text-yerba-800/60 uppercase">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brick-500" /> cosecha 2025
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-yerba-500" /> estacionamiento natural
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gold-500" /> envío 24 h
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 flex flex-wrap gap-2.5" delay={0.1}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative overflow-hidden rounded-full border px-4 py-2 text-[12px] font-bold tracking-wide transition-colors duration-300",
                filter === f
                  ? "border-yerba-900 text-kraft-50"
                  : "border-yerba-900/20 text-yerba-900/70 hover:border-yerba-900/50 hover:text-yerba-900",
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-yerba-800"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
          <span className="ml-auto self-center text-[11.5px] font-semibold tracking-[0.16em] text-yerba-900/45 uppercase">
            {list.length} {list.length === 1 ? "referencia" : "referencias"}
          </span>
        </Reveal>

        <motion.div layout className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((y, i) => (
              <Card key={y.id} y={y} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <p className="mt-12 text-center text-[15px] text-yerba-900/55">
            Por ahora no tenemos yerbas en esta categoría. ¡Volvé pronto!
          </p>
        )}
      </div>
    </section>
  );
}
