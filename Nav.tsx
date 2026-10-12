import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";
import { IconLaser, Wordmark } from "./common";

const links = [
  { id: "ritual", label: "El ritual" },
  { id: "yerbas", label: "Yerbas" },
  { id: "equipo", label: "Equipo" },
  { id: "categorias", label: "Mates · Termos · Canastas" },
  { id: "grabado", label: "Grabado láser" },
];

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("ritual");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-yerba-400 via-gold-400 to-brick-500"
        style={{ scaleX: progress }}
      />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-yerba-700/50 bg-yerba-950/85 py-2 backdrop-blur-xl"
            : "border-b border-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 lg:px-10">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group">
            <Wordmark />
          </button>

          <nav className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-wide transition-colors duration-300",
                  active === l.id ? "text-gold-300" : "text-kraft-200/70 hover:text-kraft-50",
                )}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-gold-500/30 bg-yerba-800/80"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => go("grabado")}
              className="group relative hidden overflow-hidden rounded-full bg-gold-400 px-5 py-2.5 text-[12.5px] font-bold tracking-wide text-yerba-950 transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:block"
            >
              <span className="relative z-10 flex items-center gap-2">
                <IconLaser className="size-4" />
                Cotizar grabado
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-kraft-50/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menú"
              className="grid size-10 place-items-center rounded-full border border-yerba-700 bg-yerba-900/60 text-kraft-100 xl:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-[1.6px] w-full bg-current transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute top-1.5 left-0 block h-[1.6px] w-full bg-current transition-all duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[1.6px] w-full bg-current transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div className="absolute inset-0 bg-yerba-950/95 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              className="absolute inset-x-0 top-24 mx-5 overflow-hidden rounded-3xl border border-yerba-700/60 bg-yerba-900/90 p-4"
              style={{ perspective: 900 }}
            >
              {links.map((l) => (
                <motion.button
                  key={l.id}
                  variants={{
                    hidden: { opacity: 0, rotateX: -70, y: -14 },
                    show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  onClick={() => go(l.id)}
                  className="block w-full border-b border-yerba-800 px-4 py-3.5 text-left font-display text-2xl font-bold text-kraft-100 last:border-0"
                >
                  <span className="mr-3 text-xs font-body tracking-[0.3em] text-gold-400">
                    {String(links.indexOf(l) + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
