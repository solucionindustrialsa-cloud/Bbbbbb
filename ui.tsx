import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { fileToDataUrl } from "@/lib/image";
import { IconCheck, IconX, fmtNum } from "@/components/common";
import { IImage, IUpload } from "./icons";

/* ------------------------------------------------------------------ */
/* avisos + confirmaciones                                            */
/* ------------------------------------------------------------------ */

type Tone = "ok" | "error" | "info";
type ConfirmOpts = { title: string; body?: ReactNode; confirmLabel?: string; danger?: boolean };
type Ui = {
  toast: (m: string, t?: Tone) => void;
  confirm: (o: ConfirmOpts) => Promise<boolean>;
};

const UiCtx = createContext<Ui | null>(null);

export function useAdminUi() {
  const c = useContext(UiCtx);
  if (!c) throw new Error("useAdminUi fuera de AdminUiProvider");
  return c;
}

export function AdminUiProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; m: string; t: Tone }[]>([]);
  const [dlg, setDlg] = useState<{ o: ConfirmOpts; resolve: (v: boolean) => void } | null>(null);
  const idRef = useRef(0);

  const toast = useCallback((m: string, t: Tone = "ok") => {
    const id = ++idRef.current;
    setToasts((l) => [...l.slice(-3), { id, m, t }]);
    window.setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 2900);
  }, []);

  const confirm = useCallback(
    (o: ConfirmOpts) => new Promise<boolean>((resolve) => setDlg({ o, resolve })),
    [],
  );

  const close = (v: boolean) => {
    dlg?.resolve(v);
    setDlg(null);
  };

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <UiCtx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 bottom-4 z-[200] flex flex-col items-end gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "pointer-events-auto flex max-w-[340px] items-center gap-2.5 rounded-2xl border px-4 py-3 text-[13px] font-semibold shadow-xl backdrop-blur",
                t.t === "ok" && "border-yerba-400/50 bg-yerba-800/95 text-kraft-50",
                t.t === "error" && "border-brick-500/60 bg-brick-600/95 text-kraft-50",
                t.t === "info" && "border-gold-500/50 bg-yerba-900/95 text-gold-200",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  t.t === "error" ? "bg-kraft-50/20" : "bg-yerba-400/30 text-yerba-200",
                )}
              >
                {t.t === "error" ? <IconX className="size-3" /> : <IconCheck className="size-3" />}
              </span>
              {t.m}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        open={!!dlg}
        onClose={() => close(false)}
        title={dlg?.o.title ?? ""}
        z="z-[150]"
        footer={
          <>
            <Btn onClick={() => close(false)}>Cancelar</Btn>
            <Btn variant={dlg?.o.danger ? "danger" : "gold"} onClick={() => close(true)}>
              {dlg?.o.confirmLabel ?? "Confirmar"}
            </Btn>
          </>
        }
      >
        <div className="text-[14px] leading-relaxed text-kraft-200/75">{dlg?.o.body}</div>
      </Modal>
    </UiCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* modal                                                              */
/* ------------------------------------------------------------------ */

let modalSeq = 0;
const modalStack: number[] = [];

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  z = "z-[100]",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
  z?: string;
}) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const id = ++modalSeq;
    modalStack.push(id);
    // con modales apilados, Esc solo cierra el de arriba
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === id) closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      const i = modalStack.indexOf(id);
      if (i >= 0) modalStack.splice(i, 1);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn("fixed inset-0 flex items-end justify-center sm:items-center sm:p-6", z)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-yerba-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-yerba-600/60 bg-yerba-900 shadow-2xl sm:rounded-[28px]",
              size === "lg" ? "max-w-[880px]" : "max-w-[540px]",
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-yerba-700/70 px-6 py-4">
              <h3 className="font-display text-xl font-black text-kraft-50">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="grid size-9 place-items-center rounded-full border border-yerba-700 text-kraft-200/70 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <IconX className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-yerba-700/70 bg-yerba-950/40 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* botones y campos                                                   */
/* ------------------------------------------------------------------ */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "ghost" | "danger" | "soft";
  size?: "sm" | "md";
};

export function Btn({ variant = "ghost", size = "md", className, type = "button", ...p }: BtnProps) {
  const v = {
    gold: "bg-gold-400 text-yerba-950 hover:bg-gold-300",
    ghost: "border border-yerba-600 text-kraft-100 hover:border-gold-400 hover:text-gold-200",
    soft: "bg-yerba-800 text-kraft-100 hover:bg-yerba-700",
    danger: "border border-brick-500/50 text-brick-400 hover:bg-brick-500/15",
  }[variant];
  return (
    <button
      type={type}
      {...p}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "px-3.5 py-1.5 text-[12px]" : "px-5 py-2.5 text-[13px]",
        v,
        className,
      )}
    />
  );
}

