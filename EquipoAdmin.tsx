import { useState } from "react";
import { useSite, uid, type CatId, type Category, type KV, type Product, type Status } from "@/lib/store";
import { cn } from "@/utils/cn";
import {
  Btn,
  Field,
  IconBtn,
  ImageField,
  Modal,
  MoneyInput,
  PageHead,
  Panel,
  SaveBar,
  Select,
  StatusDot,
  Switch,
  TextArea,
  TextInput,
  Thumb,
  useAdminUi,
} from "./ui";
import { ICopy, IDel, IDown, IEdit, IPlusC, IUp } from "./icons";
import { IconBasket, IconGourd, IconThermo, fmt } from "@/components/common";

const CATS: { id: CatId; label: string; Icon: typeof IconGourd }[] = [
  { id: "mates", label: "Mates", Icon: IconGourd },
  { id: "termos", label: "Termos", Icon: IconThermo },
  { id: "canastas", label: "Canastas materas", Icon: IconBasket },
];

const STATUS: { id: Status; label: string }[] = [
  { id: "active", label: "En venta" },
  { id: "soldout", label: "Agotado" },
  { id: "hidden", label: "Oculto" },
];

const kvToText = (a: KV[]) => a.map((s) => (s.v ? `${s.k}: ${s.v}` : s.k)).join("\n");
const textToKv = (t: string): KV[] =>
  t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":");
      return i < 0 ? { k: l, v: "" } : { k: l.slice(0, i).trim(), v: l.slice(i + 1).trim() };
    });
const linesToArr = (t: string) =>
  t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ */
/* editor de producto                                                 */
/* ------------------------------------------------------------------ */

