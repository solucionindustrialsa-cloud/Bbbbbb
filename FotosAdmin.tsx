import { useSite, defaultImages, type ImageKey } from "@/lib/store";
import { ImageField, PageHead, Panel } from "./ui";

const SLOTS: { key: ImageKey; title: string; desc: string; aspect: string }[] = [
  {
    key: "hero",
    title: "Portada · mate principal",
    desc: "La foto grande que flota en el inicio. Funciona mejor con el producto centrado sobre fondo oscuro.",
    aspect: "aspect-square",
  },
  {
    key: "grabado",
    title: "Banner del taller láser",
    desc: "Franja ancha al comienzo de la sección de grabado. Ideal: detalle de un grabado en madera o metal.",
    aspect: "aspect-[16/9]",
  },
  {
    key: "mates",
    title: "Categoría · Mates",
    desc: "Foto de la sección de mates. También se usa para los productos de mates que no tengan foto propia.",
    aspect: "aspect-[4/3]",
  },
  {
    key: "termos",
    title: "Categoría · Termos",
    desc: "Foto de la sección de termos y pavas cebadoras.",
    aspect: "aspect-[4/3]",
  },
  {
    key: "canastas",
    title: "Categoría · Canastas materas",
    desc: "Foto de la sección de canastas materas de cuero.",
    aspect: "aspect-[4/3]",
  },
];

export default function FotosAdmin() {
  const { data, update } = useSite();

  const setImg = (key: ImageKey, v: string | undefined) =>
    update((s) => {
      const images = { ...s.images };
      if (v) images[key] = v;
      else delete images[key];
      return { ...s, images };
    });

  return (
    <>
      <PageHead
        title="Fotos del sitio"
        desc="Reemplazá las imágenes principales. Las fotos se reducen y comprimen solas para que el sitio siga rápido. Los cambios se ven al instante."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {SLOTS.map((s) => (
          <Panel key={s.key}>
            <h3 className="font-display text-lg font-black text-kraft-50">{s.title}</h3>
            <p className="mt-1 mb-4 text-[12.5px] leading-relaxed text-kraft-200/50">{s.desc}</p>
            <ImageField
              label="Foto actual"
              value={data.images[s.key]}
              fallback={defaultImages[s.key]}
              onChange={(v) => setImg(s.key, v)}
              aspect={s.aspect}
              maxSide={s.key === "grabado" ? 1600 : 1200}
            />
          </Panel>
        ))}
      </div>

      <p className="mt-6 rounded-2xl border border-yerba-700/60 bg-yerba-900/50 px-5 py-4 text-[13px] leading-relaxed text-kraft-200/55">
        <strong className="text-kraft-100">¿Y las fotos de cada producto?</strong> Se cambian desde su propia ficha: en{" "}
        <em>Yerbas</em> o en <em>Mates · Termos · Canastas</em>, tocá el lápiz del producto.
      </p>
    </>
  );
}