export function IconBtn({
  label,
  className,
  danger,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...p}
      className={cn(
        "grid size-9 place-items-center rounded-xl border border-yerba-700 text-kraft-200/70 transition-all duration-200 hover:border-gold-400 hover:text-gold-300 active:scale-90 disabled:pointer-events-none disabled:opacity-30",
        danger && "hover:border-brick-500 hover:text-brick-400",
        className,
      )}
    />
  );
}

export const inputCls =
  "w-full rounded-xl border border-yerba-700 bg-yerba-950/80 px-3.5 py-2.5 text-[14px] text-kraft-50 outline-none transition-all placeholder:text-kraft-200/30 focus:border-gold-400 focus:ring-4 focus:ring-gold-400/15 disabled:opacity-50";

export function Field({
  label,
  hint,
  children,
  className,
  group,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  group?: boolean;
}) {
  const body = (
    <>
      <span className="mb-1.5 block text-[10.5px] font-black tracking-[0.18em] text-kraft-200/55 uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11.5px] leading-snug text-kraft-200/40">{hint}</span>}
    </>
  );
  return group ? (
    <div className={cn("block", className)}>{body}</div>
  ) : (
    <label className={cn("block", className)}>{body}</label>
  );
}

export function TextInput(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={cn(inputCls, p.className)} />;
}

export function TextArea(p: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...p} className={cn(inputCls, "resize-y leading-relaxed", p.className)} />;
}

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c6e39a' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function Select(p: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      className={cn(inputCls, "appearance-none bg-no-repeat pr-9", p.className)}
      style={{ backgroundImage: chevron, backgroundPosition: "right 12px center", backgroundSize: "16px" }}
    />
  );
}

/** Precio en pesos: se edita en vivo y se muestra con puntos de miles. */
export function MoneyInput({
  value,
  onChange,
  onCommit,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  onCommit?: () => void;
  className?: string;
}) {
  const [focus, setFocus] = useState(false);
  const [txt, setTxt] = useState("");
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[13px] font-bold text-gold-300/80">
        $
      </span>
      <input
        inputMode="numeric"
        value={focus ? txt : fmtNum(value)}
        onFocus={() => {
          setTxt(String(value));
          setFocus(true);
        }}
        onChange={(e) => {
          const t = e.target.value.replace(/\D/g, "").slice(0, 9);
          setTxt(t);
          onChange(t ? parseInt(t, 10) : 0);
        }}
        onBlur={() => {
          setFocus(false);
          onCommit?.();
        }}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className={cn(inputCls, "pl-7 text-right font-bold tabular-nums")}
      />
    </div>
  );
}

