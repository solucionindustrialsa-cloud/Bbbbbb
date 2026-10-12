import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_PIN, hashPin, useSite } from "@/lib/store";
import { cn } from "@/utils/cn";
import { IconBasket, IconGourd, IconLaser, IconLeaf, Wordmark } from "@/components/common";
import { AdminUiProvider, Btn, TextInput } from "./ui";
import { IExternal, IGrid, IImage, ILock, ILogout, ISliders, IWarn } from "./icons";
import type { TabId } from "./types";
import Resumen from "./Resumen";
import YerbasAdmin from "./YerbasAdmin";
import EquipoAdmin from "./EquipoAdmin";
import GrabadoAdmin from "./GrabadoAdmin";
import FotosAdmin from "./FotosAdmin";
import AjustesAdmin from "./AjustesAdmin";

export const ADMIN_SESSION = "elcebador.admin.session";

export function hasAdminSession() {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION) === "1";
  } catch {
    return false;
  }
}

const TABS: { id: TabId; label: string; Icon: typeof IGrid }[] = [
  { id: "resumen", label: "Resumen", Icon: IGrid },
  { id: "yerbas", label: "Yerbas", Icon: IconLeaf },
  { id: "equipo", label: "Mates · Termos · Canastas", Icon: IconBasket },
  { id: "grabado", label: "Grabado láser", Icon: IconLaser },
  { id: "fotos", label: "Fotos del sitio", Icon: IImage },
  { id: "ajustes", label: "Ajustes y respaldo", Icon: ISliders },
];

/* ------------------------------------------------------------------ */
/* acceso                                                             */
/* ------------------------------------------------------------------ */

function Login({ onOk, onExit }: { onOk: () => void; onExit: () => void }) {
  const { data } = useSite();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const isDefault = data.settings.pinHash === hashPin(DEFAULT_PIN);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;
    if (hashPin(pin) === data.settings.pinHash) {
      try {
        window.sessionStorage.setItem(ADMIN_SESSION, "1");
      } catch {
        /* sin sessionStorage: la sesión dura mientras no recargues */
      }
      onOk();
      return;
    }
    setErr(true);
    setPin("");
    const n = tries + 1;
    setTries(n);
    if (n >= 5) {
      setLocked(true);
      window.setTimeout(() => {
        setLocked(false);
        setTries(0);
      }, 30000);
    }
  };

  return (
    <div className="grain relative grid min-h-[100svh] place-items-center overflow-hidden bg-yerba-950 px-5">
      <div className="hairline-grid absolute inset-0 opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 40%, rgba(61,122,63,0.38), transparent 65%), radial-gradient(50% 40% at 85% 90%, rgba(201,146,42,0.22), transparent 60%)",
        }}
      />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30, rotateX: -12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px] rounded-[30px] border border-yerba-600/60 bg-yerba-900/85 p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        <Wordmark />
        <h1 className="mt-8 font-display text-3xl leading-none font-black text-kraft-50">Panel del dueño</h1>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-kraft-200/60">
          Ingresá tu PIN para editar precios, fotos y productos.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[10.5px] font-black tracking-[0.18em] text-kraft-200/55 uppercase">PIN</span>
          <div className="relative">
            <ILock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gold-300/70" />
            <TextInput
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setErr(false);
              }}
              className={cn("pl-10 text-[16px] tracking-[0.3em]", err && "border-brick-500 focus:border-brick-500 focus:ring-brick-500/20")}
              placeholder="••••"
              autoComplete="current-password"
            />
          </div>
        </label>

        {err && !locked && (
          <p className="mt-2.5 flex items-center gap-2 text-[12.5px] font-semibold text-brick-400">
            <IWarn className="size-4" /> PIN incorrecto. Probá de nuevo.
          </p>
        )}
        {locked && (
          <p className="mt-2.5 flex items-center gap-2 text-[12.5px] font-semibold text-brick-400">
            <IWarn className="size-4" /> Demasiados intentos. Esperá 30 segundos.
          </p>
        )}

        <Btn type="submit" variant="gold" disabled={locked || !pin} className="mt-6 w-full py-3.5 text-[14px]">
          Entrar al panel
        </Btn>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 w-full text-center text-[12.5px] font-semibold text-kraft-200/50 transition-colors hover:text-gold-300"
        >
          ← Volver al sitio
        </button>

        {isDefault && (
          <p className="mt-6 rounded-2xl border border-gold-500/40 bg-gold-400/10 px-4 py-3 text-[12px] leading-relaxed text-gold-200">
            PIN inicial: <strong className="font-black tracking-[0.2em]">{DEFAULT_PIN}</strong>. Cambialo apenas entres,
            en <em>Ajustes y respaldo</em>.
          </p>
        )}
      </motion.form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* panel                                                              */