function ProductEditor({ initial, isNew, onClose }: { initial: Product; isNew: boolean; onClose: () => void }) {
  const { update, img } = useSite();
  const { toast } = useAdminUi();
  const [d, setD] = useState<Product>(initial);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setD((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!d.name.trim()) {
      toast("Poné el nombre del producto", "error");
      return;
    }
    const clean = { ...d, name: d.name.trim(), sub: d.sub.trim() };
    update((s) => ({
      ...s,
      products: isNew ? [...s.products, clean] : s.products.map((p) => (p.id === clean.id ? clean : p)),
    }));
    toast(isNew ? `“${clean.name}” agregado a la tienda` : "Cambios guardados");
    onClose();
  };

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={isNew ? "Agregar producto" : "Editar producto"}
      footer={
        <>
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn variant="gold" onClick={save}>
            {isNew ? "Agregar a la tienda" : "Guardar cambios"}
          </Btn>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <ImageField
          label="Foto del producto"
          value={d.image}
          fallback={img(d.category)}
          onChange={(v) => set("image", v)}
          hint="Sin foto propia se usa la imagen de la categoría. Mejor si es horizontal y bien iluminada."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre *" className="sm:col-span-2">
            <TextInput value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Mate de calabaza forrado" />
          </Field>
          <Field label="Descripción corta" className="sm:col-span-2">
            <TextInput value={d.sub} onChange={(e) => set("sub", e.target.value)} placeholder="Ej: Virola de alpaca · 220 ml" />
          </Field>
          <Field label="Precio" group>
            <MoneyInput value={d.price} onChange={(n) => set("price", n)} />
          </Field>
          <Field label="Categoría">
            <Select value={d.category} onChange={(e) => set("category", e.target.value as CatId)}>
              {CATS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select value={d.status} onChange={(e) => set("status", e.target.value as Status)}>
              {STATUS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-end pb-2">
            <Switch on={d.grabable} onChange={(v) => set("grabable", v)} label="Se puede grabar con láser" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* textos de la categoría                                             */
/* ------------------------------------------------------------------ */

function CategoryForm({ category, cheapest }: { category: Category; cheapest: number | null }) {
  const { update } = useSite();
  const { toast } = useAdminUi();

  const src = {
    title: category.title,
    lede: category.lede,
    priceFrom: category.priceFrom,
    bullets: category.bullets.join("\n"),
    specs: kvToText(category.specs),
    ring: kvToText(category.ringStats),
  };
  const srcKey = JSON.stringify(src);
  const [f, setF] = useState(src);
  const [seen, setSeen] = useState(srcKey);
  // al guardar, el texto normalizado (sin líneas vacías) vuelve a los campos
  if (srcKey !== seen) {
    setSeen(srcKey);
    setF(src);
  }
  const dirty = JSON.stringify(f) !== srcKey;
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    update((s) => ({
      ...s,
      categories: s.categories.map((c) =>
        c.id === category.id
          ? {
              ...c,
              title: f.title.trim() || c.title,
              lede: f.lede.trim(),
              priceFrom: f.priceFrom,
              bullets: linesToArr(f.bullets),
              specs: textToKv(f.specs),
              ringStats: textToKv(f.ring).slice(0, 6),
            }
          : c,
      ),
    }));
    toast("Textos de la categoría guardados");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título de la sección">
          <TextInput value={f.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field
          label="Precio “desde”"
          group
          hint={
            cheapest !== null && cheapest !== f.priceFrom ? (
              <>
                Tu pieza más barata en venta es {fmt(cheapest)}.{" "}
                <button type="button" className="font-bold text-gold-300 underline" onClick={() => set("priceFrom", cheapest)}>
                  Usar ese precio
                </button>
              </>
            ) : (
              "Se muestra sobre la foto y en el carrusel 3D."
            )
          }
        >
          <MoneyInput value={f.priceFrom} onChange={(n) => set("priceFrom", n)} />
        </Field>
        <Field label="Descripción" className="md:col-span-2">
          <TextArea rows={3} value={f.lede} onChange={(e) => set("lede", e.target.value)} />
        </Field>
        <Field label="Puntos destacados (uno por línea)">
          <TextArea rows={5} value={f.bullets} onChange={(e) => set("bullets", e.target.value)} />
        </Field>
        <Field label="Ficha técnica (Dato: valor)">
          <TextArea rows={5} value={f.specs} onChange={(e) => set("specs", e.target.value)} />
        </Field>
        <Field label="Ficha corta del carrusel 3D (Dato: valor, máx. 5)" className="md:col-span-2">
          <TextArea rows={4} value={f.ring} onChange={(e) => set("ring", e.target.value)} />
        </Field>
      </div>
      <SaveBar dirty={dirty} onSave={save} onDiscard={() => setF(src)} />
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function EquipoAdmin() {
  const { data, update, img } = useSite();
  const { toast, confirm } = useAdminUi();
  const [cat, setCat] = useState<CatId>("mates");
  const [editing, setEditing] = useState<{ p: Product; isNew: boolean } | null>(null);

  const category = data.categories.find((c) => c.id === cat)!;
  const items = data.products.filter((p) => p.category === cat);
  const cheapestList = items.filter((p) => p.status === "active").map((p) => p.price);
  const cheapest = cheapestList.length ? Math.min(...cheapestList) : null;

  const blank = (): Product => ({
    id: uid("p"),
    category: cat,
    name: "",
    sub: "",
    price: 0,
    status: "active",
    grabable: true,
  });

  const patch = (id: string, p: Partial<Product>) =>
    update((s) => ({ ...s, products: s.products.map((x) => (x.id === id ? { ...x, ...p } : x)) }));

  const move = (id: string, dir: -1 | 1) =>
    update((s) => {
      const ids = s.products.filter((p) => p.category === cat).map((p) => p.id);
      const k = ids.indexOf(id);
      const other = ids[k + dir];
      if (k < 0 || !other) return s;
      const arr = [...s.products];
      const a = arr.findIndex((p) => p.id === id);
      const b = arr.findIndex((p) => p.id === other);
      [arr[a], arr[b]] = [arr[b], arr[a]];
      return { ...s, products: arr };
    });

  const duplicate = (p: Product) => {
    update((s) => ({
      ...s,
      products: [...s.products, { ...p, id: uid("p"), name: `${p.name} (copia)`, status: "hidden" }],
    }));
    toast("Copia creada (oculta). Editala y ponela en venta.", "info");
  };

  const remove = async (p: Product) => {
    const ok = await confirm({
      title: `¿Eliminar “${p.name}”?`,
      body: "Se borra de la tienda y no se puede deshacer. Podés ponerlo como “Oculto” para sacarlo sin perderlo.",
      confirmLabel: "Sí, eliminar",
      danger: true,
    });
    if (!ok) return;
    update((s) => ({ ...s, products: s.products.filter((x) => x.id !== p.id) }));
    toast("Producto eliminado");
  };

  return (
    <>
      <PageHead
        title="Mates · Termos · Canastas"
        desc="Agregá productos con su foto y precio. Aparecen en el carrusel 3D y en cada sección de catálogo del sitio."
        actions={
          <Btn variant="gold" onClick={() => setEditing({ p: blank(), isNew: true })}>
            <IPlusC className="size-4" /> Agregar producto
          </Btn>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {CATS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setCat(id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold transition-all",
              cat === id
                ? "border-gold-400 bg-gold-400/15 text-gold-200"
                : "border-yerba-700 text-kraft-200/60 hover:border-yerba-500 hover:text-kraft-100",
            )}
          >
            <Icon className="size-4" />
            {label}
            <span className="rounded-full bg-yerba-950/70 px-2 py-0.5 text-[11px] text-kraft-200/60">
              {data.products.filter((p) => p.category === id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {items.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border bg-yerba-900/70 p-3.5 transition-colors",
              p.status === "hidden" ? "border-yerba-800 opacity-70" : "border-yerba-700/70 hover:border-yerba-500",
            )}
          >
            <Thumb src={p.image || img(p.category)} label={p.name} className="size-14" />
            <div className="min-w-[180px] flex-1">
              <p className="font-display text-lg leading-tight font-black text-kraft-50">{p.name || "Sin nombre"}</p>
              <p className="mt-0.5 text-[12px] text-kraft-200/55">{p.sub || "Sin descripción"}</p>
              <div className="mt-1.5 flex items-center gap-3">
                <StatusDot status={p.status} />
                {p.grabable && <span className="text-[10.5px] font-bold tracking-[0.1em] text-yerba-300/70 uppercase">grabable</span>}
                {!p.image && <span className="text-[10.5px] text-kraft-200/35">usa foto de la categoría</span>}
              </div>
            </div>
            <div className="w-[140px]">
              <MoneyInput
                value={p.price}
                onChange={(n) => patch(p.id, { price: n })}
                onCommit={() => toast(`Precio actualizado: ${fmt(p.price)}`)}
              />
            </div>
            <div className="w-[130px]">
              <Select value={p.status} onChange={(e) => patch(p.id, { status: e.target.value as Status })} aria-label="Estado">
                {STATUS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-1.5">
              <IconBtn label="Subir" disabled={i === 0} onClick={() => move(p.id, -1)}>
                <IUp className="size-4" />
              </IconBtn>
              <IconBtn label="Bajar" disabled={i === items.length - 1} onClick={() => move(p.id, 1)}>
                <IDown className="size-4" />
              </IconBtn>
              <IconBtn label="Editar" onClick={() => setEditing({ p, isNew: false })}>
                <IEdit className="size-4" />
              </IconBtn>
              <IconBtn label="Duplicar" onClick={() => duplicate(p)}>
                <ICopy className="size-4" />
              </IconBtn>
              <IconBtn label="Eliminar" danger onClick={() => void remove(p)}>
                <IDel className="size-4" />
              </IconBtn>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-yerba-700 py-12 text-center text-[14px] text-kraft-200/50">
            Todavía no hay productos en esta categoría. Tocá “Agregar producto”.
          </div>
        )}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-kraft-200/40">
        En el carrusel 3D se muestran hasta 3 productos por categoría (los primeros de la lista que estén en venta o
        agotados). En la sección de catálogo se muestran todos.
      </p>

      <Panel
        className="mt-8"
        title={`Textos de “${category.label}”`}
        desc="Descripción, puntos destacados, ficha técnica y precio “desde” de esta sección."
      >
        <CategoryForm key={cat} category={category} cheapest={cheapest} />
      </Panel>

      {editing && <ProductEditor key={editing.p.id} initial={editing.p} isNew={editing.isNew} onClose={() => setEditing(null)} />}
    </>
  );
}
