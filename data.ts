export type Status = "active" | "soldout" | "hidden";

export type Yerba = {
  id: string;
  brand: string;
  name: string;
  origin: string;
  cut: string;
  type: "Tradicional" | "Con palo" | "Orgánica" | "Compuesta" | "Despalada";
  intensity: 1 | 2 | 3 | 4 | 5;
  aging: string;
  notes: string[];
  price: number;
  weight: string;
  hue: number;
  badge?: string;
  /** Foto propia (dataURL o enlace). Si falta, se usa la etiqueta ilustrada. */
  image?: string;
  /** En venta por defecto. */
  status?: Status;
};

export const yerbas: Yerba[] = [
  {
    id: "canarias",
    brand: "Canarias",
    name: "Canarias Especial",
    origin: "Misiones, Argentina · elaborada para Uruguay",
    cut: "Molienda fina, bajo contenido de palo",
    type: "Tradicional",
    intensity: 5,
    aging: "Estacionamiento natural 12 meses",
    notes: ["Amarga y persistente", "Cuerpo denso", "Rinde 25+ cebadas"],
    price: 12900,
    weight: "1 kg",
    hue: 0,
    badge: "La más vendida",
  },
  {
    id: "playadito",
    brand: "Playadito",
    name: "Playadito Tradicional",
    origin: "Gobernador Virasoro, Corrientes",
    cut: "Molienda equilibrada",
    type: "Con palo",
    intensity: 3,
    aging: "8 meses en depósito",
    notes: ["Suave y dulce", "Ideal para empezar", "Aroma a hierba fresca"],
    price: 9400,
    weight: "1 kg",
    hue: -22,
  },
  {
    id: "rosamonte",
    brand: "Rosamonte",
    name: "Rosamonte Selección Especial",
    origin: "Apóstoles, Misiones",
    cut: "Despalada, hoja gruesa",
    type: "Despalada",
    intensity: 5,
    aging: "18 meses, estacionamiento lento",
    notes: ["Intensa y ahumada", "Notas de tabaco rubio", "Carácter gaucho"],
    price: 13600,
    weight: "1 kg",
    hue: 18,
    badge: "Edición limitada",
  },
  {
    id: "taragui",
    brand: "Taragüí",
    name: "Taragüí Vitality",
    origin: "Santo Tomé, Corrientes",
    cut: "Con palo, molienda media",
    type: "Con palo",
    intensity: 2,
    aging: "6 meses",
    notes: ["Liviana", "Bajo polvo", "Perfecta para tereré"],
    price: 8700,
    weight: "1 kg",
    hue: -40,
  },
  {
    id: "amanda",
    brand: "Amanda",
    name: "Amanda Menta & Poleo",
    origin: "La Cachuera, Misiones",
    cut: "Compuesta con hierbas",
    type: "Compuesta",
    intensity: 3,
    aging: "9 meses",
    notes: ["Fresca y mentolada", "Digestiva", "Rinde mucho"],
    price: 9900,
    weight: "500 g",
    hue: -60,
  },
  {
    id: "kraus",
    brand: "Kraus",
    name: "Kraus Agroecológica",
    origin: "San Ignacio, Misiones",
    cut: "Sin humo, secado barbacuá-free",
    type: "Orgánica",
    intensity: 3,
    aging: "10 meses",
    notes: ["Certificación orgánica", "Sin humo", "Sabor limpio y herbal"],
    price: 11200,
    weight: "500 g",
    hue: 34,
    badge: "Orgánica",
  },
  {
    id: "cbse",
    brand: "CBSé",
    name: "CBSé Guarana",
    origin: "Santa Ana, Misiones",
    cut: "Compuesta energizante",
    type: "Compuesta",
    intensity: 4,
    aging: "7 meses",
    notes: ["Energía extra", "Toque cítrico", "Para mate dulce"],
    price: 8300,
    weight: "500 g",
    hue: -80,
  },
  {
    id: "tranquera",
    brand: "La Tranquera",
    name: "La Tranquera Premium",
    origin: "Caa Yarí, Misiones",
    cut: "Hoja seleccionada a mano",
    type: "Tradicional",
    intensity: 4,
    aging: "14 meses",
    notes: ["Redonda y amarga", "Poco polvo", "Clásica uruguaya"],
    price: 12400,
    weight: "1 kg",
    hue: 12,
  },
];

export const marqueeBrands = [
  "Canarias",
  "Playadito",
  "Rosamonte",
  "Taragüí",
  "Amanda",
  "La Tranquera",
  "CBSé",
  "Kraus",
  "Unión",
  "Nobleza Gaucha",
  "Piporé",
  "Romance",
  "Tucanguá",
  "Serenito",
];

export type RitualStep = {
  n: string;
  title: string;
  kicker: string;
  body: string;
  tip: string;
};

