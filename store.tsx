import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { categoryData, laserPlans as seedPlans, yerbas as seedYerbas, type Status, type Yerba } from "./data";
import heroImg from "@/assets/mate-hero.jpg";
import grabadoImg from "@/assets/grabado.png";
import matesImg from "@/assets/mates.jpg";
import termoImg from "@/assets/termo.jpg";
import canastaImg from "@/assets/canasta.jpg";

export type { Status, Yerba };

/* ------------------------------------------------------------------ */
/* tipos                                                              */
/* ------------------------------------------------------------------ */

export type CatId = "mates" | "termos" | "canastas";
export type ImageKey = "hero" | "grabado" | CatId;
export type KV = { k: string; v: string };

export type Product = {
  id: string;
  category: CatId;
  name: string;
  sub: string;
  price: number;
  image?: string;
  status: Status;
  grabable: boolean;
};

export type Category = {
  id: CatId;
  label: string;
  title: string;
  lede: string;
  priceFrom: number;
  specs: KV[];
  bullets: string[];
  ringStats: KV[];
};

export type Settings = {
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  laserEmail: string;
  address: string;
  hours: string;
  freeShipping: number;
  featuredYerbaId: string;
  pinHash: string;
};

export type LaserPricing = {
  base: number;
  includedChars: number;
  perExtraChar: number;
  icon: number;
  sub: number;
  twoSides: number;
  fiber: number;
  rush: number;
  tier1Qty: number;
  tier1Pct: number;
  tier2Qty: number;
  tier2Pct: number;
};

export type Plan = {
  id: string;
  name: string;
  prefix: string;
  price: number;
  unit: string;
  features: string[];
  highlight: boolean;
};

export type SiteData = {
  settings: Settings;
  yerbas: Yerba[];
  products: Product[];
  categories: Category[];
  laser: { pricing: LaserPricing; plans: Plan[] };
  images: Partial<Record<ImageKey, string>>;
  updatedAt?: number;
};

/* ------------------------------------------------------------------ */
/* utilidades                                                         */
/* ------------------------------------------------------------------ */

export const defaultImages: Record<ImageKey, string> = {
  hero: heroImg,
  grabado: grabadoImg,
  mates: matesImg,
  termos: termoImg,
  canastas: canastaImg,
};

export const DEFAULT_PIN = "1234";

