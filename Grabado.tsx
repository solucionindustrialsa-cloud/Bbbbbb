import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { laserFaq, laserMaterials, laserProcess, laserSpecs } from "@/lib/data";
import { laserUnitPrice, useSite } from "@/lib/store";
import {
  IconCheck,
  IconHeart,
  IconLaser,
  IconLeaf,
  IconPlus,
  IconStar,
  IconSun,
  IconWhats,
  IconX,
  Kicker,
  LineMask,
  Reveal,
  fmt,
} from "./common";
import { cn } from "@/utils/cn";

/* ---------------- materials ---------------- */

type Mat = {
  id: string;
  name: string;
  g1: string;
  g2: string;
  eng: string;
  hi: string;
  rim: string;
  fiber: boolean;
};

const materials: Mat[] = [
  { id: "algarrobo", name: "Algarrobo", g1: "#7a4a26", g2: "#33190a", eng: "#180b03", hi: "rgba(255,214,160,0.4)", rim: "#c9922a", fiber: false },
  { id: "nogal", name: "Nogal claro", g1: "#b98552", g2: "#6d4526", eng: "#3a2010", hi: "rgba(255,236,200,0.5)", rim: "#d3bf97", fiber: false },
  { id: "calabaza", name: "Calabaza", g1: "#a9a05c", g2: "#4f4a24", eng: "#241f0c", hi: "rgba(255,250,210,0.45)", rim: "#c9922a", fiber: false },
  { id: "cuero", name: "Cuero vacuno", g1: "#9c6b41", g2: "#4b2c17", eng: "#2a1508", hi: "rgba(255,220,180,0.35)", rim: "#b09a6d", fiber: false },
  { id: "acero", name: "Acero inox", g1: "#d7dde2", g2: "#6e7a83", eng: "#20262b", hi: "rgba(255,255,255,0.6)", rim: "#9aa5ad", fiber: true },
  { id: "acrilico", name: "Acrílico negro", g1: "#2a2f33", g2: "#0b0d0f", eng: "#f2f5f7", hi: "rgba(255,255,255,0.25)", rim: "#4a5158", fiber: false },
];