export const ritualSteps: RitualStep[] = [
  {
    n: "01",
    title: "El agua, a 75°",
    kicker: "Temperatura",
    body: "Nunca hiervas el agua. A los 100 °C quemás la hoja y el mate se vuelve amargo y astringente. Apagá el fuego cuando el fondo de la pava empieza a sonar y aparecen las primeras burbujas chicas.",
    tip: "75 °C exactos · pava con termómetro recomendada",
  },
  {
    n: "02",
    title: "Tres cuartos de yerba",
    kicker: "Carga",
    body: "Llená el mate hasta las tres cuartas partes. Tapá con la mano, invertí y sacudí tres veces para que el polvo suba y la hoja gruesa quede abajo: eso evita que la bombilla se tape.",
    tip: "75 % del volumen · montañita inclinada de 45°",
  },
  {
    n: "03",
    title: "Agua por el costado",
    kicker: "Cebado",
    body: "Volcá el agua siempre contra la pared del mate, nunca sobre la yerba seca del centro. La montañita se hidrata de a poco y el sabor dura parejo durante toda la ronda.",
    tip: "Cebá siempre en el mismo punto · cuidá el seco",
  },
  {
    n: "04",
    title: "La ronda no se corta",
    kicker: "Ritual",
    body: "El mate se comparte y vuelve al cebador. Nadie lo revuelve con la bombilla, nadie le agrega azúcar si la ronda es amarga. Cuando suena a hueco, el mate está lavado: es hora de cambiarlo.",
    tip: "Un buen mate rinde entre 25 y 30 cebadas",
  },
];

export type RingItem = {
  kind: "image" | "spec";
  category: "Mates" | "Termos" | "Canastas";
  title: string;
  sub: string;
  image?: string;
  stats?: { k: string; v: string }[];
  price?: string;
};

export const categoryData = [
  {
    id: "mates",
    label: "Mates",
    title: "Mates artesanales",
    lede: "Tallados a mano en algarrobo, calabaza curada, vidrio templado y cerámica esmaltada. Cada pieza tiene su virola, su peso y su manera de tomar el mate.",
    image: "mates",
    priceFrom: 6900,
    ringStats: [
      { k: "Capacidad", v: "150 – 380 ml" },
      { k: "Materiales", v: "Calabaza · madera · vidrio" },
      { k: "Virola", v: "Alpaca, acero o cuero" },
      { k: "Curado", v: "Incluido" },
      { k: "Grabado", v: "Láser CO₂ opcional" },
    ],
    specs: [
      { k: "Capacidad", v: "150 – 380 ml" },
      { k: "Materiales", v: "Calabaza · Algarrobo · Vidrio · Cerámica · Asta" },
      { k: "Virola", v: "Alpaca, acero inox o cuero cosido" },
      { k: "Curado", v: "Incluido en calabaza y madera" },
      { k: "Grabado", v: "Láser CO₂ sobre la panza o la virola" },
    ],
    bullets: [
      "Calabaza curada: toma el sabor y lo devuelve redondo.",
      "Algarrobo tallado: indestructible, ideal para viaje.",
      "Vidrio con base de corcho: se ve el lavado, se lava fácil.",
      "Asta y guampa: tradición del litoral, pieza única.",
    ],
  },
  {
    id: "termos",
    label: "Termos",
    title: "Termos y pavas cebadoras",
    lede: "Acero inoxidable 304 de doble pared con vacío real. El pico cebador corta el chorro fino, ese que no desarma la montañita.",
    image: "termo",
    priceFrom: 24500,
    ringStats: [
      { k: "Capacidades", v: "0,75 · 1 · 1,2 · 1,5 L" },
      { k: "Interior", v: "Acero inox 304" },
      { k: "Pico", v: "Cebador de corte fino" },
      { k: "Garantía", v: "5 años de vacío" },
      { k: "Grabado", v: "Láser de fibra permanente" },
    ],
    specs: [
      { k: "Capacidades", v: "0,75 L · 1 L · 1,2 L · 1,5 L" },
      { k: "Retención", v: "24 h frío · 12 h caliente" },
      { k: "Interior", v: "Acero 304 sin revestimiento" },
      { k: "Pico", v: "Cebador de corte fino o tapón rosca" },
      { k: "Grabado", v: "Láser de fibra sobre acero, negro permanente" },
    ],
    bullets: [
      "Pico cebador: el chorro sale fino y sin salpicar.",
      "Base antideslizante de goma silenciosa.",
      "Garantía oficial de 5 años contra pérdida de vacío.",
      "Grabado de nombre, club, empresa o escudo familiar.",
    ],
  },
  {
    id: "canastas",
    label: "Canastas materas",
    title: "Canastas materas de cuero",
    lede: "Cuero vacuno curtido a vegetal, cosido a máquina y remachado a mano. Todo el equipo viaja adentro, ordenado y sin ruidos.",
    image: "canasta",
    priceFrom: 32000,
    ringStats: [
      { k: "Material", v: "Cuero 2,4 mm" },
      { k: "Entra", v: "Mate + termo + yerbera" },
      { k: "Herrajes", v: "Bronce o níquel negro" },
      { k: "Correa", v: "Regulable 90 – 140 cm" },
      { k: "Grabado", v: "Iniciales quemadas" },
    ],
    specs: [
      { k: "Material", v: "Cuero vacuno 2,4 mm curtido vegetal" },
      { k: "Capacidad", v: "Mate + termo 1 L + yerbera + azucarera" },
      { k: "Herrajes", v: "Bronce macizo o níquel negro" },
      { k: "Correa", v: "Regulable 90 – 140 cm, desmontable" },
      { k: "Grabado", v: "Iniciales quemadas a láser en la tapa" },
    ],
    bullets: [
      "Forro interno desmontable y lavable.",
      "Compartimento acolchado para el termo.",
      "Yerbera de boca ancha con tapa hermética.",
      "Personalizable: iniciales, escudo o fecha.",
    ],
  },
];

