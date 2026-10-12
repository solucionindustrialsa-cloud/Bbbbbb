import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ritualSteps } from "@/lib/data";
import { IconFlame, IconGourd, Kicker, LineMask } from "./common";

/** Renders a numeric motion value as text (isolated so only this node re-renders). */
function Counter({ mv, className }: { mv: MotionValue<number>; className?: string }) {
  const [n, setN] = useState(0);
  useMotionValueEvent(mv, "change", (v) => setN(v));
  return <span className={className}>{n}</span>;
}

/* ---------------- step 01 · water temperature ---------------- */

function Ilu01({ p }: { p: MotionValue<number> }) {
  const temp = useTransform(p, [0.02, 0.21], [20, 75], { clamp: true });
  const tempR = useTransform(temp, (v) => Math.round(v));
  const mercury = useTransform(p, [0.02, 0.21], ["8%", "78%"], { clamp: true });
  const bubbles = useTransform(p, [0.08, 0.22], [0, 1], { clamp: true });
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[260px] w-[96px]">
        <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-yerba-500/60 bg-yerba-950/70">
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brick-500 via-gold-500 to-gold-300"
            style={{ height: mercury }}
          />
          <motion.div className="absolute inset-0" style={{ opacity: bubbles }}>
            {[0, 1, 2, 3, 4].map((b) => (
              <span
                key={b}
                className="float-med absolute size-2 rounded-full bg-kraft-50/70"
                style={{ left: `${16 + b * 16}%`, bottom: `${10 + (b % 3) * 14}%`, animationDelay: `${b * 0.4}s` }}
              />
            ))}
          </motion.div>
        </div>
        <div className="absolute -top-4 left-1/2 h-7 w-14 -translate-x-1/2 rounded-lg border-2 border-yerba-500/60 bg-yerba-800" />
      </div>
      <div className="absolute top-1/2 right-[12%] -translate-y-1/2 text-right">
        <Counter mv={tempR} className="font-display text-6xl font-black text-gold-300" />
        <span className="font-display text-2xl font-black text-gold-300">°C</span>
        <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-kraft-200/50 uppercase">punto exacto</p>
      </div>
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 text-center">
        <IconFlame className="mx-auto size-9 text-brick-400" />
        <p className="mt-2 max-w-[70px] text-[10px] leading-tight text-kraft-200/45">fuego medio, nunca hervor</p>
      </div>
    </div>
  );
}

/* ---------------- step 02 · loading the gourd ---------------- */

function Ilu02({ p }: { p: MotionValue<number> }) {
  const fill = useTransform(p, [0.27, 0.46], [0.12, 0.8], { clamp: true });
  const tilt = useTransform(p, [0.32, 0.4, 0.47], [0, -18, 0], { clamp: true });
  const shake = useTransform(p, [0.36, 0.39, 0.42, 0.45], [0, -7, 6, 0], { clamp: true });
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div style={{ rotate: tilt, x: shake }} className="relative">
        <svg width="240" height="240" viewBox="0 0 200 200" className="overflow-visible">
          <defs>
            <clipPath id="gourdClip">
              <path d="M52 96c0-9 21-15 48-15s48 6 48 15c0 30-21 62-48 62s-48-32-48-62Z" />
            </clipPath>
          </defs>
          <path
            d="M52 96c0-9 21-15 48-15s48 6 48 15c0 30-21 62-48 62s-48-32-48-62Z"
            fill="#1a1109"
            stroke="#c9922a"
            strokeWidth="3"
          />
          <g clipPath="url(#gourdClip)">
            <motion.rect
              x="40"
              y="60"
              width="120"
              height="110"
              fill="#3d7a3f"
              style={{ scaleY: fill, transformOrigin: "100px 170px" }}
            />
            <motion.rect
              x="40"
              y="60"
              width="120"
              height="110"
              fill="#9ccb5e"
              opacity="0.3"
              style={{ scaleY: fill, transformOrigin: "100px 170px" }}
            />
          </g>
          <ellipse cx="100" cy="86" rx="50" ry="12" fill="none" stroke="#c9922a" strokeWidth="3" />
          <path d="M124 84 152 22" stroke="#e7dabd" strokeWidth="6" strokeLinecap="round" />
          <circle cx="154" cy="18" r="7" fill="#e7dabd" />
        </svg>
        <p className="absolute -right-4 bottom-1 rounded-lg border border-gold-500/40 bg-yerba-950/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-gold-300 uppercase">
          ¾ de yerba
        </p>
      </motion.div>
    </div>
  );
}