/** Hash simple (cyrb53). Es una barrera de acceso, no seguridad real: el sitio es estático. */
export function hashPin(s: string) {
  const str = "cebador::" + s;
  let h1 = 0xdeadbeef ^ 7;
  let h2 = 0x41c6ce57 ^ 7;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}${Date.now().toString(36).slice(-3)}`;
}

export function laserUnitPrice(
  p: LaserPricing,
  o: { chars: number; icon: boolean; sub: boolean; twoSides: boolean; fiber: boolean; rush: boolean; qty: number },
) {
  let unit = p.base;
  if (o.chars > p.includedChars) unit += (o.chars - p.includedChars) * p.perExtraChar;
  if (o.icon) unit += p.icon;
  if (o.sub) unit += p.sub;
  if (o.twoSides) unit += p.twoSides;
  if (o.fiber) unit += p.fiber;
  if (o.rush) unit += p.rush;
  let discount = 0;
  if (o.qty >= p.tier2Qty) discount = p.tier2Pct / 100;
  else if (o.qty >= p.tier1Qty) discount = p.tier1Pct / 100;
  const withDisc = Math.round(unit * (1 - discount));
  return { unit: withDisc, total: withDisc * o.qty, discount };
}

/* ------------------------------------------------------------------ */
/* valores iniciales                                                  */
/* ------------------------------------------------------------------ */

export function makeDefaults(): SiteData {
  return {
    settings: {
      whatsapp: "59899000000",
      whatsappDisplay: "+598 99 000 000",
      email: "hola@elcebador.uy",
      laserEmail: "taller@elcebador.uy",
      address: "Yi 1385 esq. 18 de Julio · Montevideo",
      hours: "Lun a Vie 9:30 – 19:00 · Sáb 10:00 – 16:00",
      freeShipping: 15000,
      featuredYerbaId: "canarias",
      pinHash: hashPin(DEFAULT_PIN),
    },
    yerbas: seedYerbas.map((y) => ({ ...y, notes: [...y.notes], status: "active" as Status })),
    products: [
      {
        id: "p-mate-algarrobo",
        category: "mates",
        name: "Mate de algarrobo tallado",
        sub: "Virola de alpaca · 220 ml",
        price: 8900,
        status: "active",
        grabable: true,
      },
      {
        id: "p-termo-1l",
        category: "termos",
        name: "Termo acero 1 L pico cebador",
        sub: "Doble pared · 24 h frío / 12 h calor",
        price: 24500,
        status: "active",
        grabable: true,
      },
      {
        id: "p-canasta-cuero",
        category: "canastas",
        name: "Canasta matera de cuero",
        sub: "Cuero vacuno curtido vegetal",
        price: 32000,
        status: "active",
        grabable: true,
      },
    ],
    categories: categoryData.map((c) => ({
      id: c.id as CatId,
      label: c.label,
      title: c.title,
      lede: c.lede,
      priceFrom: c.priceFrom,
      specs: c.specs.map((s) => ({ ...s })),
      bullets: [...c.bullets],
      ringStats: c.ringStats.map((s) => ({ ...s })),
    })),
    laser: {
      pricing: {
        base: 4900,
        includedChars: 12,
        perExtraChar: 180,
        icon: 900,
        sub: 1400,
        twoSides: 3200,
        fiber: 1600,
        rush: 2500,
        tier1Qty: 10,
        tier1Pct: 15,
        tier2Qty: 25,
        tier2Pct: 30,
      },
      plans: seedPlans.map((p, i) => ({
        id: `plan-${i}`,
        name: p.name,
        prefix: p.prefix,
        price: p.price,
        unit: p.unit,
        features: [...p.features],
        highlight: p.highlight,
      })),
    },
    images: {},
  };
}

/** Mezcla lo guardado con los valores iniciales (por si faltan campos de versiones anteriores). */
export function normalize(raw: unknown): SiteData {
  const d = makeDefaults();
  if (!raw || typeof raw !== "object") return d;
  const s = raw as Partial<SiteData>;
  const plans = s.laser?.plans;
  return {
    settings: { ...d.settings, ...(s.settings ?? {}) },
    yerbas: Array.isArray(s.yerbas) ? s.yerbas : d.yerbas,
    products: Array.isArray(s.products) ? s.products : d.products,
    categories: d.categories.map((c) => ({
      ...c,
      ...(Array.isArray(s.categories) ? (s.categories.find((x) => x?.id === c.id) ?? {}) : {}),
    })),
    laser: {
      pricing: { ...d.laser.pricing, ...(s.laser?.pricing ?? {}) },
      plans: Array.isArray(plans) ? plans : d.laser.plans,
    },
    images: s.images && typeof s.images === "object" ? s.images : {},
    updatedAt: typeof s.updatedAt === "number" ? s.updatedAt : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* contexto                                                           */
/* ------------------------------------------------------------------ */

const KEY = "elcebador.site.v1";

function load(): SiteData {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : makeDefaults();
  } catch {
    return makeDefaults();
  }
}

type Store = {
  data: SiteData;
  update: (fn: (d: SiteData) => SiteData) => void;
  replaceAll: (d: unknown) => void;
  reset: () => void;
  img: (k: ImageKey) => string;
  saveError: boolean;
};

const Ctx = createContext<Store | null>(null);

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite fuera de StoreProvider");
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(load);
  const [saveError, setSaveError] = useState(false);
  const touched = useRef(false);
  const latest = useRef(data);

  useEffect(() => {
    latest.current = data;
  }, [data]);

  // guarda con un pequeño retardo (agrupa tecleos rápidos)
  useEffect(() => {
    if (!touched.current) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(data));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [data]);

  // guarda al cerrar la pestaña y sincroniza entre pestañas
  useEffect(() => {
    const flush = () => {
      if (!touched.current) return;
      try {
        window.localStorage.setItem(KEY, JSON.stringify(latest.current));
      } catch {
        /* sin espacio: se avisa desde el panel */
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setData(load());
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const update = useCallback((fn: (d: SiteData) => SiteData) => {
    touched.current = true;
    setData((prev) => ({ ...fn(prev), updatedAt: Date.now() }));
  }, []);

  const replaceAll = useCallback((raw: unknown) => {
    touched.current = true;
    setData({ ...normalize(raw), updatedAt: Date.now() });
  }, []);

  const reset = useCallback(() => {
    touched.current = false;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* nada */
    }
    setSaveError(false);
    setData(makeDefaults());
  }, []);

  const img = useCallback((k: ImageKey) => data.images[k] || defaultImages[k], [data.images]);

  const value = useMemo(
    () => ({ data, update, replaceAll, reset, img, saveError }),
    [data, update, replaceAll, reset, img, saveError],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
