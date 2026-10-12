import { useMemo, useState } from "react";
import { useSite, uid, type Status, type Yerba } from "@/lib/store";
import { cn } from "@/utils/cn";
import {
  Btn,
  Field,
  IconBtn,
  ImageField,
  Modal,
  MoneyInput,
  PageHead,
  Select,
  StatusDot,
  TextArea,
  TextInput,
  Thumb,
  useAdminUi,
} from "./ui";
import { ICopy, IDel, IDown, IEdit, IPlusC, ISearch, IUp } from "./icons";
import { fmt } from "@/components/common";

const TYPES: Yerba["type"][] = ["Tradicional", "Con palo", "Despalada", "Compuesta", "Orgánica"];
const STATUS: { id: Status; label: string }[] = [
  { id: "active", label: "En venta" },
  { id: "soldout", label: "Agotado" },
  { id: "hidden", label: "Oculto" },
];

const blank = (): Yerba => ({
  id: uid("y"),
  brand: "",
  name: "",
  origin: "Misiones, Argentina",
  cut: "",
  type: "Tradicional",
  intensity: 3,
  aging: "",
  notes: [],
  price: 0,
  weight: "1 kg",
  hue: 0,
  status: "active",
});

/* ------------------------------------------------------------------ */

function Editor({ initial, isNew, onClose }: { initial: Yerba; isNew: boolean; onClose: () => void }) {
  const { update } = useSite();
  const { toast } = useAdminUi();
  const [d, setD] = useState<Yerba>(initial);
  const set = <K extends keyof Yerba>(k: K, v: Yerba[K]) => setD((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!d.brand.trim()) {
      toast("Poné el nombre de la marca", "error");
      return;
    }
    const clean: Yerba = {
      ...d,
      brand: d.brand.trim(),
      name: d.name.trim() || d.brand.trim(),
      notes: d.notes.map((n) => n.trim()).filter(Boolean),
      badge: d.badge?.trim() || undefined,
    };
    update((s) => ({
      ...s,
      yerbas: isNew ? [...s.yerbas, clean] : s.yerbas.map((y) => (y.id === clean.id ? clean : y)),
    }));
    toast(isNew ? `“${clean.brand}” agregada a la tienda` : "Cambios guardados");
    onClose();
  };

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={isNew ? "Agregar yerba" : `Editar · ${initial.brand || "yerba"}`}
      footer={
        <>
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn variant="gold" onClick={save}>
            {isNew ? "Agregar a la tienda" : "Guardar cambios"}
          </Btn>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div>
          <ImageField
            label="Foto del paquete"
            value={d.image}
            onChange={(v) => set("image", v)}
            aspect="aspect-[4/3]"
            hint="Opcional. Sin foto se muestra la etiqueta ilustrada automática."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marca *">
            <TextInput value={d.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Ej: Canarias" />
          </Field>
          <Field label="Nombre completo">
            <TextInput value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Canarias Especial" />
          </Field>
          <Field label="Precio" group>
            <MoneyInput value={d.price} onChange={(n) => set("price", n)} />
          </Field>
          <Field label="Presentación">
            <TextInput value={d.weight} onChange={(e) => set("weight", e.target.value)} placeholder="1 kg" />
          </Field>
          <Field label="Tipo">
            <Select value={d.type} onChange={(e) => set("type", e.target.value as Yerba["type"])}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select value={d.status ?? "active"} onChange={(e) => set("status", e.target.value as Status)}>
              {STATUS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Intensidad" group className="sm:col-span-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("intensity", n as Yerba["intensity"])}
                  className={cn(
                    "h-10 flex-1 rounded-xl border text-[13px] font-black transition-all",
                    d.intensity === n
                      ? "border-gold-400 bg-gold-400/15 text-gold-200"
                      : "border-yerba-700 text-kraft-200/50 hover:border-yerba-500",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <span className="mt-1.5 block text-[11.5px] text-kraft-200/40">1 = suave · 5 = muy amarga e intensa</span>
          </Field>

          <Field label="Etiqueta destacada" hint="Ej: “La más vendida”, “Oferta”. Dejalo vacío para no mostrar." className="sm:col-span-2">
            <TextInput value={d.badge ?? ""} onChange={(e) => set("badge", e.target.value)} maxLength={22} />
          </Field>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field label="Origen">
          <TextInput value={d.origin} onChange={(e) => set("origin", e.target.value)} />
        </Field>
        <Field label="Molienda / corte">
          <TextInput value={d.cut} onChange={(e) => set("cut", e.target.value)} />
        </Field>
        <Field label="Añejamiento">
          <TextInput value={d.aging} onChange={(e) => set("aging", e.target.value)} />
        </Field>
        <Field label="Notas de cata (una por línea)" className="sm:col-span-3">
          <TextArea
            rows={3}
            value={d.notes.join("\n")}
            onChange={(e) => set("notes", e.target.value.split("\n"))}
            placeholder={"Amarga y persistente\nCuerpo denso\nRinde 25+ cebadas"}
          />
        </Field>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

export default function YerbasAdmin() {
  const { data, update } = useSite();
  const { toast, confirm } = useAdminUi();
  const [q, setQ] = useState("");
  const [st, setSt] = useState<"all" | Status>("all");
  const [editing, setEditing] = useState<{ y: Yerba; isNew: boolean } | null>(null);

  const filtering = q.trim() !== "" || st !== "all";
  const list = useMemo(
    () =>
      data.yerbas.filter((y) => {
        const okQ = `${y.brand} ${y.name}`.toLowerCase().includes(q.trim().toLowerCase());
        const okS = st === "all" || (y.status ?? "active") === st;
        return okQ && okS;
      }),
    [data.yerbas, q, st],
  );

  const patch = (id: string, p: Partial<Yerba>) =>
    update((s) => ({ ...s, yerbas: s.yerbas.map((y) => (y.id === id ? { ...y, ...p } : y)) }));

  const move = (id: string, dir: -1 | 1) =>
    update((s) => {
      const arr = [...s.yerbas];
      const i = arr.findIndex((y) => y.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return s;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...s, yerbas: arr };
    });

  const duplicate = (y: Yerba) => {
    const copy: Yerba = { ...y, id: uid("y"), brand: `${y.brand} (copia)`, notes: [...y.notes], status: "hidden" };
    update((s) => {
      const i = s.yerbas.findIndex((x) => x.id === y.id);
      const arr = [...s.yerbas];
      arr.splice(i + 1, 0, copy);
      return { ...s, yerbas: arr };
    });
    toast("Copia creada (oculta). Editala y ponela en venta.", "info");
  };

  const remove = async (y: Yerba) => {
    const ok = await confirm({
      title: `¿Eliminar ${y.brand}?`,
      body: "Se borra de la tienda y no se puede deshacer. Si solo querés sacarla un tiempo, ponela como “Oculto” o “Agotado”.",
      confirmLabel: "Sí, eliminar",
      danger: true,
    });
    if (!ok) return;
    update((s) => ({ ...s, yerbas: s.yerbas.filter((x) => x.id !== y.id) }));
    toast(`${y.brand} eliminada`);
  };

  return (
    <>
      <PageHead
        title="Yerbas"
        desc="Cambiá precios directamente en la lista. Para fotos, textos de cata o intensidad, tocá el lápiz. Todo se guarda solo y se ve al instante en el sitio."
        actions={
          <Btn variant="gold" onClick={() => setEditing({ y: blank(), isNew: true })}>
            <IPlusC className="size-4" /> Agregar yerba
          </Btn>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <ISearch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-kraft-200/40" />
          <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar marca…" className="pl-10" />
        </div>
        <Select value={st} onChange={(e) => setSt(e.target.value as "all" | Status)} className="w-[170px]">
          <option value="all">Todos los estados</option>
          {STATUS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
        <span className="text-[12px] font-bold tracking-[0.14em] text-kraft-200/45 uppercase">
          {list.length} de {data.yerbas.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {list.map((y) => {
          const idx = data.yerbas.findIndex((x) => x.id === y.id);
          const status = y.status ?? "active";
          return (
            <div
              key={y.id}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border bg-yerba-900/70 p-3.5 transition-colors",
                status === "hidden" ? "border-yerba-800 opacity-70" : "border-yerba-700/70 hover:border-yerba-500",
              )}
            >
              <Thumb src={y.image} label={y.brand} className="size-14" />
              <div className="min-w-[170px] flex-1">
                <p className="flex flex-wrap items-center gap-2 font-display text-lg leading-tight font-black text-kraft-50">
                  {y.brand || "Sin nombre"}
                  {y.badge && (
                    <span className="rounded-full bg-brick-500 px-2 py-0.5 font-body text-[9px] font-black tracking-[0.12em] text-kraft-50 uppercase">
                      {y.badge}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[12px] text-kraft-200/55">
                  {y.type} · {y.weight} · intensidad {y.intensity}/5
                </p>
              </div>
              <div className="w-[140px]">
                <MoneyInput
                  value={y.price}
                  onChange={(n) => patch(y.id, { price: n })}
                  onCommit={() => toast(`Precio de ${y.brand}: ${fmt(y.price)}`)}
                />
              </div>
              <div className="w-[130px]">
                <Select
                  value={status}
                  onChange={(e) => patch(y.id, { status: e.target.value as Status })}
                  aria-label="Estado"
                >
                  {STATUS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-1.5">
                <IconBtn label="Subir en la lista" disabled={filtering || idx === 0} onClick={() => move(y.id, -1)}>
                  <IUp className="size-4" />
                </IconBtn>
                <IconBtn
                  label="Bajar en la lista"
                  disabled={filtering || idx === data.yerbas.length - 1}
                  onClick={() => move(y.id, 1)}
                >
                  <IDown className="size-4" />
                </IconBtn>
                <IconBtn label="Editar" onClick={() => setEditing({ y, isNew: false })}>
                  <IEdit className="size-4" />
                </IconBtn>
                <IconBtn label="Duplicar" onClick={() => duplicate(y)}>
                  <ICopy className="size-4" />
                </IconBtn>
                <IconBtn label="Eliminar" danger onClick={() => void remove(y)}>
                  <IDel className="size-4" />
                </IconBtn>
              </div>
              <div className="w-full sm:hidden">
                <StatusDot status={status} />
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-yerba-700 py-14 text-center text-[14px] text-kraft-200/50">
            No hay yerbas con ese filtro.
          </div>
        )}
      </div>

      {filtering && (
        <p className="mt-3 text-[12px] text-kraft-200/40">
          Para reordenar con las flechas, quitá primero el filtro y la búsqueda.
        </p>
      )}

      {editing && <Editor key={editing.y.id} initial={editing.y} isNew={editing.isNew} onClose={() => setEditing(null)} />}
    </>
  );
}
