import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Ritual from "./components/Ritual";
import Yerbas from "./components/Yerbas";
import Servicios from "./components/Servicios";
import Equipo3D from "./components/Equipo3D";
import Categorias from "./components/Categorias";
import Testimonios from "./components/Testimonios";
import Grabado from "./components/Grabado";
import Footer from "./components/Footer";
import { IconWhats } from "./components/common";
import { StoreProvider, useSite } from "./lib/store";
import AdminApp, { hasAdminSession } from "./admin/AdminApp";

function Site() {
  const { data } = useSite();
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const owner = hasAdminSession();

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setShow(v > 0.12));
  }, [scrollYProgress]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-yerba-950">
      <Nav />
      <main>
        <Hero onGo={go} />
        <Marquee />
        <Ritual />
        <Yerbas />
        <Servicios onGo={go} />
        <Equipo3D />
        <Categorias onGo={go} />
        <Testimonios />
        <Grabado />
      </main>
      <Footer onGo={go} />

      <AnimatePresence>
        {show && (
          <motion.a
            href={`https://wa.me/${data.settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group fixed right-5 bottom-5 z-50 flex items-center gap-3 rounded-full border border-yerba-600/60 bg-yerba-900/90 py-3 pr-5 pl-3 backdrop-blur-md transition-colors hover:border-gold-400/70"
          >
            <span className="relative grid size-10 place-items-center rounded-full bg-yerba-500 text-kraft-50 transition-colors group-hover:bg-gold-400 group-hover:text-yerba-950">
              <span className="pulse-ring absolute inset-0 rounded-full border border-yerba-300/60" />
              <IconWhats className="size-5" />
            </span>
            <span className="text-[12.5px] font-bold text-kraft-100">
              Pedir presupuesto
              <span className="block text-[10.5px] font-medium text-kraft-200/55">respondemos en el día</span>
            </span>
          </motion.a>
        )}
      </AnimatePresence>

      {/* atajo solo visible para el dueño con sesión abierta */}
      {owner && (
        <a
          href="#/admin"
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-gold-500/50 bg-yerba-950/90 px-4 py-2.5 text-[12px] font-bold text-gold-200 shadow-xl backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-gold-400"
        >
          ← Volver al panel
        </a>
      )}
    </div>
  );
}

function Router() {
  const [hash, setHash] = useState(() => window.location.hash);
  const isAdmin = hash.startsWith("#/admin");

  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [isAdmin]);

  const exitAdmin = () => {
    window.location.hash = "#/";
  };

  return isAdmin ? <AdminApp onExit={exitAdmin} /> : <Site />;
}

export function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}

export default App;