export const laserSpecs = [
  { k: "Equipos", v: "CO₂ 60 W · Fibra 30 W MOPA" },
  { k: "Área de trabajo", v: "400 × 400 mm (CO₂) · 175 × 175 mm (fibra)" },
  { k: "Resolución", v: "Hasta 1200 DPI reales" },
  { k: "Precisión", v: "± 0,05 mm de tolerancia" },
  { k: "Profundidad", v: "0,1 – 1,2 mm según material" },
  { k: "Archivos", v: "AI · SVG · PDF vector · PNG 600 DPI" },
  { k: "Entrega", v: "24 – 48 h hábiles" },
  { k: "Mínimo", v: "1 unidad (sin cargo por matriz)" },
];

export const laserMaterials = [
  { name: "Madera (algarrobo, nogal, guatambú)", ok: true, note: "Grabado profundo, color caramelo" },
  { name: "Cuero vacuno y sintético PU", ok: true, note: "Quemado marrón, relieve táctil" },
  { name: "Acero inoxidable", ok: true, note: "Marca negra permanente con fibra" },
  { name: "Aluminio anodizado", ok: true, note: "Revela el metal en blanco" },
  { name: "Vidrio y cristal", ok: true, note: "Efecto esmerilado satinado" },
  { name: "Acrílico fundido", ok: true, note: "Blanco mate, bordes pulidos" },
  { name: "PVC y vinilo clorado", ok: false, note: "Libera gas cloro: no se graba" },
  { name: "Policarbonato", ok: false, note: "Se quema y amarillea" },
];

export const laserProcess = [
  { n: "01", t: "Mandás tu idea", d: "Texto, logo o dibujo por WhatsApp o mail. Lo vectorizamos sin costo." },
  { n: "02", t: "Previsualización", d: "Recibís una maqueta digital sobre la pieza real antes de aprobar." },
  { n: "03", t: "Prueba en material", d: "Calibramos potencia y velocidad según la partida del material." },
  { n: "04", t: "Grabado y entrega", d: "Se graba, se limpia, se controla y se entrega en 24 – 48 h." },
];

export const laserPlans = [
  {
    name: "Simple",
    price: 4900,
    prefix: "",
    unit: "por pieza",
    features: ["Texto de hasta 12 caracteres", "Una tipografía del catálogo", "Ubicación única", "Entrega 48 h"],
    highlight: false,
  },
  {
    name: "Personalizado",
    price: 9400,
    prefix: "",
    unit: "por pieza",
    features: [
      "Texto + isotipo o escudo",
      "Vectorización incluida",
      "Grabado en dos caras",
      "Prueba en material",
      "Entrega 24 h",
    ],
    highlight: true,
  },
  {
    name: "Corporativo",
    price: 3200,
    prefix: "Desde",
    unit: "por pieza · mín. 25",
    features: ["Logo propio en alta resolución", "Producción por lotes", "Packaging individual", "Factura A"],
    highlight: false,
  },
];

export const laserFaq = [
  {
    q: "¿Se puede grabar un mate ya comprado en otro lado?",
    a: "Sí, siempre que el material sea grabable (madera, calabaza, cuero, acero, vidrio) y la superficie sea accesible al cabezal. Traelo por el local y lo evaluamos en el momento.",
  },
  {
    q: "¿El grabado se va con el agua caliente?",
    a: "No. El láser quema o remueve material: es permanente. En mates de madera conviene igual curar y secar bien la pieza para cuidar el acabado.",
  },
  {
    q: "¿Puedo mandar un logo con muchos detalles?",
    a: "Podés. Trabajamos a 1200 DPI y 0,05 mm de precisión, pero si el trazo es menor a 0,4 mm sugerimos simplificarlo para que no se empaste en madera.",
  },
  {
    q: "¿Hacen envíos al interior?",
    a: "Sí, despachamos a todo el país en 24 – 72 h con embalaje rígido y seguimiento. El grabado se protege con film y papel madera.",
  },
];

export const stats = [
  { v: "26", l: "años cebando" },
  { v: "14", l: "marcas de yerba" },
  { v: "1200", l: "DPI de grabado" },
  { v: "9.400+", l: "piezas grabadas" },
];
