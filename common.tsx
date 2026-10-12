import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/utils/cn";

/* ---------------- reveal ---------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const M = motion[as] as typeof motion.div;
  return (
    <M
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

export function LineMask({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%", rotate: 4 }}
        whileInView={{ y: "0%", rotate: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------------- section label ---------------- */

export function Kicker({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: "gold" | "green" | "dark";
  className?: string;
}) {
  const tones = {
    gold: "text-gold-300 border-gold-500/40",
    green: "text-yerba-300 border-yerba-300/30",
    dark: "text-yerba-700 border-yerba-700/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase",
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/* ---------------- intensity meter ---------------- */

export function Intensity({ level, tone = "gold" }: { level: number; tone?: "gold" | "green" }) {
  return (
    <span className="inline-flex items-center gap-[3px]" title={`Intensidad ${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "block h-3.5 w-[3px] rounded-full transition-all duration-500",
            i <= level
              ? tone === "gold"
                ? "bg-gold-400"
                : "bg-yerba-400"
              : tone === "gold"
                ? "bg-kraft-300/30"
                : "bg-yerba-900/15",
          )}
          style={{ height: `${8 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

/* ---------------- icons ---------------- */

type I = { className?: string; style?: CSSProperties };
const base = "shrink-0";

export const IconLeaf = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path
      d="M20 4c0 8.5-4.6 13-11 13H5.5C5.5 9.6 10.6 4 20 4Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M4 21c2.5-4.5 6-8 11-10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconGourd = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path
      d="M5.5 11.5c0-1.6 2.9-2.6 6.5-2.6s6.5 1 6.5 2.6c0 3.6-2.4 7.6-6.5 7.6s-6.5-4-6.5-7.6Z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M14.6 8.9 18 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M18 3.2c.9-.3 1.9.2 2.2 1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconFlame = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path
      d="M12 22c3.6 0 6-2.4 6-5.6 0-4.3-4.2-5.9-3.6-11.4C12.2 6.4 10.6 8 10.6 10c-.9-.7-1.3-1.8-1.3-3C7.1 8.4 6 10.7 6 13.4 6 19 8.6 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconThermo = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M14 4a2 2 0 1 0-4 0v9.2a4 4 0 1 0 4 0V4Z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 8v7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="17.5" r="1.6" fill="currentColor" />
  </svg>
);

export const IconBasket = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M4 9h16l-1.6 10.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 9Z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8.5 9 11 3.6M15.5 9 13 3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9.5 13v4M14.5 13v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconLaser = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M8 2h8v4H8z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 6v6" stroke="currentColor" strokeWidth="1.4" />
    <path d="m9.5 12 2.5 4 2.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M4 20h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 17.5 9 22M12 17.5 15 22" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
  </svg>
);

export const IconArrow = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="m4.5 12.5 5 5 10-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconX = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconPlus = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconWhats = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn(base, className)} aria-hidden>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .6l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3 0 .2 0 .7-.2 1.3Z" />
  </svg>
);

export const IconMail = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconPin = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const IconClock = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 7v5.3l3.4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconSun = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export const IconHeart = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path
      d="M12 20.5s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 8.2a4.4 4.4 0 0 1 7.5 2.7c0 5-7.5 9.6-7.5 9.6Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconStar = ({ className }: I) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(base, className)} aria-hidden>
    <path
      d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------------- wordmark ---------------- */

export function Wordmark({ className }: I) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center rounded-full border border-gold-500/50 bg-yerba-900/70">
        <IconGourd className="size-5 text-gold-300" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[17px] font-black tracking-tight text-kraft-50">
          El Cebador
        </span>
        <span className="block text-[9px] font-semibold tracking-[0.32em] text-yerba-300/80 uppercase">
          casa de yerba mate
        </span>
      </span>
    </span>
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/** 12900 -> "12.900" (agrupa siempre, también los de 4 cifras). */
export const fmtNum = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const fmt = (n: number) => "$ " + fmtNum(n);
