import { useMemo, useState } from "react";
import { DEFAULT_PIN, hashPin, useSite } from "@/lib/store";
import { fmt, IconBasket, IconLaser, IconLeaf } from "@/components/common";
import { Btn, Field, PageHead, Panel, Select, useAdminUi } from "./ui";
import { IImage, IPercent, ISliders, IWarn } from "./icons";
import type { TabId } from "./types";

const LIMIT_MB = 5;

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warn" }) {
  return (
    <div
      className={`rounded-[22px] border p-5 ${
        tone === "warn" ? "border-brick-500/60 bg-brick-600/15" : "border-yerba-700/70 bg-yerba-900/70"
      }`}
    >
      <p className="text-[10.5px] font-black tracking-[0.2em] text-kraft-200/50 uppercase">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none font-black text-gold-300">{value}</p>
      {sub && <p className="mt-2 text-[12px] text-kraft-200/50">{sub}</p>}
    </div>
  );
}

function ago(ts?: number) {
  if (!ts) return "todavía sin cambios propios";
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "hace un instante";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

export default function Resumen({ go }: { go: (t: TabId) => void }) {
  const { data, update } = useSite();
  const { toast, confirm } = useAdminUi();

  const y = data.yerbas;
  const act = y.filter((v) => (v.status ?? "active") === "active").length;
  const sold = y.filter((v) => v.status === "soldout").length;
  const hid = y.filter((v) => v.status === "hidden").length;
  const photos =
    Object.keys(data.images).length + y.filter((v) => v.image).length + data.products.filter((p) => p.image).length;
  const mb = useMemo(() => JSON.stringify(data).length / 1024 / 1024, [data]);
  const pct = Math.min(100, Math.round((mb / LIMIT_MB) * 100));
  const defaultPin = data.settings.pinHash === hashPin(DEFAULT_PIN);

  /* ---------- ajuste masivo ---------- */
  const [pct2, setPct2] = useState("10");
  const [step, setStep] = useState("100");
  const [g, setG] = useState({ yerbas: true, equipo: true, laser: false });
  const p = Number(pct2.replace(",", "."));
  const st = Number(step);
  const valid = Number.isFinite(p) && p > -90 && p < 300 && p !== 0 && (g.yerbas || g.equipo || g.laser);
  const adj = (n: number, s = st) => Math.max(0, Math.round((n * (1 + p / 100)) / s) * s);
  const example = y[0];

  const apply = async () => {
    const ok = await confirm({
      title: `¿Aplicar ${p > 0 ? "+" : ""}${p}% a los precios?`,
      body: (
        <>
          Se actualizan los precios seleccionados y se redondean a ${st}. Podés volver atrás aplicando el porcentaje
          inverso, pero el redondeo puede dejar diferencias de unos pesos.
        </>
      ),
      confirmLabel: "Aplicar a los precios",
    });
    if (!ok) return;
    const fine = Math.min(st, 10);
    update((s) => ({
      ...s,
      yerbas: g.yerbas ? s.yerbas.map((v) => ({ ...v, price: adj(v.price) })) : s.yerbas,
      products: g.equipo ? s.products.map((v) => ({ ...v, price: adj(v.price) })) : s.products,
      categories: g.equipo ? s.categories.map((c) => ({ ...c, priceFrom: adj(c.priceFrom) })) : s.categories,
      laser: g.laser
        ? {
            pricing: {
              ...s.laser.pricing,
              base: adj(s.laser.pricing.base),
              icon: adj(s.laser.pricing.icon),
              sub: adj(s.laser.pricing.sub),
              twoSides: adj(s.laser.pricing.twoSides),
              fiber: adj(s.laser.pricing.fiber),
              rush: adj(s.laser.pricing.rush),
              perExtraChar: adj(s.laser.pricing.perExtraChar, fine),
              includedChars: s.laser.pricing.includedChars,
              tier1Qty: s.laser.pricing.tier1Qty,
              tier1Pct: s.laser.pricing.tier1Pct,
              tier2Qty: s.laser.pricing.tier2Qty,
              tier2Pct: s.laser.pricing.tier2Pct,
            },
            plans: s.laser.plans.map((pl) => ({ ...pl, price: adj(pl.price) })),
          }
        : s.laser,
    }));
    toast("Precios actualizados en todo el sitio");
  };

  const quick: { id: TabId; label: string; desc: string; Icon: typeof IconLeaf }[] = [
    { id: "yerbas", label: "Editar yerbas", desc: "Precios, fotos, stock", Icon: IconLeaf },
    { id: "equipo", label: "Mates, termos y canastas", desc: "Agregar productos", Icon: IconBasket },
    { id: "grabado", label: "Precios del grabado", desc: "Tarifas y planes", Icon: IconLaser },
    { id: "fotos", label: "Fotos del sitio", desc: "Portada y banners", Icon: IImage },
    { id: "ajustes", label: "Ajustes y respaldo", desc: "Contacto, PIN, copia", Icon: ISliders },
  ];

  return (
    <>
      <PageHead
        title="Hola 👋"
        desc={`Desde acá manejás todo el sitio. Último cambio: ${ago(data.updatedAt)}. Lo que modifiques se ve de inmediato en la página.`}
      />

      {defaultPin && (
        <button
          onClick={() => go("ajustes")}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-gold-500/50 bg-gold-400/10 px-5 py-4 text-left text-[13.5px] text-gold-200 transition-colors hover:bg-gold-400/15"
        >
          <IWarn className="size-5" />
          <span>
            <strong className="font-black">Cambiá el PIN inicial.</strong> Cualquiera que lo conozca puede entrar a este
            panel. Tocá acá para cambiarlo.
          </span>
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Yerbas en venta" value={String(act)} sub={`${sold} agotadas · ${hid} ocultas`} />
        <Stat label="Mates, termos, canastas" value={String(data.products.length)} sub="productos cargados" />
        <Stat label="Fotos propias" value={String(photos)} sub="subidas por vos" />
        <Stat
          label="Espacio usado"
          value={`${pct}%`}
          sub={`${mb.toFixed(2)} MB de ≈${LIMIT_MB} MB`}
          tone={pct > 80 ? "warn" : undefined}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {quick.map(({ id, label, desc, Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className="group rounded-2xl border border-yerba-700/70 bg-yerba-900/60 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/70"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-yerba-700 text-yerba-300 transition-colors group-hover:border-gold-400/60 group-hover:text-gold-300">
              <Icon className="size-5" />
            </span>
            <p className="mt-3 text-[13.5px] font-bold text-kraft-50">{label}</p>
            <p className="text-[11.5px] text-kraft-200/45">{desc}</p>
          </button>
        ))}
      </div>

      <Panel
        className="mt-8"
        title="Ajuste masivo de precios"
        desc="¿Subió todo? Aplicá un porcentaje a muchos precios de una sola vez, con redondeo automático."
        actions={<IPercent className="size-6 text-gold-300" />}
      >
        <div className="grid gap-5 md:grid-cols-[1fr_1fr_1.2fr]">
          <Field label="Porcentaje (usá − para bajar)" group>
            <div className="relative">
              <input
                value={pct2}
                onChange={(e) => setPct2(e.target.value.replace(/[^\d.,-]/g, ""))}
                inputMode="decimal"
                className="w-full rounded-xl border border-yerba-700 bg-yerba-950/80 px-3.5 py-2.5 pr-9 text-[14px] font-bold text-kraft-50 tabular-nums outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/15"
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[13px] font-bold text-kraft-200/50">
                %
              </span>
            </div>
          </Field>
          <Field label="Redondear a">
            <Select value={step} onChange={(e) => setStep(e.target.value)}>
              <option value="1">$ 1 (sin redondeo)</option>
              <option value="10">$ 10</option>
              <option value="50">$ 50</option>
              <option value="100">$ 100</option>
            </Select>
          </Field>
          <Field label="Qué precios incluir" group>
            <div className="space-y-2 pt-1">
              {(
                [
                  ["yerbas", "Yerbas"],
                  ["equipo", "Mates, termos y canastas (y “desde”)"],
                  ["laser", "Grabado láser (tarifas y planes)"],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-kraft-100">
                  <input
                    type="checkbox"
                    checked={g[k]}
                    onChange={(e) => setG((v) => ({ ...v, [k]: e.target.checked }))}
                    className="size-4 accent-[#e3b23f]"
                  />
                  {l}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-yerba-700/60 bg-yerba-950/50 px-5 py-4">
          <p className="text-[13px] text-kraft-200/65">
            {example && valid && g.yerbas ? (
              <>
                Ejemplo: <strong className="text-kraft-50">{example.brand}</strong> pasa de{" "}
                <span className="font-bold text-kraft-100">{fmt(example.price)}</span> a{" "}
                <span className="font-bold text-gold-300">{fmt(adj(example.price))}</span>
              </>
            ) : (
              "Elegí un porcentaje y al menos un grupo de precios."
            )}
          </p>
          <Btn variant="gold" disabled={!valid} onClick={() => void apply()}>
            Aplicar a los precios
          </Btn>
        </div>
      </Panel>

    </>
  );
}
