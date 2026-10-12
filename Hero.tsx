import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/utils/cn";
import { useSite } from "@/lib/store";
import { IconArrow, IconLaser, IconLeaf, fmt } from "./common";
import { stats as _s } from "@/lib/data";

const leaves = [
  { left: "6%", delay: 0, dur: 19, size: 26, op: 0.5 },
  { left: "18%", delay: 6, dur: 24, size: 18, op: 0.35 },
  { left: "33%", delay: 12, dur: 21, size: 30, op: 0.45 },
  { left: "52%", delay: 3, dur: 27, size: 16, op: 0.3 },
  { left: "70%", delay: 9, dur: 20, size: 24, op: 0.4 },
  { left: "86%", delay: 15, dur: 25, size: 20, op: 0.35 },
  { left: "94%", delay: 5, dur: 22, size: 28, op: 0.45 },
];

function Layer({
  p,
  z = 0,
  speed = 0,
  className,
  style,
  children,
}: {
  p: MotionValue<number>;
  z?: number;
  speed?: number;
  className?: string;
  style?: Record<string, unknown>;
  children: ReactNode;
}) {
  const y = useTransform(p, [0, 1], [0, speed]);
  return (
    <motion.div className={cn("absolute", className)} style={{ z, y, ...style }}>
      {children}
    </motion.div>
  );
}

