import { useMemo, useRef, useState } from "react";
import { DEFAULT_PIN, hashPin, useSite } from "@/lib/store";
import {
  Btn,
  Field,
  MoneyInput,
  PageHead,
  Panel,
  SaveBar,
  Select,
  TextInput,
  useAdminUi,
  useDraft,
} from "./ui";
import { IDownload, ILock, IUpload, IWarn } from "./icons";

export default function AjustesAdmin() {
  const { data, update, replaceAll, reset } = useSite();
  const { toast, confirm } = useAdminUi();
  const s = data.settings;

  const source = {
    whatsapp: s.whatsapp,
    whatsappDisplay: s.whatsappDisplay,
    email: s.email,
    laserEmail: s.laserEmail,
    address: s.address,
    hours: s.hours,
    freeShipping: s.freeShipping,
    featuredYerbaId: s.featuredYerbaId,
  };
  const { draft, setDraft, dirty, discard } = useDraft(source);
  const set = <K extends keyof typeof source>(k: K, v: (typeof source)[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    const digits = draft.whatsapp.replace(/\D/g, "");
    if (digits.length < 8) {
      toast("El WhatsApp debe tener código de país y número. Ej: 59899123456", "error");
      return;
    }
    update((st) => ({ ...st, settings: { ...st.settings, ...draft, whatsapp: digits } }));
    toast("Ajustes guardados");
  };

  /* ---------- PIN ---------- */
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [rep, setRep] = useState("");
  const isDefaultPin = s.pinHash === hashPin(DEFAULT_PIN);

  const changePin = () => {
    if (hashPin(cur) !== s.pinHash) return toast("El PIN actual no es correcto", "error");
    if (nw.length < 4) return toast("El nuevo PIN debe tener al menos 4 caracteres", "error");
    if (nw !== rep) return toast("Los dos PIN nuevos no coinciden", "error");
    update((st) => ({ ...st, settings: { ...st.settings, pinHash: hashPin(nw) } }));
    setCur("");
    setNw("");
    setRep("");
    toast("PIN actualizado");
  };

  /* ---------- respaldo ---------- */
  const fileRef = useRef<HTMLInputElement>(null);
  const sizeMb = useMemo(() => (JSON.stringify(data).length / 1024 / 1024).toFixed(2), [data]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `el-cebador-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Respaldo descargado");
  };

  const importData = async (f?: File) => {
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (!parsed || !Array.isArray(parsed.yerbas) || !parsed.settings) throw new Error("formato");
      const ok = await confirm({
        title: "¿Restaurar este respaldo?",
        body: "Se reemplazan todos los precios, productos, fotos y ajustes actuales por los del archivo.",
        confirmLabel: "Sí, restaurar",
        danger: true,
      });
      if (ok) {
        replaceAll(parsed);
        toast("Respaldo restaurado");
      }
    } catch {
      toast("Ese archivo no es un respaldo válido de El Cebador", "error");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const doReset = async () => {
    const ok = await confirm({
      title: "¿Volver todo al estado original?",
      body: "Se borran tus productos, precios, fotos y ajustes. El PIN vuelve a ser el inicial. Te recomendamos descargar un respaldo antes.",
      confirmLabel: "Sí, restablecer todo",
      danger: true,
    });
    if (ok) {
      reset();
      toast("Sitio restablecido", "info");
    }
  };

  return (
    <>
      <PageHead title="Ajustes y respaldo" desc="Datos de contacto, envíos, seguridad del panel y copias de seguridad." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Contacto del local" desc="Se usa en el pie de página, el botón flotante y la sección de grabado.">
          <div className="grid gap-4">
            <Field
              label="WhatsApp (con código de país)"
              hint="Solo números, sin + ni espacios. Ej: 59899123456. Es a donde llegan los pedidos."
            >
              <TextInput value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="numeric" />
            </Field>
            <Field label="WhatsApp como se muestra">
              <TextInput value={draft.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} />
            </Field>
            <Field label="Email general">
              <TextInput type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Email del taller láser">
              <TextInput type="email" value={draft.laserEmail} onChange={(e) => set("laserEmail", e.target.value)} />
            </Field>
            <Field label="Dirección">
              <TextInput value={draft.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Horarios">
              <TextInput value={draft.hours} onChange={(e) => set("hours", e.target.value)} />
            </Field>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Tienda" desc="Datos que se muestran en la portada y en los servicios.">
            <div className="grid gap-4">
              <Field label="Envío gratis a partir de" group>
                <MoneyInput value={draft.freeShipping} onChange={(n) => set("freeShipping", n)} />
              </Field>
              <Field label="Yerba destacada en la portada" hint="La tarjeta flotante del inicio muestra su marca y su precio actual.">
                <Select value={draft.featuredYerbaId} onChange={(e) => set("featuredYerbaId", e.target.value)}>
                  {data.yerbas.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.brand} · {y.weight}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Panel>

          <Panel title="PIN del panel" desc="Es lo que protege el acceso a este panel.">
            {isDefaultPin && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-gold-500/50 bg-gold-400/10 p-3.5 text-[12.5px] leading-relaxed text-gold-200">
                <IWarn className="mt-0.5 size-4" />
                Todavía usás el PIN inicial ({DEFAULT_PIN}). Cambialo ahora.
              </div>
            )}
            <div className="grid gap-3">
              <Field label="PIN actual">
                <TextInput type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="off" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="PIN nuevo">
                  <TextInput type="password" value={nw} onChange={(e) => setNw(e.target.value)} autoComplete="new-password" />
                </Field>
                <Field label="Repetir PIN nuevo">
                  <TextInput type="password" value={rep} onChange={(e) => setRep(e.target.value)} autoComplete="new-password" />
                </Field>
              </div>
              <Btn variant="soft" onClick={changePin} className="w-fit">
                <ILock className="size-4" /> Cambiar PIN
              </Btn>
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        className="mt-6"
        title="Respaldo y restauración"
        desc="Tus cambios se guardan en este navegador. Descargá una copia seguido y guardala en tu computadora o en Drive: te sirve si cambiás de equipo o borrás los datos del navegador."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Btn variant="gold" onClick={exportData}>
            <IDownload className="size-4" /> Descargar respaldo
          </Btn>
          <Btn onClick={() => fileRef.current?.click()}>
            <IUpload className="size-4" /> Restaurar desde archivo
          </Btn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void importData(e.target.files?.[0])}
          />
          <Btn variant="danger" onClick={() => void doReset()} className="sm:ml-auto">
            Restablecer todo
          </Btn>
        </div>
        <p className="mt-4 text-[12px] text-kraft-200/40">Tamaño actual de tus datos: {sizeMb} MB (el límite del navegador ronda los 5 MB).</p>
      </Panel>

      <SaveBar dirty={dirty} onSave={save} onDiscard={discard} />
    </>
  );
}