/* ------------------------------------------------------------------ */

function Shell({ onExit, onLogout }: { onExit: () => void; onLogout: () => void }) {
  const { saveError } = useSite();
  const [tab, setTab] = useState<TabId>("resumen");

  const goTab = (t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100svh] bg-yerba-950 text-kraft-100">
      <header className="sticky top-0 z-40 border-b border-yerba-700/60 bg-yerba-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <Wordmark />
            <span className="hidden rounded-full border border-gold-500/40 bg-gold-400/10 px-3 py-1 text-[10px] font-black tracking-[0.22em] text-gold-300 uppercase sm:block">
              Panel del dueño
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Btn size="sm" onClick={onExit}>
              <IExternal className="size-3.5" /> Ver el sitio
            </Btn>
            <Btn size="sm" variant="soft" onClick={onLogout}>
              <ILogout className="size-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </Btn>
          </div>
        </div>

        {/* tabs móviles */}
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-3 lg:hidden [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => goTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-bold transition-all",
                tab === id
                  ? "border-gold-400 bg-gold-400/15 text-gold-200"
                  : "border-yerba-700 text-kraft-200/60",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {saveError && (
        <div className="border-b border-brick-500/60 bg-brick-600/30 px-4 py-3 text-center text-[13px] font-semibold text-kraft-50">
          ⚠ No se pudo guardar: el almacenamiento del navegador está lleno. Quitá alguna foto pesada o descargá un
          respaldo desde Ajustes.
        </div>
      )}

      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-8 lg:grid-cols-[236px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1.5">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => goTab(id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[13.5px] font-bold transition-colors",
                  tab === id ? "text-gold-200" : "text-kraft-200/60 hover:text-kraft-50",
                )}
              >
                {tab === id && (
                  <motion.span
                    layoutId="admin-tab"
                    className="absolute inset-0 rounded-2xl border border-gold-500/35 bg-yerba-800/80"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative size-[18px]" />
                <span className="relative">{label}</span>
              </button>
            ))}
            <div className="mt-6 rounded-2xl border border-yerba-700/60 bg-yerba-900/50 p-4 text-[12px] leading-relaxed text-kraft-200/50">
              <IconGourd className="mb-2 size-5 text-gold-300" />
              Los cambios se guardan solos y se ven al instante en el sitio.
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "resumen" && <Resumen go={goTab} />}
              {tab === "yerbas" && <YerbasAdmin />}
              {tab === "equipo" && <EquipoAdmin />}
              {tab === "grabado" && <GrabadoAdmin />}
              {tab === "fotos" && <FotosAdmin />}
              {tab === "ajustes" && <AjustesAdmin />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function AdminApp({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(hasAdminSession);

  useEffect(() => {
    const prev = document.title;
    document.title = "Panel del dueño · El Cebador";
    return () => {
      document.title = prev;
    };
  }, []);

  const logout = () => {
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION);
    } catch {
      /* nada */
    }
    setAuthed(false);
  };

  return (
    <AdminUiProvider>
      {authed ? <Shell onExit={onExit} onLogout={logout} /> : <Login onOk={() => setAuthed(true)} onExit={onExit} />}
    </AdminUiProvider>
  );
}