export default function Hero({ onGo }: { onGo: (id: string) => void }) {
  const { data, img } = useSite();
  const shown = data.yerbas.filter((y) => y.status !== "hidden");
  const featured = shown.find((y) => y.id === data.settings.featuredYerbaId) ?? shown[0];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20 });
  const sy = useSpring(my, { stiffness: 70, damping: 20 });

  const rotY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotX = useTransform([sy, p], ([a, b]: number[]) => a * 5 + b * 16);
  const sceneZ = useTransform(p, [0, 1], [0, -420]);
  const sceneOp = useTransform(p, [0, 0.85], [1, 0]);

  const titleY = useTransform(p, [0, 1], [0, -160]);
  const imgScale = useTransform(p, [0, 1], [1, 1.22]);
  const glow = useTransform(p, [0, 1], [0.55, 0]);

  const handle = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      id="inicio"
      ref={ref}
      onPointerMove={handle}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="grain relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-yerba-950"
    >
      {/* ambient background */}
      <div className="absolute inset-0 hairline-grid opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 78% 42%, rgba(61,122,63,0.42) 0%, rgba(6,13,8,0) 58%), radial-gradient(80% 60% at 12% 12%, rgba(201,146,42,0.22) 0%, rgba(6,13,8,0) 60%), linear-gradient(180deg,#060d08 0%, #0c1a10 45%, #08130b 100%)",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[62vw] w-[62vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          opacity: glow,
          background: "radial-gradient(circle, rgba(227,178,63,0.30) 0%, rgba(227,178,63,0) 62%)",
          filter: "blur(30px)",
        }}
      />

      {/* drifting leaves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {leaves.map((l, i) => (
          <span
            key={i}
            className="leaf-drift absolute top-0"
            style={{ left: l.left, animationDelay: `${l.delay}s`, animationDuration: `${l.dur}s`, opacity: l.op }}
          >
            <span className="block text-yerba-300" style={{ width: l.size, height: l.size }}>
              <IconLeaf className="size-full" />
            </span>
          </span>
        ))}
      </div>

      {/* 3D scene */}
      <div className="relative h-full w-full" style={{ perspective: "1500px", perspectiveOrigin: "60% 45%" }}>
        <motion.div
          className="preserve-3d relative mx-auto h-full max-w-[1400px] px-5 lg:px-10"
          style={{ rotateX: rotX, rotateY: rotY, z: sceneZ, opacity: sceneOp }}
        >
          {/* deep background word */}
          <Layer p={p} z={-520} speed={180} className="inset-x-0 top-[16%] flex justify-center">
            <span className="stroke-type font-display text-[24vw] leading-[0.72] font-black tracking-tighter whitespace-nowrap select-none lg:text-[19vw]">
              MATE
            </span>
          </Layer>

          {/* mid decorative rings */}
          <Layer p={p} z={-260} speed={90} className="top-1/2 left-[8%] hidden lg:block">
            <div className="relative size-[340px]">
              <div className="absolute inset-0 rounded-full border border-yerba-500/25" />
              <div className="absolute inset-10 rounded-full border border-dashed border-gold-500/20" />
              <div className="pulse-ring absolute inset-24 rounded-full border border-yerba-300/25" />
            </div>
          </Layer>

          {/* copy */}
          <motion.div
            className="absolute inset-y-0 left-0 z-20 flex max-w-[640px] flex-col justify-center px-5 pt-20 pb-20 lg:max-w-[54%] lg:px-10 lg:pt-24 lg:pb-28"
            style={{ y: titleY }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/35 bg-yerba-900/60 px-3.5 py-1.5 text-[10.5px] font-semibold tracking-[0.28em] text-gold-300 uppercase backdrop-blur-sm"
            >
              <span className="relative flex size-2">
                <span className="pulse-ring absolute inline-flex size-full rounded-full bg-gold-400" />
                <span className="relative inline-flex size-2 rounded-full bg-gold-400" />
              </span>
              Montevideo · desde 1998
            </motion.span>

            <h1 className="font-display text-[clamp(3.1rem,8.4vw,7.2rem)] leading-[0.86] font-black text-kraft-50">
              {["El arte de", "cebar bien"].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "112%", rotate: 6 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ delay: 0.25 + i * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i === 1 ? (
                      <>
                        cebar{" "}
                        <span className="relative inline-block text-gold-400">
                          bien
                          <svg
                            viewBox="0 0 200 12"
                            className="absolute -bottom-1 left-0 w-full text-brick-500"
                            preserveAspectRatio="none"
                          >
                            <motion.path
                              d="M2 8c40-6 90-6 196-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 1, duration: 1.1, ease: "easeInOut" }}
                            />
                          </svg>
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              className="mt-7 max-w-[46ch] text-[15.5px] leading-relaxed text-kraft-200/75 lg:text-base"
            >
              Yerbas seleccionadas del litoral — <strong className="font-semibold text-kraft-50">Canarias</strong>,
              Rosamonte, Playadito— mates artesanales, termos de acero y canastas materas de cuero. Todo se puede
              grabar con tu nombre, tu escudo o tu fecha.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.9 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => onGo("yerbas")}
                className="group relative overflow-hidden rounded-full bg-kraft-100 px-7 py-3.5 text-sm font-bold text-yerba-950 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ver el catálogo
                  <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 translate-y-full bg-gold-400 transition-transform duration-500 group-hover:translate-y-0" />
              </button>
              <button
                onClick={() => onGo("grabado")}
                className="group flex items-center gap-2.5 rounded-full border border-yerba-500/50 bg-yerba-900/40 px-6 py-3.5 text-sm font-semibold text-kraft-100 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/70 hover:bg-yerba-800/70"
              >
                <IconLaser className="size-4 text-gold-300 transition-transform duration-500 group-hover:rotate-12" />
                Grabado láser
              </button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-yerba-700/60 pt-6 sm:grid-cols-4"
            >
              {_s.map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl font-black text-gold-300">{s.v}</dt>
                  <dd className="mt-0.5 text-[10.5px] font-semibold tracking-[0.16em] text-kraft-200/55 uppercase">
                    {s.l}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* hero product */}
          <Layer p={p} z={120} speed={-60} className="inset-y-0 right-[-16%] z-10 w-[86%] lg:right-0 lg:z-auto lg:w-[52%]">
            <div className="relative flex h-full items-center justify-center">
              <motion.div style={{ scale: imgScale }} className="float-slow relative">
                <div className="absolute inset-8 rounded-full bg-gold-500/20 blur-[90px]" />
                <img
                  src={img("hero")}
                  alt="Mate de calabaza con bombilla de alpaca y yerba mate"
                  className="relative w-[82vw] max-w-[400px] opacity-50 drop-shadow-[0_50px_60px_rgba(0,0,0,0.65)] lg:w-[min(46vw,620px)] lg:max-w-none lg:opacity-100"
                  style={{
                    transform: "translateZ(60px)",
                    WebkitMaskImage:
                      "radial-gradient(70% 70% at 50% 46%, #000 40%, rgba(0,0,0,0.6) 62%, transparent 80%)",
                    maskImage:
                      "radial-gradient(70% 70% at 50% 46%, #000 40%, rgba(0,0,0,0.6) 62%, transparent 80%)",
                  }}
                />
                {/* steam */}
                <div className="pointer-events-none absolute top-[16%] left-1/2 h-32 w-24 -translate-x-1/2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="steam absolute bottom-0 left-1/2 block h-16 w-3 rounded-full bg-kraft-100/25 blur-[7px]"
                      style={{ animationDelay: `${i * 1.6}s`, marginLeft: `${(i - 1) * 12}px` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* floating chips */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 18 }}
                className="float-med absolute top-[22%] right-[2%] z-30 hidden rounded-2xl border border-yerba-600/60 bg-yerba-900/85 px-4 py-3 backdrop-blur-md lg:block"
                style={{ z: 140 }}
              >
                <p className="text-[9.5px] font-bold tracking-[0.22em] text-yerba-300 uppercase">
                  {featured ? `${featured.brand} ${featured.weight}` : "Yerba mate"}
                </p>
                <p className="font-display text-xl font-black text-kraft-50">{fmt(featured?.price ?? 0)}</p>
                <p className="text-[10.5px] text-kraft-200/60">Envío gratis +{fmt(data.settings.freeShipping)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 200, damping: 18 }}
                className="float-slow absolute bottom-[16%] left-[12%] z-30 hidden items-center gap-3 rounded-2xl border border-gold-500/40 bg-yerba-950/85 px-4 py-3 backdrop-blur-md lg:flex"
                style={{ z: 180, animationDelay: "1.2s" }}
              >
                <span className="grid size-9 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
                  <IconLaser className="size-5" />
                </span>
                <span>
                  <p className="text-[12.5px] font-bold text-kraft-50">Grabado en 24 h</p>
                  <p className="text-[10.5px] text-kraft-200/60">Madera · cuero · acero</p>
                </span>
              </motion.div>
            </div>
          </Layer>

          {/* side rail */}
          <Layer p={p} z={60} speed={40} className="top-1/2 -left-2 hidden -translate-y-1/2 xl:block">
            <span className="block origin-center rotate-180 text-[10px] font-bold tracking-[0.5em] text-kraft-200/35 uppercase [writing-mode:vertical-rl]">
              yerba mate · uruguay
            </span>
          </Layer>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <motion.button
          onClick={() => onGo("ritual")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-2 text-kraft-200/50 transition-colors hover:text-gold-300"
        >
          <span className="text-[9.5px] font-bold tracking-[0.3em] uppercase">Deslizá</span>
          <span className="relative block h-12 w-px overflow-hidden bg-kraft-200/20">
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-gold-400"
              animate={{ y: [-16, 48] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-yerba-950 to-transparent" />
    </section>
  );
}