/* ---------------- step 03 · pouring ---------------- */

function Ilu03({ p }: { p: MotionValue<number> }) {
  const pour = useTransform(p, [0.53, 0.71], [0, 1], { clamp: true });
  const kettle = useTransform(p, [0.52, 0.62], [0, -22], { clamp: true });
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg width="300" height="250" viewBox="0 0 300 250" className="overflow-visible">
        <motion.g style={{ y: kettle }}>
          <path
            d="M28 44h78a16 16 0 0 1 16 16v34a16 16 0 0 1-16 16H28z"
            fill="#1d3b25"
            stroke="#c9922a"
            strokeWidth="3"
          />
          <path d="M122 60 176 38l5 14-50 24z" fill="#2a5533" stroke="#c9922a" strokeWidth="3" />
          <path d="M50 44c0-14 12-22 26-22s26 8 26 22" fill="none" stroke="#c9922a" strokeWidth="3" />
        </motion.g>
        <motion.path
          d="M182 50c8 36 4 62-8 88"
          fill="none"
          stroke="#9ccb5e"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="7 11"
          style={{ pathLength: pour, opacity: pour }}
        />
        <path
          d="M188 158c0-8 20-13 44-13s44 5 44 13c0 26-19 55-44 55s-44-29-44-55Z"
          fill="#1a1109"
          stroke="#c9922a"
          strokeWidth="3"
        />
        <path d="M194 158c14-7 30 4 40-2" fill="none" stroke="#3d7a3f" strokeWidth="11" strokeLinecap="round" />
        <path d="M226 154 252 100" stroke="#e7dabd" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="232" cy="150" rx="44" ry="10" fill="none" stroke="#c9922a" strokeWidth="3" />
        <motion.circle cx="230" cy="156" r="7" fill="#9ccb5e" style={{ opacity: pour }} />
      </svg>
      <p className="absolute bottom-3 left-4 max-w-[140px] text-[10.5px] leading-tight text-kraft-200/50">
        el chorro cae contra la pared: la montañita queda seca
      </p>
    </div>
  );
}

/* ---------------- step 04 · the round ---------------- */