const fonts = [
  { id: "serif", name: "Clásica", style: { fontFamily: "Fraunces, serif", fontWeight: 900, letterSpacing: "0.01em" } },
  { id: "sans", name: "Palo seco", style: { fontFamily: "Archivo, sans-serif", fontWeight: 800, letterSpacing: "0.16em" } },
  { id: "script", name: "Manuscrita", style: { fontFamily: "Fraunces, serif", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.02em" } },
  { id: "mono", name: "Técnica", style: { fontFamily: "ui-monospace, monospace", fontWeight: 700, letterSpacing: "0.24em" } },
];

const icons = [
  { id: "none", name: "Sin ícono", Node: null },
  { id: "sun", name: "Sol criollo", Node: IconSun },
  { id: "leaf", name: "Hoja de yerba", Node: IconLeaf },
  { id: "heart", name: "Corazón", Node: IconHeart },
  { id: "star", name: "Estrella", Node: IconStar },
];

const positions = [
  { id: "panza", name: "Panza", y: 248 },
  { id: "alto", name: "Alto", y: 224 },
  { id: "bajo", name: "Bajo", y: 266 },
];

/* ---------------- preview ---------------- */

function Preview({
  mat,
  font,
  text,
  sub,
  iconId,
  pos,
  size,
  engraving,
}: {
  mat: Mat;
  font: (typeof fonts)[number];
  text: string;
  sub: string;
  iconId: string;
  pos: (typeof positions)[number];
  size: number;
  engraving: boolean;
}) {
  const iconDef = icons.find((ic) => ic.id === iconId);
  const shown = text.slice(0, 22) || "TU NOMBRE";
  const fs = 30 * size;

  return (
    <svg viewBox="0 0 400 420" className="h-full w-full">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mat.g1} />
          <stop offset="55%" stopColor={mat.g2} />
          <stop offset="100%" stopColor={mat.g2} />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={mat.rim} stopOpacity="0.55" />
          <stop offset="35%" stopColor="#f7e3ab" />
          <stop offset="65%" stopColor={mat.rim} />
          <stop offset="100%" stopColor={mat.rim} stopOpacity="0.5" />
        </linearGradient>
        <filter id="woodTex">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.42" numOctaves="4" seed="9" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* shadow */}
      <ellipse cx="200" cy="382" rx="120" ry="20" fill="#000" opacity="0.45" filter="url(#soft)" />

      {/* body */}
      <path
        d="M104 158c0-14 43-24 96-24s96 10 96 24c0 62-42 128-96 128s-96-66-96-128Z"
        fill="url(#body)"
        stroke={mat.rim}
        strokeWidth="2.5"
      />
      <path
        d="M104 158c0-14 43-24 96-24s96 10 96 24c0 62-42 128-96 128s-96-66-96-128Z"
        filter="url(#woodTex)"
        opacity={mat.id === "acero" || mat.id === "acrilico" ? 0.06 : 0.22}
      />
      {/* foot */}
      <path d="M150 300h100l10 44a8 8 0 0 1-8 10H148a8 8 0 0 1-8-10Z" fill={mat.g2} stroke={mat.rim} strokeWidth="2" />
      {/* virola */}
      <ellipse cx="200" cy="147" rx="96" ry="22" fill="url(#rim)" stroke="#f7e3ab" strokeOpacity="0.5" strokeWidth="1.5" />
      <ellipse cx="200" cy="145" rx="80" ry="15" fill="#0b1a0e" opacity="0.85" />
      {/* bombilla */}
      <path d="M244 143 316 46" stroke="url(#rim)" strokeWidth="9" strokeLinecap="round" />
      <circle cx="319" cy="42" r="11" fill="none" stroke={mat.rim} strokeWidth="5" />
      <path d="M232 145h26" stroke="#f7e3ab" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />

      {/* engraving */}
      <g style={{ ...font.style, fontSize: fs }} textAnchor="middle">
        {iconDef?.Node && (
          <g transform={`translate(186 ${pos.y - 55})`} opacity="0.95">
            <foreignObject width="28" height="28" y="1.4" opacity="0.55">
              <div style={{ color: mat.hi, width: 28, height: 28 }}>
                <iconDef.Node className="size-7" />
              </div>
            </foreignObject>
            <foreignObject width="28" height="28">
              <div style={{ color: mat.eng, width: 28, height: 28 }}>
                <iconDef.Node className="size-7" />
              </div>
            </foreignObject>
          </g>
        )}
        <text x="200" y={pos.y + 1.6} fill={mat.hi} textLength={Math.min(shown.length * fs * 0.62, 178)} lengthAdjust="spacingAndGlyphs">
          {shown}
        </text>
        <text x="200" y={pos.y} fill={mat.eng} textLength={Math.min(shown.length * fs * 0.62, 178)} lengthAdjust="spacingAndGlyphs">
          {shown}
        </text>
        {sub && (
          <text
            x="200"
            y={pos.y + fs * 0.72}
            fill={mat.eng}
            opacity="0.8"
            style={{ fontSize: fs * 0.42, letterSpacing: "0.22em", fontFamily: "Archivo, sans-serif", fontWeight: 700 }}
            textLength={Math.min(sub.length * fs * 0.3, 150)}
            lengthAdjust="spacingAndGlyphs"
          >
            {sub.slice(0, 26).toUpperCase()}
          </text>
        )}
      </g>

      {/* laser beam */}
      <AnimatePresence>
        {engraving && (
          <g>
            <motion.line
              x1="0"
              x2="0"
              y1="60"
              y2="360"
              stroke="#ffd98a"
              strokeWidth="2"
              initial={{ x: 96, opacity: 0 }}
              animate={{ x: [96, 304], opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.circle
              r="7"
              cy="250"
              fill="#fff3d0"
              initial={{ cx: 96, opacity: 0 }}
              animate={{ cx: [96, 304], opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 12px #ffb43a)" }}
            />
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <motion.circle
                key={s}
                r="2"
                fill="#ffcf6a"
                initial={{ cx: 100, cy: 250, opacity: 1 }}
                animate={{
                  cx: 100 + s * 40,
                  cy: [250, 250 - 10 - s * 6, 250 + 14],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5, delay: s * 0.16, ease: "easeOut" }}
              />
            ))}
          </g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ---------------- studio ---------------- */

function Studio() {
  const { data } = useSite();
  const pr = data.laser.pricing;
  const [matId, setMatId] = useState("algarrobo");
  const [fontId, setFontId] = useState("serif");
  const [text, setText] = useState("El Cebador");
  const [sub, setSub] = useState("desde 1998");
  const [iconId, setIconId] = useState("sun");
  const [posId, setPosId] = useState("panza");
  const [size, setSize] = useState(1);
  const [qty, setQty] = useState(1);
  const [rush, setRush] = useState(false);
  const [twoSides, setTwoSides] = useState(false);
  const [engraving, setEngraving] = useState(false);

  const mat = materials.find((m) => m.id === matId)!;
  const font = fonts.find((f) => f.id === fontId)!;
  const pos = positions.find((p) => p.id === posId)!;

  const price = useMemo(
    () =>
      laserUnitPrice(pr, {
        chars: text.length,
        icon: iconId !== "none",
        sub: sub.trim() !== "",
        twoSides,
        fiber: mat.fiber,
        rush,
        qty,
      }),
    [pr, text, sub, iconId, twoSides, mat, rush, qty],
  );

  const fire = () => {
    if (engraving) return;
    setEngraving(true);
    window.setTimeout(() => setEngraving(false), 1600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* preview */}
      <div className="relative overflow-hidden rounded-[32px] border border-yerba-700/70 bg-yerba-950 p-6 sm:p-8">
        <div className="grain absolute inset-0" />
        <div
          className="absolute inset-0 opacity-80"
          style={{ background: "radial-gradient(65% 55% at 50% 45%, rgba(201,146,42,0.22), transparent 65%)" }}
        />
        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.24em] text-gold-300 uppercase">
            <IconLaser className="size-4" /> previsualización en vivo
          </span>
          <span className="rounded-full border border-yerba-700 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-kraft-200/50 uppercase">
            {mat.name}
          </span>
        </div>

        <div className="relative mx-auto mt-4 aspect-square w-full max-w-[420px]">
          <Preview
            mat={mat}
            font={font}
            text={text}
            sub={sub}
            iconId={iconId}
            pos={pos}
            size={size}
            engraving={engraving}
          />
        </div>

        <div className="relative mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-yerba-800 pt-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-kraft-200/45 uppercase">precio unitario</p>
            <p className="font-display text-3xl font-black text-gold-300">{fmt(price.unit)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-[0.2em] text-kraft-200/45 uppercase">
              total {qty} {qty === 1 ? "pieza" : "piezas"}
              {price.discount > 0 && (
                <span className="ml-2 rounded-full bg-yerba-500/30 px-2 py-0.5 text-yerba-200">
                  −{Math.round(price.discount * 100)}%
                </span>
              )}
            </p>
            <p className="font-display text-3xl font-black text-kraft-50">{fmt(price.total)}</p>
          </div>
        </div>

        <button
          onClick={fire}
          disabled={engraving}
          className={cn(
            "group relative mt-5 w-full overflow-hidden rounded-full px-6 py-4 text-sm font-black tracking-wide transition-all duration-300 active:scale-[0.98]",
            engraving ? "bg-brick-500 text-kraft-50" : "bg-gold-400 text-yerba-950 hover:bg-gold-300",
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <IconLaser className={cn("size-5", engraving && "animate-pulse")} />
            {engraving ? "Grabando…" : "Disparar el láser"}
          </span>
          {!engraving && (
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-kraft-50/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          )}
        </button>
      </div>

      {/* controls */}
      <div className="paper rounded-[32px] p-6 text-yerba-950 sm:p-8">
        <h3 className="font-display text-2xl font-black">Armá tu grabado</h3>
        <p className="mt-1.5 text-[13px] text-yerba-900/65">
          Cambiá el texto y mirá cómo queda sobre la pieza real. Después lo aprobamos con una maqueta en alta.
        </p>

        <Field label="Texto principal">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 22))}
            placeholder="Nombre, apodo o iniciales"
            className="w-full rounded-xl border border-yerba-900/20 bg-kraft-50 px-4 py-3 text-[15px] font-semibold outline-none transition-all placeholder:font-normal placeholder:text-yerba-900/35 focus:border-yerba-600 focus:ring-4 focus:ring-yerba-500/15"
          />
          <span className="mt-1 block text-right text-[10.5px] font-bold text-yerba-900/40">{text.length}/22</span>
        </Field>

        <Field label="Bajada (opcional)">
          <input
            value={sub}
            onChange={(e) => setSub(e.target.value.slice(0, 26))}
            placeholder="Fecha, ciudad, frase corta"
            className="w-full rounded-xl border border-yerba-900/20 bg-kraft-50 px-4 py-3 text-[14px] outline-none transition-all placeholder:text-yerba-900/35 focus:border-yerba-600 focus:ring-4 focus:ring-yerba-500/15"
          />
        </Field>

        <Field label="Material de la pieza">
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => (
              <button
                key={m.id}
                onClick={() => setMatId(m.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-all duration-300",
                  matId === m.id
                    ? "border-yerba-900 bg-yerba-900 text-kraft-50"
                    : "border-yerba-900/20 text-yerba-900/70 hover:border-yerba-900/50",
                )}
              >
                <span
                  className="size-3.5 rounded-full border border-black/20"
                  style={{ background: `linear-gradient(135deg, ${m.g1}, ${m.g2})` }}
                />
                {m.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Tipografía">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => setFontId(f.id)}
                style={f.style}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-[13px] transition-all duration-300",
                  fontId === f.id
                    ? "border-yerba-900 bg-kraft-50 text-yerba-950 shadow-[inset_0_0_0_1px_rgba(12,26,16,0.4)]"
                    : "border-yerba-900/15 text-yerba-900/60 hover:border-yerba-900/40",
                )}
              >
                Aa {f.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Ícono">
          <div className="flex flex-wrap gap-2">
            {icons.map((ic) => (
              <button
                key={ic.id}
                onClick={() => setIconId(ic.id)}
                title={ic.name}
                className={cn(
                  "grid size-11 place-items-center rounded-xl border transition-all duration-300",
                  iconId === ic.id
                    ? "border-yerba-900 bg-yerba-900 text-gold-300"
                    : "border-yerba-900/15 text-yerba-900/60 hover:border-yerba-900/45",
                )}
              >
                {ic.Node ? <ic.Node className="size-5" /> : <IconX className="size-4" />}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ubicación">
            <div className="flex gap-2">
              {positions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPosId(p.id)}
                  className={cn(
                    "flex-1 rounded-xl border px-2 py-2 text-[11.5px] font-bold transition-all duration-300",
                    posId === p.id
                      ? "border-yerba-900 bg-yerba-900 text-kraft-50"
                      : "border-yerba-900/15 text-yerba-900/60 hover:border-yerba-900/45",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Field>
          <Field label={`Tamaño · ${Math.round(size * 100)}%`}>
            <input
              type="range"
              min={0.7}
              max={1.35}
              step={0.05}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-3 w-full accent-yerba-700"
            />
          </Field>
        </div>

        <div className="mt-5 space-y-2.5 border-t border-yerba-900/12 pt-5">
          <Toggle on={twoSides} onChange={setTwoSides} label="Grabar también el reverso" price={`+${fmt(pr.twoSides)}`} />
          <Toggle on={rush} onChange={setRush} label="Urgente 24 h" price={`+${fmt(pr.rush)}`} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-yerba-900/12 bg-kraft-50/70 p-4">
          <span className="text-[11px] font-black tracking-[0.18em] text-yerba-900/55 uppercase">cantidad</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-9 place-items-center rounded-full border border-yerba-900/20 transition-colors hover:border-yerba-900"
              aria-label="Menos"
            >
              <span className="block h-[1.6px] w-3.5 bg-current" />
            </button>
            <span className="w-10 text-center font-display text-2xl font-black">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(500, q + 1))}
              className="grid size-9 place-items-center rounded-full border border-yerba-900/20 transition-colors hover:border-yerba-900"
              aria-label="Más"
            >
              <IconPlus className="size-4" />
            </button>
          </div>
          <p className="max-w-[16ch] text-right text-[10.5px] leading-tight text-yerba-900/50">
            {pr.tier1Qty}+ piezas −{pr.tier1Pct}% · {pr.tier2Qty}+ piezas −{pr.tier2Pct}%
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[10.5px] font-black tracking-[0.2em] text-yerba-900/50 uppercase">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
  price,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  price: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1.5 text-left"
    >
      <span className="flex items-center gap-3 text-[13.5px] font-semibold text-yerba-950/85">
        <span
          className={cn(
            "relative block h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
            on ? "bg-yerba-600" : "bg-yerba-900/20",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 block size-4 rounded-full bg-kraft-50 shadow transition-all duration-300",
              on ? "left-[18px]" : "left-0.5",
            )}
          />
        </span>
        {label}
      </span>
      <span className="text-[11.5px] font-bold text-yerba-900/55">{price}</span>
    </button>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-yerba-800 border-y border-yerba-800">
      {laserFaq.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="group flex w-full items-center justify-between gap-6 py-5 text-left"
          >
            <span className="font-display text-[17px] font-bold text-kraft-50 transition-colors group-hover:text-gold-300 sm:text-lg">
              {f.q}
            </span>
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full border border-yerba-600 text-gold-300 transition-all duration-500",
                open === i && "rotate-45 border-gold-400 bg-gold-400/10",
              )}
            >
              <IconPlus className="size-4" />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="max-w-[70ch] pb-6 text-[14px] leading-relaxed text-kraft-200/70">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---------------- section ---------------- */

export default function Grabado() {
  const { data, img } = useSite();
  const st = data.settings;
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.05]);

  return (
    <section id="grabado" className="relative bg-yerba-950 pb-24 lg:pb-32">
      <div className="absolute inset-0 hairline-grid opacity-40" />

      {/* intro image band */}
      <div ref={imgRef} className="relative h-[54vh] min-h-[360px] overflow-hidden">
        <motion.img
          src={img("grabado")}
          alt="Grabado láser sobre un mate de algarrobo"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ y: imgY, scale: imgScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-yerba-950 via-yerba-950/25 to-yerba-950" />
        <div className="absolute inset-0 grain" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-10 lg:px-10">
          <Kicker>Taller láser · CO₂ 60 W + fibra 30 W</Kicker>
          <h2 className="mt-4 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,5.6rem)] leading-[0.86] font-black text-kraft-50">
            <LineMask>Grabado láser</LineMask>
            <LineMask delay={0.08}>
              <span className="text-gold-400">a fuego lento</span>
            </LineMask>
          </h2>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <Reveal>
            <p className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.15] font-bold text-kraft-50">
              Tu nombre, tus iniciales o el escudo de tu familia, quemados en la madera con{" "}
              <span className="text-gold-400">0,05 mm de precisión</span>.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-relaxed text-kraft-200/70">
              No usamos tintas ni calcomanías: el láser vaporiza una capa microscópica del material y deja una marca
              permanente que aguanta agua caliente, sol y años de rondas. Trabajamos de a una pieza o por lotes de
              quinientas, siempre con maqueta digital aprobada antes de encender la máquina.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Madera", "Cuero", "Acero inox", "Vidrio", "Aluminio", "Acrílico"].map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-yerba-700 bg-yerba-900/60 px-3.5 py-1.5 text-[11.5px] font-semibold text-kraft-200/70 transition-colors hover:border-gold-500/60 hover:text-gold-200"
                >
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Studio />

        {/* specs + materials */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="h-full rounded-[28px] border border-yerba-700/70 bg-yerba-900/70 p-7">
              <h3 className="font-display text-2xl font-black text-kraft-50">Datos de la máquina</h3>
              <dl className="mt-6 divide-y divide-yerba-800">
                {laserSpecs.map((s) => (
                  <div key={s.k} className="flex items-baseline gap-4 py-3">
                    <dt className="w-[132px] shrink-0 text-[10px] font-black tracking-[0.16em] text-kraft-200/40 uppercase">
                      {s.k}
                    </dt>
                    <span className="mb-1.5 hidden flex-1 border-b border-dotted border-yerba-700 sm:block" />
                    <dd className="text-right text-[13.5px] font-medium text-kraft-100/85">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-[28px] border border-yerba-700/70 bg-yerba-900/70 p-7">
              <h3 className="font-display text-2xl font-black text-kraft-50">Qué se puede grabar</h3>
              <ul className="mt-6 space-y-3">
                {laserMaterials.map((m) => (
                  <li key={m.name} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                        m.ok ? "bg-yerba-500/25 text-yerba-300" : "bg-brick-500/20 text-brick-400",
                      )}
                    >
                      {m.ok ? <IconCheck className="size-3" /> : <IconX className="size-3" />}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-[13.5px] font-semibold",
                          m.ok ? "text-kraft-50" : "text-kraft-200/45 line-through decoration-brick-500/60",
                        )}
                      >
                        {m.name}
                      </span>
                      <span className="block text-[11.5px] text-kraft-200/50">{m.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* process */}
        <div className="mt-20">
          <Reveal>
            <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-black text-kraft-50">
              Cómo trabajamos
            </h3>
          </Reveal>
          <div className="relative mt-9 grid gap-6 md:grid-cols-4">
            <div className="absolute top-[38px] right-0 left-0 hidden border-t border-dashed border-yerba-700 md:block" />
            {laserProcess.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.09}>
                <div className="group relative">
                  <div className="flex size-[76px] items-center justify-center rounded-2xl border border-yerba-700 bg-yerba-950 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-gold-400/70">
                    <span className="font-display text-2xl font-black text-gold-300">{s.n}</span>
                  </div>
                  <p className="mt-4 font-display text-lg font-black text-kraft-50">{s.t}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-kraft-200/60">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* plans */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {data.laser.plans.map((pl, i) => (
            <Reveal key={pl.name} delay={i * 0.08}>
              <div
                className={cn(
                  "group relative h-full overflow-hidden rounded-[28px] border p-7 transition-all duration-500 hover:-translate-y-2",
                  pl.highlight
                    ? "border-gold-400/60 bg-gradient-to-b from-yerba-800 to-yerba-950 shadow-[0_30px_70px_-40px_rgba(227,178,63,0.6)]"
                    : "border-yerba-700/70 bg-yerba-900/60 hover:border-yerba-500",
                )}
              >
                {pl.highlight && (
                  <span className="absolute top-5 right-5 rounded-full bg-gold-400 px-2.5 py-1 text-[9.5px] font-black tracking-[0.16em] text-yerba-950 uppercase">
                    el más pedido
                  </span>
                )}
                <p className="text-[10.5px] font-black tracking-[0.24em] text-yerba-300 uppercase">{pl.name}</p>
                <p className="mt-3 font-display text-4xl font-black text-kraft-50">
                  {pl.prefix ? `${pl.prefix} ` : ""}
                  {fmt(pl.price)}
                </p>
                <p className="mt-1 text-[11.5px] text-kraft-200/50">{pl.unit}</p>
                <ul className="mt-6 space-y-2.5 border-t border-yerba-800 pt-5">
                  {pl.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-kraft-100/80">
                      <IconCheck className={cn("mt-0.5 size-4 shrink-0", pl.highlight ? "text-gold-400" : "text-yerba-300")} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* faq + cta */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <h3 className="mb-6 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-black text-kraft-50">
                Preguntas frecuentes
              </h3>
            </Reveal>
            <Faq />
          </div>
          <Reveal delay={0.1}>
            <div className="sticky top-28 overflow-hidden rounded-[28px] border border-gold-500/40 bg-gradient-to-br from-yerba-800 to-yerba-950 p-8">
              <div className="grain absolute inset-0" />
              <div className="relative">
                <span className="grid size-14 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
                  <IconWhats className="size-7" />
                </span>
                <h4 className="mt-6 font-display text-2xl leading-tight font-black text-kraft-50">
                  Mandanos tu logo y te devolvemos la maqueta
                </h4>
                <p className="mt-3 text-[13.5px] leading-relaxed text-kraft-200/70">
                  Vectorización sin costo, respuesta en el día y presupuesto cerrado antes de grabar. Atendemos
                  empresas, clubes, regalos corporativos y casamientos.
                </p>
                <a
                  href={`https://wa.me/${st.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-black text-yerba-950 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                >
                  <IconWhats className="size-4" /> {st.whatsappDisplay}
                </a>
                <a
                  href={`mailto:${st.laserEmail}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-yerba-600 px-6 py-3 text-[13px] font-semibold text-kraft-100 transition-colors hover:border-gold-400 hover:text-gold-200"
                >
                  {st.laserEmail}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