export function NumInput({
  value,
  onChange,
  min = 0,
  max = 100000,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        className={cn(inputCls, "tabular-nums", suffix && "pr-9")}
      />
      {suffix && (
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[13px] font-bold text-kraft-200/50">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Switch({
  on,
  onChange,
  label,
  hint,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center gap-3 text-left"
    >
      <span
        className={cn(
          "relative block h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
          on ? "bg-yerba-400" : "bg-yerba-700",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 block size-5 rounded-full bg-kraft-50 shadow transition-all duration-300",
            on ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
      <span>
        <span className="block text-[13.5px] font-semibold text-kraft-100">{label}</span>
        {hint && <span className="block text-[11.5px] text-kraft-200/45">{hint}</span>}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* contenedores                                                       */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  desc,
  actions,
  children,
  className,
}: {
  title?: string;
  desc?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-yerba-700/70 bg-yerba-900/70 p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-xl font-black text-kraft-50">{title}</h3>}
            {desc && <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-kraft-200/55">{desc}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHead({
  title,
  desc,
  actions,
}: {
  title: string;
  desc?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-none font-black text-kraft-50">
          {title}
        </h2>
        {desc && <p className="mt-2.5 max-w-[64ch] text-[14px] leading-relaxed text-kraft-200/60">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function Thumb({ src, label, className }: { src?: string; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-yerba-700 bg-yerba-800",
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <span className="font-display text-lg font-black text-gold-300">{label.trim().charAt(0).toUpperCase() || "?"}</span>
      )}
    </span>
  );
}

export function StatusDot({ status }: { status: "active" | "soldout" | "hidden" }) {
  const map = {
    active: ["bg-yerba-300", "En venta"],
    soldout: ["bg-gold-400", "Agotado"],
    hidden: ["bg-kraft-200/40", "Oculto"],
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-kraft-200/60 uppercase">
      <span className={cn("size-2 rounded-full", map[status][0])} />
      {map[status][1]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* borradores con barra de guardado                                   */
/* ------------------------------------------------------------------ */

export function useDraft<T>(source: T) {
  const key = JSON.stringify(source);
  const [draft, setDraft] = useState<T>(source);
  const [seen, setSeen] = useState(key);
  // si lo guardado cambia (al guardar, restaurar un respaldo, etc.), el borrador se alinea
  if (key !== seen) {
    setSeen(key);
    setDraft(source);
  }
  const dirty = JSON.stringify(draft) !== key;
  const discard = () => setDraft(source);
  return { draft, setDraft, dirty, discard };
}

export function SaveBar({
  dirty,
  onSave,
  onDiscard,
  label = "Guardar cambios",
}: {
  dirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
  label?: string;
}) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="sticky bottom-4 z-30 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-500/50 bg-yerba-950/95 px-5 py-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        >
          <span className="flex items-center gap-2.5 text-[13px] font-semibold text-gold-200">
            <span className="relative flex size-2.5">
              <span className="pulse-ring absolute inline-flex size-full rounded-full bg-gold-400" />
              <span className="relative inline-flex size-2.5 rounded-full bg-gold-400" />
            </span>
            Tenés cambios sin guardar
          </span>
          <span className="flex items-center gap-2">
            <Btn size="sm" onClick={onDiscard}>
              Descartar
            </Btn>
            <Btn size="sm" variant="gold" onClick={onSave}>
              {label}
            </Btn>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* subida de fotos                                                    */
/* ------------------------------------------------------------------ */

export function ImageField({
  label,
  value,
  fallback,
  onChange,
  hint,
  aspect = "aspect-[4/3]",
  maxSide = 1100,
}: {
  label: string;
  value?: string;
  fallback?: string;
  onChange: (v: string | undefined) => void;
  hint?: ReactNode;
  aspect?: string;
  maxSide?: number;
}) {
  const { toast } = useAdminUi();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState("");
  const shown = value || fallback;

  const pick = async (f?: File | null) => {
    if (!f) return;
    setBusy(true);
    try {
      onChange(await fileToDataUrl(f, maxSide));
      toast("Foto cargada y optimizada");
    } catch (e) {
      toast(e instanceof Error ? e.message : "No se pudo leer la imagen", "error");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const applyUrl = () => {
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) {
      toast("Pegá un enlace que empiece con https://", "error");
      return;
    }
    onChange(u);
    setUrl("");
    setShowUrl(false);
    toast("Enlace de foto guardado");
  };

  return (
    <div>
      <span className="mb-1.5 block text-[10.5px] font-black tracking-[0.18em] text-kraft-200/55 uppercase">
        {label}
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void pick(e.dataTransfer.files[0]);
        }}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-dashed bg-yerba-950/70 transition-colors",
          drag ? "border-gold-400 bg-gold-400/10" : "border-yerba-600",
          aspect,
        )}
      >
        {shown ? (
          <img src={shown} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center text-kraft-200/40">
            <div>
              <IImage className="mx-auto size-8" />
              <p className="mt-2 text-[12px] font-semibold">Arrastrá una foto acá</p>
            </div>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-yerba-950/75 text-[12px] font-bold text-gold-200">
            Optimizando…
          </div>
        )}
        {!value && fallback && (
          <span className="absolute top-2 left-2 rounded-full bg-yerba-950/80 px-2.5 py-1 text-[9.5px] font-black tracking-[0.14em] text-kraft-200/70 uppercase backdrop-blur">
            foto original
          </span>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <Btn size="sm" variant="soft" onClick={() => input.current?.click()}>
          <IUpload className="size-3.5" /> Subir foto
        </Btn>
        <Btn size="sm" onClick={() => setShowUrl((v) => !v)}>
          Usar enlace
        </Btn>
        {value && (
          <Btn size="sm" variant="danger" onClick={() => onChange(undefined)}>
            {fallback ? "Restaurar original" : "Quitar foto"}
          </Btn>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void pick(e.target.files?.[0])}
        />
      </div>

      {showUrl && (
        <div className="mt-2.5 flex gap-2">
          <TextInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            placeholder="https://…/foto.jpg"
          />
          <Btn size="sm" variant="gold" onClick={applyUrl}>
            Usar
          </Btn>
        </div>
      )}
      {hint && <p className="mt-2 text-[11.5px] leading-snug text-kraft-200/40">{hint}</p>}
    </div>
  );
}