function Ilu04({ p }: { p: MotionValue<number> }) {
  const rounds = useTransform(p, [0.77, 0.97], [1, 30], { clamp: true });
  const roundsR = useTransform(rounds, (v) => Math.round(v));
  const [n, setN] = useState(1);
  useMotionValueEvent(roundsR, "change", (v) => setN(v));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6">
      <div className="flex items-end gap-2">
        <Counter mv={roundsR} className="font-display text-7xl leading-none font-black text-kraft-50" />
        <span className="pb-2 text-[11px] font-bold tracking-[0.2em] text-kraft-200/55 uppercase">cebadas</span>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 30 }).map((_, k) => (
          <span
            key={k}
            className={`size-2.5 rounded-full transition-all duration-300 ${
              k < n ? "scale-100 bg-gold-400 shadow-[0_0_8px_rgba(227,178,63,0.7)]" : "scale-75 bg-yerba-700"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-full border border-yerba-600/50 bg-yerba-900/70 px-4 py-2">
        <IconGourd className="size-5 text-yerba-300" />
        <span className="text-[11.5px] text-kraft-200/70">la ronda gira y vuelve al cebador</span>
      </div>
    </div>
  );
}

const ilus = [Ilu01, Ilu02, Ilu03, Ilu04];

/* ---------------- section ---------------- */

export default function Ritual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(3, Math.max(0, Math.floor(v * 4 + 0.0001)));
    setIndex((cur) => (cur === next ? cur : next));
  });

  const bgY = useTransform(smooth, [0, 1], ["0%", "-18%"]);
  const bigNumY = useTransform(smooth, [0, 1], [0, -70]);
  const panelRotY = useTransform(smooth, [0, 1], [11, -11]);
  const panelRotX = useTransform(smooth, [0, 1], [-5, 5]);
  const step = ritualSteps[index];
  const Ilu = ilus[index];

  return (
    <section id="ritual" ref={ref} className="relative h-[420vh] bg-yerba-950">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            y: bgY,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #3d7a3f 0%, transparent 45%), radial-gradient(circle at 80% 70%, #c9922a 0%, transparent 45%)",
          }}
        />
        <div className="absolute inset-0 hairline-grid opacity-40" />

        <motion.div
          className="pointer-events-none absolute -top-[14%] right-[2%] select-none"
          style={{ y: bigNumY }}
          aria-hidden
        >
          <span className="stroke-type font-display text-[36vw] leading-none font-black">{step.n}</span>
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-6 px-5 pt-20 pb-10 sm:gap-10 sm:pt-24 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div>
            <Kicker>El ritual · paso {step.n}</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.92] font-black text-kraft-50">
              <LineMask key={step.title}>{step.title}</LineMask>
            </h2>

            <div className="mt-7 max-w-[54ch]" style={{ perspective: 1000 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotateY: -14, x: -40, filter: "blur(6px)" }}
                  animate={{ opacity: 1, rotateY: 0, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, rotateY: 14, x: 40, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="preserve-3d rounded-3xl border border-yerba-600/50 bg-yerba-900/80 p-7 backdrop-blur-sm"
                >
                  <p className="text-[15px] leading-relaxed text-kraft-100/80">{step.body}</p>
                  <p className="mt-5 flex items-center gap-2 border-t border-yerba-700 pt-4 text-[11px] font-bold tracking-[0.16em] text-gold-300 uppercase">
                    <span className="size-1.5 rounded-full bg-gold-400" />
                    {step.tip}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 hidden flex-wrap items-center gap-2.5 sm:flex lg:mt-8">
              {ritualSteps.map((s, k) => (
                <span
                  key={s.n}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-bold tracking-wide transition-all duration-500 ${
                    k === index
                      ? "border-gold-400 bg-gold-400/15 text-gold-200"
                      : k < index
                        ? "border-yerba-600/50 text-yerba-300/70"
                        : "border-yerba-800 text-kraft-200/35"
                  }`}
                >
                  <span className="tracking-[0.16em]">{s.n}</span>
                  {s.kicker}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[210px] sm:h-[250px] lg:h-auto" style={{ perspective: 1200 }}>
            <motion.div
              className="preserve-3d relative h-full w-full overflow-hidden rounded-[2rem] border border-yerba-600/40 bg-gradient-to-br from-yerba-900 to-yerba-950 lg:aspect-[4/5]"
              style={{ rotateY: panelRotY, rotateX: panelRotX }}
            >
              <div className="grain absolute inset-0" />
              <div
                className="absolute inset-0 opacity-70"
                style={{ background: "radial-gradient(70% 50% at 50% 40%, rgba(61,122,63,0.35), transparent 70%)" }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.92, z: -90 }}
                  animate={{ opacity: 1, scale: 1, z: 0 }}
                  exit={{ opacity: 0, scale: 1.06, z: 90 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="preserve-3d absolute inset-0 scale-[0.58] sm:scale-[0.78] lg:scale-100"
                >
                  <Ilu p={smooth} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between rounded-2xl border border-yerba-700/70 bg-yerba-950/75 px-4 py-3 backdrop-blur">
                <span className="text-[10.5px] font-bold tracking-[0.24em] text-kraft-200/50 uppercase">
                  paso {step.n} de 04
                </span>
                <div className="h-1 w-28 overflow-hidden rounded-full bg-yerba-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-yerba-400 to-gold-400"
                    style={{ scaleX: smooth, originX: 0 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
