import { useState } from "react";
import { motion } from "framer-motion";
import { useSite } from "@/lib/store";
import { IconArrow, IconCheck, IconClock, IconGourd, IconMail, IconPin, IconWhats, Reveal } from "./common";

const cols = [
  {
    t: "Catálogo",
    links: ["Yerbas Canarias", "Rosamonte y Playadito", "Mates artesanales", "Termos y pavas", "Canastas materas", "Bombillas de alpaca"],
  },
  {
    t: "Taller láser",
    links: ["Grabado en madera", "Grabado en acero", "Grabado en cuero", "Regalos corporativos", "Escudos y logos", "Envíos al interior"],
  },
  {
    t: "La casa",
    links: ["Nuestra historia", "Cómo curar tu mate", "El ritual del cebador", "Preguntas frecuentes", "Trabajá con nosotros"],
  },
];

export default function Footer({ onGo }: { onGo: (id: string) => void }) {
  const [mail, setMail] = useState("");
  const [sent, setSent] = useState(false);
  const { data } = useSite();
  const st = data.settings;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mail.includes("@")) return;
    setSent(true);
    setMail("");
    window.setTimeout(() => setSent(false), 3200);
  };

  return (
    <footer className="relative overflow-hidden border-t border-yerba-700/60 bg-yerba-900">
      <div className="grain absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 50% at 20% 0%, rgba(61,122,63,0.4), transparent 60%), radial-gradient(60% 50% at 90% 100%, rgba(157,108,26,0.3), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-20 lg:px-10">
        {/* giant wordmark */}
        <Reveal>
          <div className="group relative flex items-center justify-center overflow-hidden">
            <h2 className="stroke-type font-display text-[clamp(3rem,14vw,12rem)] leading-[0.8] font-black tracking-tighter whitespace-nowrap transition-all duration-700 group-hover:text-gold-400/90 select-none">
              EL CEBADOR
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <Reveal>
            <div>
              <span className="flex items-center gap-2.5">
                <span className="grid size-11 place-items-center rounded-full border border-gold-500/50 bg-yerba-950/70">
                  <IconGourd className="size-6 text-gold-300" />
                </span>
                <span className="font-display text-xl font-black text-kraft-50">Casa de yerba mate</span>
              </span>
              <p className="mt-5 max-w-[38ch] text-[14px] leading-relaxed text-kraft-200/65">
                Yerbas seleccionadas, equipo artesanal y taller de grabado láser propio. Vení a probar antes de llevar:
                en el mostrador hay mate cebado todo el día.
              </p>

              <ul className="mt-6 space-y-3 text-[13.5px] text-kraft-100/80">
                <li className="flex items-start gap-3">
                  <IconPin className="mt-0.5 size-4 shrink-0 text-yerba-300" />
                  {st.address}
                </li>
                <li className="flex items-start gap-3">
                  <IconClock className="mt-0.5 size-4 shrink-0 text-yerba-300" />
                  {st.hours}
                </li>
                <li className="flex items-start gap-3">
                  <IconWhats className="mt-0.5 size-4 shrink-0 text-yerba-300" />
                  <a href={`https://wa.me/${st.whatsapp}`} className="transition-colors hover:text-gold-300">
                    {st.whatsappDisplay}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <IconMail className="mt-0.5 size-4 shrink-0 text-yerba-300" />
                  <a href={`mailto:${st.email}`} className="transition-colors hover:text-gold-300">
                    {st.email}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          {cols.map((c, i) => (
            <Reveal key={c.t} delay={0.06 * (i + 1)}>
              <div>
                <h3 className="text-[10.5px] font-black tracking-[0.24em] text-gold-300 uppercase">{c.t}</h3>
                <ul className="mt-5 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <button
                        onClick={() => onGo(i === 0 ? "yerbas" : i === 1 ? "grabado" : "ritual")}
                        className="group flex items-center gap-2 text-left text-[13.5px] text-kraft-200/65 transition-colors hover:text-kraft-50"
                      >
                        <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-4" />
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* newsletter */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-start gap-6 rounded-[28px] border border-yerba-700/70 bg-yerba-950/60 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-2xl font-black text-kraft-50">La carta del cebador</h3>
              <p className="mt-1.5 max-w-[46ch] text-[13.5px] text-kraft-200/60">
                Una vez por mes: partidas nuevas, ofertas del taller y un tip de cebado. Sin spam, palabra de gaucho.
              </p>
            </div>
            <form onSubmit={submit} className="flex w-full max-w-[420px] gap-2">
              <input
                type="email"
                required
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 rounded-full border border-yerba-700 bg-yerba-900/70 px-5 py-3 text-[13.5px] text-kraft-50 outline-none transition-all placeholder:text-kraft-200/35 focus:border-gold-400 focus:ring-4 focus:ring-gold-400/15"
              />
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="submit"
                className={
                  sent
                    ? "flex items-center gap-2 rounded-full bg-yerba-400 px-5 py-3 text-[13px] font-black text-yerba-950"
                    : "flex items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-[13px] font-black text-yerba-950 transition-colors hover:bg-kraft-100"
                }
              >
                {sent ? <IconCheck className="size-4" /> : "Suscribirme"}
                {!sent && <IconArrow className="size-4" />}
              </motion.button>
            </form>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-yerba-800 py-7 sm:flex-row">
          <p className="text-[11.5px] text-kraft-200/40">
            © {new Date().getFullYear()} El Cebador · Montevideo, Uruguay. Marcas de terceros propiedad de sus titulares.
          </p>
          <div className="flex items-center gap-4">
            {["Instagram", "Facebook", "TikTok", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[11.5px] font-bold tracking-[0.14em] text-kraft-200/50 uppercase transition-colors hover:text-gold-300"
              >
                {s}
              </a>
            ))}
            <a
              href="#/admin"
              className="ml-1 rounded-full border border-yerba-700 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-kraft-200/40 uppercase transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              Acceso dueño
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="ml-2 grid size-9 place-items-center rounded-full border border-yerba-700 text-kraft-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:text-gold-300"
              aria-label="Volver arriba"
            >
              <IconArrow className="size-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
