import { laserUnitPrice, uid, useSite, type LaserPricing, type Plan } from "@/lib/store";
import { fmt } from "@/components/common";
import {
  Btn,
  Field,
  IconBtn,
  MoneyInput,
  NumInput,
  PageHead,
  Panel,
  SaveBar,
  Switch,
  TextArea,
  TextInput,
  useAdminUi,
  useDraft,
} from "./ui";
import { IDel, IPlusC } from "./icons";

const MONEY: { key: keyof LaserPricing; label: string; hint?: string }[] = [
  { key: "base", label: "Precio base por pieza", hint: "Incluye los primeros caracteres del texto." },
  { key: "perExtraChar", label: "Cada carácter extra", hint: "Se suma después del límite incluido." },
  { key: "icon", label: "Agregar ícono / escudo" },
  { key: "sub", label: "Agregar bajada (2ª línea)" },
  { key: "twoSides", label: "Grabar también el reverso" },
  { key: "fiber", label: "Recargo en acero (láser de fibra)" },
  { key: "rush", label: "Entrega urgente 24 h" },
];

export default function GrabadoAdmin() {
  const { data, update } = useSite();
  const { toast } = useAdminUi();
  const { draft, setDraft, dirty, discard } = useDraft(data.laser);
  const pr = draft.pricing;

  const setPr = (k: keyof LaserPricing, v: number) =>
    setDraft((d) => ({ ...d, pricing: { ...d.pricing, [k]: v } }));
  const setPlan = (id: string, p: Partial<Plan>) =>
    setDraft((d) => ({ ...d, plans: d.plans.map((x) => (x.id === id ? { ...x, ...p } : x)) }));

  const addPlan = () =>
    setDraft((d) => ({
      ...d,
      plans: [
        ...d.plans,
        { id: uid("plan"), name: "Nuevo plan", prefix: "", price: 0, unit: "por pieza", features: [], highlight: false },
      ],
    }));

  const save = () => {
    update((s) => ({
      ...s,
      laser: {
        pricing: draft.pricing,
        plans: draft.plans.map((p) => ({
          ...p,
          name: p.name.trim() || "Plan",
          features: p.features.map((f) => f.trim()).filter(Boolean),
        })),
      },
    }));
    toast("Precios del grabado guardados");
  };

  const sample = (qty: number) =>
    laserUnitPrice(pr, { chars: 10, icon: true, sub: true, twoSides: false, fiber: false, rush: false, qty });

  return (
    <>
      <PageHead
        title="Grabado láser"
        desc="Estos precios alimentan la calculadora en vivo del sitio y las tarjetas de planes. Cambiá lo que quieras y guardá."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Tarifas de la calculadora" desc="Lo que paga el cliente al armar su grabado en el sitio.">
          <div className="grid gap-4 sm:grid-cols-2">
            {MONEY.map((m) => (
              <Field key={m.key} label={m.label} group hint={m.hint}>
                <MoneyInput value={pr[m.key]} onChange={(n) => setPr(m.key, n)} />
              </Field>
            ))}
            <Field label="Caracteres incluidos en el base" group hint="Luego se cobra cada carácter extra.">
              <NumInput value={pr.includedChars} min={1} max={22} onChange={(n) => setPr("includedChars", n)} />
            </Field>
          </div>

          <h4 className="mt-7 mb-3 text-[10.5px] font-black tracking-[0.2em] text-gold-300 uppercase">
            Descuentos por cantidad
          </h4>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Desde (piezas)" group>
              <NumInput value={pr.tier1Qty} min={2} max={999} onChange={(n) => setPr("tier1Qty", n)} />
            </Field>
            <Field label="Descuento" group>
              <NumInput value={pr.tier1Pct} min={0} max={90} suffix="%" onChange={(n) => setPr("tier1Pct", n)} />
            </Field>
            <Field label="Desde (piezas)" group>
              <NumInput value={pr.tier2Qty} min={2} max={999} onChange={(n) => setPr("tier2Qty", n)} />
            </Field>
            <Field label="Descuento" group>
              <NumInput value={pr.tier2Pct} min={0} max={90} suffix="%" onChange={(n) => setPr("tier2Pct", n)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Así queda el precio" desc="Ejemplo: nombre de 10 letras + ícono + bajada, en madera.">
          <div className="divide-y divide-yerba-800 overflow-hidden rounded-2xl border border-yerba-700/70">
            {[1, pr.tier1Qty, pr.tier2Qty].map((q, i) => {
              const r = sample(q);
              return (
                <div key={i} className="flex items-center justify-between gap-3 bg-yerba-950/50 px-4 py-3.5">
                  <div>
                    <p className="text-[13px] font-bold text-kraft-100">
                      {q} {q === 1 ? "pieza" : "piezas"}
                    </p>
                    <p className="text-[11px] text-kraft-200/45">
                      {r.discount > 0 ? `−${Math.round(r.discount * 100)}% aplicado` : "sin descuento"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-black text-gold-300">{fmt(r.unit)}</p>
                    <p className="text-[11px] text-kraft-200/45">c/u · total {fmt(r.total)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-kraft-200/45">
            El simulador del sitio usa estas mismas tarifas, así que el cliente siempre ve el precio actualizado.
          </p>
        </Panel>
      </div>

      <Panel
        className="mt-6"
        title="Planes de grabado"
        desc="Las tarjetas que se muestran debajo de “Cómo trabajamos”. Máximo 4."
        actions={
          <Btn size="sm" disabled={draft.plans.length >= 4} onClick={addPlan}>
            <IPlusC className="size-4" /> Agregar plan
          </Btn>
        }
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {draft.plans.map((p) => (
            <div key={p.id} className="rounded-2xl border border-yerba-700/70 bg-yerba-950/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Switch on={p.highlight} onChange={(v) => setPlan(p.id, { highlight: v })} label="Destacar como “el más pedido”" />
                <IconBtn
                  label="Quitar plan"
                  danger
                  disabled={draft.plans.length <= 1}
                  onClick={() => setDraft((d) => ({ ...d, plans: d.plans.filter((x) => x.id !== p.id) }))}
                >
                  <IDel className="size-4" />
                </IconBtn>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nombre">
                  <TextInput value={p.name} onChange={(e) => setPlan(p.id, { name: e.target.value })} />
                </Field>
                <Field label="Texto antes del precio">
                  <TextInput
                    value={p.prefix}
                    onChange={(e) => setPlan(p.id, { prefix: e.target.value })}
                    placeholder="Ej: Desde"
                  />
                </Field>
                <Field label="Precio" group>
                  <MoneyInput value={p.price} onChange={(n) => setPlan(p.id, { price: n })} />
                </Field>
                <Field label="Unidad">
                  <TextInput value={p.unit} onChange={(e) => setPlan(p.id, { unit: e.target.value })} />
                </Field>
                <Field label="Incluye (una línea por ítem)" className="sm:col-span-2">
                  <TextArea
                    rows={5}
                    value={p.features.join("\n")}
                    onChange={(e) => setPlan(p.id, { features: e.target.value.split("\n") })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <SaveBar dirty={dirty} onSave={save} onDiscard={discard} />
    </>
  );
}
