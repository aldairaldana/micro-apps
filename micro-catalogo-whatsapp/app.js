/**
 * TIENDAZAP STUDIO — SISTEMA INTEGRAL DEL COMERCIO & CATÁLOGO DIGITAL WHATSAPP
 * Mobile-First Seller Workspace: Administrador Profesional + Asistente Guiado Paso a Paso + Módulo de Cobros Yape/Plin.
 * Incluye carga y compresión de QR de Yape del vendedor, carga de comprobante de pago por el comprador,
 * generación de mensajes con resumen completo y ticket digital de confirmación.
 */

// ============================================================================
// 0. UTILIDAD DE SANITIZACIÓN (PREVENCIÓN DE XSS)
// ============================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 0.1 CONFIGURACIÓN CENTRALIZADA DE MARCA (APP_BRAND) & SLUGIFY
// ============================================================================
const APP_BRAND = {
  name: "TiendaZap",
  suffix: "Studio",
  domainHint: "tiendazap.pages.dev"
};

function slugifyStoreName(name) {
  if (!name) return "tienda";
  return name
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tienda";
}

function getStoreInitials(name) {
  if (!name || typeof name !== "string") return "TZ";
  const clean = name.trim();
  if (!clean) return "TZ";
  const words = clean.split(/[\s_\-]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  const upperMatches = clean.match(/[A-Z]/g);
  if (upperMatches && upperMatches.length >= 2) {
    return (upperMatches[0] + upperMatches[1]).toUpperCase();
  }
  const lower = clean.toLowerCase();
  const commonPrefixes = [
    "oscar", "carlos", "juan", "luis", "pedro", "jorge", "diego", "mario",
    "victor", "cesar", "david", "jose", "maria", "ana", "alex", "hugo",
    "tienda", "store", "shop", "moda", "zap", "urban", "mega", "super"
  ];
  for (const p of commonPrefixes) {
    if (lower.startsWith(p) && lower.length > p.length) {
      return (p[0] + lower[p.length]).toUpperCase();
    }
  }
  return clean.slice(0, 2).toUpperCase();
}

function getStoreInitialsAvatar(name, bgColor = "#1e293b", textColor = "#f8fafc", size = 120) {
  const initials = getStoreInitials(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="${bgColor}"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="${Math.round(size * 0.42)}px" letter-spacing="0.5px">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getEffectiveStoreLogo(shopConfig) {
  const cfg = shopConfig || (typeof AppState !== "undefined" ? AppState.shopConfig : {}) || {};
  const url = cfg.logoUrl;
  if (!url || typeof url !== "string" || !url.trim() || url.includes("photo-1568901346375-23c9450c58cd")) {
    return getStoreInitialsAvatar(cfg.name || "Mi Tienda");
  }
  return url;
}

const NICHE_DEFAULT_TAGLINES = {
  sneakers: "Las mejores zapatillas urbanas y deportivas con envíos a todo el Perú 👟",
  fashion: "Moda, prendas exclusivas y tendencias con envíos a todo el país ✨",
  tech: "Licencias originales de software con activación inmediata y soporte ⚡💻",
  beauty: "Perfumes y cosméticos de alta calidad 100% garantizados 💄",
  watches: "Relojes y joyería fina con garantía y envíos seguros ⌚",
  food: "Comida deliciosa y postres preparados al momento directo a tu mesa 🍔",
  vehicles: "Venta de autos seminuevos garantizados y trato directo 🚗",
  general: "Tu catálogo digital de confianza con envíos rápidos y garantía 🛍️"
};

const NICHE_DEFAULT_PROD_CATS = {
  sneakers: "Zapatillas",
  fashion: "Ropa & Moda",
  tech: "Licencias & Software",
  beauty: "Perfumes & Belleza",
  watches: "Relojes",
  food: "Platos & Postres",
  vehicles: "Vehículos",
  general: "General"
};

// ============================================================================
// 0. MEDIASTORE (INDEXEDDB WRAPPER PARA FOTOS Y VIDEOS LOCALES EN EL CELULAR)
// ============================================================================
const MediaStore = {
  dbName: "TiendaZapMediaDB",
  storeName: "media",
  db: null,

  async init() {
    if (this.db) return this.db;
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      try {
        const req = indexedDB.open(this.dbName, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  },

  async saveMedia(key, fileOrBlob) {
    const db = await this.init();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.put(fileOrBlob, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  },

  async getMedia(key) {
    const db = await this.init();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  },

  async deleteMedia(key) {
    const db = await this.init();
    if (!db) return;
    try {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).delete(key);
    } catch (err) {}
  },

  async resolveVideoUrl(videoUrl) {
    if (!videoUrl) return "";
    const clean = String(videoUrl).trim();
    if (clean.startsWith("idb://")) {
      const key = clean.slice(6);
      try {
        const blobOrFile = await this.getMedia(key);
        if (blobOrFile) {
          return URL.createObjectURL(blobOrFile);
        }
      } catch (e) {
        console.warn("No se pudo resolver video desde MediaStore:", e);
      }
      return "";
    }
    return clean;
  }
};

// ============================================================================
// 1. PLANTILLAS DE NEGOCIOS REALES EN PERÚ (1 CLIC)
// ============================================================================
// ============================================================================
// 0. ESQUEMAS Y FICHAS TÉCNICAS MARKETPLACE (VEHÍCULOS, DIGITAL, ARTÍCULOS, INMUEBLES)
// ============================================================================
const MARKETPLACE_SCHEMAS = {
  item: {
    label: "Artículo Físico",
    icon: "🛍️",
    fields: [
      { id: "brand", label: "Marca", type: "text", placeholder: "Ej: Nike, Apple, Sony, Zara" },
      { id: "condition", label: "Condición", type: "select", options: ["Nuevo", "Usado - Como Nuevo", "Usado - Buen Estado", "Reacondicionado"] },
      { id: "warranty", label: "Garantía", type: "text", placeholder: "Ej: 12 meses oficial de fábrica" },
      { id: "location", label: "Ubicación / Distrito", type: "text", placeholder: "Ej: Lima / Miraflores / Envíos a todo el país" }
    ]
  },
  vehicle: {
    label: "Vehículo / Automotor",
    icon: "🚗",
    fields: [
      { id: "brandModel", label: "Marca y Modelo", type: "text", placeholder: "Ej: Changan CS55 Plus, Toyota Corolla" },
      { id: "year", label: "Año de Fabricación", type: "text", placeholder: "Ej: 2026, 2025" },
      { id: "mileage", label: "Kilometraje (km)", type: "text", placeholder: "Ej: 0 km (Nuevo), 14,500 km" },
      { id: "transmission", label: "Transmisión", type: "select", options: ["Automática / Secuencial", "Mecánica / Manual", "CVT / e-CVT"] },
      { id: "fuel", label: "Combustible", type: "select", options: ["Gasolina", "Dual GNV", "Dual GLP", "Diésel", "Híbrido / Eléctrico"] },
      { id: "engine", label: "Motor / Cilindrada", type: "text", placeholder: "Ej: 1.5L Turbo 185 HP, 1.8L Hybrid" },
      { id: "location", label: "Ubicación / Distrito", type: "text", placeholder: "Ej: Lima / Surco / San Isidro" }
    ]
  },
  digital: {
    label: "Digital / Licencia",
    icon: "⚡",
    fields: [
      { id: "duration", label: "Duración de Licencia", type: "select", options: ["1 Mes", "3 Meses", "6 Meses", "1 Año", "Permanente / Lifetime"] },
      { id: "devices", label: "Dispositivos simultáneos", type: "select", options: ["1 Dispositivo", "2 Dispositivos", "3 a 5 Dispositivos", "Ilimitado"] },
      { id: "activation", label: "Modalidad de Activación", type: "select", options: ["Activación con correo personal", "Clave alfanumérica original (Key)", "Perfil privado garantizado", "Invitación a equipo"] },
      { id: "deliveryTime", label: "Tipo de Entrega", type: "text", placeholder: "Ej: Entrega inmediata en 5 min vía WhatsApp / Correo" }
    ]
  },
  property: {
    label: "Inmueble / Alquiler",
    icon: "🏠",
    fields: [
      { id: "propType", label: "Tipo de Inmueble", type: "select", options: ["Departamento", "Casa", "Oficina", "Local Comercial", "Terreno / Lote"] },
      { id: "area", label: "Área Total (m²)", type: "text", placeholder: "Ej: 85 m², 120 m²" },
      { id: "roomsBaths", label: "Habitaciones / Baños", type: "text", placeholder: "Ej: 3 Hab • 2 Baños" },
      { id: "modality", label: "Modalidad", type: "select", options: ["Venta", "Alquiler Mensual", "Alquiler Temporal"] },
      { id: "location", label: "Ubicación / Distrito", type: "text", placeholder: "Ej: Miraflores, Lima" }
    ]
  }
};

const BUSINESS_PRESETS = {
  vehicles: {
    config: {
      name: "AutoMarket Perú",
      storeSlug: "automarket-peru",
      tagline: "Venta de autos, camionetas SUV y vehículos seminuevos garantizados 🚗🔑",
      phone: "51987654321",
      currency: "US$",
      deliveryCost: 0.0,
      deliveryTime: "Coordinar visita",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: false,
      yapePhone: "",
      yapeName: "",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "veh-01",
        sku: "CS55-PLUS-2026",
        name: "Changan CS55 Plus MAX 1.5T 2026",
        category: "Camionetas SUV",
        price: 18490.00,
        currency: "US$",
        listingType: "vehicle",
        condition: "Nuevo - 0 km",
        location: "Lima, Surco",
        desc: "SUV de última generación con motor Blue Core 1.5L Turbo de 185 HP, transmisión DCT 7 velocidades, sunroof panorámico, pantalla dual 10.25 pulgadas y suite de seguridad ADAS.",
        img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80"
        ],
        videoUrl: "",
        sizes: ["Entrega Inmediata", "A pedido"],
        colors: ["Gris Titanio", "Blanco Glaciar", "Negro Noche"],
        promo: true,
        specs: [
          { label: "Marca y Modelo", value: "Changan CS55 Plus MAX" },
          { label: "Año", value: "2026" },
          { label: "Kilometraje", value: "0 km (Nuevo)" },
          { label: "Transmisión", value: "Automática DCT 7 vel." },
          { label: "Combustible", value: "Gasolina 95 oct" },
          { label: "Motor", value: "1.5L Turbo 185 HP" },
          { label: "Ubicación", value: "Surco, Lima" }
        ]
      },
      {
        id: "veh-02",
        sku: "TOY-COROLLA-HYB",
        name: "Toyota Corolla Hybrid 1.8 SEG 2024",
        category: "Autos Sedán",
        price: 19800.00,
        currency: "US$",
        listingType: "vehicle",
        condition: "Usado - Como Nuevo",
        location: "Miraflores, Lima",
        desc: "Sedán híbrido auto-recargable impecable, récord de mantenimiento en concesionario oficial Toyota, consumo ultra económico de hasta 75 km/galón.",
        img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80"
        ],
        videoUrl: "",
        sizes: ["Única Unidad"],
        colors: ["Plata Metálico"],
        promo: false,
        specs: [
          { label: "Marca y Modelo", value: "Toyota Corolla Hybrid SEG" },
          { label: "Año", value: "2024" },
          { label: "Kilometraje", value: "14,200 km" },
          { label: "Transmisión", value: "Automática e-CVT" },
          { label: "Combustible", value: "Híbrido (Gasolina + Eléctrico)" },
          { label: "Motor", value: "1.8L Hybrid Synergy" },
          { label: "Ubicación", value: "Miraflores, Lima" }
        ]
      }
    ]
  },

  sneakers: {
    config: {
      name: "Sneakers Lima Club",
      storeSlug: "sneakers-lima",
      tagline: "Zapatillas exclusivas 100% originales, streetwear y envíos a todo el Perú 👟🔥",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 10.0,
      deliveryTime: "24-48 hrs",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Sneakers Lima Club SAC",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "snk-01",
        sku: "NK-DUNK-01",
        name: "Nike Dunk Low Retro Panda",
        category: "Urbano & Streetwear",
        price: 489.00,
        desc: "El ícono streetwear por excelencia. Cuero premium blanco y negro, suela de goma con tracción duradera y lengüeta acolchada.",
        img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["38", "39", "40", "41", "42", "43 (+S/ 30)"],
        colors: ["Black / White"],
        promo: true,
        available: true
      },
      {
        id: "snk-02",
        sku: "ADI-SAMBA-02",
        name: "Adidas Samba OG Cloud White",
        category: "Urbano & Streetwear",
        price: 429.00,
        desc: "Silueta clásica atemporal con puntera en T de gamuza, capellada de cuero suave y la mítica suela de goma caramelo.",
        img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["38", "39", "40", "41", "42"],
        colors: ["Cloud White / Core Black Gum"],
        promo: false,
        available: true
      },
      {
        id: "snk-03",
        sku: "NB-550-03",
        name: "New Balance 550 White Grey",
        category: "Edición Limitada",
        price: 469.00,
        desc: "Homenaje al básquetbol retro de los 80. Construcción en cuero microperforado de alta densidad y amortiguación EVA.",
        img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["39", "40", "41", "42 (+S/ 25)"],
        colors: ["White / Grey Leather"],
        promo: true,
        available: true
      }
    ]
  },
  beauty: {
    config: {
      name: "Aroma & Glamour Perú",
      storeSlug: "aroma-glamour",
      tagline: "Perfumería fina de diseñador, decants originales y cosmética árabe ✨🇵🇪",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 8.0,
      deliveryTime: "Envíos en 24h",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Aroma & Glamour",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "bea-01",
        sku: "ARMAF-CDN-01",
        name: "Club de Nuit Intense Man (Armaf)",
        category: "Perfumes Árabes",
        price: 75.00,
        desc: "La bestia negra de la perfumería árabe. Salida cítrica ahumada de piña, abedul y pachulí de duración nuclear (+10 horas).",
        img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Decant 10ml", "Frasco 105ml (+S/ 120)"],
        colors: ["Amaderado Especiado Cítrico"],
        promo: true,
        available: true
      },
      {
        id: "bea-02",
        sku: "YSL-LIB-02",
        name: "YSL Libre Eau De Parfum",
        category: "Perfumes Dama",
        price: 89.00,
        desc: "Flor de lavanda francesa combinada con la sensualidad del azahar de Marruecos. Sofisticado, elegante y de alta proyección.",
        img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Decant 10ml", "Frasco 50ml (+S/ 260)", "Frasco 90ml (+S/ 380)"],
        colors: ["Floral Lavanda Cálido"],
        promo: false,
        available: true
      },
      {
        id: "bea-03",
        sku: "DIOR-SAU-03",
        name: "Dior Sauvage Elixir",
        category: "Perfumes Caballero",
        price: 99.00,
        desc: "Concentración extrema con notas de pomelo fresco, canela, nuez moscada y una rica base de lavanda nocturna y maderas.",
        img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Decant 10ml", "Frasco 60ml (+S/ 360)"],
        colors: ["Especiado Oriental Magnético"],
        promo: true,
        available: true
      }
    ]
  },
  watches: {
    config: {
      name: "Flores & Joyas Vanesa",
      storeSlug: "flores-vanesa",
      tagline: "Arreglos florales prémium, rosas eternas, joyería fina y detalles exclusivos 💐✨",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 10.0,
      deliveryTime: "Envíos 24-48h",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Flores Vanesa SAC",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "wat-01",
        sku: "FLOR-01",
        name: "Ramo Premium 24 Rosas Rojas + Follaje Fino",
        category: "Ramos & Flores",
        price: 120.00,
        desc: "Rosas ecuatorianas de tallo largo seleccionadas una a una, envueltas en papel coreano de lujo y lazo de satén.",
        img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Ramo 24 Rosas", "Ramo Gigante 50 Rosas (+S/ 110)"],
        colors: ["Rojo Pasión", "Rosa Pastel", "Blanco Puro"],
        promo: true,
        available: true
      },
      {
        id: "wat-02",
        sku: "BOX-FLOR-02",
        name: "Box Cilindro Rosa Eterna & Cadena Plata 925",
        category: "Boxes de Regalo",
        price: 145.00,
        desc: "Rosa natural preservada de hasta 3 años de duración en cúpula con gaveta secreta y collar corazón de plata italiana.",
        img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Caja Clásica", "Caja Deluxe con Bombones (+S/ 35)"],
        colors: ["Rosa Roja / Plata", "Rosa Azul / Plata"],
        promo: true,
        available: true
      },
      {
        id: "wat-03",
        sku: "SEIKO-5-03",
        name: "Seiko 5 Sports Automático Edición Joya",
        category: "Relojes Automáticos",
        price: 890.00,
        desc: "Calibre 4R36 automático con 41 horas de reserva de marcha, fechador bilingüe, cristal Hardlex y resistencia al agua 100m.",
        img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Caja 42.5mm"],
        colors: ["Bisel Negro / Acero", "Bisel Azul / Jubilee (+S/ 40)"],
        promo: false,
        available: true
      }
    ]
  },
  fashion: {
    config: {
      name: "Urban Jeans & Moda",
      storeSlug: "urban-jeans",
      tagline: "Pantalones cargo, jeans wide leg, casacas y outfits en tendencia 👖✨",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 8.0,
      deliveryTime: "Envíos en 24-48h",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Urban Moda Perú",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "fas-01",
        sku: "CARGO-WL-01",
        name: "Pantalón Cargo Wide Leg Baggy",
        category: "Pantalones & Jeans",
        price: 89.00,
        desc: "Denim rígido 100% algodón de 12 oz, corte amplio ultra holgado con 6 bolsillos utilitarios y cordón ajustable en tobillos.",
        img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["28", "30", "32", "34"],
        colors: ["Negro Washed", "Beige Safari", "Verde Militar"],
        promo: true,
        available: true
      },
      {
        id: "fas-02",
        sku: "CSK-DNM-02",
        name: "Casaca Oversize Denim Vintage",
        category: "Casacas",
        price: 129.00,
        desc: "Casaca jean estilo retro años 90 con forro interno suave, botones metálicos grabados y lavado artesanal con efecto desgastado.",
        img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["S", "M", "L", "XL (+S/ 10)"],
        colors: ["Azul Celeste Vintage", "Negro Gastado"],
        promo: false,
        available: true
      },
      {
        id: "fas-03",
        sku: "POL-HW-03",
        name: "Polo Heavyweight 240g Streetwear",
        category: "Polos & Poleras",
        price: 59.00,
        desc: "Algodón tangüis peinado pesado 240g, cuello cerrado acanalado de 3cm que no se deforma y corte boxy fit relajado.",
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blanco Puro", "Negro Onyx", "Gris Melange"],
        promo: true,
        available: true
      }
    ]
  },
  food: {
    config: {
      name: "Dulce & Pasión Repostería",
      storeSlug: "dulce-pasion",
      tagline: "Tortas artesanales, postres en vaso y boxes temáticos para regalar 🍰🧁",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 6.0,
      deliveryTime: "30-45 min",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Dulce Pasión Repostería",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "foo-01",
        sku: "TRL-01",
        name: "Torta Tres Leches Clásica",
        category: "Postres & Tortas",
        price: 22.00,
        desc: "Bizcochuelo súper esponjoso bañado en nuestra mezcla secreta de 3 leches, canela fina y merengue tostado al soplete.",
        img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Porción Personal", "Molde 8 Porciones (+S/ 38)", "Molde 16 Porciones (+S/ 65)"],
        colors: ["Canela & Vainilla", "Fudge Artesanal (+S/ 5)"],
        promo: true,
        available: true
      },
      {
        id: "foo-02",
        sku: "BOX-CUP-02",
        name: "Caja Box de 6 Cupcakes Gourmet",
        category: "Boxes de Regalo",
        price: 35.00,
        desc: "Caja decorada con cinta de regalo. Sabores variados: Red Velvet con frosting de queso crema, Chocolate fudge y Zanahoria nuez.",
        img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Box 6 Uds", "Box 12 Uds (+S/ 28)"],
        colors: ["Surtido Gourmet", "Full Chocolate Fudge"],
        promo: true,
        available: true
      },
      {
        id: "foo-03",
        sku: "HAM-01",
        name: "Smash Burger Monster Doble Queso",
        category: "Hamburguesas & Alitas",
        price: 24.50,
        desc: "Doble medallón smash (200g) en pan brioche artesanal, doble queso cheddar fundido, tocino crocante y salsa ahumada de la casa.",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Normal", "Doble Medallón (+S/ 6)"],
        colors: ["Papas Rústicas", "Papas Nativas (+S/ 3)"],
        promo: false,
        available: true
      }
    ]
  },
  tech: {
    config: {
      name: "Licencias & Tech Perú",
      storeSlug: "licencias-tech",
      tagline: "Software original, licencias digitales garantizadas y gadgets tech 💻⚡",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 0.0,
      deliveryTime: "Entrega Inmediata",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Licencias Digitales Perú",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "tec-01",
        sku: "WIN-11-PRO",
        name: "Licencia Windows 11 Pro 64-bit Retail",
        category: "Software & Licencias",
        price: 49.00,
        desc: "Clave de producto original 25 caracteres para activación permanente. Soporta reinstalación y actualizaciones oficiales de por vida.",
        img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["1 PC", "3 PCs Hogar (+S/ 30)", "5 PCs Empresa (+S/ 60)"],
        colors: ["Activación Digital Inmediata"],
        promo: true,
        available: true
      },
      {
        id: "tec-02",
        sku: "M365-FAM",
        name: "Microsoft 365 Familia Anual (6 Usuarios)",
        category: "Suscripciones Digitales",
        price: 159.00,
        desc: "Word, Excel, PowerPoint, Outlook y 1TB en OneDrive por cada usuario (6TB total). Activación oficial vinculada a tu cuenta personal.",
        img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Suscripción 1 Año", "Suscripción 2 Años (+S/ 130)"],
        colors: ["Activación a tu correo"],
        promo: false,
        available: true
      },
      {
        id: "tec-03",
        sku: "EAR-ANC-01",
        name: "Audífonos Bluetooth Noise Cancelling Pro",
        category: "Audio & Gadgets",
        price: 189.00,
        desc: "Cancelación activa de ruido (ANC) híbrida -35dB, transductores de 40mm con graves profundos y autonomía de 30 horas con estuche.",
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Edición Estándar"],
        colors: ["Negro Mate", "Blanco Glaciar"],
        promo: true,
        available: true
      }
    ]
  },
  general: {
    config: {
      name: "MegaTienda Express Perú",
      storeSlug: "megatienda-express",
      tagline: "Tus productos favoritos en tendencia con envíos directos y pago contraentrega o Yape 🛍️✨",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 7.0,
      deliveryTime: "Envíos hoy mismo",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "MegaTienda Express",
      yapeQrUrl: ""
    },
    products: [
      {
        id: "gen-01",
        sku: "LMP-01",
        name: "Lámpara Proyector LED Sunset Golden Hour",
        category: "Más Vendidos",
        price: 45.00,
        desc: "Crea ambientes cálidos estilo TikTok / Instagram. Cabezal giratorio 180° de aluminio y lente de cristal óptico de alta transmisión.",
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["Estándar USB"],
        colors: ["Sunset Red", "Rainbow Prism"],
        promo: true,
        available: true
      },
      {
        id: "gen-02",
        sku: "ORG-02",
        name: "Organizador Multifuncional Plegable 3 Niveles",
        category: "Hogar & Varios",
        price: 65.00,
        desc: "Estructura de acero al carbono con ruedas 360° silenciosas. Soporta hasta 45kg y se pliega en 5 segundos sin herramientas.",
        img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["3 Niveles", "5 Niveles (+S/ 25)"],
        colors: ["Blanco Nórdico", "Negro Mate"],
        promo: false,
        available: true
      },
      {
        id: "gen-03",
        sku: "BOT-03",
        name: "Botella Térmica 1L Doble Pared Frío/Calor",
        category: "Accesorios",
        price: 39.00,
        desc: "Acero inoxidable 304 libre de BPA. Mantiene agua helada por 24 horas y bebidas calientes por 12 horas. Tapa hermética antiderrame.",
        img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80",
        videoUrl: "",
        sizes: ["750 ml", "1000 ml (+S/ 8)"],
        colors: ["Negro Grafito", "Azul Océano", "Rosa Pastel"],
        promo: true,
        available: true
      }
    ]
  }
};

// ============================================================================
// 1.1 CONFIGURACIÓN DE RUBROS & CATEGORÍAS ESTILO WHATSAPP BUSINESS
// ============================================================================
const NICHE_LABELS_ES = {
  vehicles: "Vehículos & Motos",
  tech: "Software & Licencias",
  digital: "Software & Licencias",
  sneakers: "Zapatillas & Calzado",
  fashion: "Ropa & Moda",
  beauty: "Perfumes & Belleza",
  watches: "Relojes & Joyería",
  food: "Comida & Postres",
  general: "General & Marketplace",
  apparel: "Ropa & Calzado",
  properties: "Inmuebles & Alquiler",
  burger: "Hamburguesas & Comida"
};

function getNicheLabelEs(key) {
  if (!key) return "General";
  return NICHE_LABELS_ES[key] || NICHE_DATA[key]?.label || "General";
}

const TYPE_CATEGORIES = {
  digital: [
    "Diseño & Arquitectura (Adobe / Autodesk)",
    "Ofimática & Windows (Microsoft 365)",
    "Inteligencia Artificial & Pro (ChatGPT / Canva / CapCut)",
    "Streaming & Entretenimiento",
    "Antivirus & Seguridad",
    "Cursos & Libros Digitales",
    "Juegos & Gift Cards"
  ],
  vehicle: [
    "Camionetas & SUV",
    "Autos Sedán & Hatchback",
    "Pickups & 4x4",
    "Vans & Comerciales",
    "Motos & Scooters",
    "Repuestos & Autopartes",
    "Accesorios Automotrices"
  ],
  property: [
    "Departamentos en Venta",
    "Departamentos en Alquiler",
    "Casas",
    "Locales Comerciales",
    "Oficinas",
    "Terrenos & Lotes",
    "Habitaciones"
  ],
  item: [
    "Calzado & Zapatillas",
    "Ropa & Pantalones",
    "Relojes & Joyas",
    "Perfumes & Decants",
    "Celulares & Laptops",
    "Componentes PC & GPUs",
    "Audífonos & Gadgets",
    "Postres & Comida",
    "Flores & Regalos",
    "Hogar & Muebles"
  ]
};

const NICHE_DATA = {
  vehicles: {
    key: "vehicles",
    label: "Vehículos & Automotor",
    config: {
      name: "AutoMarket Perú",
      storeSlug: "automarket-peru",
      tagline: "Venta de autos, camionetas SUV y vehículos seminuevos garantizados 🚗🔑",
      phone: "51987654321",
      currency: "US$",
      deliveryCost: 0.0,
      deliveryTime: "Trato Directo",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    },
    suggestedCategories: ["Camionetas & SUV", "Autos Sedán & Hatchback", "Pickups & 4x4", "Vans & Comerciales", "Motos & Scooters", "Repuestos & Autopartes", "Accesorios Automotrices"],
    catalogTitle: "Catálogo de Vehículos & Camionetas",
    catalogSubtitle: "Ficha técnica completa, fotos HD e inspección mecánica garantizada",
    orderButtonText: "💬 Consultar por WhatsApp",
    deliveryCostLabel: "Visita / Prueba de Manejo"
  },
  sneakers: {
    key: "sneakers",
    label: "Zapatillas & Calzado",
    tagline: "Zapatillas exclusivas 100% originales, streetwear y envíos a todo el Perú 👟🔥",
    suggestedCategories: ["Urbano & Streetwear", "Deportivas & Running", "Edición Limitada", "Botines & Casual"],
    variantLabels: {
      size: "Talla (EUR / US)",
      color: "Color / Modelo"
    },
    defaultDeliveryTime: "Envíos en 24-48h",
    defaultDeliveryCost: 10.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "📦 Envíos 24-48h",
      cost: "🛵 Delivery Lima y Provincias"
    }
  },
  beauty: {
    key: "beauty",
    label: "Perfumes & Belleza",
    tagline: "Perfumería fina de diseñador, decants originales y cosmética árabe ✨🇵🇪",
    suggestedCategories: ["Perfumes Dama", "Perfumes Caballero", "Perfumes Árabes", "Decants (5ml / 10ml)", "Skincare & Maquillaje"],
    variantLabels: {
      size: "Presentación / Mililitros",
      color: "Aroma / Familia"
    },
    defaultDeliveryTime: "Envíos en 24h",
    defaultDeliveryCost: 8.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "✨ Envíos en 24h",
      cost: "🛵 Delivery Seguro"
    }
  },
  watches: {
    key: "watches",
    label: "Relojes, Joyas & Regalos",
    tagline: "Arreglos florales prémium, rosas eternas, joyería fina y relojes de colección 💐⌚✨",
    suggestedCategories: ["Ramos & Flores", "Boxes de Regalo", "Relojes Automáticos", "Joyas & Cadenas", "Accesorios"],
    variantLabels: {
      size: "Modelo / Tamaño",
      color: "Color / Acabado"
    },
    defaultDeliveryTime: "Envíos en 24-48h",
    defaultDeliveryCost: 10.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "⏱️ Envíos 24-48h",
      cost: "💎 Envío Asegurado"
    }
  },
  fashion: {
    key: "fashion",
    label: "Ropa, Pantalones & Moda",
    tagline: "Pantalones cargo, jeans wide leg, casacas y outfits en tendencia 👖✨",
    suggestedCategories: ["Pantalones & Jeans", "Polos & Poleras", "Vestidos & Conjuntos", "Casacas", "Ofertas"],
    variantLabels: {
      size: "Talla (S, M, L o 28, 30, 32)",
      color: "Color / Tela"
    },
    defaultDeliveryTime: "Envíos en 24-48h",
    defaultDeliveryCost: 8.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "📦 Envíos 24-48h",
      cost: "🛵 Envíos a todo el país"
    }
  },
  food: {
    key: "food",
    label: "Postres, Tortas & Comida",
    tagline: "Tortas artesanales, postres en vaso y boxes temáticos para regalar 🍰🧁",
    suggestedCategories: ["Postres & Tortas", "Boxes de Regalo", "Hamburguesas & Alitas", "Bebidas", "Combos"],
    variantLabels: {
      size: "Tamaño / Porciones",
      color: "Sabor / Dedicatoria"
    },
    defaultDeliveryTime: "30-45 min",
    defaultDeliveryCost: 6.0,
    isDigitalFriendly: false,
    hasDineIn: true,
    pills: {
      time: "⏱️ 30-45 min",
      cost: "🛵 Delivery Directo"
    }
  },
  tech: {
    key: "tech",
    label: "Software, Licencias & Tech",
    tagline: "Software original, licencias digitales garantizadas y herramientas tech 💻⚡",
    suggestedCategories: ["Diseño & Arquitectura (Adobe / Autodesk)", "Ofimática & Windows (Microsoft 365)", "Inteligencia Artificial & Pro (ChatGPT / Canva / CapCut)", "Streaming & Entretenimiento", "Antivirus & Seguridad", "Cursos & Libros Digitales", "Juegos & Gift Cards"],
    variantLabels: {
      size: "Duración / Plan (ej: 1 Mes, 6 Meses, 1 Año)",
      color: "Dispositivos / Entrega (ej: 1 PC, 2 Dispositivos, Con tu correo)"
    },
    defaultDeliveryTime: "Entrega Inmediata",
    defaultDeliveryCost: 0.0,
    isDigitalFriendly: true,
    hasDineIn: false,
    pills: {
      time: "⚡ Entrega Inmediata",
      cost: "💻 Activación 100% Online (Envío S/ 0)"
    }
  },
  general: {
    key: "general",
    label: "Tienda General / Todo Rubro",
    tagline: "Tus productos favoritos en tendencia con envíos directos y pago contraentrega o Yape 🛍️✨",
    suggestedCategories: ["Más Vendidos", "Nuevos Ingresos", "Promociones", "Hogar & Varios", "Accesorios"],
    variantLabels: {
      size: "Variantes / Opciones",
      color: "Color / Modelo"
    },
    defaultDeliveryTime: "Envíos hoy mismo",
    defaultDeliveryCost: 7.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "⏱️ Envíos hoy mismo",
      cost: "🛵 Delivery Disponible"
    }
  }
};

// ============================================================================
// ============================================================================
// TEMAS VISUALES Y COLORES DE TIENDA
// ============================================================================
const STORE_THEME_PRESETS = {
  "boutique-rose": {
    id: "boutique-rose",
    name: "Rosa Boutique",
    mode: "light",
    accent: "#e11d48",
    headerBg: "#fff1f2",
    headerText: "#18181b",
    badgeBg: "#f43f5e",
    badgeText: "#ffffff"
  },
  "minimal-light": {
    id: "minimal-light",
    name: "Minimalista Blanco",
    mode: "light",
    accent: "#111827",
    headerBg: "#ffffff",
    headerText: "#09090b",
    badgeBg: "#18181b",
    badgeText: "#ffffff"
  },
  "lavender-luxe": {
    id: "lavender-luxe",
    name: "Lavanda & Belleza",
    mode: "light",
    accent: "#7c3aed",
    headerBg: "#f5f3ff",
    headerText: "#1e1b4b",
    badgeBg: "#8b5cf6",
    badgeText: "#ffffff"
  },
  "warm-coral": {
    id: "warm-coral",
    name: "Coral Cálido",
    mode: "light",
    accent: "#ea580c",
    headerBg: "#fff7ed",
    headerText: "#1c1917",
    badgeBg: "#f97316",
    badgeText: "#ffffff"
  },
  "tech-dark": {
    id: "tech-dark",
    name: "Tech Azul",
    mode: "dark",
    accent: "#3b82f6",
    headerBg: "#0f172a",
    headerText: "#f8fafc",
    badgeBg: "#2563eb",
    badgeText: "#ffffff"
  },
  "obsidian-emerald": {
    id: "obsidian-emerald",
    name: "Esmeralda",
    mode: "dark",
    accent: "#10b981",
    headerBg: "#0b0e14",
    headerText: "#f8fafc",
    badgeBg: "#059669",
    badgeText: "#ffffff"
  }
};

// Aliases para máxima compatibilidad
STORE_THEME_PRESETS["boutique"] = STORE_THEME_PRESETS["boutique-rose"];
STORE_THEME_PRESETS["minimal"] = STORE_THEME_PRESETS["minimal-light"];
STORE_THEME_PRESETS["lavanda"] = STORE_THEME_PRESETS["lavender-luxe"];
STORE_THEME_PRESETS["coral"] = STORE_THEME_PRESETS["warm-coral"];
STORE_THEME_PRESETS["tech"] = STORE_THEME_PRESETS["tech-dark"];
STORE_THEME_PRESETS["esmeralda"] = STORE_THEME_PRESETS["obsidian-emerald"];

// 2. ESTADO GLOBAL REACTIVO (APPSTATE)
// ============================================================================
const AppState = {
  activePreset: "sneakers",
  shopConfig: { ...BUSINESS_PRESETS.sneakers.config },
  products: [...BUSINESS_PRESETS.sneakers.products],
  isViewingRemoteCatalog: false,
  storesList: [],
  currentStoreId: null,

  // Catálogos independientes por tienda (Etapa 2)
  catalogs: [],
  activeStudioCatalogId: "all",
  activeCustomerCatalogSlug: "",

  normalizePresetKey(rawKey) {
    if (!rawKey) return "general";
    const map = {
      "apparel": "fashion",
      "ropa": "fashion",
      "moda": "fashion",
      "fashion": "fashion",
      "digital": "tech",
      "software": "tech",
      "licencias": "tech",
      "tech": "tech",
      "tecnologia": "tech",
      "vehiculos": "vehicles",
      "vehicles": "vehicles",
      "autos": "vehicles",
      "sneakers": "sneakers",
      "zapatillas": "sneakers",
      "calzado": "sneakers",
      "beauty": "beauty",
      "belleza": "beauty",
      "cosmetica": "beauty",
      "watches": "watches",
      "relojes": "watches",
      "joyas": "watches",
      "food": "food",
      "burger": "food",
      "comida": "food",
      "restaurante": "food",
      "properties": "general",
      "inmuebles": "general",
      "general": "general"
    };
    return map[String(rawKey).toLowerCase().trim()] || "general";
  },

  initStores() {
    try {
      const saved = localStorage.getItem("tiendazap_stores");
      if (saved) {
        this.storesList = JSON.parse(saved);
        if (Array.isArray(this.storesList)) {
          this.storesList.forEach(s => {
            s.preset = this.normalizePresetKey(s.preset || s.config?.niche);
            if (s.config) s.config.niche = s.preset;
          });
        }
      }
    } catch (e) {
      this.storesList = [];
    }
    if (!Array.isArray(this.storesList) || this.storesList.length === 0) {
      const normNiche = this.normalizePresetKey(this.activePreset || this.shopConfig.niche || "general");
      const currentStore = {
        id: "store_" + (this.shopConfig.storeSlug || "principal"),
        name: this.shopConfig.name || "Mi Tienda",
        slug: this.shopConfig.storeSlug || "mi-tienda",
        preset: normNiche,
        phone: this.shopConfig.phone || "",
        currency: this.shopConfig.currency || "S/",
        config: { ...this.shopConfig, niche: normNiche },
        products: [...this.products],
        categories: [...this.categories],
        catalogs: [...(this.catalogs && this.catalogs.length > 0 ? this.catalogs : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }])],
        createdAt: Date.now()
      };
      this.storesList = [currentStore];
      this.currentStoreId = currentStore.id;
      this.saveStoresList();
    } else if (!this.currentStoreId) {
      const currentSlug = this.getStoreSlug();
      const match = this.storesList.find(s => s.slug === currentSlug) || this.storesList[0];
      this.currentStoreId = match ? match.id : this.storesList[0].id;
    }
  },

  saveStoresList() {
    this.safeSetItem("tiendazap_stores", JSON.stringify(this.storesList || []));
  },

  saveCurrentStoreState() {
    if (!this.storesList) this.initStores();
    const currentSlug = this.getStoreSlug();
    const idx = this.storesList.findIndex(s => s.slug === currentSlug || (this.currentStoreId && s.id === this.currentStoreId));
    const normNiche = this.normalizePresetKey(this.activePreset || this.shopConfig.niche || "general");
    this.activePreset = normNiche;
    if (this.shopConfig) this.shopConfig.niche = normNiche;
    const storeData = {
      id: this.currentStoreId || ("store_" + currentSlug),
      name: this.shopConfig.name,
      slug: currentSlug,
      preset: normNiche,
      phone: this.shopConfig.phone,
      currency: this.shopConfig.currency,
      config: { ...this.shopConfig, niche: normNiche },
      products: [...this.products],
      categories: [...this.categories],
      catalogs: [...(this.catalogs && this.catalogs.length > 0 ? this.catalogs : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }])],
      updatedAt: Date.now()
    };
    if (idx >= 0) {
      this.storesList[idx] = storeData;
    } else {
      this.storesList.push(storeData);
    }
    this.saveStoresList();
    this.safeSetItem("tiendazap_store_" + currentSlug, JSON.stringify(storeData));
  },

  syncActiveStoreToList() {
    this.saveCurrentStoreState();
  },

  applyStoreTheme() {
    const presetKey = this.shopConfig?.themePreset || (this.activePreset === "tech" ? "tech-dark" : "minimal-light");
    const preset = (typeof STORE_THEME_PRESETS !== "undefined" && (STORE_THEME_PRESETS[presetKey] || STORE_THEME_PRESETS[presetKey.toLowerCase()])) ? (STORE_THEME_PRESETS[presetKey] || STORE_THEME_PRESETS[presetKey.toLowerCase()]) : {
      id: "minimal-light", name: "Minimalista Blanco", mode: "light", accent: "#111827"
    };

    const mode = this.shopConfig?.themeMode || "light";
    const rawAccent = this.shopConfig?.accentColor || preset.accent || "#16a34a";
    const accent = rawAccent;

    // Auto-cálculo de contraste y luminancia relativa estándar WCAG
    let lum = 0.2;
    let cleanHex = (rawAccent || "#16a34a").replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map(c => c + c).join("");
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
      const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
      const b = parseInt(cleanHex.substr(4, 2), 16) / 255;
      lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    let accentBg = rawAccent;
    let accentFg = lum > 0.6 ? "#0f172a" : "#ffffff";
    let priceColor = (mode === "dark") ? "#f8fafc" : "#0f172a";

    if (mode === "dark") {
      // Si el acento de la tienda es oscuro (como Minimal #111827 con lum < 0.25),
      // en la vitrina oscura el botón se convierte en blanco con texto negro (#f8fafc / #0f172a)
      // para evitar el botón oscuro invisible sobre fondo oscuro.
      if (lum < 0.25) {
        accentBg = "#f8fafc";
        accentFg = "#0f172a";
      }
      priceColor = "#f8fafc";
    } else {
      // Modo Claro: precio legible asegurado
      priceColor = "#0f172a";
    }

    const themeVars = mode === "light" ? {
      "--cust-bg": "#f8fafc",
      "--cust-surface": "#ffffff",
      "--cust-surface-2": "#f1f5f9",
      "--cust-text": "#0f172a",
      "--cust-text-secondary": "#475569",
      "--cust-muted": "#475569",
      "--cust-border": "#e2e8f0",
      "--cust-border-subtle": "rgba(15, 23, 42, 0.05)",
      "--cust-input-bg": "#ffffff",
      "--cust-accent": rawAccent,
      "--cust-accent-bg": accentBg,
      "--cust-accent-fg": accentFg,
      "--cust-accent-contrast": accentFg,
      "--cust-accent-text": accentFg,
      "--cust-price-color": priceColor
    } : {
      "--cust-bg": "#0b0d12",
      "--cust-surface": "#13161f",
      "--cust-surface-2": "#1b1f2b",
      "--cust-text": "#f8fafc",
      "--cust-text-secondary": "#94a3b8",
      "--cust-muted": "#94a3b8",
      "--cust-border": "rgba(255, 255, 255, 0.08)",
      "--cust-border-subtle": "rgba(255, 255, 255, 0.05)",
      "--cust-input-bg": "#161922",
      "--cust-accent": rawAccent,
      "--cust-accent-bg": accentBg,
      "--cust-accent-fg": accentFg,
      "--cust-accent-contrast": accentFg,
      "--cust-accent-text": accentFg,
      "--cust-price-color": priceColor
    };

    if (mode === "light") {
      document.body.classList.add("store-theme-light");
      document.body.classList.remove("store-theme-dark");
    } else {
      document.body.classList.add("store-theme-dark");
      document.body.classList.remove("store-theme-light");
    }

    const targetElements = [
      document.getElementById("customer-preview-view"),
      document.getElementById("product-detail-modal"),
      document.getElementById("cart-modal-overlay"),
      document.getElementById("qr-modal")
    ];

    targetElements.forEach(el => {
      if (!el) return;
      el.setAttribute("data-theme-mode", mode);
      el.setAttribute("data-theme-preset", presetKey);
      el.style.setProperty("--store-accent", rawAccent);
      el.style.setProperty("--cust-accent", rawAccent);
      el.style.setProperty("--cust-accent-bg", accentBg);
      el.style.setProperty("--cust-accent-fg", accentFg);
      el.style.setProperty("--cust-accent-contrast", accentFg);
      el.style.setProperty("--cust-accent-text", accentFg);
      el.style.setProperty("--cust-price-color", priceColor);
      Object.entries(themeVars).forEach(([k, v]) => {
        el.style.setProperty(k, v);
      });
      if (mode === "light") {
        el.classList.add("theme-light");
        el.classList.remove("theme-dark");
      } else {
        el.classList.add("theme-dark");
        el.classList.remove("theme-light");
      }
    });

    document.querySelectorAll(".theme-preset-card, .theme-swatch-item").forEach(card => {
      const cId = card.dataset.themeId;
      card.classList.toggle("active", cId === presetKey || (preset.id && cId === preset.id));
    });

    const customColorInput = document.getElementById("store-custom-accent-color");
    if (customColorInput && accent) {
      customColorInput.value = accent;
    }
    const customDot = document.querySelector(".swatch-custom-dot");
    if (customDot && accent) {
      customDot.style.background = accent;
    }

    const lightBtn = document.getElementById("store-theme-mode-light");
    const darkBtn = document.getElementById("store-theme-mode-dark");
    if (lightBtn && darkBtn) {
      lightBtn.classList.toggle("active", mode === "light");
      darkBtn.classList.toggle("active", mode === "dark");
    }
  },

  changeStoreNiche(newNiche) {
    if (!newNiche) return;
    this.activePreset = newNiche;
    if (!this.shopConfig) this.shopConfig = {};
    this.shopConfig.niche = newNiche;

    // Categorías que ya tienen productos creados por el usuario
    const categoriesWithProducts = new Set();
    (this.products || []).forEach(p => {
      if (p.category && p.category !== "undefined") {
        categoriesWithProducts.add(p.category.trim().toLowerCase());
      }
    });

    // Conservar intactas las categorías que tengan productos creados
    const preservedCats = (this.categories || []).filter(c => {
      const name = typeof c === "string" ? c.trim() : (c && c.name ? c.name.trim() : "");
      return name && categoriesWithProducts.has(name.toLowerCase());
    });

    // Categorías oficiales sugeridas para el nuevo rubro
    const newSuggested = NICHE_DATA[newNiche]?.suggestedCategories || TYPE_CATEGORIES[newNiche] || NICHE_DATA.general.suggestedCategories || [];
    const newCatObjects = newSuggested.map((catName, idx) => ({
      id: "cat_" + (idx + 1),
      name: catName,
      icon: CustomerUI.getCategoryIcon(catName)
    }));

    const existingNames = new Set(preservedCats.map(c => (typeof c === "string" ? c : c.name).toLowerCase()));
    const mergedCategories = [...preservedCats];
    newCatObjects.forEach(c => {
      if (!existingNames.has(c.name.toLowerCase())) {
        mergedCategories.push(c);
        existingNames.add(c.name.toLowerCase());
      }
    });
    this.categories = mergedCategories;

    // Si el nuevo rubro es digital (tech / digital), ajustar automáticamente delivery 0
    if (newNiche === "tech" || newNiche === "digital") {
      this.shopConfig.deliveryCost = 0;
      this.shopConfig.deliveryTime = "Entrega Inmediata";
    } else if (newNiche === "vehicles") {
      this.shopConfig.deliveryCost = 0;
      this.shopConfig.deliveryTime = "Trato Directo";
      if (this.shopConfig.currency !== "US$") {
        this.shopConfig.currency = "US$";
      }
    }

    this.saveConfig();
    this.saveCategories();
    this.syncActiveStoreToList();

    StudioController.populateSettingsTab();
    StudioController.updateVariantInputLabels();
    StudioController.renderCategoryFilters();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    StudioController.renderStoresTab();

    document.querySelectorAll(".niche-card-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-niche") === newNiche);
    });

    Toast.show("Rubro y categorías de tu tienda actualizados", "✅");
  },

  migrateProduct(p) {
    if (!p) return p;
    // 1. Limpiar texto de relleno falso de registro inicial
    if (p.desc && (p.desc.trim() === "Producto publicado durante el registro inicial." || p.desc.includes("registro inicial"))) {
      p.desc = "";
    }
    // 2. Detección automática de producto digital/software
    const isDigitalName = /adobe|autodesk|windows|office|microsoft|licencia|antivirus|canva|capcut|suscripci[oó]n|streaming|spotify|netflix|vpn/i.test((p.name || "") + " " + (p.sku || ""));
    if (isDigitalName) {
      p.listingType = "digital";
    }
    // 3. Sanitización de categoría
    const rawCat = (p.category || "").trim();
    if (!rawCat || rawCat.toLowerCase() === "undefined" || rawCat.toLowerCase() === "null") {
      p.category = (p.listingType === "digital" || this.activePreset === "tech" || this.activePreset === "digital") ? "Licencias & Software" : "General";
    }
    // 4. Catálogo de pertenencia (Etapa 2: retrocompatibilidad, nunca huérfano)
    if (!p.catalogId) {
      p.catalogId = "cat_main";
    }
    return p;
  },

  switchStore(storeId) {
    if (!this.storesList) this.initStores();
    this.saveCurrentStoreState();
    const target = this.storesList.find(s => s.id === storeId || s.slug === storeId);
    if (!target) return false;

    this.currentStoreId = target.id;
    const normalizedNiche = this.normalizePresetKey(target.preset || target.config?.niche || "general");
    this.activePreset = normalizedNiche;
    this.shopConfig = { ...target.config, niche: normalizedNiche };
    this.products = [...(target.products || [])].map(p => this.migrateProduct(p));
    this.categories = [...(target.categories || [])];
    this.catalogs = Array.isArray(target.catalogs) && target.catalogs.length > 0
      ? [...target.catalogs]
      : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }];
    this.activeStudioCatalogId = "all";
    this.loadCartForCurrentStore();
    this.saveConfig();
    this.saveProducts();
    this.saveCategories();
    this.saveCatalogs();
    this.applyStoreTheme();
    if (typeof StudioController !== "undefined") {
      StudioController.syncAllLogoElements(this.shopConfig.logoUrl);
      StudioController.renderAll();
    }
    if (typeof CustomerUI !== "undefined") {
      AppState.applyStoreTheme();
      CustomerUI.renderStoreHeader();
      CustomerUI.renderCategoryTabs();
      CustomerUI.renderProductCards();
      CustomerUI.updateCartBar();
      CustomerUI.renderCartItemsList();
    }
    Toast.show(`Cambiaste a la tienda "${target.name}"`, "🏪");
    return true;
  },

  createNewStore({ name, preset, phone, currency, yapePhone, yapeName, email, address, hours, tagline, logoUrl, bannerUrl }) {
    if (!this.storesList) this.initStores();
    this.saveCurrentStoreState();

    const cleanName = (name || "").trim() || "Nueva Tienda";
    const slug = slugifyStoreName(cleanName) || ("tienda-" + Date.now().toString(36));
    const storeId = "store_" + Date.now();
    const normPreset = this.normalizePresetKey(preset);

    const initialConfig = {
      name: cleanName,
      storeSlug: slug,
      tagline: tagline || `Catálogo oficial de ${cleanName}`,
      phone: phone || "",
      currency: currency || (normPreset === "vehicles" ? "US$" : "S/"),
      deliveryCost: (normPreset === "tech" || normPreset === "vehicles") ? 0 : 5,
      deliveryTime: normPreset === "tech" ? "Inmediato" : "24-48h",
      isOpen: true,
      logoUrl: logoUrl || "",
      bannerUrl: bannerUrl || "",
      email: email || "",
      address: address || "",
      hours: hours || "",
      yapePhone: yapePhone || "",
      yapeName: yapeName || "",
      yapeQrUrl: "",
      yapeEnabled: !!yapePhone,
      googleSheetUrl: "",
      niche: normPreset
    };

    const starterCategories = (NICHE_DATA[normPreset]?.suggestedCategories || NICHE_DATA.general.suggestedCategories || ["General"]).map((catName, idx) => ({
      id: "cat_" + (idx + 1),
      name: catName,
      icon: CustomerUI.getCategoryIcon(catName)
    }));
    const starterCatalogs = [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }];

    // Tienda limpia sin productos de relleno falso
    const newStore = {
      id: storeId,
      name: cleanName,
      slug: slug,
      preset: normPreset,
      phone: phone || "",
      currency: initialConfig.currency,
      config: initialConfig,
      products: [],
      categories: starterCategories,
      catalogs: starterCatalogs,
      createdAt: Date.now()
    };

    this.storesList.push(newStore);
    this.saveStoresList();
    this.safeSetItem("tiendazap_store_" + slug, JSON.stringify(newStore));

    this.currentStoreId = storeId;
    this.activePreset = normPreset;
    this.shopConfig = initialConfig;
    this.products = [];
    this.categories = starterCategories;
    this.catalogs = starterCatalogs;
    this.activeStudioCatalogId = "all";
    this.cart = {};
    this.saveCart();
    this.saveConfig();
    this.saveProducts();
    this.saveCategories();
    this.saveCatalogs();
    this.applyStoreTheme();

    if (typeof StudioController !== "undefined") {
      StudioController.syncAllLogoElements(this.shopConfig.logoUrl);
      StudioController.renderAll();
    }
    return newStore;
  },

  deleteStore(storeId) {
    if (!this.storesList) this.initStores();
    if (this.storesList.length <= 1) {
      Toast.show("Debes tener al menos una tienda activa", "⚠️");
      return false;
    }
    const target = this.storesList.find(s => s.id === storeId || s.slug === storeId);
    if (!target) return false;

    if (!confirm(`¿Eliminar la tienda "${target.name}"? Esta acción no se puede deshacer.`)) {
      return false;
    }

    this.storesList = this.storesList.filter(s => s.id !== target.id);
    this.saveStoresList();

    if (this.currentStoreId === target.id || this.getStoreSlug() === target.slug) {
      const nextStore = this.storesList[0];
      this.switchStore(nextStore.id);
    } else {
      StudioController.renderStoresTab();
    }

    Toast.show(`Tienda "${target.name}" eliminada`, "🗑️");
    return true;
  },
  catalogViewMode: localStorage.getItem('tiendazap_view_mode') || 'grid',

  getStoreSlug() {
    return (this.shopConfig && this.shopConfig.storeSlug)
      ? this.shopConfig.storeSlug
      : slugifyStoreName(this.shopConfig?.name || "tienda");
  },
  categories: [], // Entidad de primer nivel: { id, name, icon }
  cart: {}, // { [cartKey]: { product, quantity, note, selectedSize, selectedColor } }
  
  // Filtros en Studio y Cliente
  studioCategory: "all",
  studioSearchQuery: "",
  customerCategory: "all",
  customerSearchQuery: "",

  // Modo de entrega del cliente
  deliveryMode: "delivery", // 'delivery' | 'pickup' | 'dinein'
  tableNumber: "",
  gpsCoords: "",
  paymentMethod: "Yape / Plin",
  buyerVoucherBase64: "", // Comprobante de pago subido por el comprador
  buyerVoucherFile: null, // Archivo original para Web Share API
  isCustomerOnlyMode: false, // Flag de comprador sin barra de retorno al Studio

  // Registro del Propietario / Comerciante
  merchant: {
    name: "",
    email: "",
    contact: "",
    pin: ""
  },

  // Modal de Producto Cliente
  selectedProductModal: null,
  modalQuantity: 1,
  modalSelectedSize: "",
  modalSelectedColor: "",

  init() {
    try {
      // 1. Detectar si el enlace viene para una mesa específica (?mesa=Mesa+3)
      const urlParams = new URLSearchParams(window.location.search);
      const mesaParam = urlParams.get("mesa");
      if (mesaParam) {
        this.tableNumber = decodeURIComponent(mesaParam);
        this.deliveryMode = "dinein";
      }

      // Detectar si viene filtro directo de catálogo (?cat=autodesk)
      const catParam = urlParams.get("cat");
      if (catParam) {
        this.activeCustomerCatalogSlug = decodeURIComponent(catParam).trim();
      }

      // Soporte para reiniciar demostración desde cero (?nuevo=1, ?reset=1, ?demo=1, ?start=1)
      const resetParam = urlParams.get("reset") || urlParams.get("nuevo") || urlParams.get("demo") || urlParams.get("start");
      if (resetParam) {
        localStorage.removeItem("tiendazap_onboarding_done");
        localStorage.removeItem("tiendazap_merchant");
        localStorage.removeItem("tiendazap_config");
        localStorage.removeItem("tiendazap_products");
        localStorage.removeItem("tiendazap_categories");
        localStorage.removeItem("tiendazap_preset");
        localStorage.removeItem("tiendazap_cart");
        localStorage.removeItem("tiendazap_client");
      }

      // 2. Cargar datos del vendedor desde LocalStorage
      const storedPreset = localStorage.getItem("tiendazap_preset");
      if (storedPreset && BUSINESS_PRESETS[storedPreset]) {
        this.activePreset = storedPreset;
      }

      const isDone = localStorage.getItem("tiendazap_onboarding_done");
      const storedMerchant = localStorage.getItem("tiendazap_merchant");
      if (storedMerchant) {
        try {
          this.merchant = { ...this.merchant, ...JSON.parse(storedMerchant) };
        } catch (e) {}
      }
      const storedConfig = localStorage.getItem("tiendazap_config");
      if (storedConfig) {
        this.shopConfig = { ...this.shopConfig, ...JSON.parse(storedConfig) };
      } else if (!isDone) {
        // CLIENTE NUEVO: INICIA DE CERO LIMPIO ESTILO WHATSAPP BUSINESS
        this.shopConfig = {
          name: "",
          tagline: "",
          phone: "",
          currency: "S/",
          deliveryCost: 5.0,
          deliveryTime: "25-35 min",
          isOpen: true,
          logoUrl: "",
          bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
          googleSheetUrl: "",
          yapeEnabled: true,
          yapePhone: "",
          yapeName: "",
          yapeQrUrl: ""
        };
      } else {
        this.shopConfig = { ...BUSINESS_PRESETS[this.activePreset].config };
      }

      const storedProds = localStorage.getItem("tiendazap_products");
      if (storedProds) {
        this.products = JSON.parse(storedProds);
      } else if (!isDone) {
        this.products = [];
      } else {
        this.products = [...BUSINESS_PRESETS[this.activePreset].products];
      }
      this.products = (this.products || []).map(p => this.migrateProduct(p));

      // Inicializar y sincronizar categorías oficiales de la tienda
      this.initCategories();

      // Inicializar y sincronizar catálogos independientes de la tienda (Etapa 2)
      this.initCatalogs();

      this.cart = {};

      const storedClient = localStorage.getItem("tiendazap_client");
      if (storedClient) {
        const client = JSON.parse(storedClient);
        const nameInp = document.getElementById("client-name");
        const phoneInp = document.getElementById("client-phone");
        const addrInp = document.getElementById("client-address");
        if (nameInp) nameInp.value = client.name || "";
        if (phoneInp) phoneInp.value = client.phone || "";
        if (addrInp) addrInp.value = client.address || "";
      }

      // 3. Detectar slug de tienda desde pathname (/flores-vanesa) o parámetro (?tienda=flores-vanesa)
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      let pathSlug = "";
      if (pathSegments.length > 0) {
        const lastSeg = pathSegments[pathSegments.length - 1];
        if (!lastSeg.endsWith(".html") && lastSeg !== "micro-catalogo-whatsapp" && lastSeg !== "tiendazap") {
          pathSlug = decodeURIComponent(lastSeg);
        }
      }
      const tiendaParam = urlParams.get("tienda") || pathSlug;

      // Detectar payload comprimido en hash #d=... o parámetros ?c=... / ?d=...
      let rawCompressed = urlParams.get("c") || urlParams.get("d");
      if (!rawCompressed) {
        const hash = window.location.hash;
        const dMatch = hash.match(/[#&]d=([^&]+)/);
        if (dMatch) rawCompressed = decodeURIComponent(dMatch[1]);
      }

      if (rawCompressed && typeof LZString !== "undefined") {
        try {
          const jsonStr = LZString.decompressFromEncodedURIComponent(rawCompressed);
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            if (data && data.cfg) {
              this.isViewingRemoteCatalog = true;
              this.shopConfig = {
                name: data.cfg.n || "Tienda Online",
                storeSlug: data.cfg.s || tiendaParam || slugifyStoreName(data.cfg.n || "tienda"),
                tagline: data.cfg.t || "",
                phone: data.cfg.p || "",
                currency: data.cfg.c || "S/",
                deliveryCost: Number(data.cfg.dc ?? 0),
                deliveryTime: data.cfg.dt || "24-48h",
                isOpen: data.cfg.io !== false,
                logoUrl: data.cfg.l || "",
                bannerUrl: data.cfg.b || "",
                email: data.cfg.em || "",
                address: data.cfg.addr || "",
                hours: data.cfg.hrs || "",
                yapePhone: data.cfg.yp || "",
                yapeName: data.cfg.yn || "",
                yapeQrUrl: data.cfg.yq || "",
                yapeEnabled: !!data.cfg.ye,
                themeMode: data.cfg.tm || "light",
                accentColor: data.cfg.ac || "#3b82f6",
                themePreset: data.cfg.tp || "minimal-light",
                socials: data.cfg.soc || {},
                googleSheetUrl: ""
              };
              if (data.cfg.np && BUSINESS_PRESETS[data.cfg.np]) {
                this.activePreset = data.cfg.np;
              } else if (data.prods && data.prods.some(p => p.lt === "digital" || (p.n && /licencia|adobe|office|antivirus|windows|canva|spotify|netflix/i.test(p.n)))) {
                this.activePreset = "tech";
                this.shopConfig.deliveryCost = 0;
                this.shopConfig.deliveryTime = "Inmediato";
              }
              if (Array.isArray(data.cats)) {
                this.categories = data.cats.map((c, i) => {
                  if (typeof c === "string") {
                    const clean = c.trim();
                    return (clean && clean.toLowerCase() !== "undefined") ? { id: "cat_" + (i + 1), name: clean, icon: CustomerUI.getCategoryIcon(clean) } : null;
                  }
                  const cleanName = (c && c.name && c.name.toLowerCase() !== "undefined") ? c.name.trim() : "";
                  return cleanName ? {
                    id: c.id || "cat_" + (i + 1),
                    name: cleanName,
                    icon: c.icon || CustomerUI.getCategoryIcon(cleanName)
                  } : null;
                }).filter(Boolean);
              }
              if (!this.categories || this.categories.length === 0) {
                const defCats = NICHE_DATA[this.activePreset]?.suggestedCategories || ["General"];
                this.categories = defCats.map((name, i) => ({ id: "cat_" + (i + 1), name, icon: CustomerUI.getCategoryIcon(name) }));
              }
              if (Array.isArray(data.prods)) {
                this.products = data.prods.map(p => {
                  const imgs = (Array.isArray(p.imgs) && p.imgs.length > 0)
                    ? p.imgs
                    : (p.img ? [p.img] : []);
                  const rawCat = (p.cat || p.category || "").trim();
                  const isDig = p.lt === "digital" || /adobe|autodesk|windows|office|microsoft|licencia|antivirus|canva|capcut|suscripci[oó]n|streaming|spotify|netflix|vpn/i.test((p.n || "") + " " + (p.sku || ""));
                  const cleanCat = (!rawCat || rawCat.toLowerCase() === "undefined" || rawCat.toLowerCase() === "null") 
                    ? (isDig || this.activePreset === "tech" || this.activePreset === "digital" ? "Licencias & Software" : "General") 
                    : rawCat;
                  const cleanDesc = (p.d && (p.d.includes("registro inicial") || p.d.trim() === "Producto publicado durante el registro inicial.")) ? "" : (p.d || "");
                  return this.migrateProduct({
                    id: p.id || ("p_" + Math.random().toString(36).substr(2, 6)),
                    sku: p.sku || "",
                    name: p.n || "Producto",
                    category: cleanCat,
                    price: Number(p.pr || 0),
                    currency: p.cur || data.cfg?.c || "S/",
                    listingType: isDig ? "digital" : (p.lt || "item"),
                    condition: p.con || "",
                    location: p.loc || "",
                    desc: cleanDesc,
                    img: imgs[0] || p.img || "",
                    images: imgs,
                    specs: Array.isArray(p.sp) ? p.sp : [],
                    videoUrl: p.vid || "",
                    sizes: p.sz || [],
                    colors: p.co || [],
                    promo: !!p.pro,
                    available: true
                  });
                });
              }
              this.initCategories();
              this.isCustomerOnlyMode = true;
            }
          }
        } catch (err) {
          console.warn("Error desempaquetando catalogo:", err);
        }
      }

      const sheetParam = urlParams.get("sheet");
      if (sheetParam) {
        this.shopConfig.googleSheetUrl = sheetParam;
        this.isCustomerOnlyMode = true;
      }

      if (tiendaParam) {
        this.isCustomerOnlyMode = true;
        const targetSlug = slugifyStoreName(tiendaParam);
        this.shopConfig.storeSlug = targetSlug;
        let loaded = false;

        // 1. Sincronizar y buscar en almacenamiento local
        if (!rawCompressed) {
          const currentMemorySlug = this.getStoreSlug();
          if (currentMemorySlug === targetSlug && this.products && this.products.length > 0) {
            // Tienda activa en este navegador: asegura sincronización y carga viva
            this.saveCurrentStoreState();
            loaded = true;
          }

          // 2. Buscar en diccionario persistente por slug
          if (!loaded) {
            const slugKey = "tiendazap_store_" + targetSlug;
            const cachedStore = localStorage.getItem(slugKey);
            if (cachedStore) {
              try {
                const sData = JSON.parse(cachedStore);
                if (sData && (sData.config || sData.name)) {
                  this.shopConfig = { ...sData.config, name: sData.name || sData.config?.name || targetSlug };
                  this.products = (Array.isArray(sData.products) ? [...sData.products] : []).map(p => this.migrateProduct(p));
                  this.categories = Array.isArray(sData.categories) ? [...sData.categories] : [];
                  this.catalogs = Array.isArray(sData.catalogs) && sData.catalogs.length > 0 ? [...sData.catalogs] : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }];
                  if (sData.preset) this.activePreset = sData.preset;
                  loaded = true;
                }
              } catch (e) {
                console.warn("Error leyendo tienda de cache:", e);
              }
            }
          }

          // 3. Buscar en storesList
          if (!loaded) {
            if (!this.storesList || this.storesList.length === 0) this.initStores();
            const match = (this.storesList || []).find(s => s.slug === targetSlug || s.id === targetSlug);
            if (match) {
              this.shopConfig = { ...match.config, name: match.name || match.config?.name || targetSlug };
              this.products = (Array.isArray(match.products) ? [...match.products] : []).map(p => this.migrateProduct(p));
              this.categories = Array.isArray(match.categories) ? [...match.categories] : [];
              this.catalogs = Array.isArray(match.catalogs) && match.catalogs.length > 0 ? [...match.catalogs] : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }];
              if (match.preset) this.activePreset = match.preset;
              loaded = true;
            }
          }

          // 4. Buscar en plantillas predefinidas
          if (!loaded) {
            const matchedPreset = Object.values(BUSINESS_PRESETS).find(p => p.config && p.config.storeSlug === targetSlug);
            if (matchedPreset) {
              this.shopConfig = { ...matchedPreset.config };
              this.products = [...matchedPreset.products].map(p => this.migrateProduct(p));
              loaded = true;
            }
          }
        }
      }

      // 4. Determinar el modo inicial según usuario
      const prodParam = urlParams.get("p");
      const modeParam = urlParams.get("mode");

      if (catParam || prodParam || modeParam === "shop" || mesaParam || rawCompressed || sheetParam || tiendaParam) {
        // MODO USUARIO FINAL (El comprador que ve el catálogo, compra y paga)
        this.isCustomerOnlyMode = true;
        ViewController.showCustomerPreview();
        if (prodParam) {
          setTimeout(() => {
            const matchedProd = this.products.find(p => p.id === prodParam || p.sku === prodParam);
            if (matchedProd) {
              CustomerUI.openProductModal(matchedProd.id);
              Toast.show(`Mostrando producto: ${matchedProd.name}`, "🔴");
            }
          }, 350);
        }
      } else {
        // MODO CLIENTE (El dueño de negocio que crea su catálogo)
        const stepParam = urlParams.get("step");
        const wizardParam = urlParams.get("wizard") || urlParams.get("onboarding") || urlParams.get("nuevo");
        const resetParam = urlParams.get("reset");

        if (resetParam === "true" || resetParam === "1") {
          localStorage.removeItem("tiendazap_onboarding_done");
          ViewController.showOnboarding(0);
        } else if (modeParam === "studio") {
          ViewController.showStudio();
        } else if (stepParam !== null || wizardParam !== null) {
          ViewController.showOnboarding(parseInt(stepParam, 10) || 0);
        } else if (!isDone) {
          // Iniciar como app de 0 con el Asistente estilo WhatsApp Business
          ViewController.showOnboarding(0);
        } else {
          ViewController.showStudio();
        }
      }

      // 4. Si tiene Google Sheets configurado, sincronizar
      if (!this.isViewingRemoteCatalog) {
        this.initStores();
        this.loadCartForCurrentStore();
        this.applyStoreTheme();
      }
      if (this.shopConfig.googleSheetUrl) {
        this.fetchGoogleSheetData(this.shopConfig.googleSheetUrl, false);
      }
    } catch (e) {
      console.warn("Error inicializando estado local:", e);
    }
  },

  initCategories() {
    const storedCats = localStorage.getItem("tiendazap_categories");
    if (storedCats && (!this.categories || this.categories.length === 0)) {
      try {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.categories = parsed.map((c, i) => {
            if (typeof c === "string") {
              const clean = c.trim();
              return clean && clean !== "undefined" ? { id: "cat_" + (i + 1), name: clean, icon: CustomerUI.getCategoryIcon(clean) } : null;
            }
            const cleanName = (c && c.name && c.name !== "undefined") ? c.name.trim() : "";
            return cleanName ? {
              id: c.id || "cat_" + (i + 1),
              name: cleanName,
              icon: c.icon || CustomerUI.getCategoryIcon(cleanName)
            } : null;
          }).filter(Boolean);
        }
      } catch (e) {
        console.warn("Error leyendo categorías almacenadas:", e);
      }
    }

    // Si aún no hay categorías, sembrar desde productos existentes o presets
    if (!this.categories || this.categories.length === 0) {
      const prodCats = [...new Set(this.products.map(p => (p.category || "").trim()).filter(c => c && c !== "undefined"))];
      const nicheCats = NICHE_DATA[this.activePreset]?.suggestedCategories || NICHE_DATA.general.suggestedCategories || [];
      const combined = [...new Set([...prodCats, ...nicheCats])];
      this.categories = combined.map((name, i) => ({
        id: "cat_" + (i + 1),
        name: name,
        icon: CustomerUI.getCategoryIcon(name)
      }));
      this.saveCategories();
    } else {
      // Asegurar que si hay productos con una categoría nueva, se añada automáticamente
      let changed = false;
      this.products.forEach(p => {
        const cName = (p.category || "").trim();
        if (cName && cName !== "undefined" && !this.categories.some(c => c.name.toLowerCase() === cName.toLowerCase())) {
          this.categories.push({
            id: "cat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
            name: cName,
            icon: CustomerUI.getCategoryIcon(cName)
          });
          changed = true;
        }
      });
      if (changed) this.saveCategories();
    }
  },

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error(`Error guardando en localStorage [${key}]:`, e);
      if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
        Toast.show("⚠️ Memoria llena: usa imágenes más ligeras o enlaces externos", "⚠️");
      } else {
        Toast.show("Error al guardar datos localmente", "❌");
      }
      return false;
    }
  },

  saveCategories() {
    this.safeSetItem("tiendazap_categories", JSON.stringify(this.categories));
    this.saveCurrentStoreState();
  },

  // ==========================================================================
  // GESTIÓN DE MÚLTIPLES CATÁLOGOS POR TIENDA (ETAPA 2)
  // ==========================================================================
  initCatalogs() {
    let stored = null;
    try {
      const raw = localStorage.getItem("tiendazap_catalogs");
      if (raw) stored = JSON.parse(raw);
    } catch (e) {}

    if (Array.isArray(stored) && stored.length > 0) {
      this.catalogs = stored;
    } else if (!this.catalogs || this.catalogs.length === 0) {
      this.catalogs = [
        { id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }
      ];
    }

    // Asegurar que siempre exista el Catálogo Principal por defecto
    if (!this.catalogs.some(c => c.isDefault || c.id === "cat_main")) {
      this.catalogs.unshift({ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true });
    }

    // Validar que activeStudioCatalogId apunte a un catálogo existente
    if (this.activeStudioCatalogId !== "all" && !this.catalogs.some(c => c.id === this.activeStudioCatalogId)) {
      this.activeStudioCatalogId = "all";
    }

    this.saveCatalogs();
  },

  saveCatalogs() {
    if (this.isViewingRemoteCatalog) return;
    this.safeSetItem("tiendazap_catalogs", JSON.stringify(this.catalogs || []));
    this.saveCurrentStoreState();
  },

  addCatalog(name) {
    const cleanName = (name || "").trim();
    if (!cleanName) {
      Toast.show("Por favor ingresa un nombre para el catálogo", "⚠️");
      return { ok: false, msg: "Por favor ingresa un nombre para el catálogo." };
    }
    const cleanSlug = slugifyStoreName(cleanName);
    const exists = (this.catalogs || []).some(
      c => c.name.toLowerCase() === cleanName.toLowerCase() || c.slug === cleanSlug
    );
    if (exists) {
      Toast.show(`Ya existe un catálogo llamado "${cleanName}"`, "⚠️");
      return { ok: false, msg: `Ya existe un catálogo llamado "${cleanName}".` };
    }
    const newCat = {
      id: "cat_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 4),
      name: cleanName,
      slug: cleanSlug,
      isDefault: false
    };
    this.catalogs.push(newCat);
    this.activeStudioCatalogId = newCat.id;
    this.saveCatalogs();
    if (typeof StudioController !== "undefined") {
      StudioController.renderCatalogsBar();
      StudioController.renderProductsList();
    }
    Toast.show(`Catálogo "${cleanName}" creado`, "📁");
    return { ok: true, catalog: newCat };
  },

  renameCatalog(id, newName) {
    const cleanName = (newName || "").trim();
    if (!cleanName) {
      Toast.show("El nombre no puede estar vacío", "⚠️");
      return { ok: false, msg: "El nombre no puede estar vacío." };
    }
    const target = (this.catalogs || []).find(c => c.id === id);
    if (!target) return { ok: false, msg: "Catálogo no encontrado." };

    const cleanSlug = slugifyStoreName(cleanName);
    const exists = (this.catalogs || []).some(
      c => c.id !== id && (c.name.toLowerCase() === cleanName.toLowerCase() || c.slug === cleanSlug)
    );
    if (exists) {
      Toast.show(`Ya existe otro catálogo con ese nombre`, "⚠️");
      return { ok: false, msg: `Ya existe otro catálogo con ese nombre.` };
    }

    target.name = cleanName;
    if (!target.isDefault && target.id !== "cat_main") {
      target.slug = cleanSlug;
    }
    this.saveCatalogs();
    if (typeof StudioController !== "undefined") {
      StudioController.renderCatalogsBar();
      StudioController.renderProductsList();
    }
    Toast.show(`Catálogo renombrado a "${cleanName}"`, "✏️");
    return { ok: true, catalog: target };
  },

  deleteCatalog(id) {
    const target = (this.catalogs || []).find(c => c.id === id);
    if (!target) return { ok: false, msg: "Catálogo no encontrado." };
    if (target.isDefault || target.id === "cat_main") {
      Toast.show("No se puede eliminar el Catálogo Principal", "⚠️");
      return { ok: false, msg: "No se puede eliminar el Catálogo Principal." };
    }

    let reassigned = 0;
    (this.products || []).forEach(p => {
      if (p.catalogId === id) {
        p.catalogId = "cat_main";
        reassigned++;
      }
    });
    if (reassigned > 0) {
      this.saveProducts();
    }

    this.catalogs = this.catalogs.filter(c => c.id !== id);
    if (this.activeStudioCatalogId === id) {
      this.activeStudioCatalogId = "all";
    }
    this.saveCatalogs();

    if (typeof StudioController !== "undefined") {
      StudioController.renderCatalogsBar();
      StudioController.renderProductsList();
    }
    Toast.show(`Catálogo eliminado. ${reassigned} producto(s) en Principal`, "🗑️");
    return { ok: true, reassigned };
  },

  getCategoriesList() {
    if (!this.categories || this.categories.length === 0) {
      this.initCategories();
    }
    // Filtrar categorías con nombre inválido o 'undefined' o 'null'
    this.categories = (this.categories || []).filter(c => {
      const n = typeof c === "string" ? c.trim() : (c && c.name ? String(c.name).trim() : "");
      return n && n.toLowerCase() !== "undefined" && n.toLowerCase() !== "null" && n.toLowerCase() !== "[object object]";
    });

    // Sanitizar productos y registrar cualquier categoría nueva que tengan
    (this.products || []).forEach(p => {
      this.migrateProduct(p);
      const catName = (p.category || "").trim();
      if (!catName || catName.toLowerCase() === "undefined" || catName.toLowerCase() === "null") {
        p.category = (p.listingType === "digital" || this.activePreset === "tech" || this.activePreset === "digital") ? "Licencias & Software" : "General";
      }
      const finalCat = p.category.trim();
      if (!this.categories.some(c => (typeof c === "string" ? c : (c.name || "")).toLowerCase() === finalCat.toLowerCase())) {
        this.categories.push({
          id: "cat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
          name: finalCat,
          icon: CustomerUI.getCategoryIcon(finalCat)
        });
      }
    });

    // Calcular conteo reactivo de productos para cada categoría registrada
    return (this.categories || [])
      .map(c => {
        const cName = (typeof c === "string" ? c : (c && c.name ? c.name : "")).trim();
        if (!cName || cName.toLowerCase() === "undefined" || cName.toLowerCase() === "null") return null;
        const count = this.products.filter(p => (p.category || "").trim().toLowerCase() === cName.toLowerCase()).length;
        const rawLabel = (c && c.label && typeof c.label === "string") ? c.label.trim() : "";
        const cleanLabel = (rawLabel && rawLabel.toLowerCase() !== "undefined" && rawLabel.toLowerCase() !== "null") ? rawLabel : cName;
        return {
          id: c.id || ("cat_" + cName),
          name: cName,
          label: cleanLabel,
          icon: (c && c.icon) || CustomerUI.getCategoryIcon(cName),
          count
        };
      })
      .filter(Boolean);
  },

  addCategory(rawName, rawIcon) {
    const name = (rawName || "").trim();
    if (!name) return { ok: false, msg: "Por favor ingresa un nombre para la categoría." };

    const exists = this.categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return { ok: false, msg: `La categoría "${name}" ya existe en tu catálogo.` };

    const icon = rawIcon || CustomerUI.getCategoryIcon(name);
    const newCat = {
      id: "cat_" + Date.now(),
      name: name,
      icon: icon
    };
    this.categories.push(newCat);
    this.saveCategories();

    StudioController.renderCategoryFilters();
    StudioController.renderEditorCategoryChips();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    return { ok: true, cat: newCat };
  },

  renameCategory(oldName, rawNewName, newIcon) {
    const newName = (rawNewName || "").trim();
    if (!newName) return { ok: false, msg: "El nombre nuevo no puede estar en blanco." };

    const idx = this.categories.findIndex(c => c.name.toLowerCase() === oldName.toLowerCase());
    if (idx === -1) return { ok: false, msg: "Categoría no encontrada." };

    // Si cambió el nombre y el nuevo ya existe en otra categoría
    if (oldName.toLowerCase() !== newName.toLowerCase()) {
      const exists = this.categories.some(c => c.name.toLowerCase() === newName.toLowerCase());
      if (exists) return { ok: false, msg: `Ya existe otra categoría llamada "${newName}".` };
    }

    this.categories[idx].name = newName;
    if (newIcon) this.categories[idx].icon = newIcon;
    this.saveCategories();

    // Actualizar en cascada todos los productos vinculados
    let updatedCount = 0;
    this.products.forEach(p => {
      if ((p.category || "").trim().toLowerCase() === oldName.toLowerCase()) {
        p.category = newName;
        updatedCount++;
      }
    });
    if (updatedCount > 0) this.saveProducts();

    if (this.studioCategory && this.studioCategory.toLowerCase() === oldName.toLowerCase()) {
      this.studioCategory = newName;
    }
    if (this.customerCategory && this.customerCategory.toLowerCase() === oldName.toLowerCase()) {
      this.customerCategory = newName;
    }

    StudioController.renderAll();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    return { ok: true, count: updatedCount };
  },

  deleteCategory(catName, targetCatName = "General") {
    const idx = this.categories.findIndex(c => c.name.toLowerCase() === catName.toLowerCase());
    if (idx === -1) return { ok: false, msg: "Categoría no encontrada." };

    const prodsInCategory = this.products.filter(p => (p.category || "").trim().toLowerCase() === catName.toLowerCase());

    if (prodsInCategory.length > 0) {
      const cleanTarget = (targetCatName || "General").trim();
      // Si la categoría de destino no existe, la registramos
      if (!this.categories.some(c => c.name.toLowerCase() === cleanTarget.toLowerCase())) {
        this.categories.push({
          id: "cat_" + Date.now(),
          name: cleanTarget,
          icon: CustomerUI.getCategoryIcon(cleanTarget)
        });
      }
      prodsInCategory.forEach(p => {
        p.category = cleanTarget;
      });
      this.saveProducts();
    }

    this.categories.splice(idx, 1);
    this.saveCategories();

    if (this.studioCategory && this.studioCategory.toLowerCase() === catName.toLowerCase()) {
      this.studioCategory = "all";
    }
    if (this.customerCategory && this.customerCategory.toLowerCase() === catName.toLowerCase()) {
      this.customerCategory = "all";
    }

    StudioController.renderAll();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    return { ok: true, reallocated: prodsInCategory.length };
  },

  reorderCategory(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.categories.length) return;
    const temp = this.categories[index];
    this.categories[index] = this.categories[targetIdx];
    this.categories[targetIdx] = temp;
    this.saveCategories();
    StudioController.renderCategoryFilters();
    StudioController.renderCategoryManagerList();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
  },

  saveMerchant() {
    this.safeSetItem("tiendazap_merchant", JSON.stringify(this.merchant));
  },

  saveConfig() {
    if (this.isViewingRemoteCatalog) return;
    this.safeSetItem("tiendazap_config", JSON.stringify(this.shopConfig));
    this.safeSetItem("tiendazap_preset", this.activePreset || "general");
    this.saveCurrentStoreState();
  },

  saveProducts() {
    if (this.isViewingRemoteCatalog) return;
    this.safeSetItem("tiendazap_products", JSON.stringify(this.products));
    this.saveCurrentStoreState();
  },

  getCartStorageKey() {
    const sId = this.currentStoreId || ("store_" + (this.getStoreSlug() || "principal"));
    return "tiendazap_cart_" + sId;
  },

  saveCart() {
    const key = this.getCartStorageKey();
    this.safeSetItem(key, JSON.stringify(this.cart || {}));
  },

  loadCartForCurrentStore() {
    try {
      const key = this.getCartStorageKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        this.cart = JSON.parse(saved) || {};
      } else {
        this.cart = {};
      }
    } catch (e) {
      this.cart = {};
    }
  },

  saveClientData(name, phone, address) {
    this.safeSetItem("tiendazap_client", JSON.stringify({ name, phone, address }));
  },

  applyPreset(presetKey) {
    if (!BUSINESS_PRESETS[presetKey]) return;
    this.activePreset = presetKey;
    this.shopConfig = { ...BUSINESS_PRESETS[presetKey].config };
    this.products = [...BUSINESS_PRESETS[presetKey].products];
    this.cart = {};

    const nicheCats = NICHE_DATA[presetKey]?.suggestedCategories || [];
    this.categories = nicheCats.map((name, i) => ({
      id: "cat_" + (i + 1),
      name: name,
      icon: CustomerUI.getCategoryIcon(name)
    }));
    this.saveCategories();

    localStorage.setItem("tiendazap_preset", presetKey);
    this.saveConfig();
    this.saveProducts();
    this.saveCart();

    StudioController.renderAll();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    CustomerUI.updateCartBar();

    Toast.show(`Plantilla cargada: ${this.shopConfig.name}`, "✨");
  },

  async fetchGoogleSheetData(url, showAlert = true) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo conectar a Google Sheets");
      const csvText = await res.text();
      const parsedProducts = this.parseCSVToProducts(csvText);

      if (parsedProducts && parsedProducts.length > 0) {
        this.products = parsedProducts;
        this.saveProducts();
        StudioController.renderProductsList();
        StudioController.renderCategoryFilters();
        CustomerUI.renderCategoryTabs();
        CustomerUI.renderProductCards();
        if (showAlert) Toast.show(`Sincronizados ${parsedProducts.length} productos desde Google Sheets`, "🎉");
      }
    } catch (err) {
      console.error("Error al sincronizar Google Sheets:", err);
      if (showAlert) alert("No se pudo leer la hoja de Google Sheets. Asegúrate de que esté 'Publicada en la Web' como CSV.");
    }
  },

  parseCSVToProducts(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return null;

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
      if (row.length < 2) continue;

      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] || "";
      });

      if (obj.nombre || obj.name) {
        const sizesStr = obj.tallas || obj.sizes || "";
        const colorsStr = obj.colores || obj.colors || "";

        products.push({
          id: obj.id || "gs_" + i,
          sku: obj.sku || obj.codigo || `COD-${i}`,
          name: obj.nombre || obj.name || "Producto",
          category: obj.categoria || obj.category || "General",
          price: parseFloat(obj.precio || obj.price || "0") || 0,
          desc: obj.descripcion || obj.desc || "",
          img: obj.imagen || obj.img || "",
          sizes: sizesStr ? sizesStr.split(",").map(s => s.trim()).filter(Boolean) : [],
          colors: colorsStr ? colorsStr.split(",").map(c => c.trim()).filter(Boolean) : [],
          promo: (obj.promo || "").toLowerCase() === "true" || (obj.promo || "").toLowerCase() === "si",
          available: (obj.disponible || obj.available || "true").toLowerCase() !== "false"
        });
      }
    }
    return products;
  }
};

// ============================================================================
// 3. UTILIDADES: COMPRESIÓN DE IMÁGENES CANVAS (EXPERIENCIA EXPERTA)
// ============================================================================
const ImageOptimizer = {
  compressImage(file, maxDimension = 640, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// ============================================================================
// 3.5. TEMA GLOBAL DE LA APLICACIÓN (MODO CLARO / OSCURO PARA STUDIO Y REGISTRO)
// ============================================================================
const AppTheme = {
  currentTheme: "light",
  init() {
    const saved = localStorage.getItem("tiendazap_app_theme");
    this.currentTheme = (saved === "dark") ? "dark" : "light";
    this.apply();
  },
  toggle() {
    this.currentTheme = (this.currentTheme === "light") ? "dark" : "light";
    localStorage.setItem("tiendazap_app_theme", this.currentTheme);
    this.apply();
    if (typeof Toast !== "undefined") {
      Toast.show(`Modo ${this.currentTheme === "dark" ? "Oscuro" : "Claro"} activado`, this.currentTheme === "dark" ? "🌙" : "☀️");
    }
  },
  apply() {
    document.body.setAttribute("data-app-theme", this.currentTheme);
    document.documentElement.setAttribute("data-app-theme", this.currentTheme);
    const sunIcon = document.getElementById("app-theme-icon-sun");
    const moonIcon = document.getElementById("app-theme-icon-moon");
    if (sunIcon && moonIcon) {
      if (this.currentTheme === "dark") {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      } else {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      }
    }
  }
};
window.AppTheme = AppTheme;

// ============================================================================
// 4. CONTROLADOR DE VISTAS (ONBOARDING vs STUDIO vs VISTA PREVIA CLIENTE)
// ============================================================================
const ViewController = {
  showOnboarding(step = 0) {
    const obScreen = document.getElementById("onboarding-screen");
    const studioView = document.getElementById("admin-studio-view");
    const previewView = document.getElementById("customer-preview-view");

    if (obScreen) {
      obScreen.classList.remove("hidden");
      obScreen.classList.add("active");
    }
    if (studioView) {
      studioView.classList.add("hidden");
      studioView.classList.remove("active");
    }
    if (previewView) {
      previewView.classList.add("hidden");
      previewView.classList.remove("active");
    }

    OnboardingWizard.goToStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showStudio() {
    if (AppState.merchant && AppState.merchant.pin && AppState.merchant.pin.length >= 4) {
      if (sessionStorage.getItem("tiendazap_pin_unlocked") !== "true") {
        const enteredPin = prompt("🔒 Ingresa tu PIN de seguridad (4 a 6 dígitos) para acceder al panel de administración:");
        if (!enteredPin || enteredPin.trim() !== AppState.merchant.pin.trim()) {
          Toast.show("PIN incorrecto o acceso denegado", "🔒");
          return;
        }
        sessionStorage.setItem("tiendazap_pin_unlocked", "true");
      }
    }

    const obScreen = document.getElementById("onboarding-screen");
    const studioView = document.getElementById("admin-studio-view");
    const previewView = document.getElementById("customer-preview-view");

    if (obScreen) {
      obScreen.classList.add("hidden");
      obScreen.classList.remove("active");
    }
    if (studioView) {
      studioView.classList.remove("hidden");
      studioView.classList.add("active");
    }
    if (previewView) {
      previewView.classList.add("hidden");
      previewView.classList.remove("active");
    }

    document.body.classList.remove("has-preview-bar");

    StudioController.renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showCustomerPreview() {
    const obScreen = document.getElementById("onboarding-screen");
    const studioView = document.getElementById("admin-studio-view");
    const previewView = document.getElementById("customer-preview-view");
    const previewBar = document.querySelector(".preview-mode-bar");

    if (obScreen) {
      obScreen.classList.add("hidden");
      obScreen.classList.remove("active");
    }
    if (studioView) {
      studioView.classList.add("hidden");
      studioView.classList.remove("active");
    }
    if (previewView) {
      previewView.classList.remove("hidden");
      previewView.classList.add("active");
    }

    if (previewBar) {
      if (AppState.isCustomerOnlyMode) {
        previewBar.classList.add("hidden");
        document.body.classList.remove("has-preview-bar");
      } else {
        previewBar.classList.remove("hidden");
        document.body.classList.add("has-preview-bar");
      }
    } else {
      document.body.classList.remove("has-preview-bar");
    }

    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    CustomerUI.updateCartBar();
    CustomerUI.renderYapeCheckoutBox();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showCustomerView() {
    AppState.isCustomerOnlyMode = true;
    this.showCustomerPreview();
  }
};

// ============================================================================
// 5. ASISTENTE ONBOARDING GUIADO PASO A PASO (BIENVENIDA AMIGABLE)
// ============================================================================
const OnboardingWizard = {
  currentStep: 0,
  uploadedLogo: "",
  uploadedBanner: "",
  uploadedProdImg: "",

  goToStep(step) {
    this.currentStep = step;
    const obScreen = document.getElementById("onboarding-screen");
    if (obScreen) {
      obScreen.classList.remove("hidden");
      obScreen.classList.add("active");
    }
    // Mostrar únicamente la pantalla solicitada (0 a 4)
    for (let i = 0; i <= 4; i++) {
      const stepEl = document.getElementById(`onboarding-step-${i}`);
      if (stepEl) {
        if (i === step) {
          stepEl.classList.remove("hidden");
          stepEl.classList.add("active");
        } else {
          stepEl.classList.add("hidden");
          stepEl.classList.remove("active");
        }
      }
    }
    if (step === 0) {
      const resumeLink = document.getElementById("onboarding-btn-resume");
      const hasExistingStore = !!(AppState.stores && AppState.stores.length > 0 && AppState.shopConfig?.name);
      if (resumeLink) {
        resumeLink.classList.toggle("hidden", !hasExistingStore);
      }
    } else if (step === 1) {
      const emailInp = document.getElementById("ob-owner-email");
      if (emailInp && !emailInp.value && AppState.merchant?.email) {
        emailInp.value = AppState.merchant.email;
      }
      const nameInp = document.getElementById("ob-store-name");
      if (nameInp) setTimeout(() => nameInp.focus(), 150);
    } else if (step === 2) {
      const storeEmailInp = document.getElementById("ob-store-email");
      const ownerEmailInp = document.getElementById("ob-owner-email");
      if (storeEmailInp && !storeEmailInp.value && ownerEmailInp && ownerEmailInp.value) {
        storeEmailInp.value = ownerEmailInp.value;
      }
    } else if (step === 3) {
      const phoneInp = document.getElementById("ob-store-phone");
      if (phoneInp) setTimeout(() => phoneInp.focus(), 150);
    } else if (step === 4) {
      const prodNameInp = document.getElementById("ob-prod-name");
      if (prodNameInp) setTimeout(() => prodNameInp.focus(), 150);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Pantalla 0: Comenzar paso a paso
    const startBtn = document.getElementById("onboarding-btn-start");
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToStep(1);
      });
    }

    // Pantalla 0: Entrar a mi panel (si ya existe tienda guardada)
    const resumeBtn = document.getElementById("onboarding-btn-resume");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const screen = document.getElementById("onboarding-screen");
        if (screen) {
          screen.classList.add("hidden");
          screen.classList.remove("active");
        }
        ViewController.showStudio();
      });
    }

    // Botones de Atrás (data-back-to)
    document.querySelectorAll(".onboarding-back-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const backTo = parseInt(btn.getAttribute("data-back-to") || "0", 10);
        this.goToStep(backTo);
      });
    });

    // ------------------------------------------------------------------------
    // PASO 1: Tu Cuenta y Negocio
    // ------------------------------------------------------------------------
    const ownerEmailInp = document.getElementById("ob-owner-email");
    const emailError = document.getElementById("ob-email-error");
    if (ownerEmailInp) {
      ownerEmailInp.addEventListener("input", () => {
        if (ownerEmailInp.value.trim() && emailError) {
          emailError.classList.add("hidden");
          ownerEmailInp.classList.remove("input-error");
        }
      });
    }

    const nameInput = document.getElementById("ob-store-name") || document.getElementById("onboarding-store-name");
    const slugPreview = document.getElementById("ob-slug-preview") || document.getElementById("onboarding-slug-text");
    const nameError = document.getElementById("ob-name-error") || document.getElementById("onboarding-name-error");
    if (nameInput) {
      nameInput.addEventListener("input", () => {
        const val = nameInput.value.trim();
        if (slugPreview) {
          slugPreview.textContent = val ? slugifyStoreName(val) : "tu-marca";
        }
        if (val && nameError) {
          nameError.classList.add("hidden");
          nameInput.classList.remove("input-error");
        }
      });
    }

    // Chips de Rubro Principal (8 rubros canónicos)
    const nicheChips = document.querySelectorAll(".ob-niche-chip, .niche-card-select");
    const nicheHidden = document.getElementById("ob-selected-niche") || document.getElementById("onboarding-selected-niche");
    const storeDescInp = document.getElementById("ob-store-desc");
    const prodCatInp = document.getElementById("ob-prod-cat");
    const currSymStep4 = document.getElementById("ob-prod-curr-sym");

    nicheChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        nicheChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const chosen = chip.getAttribute("data-niche") || "sneakers";
        if (nicheHidden) nicheHidden.value = chosen;

        // Autocompletar sugerencia amigable si está vacío o tiene una sugerencia previa
        if (storeDescInp) {
          const currentVal = storeDescInp.value.trim();
          const isDefaultTagline = Object.values(NICHE_DEFAULT_TAGLINES).includes(currentVal);
          if (!currentVal || isDefaultTagline) {
            storeDescInp.value = NICHE_DEFAULT_TAGLINES[chosen] || "";
          }
        }

        // Prellenar categoría en Paso 4
        if (prodCatInp) {
          prodCatInp.value = NICHE_DEFAULT_PROD_CATS[chosen] || "General";
        }

        // Auto-switch a US$ si eligen vehículos
        if (chosen === "vehicles") {
          const currencyHidden = document.getElementById("ob-selected-currency") || document.getElementById("onboarding-selected-currency");
          if (currencyHidden) currencyHidden.value = "US$";
          document.querySelectorAll(".currency-card-btn").forEach(b => {
            b.classList.toggle("active", b.getAttribute("data-currency") === "US$");
          });
          if (currSymStep4) currSymStep4.textContent = "US$";
        }
      });
    });

    // Paso 1: Botón Siguiente
    const step1Next = document.getElementById("ob-btn-step1-next") || document.getElementById("onboarding-btn-step1-next");
    if (step1Next) {
      step1Next.addEventListener("click", (e) => {
        e.preventDefault();
        const emailVal = ownerEmailInp ? ownerEmailInp.value.trim() : "";
        const nameVal = nameInput ? nameInput.value.trim() : "";

        if (!emailVal || !emailVal.includes("@")) {
          if (emailError) emailError.classList.remove("hidden");
          if (ownerEmailInp) {
            ownerEmailInp.classList.add("input-error");
            ownerEmailInp.focus();
          }
          return;
        }
        if (emailError) emailError.classList.add("hidden");

        if (!nameVal) {
          if (nameError) nameError.classList.remove("hidden");
          if (nameInput) {
            nameInput.classList.add("input-error");
            nameInput.focus();
          }
          return;
        }
        if (nameError) nameError.classList.add("hidden");

        // Guardar email del propietario
        AppState.merchant.email = emailVal;
        AppState.saveMerchant();

        this.goToStep(2);
      });
    }

    // ------------------------------------------------------------------------
    // PASO 2: Perfil de Empresa (WhatsApp Business — Todo Opcional)
    // ------------------------------------------------------------------------
    // Logo Upload
    const logoBox = document.getElementById("ob-logo-box");
    const logoFile = document.getElementById("ob-logo-file");
    const logoPreview = document.getElementById("ob-logo-preview");
    const logoPlaceholder = document.getElementById("ob-logo-placeholder");
    if (logoBox && logoFile) {
      logoBox.addEventListener("click", () => logoFile.click());
      logoFile.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          Toast.show("Optimizando logo...", "⏳");
          const compressed = await ImageOptimizer.compressImage(file, 400, 0.88);
          this.uploadedLogo = compressed;
          if (logoPreview) {
            logoPreview.src = compressed;
            logoPreview.classList.remove("hidden");
          }
          if (logoPlaceholder) logoPlaceholder.classList.add("hidden");
          Toast.show("¡Logo listo para tu tienda!", "✨");
        } catch (err) {
          alert("Error al cargar logo: " + err.message);
        }
      });
    }

    // Banner Upload
    const bannerBox = document.getElementById("ob-banner-box");
    const bannerFile = document.getElementById("ob-banner-file");
    const bannerPreview = document.getElementById("ob-banner-preview");
    const bannerPlaceholder = document.getElementById("ob-banner-placeholder");
    if (bannerBox && bannerFile) {
      bannerBox.addEventListener("click", () => bannerFile.click());
      bannerFile.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          Toast.show("Optimizando portada...", "⏳");
          const compressed = await ImageOptimizer.compressImage(file, 1200, 0.85);
          this.uploadedBanner = compressed;
          if (bannerPreview) {
            bannerPreview.src = compressed;
            bannerPreview.classList.remove("hidden");
          }
          if (bannerPlaceholder) bannerPlaceholder.classList.add("hidden");
          Toast.show("¡Foto de portada lista!", "📸");
        } catch (err) {
          alert("Error al cargar portada: " + err.message);
        }
      });
    }

    // Botón copiar correo del propietario al correo de la tienda
    const copyOwnerEmailBtn = document.getElementById("ob-btn-copy-owner-email");
    const storeEmailInp = document.getElementById("ob-store-email");
    if (copyOwnerEmailBtn && storeEmailInp) {
      copyOwnerEmailBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const em = (ownerEmailInp ? ownerEmailInp.value.trim() : "") || AppState.merchant?.email || "";
        if (em) {
          storeEmailInp.value = em;
          Toast.show("Correo de registro aplicado a tu tienda", "✅");
        }
      });
    }

    // Chips rápidos de horario
    const hoursChips = document.querySelectorAll(".ob-chip-btn");
    const storeHoursInp = document.getElementById("ob-store-hours");
    hoursChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        const val = chip.getAttribute("data-hours");
        if (storeHoursInp && val) {
          storeHoursInp.value = val;
        }
      });
    });

    // Paso 2: Botón Continuar y Saltar
    const step2Next = document.getElementById("ob-btn-step2-next");
    if (step2Next) {
      step2Next.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToStep(3);
      });
    }
    const step2Skip = document.getElementById("ob-btn-step2-skip");
    if (step2Skip) {
      step2Skip.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToStep(3);
      });
    }

    // ------------------------------------------------------------------------
    // PASO 3: WhatsApp y Cobros
    // ------------------------------------------------------------------------
    const phoneInput = document.getElementById("ob-store-phone") || document.getElementById("onboarding-store-phone");
    const phoneError = document.getElementById("ob-phone-error") || document.getElementById("onboarding-phone-error");
    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        const raw = phoneInput.value.replace(/[^0-9]/g, "");
        if (raw.length >= 9 && phoneError) {
          phoneError.classList.add("hidden");
          phoneInput.classList.remove("input-error");
        }
      });
    }

    // Moneda (S/ o US$)
    const currencyButtons = document.querySelectorAll(".currency-card-btn");
    const currencyHidden = document.getElementById("ob-selected-currency") || document.getElementById("onboarding-selected-currency");
    currencyButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        currencyButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const curr = btn.getAttribute("data-currency") || "S/";
        if (currencyHidden) currencyHidden.value = curr;
        if (currSymStep4) currSymStep4.textContent = curr;
      });
    });

    // Copiar WhatsApp a Yape
    const copyWaBtn = document.getElementById("ob-btn-copy-wa") || document.getElementById("onboarding-btn-copy-wa");
    const yapeInput = document.getElementById("ob-store-yape") || document.getElementById("onboarding-store-yape");
    if (copyWaBtn && phoneInput && yapeInput) {
      copyWaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        yapeInput.value = phoneInput.value.trim();
        Toast.show("Número copiado a Yape / Plin", "✅");
      });
    }

    // Paso 3: Botón Siguiente
    const step3Next = document.getElementById("ob-btn-step3-next") || document.getElementById("onboarding-btn-step2-next");
    if (step3Next) {
      step3Next.addEventListener("click", (e) => {
        e.preventDefault();
        const rawPhone = (phoneInput ? phoneInput.value : "").replace(/[^0-9]/g, "");
        if (rawPhone.length < 9) {
          if (phoneError) phoneError.classList.remove("hidden");
          if (phoneInput) {
            phoneInput.classList.add("input-error");
            phoneInput.focus();
          }
          return;
        }
        if (phoneError) phoneError.classList.add("hidden");
        this.goToStep(4);
      });
    }

    // ------------------------------------------------------------------------
    // PASO 4: Crea tu Primer Producto (Opcional)
    // ------------------------------------------------------------------------
    const prodImgBox = document.getElementById("ob-prod-img-box");
    const prodImgFile = document.getElementById("ob-prod-file-input");
    const prodImgPreview = document.getElementById("ob-prod-img-preview");
    const prodImgPlaceholder = document.getElementById("ob-prod-img-placeholder");
    if (prodImgBox && prodImgFile) {
      prodImgBox.addEventListener("click", () => prodImgFile.click());
      prodImgFile.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          Toast.show("Optimizando foto de producto...", "⏳");
          const compressed = await ImageOptimizer.compressImage(file, 800, 0.82);
          this.uploadedProdImg = compressed;
          if (prodImgPreview) {
            prodImgPreview.src = compressed;
            prodImgPreview.classList.remove("hidden");
          }
          if (prodImgPlaceholder) prodImgPlaceholder.classList.add("hidden");
          Toast.show("Foto del producto lista", "📸");
        } catch (err) {
          alert("Error procesando foto de producto: " + err.message);
        }
      });
    }

    // Botón Guardar Producto y Abrir Mi Tienda
    const btnSaveProd = document.getElementById("ob-btn-save-prod");
    if (btnSaveProd) {
      btnSaveProd.addEventListener("click", (e) => {
        e.preventDefault();
        this.finishOnboarding(true);
      });
    }

    // Botón Saltar y Crear Productos Después
    const btnSkipProd = document.getElementById("ob-btn-skip-prod");
    if (btnSkipProd) {
      btnSkipProd.addEventListener("click", (e) => {
        e.preventDefault();
        this.finishOnboarding(false);
      });
    }

    // Retrocompatibilidad con IDs anteriores
    const legacySubmitBtn = document.getElementById("onboarding-submit-btn");
    if (legacySubmitBtn) {
      legacySubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.finishOnboarding(false);
      });
    }
    const legacyQuickBtn = document.getElementById("btn-quick-create-store");
    if (legacyQuickBtn) {
      legacyQuickBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.finishOnboarding(false);
      });
    }
  },

  exploreDemoStore() {
    localStorage.setItem("tiendazap_onboarding_done", "true");
    AppState.isDemoExploring = true;
    const obScreen = document.getElementById("onboarding-screen");
    if (obScreen) {
      obScreen.classList.add("hidden");
      obScreen.classList.remove("active");
    }
    ViewController.showStudio();
    const headerCreateBtn = document.getElementById("studio-header-create-store-btn");
    if (headerCreateBtn) headerCreateBtn.classList.remove("hidden");
    Toast.show("Modo demostración activo. Puedes crear tu tienda arriba cuando quieras.", "🏪");
  },

  finishOnboarding(withProduct = false) {
    const ownerEmail = (document.getElementById("ob-owner-email")?.value || "").trim();
    const nameInput = document.getElementById("ob-store-name") || document.getElementById("onboarding-store-name");
    const name = nameInput ? nameInput.value.trim() : "Mi Tienda";
    if (!name) {
      this.goToStep(1);
      return;
    }

    const phoneInput = document.getElementById("ob-store-phone") || document.getElementById("onboarding-store-phone");
    const rawPhone = (phoneInput ? phoneInput.value : "").replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.startsWith("51") ? rawPhone : (rawPhone ? `51${rawPhone}` : "");

    const niche = document.getElementById("ob-selected-niche")?.value || document.getElementById("onboarding-selected-niche")?.value || "sneakers";
    const currency = document.getElementById("ob-selected-currency")?.value || document.getElementById("onboarding-selected-currency")?.value || (niche === "vehicles" ? "US$" : "S/");
    const yapeInput = document.getElementById("ob-store-yape") || document.getElementById("onboarding-store-yape");
    const yapePhone = yapeInput ? yapeInput.value.replace(/[^0-9]/g, "") : "";
    const yapeName = document.getElementById("ob-store-yape-name")?.value.trim() || "";

    const storeEmail = document.getElementById("ob-store-email")?.value.trim() || ownerEmail;
    const storeAddress = document.getElementById("ob-store-address")?.value.trim() || "";
    const storeHours = document.getElementById("ob-store-hours")?.value.trim() || "";
    const storeDesc = document.getElementById("ob-store-desc")?.value.trim() || NICHE_DEFAULT_TAGLINES[niche] || `Catálogo oficial de ${name}`;

    // Guardar correo del propietario en AppState.merchant
    if (ownerEmail) {
      AppState.merchant.email = ownerEmail;
      AppState.saveMerchant();
    }

    const newStore = AppState.createNewStore({
      name,
      preset: niche,
      phone: cleanPhone,
      currency,
      yapePhone,
      yapeName,
      email: storeEmail,
      address: storeAddress,
      hours: storeHours,
      tagline: storeDesc,
      logoUrl: this.uploadedLogo || "",
      bannerUrl: this.uploadedBanner || ""
    });

    // Crear producto opcional del Paso 4 si se ingresó nombre
    let createdFirstProd = false;
    if (withProduct) {
      const prodName = document.getElementById("ob-prod-name")?.value.trim();
      const prodPriceRaw = document.getElementById("ob-prod-price")?.value;
      const prodCat = document.getElementById("ob-prod-cat")?.value.trim() || NICHE_DEFAULT_PROD_CATS[niche] || "General";
      const prodDesc = document.getElementById("ob-prod-desc")?.value.trim() || "";

      if (prodName) {
        const prodPrice = parseFloat(prodPriceRaw) || 0;
        const newProduct = {
          id: "prod_" + Date.now(),
          sku: "PROD-001",
          name: prodName,
          price: prodPrice,
          currency: currency,
          category: prodCat,
          catalogId: "cat_main",
          desc: prodDesc,
          img: this.uploadedProdImg || "",
          images: this.uploadedProdImg ? [this.uploadedProdImg] : [],
          available: true,
          listingType: (niche === "tech" || niche === "digital") ? "digital" : (niche === "vehicles" ? "vehicle" : "item"),
          createdAt: Date.now()
        };
        AppState.products = [newProduct];
        AppState.saveProducts();
        AppState.syncActiveStoreToList();
        createdFirstProd = true;
      }
    }

    localStorage.setItem("tiendazap_onboarding_done", "true");
    AppState.isDemoExploring = false;

    const obScreen = document.getElementById("onboarding-screen");
    if (obScreen) {
      obScreen.classList.add("hidden");
      obScreen.classList.remove("active");
    }

    ViewController.showStudio();
    if (typeof StudioController !== "undefined") {
      StudioController.switchStudioTab("products");
      StudioController.renderStoreDropdown();
      StudioController.renderCatalogsBar();
      StudioController.renderProductsList();
      StudioController.populateStoreTab();
    }

    if (createdFirstProd) {
      Toast.show(`¡Listo! Tu tienda y tu primer producto fueron creados`, "✅");
    } else {
      Toast.show(`¡Listo! Tu tienda «${name}» fue creada`, "✅");
    }
  },

  submitOnboarding() {
    this.finishOnboarding(false);
  },

  submitQuickSetup() {
    this.finishOnboarding(false);
  },

  skip() {
    this.exploreDemoStore();
  },

  resetFromScratch() {
    if (confirm("¿Deseas reiniciar y comenzar de cero?")) {
      localStorage.clear();
      window.location.reload();
    }
  }
};
// ============================================================================
// 6. ZOOM DEL QR DE YAPE DEL COMERCIO
// ============================================================================
const YapeQRZoom = {
  open() {
    const modal = document.getElementById("yape-qr-zoom-modal");
    const title = document.getElementById("zoom-yape-title");
    const phone = document.getElementById("zoom-yape-phone");
    const titular = document.getElementById("zoom-yape-titular");
    const img = document.getElementById("zoom-yape-full-img");

    const shop = AppState.shopConfig;
    if (title) title.textContent = shop.name;
    if (phone) phone.textContent = shop.yapePhone || shop.phone || "987 654 321";
    if (titular) titular.textContent = shop.yapeName || shop.name || "Comercio";
    if (img) img.src = shop.yapeQrUrl || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80";

    if (modal) modal.classList.remove("hidden");
  },

  close() {
    const modal = document.getElementById("yape-qr-zoom-modal");
    if (modal) modal.classList.add("hidden");
  }
};

// ============================================================================
// 7. TIENDAZAP STUDIO (PANEL DE CONTROL DEL VENDEDOR)
// ============================================================================
const StudioController = {
  currentProductPhoto: "",
  currentProductVideo: "",
  currentProductImages: [],
  currentListingType: "item",

  renderDynamicSpecs(listingType = "item", existingSpecs = []) {
    const container = document.getElementById("editor-dynamic-specs-container");
    if (!container) return;
    const schema = MARKETPLACE_SCHEMAS[listingType] || MARKETPLACE_SCHEMAS.item;
    const specsMap = {};
    if (Array.isArray(existingSpecs)) {
      existingSpecs.forEach(s => {
        if (s && s.label) specsMap[s.label.toLowerCase()] = s.value;
      });
    }

    container.innerHTML = `
      <div class="schema-fields-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 10px;">
        ${schema.fields.map(f => {
          const val = specsMap[f.label.toLowerCase()] || "";
          if (f.type === "select") {
            return `
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.8rem;">${f.label}</label>
                <select id="spec-field-${f.id}" class="apple-input spec-input" data-spec-label="${escapeHtml(f.label)}">
                  <option value="">Seleccionar...</option>
                  ${f.options.map(opt => `<option value="${escapeHtml(opt)}" ${val === opt ? 'selected' : ''}>${escapeHtml(opt)}</option>`).join("")}
                </select>
              </div>
            `;
          }
          return `
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.8rem;">${f.label}</label>
              <input type="text" id="spec-field-${f.id}" class="apple-input spec-input" 
                     placeholder="${escapeHtml(f.placeholder || '')}" value="${escapeHtml(val)}" data-spec-label="${escapeHtml(f.label)}">
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  renderEditorPhotosStrip() {
    const strip = document.getElementById("editor-photos-strip");
    const countEl = document.getElementById("editor-photos-count");
    if (!strip) return;
    if (!Array.isArray(this.currentProductImages)) this.currentProductImages = [];
    const count = this.currentProductImages.length;
    if (countEl) countEl.textContent = String(count);

    let html = this.currentProductImages.map((url, idx) => `
      <div class="photo-thumb-slot ${idx === 0 ? "is-principal" : ""}" style="position: relative; width: 68px; height: 68px; border-radius: 8px; overflow: hidden; border: 2px solid ${idx === 0 ? "var(--store-accent, #10b981)" : "rgba(255,255,255,0.12)"}; flex-shrink: 0; cursor: pointer;" onclick="StudioController.setPrincipalEditorPhoto(${idx})">
        <img src="${url}" alt="Foto ${idx+1}" style="width: 100%; height: 100%; object-fit: cover;">
        ${idx === 0 ? `<span style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--store-accent, #10b981); color: #fff; font-size: 9px; font-weight: 700; text-align: center; padding: 1px 0; text-transform: uppercase;">Principal</span>` : ""}
        <button type="button" class="btn-remove-photo" onclick="event.stopPropagation(); StudioController.removeEditorPhoto(${idx})"
                style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.75); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
    `).join("");

    if (count < 6) {
      html += `
        <button type="button" onclick="document.getElementById('editor-file-input').click()"
                style="width: 68px; height: 68px; border-radius: 8px; border: 2px dashed rgba(255,255,255,0.2); background: rgba(255,255,255,0.03); color: #94a3b8; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; flex-shrink: 0; font-size: 0.72rem; font-weight: 600;">
          <span style="font-size: 1.1rem; line-height: 1;">+</span>
          <span>Añadir</span>
          <span style="font-size: 0.65rem; opacity: 0.7;">(${count}/6)</span>
        </button>
      `;
    }

    strip.innerHTML = html;
  },

  setPrincipalEditorPhoto(index) {
    if (index > 0 && index < this.currentProductImages.length) {
      const selected = this.currentProductImages.splice(index, 1)[0];
      this.currentProductImages.unshift(selected);
      this.currentProductPhoto = selected;
      const previewImg = document.getElementById("editor-photo-preview");
      if (previewImg) previewImg.src = selected;
      this.renderEditorPhotosStrip();
      Toast.show("Foto principal actualizada", "⭐");
    }
  },

  removeEditorPhoto(index) {
    if (index >= 0 && index < this.currentProductImages.length) {
      this.currentProductImages.splice(index, 1);
      this.currentProductPhoto = this.currentProductImages[0] || "";
      this.renderEditorPhotosStrip();
      const previewImg = document.getElementById("editor-photo-preview");
      const placeholder = document.getElementById("editor-photo-placeholder");
      if (this.currentProductPhoto && previewImg) {
        previewImg.src = this.currentProductPhoto;
        previewImg.classList.remove("hidden");
        if (placeholder) placeholder.classList.add("hidden");
      } else {
        if (previewImg) previewImg.classList.add("hidden");
        if (placeholder) placeholder.classList.remove("hidden");
      }
    }
  },

  async handleMultiPhotoUpload(files) {
    if (!files || files.length === 0) return;
    Toast.show("Optimizando fotos...", "⏳");
    if (!Array.isArray(this.currentProductImages)) this.currentProductImages = [];
    const remainingSlots = Math.max(0, 6 - this.currentProductImages.length);
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToProcess) {
      try {
        const compressed = await ImageOptimizer.compressImage(file, 850, 0.84);
        this.currentProductImages.push(compressed);
      } catch (e) {
        console.warn("Error optimizando imagen:", e);
      }
    }
    if (this.currentProductImages.length > 0) {
      this.currentProductPhoto = this.currentProductImages[0];
      const previewImg = document.getElementById("editor-photo-preview");
      const placeholder = document.getElementById("editor-photo-placeholder");
      if (previewImg) {
        previewImg.src = this.currentProductPhoto;
        previewImg.classList.remove("hidden");
      }
      if (placeholder) placeholder.classList.add("hidden");
    }
    this.renderEditorPhotosStrip();
    Toast.show(`${this.currentProductImages.length} fotos listas`, "📸");
  },

  updateVariantInputLabels() {
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const sizesLabel = document.getElementById("editor-sizes-label");
    const colorsLabel = document.getElementById("editor-colors-label");
    if (sizesLabel && nicheInfo.variantLabels?.size) {
      sizesLabel.textContent = `${nicheInfo.variantLabels.size} (separadas por coma)`;
    }
    if (colorsLabel && nicheInfo.variantLabels?.color) {
      colorsLabel.textContent = `${nicheInfo.variantLabels.color} (opcional)`;
    }
  },

  renderAll() {
    this.renderVisualCard();
    this.renderTopStatus();
    this.renderCatalogsBar();
    this.renderCategoryFilters();
    this.renderProductsList();
    this.populateStoreTab();
    this.populatePaymentsTab();
    this.renderStoresTab();
    this.renderStoreDropdown();

    const nameDisplay = document.getElementById("studio-store-name-display");
    if (nameDisplay) nameDisplay.textContent = AppState.shopConfig.name || "Mi Tienda";
    this.syncAllLogoElements(AppState.shopConfig.logoUrl);
  },

  syncAllLogoElements(url) {
    const finalUrl = url || getEffectiveStoreLogo(AppState.shopConfig);
    const el1 = document.getElementById("admin-logo-preview");
    const el2 = document.getElementById("admin-logo-preview-settings");
    const el3 = document.getElementById("settings-logo-preview");
    const el4 = document.getElementById("store-logo-img");
    const el5 = document.getElementById("studio-store-logo-display");

    if (el1) el1.src = finalUrl;
    if (el2) el2.src = finalUrl;
    if (el3) el3.src = finalUrl;
    if (el4) el4.src = finalUrl;
    if (el5) el5.src = finalUrl;

    const nameDisplay = document.getElementById("studio-store-name-display");
    if (nameDisplay) nameDisplay.textContent = AppState.shopConfig?.name || "Mi Tienda";
  },

  renderTopStatus() {
    const toggleBtn = document.getElementById("toggle-store-status-btn");
    const label = document.getElementById("quick-status-label");
    if (!toggleBtn || !label) return;

    if (AppState.shopConfig.isOpen) {
      toggleBtn.className = "apple-status-pill open";
      label.textContent = "Abierto";
    } else {
      toggleBtn.className = "apple-status-pill closed";
      label.textContent = "Cerrado";
    }
  },

  toggleStoreStatus() {
    AppState.shopConfig.isOpen = !AppState.shopConfig.isOpen;
    AppState.saveConfig();
    this.renderTopStatus();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    Toast.show(`Tienda marcada como: ${AppState.shopConfig.isOpen ? "ABIERTA" : "CERRADA"}`, AppState.shopConfig.isOpen ? "🟢" : "🔴");
  },

  renderVisualCard() {
    const bannerImg = document.getElementById("admin-banner-preview");
    const logoImg = document.getElementById("admin-logo-preview");
    const nameInput = document.getElementById("live-store-name");
    const taglineInput = document.getElementById("live-store-tagline");
    const highlightUrl = document.getElementById("highlight-store-url");

    if (bannerImg) bannerImg.src = AppState.shopConfig.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";
    if (logoImg) logoImg.src = getEffectiveStoreLogo(AppState.shopConfig);
    if (nameInput) nameInput.value = AppState.shopConfig.name || "";
    if (taglineInput) taglineInput.value = AppState.shopConfig.tagline || "";
    if (highlightUrl) {
      const slug = AppState.getStoreSlug();
      highlightUrl.textContent = `${APP_BRAND.domainHint}/${slug}`;
    }
  },

  async handleBannerUpload(file) {
    if (!file) return;
    try {
      Toast.show("Optimizando portada...", "⏳");
      const compressedUrl = await ImageOptimizer.compressImage(file, 1200, 0.85);
      AppState.shopConfig.bannerUrl = compressedUrl;
      AppState.saveConfig();

      const bannerImg = document.getElementById("admin-banner-preview");
      if (bannerImg) bannerImg.src = compressedUrl;
      AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
      Toast.show("¡Foto de portada actualizada con éxito!", "📸");
    } catch (e) {
      alert("Error procesando foto de portada: " + e.message);
    }
  },

  async handleLogoUpload(file) {
    if (!file) return;
    try {
      Toast.show("Optimizando logo...", "⏳");
      const compressedUrl = await ImageOptimizer.compressImage(file, 400, 0.88);
      AppState.shopConfig.logoUrl = compressedUrl;
      AppState.saveConfig();

      this.syncAllLogoElements(compressedUrl);
      AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
      Toast.show("¡Logo de tu negocio actualizado al instante!", "✨");
    } catch (e) {
      alert("Error procesando logo: " + e.message);
    }
  },

  async handleYapeQrUpload(file) {
    if (!file) return;
    try {
      Toast.show("Optimizando QR de Yape...", "⏳");
      const compressedUrl = await ImageOptimizer.compressImage(file, 800, 0.88);
      AppState.shopConfig.yapeQrUrl = compressedUrl;
      AppState.saveConfig();

      const preview = document.getElementById("settings-yape-qr-preview");
      const placeholder = document.getElementById("settings-yape-qr-placeholder");
      const removeBtn = document.getElementById("remove-yape-qr-btn");

      if (preview) {
        preview.src = compressedUrl;
        preview.classList.remove("hidden");
      }
      if (placeholder) placeholder.classList.add("hidden");
      if (removeBtn) removeBtn.classList.remove("hidden");

      CustomerUI.renderYapeCheckoutBox();
      Toast.show("Código QR de Yape guardado y listo", "📱");
    } catch (e) {
      alert("Error al procesar QR de Yape: " + e.message);
    }
  },

  removeYapeQr() {
    AppState.shopConfig.yapeQrUrl = "";
    AppState.saveConfig();

    const preview = document.getElementById("settings-yape-qr-preview");
    const placeholder = document.getElementById("settings-yape-qr-placeholder");
    const removeBtn = document.getElementById("remove-yape-qr-btn");

    if (preview) {
      preview.src = "";
      preview.classList.add("hidden");
    }
    if (placeholder) placeholder.classList.remove("hidden");
    if (removeBtn) removeBtn.classList.add("hidden");

    CustomerUI.renderYapeCheckoutBox();
    Toast.show("Código QR de Yape eliminado", "ℹ️");
  },

  toggleStoreDropdown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const dropdown = document.getElementById("store-switcher-dropdown");
    if (!dropdown) return;
    const isClosed = dropdown.classList.contains("hidden");
    if (isClosed) {
      this.renderStoreDropdown();
      dropdown.classList.remove("hidden");
      dropdown.setAttribute("aria-hidden", "false");
    } else {
      this.closeStoreDropdown();
    }
  },

  closeStoreDropdown() {
    const dropdown = document.getElementById("store-switcher-dropdown");
    if (dropdown) {
      dropdown.classList.add("hidden");
      dropdown.setAttribute("aria-hidden", "true");
    }
  },

  openCreateStoreModal() {
    this.closeStoreDropdown();
    const modal = document.getElementById("create-store-modal");
    if (!modal) return;

    const nameInput = document.getElementById("modal-new-store-name");
    const phoneInput = document.getElementById("modal-new-store-phone");
    const yapeInput = document.getElementById("modal-new-store-yape");
    const currencySelect = document.getElementById("modal-new-store-currency");
    const nicheInput = document.getElementById("modal-store-selected-niche");
    const chipsContainer = document.getElementById("modal-store-niche-chips");

    if (nameInput) nameInput.value = "";
    if (phoneInput) phoneInput.value = (AppState.shopConfig && AppState.shopConfig.phone) || "";
    if (yapeInput) yapeInput.value = "";
    if (currencySelect) currencySelect.value = "S/";

    const defaultNiche = "tech";
    if (nicheInput) nicheInput.value = defaultNiche;
    if (chipsContainer) {
      chipsContainer.querySelectorAll(".niche-chip, .quick-niche-chip").forEach(chip => {
        const chipNiche = chip.getAttribute("data-niche");
        if (chipNiche === defaultNiche) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 100);
    }
  },

  closeCreateStoreModal() {
    const modal = document.getElementById("create-store-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  },

  renderStoreDropdown() {
    const list = document.getElementById("dropdown-stores-list");
    const countEl = document.getElementById("dropdown-stores-count");
    if (!list) return;

    if (!AppState.storesList) AppState.initStores();
    const currentSlug = AppState.getStoreSlug();
    if (countEl) countEl.textContent = AppState.storesList.length;

    list.innerHTML = AppState.storesList.map(store => {
      const isActive = store.slug === currentSlug || store.id === AppState.currentStoreId;
      const prodCount = Array.isArray(store.products) ? store.products.length : 0;
      const logoUrl = getEffectiveStoreLogo(store.config || { name: store.name });
      const nicheLabel = getNicheLabelEs(store.preset || store.config?.niche || "general");
      const canDelete = AppState.storesList.length > 1 && !isActive;

      return `
        <div class="dropdown-store-item ${isActive ? 'active' : ''}" data-store-id="${escapeHtml(store.id)}">
          <img src="${logoUrl}" alt="${escapeHtml(store.name)}" class="dropdown-store-logo">
          <div class="dropdown-store-info">
            <div class="dropdown-store-name">${escapeHtml(store.name || "Mi Tienda")}</div>
            <div class="dropdown-store-meta">${escapeHtml(nicheLabel)} • ${prodCount} ${prodCount === 1 ? 'producto' : 'productos'}</div>
          </div>
          ${isActive ? `<span class="dropdown-store-check" title="Tienda activa">✓</span>` : ''}
          ${canDelete ? `
            <button type="button" class="dropdown-store-delete-btn" data-delete-store-id="${escapeHtml(store.id)}" title="Eliminar tienda secundaria">
              🗑️
            </button>
          ` : ''}
        </div>
      `;
    }).join("");

    list.querySelectorAll(".dropdown-store-item").forEach(item => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".dropdown-store-delete-btn")) return;
        const storeId = item.getAttribute("data-store-id");
        this.closeStoreDropdown();
        AppState.switchStore(storeId);
      });
    });

    list.querySelectorAll(".dropdown-store-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const delId = btn.getAttribute("data-delete-store-id");
        const targetStore = AppState.storesList.find(s => s.id === delId);
        if (!targetStore) return;
        if (confirm(`¿Eliminar la tienda "${targetStore.name}"? Esta acción no se puede deshacer.`)) {
          AppState.storesList = AppState.storesList.filter(s => s.id !== delId);
          AppState.saveStoresList();
          try { localStorage.removeItem("tiendazap_store_" + targetStore.slug); } catch(err){}
          this.renderStoreDropdown();
          Toast.show(`Tienda "${targetStore.name}" eliminada`, "🗑️");
        }
      });
    });
  },

  switchStudioTab(tabKey) {
    if (tabKey === "stores" || tabKey === "settings") tabKey = "store";

    document.querySelectorAll(".studio-bottom-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabKey);
    });

    const viewStore = document.getElementById("view-store");
    const viewProducts = document.getElementById("view-products");
    const viewPayments = document.getElementById("view-payments");
    const viewStores = document.getElementById("view-stores");
    const viewSettings = document.getElementById("view-settings");
    const viewCloud = document.getElementById("view-cloud");

    if (viewStore) viewStore.classList.toggle("hidden", tabKey !== "store");
    if (viewProducts) viewProducts.classList.toggle("hidden", tabKey !== "products");
    if (viewPayments) viewPayments.classList.toggle("hidden", tabKey !== "payments");
    if (viewStores) viewStores.classList.add("hidden");
    if (viewSettings) viewSettings.classList.add("hidden");
    if (viewCloud) viewCloud.classList.add("hidden");

    if (tabKey === "store") {
      this.populateStoreTab();
    } else if (tabKey === "products") {
      this.renderCatalogsBar();
      this.renderCategoryFilters();
      this.renderProductsList();
    } else if (tabKey === "payments") {
      this.populatePaymentsTab();
    }
  },

  populateStoreTab() {
    const cleanUrl = QRGenerator.getCleanDisplayUrl();
    const displayUrlEl = document.getElementById("store-clean-display-url");
    if (displayUrlEl) displayUrlEl.textContent = cleanUrl;

    const bannerEl = document.getElementById("settings-banner-preview");
    const logoEl = document.getElementById("settings-logo-preview");
    const nameInput = document.getElementById("live-store-name");
    const taglineInput = document.getElementById("live-store-tagline");
    const slugInput = document.getElementById("settings-slug-input") || document.getElementById("settings-store-slug");

    if (bannerEl && AppState.shopConfig.bannerUrl) bannerEl.src = AppState.shopConfig.bannerUrl;
    if (logoEl) logoEl.src = getEffectiveStoreLogo(AppState.shopConfig);
    if (nameInput) nameInput.value = AppState.shopConfig.name || "";
    if (taglineInput) taglineInput.value = AppState.shopConfig.tagline || "";
    const slug = AppState.getStoreSlug();
    if (slugInput) slugInput.value = slug;

    const highlightUrl = document.getElementById("highlight-store-url");
    if (highlightUrl) {
      highlightUrl.textContent = `${APP_BRAND.domainHint}/${slug}`;
    }

    const emailInp = document.getElementById("live-store-email");
    const addrInp = document.getElementById("live-store-address");
    const hoursInp = document.getElementById("live-store-hours");
    if (emailInp) emailInp.value = AppState.shopConfig.email || "";
    if (addrInp) addrInp.value = AppState.shopConfig.address || "";
    if (hoursInp) hoursInp.value = AppState.shopConfig.hours || "";
    this.renderTopStatus();

    document.querySelectorAll(".niche-card-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-niche") === AppState.activePreset);
    });

    this.syncAllLogoElements(AppState.shopConfig.logoUrl);

    // Redes Sociales
    const soc = AppState.shopConfig.socials || {};
    const igInp = document.getElementById("settings-social-instagram");
    const ttInp = document.getElementById("settings-social-tiktok");
    const fbInp = document.getElementById("settings-social-facebook");
    const wsInp = document.getElementById("settings-social-website");
    if (igInp) igInp.value = soc.instagram || "";
    if (ttInp) ttInp.value = soc.tiktok || "";
    if (fbInp) fbInp.value = soc.facebook || "";
    if (wsInp) wsInp.value = soc.website || "";

    // Aplicar estilos visuales y tema
    AppState.applyStoreTheme();
  },

  populatePaymentsTab() {
    const phoneInput = document.getElementById("settings-phone");
    const currSelect = document.getElementById("settings-currency");
    const yapeToggle = document.getElementById("settings-yape-toggle") || document.getElementById("settings-yape-enabled");
    const yapeFields = document.getElementById("settings-yape-fields");
    const yapePhone = document.getElementById("settings-yape-phone");
    const yapeName = document.getElementById("settings-yape-name");
    const deliveryCost = document.getElementById("settings-delivery-cost");
    const deliveryTime = document.getElementById("settings-delivery-time");
    const yapePreview = document.getElementById("settings-yape-qr-preview");
    const yapePlaceholder = document.getElementById("settings-yape-qr-placeholder");
    const removeYapeBtn = document.getElementById("remove-yape-qr-btn");

    if (phoneInput) phoneInput.value = AppState.shopConfig.phone || "";
    if (currSelect) currSelect.value = AppState.shopConfig.currency || "S/";
    if (yapeToggle) {
      yapeToggle.checked = AppState.shopConfig.yapeEnabled !== false;
      if (yapeFields) yapeFields.classList.toggle("hidden", !yapeToggle.checked);
    }
    if (yapePhone) yapePhone.value = AppState.shopConfig.yapePhone || "";
    if (yapeName) yapeName.value = AppState.shopConfig.yapeName || "";
    if (deliveryCost) deliveryCost.value = AppState.shopConfig.deliveryCost ?? 0;
    if (deliveryTime) deliveryTime.value = AppState.shopConfig.deliveryTime || "";

    if (yapePreview && yapePlaceholder) {
      if (AppState.shopConfig.yapeQrUrl) {
        yapePreview.src = AppState.shopConfig.yapeQrUrl;
        yapePreview.classList.remove("hidden");
        yapePlaceholder.classList.add("hidden");
        if (removeYapeBtn) removeYapeBtn.classList.remove("hidden");
      } else {
        yapePreview.classList.add("hidden");
        yapePlaceholder.classList.remove("hidden");
        if (removeYapeBtn) removeYapeBtn.classList.add("hidden");
      }
    }
  },

  saveStoreIdentity() {
    const nameInp = document.getElementById("live-store-name");
    const tagInp = document.getElementById("live-store-tagline");
    const slugInp = document.getElementById("settings-slug-input") || document.getElementById("settings-store-slug");
    const emailInp = document.getElementById("live-store-email");
    const addrInp = document.getElementById("live-store-address");
    const hoursInp = document.getElementById("live-store-hours");

    if (nameInp && nameInp.value.trim()) {
      AppState.shopConfig.name = nameInp.value.trim();
    }
    if (tagInp) {
      AppState.shopConfig.tagline = tagInp.value.trim();
    }
    if (slugInp && slugInp.value.trim()) {
      AppState.shopConfig.storeSlug = slugifyStoreName(slugInp.value.trim());
    }
    if (emailInp) {
      AppState.shopConfig.email = emailInp.value.trim();
    }
    if (addrInp) {
      AppState.shopConfig.address = addrInp.value.trim();
    }
    if (hoursInp) {
      AppState.shopConfig.hours = hoursInp.value.trim();
    }

    // Guardar rubro activo
    const activeNicheBtn = document.querySelector(".niche-card-btn.active");
    if (activeNicheBtn) {
      const niche = AppState.normalizePresetKey(activeNicheBtn.getAttribute("data-niche"));
      AppState.activePreset = niche;
      AppState.shopConfig.niche = niche;
    }

    // Guardar redes sociales
    const ig = document.getElementById("settings-social-instagram")?.value.trim() || "";
    const tt = document.getElementById("settings-social-tiktok")?.value.trim() || "";
    const fb = document.getElementById("settings-social-facebook")?.value.trim() || "";
    const ws = document.getElementById("settings-social-website")?.value.trim() || "";
    AppState.shopConfig.socials = { instagram: ig, tiktok: tt, facebook: fb, website: ws };

    // Guardar color de botón y modo de tema
    const customColorInp = document.getElementById("store-custom-accent-color");
    if (customColorInp) {
      AppState.shopConfig.accentColor = customColorInp.value;
    }
    const activeModeBtn = document.querySelector(".btn-theme-mode.active");
    if (activeModeBtn) {
      AppState.shopConfig.themeMode = activeModeBtn.dataset.mode || "light";
    }

    AppState.saveConfig();
    AppState.applyStoreTheme();
    this.populateStoreTab();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    Toast.show("¡Tienda y estilos guardados correctamente!", "🏪");
  },

  savePaymentsSettings() {
    const phone = document.getElementById("settings-phone")?.value.trim() || AppState.shopConfig.phone;
    const currency = document.getElementById("settings-currency")?.value.trim() || "S/";
    const deliveryCost = parseFloat(document.getElementById("settings-delivery-cost")?.value) || 0;
    const deliveryTime = document.getElementById("settings-delivery-time")?.value.trim() || "24-48h";

    const yapeToggle = document.getElementById("settings-yape-toggle") || document.getElementById("settings-yape-enabled");
    const yapeEnabled = yapeToggle ? yapeToggle.checked : true;
    const yapePhone = document.getElementById("settings-yape-phone")?.value.trim() || "";
    const yapeName = document.getElementById("settings-yape-name")?.value.trim() || "";

    AppState.shopConfig.phone = phone;
    AppState.shopConfig.currency = currency;
    AppState.shopConfig.deliveryCost = deliveryCost;
    AppState.shopConfig.deliveryTime = deliveryTime;
    AppState.shopConfig.yapeEnabled = yapeEnabled;
    AppState.shopConfig.yapePhone = yapePhone;
    AppState.shopConfig.yapeName = yapeName;

    AppState.saveConfig();
    this.renderProductsList();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    CustomerUI.renderProductCards();
    CustomerUI.renderYapeCheckoutBox();
    Toast.show("Ajustes de cobros y envíos guardados", "💳");
  },

  renderStoresTab() {
    const container = document.getElementById("studio-stores-list");
    if (!container) return;

    if (!AppState.storesList) AppState.initStores();
    const currentSlug = AppState.getStoreSlug();

    container.innerHTML = AppState.storesList.map(store => {
      const isActive = store.slug === currentSlug || store.id === AppState.currentStoreId;
      const prodCount = Array.isArray(store.products) ? store.products.length : 0;
      const logoUrl = getEffectiveStoreLogo(store.config || { name: store.name });
      const nicheLabel = getNicheLabelEs(store.preset || store.config?.niche || "general");
      const shortUrl = `${window.location.origin}/${encodeURIComponent(store.slug)}`;

      return `
        <div class="store-item-card ${isActive ? "active-store" : ""}">
          <div class="store-item-top">
            <div class="store-item-info">
              <img src="${logoUrl}" alt="${escapeHtml(store.name)}" class="store-item-logo">
              <div>
                <h4 class="store-item-name">${escapeHtml(store.name)}</h4>
                <p class="store-item-meta">${escapeHtml(nicheLabel)} • ${prodCount} ${prodCount === 1 ? 'producto' : 'productos'} • ${store.currency || "S/"}</p>
              </div>
            </div>
            ${isActive ? '<span class="store-active-badge">● Activa</span>' : ''}
          </div>

          ${isActive ? `
            <div class="store-item-actions-grid">
              <button type="button" class="btn-primary-compact btn-store-edit-prods" style="grid-column: span 2;">
                📦 Ver / Editar Productos (${prodCount})
              </button>
              <button type="button" class="btn-secondary-compact btn-store-settings">
                ⚙️ Configurar Rubro y Datos
              </button>
              <button type="button" class="btn-secondary-compact btn-store-copy-link" data-url="${escapeHtml(shortUrl)}">
                🔗 Copiar Link
              </button>
              <button type="button" class="btn-secondary-compact btn-store-preview" style="grid-column: span 2;">
                👁️ Abrir Vitrina del Comprador
              </button>
            </div>
          ` : `
            <div class="store-item-actions-grid">
              <button type="button" class="btn-primary-compact btn-switch-store" data-store-id="${store.id}" style="grid-column: span 2;">
                ✅ Administrar esta tienda
              </button>
              <button type="button" class="btn-secondary-compact btn-preview-other-store" data-store-id="${store.id}">
                👁️ Ver Vitrina
              </button>
              ${AppState.storesList.length > 1 ? `
                <button type="button" class="btn-secondary-compact btn-delete-store" data-store-id="${store.id}" style="color:var(--accent-red);" title="Eliminar tienda">
                  🗑️ Eliminar
                </button>
              ` : `
                <span></span>
              `}
            </div>
          `}
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-store-edit-prods").forEach(btn => {
      btn.addEventListener("click", () => {
        StudioController.switchStudioTab("products");
      });
    });

    container.querySelectorAll(".btn-store-settings").forEach(btn => {
      btn.addEventListener("click", () => {
        StudioController.switchStudioTab("settings");
      });
    });

    container.querySelectorAll(".btn-store-copy-link").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url") || QRGenerator.getCleanDisplayUrl();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            Toast.show("Enlace oficial copiado", "🔗");
          });
        } else {
          prompt("Enlace de tu tienda:", url);
        }
      });
    });

    container.querySelectorAll(".btn-store-preview").forEach(btn => {
      btn.addEventListener("click", () => {
        ViewController.showCustomerView();
      });
    });

    container.querySelectorAll(".btn-preview-other-store").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-store-id");
        AppState.switchStore(sId);
        ViewController.showCustomerView();
      });
    });

    container.querySelectorAll(".btn-switch-store").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-store-id");
        AppState.switchStore(sId);
        this.renderStoresTab();
      });
    });

    container.querySelectorAll(".btn-delete-store").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-store-id");
        AppState.deleteStore(sId);
      });
    });
  },

  getCategories() {
    return AppState.getCategoriesList();
  },

  renderCategoryFilters() {
    const track = document.getElementById("studio-categories-track");
    const badge = document.getElementById("studio-products-badge");
    const catBadge = document.getElementById("studio-categories-badge");
    if (badge) badge.textContent = AppState.products.length;

    const catList = AppState.getCategoriesList();
    if (catBadge) catBadge.textContent = catList.length;

    if (!track) return;

    // Verificar si la categoría activa en Studio aún existe
    if (AppState.studioCategory !== "all" && !catList.some(c => c.name.toLowerCase() === AppState.studioCategory.toLowerCase())) {
      AppState.studioCategory = "all";
    }

    let chipsHtml = `
      <button type="button" class="studio-cat-chip ${AppState.studioCategory === "all" ? "active" : ""}" data-category="all">
        <span>✨</span>
        <span>Todos</span>
        <span style="opacity: 0.65; font-size: 0.7rem;">(${AppState.products.length})</span>
      </button>
    `;

    chipsHtml += catList.map(c => `
      <button type="button" class="studio-cat-chip ${AppState.studioCategory.toLowerCase() === c.name.toLowerCase() ? "active" : ""}" data-category="${c.name}">
        <span>${c.icon}</span>
        <span>${c.name}</span>
        <span style="opacity: 0.65; font-size: 0.7rem;">(${c.count})</span>
      </button>
    `).join("");

    chipsHtml += `
      <button type="button" class="studio-cat-chip add-cat-trigger" id="studio-quick-add-cat-chip" title="Gestionar categorías">
        <span>+ Categoría</span>
      </button>
    `;

    track.innerHTML = chipsHtml;

    track.querySelectorAll(".studio-cat-chip[data-category]").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.studioCategory = btn.getAttribute("data-category");
        this.renderCategoryFilters();
        this.renderProductsList();
      });
    });

    const quickCatBtn = document.getElementById("studio-quick-add-cat-chip");
    if (quickCatBtn) quickCatBtn.addEventListener("click", () => this.openCategoryManager());
  },

  openCategoryManager() {
    const modal = document.getElementById("categories-manager-modal");
    if (!modal) return;
    this.renderCategoryManagerList();
    const newCatInput = document.getElementById("new-category-name-input");
    if (newCatInput) {
      newCatInput.value = "";
      setTimeout(() => newCatInput.focus(), 150);
    }
    modal.classList.remove("hidden");
  },

  closeCategoryManager() {
    const modal = document.getElementById("categories-manager-modal");
    if (modal) modal.classList.add("hidden");
    const palette = document.getElementById("cat-emoji-palette");
    if (palette) palette.classList.add("hidden");
    this.renderCategoryFilters();
    this.renderProductsList();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
  },

  renderCategoryManagerList() {
    const listEl = document.getElementById("cat-manager-items-list");
    const countEl = document.getElementById("cat-manager-total-count");
    if (!listEl) return;

    const cats = AppState.getCategoriesList();
    if (countEl) countEl.textContent = cats.length;

    if (cats.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; color: var(--text-dim); font-size: 0.8rem;">
          <span style="font-size: 1.8rem; display: block; margin-bottom: 6px;">🏷️</span>
          <p>No tienes categorías registradas aún.<br>Añade tu primera sección arriba.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = cats.map((c, idx) => `
      <div class="cat-item-row" data-name="${escapeHtml(c.name)}">
        <div class="cat-item-left">
          <button type="button" class="cat-item-icon-btn cat-action-icon" data-name="${escapeHtml(c.name)}" title="Toca para cambiar icono">
            ${c.icon}
          </button>
          <div class="cat-item-meta">
            <span class="cat-item-name">${escapeHtml(c.name)}</span>
            <span class="cat-item-count">${c.count} ${c.count === 1 ? 'producto' : 'productos'}</span>
          </div>
        </div>

        <div class="cat-item-actions">
          <button type="button" class="cat-tool-btn cat-action-move-up" data-idx="${idx}" ${idx === 0 ? 'disabled style="opacity:0.25; cursor:not-allowed;"' : ''} title="Mover arriba">⬆️</button>
          <button type="button" class="cat-tool-btn cat-action-move-down" data-idx="${idx}" ${idx === cats.length - 1 ? 'disabled style="opacity:0.25; cursor:not-allowed;"' : ''} title="Mover abajo">⬇️</button>
          <button type="button" class="cat-tool-btn cat-action-rename" data-name="${escapeHtml(c.name)}" title="Renombrar categoría">✏️</button>
          <button type="button" class="cat-tool-btn danger cat-action-delete" data-name="${escapeHtml(c.name)}" data-count="${c.count}" title="Eliminar categoría">🗑️</button>
        </div>
      </div>
    `).join("");

    listEl.querySelectorAll(".cat-action-icon").forEach(btn => {
      btn.addEventListener("click", () => StudioController.changeCategoryIcon(btn.dataset.name));
    });
    listEl.querySelectorAll(".cat-action-move-up").forEach(btn => {
      btn.addEventListener("click", () => AppState.reorderCategory(parseInt(btn.dataset.idx, 10), -1));
    });
    listEl.querySelectorAll(".cat-action-move-down").forEach(btn => {
      btn.addEventListener("click", () => AppState.reorderCategory(parseInt(btn.dataset.idx, 10), 1));
    });
    listEl.querySelectorAll(".cat-action-rename").forEach(btn => {
      btn.addEventListener("click", () => StudioController.promptRenameCategory(btn.dataset.name));
    });
    listEl.querySelectorAll(".cat-action-delete").forEach(btn => {
      btn.addEventListener("click", () => StudioController.confirmDeleteCategory(btn.dataset.name, parseInt(btn.dataset.count, 10)));
    });
  },

  changeCategoryIcon(catName) {
    const emojis = ["🍔", "🍗", "🍕", "🥤", "🍰", "☕", "👗", "👚", "👖", "👠", "👟", "💄", "✨", "💻", "📱", "🎧", "🔌", "⭐", "🔥", "🛍️", "🏷️", "📦"];
    const currentCat = AppState.categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (!currentCat) return;

    const currentIdx = emojis.indexOf(currentCat.icon);
    const nextEmoji = emojis[(currentIdx + 1) % emojis.length];
    currentCat.icon = nextEmoji;
    AppState.saveCategories();
    this.renderCategoryManagerList();
    this.renderCategoryFilters();
    CustomerUI.renderCategoryTabs();
    Toast.show(`Icono de "${catName}" actualizado a ${nextEmoji}`, nextEmoji);
  },

  promptRenameCategory(oldName) {
    const newName = prompt(`Renombrar categoría "${oldName}":\n(Se actualizarán todos los productos automáticamente)`, oldName);
    if (!newName || newName.trim() === oldName) return;

    const res = AppState.renameCategory(oldName, newName.trim());
    if (!res.ok) {
      alert(res.msg);
    } else {
      this.renderCategoryManagerList();
      this.renderCategoryFilters();
      Toast.show(`Categoría renombrada a "${newName.trim()}" (${res.count} productos actualizados)`, "✅");
    }
  },

  confirmDeleteCategory(catName, prodCount) {
    if (prodCount > 0) {
      const targetCat = prompt(
        `La categoría "${catName}" tiene ${prodCount} producto(s) asignado(s).\n\nIngresa el nombre de la categoría a donde deseas moverlos (o deja "General"):`,
        "General"
      );
      if (targetCat === null) return;
      const res = AppState.deleteCategory(catName, targetCat.trim() || "General");
      this.renderCategoryManagerList();
      this.renderCategoryFilters();
      Toast.show(`Categoría eliminada. ${res.reallocated} productos movidos a "${targetCat.trim() || 'General'}"`, "🗑️");
    } else {
      if (confirm(`¿Eliminar definitivamente la categoría "${catName}"?`)) {
        AppState.deleteCategory(catName);
        this.renderCategoryManagerList();
        this.renderCategoryFilters();
        Toast.show(`Categoría "${catName}" eliminada`, "🗑️");
      }
    }
  },

  onListingTypeChange(chosenType, existingSpecs = []) {
    this.currentListingType = chosenType || "item";
    const typeHidden = document.getElementById("editor-listing-type");
    if (typeHidden) typeHidden.value = this.currentListingType;

    const typePills = document.querySelectorAll("#editor-listing-type-pills .listing-pill, #editor-listing-type-pills .type-pill");
    typePills.forEach(pill => pill.classList.toggle("active", (pill.dataset.type || "item") === this.currentListingType));

    // Actualizar barra compacta de tipo de publicación
    const badgeText = document.getElementById("editor-type-badge-text");
    const badgeIcon = document.getElementById("editor-type-badge-icon");
    const typeMeta = {
      digital: { iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, label: "Publicación Digital / Licencia" },
      vehicle: { iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M5 11l2-5h10l2 5"/></svg>`, label: "Publicación Vehículo / Auto" },
      property: { iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, label: "Publicación Inmueble" },
      item: { iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, label: "Publicación de Artículo Físico" }
    };
    const meta = typeMeta[this.currentListingType] || typeMeta.item;
    if (badgeIcon) badgeIcon.innerHTML = meta.iconSvg;
    if (badgeText) badgeText.textContent = meta.label;

    // Ajustar etiquetas o visibilidad de Tallas/Colores
    const variantsSection = document.getElementById("editor-variants-section");
    const sizesLabel = document.getElementById("editor-sizes-label");
    const sizesInput = document.getElementById("editor-sizes-input");
    const colorsLabel = document.getElementById("editor-colors-label");
    const colorsInput = document.getElementById("editor-colors-input");

    if (this.currentListingType === "vehicle" || this.currentListingType === "property") {
      if (variantsSection) variantsSection.style.display = "none";
    } else if (this.currentListingType === "digital") {
      if (variantsSection) variantsSection.style.display = "";
      if (sizesLabel) sizesLabel.textContent = "Duración / Plan (ej: 1 Mes, 6 Meses, 1 Año)";
      if (sizesInput) sizesInput.placeholder = "Ej: 1 Mes, 6 Meses, 1 Año, Permanente";
      if (colorsLabel) colorsLabel.textContent = "Dispositivos / Entrega (ej: 1 PC, 2 Dispositivos, Con tu correo)";
      if (colorsInput) colorsInput.placeholder = "Ej: 1 PC, 2 Dispositivos, Con tu correo";
    } else {
      if (variantsSection) variantsSection.style.display = "";
      this.updateVariantInputLabels();
    }

    this.renderDynamicSpecs(this.currentListingType, existingSpecs);
    this.renderEditorCategoryChips();
  },

  renderEditorCategoryChips(selectedCat = "") {
    const pillsRow = document.getElementById("editor-cat-pills-row");
    const dataList = document.getElementById("categories-datalist");
    const catInput = document.getElementById("editor-category-input");
    const listingType = this.currentListingType || "item";
    const currentNiche = AppState.shopConfig.niche || AppState.activePreset || "general";

    let suggested = [];
    if (currentNiche === "tech" || listingType === "digital") {
      suggested = [
        "Diseño & Arquitectura (Adobe / Autodesk)",
        "Ofimática & Windows",
        "IA & Productividad (ChatGPT / Canva / CapCut)",
        "Streaming & Cuentas",
        "Antivirus & Seguridad",
        "Cursos & Ebooks",
        "Gift Cards & Juegos"
      ];
    } else if (currentNiche === "vehicles" || listingType === "vehicle") {
      suggested = (NICHE_DATA.vehicles && NICHE_DATA.vehicles.suggestedCategories) || TYPE_CATEGORIES.vehicle;
    } else if (currentNiche === "property" || listingType === "property") {
      suggested = TYPE_CATEGORIES.property;
    } else if (currentNiche === "sneakers") {
      suggested = (NICHE_DATA.sneakers && NICHE_DATA.sneakers.suggestedCategories) || ["Urbano & Streetwear", "Deportivas & Running", "Edición Limitada", "Botines & Casual"];
    } else if (currentNiche === "beauty") {
      suggested = (NICHE_DATA.beauty && NICHE_DATA.beauty.suggestedCategories) || ["Perfumes Dama", "Perfumes Caballero", "Perfumes Árabes", "Decants (5ml / 10ml)", "Skincare & Maquillaje"];
    } else if (currentNiche === "watches") {
      suggested = (NICHE_DATA.watches && NICHE_DATA.watches.suggestedCategories) || ["Ramos & Flores", "Boxes de Regalo", "Relojes Automáticos", "Joyas & Cadenas", "Accesorios"];
    } else if (currentNiche === "food") {
      suggested = (NICHE_DATA.food && NICHE_DATA.food.suggestedCategories) || ["Hamburguesas & Smash", "Alitas & Combos", "Bebidas & Tragos", "Postres & Dulces"];
    } else if (currentNiche === "fashion") {
      suggested = (NICHE_DATA.fashion && NICHE_DATA.fashion.suggestedCategories) || ["Vestidos & Fiesta", "Polos & Camisas", "Pantalones & Jeans", "Accesorios & Bolsos"];
    } else {
      suggested = TYPE_CATEGORIES[listingType] || TYPE_CATEGORIES.item;
    }

    const catInputVal = (selectedCat || (catInput ? catInput.value : "") || "").trim();

    // Actualizar placeholder del input de categoría según tipo/rubro
    if (catInput) {
      if (currentNiche === "tech" || listingType === "digital") {
        catInput.placeholder = "Ej: Diseño & Arquitectura, Ofimática, Streaming...";
      } else if (currentNiche === "vehicles" || listingType === "vehicle") {
        catInput.placeholder = "Ej: Camionetas & SUV, Autos Sedán, Pickups...";
      } else if (currentNiche === "property" || listingType === "property") {
        catInput.placeholder = "Ej: Departamentos en Venta, Casas, Locales...";
      } else if (currentNiche === "sneakers") {
        catInput.placeholder = "Ej: Urbano & Streetwear, Deportivas, Running...";
      } else if (currentNiche === "beauty") {
        catInput.placeholder = "Ej: Perfumes Dama, Perfumes Árabes, Decants...";
      } else {
        catInput.placeholder = "Ej: Calzado, Ropa, Accesorios...";
      }
    }

    // Categorías del usuario para esta tienda específica (excluyendo undefined y categorías ajenas al rubro)
    const storeCategories = (AppState.categories || [])
      .map(c => typeof c === "string" ? c.trim() : (c && c.name ? c.name.trim() : ""))
      .filter(c => {
        if (!c) return false;
        const low = c.toLowerCase();
        return low !== "undefined" && low !== "null" && low !== "[object object]";
      });

    const userCategoriesWithProds = (AppState.products || [])
      .map(p => (p.category && p.category.toLowerCase() !== "undefined" && p.category.toLowerCase() !== "null") ? p.category.trim() : "")
      .filter(Boolean);

    const allOptions = [...suggested];
    [...storeCategories, ...userCategoriesWithProds].forEach(c => {
      if (!allOptions.some(item => item.toLowerCase() === c.toLowerCase())) {
        allOptions.push(c);
      }
    });

    if (dataList) {
      dataList.innerHTML = allOptions.map(c => `<option value="${escapeHtml(c)}">`).join("");
    }

    if (pillsRow) {
      const currentLower = catInputVal.toLowerCase();
      pillsRow.innerHTML = allOptions.map(catName => {
        const icon = CustomerUI.getCategoryIcon(catName);
        const isActive = currentLower === catName.toLowerCase();
        return `
          <button type="button" class="editor-cat-chip ${isActive ? "active" : ""}" data-cat="${escapeHtml(catName)}">
            <span>${icon}</span>
            <span>${escapeHtml(catName)}</span>
          </button>
        `;
      }).join("");

      pillsRow.querySelectorAll(".editor-cat-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const catName = chip.getAttribute("data-cat");
          if (catInput) {
            catInput.value = catName;
            catInput.dispatchEvent(new Event("input"));
          }
          pillsRow.querySelectorAll(".editor-cat-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
        });
      });
    }
  },

  populateCatalogSelect(selectedId = "cat_main") {
    const sel = document.getElementById("editor-catalog-select");
    if (!sel) return;
    if (!AppState.catalogs || AppState.catalogs.length === 0) {
      AppState.initCatalogs();
    }
    sel.innerHTML = AppState.catalogs.map(c => `
      <option value="${escapeHtml(c.id)}" ${c.id === selectedId ? "selected" : ""}>
        ${escapeHtml(c.name)}${c.isDefault ? " (Principal)" : ""}
      </option>
    `).join("");
  },

  promptCreateCatalog() {
    const name = prompt("Nombre del nuevo catálogo:\n(Ej: Autodesk, Calzado Deportivo, Menú Ejecutivo)");
    if (name && name.trim()) {
      const res = AppState.addCatalog(name.trim());
      if (res.ok) {
        this.populateCatalogSelect(res.catalog.id);
      }
    }
  },

  renderCatalogsBar() {
    const bar = document.getElementById("studio-catalogs-bar");
    const actionsBar = document.getElementById("studio-active-catalog-actions");
    if (!bar) return;

    if (!AppState.catalogs || AppState.catalogs.length === 0) {
      AppState.initCatalogs();
    }

    const totalCount = (AppState.products || []).length;
    const activeId = AppState.activeStudioCatalogId || "all";

    let html = `
      <button type="button" class="catalog-chip-btn ${activeId === "all" ? "active" : ""}" data-catalog-id="all">
        <span>Todos</span>
        <span class="catalog-chip-count">${totalCount}</span>
      </button>
    `;

    AppState.catalogs.forEach(cat => {
      const count = (AppState.products || []).filter(p => (p.catalogId || "cat_main") === cat.id).length;
      const isAct = activeId === cat.id;
      html += `
        <button type="button" class="catalog-chip-btn ${isAct ? "active" : ""}" data-catalog-id="${escapeHtml(cat.id)}">
          <span class="catalog-chip-icon">📁</span>
          <span class="catalog-chip-name">${escapeHtml(cat.name)}</span>
          <span class="catalog-chip-count">${count}</span>
        </button>
      `;
    });

    html += `
      <button type="button" class="catalog-chip-btn catalog-chip-add" id="studio-add-catalog-btn" title="Crear nuevo catálogo">
        <span class="catalog-chip-plus">+</span>
        <span>Catálogo</span>
      </button>
    `;

    bar.innerHTML = html;

    bar.querySelectorAll(".catalog-chip-btn[data-catalog-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const catId = btn.getAttribute("data-catalog-id");
        AppState.activeStudioCatalogId = catId;
        this.renderCatalogsBar();
        this.renderProductsList();
      });
    });

    const addBtn = document.getElementById("studio-add-catalog-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        this.promptCreateCatalog();
      });
    }

    // Acciones del catálogo activo (sólo si no es 'all')
    if (actionsBar) {
      if (activeId === "all") {
        actionsBar.classList.add("hidden");
        actionsBar.innerHTML = "";
      } else {
        const currentCat = AppState.catalogs.find(c => c.id === activeId);
        if (!currentCat) {
          actionsBar.classList.add("hidden");
          actionsBar.innerHTML = "";
        } else {
          const catUrl = QRGenerator.getCleanDisplayUrl(currentCat.slug);
          const isDefault = currentCat.isDefault || currentCat.id === "cat_main";
          const displaySlug = `${APP_BRAND.domainHint}/${AppState.getStoreSlug()}?cat=${currentCat.slug}`;

          actionsBar.classList.remove("hidden");
          actionsBar.innerHTML = `
            <div class="active-catalog-info">
              <span class="active-catalog-label">📁 ${escapeHtml(currentCat.name)}:</span>
              <span class="active-catalog-url" title="${escapeHtml(catUrl)}">${escapeHtml(displaySlug)}</span>
            </div>
            <div class="active-catalog-actions-btns">
              <button type="button" class="catalog-action-btn btn-copy-cat-link" data-url="${escapeHtml(catUrl)}" title="Copiar enlace de este catálogo">
                <span>🔗 Copiar link</span>
              </button>
              <button type="button" class="catalog-action-btn btn-rename-cat" data-id="${escapeHtml(currentCat.id)}" title="Renombrar catálogo">
                <span>✏️ Renombrar</span>
              </button>
              ${!isDefault ? `
                <button type="button" class="catalog-action-btn btn-delete-cat" data-id="${escapeHtml(currentCat.id)}" title="Eliminar catálogo">
                  <span>🗑️</span>
                </button>
              ` : ""}
            </div>
          `;

          const copyBtn = actionsBar.querySelector(".btn-copy-cat-link");
          if (copyBtn) {
            copyBtn.addEventListener("click", () => {
              const urlToCopy = copyBtn.getAttribute("data-url");
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(urlToCopy).then(() => {
                  Toast.show("Enlace del catálogo copiado", "📋");
                }).catch(() => {
                  prompt("Copia este enlace de tu catálogo:", urlToCopy);
                });
              } else {
                prompt("Copia este enlace de tu catálogo:", urlToCopy);
              }
            });
          }

          const renameBtn = actionsBar.querySelector(".btn-rename-cat");
          if (renameBtn) {
            renameBtn.addEventListener("click", () => {
              const catId = renameBtn.getAttribute("data-id");
              const catObj = AppState.catalogs.find(c => c.id === catId);
              if (!catObj) return;
              const newName = prompt("Nuevo nombre para el catálogo:", catObj.name);
              if (newName && newName.trim()) {
                AppState.renameCatalog(catId, newName.trim());
              }
            });
          }

          const deleteBtn = actionsBar.querySelector(".btn-delete-cat");
          if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
              const catId = deleteBtn.getAttribute("data-id");
              const catObj = AppState.catalogs.find(c => c.id === catId);
              if (!catObj) return;
              if (confirm(`¿Eliminar el catálogo "${catObj.name}"?\nSus productos se moverán automáticamente al Catálogo Principal para que no se pierdan.`)) {
                AppState.deleteCatalog(catId);
              }
            });
          }
        }
      }
    }
  },

  renderProductsList() {
    const listContainer = document.getElementById("studio-products-list");
    const emptyState = document.getElementById("studio-empty-state");
    if (!listContainer) return;

    let items = [...AppState.products];

    // Filtro reactivo por catálogo independiente (Etapa 2)
    if (AppState.activeStudioCatalogId && AppState.activeStudioCatalogId !== "all") {
      items = items.filter(p => (p.catalogId || "cat_main") === AppState.activeStudioCatalogId);
    }

    const query = AppState.studioSearchQuery.toLowerCase().trim();

    if (AppState.studioCategory !== "all") {
      items = items.filter(p => (p.category || "").trim().toLowerCase() === AppState.studioCategory.toLowerCase());
    }

    if (query) {
      items = items.filter(p => 
        (p.name || "").toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.desc && p.desc.toLowerCase().includes(query))
      );
    }

    if (items.length === 0) {
      listContainer.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    const currency = AppState.shopConfig.currency || "S/";

    listContainer.innerHTML = items.map(p => {
      const isAvailable = p.available !== false;
      const skuTag = p.sku ? `<span class="apple-sku-pill">${escapeHtml(p.sku)}</span>` : "";
      const promoBadge = p.promo ? `<span class="apple-promo-pill">PROMO</span>` : "";

      return `
        <article class="apple-studio-prod-card ${!isAvailable ? 'is-out-of-stock' : ''}" data-id="${escapeHtml(p.id)}">
          <div class="apple-prod-thumb-wrap action-open-edit" data-prod-id="${escapeHtml(p.id)}" style="cursor: pointer;">
            <img src="${p.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(p.name)}" class="apple-prod-thumb" loading="lazy">
          </div>

          <div class="apple-prod-info">
            <h4 class="apple-prod-title action-open-edit" data-prod-id="${escapeHtml(p.id)}" style="cursor: pointer;">${escapeHtml(p.name)}</h4>

            <div class="apple-prod-meta-line">
              <span class="apple-prod-meta-cat">${escapeHtml(p.category || "General")}</span>
              ${skuTag}
              ${promoBadge}
              ${(p.sizes && p.sizes.length > 0) ? `<span class="apple-prod-variant-hint">• ${p.sizes.length} opciones</span>` : ''}
            </div>

            <div class="apple-prod-controls-row">
              <!-- Píldora de Modificación de Precio Apple -->
              <button type="button" class="apple-price-chip action-quick-price" data-prod-id="${escapeHtml(p.id)}" title="Toca para cambiar precio">
                <span>${currency} ${Number(p.price).toFixed(2)}</span>
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <!-- Switch de Stock -->
              <button type="button" class="apple-stock-chip ${isAvailable ? 'in-stock' : 'out-stock'} action-quick-stock" 
                      data-prod-id="${escapeHtml(p.id)}" 
                      title="Cambiar disponibilidad">
                <span class="apple-chip-dot"></span>
                <span>${isAvailable ? 'Activo' : 'Agotado'}</span>
              </button>

              <!-- Botón Explícito de Editar -->
              <button type="button" class="apple-btn-explicit-edit action-open-edit" data-prod-id="${escapeHtml(p.id)}" title="Editar detalles, fotos y ficha">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span>Editar</span>
              </button>

              <!-- Eliminar producto -->
              <button type="button" class="apple-icon-btn danger action-delete-prod" data-prod-id="${escapeHtml(p.id)}" title="Eliminar producto">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    listContainer.querySelectorAll(".action-open-edit").forEach(el => {
      el.addEventListener("click", () => StudioController.openEditProduct(el.dataset.prodId));
    });
    listContainer.querySelectorAll(".action-quick-price").forEach(el => {
      el.addEventListener("click", () => StudioController.quickEditPrice(el.dataset.prodId));
    });
    listContainer.querySelectorAll(".action-quick-stock").forEach(el => {
      el.addEventListener("click", () => StudioController.quickToggleStock(el.dataset.prodId));
    });
    listContainer.querySelectorAll(".action-copy-link").forEach(el => {
      el.addEventListener("click", () => StudioController.copyLiveLink(el.dataset.prodId));
    });
    listContainer.querySelectorAll(".action-delete-prod").forEach(el => {
      el.addEventListener("click", () => StudioController.deleteProduct(el.dataset.prodId));
    });
  },

  // Modificación Instantánea de Precio con 1 Toque
  quickEditPrice(productId) {
    const p = AppState.products.find(item => item.id === productId);
    if (!p) return;

    const currency = AppState.shopConfig.currency || "S/";
    const currentPrice = Number(p.price).toFixed(2);
    const newPricePrompt = prompt(`Modificar precio para "${p.name}":\nIngresa el nuevo monto (${currency}):`, currentPrice);

    if (newPricePrompt !== null) {
      const cleanVal = parseFloat(newPricePrompt.replace(/[^0-9.]/g, ""));
      if (!isNaN(cleanVal) && cleanVal >= 0) {
        p.price = cleanVal;
        AppState.saveProducts();
        this.renderProductsList();
        CustomerUI.renderProductCards();
        CustomerUI.renderCartItemsList();
        Toast.show(`Precio de "${p.name}" actualizado a ${currency} ${cleanVal.toFixed(2)}`, "💰");
      } else {
        alert("Por favor ingresa un precio válido en números.");
      }
    }
  },

  // Alternar Disponibilidad / Stock con 1 Toque
  quickToggleStock(productId) {
    const p = AppState.products.find(item => item.id === productId);
    if (!p) return;

    p.available = p.available === false ? true : false;
    AppState.saveProducts();
    this.renderProductsList();
    CustomerUI.renderProductCards();

    const statusMsg = p.available ? "✅ Disponible en catálogo" : "❌ Marcado como AGOTADO";
    Toast.show(`${p.name}: ${statusMsg}`, p.available ? "✅" : "⏸️");
  },

  copyLiveLink(productId) {
    const baseUrl = window.location.origin + window.location.pathname;
    const directUrl = `${baseUrl}?p=${productId}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(directUrl).then(() => {
        Toast.show("Enlace de producto copiado para el Live Shopping", "🔴");
      });
    } else {
      prompt("Enlace de producto para tus seguidores:", directUrl);
    }
  },

  openAddProduct() {
    const editor = document.getElementById("studio-product-editor");
    const form = document.getElementById("studio-product-form");
    const title = document.getElementById("editor-form-title");
    if (!editor || !form) return;

    form.reset();
    document.getElementById("editor-product-id").value = "";
    document.getElementById("editor-category-input").value = "";
    document.getElementById("editor-available-check").checked = true;
    document.getElementById("editor-promo-check").checked = false;
    this.currentProductPhoto = "";
    this.currentProductVideo = "";
    this.currentProductImages = [];

    const currentNiche = AppState.shopConfig.niche || AppState.activePreset || "general";
    let defaultType = "item";
    if (currentNiche === "tech" || currentNiche === "digital") {
      defaultType = "digital";
    } else if (currentNiche === "vehicles") {
      defaultType = "vehicle";
    } else if (currentNiche === "property") {
      defaultType = "property";
    } else {
      defaultType = "item";
    }
    this.currentListingType = defaultType;

    const compactBar = document.getElementById("editor-type-compact-bar");
    const pillsWrap = document.getElementById("editor-listing-type-pills");
    if (currentNiche === "general") {
      if (compactBar) compactBar.classList.add("hidden");
      if (pillsWrap) pillsWrap.classList.remove("hidden");
    } else {
      if (compactBar) compactBar.classList.remove("hidden");
      if (pillsWrap) pillsWrap.classList.add("hidden");
    }

    const currSelect = document.getElementById("editor-currency-select");
    if (currSelect) currSelect.value = AppState.shopConfig.currency || "S/";
    const condInput = document.getElementById("editor-condition-input");
    if (condInput) condInput.value = "Nuevo";
    const locInput = document.getElementById("editor-location-input");
    if (locInput) locInput.value = "";

    this.onListingTypeChange(this.currentListingType, []);
    this.renderEditorPhotosStrip();

    const videoUrlInput = document.getElementById("editor-video-url-input");
    if (videoUrlInput) videoUrlInput.value = "";
    const videoPreviewWrap = document.getElementById("editor-video-preview-wrap");
    if (videoPreviewWrap) videoPreviewWrap.classList.add("hidden");
    const videoPreview = document.getElementById("editor-video-preview");
    if (videoPreview) { videoPreview.pause(); videoPreview.src = ""; }

    const previewImg = document.getElementById("editor-photo-preview");
    const placeholder = document.getElementById("editor-photo-placeholder");
    if (previewImg) {
      previewImg.src = "";
      previewImg.classList.add("hidden");
    }
    if (placeholder) placeholder.classList.remove("hidden");

    const currSymbol = document.getElementById("editor-currency-symbol");
    if (currSymbol) currSymbol.textContent = AppState.shopConfig.currency || "S/";

    this.renderEditorCategoryChips("");

    const preselectCatalog = (AppState.activeStudioCatalogId && AppState.activeStudioCatalogId !== "all")
      ? AppState.activeStudioCatalogId
      : "cat_main";
    this.populateCatalogSelect(preselectCatalog);

    if (title) title.textContent = "Añadir Nuevo Producto";
    const modal = document.getElementById("studio-product-modal");
    if (modal) modal.classList.remove("hidden");
    editor.classList.remove("hidden");
  },

  async openEditProduct(productId) {
    const p = AppState.products.find(item => item.id === productId);
    if (!p) return;

    const editor = document.getElementById("studio-product-editor");
    const title = document.getElementById("editor-form-title");
    if (!editor) return;

    document.getElementById("editor-product-id").value = p.id;
    document.getElementById("editor-name-input").value = p.name;
    document.getElementById("editor-price-input").value = p.price;
    document.getElementById("editor-category-input").value = p.category;
    document.getElementById("editor-sku-input").value = p.sku || "";
    document.getElementById("editor-desc-input").value = p.desc || "";
    document.getElementById("editor-sizes-input").value = (p.sizes || []).join(", ");
    document.getElementById("editor-colors-input").value = (p.colors || []).join(", ");
    document.getElementById("editor-available-check").checked = p.available !== false;
    document.getElementById("editor-promo-check").checked = !!p.promo;

    this.currentProductPhoto = p.img || "";
    this.currentProductVideo = p.videoUrl || "";

    const videoUrlInput = document.getElementById("editor-video-url-input");
    const videoPreviewWrap = document.getElementById("editor-video-preview-wrap");
    const videoPreview = document.getElementById("editor-video-preview");

    if (videoUrlInput) videoUrlInput.value = (p.videoUrl && !p.videoUrl.startsWith("idb://")) ? p.videoUrl : "";
    const resolvedVideo = await MediaStore.resolveVideoUrl(p.videoUrl || "");
    if (p.videoUrl && videoPreviewWrap && videoPreview) {
      if (resolvedVideo && (resolvedVideo.endsWith(".mp4") || resolvedVideo.endsWith(".webm") || resolvedVideo.startsWith("blob:") || resolvedVideo.startsWith("data:"))) {
        videoPreview.src = resolvedVideo;
        videoPreview.classList.remove("hidden");
      } else {
        videoPreview.classList.add("hidden");
      }
      videoPreviewWrap.classList.remove("hidden");
    } else if (videoPreviewWrap) {
      videoPreviewWrap.classList.add("hidden");
    }

    this.updateVariantInputLabels();

    const previewImg = document.getElementById("editor-photo-preview");
    const placeholder = document.getElementById("editor-photo-placeholder");

    if (p.img && previewImg) {
      previewImg.src = p.img;
      previewImg.classList.remove("hidden");
      if (placeholder) placeholder.classList.add("hidden");
    } else {
      if (previewImg) previewImg.classList.add("hidden");
      if (placeholder) placeholder.classList.remove("hidden");
    }

    const currentNiche = AppState.shopConfig.niche || AppState.activePreset || "general";
    let defaultType = "item";
    if (currentNiche === "tech" || currentNiche === "digital") defaultType = "digital";
    else if (currentNiche === "vehicles") defaultType = "vehicle";
    else if (currentNiche === "property") defaultType = "property";

    this.currentListingType = p.listingType || defaultType;

    const compactBar = document.getElementById("editor-type-compact-bar");
    const pillsWrap = document.getElementById("editor-listing-type-pills");
    if (currentNiche === "general") {
      if (compactBar) compactBar.classList.add("hidden");
      if (pillsWrap) pillsWrap.classList.remove("hidden");
    } else {
      if (compactBar) compactBar.classList.remove("hidden");
      if (pillsWrap) pillsWrap.classList.add("hidden");
    }
    this.currentProductImages = (Array.isArray(p.images) && p.images.length > 0) ? [...p.images] : (p.img ? [p.img] : []);
    this.currentProductPhoto = this.currentProductImages[0] || p.img || "";

    const currSelect = document.getElementById("editor-currency-select");
    if (currSelect) currSelect.value = p.currency || AppState.shopConfig.currency || "S/";
    const condInput = document.getElementById("editor-condition-input");
    if (condInput) condInput.value = p.condition || "";
    const locInput = document.getElementById("editor-location-input");
    if (locInput) locInput.value = p.location || "";

    this.onListingTypeChange(this.currentListingType, p.specs || []);
    this.renderEditorPhotosStrip();
    this.renderEditorCategoryChips(p.category);
    this.populateCatalogSelect(p.catalogId || "cat_main");

    if (title) title.textContent = "Editar Producto";
    const modal = document.getElementById("studio-product-modal");
    if (modal) modal.classList.remove("hidden");
    editor.classList.remove("hidden");
  },

  closeProductEditor() {
    const modal = document.getElementById("studio-product-modal");
    if (modal) modal.classList.add("hidden");
    const editor = document.getElementById("studio-product-editor");
    if (editor) editor.classList.add("hidden");
  },

  async handleProductPhotoUpload(file) {
    if (!file) return;
    await this.handleMultiPhotoUpload([file]);
  },

  async handleProductVideoUpload(file) {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("El video supera los 50MB. Te sugerimos recortar el clip o usar un archivo más ligero.");
      return;
    }
    try {
      Toast.show("Guardando clip de video...", "🎥");
      const key = "vid_" + Date.now();
      await MediaStore.saveMedia(key, file);
      const localUrl = URL.createObjectURL(file);
      this.currentProductVideo = "idb://" + key;

      const previewWrap = document.getElementById("editor-video-preview-wrap");
      const previewVideo = document.getElementById("editor-video-preview");
      const urlInput = document.getElementById("editor-video-url-input");

      if (previewVideo) {
        previewVideo.src = localUrl;
        previewVideo.classList.remove("hidden");
      }
      if (previewWrap) previewWrap.classList.remove("hidden");
      if (urlInput) urlInput.value = "";

      Toast.show("¡Video guardado en tu catálogo!", "✅");
    } catch (err) {
      alert("Error al cargar video: " + err.message);
    }
  },

  removeProductVideo() {
    this.currentProductVideo = "";
    const previewWrap = document.getElementById("editor-video-preview-wrap");
    const previewVideo = document.getElementById("editor-video-preview");
    const urlInput = document.getElementById("editor-video-url-input");
    const fileInput = document.getElementById("editor-video-file-input");
    if (previewVideo) {
      previewVideo.pause();
      previewVideo.src = "";
    }
    if (previewWrap) previewWrap.classList.add("hidden");
    if (urlInput) urlInput.value = "";
    if (fileInput) fileInput.value = "";
    Toast.show("Video eliminado del producto", "🗑️");
  },

  handleProductVideoUrlChange(url) {
    this.currentProductVideo = url.trim();
    const previewWrap = document.getElementById("editor-video-preview-wrap");
    const previewVideo = document.getElementById("editor-video-preview");
    if (this.currentProductVideo && previewWrap && previewVideo) {
      if (this.currentProductVideo.endsWith(".mp4") || this.currentProductVideo.endsWith(".webm") || this.currentProductVideo.startsWith("blob:") || this.currentProductVideo.startsWith("data:")) {
        previewVideo.src = this.currentProductVideo;
        previewVideo.classList.remove("hidden");
      } else {
        previewVideo.classList.add("hidden");
      }
      previewWrap.classList.remove("hidden");
    } else if (previewWrap) {
      previewWrap.classList.add("hidden");
    }
  },

  removeProductVideo() {
    this.currentProductVideo = "";
    const videoUrlInput = document.getElementById("editor-video-url-input");
    const videoFileInput = document.getElementById("editor-video-file-input");
    const previewWrap = document.getElementById("editor-video-preview-wrap");
    const previewVideo = document.getElementById("editor-video-preview");

    if (videoUrlInput) videoUrlInput.value = "";
    if (videoFileInput) videoFileInput.value = "";
    if (previewVideo) {
      previewVideo.pause();
      previewVideo.src = "";
    }
    if (previewWrap) previewWrap.classList.add("hidden");
    Toast.show("Video removido", "ℹ️");
  },

  saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById("editor-product-id").value;
    const name = document.getElementById("editor-name-input").value.trim();
    const price = parseFloat(document.getElementById("editor-price-input").value);
    const category = document.getElementById("editor-category-input").value.trim();
    const sku = document.getElementById("editor-sku-input").value.trim();
    const desc = document.getElementById("editor-desc-input").value.trim();
    const sizesStr = document.getElementById("editor-sizes-input").value.trim();
    const colorsStr = document.getElementById("editor-colors-input").value.trim();
    const urlInput = document.getElementById("editor-url-input");
    const promo = document.getElementById("editor-promo-check").checked;
    const available = document.getElementById("editor-available-check").checked;

    const listingType = document.getElementById("editor-listing-type")?.value || "item";
    const currency = document.getElementById("editor-currency-select")?.value || AppState.shopConfig.currency || "S/";
    const condition = document.getElementById("editor-condition-input")?.value.trim() || "";
    const location = document.getElementById("editor-location-input")?.value.trim() || "";

    // Dynamic specs collection
    const specs = [];
    document.querySelectorAll("#editor-dynamic-specs-container .spec-input").forEach(input => {
      const val = input.value.trim();
      const label = input.getAttribute("data-spec-label") || "";
      if (val && label) {
        specs.push({ label, value: val });
      }
    });

    const urlVal = urlInput ? urlInput.value.trim() : "";
    const img = this.currentProductPhoto || urlVal || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";
    const images = this.currentProductImages.length > 0 ? [...this.currentProductImages] : (img ? [img] : []);

    if (!name || isNaN(price) || !category) {
      alert("Por favor completa los campos obligatorios: Nombre, Precio y Categoría.");
      return;
    }

    // Auto-registrar categoría si no existe en AppState.categories
    const catExists = (AppState.categories || []).some(
      c => c.name.toLowerCase() === category.toLowerCase()
    );
    if (!catExists) {
      AppState.addCategory(category);
    }

    if (AppState.activePreset !== "sneakers") {
      const sneakerDefaultCats = ["Urbano & Streetwear", "Deportivas & Running", "Edición Limitada", "Botines & Casual"];
      AppState.categories = (AppState.categories || []).filter(c => {
        if (sneakerDefaultCats.includes(c.name)) {
          return AppState.products.some(prod => prod.category === c.name);
        }
        return true;
      });
      AppState.saveCategories();
    }

    const sizes = sizesStr ? sizesStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    const colors = colorsStr ? colorsStr.split(",").map(c => c.trim()).filter(Boolean) : [];

    const videoUrlInput = document.getElementById("editor-video-url-input");
    const videoUrl = this.currentProductVideo || (videoUrlInput ? videoUrlInput.value.trim() : "");

    // Catálogo de pertenencia (Etapa 2)
    const catalogSelect = document.getElementById("editor-catalog-select");
    const catalogId = catalogSelect ? catalogSelect.value : (AppState.activeStudioCatalogId !== "all" ? AppState.activeStudioCatalogId : "cat_main");

    if (id) {
      const idx = AppState.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        AppState.products[idx] = {
          ...AppState.products[idx],
          name, price, category, sku, desc, sizes, colors, img: images[0] || img,
          images, listingType, currency, condition, location, specs, videoUrl, promo, available,
          catalogId: catalogId || AppState.products[idx].catalogId || "cat_main"
        };
      }
    } else {
      const newProd = {
        id: "p_" + Date.now(),
        sku: sku || `COD-${AppState.products.length + 1}`,
        name, price, category, sku, desc, sizes, colors, img: images[0] || img,
        images, listingType, currency, condition, location, specs, videoUrl, promo, available,
        catalogId: catalogId || "cat_main"
      };
      AppState.products.unshift(newProd);
    }

    AppState.saveProducts();
    this.closeProductEditor();
    this.renderCatalogsBar();
    this.renderCategoryFilters();
    this.renderProductsList();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    Toast.show(`Producto "${name}" guardado exitosamente`, "✅");
  },

  deleteProduct(productId) {
    const p = AppState.products.find(item => item.id === productId);
    const prodName = p ? p.name : "este producto";

    if (!confirm(`¿Eliminar definitivamente "${prodName}" del catálogo?`)) return;

    AppState.products = AppState.products.filter(item => item.id !== productId);
    
    Object.keys(AppState.cart).forEach(key => {
      if (key.startsWith(productId)) delete AppState.cart[key];
    });

    AppState.saveProducts();
    AppState.saveCart();
    this.renderCategoryFilters();
    this.renderProductsList();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    CustomerUI.updateCartBar();
    Toast.show("Producto eliminado del catálogo", "🗑️");
  },

  populateSettingsTab() {
    const shop = AppState.shopConfig;
    const slugInput = document.getElementById("settings-store-slug");
    const slugPrefix = document.getElementById("settings-slug-prefix");
    const slug = AppState.getStoreSlug();
    if (slugInput) slugInput.value = slug;

    const highlightUrl = document.getElementById("highlight-store-url");
    if (highlightUrl) {
      highlightUrl.textContent = `${APP_BRAND.domainHint}/${slug}`;
    }
    if (slugPrefix) slugPrefix.textContent = `${APP_BRAND.domainHint}/`;

    const phoneInput = document.getElementById("settings-phone");
    const currInput = document.getElementById("settings-currency");
    const costInput = document.getElementById("settings-delivery-cost");
    const timeInput = document.getElementById("settings-delivery-time");
    const sheetInput = document.getElementById("cloud-sheet-url");

    if (phoneInput) phoneInput.value = shop.phone || "";
    if (currInput) currInput.value = shop.currency || "S/";
    if (costInput) costInput.value = shop.deliveryCost || 5.0;
    if (timeInput) timeInput.value = shop.deliveryTime || "25-35 min";
    if (sheetInput) sheetInput.value = shop.googleSheetUrl || "";

    // Datos de Yape & Plin
    const yapeEnabledCheck = document.getElementById("settings-yape-enabled");
    const yapePhoneInput = document.getElementById("settings-yape-phone");
    const yapeNameInput = document.getElementById("settings-yape-name");
    const yapeQrPreview = document.getElementById("settings-yape-qr-preview");
    const yapeQrPlaceholder = document.getElementById("settings-yape-qr-placeholder");
    const removeYapeQrBtn = document.getElementById("remove-yape-qr-btn");

    if (yapeEnabledCheck) yapeEnabledCheck.checked = shop.yapeEnabled !== false;
    if (yapePhoneInput) yapePhoneInput.value = shop.yapePhone || shop.phone || "";
    if (yapeNameInput) yapeNameInput.value = shop.yapeName || shop.name || "";

    if (yapeQrPreview && yapeQrPlaceholder) {
      if (shop.yapeQrUrl) {
        yapeQrPreview.src = shop.yapeQrUrl;
        yapeQrPreview.classList.remove("hidden");
        yapeQrPlaceholder.classList.add("hidden");
        if (removeYapeQrBtn) removeYapeQrBtn.classList.remove("hidden");
      } else {
        yapeQrPreview.classList.add("hidden");
        yapeQrPlaceholder.classList.remove("hidden");
        if (removeYapeQrBtn) removeYapeQrBtn.classList.add("hidden");
      }
    }

    document.querySelectorAll(".niche-card-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-niche") === AppState.activePreset);
    });
  },

  saveSettingsForm(e) {
    if (e) e.preventDefault();
    const slugInp = document.getElementById("settings-store-slug");
    if (slugInp && slugInp.value.trim()) {
      AppState.shopConfig.storeSlug = slugifyStoreName(slugInp.value.trim());
    }
    const phone = document.getElementById("settings-phone")?.value.trim() || AppState.shopConfig.phone;
    const currency = document.getElementById("settings-currency")?.value.trim() || "S/";
    const deliveryCost = parseFloat(document.getElementById("settings-delivery-cost")?.value) || 0;
    const deliveryTime = document.getElementById("settings-delivery-time")?.value.trim() || "Envíos hoy";

    const yapeEnabled = document.getElementById("settings-yape-enabled")?.checked ?? true;
    const yapePhone = document.getElementById("settings-yape-phone")?.value.trim() || "";
    const yapeName = document.getElementById("settings-yape-name")?.value.trim() || "";

    AppState.shopConfig.phone = phone;
    AppState.shopConfig.currency = currency;
    AppState.shopConfig.deliveryCost = deliveryCost;
    AppState.shopConfig.deliveryTime = deliveryTime;
    AppState.shopConfig.yapeEnabled = yapeEnabled;
    AppState.shopConfig.yapePhone = yapePhone;
    AppState.shopConfig.yapeName = yapeName;

    AppState.saveConfig();
    this.renderProductsList();
    AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    CustomerUI.renderProductCards();
    CustomerUI.renderYapeCheckoutBox();
    Toast.show("Ajustes de tienda y cobros guardados con éxito", "💾");
  },

  exportJSON() {
    const backupData = {
      version: "2.2-studio-categories",
      timestamp: new Date().toISOString(),
      shopConfig: AppState.shopConfig,
      categories: AppState.categories,
      products: AppState.products
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `tiendazap_respaldo_${AppState.shopConfig.name.replace(/\s+/g, '_')}.json`);
    dlAnchor.click();
    Toast.show("Copia de seguridad descargada (.JSON)", "💾");
  },

  importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.shopConfig && data.products) {
          AppState.shopConfig = data.shopConfig;
          AppState.products = data.products;
          if (Array.isArray(data.categories)) {
            AppState.categories = data.categories;
            AppState.saveCategories();
          } else {
            AppState.initCategories();
          }
          AppState.saveConfig();
          AppState.saveProducts();
          this.renderAll();
          AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
          CustomerUI.renderCategoryTabs();
          CustomerUI.renderProductCards();
          CustomerUI.renderYapeCheckoutBox();
          Toast.show("Datos restaurados correctamente", "🎉");
        } else {
          alert("El archivo no contiene un respaldo válido de TiendaZap.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }
};

// ============================================================================
// 8. EXPERIENCIA DEL CLIENTE (VISTA PREVIA DEL COMPRADOR)
// ============================================================================
const CustomerUI = {
  renderStoreHeader() {
    const shop = AppState.shopConfig;
    const bannerEl = document.getElementById("store-banner-img");
    const logoEl = document.getElementById("store-logo-img");
    const nameEl = document.getElementById("store-name");
    const taglineEl = document.getElementById("store-tagline");
    const statusDot = document.getElementById("store-status-dot");
    const statusPill = document.getElementById("store-status-pill");
    const deliveryTimePill = document.getElementById("delivery-time-pill");
    const deliveryCostPill = document.getElementById("delivery-cost-pill");

    if (bannerEl) bannerEl.src = shop.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";
    if (logoEl) logoEl.src = getEffectiveStoreLogo(shop);
    if (nameEl) nameEl.textContent = shop.name || "Mi Tienda Digital";
    if (taglineEl) taglineEl.textContent = shop.tagline || "Catálogo y pedidos directos por WhatsApp";

    // Perfil comercial estilo WhatsApp Business (Horario, Dirección, Correo)
    const profileLineEl = document.getElementById("store-business-profile-line");
    if (profileLineEl) {
      const items = [];
      if (shop.hours && shop.hours.trim()) {
        items.push(`
          <span class="store-profile-item" title="Horario de atención">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${escapeHtml(shop.hours.trim())}</span>
          </span>
        `);
      }
      if (shop.address && shop.address.trim()) {
        items.push(`
          <span class="store-profile-item" title="Ubicación o zona de atención">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${escapeHtml(shop.address.trim())}</span>
          </span>
        `);
      }
      if (shop.email && shop.email.trim()) {
        const cleanMail = shop.email.trim();
        items.push(`
          <span class="store-profile-item" title="Correo de atención">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <a href="mailto:${escapeHtml(cleanMail)}" class="store-profile-link">${escapeHtml(cleanMail)}</a>
          </span>
        `);
      }

      if (items.length > 0) {
        profileLineEl.innerHTML = items.join('<span class="store-profile-sep">•</span>');
        profileLineEl.classList.remove("hidden");
      } else {
        profileLineEl.innerHTML = "";
        profileLineEl.classList.add("hidden");
      }
    }

    const slug = AppState.getStoreSlug();
    const sealEl = document.getElementById("seal-slug-text");
    if (sealEl) sealEl.textContent = `${APP_BRAND.domainHint}/${slug}`;

    document.title = `✅ ${shop.name || "Tienda"} — Catálogo Oficial & Pedidos por WhatsApp`;

    if (statusDot) {
      statusDot.className = `status-indicator-dot ${shop.isOpen ? "online" : "offline"}`;
    }

    if (statusPill) {
      statusPill.innerHTML = `<span class="meta-dot ${shop.isOpen ? "online" : "offline"}"></span> ${shop.isOpen ? "Abierto ahora" : "Cerrado por hoy"}`;
    }

    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const isLicenseStore = /licencia|software|digital|tech|keys/i.test((shop.name || "") + " " + (slug || ""));
    const isDigital = isLicenseStore || AppState.activePreset === "digital" || AppState.activePreset === "tech" || AppState.shopConfig.niche === "tech" || (AppState.products.length > 0 && AppState.products.some(p => p.listingType === "digital" || /licencia|adobe|autodesk|windows|office|microsoft|antivirus|canva|capcut|spotify|netflix|vpn/i.test((p.name || "") + " " + (p.sku || ""))));
    const isVehicle = AppState.activePreset === "vehicles" || AppState.shopConfig.niche === "vehicles" || (AppState.products.length > 0 && AppState.products.every(p => p.listingType === "vehicle"));

    if (taglineEl) {
      if (isDigital && (!shop.tagline || shop.tagline.includes("contraentrega") || shop.tagline.includes("Catálogo y pedidos") || shop.tagline.includes("favoritos en tendencia"))) {
        taglineEl.textContent = "Licencias originales con activación inmediata y soporte directo por WhatsApp ⚡💻";
      } else {
        taglineEl.textContent = shop.tagline || "Catálogo y pedidos directos por WhatsApp";
      }
    }

    if (deliveryTimePill) {
      if (isDigital) {
        deliveryTimePill.textContent = "⚡ Entrega Inmediata";
      } else if (isVehicle) {
        deliveryTimePill.textContent = "⏱️ Coordinar Visita";
      } else {
        const isFashion = AppState.activePreset === "fashion" || AppState.activePreset === "beauty";
        const icon = isFashion ? "📦" : "⏱️";
        deliveryTimePill.textContent = `${icon} ${shop.deliveryTime || nicheInfo.defaultDeliveryTime || "24-48h"}`;
      }
    }

    if (deliveryCostPill) {
      if (isDigital || Number(shop.deliveryCost || 0) === 0) {
        deliveryCostPill.textContent = "Envío gratis";
      } else if (isVehicle) {
        deliveryCostPill.textContent = "📍 Trato Directo";
      } else {
        deliveryCostPill.textContent = `Delivery ${shop.currency} ${Number(shop.deliveryCost || 0).toFixed(2)}`;
      }
    }

    const cartStoreName = document.getElementById("cart-modal-store-name");
    if (cartStoreName) cartStoreName.textContent = shop.name;

    // Banner sutil de Catálogo Activo para el Comprador (Etapa 2)
    const catBanner = document.getElementById("store-active-catalog-banner");
    const catNameEl = document.getElementById("store-active-catalog-name");
    if (catBanner) {
      if (AppState.activeCustomerCatalogSlug) {
        const matched = (AppState.catalogs || []).find(
          c => (c.slug && c.slug.toLowerCase() === AppState.activeCustomerCatalogSlug.toLowerCase()) || c.id === AppState.activeCustomerCatalogSlug
        );
        const displayName = matched ? matched.name : AppState.activeCustomerCatalogSlug;
        if (catNameEl) catNameEl.textContent = displayName;
        catBanner.classList.remove("hidden");
      } else {
        catBanner.classList.add("hidden");
      }
    }

    // Renderizado de Redes Sociales del Negocio (con íconos limpios SVG)
    const socialsWrap = document.getElementById("store-social-links");
    if (socialsWrap) {
      const soc = shop.socials || {};
      let socialButtonsHtml = "";

      if (soc.instagram) {
        const handle = soc.instagram.trim();
        const url = handle.startsWith("http") ? handle : `https://instagram.com/${handle.replace(/^@/, "")}`;
        socialButtonsHtml += `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="store-social-btn" title="Instagram" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        `;
      }

      if (soc.tiktok) {
        const handle = soc.tiktok.trim();
        const url = handle.startsWith("http") ? handle : `https://tiktok.com/@${handle.replace(/^@/, "")}`;
        socialButtonsHtml += `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="store-social-btn" title="TikTok" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          </a>
        `;
      }

      if (soc.facebook) {
        const handle = soc.facebook.trim();
        const url = handle.startsWith("http") ? handle : `https://facebook.com/${handle}`;
        socialButtonsHtml += `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="store-social-btn" title="Facebook" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        `;
      }

      if (soc.website) {
        const rawWeb = soc.website.trim();
        const url = rawWeb.startsWith("http") ? rawWeb : `https://${rawWeb}`;
        socialButtonsHtml += `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="store-social-btn" title="Sitio Web" aria-label="Sitio Web">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </a>
        `;
      }

      if (socialButtonsHtml) {
        socialsWrap.innerHTML = socialButtonsHtml;
        socialsWrap.classList.remove("hidden");
      } else {
        socialsWrap.innerHTML = "";
        socialsWrap.classList.add("hidden");
      }
    }
  },

  renderYapeCheckoutBox() {
    const yapeBox = document.getElementById("yape-checkout-box");
    if (!yapeBox) return;

    if (AppState.paymentMethod !== "Yape / Plin") {
      yapeBox.classList.add("hidden");
      return;
    }

    yapeBox.classList.remove("hidden");
    const shop = AppState.shopConfig;
    const currency = shop.currency || "S/";
    const total = CartController.getGrandTotal();

    const amountEl = document.getElementById("yape-checkout-amount");
    const phoneEl = document.getElementById("yape-checkout-phone");
    const titularEl = document.getElementById("yape-checkout-titular");
    const qrWrap = document.getElementById("yape-merchant-qr-wrap");
    const qrImg = document.getElementById("yape-checkout-qr-img");

    if (amountEl) amountEl.textContent = `Total: ${currency} ${total.toFixed(2)}`;
    if (phoneEl) phoneEl.textContent = shop.yapePhone || shop.phone || "987 654 321";
    if (titularEl) titularEl.textContent = shop.yapeName || shop.name || "Comercio Registrado";

    if (qrWrap && qrImg) {
      if (shop.yapeQrUrl) {
        qrImg.src = shop.yapeQrUrl;
        qrWrap.style.display = "flex";
      } else {
        qrWrap.style.display = "none";
      }
    }
  },

  async handleBuyerVoucherUpload(file) {
    if (!file) return;
    try {
      AppState.buyerVoucherFile = file;
      Toast.show("Optimizando comprobante...", "⏳");
      const compressedUrl = await ImageOptimizer.compressImage(file, 900, 0.85);
      AppState.buyerVoucherBase64 = compressedUrl;

      const previewWrap = document.getElementById("voucher-preview-wrap");
      const emptyPrompt = document.getElementById("voucher-empty-prompt");
      const previewImg = document.getElementById("buyer-voucher-preview-img");

      if (previewImg) previewImg.src = compressedUrl;
      if (previewWrap) previewWrap.classList.remove("hidden");
      if (emptyPrompt) emptyPrompt.classList.add("hidden");

      Toast.show("¡Comprobante adjuntado con éxito!", "✅");
    } catch (e) {
      alert("Error al cargar comprobante: " + e.message);
    }
  },

  removeBuyerVoucher() {
    AppState.buyerVoucherBase64 = "";
    AppState.buyerVoucherFile = null;
    const previewWrap = document.getElementById("voucher-preview-wrap");
    const emptyPrompt = document.getElementById("voucher-empty-prompt");
    const voucherInput = document.getElementById("buyer-voucher-input");

    if (voucherInput) voucherInput.value = "";
    if (previewWrap) previewWrap.classList.add("hidden");
    if (emptyPrompt) emptyPrompt.classList.remove("hidden");
    Toast.show("Comprobante removido", "ℹ️");
  },

  getCategoryIcon(catName) {
    if (!catName || catName.toLowerCase() === "all" || catName.toLowerCase() === "todos") return "";
    const found = (AppState.categories || []).find(c => c && c.name && c.name.toLowerCase() === catName.toLowerCase());
    if (found && found.icon && !["🛍️", "✨"].includes(found.icon)) return found.icon;
    return "";
  },

  getCustomerBaseProducts() {
    if (!AppState.activeCustomerCatalogSlug) return AppState.products || [];
    const targetSlug = String(AppState.activeCustomerCatalogSlug).toLowerCase().trim();
    const matched = (AppState.catalogs || []).find(
      c => (c.slug && c.slug.toLowerCase() === targetSlug) || (c.id && c.id.toLowerCase() === targetSlug)
    );
    const targetId = matched ? matched.id : (targetSlug === "principal" ? "cat_main" : null);

    return (AppState.products || []).filter(p => {
      const pCatId = p.catalogId || "cat_main";
      if (targetId) return pCatId === targetId;
      return false;
    });
  },

  getCategories() {
    const baseProds = this.getCustomerBaseProducts();
    (baseProds || []).forEach(p => {
      AppState.migrateProduct(p);
      const c = (p.category || "").trim().toLowerCase();
      if (!c || c === "undefined" || c === "null" || c === "[object object]") {
        p.category = (p.listingType === "digital" || AppState.activePreset === "tech" || AppState.activePreset === "digital") ? "Licencias & Software" : "General";
      }
    });

    const catCounts = {};
    baseProds.forEach(p => {
      const cName = (p.category || "General").trim();
      const key = cName.toLowerCase();
      catCounts[key] = (catCounts[key] || 0) + 1;
    });

    const list = AppState.getCategoriesList() || [];
    const validCats = list
      .filter(c => {
        if (!c || !c.name) return false;
        const n = String(c.name).trim().toLowerCase();
        const countInCatalog = catCounts[n] || 0;
        return n !== "" && n !== "undefined" && n !== "null" && n !== "[object object]" && countInCatalog > 0;
      })
      .map(c => {
        const cleanName = String(c.name).trim();
        const rawLabel = (c.label && String(c.label).trim()) || cleanName;
        const cleanLabel = (rawLabel.toLowerCase() !== "undefined" && rawLabel.toLowerCase() !== "null") ? rawLabel : cleanName;
        return {
          ...c,
          name: cleanName,
          label: cleanLabel || "General",
          icon: c.icon || CustomerUI.getCategoryIcon(cleanName),
          count: catCounts[cleanName.toLowerCase()] || 0
        };
      });

    return [
      { name: "all", label: "Todos", count: baseProds.length, icon: "" },
      ...validCats
    ];
  },

  renderCategoryTabs() {
    const track = document.getElementById("customer-categories-track");
    if (!track) return;

    const categories = this.getCategories();
    if (AppState.customerCategory !== "all" && !categories.some(c => c.name.toLowerCase() === AppState.customerCategory.toLowerCase())) {
      AppState.customerCategory = "all";
    }

    track.innerHTML = categories.map(cat => {
      const icon = cat.icon || CustomerUI.getCategoryIcon(cat.name);
      return `
      <button class="cat-tab-btn ${AppState.customerCategory === cat.name ? "active" : ""}" 
              data-category="${escapeHtml(cat.name)}" type="button">
        ${icon ? `<span class="cat-tab-icon">${icon}</span>` : ""}
        <span>${escapeHtml(cat.label || cat.name || "General")}</span>
        <span class="cat-tab-count">${cat.count}</span>
      </button>
    `;
    }).join("");

    track.querySelectorAll(".cat-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.customerCategory = btn.getAttribute("data-category");
        this.renderCategoryTabs();
        this.renderProductCards();
      });
    });
  },

  buildProductCardHtml(p, defaultCurrency) {
    AppState.migrateProduct(p);
    const isAvailable = p.available !== false;
    const hasVariants = (p.sizes && p.sizes.length > 0) || (p.colors && p.colors.length > 0);
    const isVehicle = p.listingType === "vehicle" || p.listingType === "property";
    const isDigital = p.listingType === "digital" || (!p.listingType && (AppState.activePreset === "tech" || AppState.activePreset === "digital"));
    const prodCurrency = p.currency || defaultCurrency;
    const photosCount = (Array.isArray(p.images) && p.images.length > 0) ? p.images.length : (p.img ? 1 : 0);

    // Quick specs pills
    let quickSpecs = [];
    if (Array.isArray(p.specs) && p.specs.length > 0) {
      quickSpecs = p.specs.slice(0, 3).map(s => s.value);
    } else if (p.condition || p.location) {
      if (p.condition) quickSpecs.push(p.condition);
      if (p.location) quickSpecs.push(p.location);
    }

    const cleanDesc = (p.desc || "").trim();
    const hasValidDesc = cleanDesc && !cleanDesc.toLowerCase().includes("registro inicial");
    const formattedPrice = Number(p.price).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    return `
      <div class="product-card ${!isAvailable ? 'out-of-stock' : ''}" data-product-id="${escapeHtml(p.id)}">
        <div class="product-img-wrapper" onclick="CustomerUI.openProductModal('${escapeHtml(p.id)}')">
          <img src="${p.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}" 
               alt="${escapeHtml(p.name)}" class="product-card-img" loading="lazy">
          ${photosCount > 1 ? `<span class="badge-photo-count">1/${photosCount}</span>` : ""}
          ${p.videoUrl ? `<span class="badge-video-flag">Video</span>` : ""}
          ${p.promo ? `<span class="badge-promo-flag">PROMO</span>` : ""}
          ${!isAvailable ? `<span class="badge-out-of-stock">AGOTADO</span>` : ""}
        </div>

        <div class="product-info-wrapper">
          <div>
            ${p.sku ? `<div style="margin-bottom: 2px;"><span class="badge-sku">REF: ${escapeHtml(p.sku)}</span></div>` : ""}
            <h3 class="product-name" onclick="CustomerUI.openProductModal('${escapeHtml(p.id)}')">${escapeHtml(p.name)}</h3>
            ${quickSpecs.length > 0 ? `
              <div class="product-specs-quick-pills">
                ${quickSpecs.map(sp => `<span class="quick-spec-pill">${escapeHtml(sp)}</span>`).join("")}
              </div>
            ` : hasValidDesc ? `
              <p class="product-desc">${escapeHtml(cleanDesc)}</p>
            ` : ""}
          </div>

          <div class="product-bottom-row">
            <span class="product-price">${prodCurrency} ${formattedPrice}</span>

            ${!isAvailable ? `
              <button class="add-product-btn btn-disabled" disabled type="button">
                <span>Agotado</span>
              </button>
            ` : isVehicle ? `
              <button class="btn-inquire-direct" onclick="CustomerUI.openProductModal('${escapeHtml(p.id)}')" type="button">
                <span>Ver ficha</span>
              </button>
            ` : isDigital ? `
              <button class="add-product-btn" onclick="CustomerUI.openProductModal('${escapeHtml(p.id)}')" type="button">
                <span>Ver opciones</span>
              </button>
            ` : hasVariants ? `
              <button class="add-product-btn" onclick="CustomerUI.openProductModal('${escapeHtml(p.id)}')" type="button">
                <span>Ver opciones</span>
              </button>
            ` : `
              <button class="add-product-btn" onclick="CartController.addToCart('${escapeHtml(p.id)}', 1)" type="button">
                <span>+ Agregar</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderProductCards() {
    const container = document.getElementById("customer-product-list");
    const emptyState = document.getElementById("customer-empty-state");
    if (!container) return;

    const baseProds = this.getCustomerBaseProducts();
    const query = AppState.customerSearchQuery.toLowerCase().trim();
    let filtered = [...baseProds];

    if (AppState.customerCategory !== "all") {
      filtered = filtered.filter(p => (p.category || "").trim().toLowerCase() === AppState.customerCategory.trim().toLowerCase());
    }

    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.desc && p.desc.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      if (emptyState) {
        emptyState.classList.remove("hidden");
        const titleEl = emptyState.querySelector(".empty-title");
        const descEl = emptyState.querySelector(".empty-desc");
        if (AppState.products.length === 0) {
          if (titleEl) titleEl.textContent = "Catálogo en preparación";
          if (descEl) descEl.textContent = "El comerciante está cargando sus productos. ¡Puedes contactarlo directamente por WhatsApp!";
        } else {
          if (titleEl) titleEl.textContent = "No encontramos productos";
          if (descEl) descEl.textContent = "Prueba buscando con otra palabra o revisa otra categoría.";
        }
      }
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    const defaultCurrency = AppState.shopConfig.currency || "S/";
    const isDetailed = AppState.catalogViewMode === "detailed";

    // Si está en 'Todos': catálogo continuo estilo Marketplace
    if (AppState.customerCategory === "all") {
      container.innerHTML = `
        <section class="category-section-block marketplace-continuous-catalog">
          <div class="products-grid ${isDetailed ? 'view-detailed' : ''}">
            ${filtered.map(p => this.buildProductCardHtml(p, defaultCurrency)).join("")}
          </div>
        </section>
      `;
      return;
    }

    // Si seleccionó una categoría específica
    const activeCatName = AppState.customerCategory;
    const catIcon = this.getCategoryIcon(activeCatName);
    const slugId = `cat-${activeCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    container.innerHTML = `
      <section class="category-section-block" id="${slugId}">
        <div class="category-section-header">
          <h2 class="category-section-title">${catIcon ? `<span class="cat-sec-icon">${catIcon}</span> ` : ""}${escapeHtml(activeCatName)}</h2>
          <span class="category-section-qty">${filtered.length} ${filtered.length === 1 ? 'opción' : 'opciones'}</span>
        </div>
        <div class="products-grid ${isDetailed ? 'view-detailed' : ''}">
          ${filtered.map(p => this.buildProductCardHtml(p, defaultCurrency)).join("")}
        </div>
      </section>
    `;
  },

  copyLiveProductLink(productId, e) {
    if (e) e.stopPropagation();
    const baseUrl = window.location.origin + window.location.pathname;
    const directUrl = `${baseUrl}?p=${productId}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(directUrl).then(() => {
        Toast.show("Enlace de Live copiado al portapapeles", "🔴");
      });
    } else {
      prompt("Copia este enlace directo para tus clientes:", directUrl);
    }
  },

  openProductModal(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;

    AppState.selectedProductModal = product;
    AppState.modalQuantity = 1;
    AppState.modalSelectedSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "";
    AppState.modalSelectedColor = (product.colors && product.colors.length > 0) ? product.colors[0] : "";

    const modal = document.getElementById("product-detail-modal");
    const imgEl = document.getElementById("detail-product-img");
    const catEl = document.getElementById("detail-category");
    const promoBadge = document.getElementById("detail-promo-badge");
    const titleEl = document.getElementById("detail-title");
    const descEl = document.getElementById("detail-desc");
    const priceEl = document.getElementById("detail-price");
    const qtyValEl = document.getElementById("modal-qty-val");
    const noteInput = document.getElementById("modal-product-note");
    const addBtn = document.getElementById("modal-add-to-cart-btn");

    const sizesGroup = document.getElementById("detail-sizes-group");
    const sizesRow = document.getElementById("detail-sizes-row");
    const colorsGroup = document.getElementById("detail-colors-group");
    const colorsRow = document.getElementById("detail-colors-row");

    const currency = product.currency || AppState.shopConfig.currency || "S/";

    // 1. Fotos y Carrusel Deslizable Swipe + Zoom
    const images = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : (product.img ? [product.img] : []);

    const carouselTrack = document.getElementById("detail-carousel-track");
    const photoCounter = document.getElementById("detail-photo-counter");
    const dotsRow = document.getElementById("detail-carousel-dots");
    const thumbsRow = document.getElementById("detail-thumbnails-row");

    if (carouselTrack) {
      if (images.length === 0) {
        const fallbackUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
        carouselTrack.innerHTML = `
          <div class="carousel-slide" data-index="0">
            <img id="detail-product-img" src="${fallbackUrl}" alt="${escapeHtml(product.name)}" class="carousel-slide-img" onclick="CustomerUI.openLightbox('${fallbackUrl}')">
          </div>
        `;
        if (photoCounter) photoCounter.classList.add("hidden");
        if (dotsRow) dotsRow.classList.add("hidden");
        if (thumbsRow) thumbsRow.classList.add("hidden");
        carouselTrack.onscroll = null;
      } else {
        carouselTrack.innerHTML = images.map((src, idx) => `
          <div class="carousel-slide" data-index="${idx}">
            <img ${idx === 0 ? 'id="detail-product-img"' : ''} src="${src}" alt="Foto ${idx + 1} de ${escapeHtml(product.name)}" class="carousel-slide-img" onclick="CustomerUI.openLightbox('${src}')">
          </div>
        `).join("");

        if (images.length > 1) {
          if (photoCounter) {
            photoCounter.textContent = `1 / ${images.length}`;
            photoCounter.classList.remove("hidden");
          }
          if (dotsRow) {
            dotsRow.classList.remove("hidden");
            dotsRow.innerHTML = images.map((_, idx) => `
              <span class="carousel-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>
            `).join("");
            dotsRow.querySelectorAll(".carousel-dot").forEach(dot => {
              dot.onclick = () => {
                const idx = Number(dot.dataset.idx);
                carouselTrack.scrollTo({ left: idx * carouselTrack.clientWidth, behavior: "smooth" });
              };
            });
          }
          if (thumbsRow) {
            thumbsRow.classList.remove("hidden");
            thumbsRow.innerHTML = images.map((src, idx) => `
              <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                <img src="${src}" alt="Miniatura ${idx + 1}">
              </div>
            `).join("");
            thumbsRow.querySelectorAll(".gallery-thumb").forEach(thumb => {
              thumb.onclick = () => {
                const idx = Number(thumb.dataset.idx);
                carouselTrack.scrollTo({ left: idx * carouselTrack.clientWidth, behavior: "smooth" });
              };
            });
          }

          // Escuchar scroll para sincronizar contador, puntos y miniaturas
          carouselTrack.onscroll = () => {
            const width = carouselTrack.clientWidth || 1;
            const currentIdx = Math.min(images.length - 1, Math.max(0, Math.round(carouselTrack.scrollLeft / width)));
            if (photoCounter) photoCounter.textContent = `${currentIdx + 1} / ${images.length}`;
            if (dotsRow) {
              dotsRow.querySelectorAll(".carousel-dot").forEach((d, i) => {
                d.classList.toggle("active", i === currentIdx);
              });
            }
            if (thumbsRow) {
              thumbsRow.querySelectorAll(".gallery-thumb").forEach((t, i) => {
                t.classList.toggle("active", i === currentIdx);
              });
            }
          };
        } else {
          // Solo 1 imagen
          if (photoCounter) photoCounter.classList.add("hidden");
          if (dotsRow) dotsRow.classList.add("hidden");
          if (thumbsRow) thumbsRow.classList.add("hidden");
          carouselTrack.onscroll = null;
        }
      }
    }

    // 2. Badges de Marketplace (Condición, Ubicación, Tipo)
    const isDigitalProd = product.listingType === "digital" || AppState.activePreset === "tech" || AppState.activePreset === "digital" || /licencia|adobe|autodesk|office|antivirus|windows|microsoft|canva|capcut|spotify|netflix|vpn/i.test((product.name || "") + " " + (product.sku || ""));
    const isVehicleProd = product.listingType === "vehicle" || product.listingType === "property";

    const condBadge = document.getElementById("detail-condition-badge");
    const locBadge = document.getElementById("detail-location-badge");
    const listBadge = document.getElementById("detail-listing-badge");
    if (condBadge) {
      if (product.condition) {
        condBadge.textContent = product.condition;
        condBadge.classList.remove("hidden");
      } else {
        condBadge.classList.add("hidden");
      }
    }
    if (locBadge) {
      if (product.location) {
        locBadge.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px; vertical-align: -1px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${escapeHtml(product.location)}`;
        locBadge.classList.remove("hidden");
      } else {
        locBadge.classList.add("hidden");
      }
    }
    if (listBadge) {
      const typeLabels = { vehicle: "Vehículo", digital: "Digital / Licencia", property: "Inmueble", item: "Artículo" };
      listBadge.textContent = isDigitalProd ? "Digital / Licencia" : (typeLabels[product.listingType] || "Artículo");
      listBadge.classList.remove("hidden");
    }

    if (catEl) catEl.textContent = product.category || (isDigitalProd ? "Licencias & Software" : "General");
    if (promoBadge) {
      if (product.promo) promoBadge.classList.remove("hidden");
      else promoBadge.classList.add("hidden");
    }
    if (titleEl) {
      titleEl.innerHTML = `${escapeHtml(product.name)} ${product.sku ? `<small style="font-size:0.75rem; color:var(--accent-gold); display:block;">REF: ${escapeHtml(product.sku)}</small>` : ''}`;
    }

    const cleanDesc = (product.desc || "").trim();
    if (descEl) {
      if (!cleanDesc || cleanDesc.toLowerCase().includes("registro inicial")) {
        descEl.textContent = "";
        descEl.classList.add("hidden");
      } else {
        descEl.textContent = cleanDesc;
        descEl.classList.remove("hidden");
      }
    }
    if (qtyValEl) qtyValEl.textContent = AppState.modalQuantity;

    const noteLabel = document.getElementById("modal-product-note-label");
    if (noteInput) {
      noteInput.value = "";
      if (isDigitalProd) {
        if (noteLabel) noteLabel.textContent = "Correo o WhatsApp para entrega de activación (opcional):";
        noteInput.placeholder = "ej: tu-correo@gmail.com para enviarte la clave de activación";
      } else if (isVehicleProd) {
        if (noteLabel) noteLabel.textContent = "Consulta o disponibilidad para ver el vehículo (opcional):";
        noteInput.placeholder = "ej: disponible el sábado por la tarde";
      } else if (AppState.activePreset === "food") {
        if (noteLabel) noteLabel.textContent = "Indicaciones de preparación (opcional):";
        noteInput.placeholder = "ej: salsas aparte, sin cebolla...";
      } else {
        if (noteLabel) noteLabel.textContent = "Indicaciones de entrega (opcional):";
        noteInput.placeholder = "ej: timbre 202, dejar en recepción...";
      }
    }

    // 3. Ficha Técnica / Especificaciones Dinámicas
    const specsContainer = document.getElementById("detail-specs-container");
    const specsGrid = document.getElementById("detail-specs-grid");
    if (specsContainer && specsGrid) {
      if (Array.isArray(product.specs) && product.specs.length > 0) {
        specsContainer.classList.remove("hidden");
        specsGrid.innerHTML = product.specs.map(sp => `
          <div class="spec-item">
            <span class="spec-label">${escapeHtml(sp.label)}</span>
            <span class="spec-val">${escapeHtml(sp.value)}</span>
          </div>
        `).join("");
      } else {
        specsContainer.classList.add("hidden");
      }
    }

    // Adaptar etiquetas dinámicas de variantes según rubro
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const sizesLabelEl = document.getElementById("detail-sizes-label");
    const colorsLabelEl = document.getElementById("detail-colors-label");
    if (sizesLabelEl && nicheInfo.variantLabels?.size) {
      sizesLabelEl.textContent = `Elige tu ${nicheInfo.variantLabels.size}:`;
    }
    if (colorsLabelEl && nicheInfo.variantLabels?.color) {
      colorsLabelEl.textContent = `Elige tu ${nicheInfo.variantLabels.color}:`;
    }

    // Configurar Conmutador Foto / Video
    const switcher = document.getElementById("detail-media-switcher");
    const photoBtn = document.getElementById("detail-switch-photo-btn");
    const videoBtn = document.getElementById("detail-switch-video-btn");
    const photoWrap = document.getElementById("detail-photo-wrap");
    const videoWrap = document.getElementById("detail-video-wrap");

    CustomerUI.resetModalVideo();

    if (product.videoUrl) {
      if (switcher) switcher.classList.remove("hidden");
      if (photoBtn) photoBtn.classList.add("active");
      if (videoBtn) videoBtn.classList.remove("active");
      if (photoWrap) photoWrap.classList.remove("hidden");
      if (videoWrap) videoWrap.classList.add("hidden");

      if (photoBtn) {
        photoBtn.onclick = () => {
          photoBtn.classList.add("active");
          if (videoBtn) videoBtn.classList.remove("active");
          if (photoWrap) photoWrap.classList.remove("hidden");
          if (videoWrap) videoWrap.classList.add("hidden");
          CustomerUI.resetModalVideo();
        };
      }

      if (videoBtn) {
        videoBtn.onclick = () => {
          videoBtn.classList.add("active");
          if (photoBtn) photoBtn.classList.remove("active");
          if (photoWrap) photoWrap.classList.add("hidden");
          if (videoWrap) videoWrap.classList.remove("hidden");
          CustomerUI.renderModalVideo(product.videoUrl);
        };
      }
    } else {
      if (switcher) switcher.classList.add("hidden");
      if (photoWrap) photoWrap.classList.remove("hidden");
      if (videoWrap) videoWrap.classList.add("hidden");
    }

    // Selector de tallas
    if (product.sizes && product.sizes.length > 0 && sizesGroup && sizesRow) {
      sizesGroup.classList.remove("hidden");
      sizesRow.innerHTML = product.sizes.map((s, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" data-size="${escapeHtml(s)}">
          ${escapeHtml(s)}
        </button>
      `).join("");

      sizesRow.querySelectorAll(".variant-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          sizesRow.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          AppState.modalSelectedSize = chip.getAttribute("data-size");
          CustomerUI.updateModalPrice();
        });
      });
    } else if (sizesGroup) {
      sizesGroup.classList.add("hidden");
    }

    // Selector de colores
    if (product.colors && product.colors.length > 0 && colorsGroup && colorsRow) {
      colorsGroup.classList.remove("hidden");
      colorsRow.innerHTML = product.colors.map((c, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" data-color="${escapeHtml(c)}">
          ${escapeHtml(c)}
        </button>
      `).join("");

      colorsRow.querySelectorAll(".variant-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          colorsRow.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          AppState.modalSelectedColor = chip.getAttribute("data-color");
          CustomerUI.updateModalPrice();
        });
      });
    } else if (colorsGroup) {
      colorsGroup.classList.add("hidden");
    }

    // 4. Smart CTAs: Vehículos / Inmuebles vs Carrito Estándar
    const isVehicleOrProperty = product.listingType === "vehicle" || product.listingType === "property";
    const vehicleInquiryBox = document.getElementById("vehicle-inquiry-box");
    const detailModalFooter = document.getElementById("detail-modal-footer");
    const standardCartActions = document.getElementById("standard-cart-actions");

    if (isVehicleOrProperty) {
      if (vehicleInquiryBox) vehicleInquiryBox.classList.remove("hidden");
      if (detailModalFooter) detailModalFooter.classList.add("hidden");
      if (standardCartActions) standardCartActions.classList.add("hidden");

      let currentInquiry = "¿Sigue disponible?";
      const pillsContainer = document.getElementById("quick-inquiry-pills");
      if (pillsContainer) {
        pillsContainer.querySelectorAll(".inquiry-pill, .inquiry-pill-btn").forEach(pill => {
          pill.onclick = () => {
            pillsContainer.querySelectorAll(".inquiry-pill, .inquiry-pill-btn").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            currentInquiry = pill.textContent.trim();
          };
        });
      }

      const inquiryBtn = document.getElementById("vehicle-whatsapp-btn");
      if (inquiryBtn) {
        inquiryBtn.onclick = () => {
          const rawPhone = (AppState.shopConfig.phone || "").replace(/[^0-9]/g, "");
          const cleanPhone = rawPhone.startsWith("51") ? rawPhone : `51${rawPhone}`;
          const cleanStoreUrl = QRGenerator.getCleanDisplayUrl();
          const prodUrl = `${cleanStoreUrl}?p=${encodeURIComponent(product.id)}`;
          const prodCurrency = product.currency || AppState.shopConfig.currency || "US$";
          const formattedPrice = Number(product.price).toLocaleString('es-PE', {minimumFractionDigits: 2});
          
          const itemLabel = product.listingType === "vehicle" ? "Vehículo" : (product.listingType === "property" ? "Inmueble" : "Producto");
          let msg = `Hola *${AppState.shopConfig.name}*, vi tu publicación en TiendaZap:\n\n`;
          msg += `• *${itemLabel}:* ${product.name}\n`;
          if (product.condition) msg += `• *Condición:* ${product.condition}\n`;
          if (product.location) msg += `• *Ubicación:* ${product.location}\n`;
          msg += `• *Precio:* ${prodCurrency} ${formattedPrice}\n`;
          msg += `• *Ver ficha:* ${prodUrl}\n\n`;
          msg += `${currentInquiry}`;

          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
        };
      }
    } else {
      if (vehicleInquiryBox) vehicleInquiryBox.classList.add("hidden");
      if (detailModalFooter) detailModalFooter.classList.remove("hidden");
      if (standardCartActions) standardCartActions.classList.remove("hidden");

      if (addBtn) {
        if (product.available === false) {
          addBtn.disabled = true;
          addBtn.classList.add("btn-disabled");
          addBtn.innerHTML = `<span>Producto Agotado</span>`;
        } else {
          addBtn.disabled = false;
          addBtn.classList.remove("btn-disabled");
          addBtn.innerHTML = `<span>Agregar al Pedido • <span id="modal-button-total"></span></span>`;
        }
      }
    }

    CustomerUI.updateModalPrice();
    if (modal) modal.classList.remove("hidden");
  },

  updateModalPrice() {
    if (!AppState.selectedProductModal) return;
    const product = AppState.selectedProductModal;
    const currency = product.currency || AppState.shopConfig.currency || "S/";
    const unitPrice = CartController.getUnitPrice(product, AppState.modalSelectedSize, AppState.modalSelectedColor);
    const total = unitPrice * AppState.modalQuantity;

    const priceEl = document.getElementById("detail-price");
    const btnTotalEl = document.getElementById("modal-button-total");
    if (priceEl) priceEl.textContent = `${currency} ${unitPrice.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (btnTotalEl) btnTotalEl.textContent = `${currency} ${total.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  },

  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.add("hidden");
    CustomerUI.resetModalVideo();
    AppState.selectedProductModal = null;
  },

  resetModalVideo() {
    const videoEl = document.getElementById("detail-product-video");
    const embedEl = document.getElementById("detail-video-embed");
    const actionEl = document.getElementById("detail-video-action");
    if (videoEl) {
      videoEl.pause();
      videoEl.src = "";
      videoEl.classList.add("hidden");
    }
    if (embedEl) {
      embedEl.innerHTML = "";
      embedEl.classList.add("hidden");
    }
    if (actionEl) actionEl.classList.add("hidden");
  },

  async renderModalVideo(url) {
    this.resetModalVideo();
    if (!url) return;
    const resolvedUrl = await MediaStore.resolveVideoUrl(url);
    if (!resolvedUrl) return;

    const videoEl = document.getElementById("detail-product-video");
    const embedEl = document.getElementById("detail-video-embed");
    const actionEl = document.getElementById("detail-video-action");
    const extBtn = document.getElementById("detail-video-ext-btn");

    const cleanUrl = resolvedUrl.trim();

    // YouTube Shorts o YouTube normal
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const id = ytMatch[1];
      if (embedEl) {
        embedEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        embedEl.classList.remove("hidden");
      }
      return;
    }

    // TikTok o Instagram Reels
    if (cleanUrl.includes("tiktok.com") || cleanUrl.includes("instagram.com")) {
      if (actionEl && extBtn) {
        extBtn.href = cleanUrl;
        extBtn.textContent = cleanUrl.includes("tiktok") ? "▶️ Ver Video en TikTok" : "▶️ Ver Video en Instagram Reels";
        actionEl.classList.remove("hidden");
      }
      return;
    }

    // Video directo (.mp4, .webm, blob:, data:)
    if (videoEl) {
      videoEl.src = cleanUrl;
      videoEl.classList.remove("hidden");
      videoEl.play().catch(() => {});
    }
  },

  openLightbox(src) {
    const modal = document.getElementById("media-lightbox-modal");
    const img = document.getElementById("lightbox-img");
    if (!modal || !img || !src) return;
    img.src = src;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  closeLightbox() {
    const modal = document.getElementById("media-lightbox-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    const prodModal = document.getElementById("product-detail-modal");
    if (!prodModal || prodModal.classList.contains("hidden")) {
      document.body.style.overflow = "";
    }
  },

  updateCartBar() {
    const bar = document.getElementById("floating-cart-bar");
    const countEl = document.getElementById("cart-items-count");
    const subtextEl = document.getElementById("cart-bar-subtext");
    const totalEl = document.getElementById("cart-bar-total");

    const totalCount = CartController.getTotalItemsCount();
    const currency = AppState.shopConfig.currency || "S/";
    const total = CartController.getSubtotal();

    if (totalCount > 0) {
      if (bar) bar.classList.remove("hidden");
      if (countEl) countEl.textContent = totalCount;
      if (subtextEl) subtextEl.textContent = `${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}`;
      if (totalEl) totalEl.textContent = `${currency} ${total.toFixed(2)}`;
    } else {
      if (bar) bar.classList.add("hidden");
    }
  },

  renderCartItemsList() {
    const list = document.getElementById("cart-items-list");
    const subtotalEl = document.getElementById("summary-subtotal");
    const deliveryEl = document.getElementById("summary-delivery");
    const deliveryLine = document.getElementById("summary-delivery-line");
    const totalEl = document.getElementById("summary-total");
    const deliveryPriceLabel = document.getElementById("delivery-price-label");

    if (!list) return;

    const items = CartController.getCartItems();
    const currency = AppState.shopConfig.currency || "S/";

    if (deliveryPriceLabel) {
      deliveryPriceLabel.textContent = `+ ${currency} ${Number(AppState.shopConfig.deliveryCost || 0).toFixed(2)}`;
    }

    if (items.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; color: var(--text-muted);">
          <span style="font-size: 2rem; display: block; margin-bottom: 8px;">🛒</span>
          <p>Tu carrito está vacío.</p>
        </div>
      `;
    } else {
      list.innerHTML = items.map(item => {
        let variantBadge = [];
        if (item.selectedSize) variantBadge.push(`Talla: ${escapeHtml(item.selectedSize)}`);
        if (item.selectedColor) variantBadge.push(`Color: ${escapeHtml(item.selectedColor)}`);
        const unitPrice = CartController.getUnitPrice(item.product, item.selectedSize, item.selectedColor);
        const itemSubtotal = (unitPrice * item.quantity).toFixed(2);

        return `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${escapeHtml(item.product.name)}</h4>
              ${variantBadge.length > 0 ? `<div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 600;">${variantBadge.join(" • ")}</div>` : ""}
              <span class="cart-item-subtotal">${currency} ${itemSubtotal}</span>
              ${item.note ? `<div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">Nota: ${escapeHtml(item.note)}</div>` : ""}
            </div>

            <div class="cart-item-actions">
              <div class="card-qty-stepper">
                <button class="stepper-btn minus cart-btn-minus" data-cart-key="${escapeHtml(item.cartKey)}" type="button">-</button>
                <span class="stepper-num">${item.quantity}</span>
                <button class="stepper-btn plus cart-btn-plus" data-cart-key="${escapeHtml(item.cartKey)}" type="button">+</button>
              </div>
            </div>
          </div>
        `;
      }).join("");

      list.querySelectorAll(".cart-btn-minus").forEach(btn => {
        btn.addEventListener("click", () => CartController.decreaseQuantity(btn.dataset.cartKey));
      });
      list.querySelectorAll(".cart-btn-plus").forEach(btn => {
        btn.addEventListener("click", () => CartController.increaseQuantity(btn.dataset.cartKey));
      });
    }

    const subtotal = CartController.getSubtotal();
    const deliveryCost = CartController.getDeliveryCost();
    const grandTotal = CartController.getGrandTotal();

    if (subtotalEl) subtotalEl.textContent = `${currency} ${subtotal.toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = `${currency} ${deliveryCost.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${currency} ${grandTotal.toFixed(2)}`;

    if (deliveryLine) {
      deliveryLine.style.display = AppState.deliveryMode === "delivery" ? "flex" : "none";
    }

    this.renderYapeCheckoutBox();
  },

  updateCartTotals() {
    this.renderCartItemsList();
  },

  openCartModal() {
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const optionDigitalLabel = document.getElementById("option-digital-label");
    const optionDineinLabel = document.getElementById("option-dinein-label");
    const optionDeliveryLabel = document.getElementById("option-delivery-label");
    const optionPickupLabel = document.getElementById("option-pickup-label");
    const modeDigital = document.getElementById("mode-digital");
    const modeDelivery = document.getElementById("mode-delivery");
    const modePickup = document.getElementById("mode-pickup");
    const modeDinein = document.getElementById("mode-dinein");
    const tableGroup = document.getElementById("table-field-group");
    const addressGroup = document.getElementById("address-field-group");
    const addressLabel = document.querySelector('label[for="client-address"]');
    const addressInput = document.getElementById("client-address");
    const gpsBtn = document.getElementById("get-gps-location-btn");
    const clientTable = document.getElementById("client-table");

    // 0. Si todos los ítems en el carrito son digitales, forzar entrega digital gratuita
    const isAllDigitalCart = CartController.isCartAllDigital();
    if (isAllDigitalCart) {
      AppState.deliveryMode = "digital";
      if (optionDigitalLabel) {
        optionDigitalLabel.classList.remove("hidden");
        optionDigitalLabel.classList.add("active");
      }
      if (optionDeliveryLabel) optionDeliveryLabel.classList.add("hidden");
      if (optionPickupLabel) optionPickupLabel.classList.add("hidden");
      if (optionDineinLabel) optionDineinLabel.classList.add("hidden");
      if (modeDigital) modeDigital.checked = true;
      if (tableGroup) tableGroup.classList.add("hidden");
      if (addressGroup) addressGroup.style.display = "flex";
      if (addressLabel) addressLabel.textContent = "WhatsApp o Correo para entrega digital *";
      if (addressInput) addressInput.placeholder = "Ej: tucorreo@gmail.com o 987654321";
      if (gpsBtn) gpsBtn.style.display = "none";
    } else // 1. Mostrar/ocultar opciones según rubro de WhatsApp Business
    if (nicheInfo.isDigitalFriendly) {
      if (optionDigitalLabel) optionDigitalLabel.classList.remove("hidden");
      if (optionDineinLabel) optionDineinLabel.classList.add("hidden");
      if (AppState.deliveryMode === "dinein" || AppState.deliveryMode === "delivery") {
        AppState.deliveryMode = "digital";
      }
    } else if (nicheInfo.hasDineIn) {
      if (optionDigitalLabel) optionDigitalLabel.classList.add("hidden");
      if (optionDineinLabel) optionDineinLabel.classList.remove("hidden");
      if (AppState.deliveryMode === "digital") {
        AppState.deliveryMode = "delivery";
      }
    } else {
      if (optionDigitalLabel) optionDigitalLabel.classList.add("hidden");
      if (optionDineinLabel) optionDineinLabel.classList.add("hidden");
      if (AppState.deliveryMode === "digital" || AppState.deliveryMode === "dinein") {
        AppState.deliveryMode = "delivery";
      }
    }

    // 2. Desmarcar clases activas previas
    [optionDigitalLabel, optionDeliveryLabel, optionPickupLabel, optionDineinLabel].forEach(lbl => {
      if (lbl) lbl.classList.remove("active");
    });

    // 3. Sincronizar estado y campos según AppState.deliveryMode
    if (AppState.deliveryMode === "digital") {
      if (modeDigital) modeDigital.checked = true;
      if (optionDigitalLabel) optionDigitalLabel.classList.add("active");
      if (tableGroup) tableGroup.classList.add("hidden");
      if (addressGroup) addressGroup.style.display = "flex";
      if (addressLabel) addressLabel.textContent = "WhatsApp o Correo para entrega digital *";
      if (addressInput) addressInput.placeholder = "Ej: tucorreo@gmail.com o 987654321";
      if (gpsBtn) gpsBtn.style.display = "none";
    } else if (AppState.deliveryMode === "dinein") {
      if (modeDinein) modeDinein.checked = true;
      if (optionDineinLabel) optionDineinLabel.classList.add("active");
      if (tableGroup) tableGroup.classList.remove("hidden");
      if (addressGroup) addressGroup.style.display = "none";
      if (clientTable && AppState.tableNumber) clientTable.value = AppState.tableNumber;
    } else if (AppState.deliveryMode === "pickup") {
      if (modePickup) modePickup.checked = true;
      if (optionPickupLabel) optionPickupLabel.classList.add("active");
      if (tableGroup) tableGroup.classList.add("hidden");
      if (addressGroup) addressGroup.style.display = "none";
    } else {
      // Domicilio físico
      if (modeDelivery) modeDelivery.checked = true;
      if (optionDeliveryLabel) optionDeliveryLabel.classList.add("active");
      if (tableGroup) tableGroup.classList.add("hidden");
      if (addressGroup) addressGroup.style.display = "flex";
      if (addressLabel) addressLabel.textContent = "Dirección y Referencia *";
      if (addressInput) addressInput.placeholder = "Ej: Av. Las Palmeras 450, Dpto 302...";
      if (gpsBtn) gpsBtn.style.display = "inline-flex";
    }

    this.renderCartItemsList();
    this.renderYapeCheckoutBox();
    this.updateCartTotals();

    const modal = document.getElementById("cart-modal-overlay");
    if (modal) modal.classList.remove("hidden");
  },

  closeCartModal() {
    const modal = document.getElementById("cart-modal-overlay");
    if (modal) modal.classList.add("hidden");
  }
};

// ============================================================================
// 9. CARRITO DE COMPRAS Y PEDIDOS
// ============================================================================
const CartController = {
  getVariantExtraPrice(sizeStr, colorStr) {
    let extra = 0;
    const regex = /\+\s*(?:S\/|\$|€|MXN\$|COP\$)?\s*(\d+(?:\.\d+)?)/i;
    if (sizeStr) {
      const m = String(sizeStr).match(regex);
      if (m && m[1]) extra += parseFloat(m[1]);
    }
    if (colorStr) {
      const m = String(colorStr).match(regex);
      if (m && m[1]) extra += parseFloat(m[1]);
    }
    return extra;
  },

  getUnitPrice(product, selectedSize, selectedColor) {
    return Number(product?.price || 0) + this.getVariantExtraPrice(selectedSize, selectedColor);
  },

  addToCart(productId, quantity = 1, note = "", selectedSize = "", selectedColor = "") {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;

    if (!product.available) {
      Toast.show("Este producto está agotado temporalmente", "❌");
      return;
    }

    const cartKey = `${productId}_${selectedSize || "nosize"}_${selectedColor || "nocolor"}`;

    if (!AppState.cart[cartKey]) {
      AppState.cart[cartKey] = {
        cartKey: cartKey,
        product: { ...product },
        quantity: quantity,
        note: note,
        selectedSize: selectedSize,
        selectedColor: selectedColor
      };
    } else {
      AppState.cart[cartKey].quantity += quantity;
      if (note) AppState.cart[cartKey].note = note;
    }

    if (AppState.cart[cartKey].quantity <= 0) {
      delete AppState.cart[cartKey];
    }

    AppState.saveCart();
    CustomerUI.updateCartBar();
    CustomerUI.renderProductCards();
    CustomerUI.renderCartItemsList();

    let variantInfo = "";
    if (selectedSize || selectedColor) {
      variantInfo = ` (${[selectedSize, selectedColor].filter(Boolean).join(" - ")})`;
    }
    Toast.show(`Agregado: ${product.name}${variantInfo}`, "🛍️");
  },

  increaseQuantity(cartKey) {
    if (!AppState.cart[cartKey]) return;
    AppState.cart[cartKey].quantity += 1;
    AppState.saveCart();
    CustomerUI.updateCartBar();
    CustomerUI.renderProductCards();
    CustomerUI.renderCartItemsList();
  },

  decreaseQuantity(cartKey) {
    if (!AppState.cart[cartKey]) return;
    AppState.cart[cartKey].quantity -= 1;
    if (AppState.cart[cartKey].quantity <= 0) {
      delete AppState.cart[cartKey];
    }
    AppState.saveCart();
    CustomerUI.updateCartBar();
    CustomerUI.renderProductCards();
    CustomerUI.renderCartItemsList();
  },

  getCartItems() {
    return Object.values(AppState.cart);
  },

  getTotalItemsCount() {
    return Object.values(AppState.cart).reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return Object.values(AppState.cart).reduce((sum, item) => {
      const unitPrice = this.getUnitPrice(item.product, item.selectedSize, item.selectedColor);
      return sum + (unitPrice * item.quantity);
    }, 0);
  },

  isCartAllDigital() {
    const items = this.getCartItems();
    if (items.length === 0) {
      return false;
    }
    return items.every(item => {
      const p = item.product;
      if (!p) return false;
      return p.listingType === "digital" || (!p.listingType && (AppState.activePreset === "tech" || AppState.activePreset === "digital"));
    });
  },

  getDeliveryCost() {
    if (this.isCartAllDigital() || AppState.deliveryMode === "digital" || AppState.deliveryMode === "pickup" || AppState.deliveryMode === "dinein") {
      return 0.0;
    }
    return AppState.deliveryMode === "delivery" ? Number(AppState.shopConfig.deliveryCost || 0) : 0;
  },

  getGrandTotal() {
    return this.getSubtotal() + this.getDeliveryCost();
  }
};

// ============================================================================
// 10. DEEP-LINK GENERATOR PARA WHATSAPP & TICKET DIGITAL
// ============================================================================
const WhatsAppOrder = {
  buildOrderMessage(clientData) {
    const shop = AppState.shopConfig;
    const items = CartController.getCartItems();
    const currency = shop.currency || "S/";
    const dateStr = new Date().toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short"
    });

    const cleanStoreUrl = QRGenerator.getCleanDisplayUrl();
    let msg = `*Catálogo Oficial de ${shop.name}*\n`;
    msg += `• *Enlace de tienda:* ${cleanStoreUrl}\n\n`;
    msg += `*NUEVO PEDIDO — ${shop.name.toUpperCase()}*\n`;
    msg += `• *Fecha:* ${dateStr}\n`;
    msg += `-------------------------------------\n\n`;

    msg += `*DATOS DEL CLIENTE:*\n`;
    msg += `• *Nombre:* ${clientData.name}\n`;
    msg += `• *Teléfono:* ${clientData.phone}\n`;

    if (clientData.deliveryMode === "digital") {
      msg += `• *Modalidad:* Envío Digital Inmediato (WhatsApp / Correo)\n`;
      msg += `• *Contacto Digital:* ${clientData.address || clientData.phone}\n`;
    } else if (clientData.deliveryMode === "delivery") {
      msg += `• *Modalidad:* Envío a Domicilio\n`;
      msg += `• *Dirección:* ${clientData.address}\n`;
      if (clientData.gpsCoords) {
        msg += `• *Ubicación GPS:* https://maps.google.com/?q=${clientData.gpsCoords}\n`;
      }
    } else if (clientData.deliveryMode === "dinein") {
      msg += `• *Modalidad:* Consumo en Mesa (${clientData.tableNumber || "Mesa Local"})\n`;
    } else {
      msg += `• *Modalidad:* Retiro en Local\n`;
    }

    if (clientData.notes && clientData.notes.trim()) {
      msg += `• *Notas:* ${clientData.notes.trim()}\n`;
    }

    msg += `\n*DETALLE DE PRODUCTOS:*\n`;
    items.forEach((item, idx) => {
      const unitPrice = CartController.getUnitPrice(item.product, item.selectedSize, item.selectedColor);
      const itemSub = (unitPrice * item.quantity).toFixed(2);
      const skuTag = item.product.sku ? `[${item.product.sku}] ` : "";
      
      let variantParts = [];
      if (item.selectedSize) variantParts.push(`Talla: ${item.selectedSize}`);
      if (item.selectedColor) variantParts.push(`Color: ${item.selectedColor}`);
      const variantText = variantParts.length > 0 ? ` (${variantParts.join(" | ")})` : "";

      msg += `${idx + 1}. *${item.quantity}x* ${skuTag}${item.product.name}${variantText} — ${currency} ${itemSub}\n`;
      if (item.note) {
        msg += `   └ Nota: ${item.note}\n`;
      }
    });

    msg += `\n-------------------------------------\n`;
    msg += `• *Subtotal:* ${currency} ${CartController.getSubtotal().toFixed(2)}\n`;

    if (clientData.deliveryMode === "delivery") {
      msg += `• *Envío:* ${currency} ${CartController.getDeliveryCost().toFixed(2)}\n`;
    } else if (clientData.deliveryMode === "digital") {
      msg += `• *Envío:* Gratis (Digital)\n`;
    }

    msg += `• *TOTAL A PAGAR: ${currency} ${CartController.getGrandTotal().toFixed(2)}*\n`;
    msg += `-------------------------------------\n`;

    // Sección de Método de Pago y Comprobante de Yape
    if (clientData.paymentMethod === "Yape / Plin") {
      msg += `• *Método de Pago:* Yape / Plin\n`;
      if (shop.yapePhone) msg += `• *Número de Yape:* ${shop.yapePhone}\n`;
      if (shop.yapeName) msg += `• *Titular:* ${shop.yapeName}\n`;
      if (AppState.buyerVoucherBase64) {
        msg += `• *Comprobante:* Adjuntado por el cliente (enviará la captura por este chat).\n`;
      } else {
        msg += `• *Comprobante:* Pendiente de adjuntar captura por este chat.\n`;
      }
    } else {
      msg += `• *Método de Pago:* ${clientData.paymentMethod}\n`;
      if (clientData.paymentMethod === "Efectivo" && clientData.cashChange) {
        msg += `• *Paga con:* ${currency} ${clientData.cashChange}\n`;
      }
    }

    msg += `\n_Generado vía TiendaZap Studio_`;
    return msg;
  },

  sendOrder() {
    const clientNameInput = document.getElementById("client-name");
    const clientPhoneInput = document.getElementById("client-phone");
    const clientAddressInput = document.getElementById("client-address");
    const clientTableInput = document.getElementById("client-table");
    const clientNotesInput = document.getElementById("client-notes");
    const cashAmountInput = document.getElementById("cash-amount-input");
    const gpsCoordsInput = document.getElementById("client-gps-coords");

    const name = clientNameInput ? clientNameInput.value.trim() : "";
    const phone = clientPhoneInput ? clientPhoneInput.value.trim() : "";
    const address = clientAddressInput ? clientAddressInput.value.trim() : "";
    const tableNumber = clientTableInput ? clientTableInput.value.trim() : AppState.tableNumber;
    const notes = clientNotesInput ? clientNotesInput.value.trim() : "";
    const cashChange = cashAmountInput ? cashAmountInput.value.trim() : "";
    const gpsCoords = gpsCoordsInput ? gpsCoordsInput.value.trim() : "";

    if (!name) {
      alert("Por favor ingresa tu Nombre y Apellido para completar la orden.");
      if (clientNameInput) clientNameInput.focus();
      return;
    }

    if (AppState.deliveryMode === "digital" && !address) {
      alert("Por favor ingresa tu WhatsApp o Correo para recibir tu producto digital.");
      if (clientAddressInput) clientAddressInput.focus();
      return;
    }

    if (AppState.deliveryMode === "delivery" && !address) {
      alert("Por favor ingresa tu Dirección y Referencia para el envío a domicilio.");
      if (clientAddressInput) clientAddressInput.focus();
      return;
    }

    if (AppState.deliveryMode === "dinein" && !tableNumber) {
      alert("Por favor indica el número o nombre de tu mesa.");
      if (clientTableInput) clientTableInput.focus();
      return;
    }

    if (CartController.getCartItems().length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de enviar el pedido.");
      return;
    }

    AppState.saveClientData(name, phone, address);

    const clientData = {
      name,
      phone: phone || "No especificado",
      address: address || "No aplica",
      tableNumber,
      notes,
      gpsCoords,
      deliveryMode: AppState.deliveryMode,
      paymentMethod: AppState.paymentMethod,
      cashChange
    };

    const orderText = this.buildOrderMessage(clientData);
    const shopPhone = (AppState.shopConfig.phone || "").replace(/[^0-9]/g, "");

    if (!shopPhone) {
      alert("El comercio aún no ha configurado su número de WhatsApp en la pestaña Ajustes.");
      return;
    }

    const waUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(orderText)}`;

    CustomerUI.closeCartModal();
    this.showTicketModal(orderText, waUrl);
    window.open(waUrl, "_blank");
  },

  showTicketModal(orderText, waUrl) {
    const modal = document.getElementById("ticket-modal");
    const previewEl = document.getElementById("ticket-text-preview");
    const retryBtn = document.getElementById("ticket-retry-wa-btn");
    const shareBtn = document.getElementById("ticket-share-voucher-btn");
    const voucherBox = document.getElementById("ticket-voucher-preview-box");
    const voucherImg = document.getElementById("ticket-voucher-preview-img");

    if (previewEl) previewEl.textContent = orderText;
    if (retryBtn) {
      retryBtn.onclick = () => {
        window.open(waUrl, "_blank");
      };
    }

    if (shareBtn) {
      if (navigator.canShare && AppState.buyerVoucherFile && navigator.canShare({ files: [AppState.buyerVoucherFile] })) {
        shareBtn.classList.remove("hidden");
        shareBtn.onclick = async () => {
          try {
            await navigator.share({
              files: [AppState.buyerVoucherFile],
              text: orderText
            });
          } catch (err) {
            if (err.name !== "AbortError") {
              console.warn("Error en navigator.share:", err);
              window.open(waUrl, "_blank");
            }
          }
        };
      } else {
        shareBtn.classList.add("hidden");
      }
    }

    // Mostrar miniatura del comprobante si fue cargado
    if (voucherBox && voucherImg) {
      if (AppState.buyerVoucherBase64) {
        voucherImg.src = AppState.buyerVoucherBase64;
        voucherBox.classList.remove("hidden");
      } else {
        voucherBox.classList.add("hidden");
      }
    }

    if (modal) modal.classList.remove("hidden");
  }
};

// ============================================================================
// 11. CÓDIGO QR FIJO INTELIGENTE (CANVAS 2D)
// ============================================================================
const QRGenerator = {
  isTableMode: false,

  renderStoreQR(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    if (typeof qrcode === "undefined") {
      ctx.fillStyle = "#ff453a";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚠️ Conéctate a internet para", size / 2, size / 2 - 12);
      ctx.fillText("generar el Código QR escaneable.", size / 2, size / 2 + 12);
      Toast.show("No se pudo cargar la librería QR. Requiere conexión a internet.", "⚠️");
      return;
    }

    let qr;
    const levels = ["M", "L"];
    for (const lvl of levels) {
      try {
        qr = qrcode(0, lvl);
        qr.addData(text);
        qr.make();
        break;
      } catch (e) {
        // reintentar con menor redundancia si la cadena es muy larga
      }
    }
    if (!qr) {
      try {
        qr = qrcode(0, "L");
        qr.addData(this.getCleanDisplayUrl());
        qr.make();
      } catch (err) {
        console.error("Error definitivo generando QR:", err);
        return;
      }
    }

    const modules = qr.getModuleCount();
    const padding = 16;
    const cellSize = (size - padding * 2) / modules;
    const offset = padding;

    ctx.fillStyle = "#0c1222";
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (qr.isDark(r, c)) {
          const x = offset + c * cellSize;
          const y = offset + r * cellSize;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, cellSize, cellSize, 1.2);
          } else {
            ctx.rect(x, y, cellSize, cellSize);
          }
          ctx.fill();
        }
      }
    }

    // Logo central verde (#00d26a) con ícono 🍽️ o ⚡
    // En nivel H (30% tolerancia), un recuadro central de ~18-20% de módulos se lee al 100%
    const logoModuleSpan = Math.max(5, Math.floor(modules * 0.18));
    const logoSize = cellSize * logoModuleSpan;
    const center = size / 2;

    // Borde blanco protector
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(center - logoSize / 2 - 3, center - logoSize / 2 - 3, logoSize + 6, logoSize + 6, 6);
    } else {
      ctx.rect(center - logoSize / 2 - 3, center - logoSize / 2 - 3, logoSize + 6, logoSize + 6);
    }
    ctx.fill();

    // Recuadro verde (#00d26a)
    ctx.fillStyle = "#00d26a";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(center - logoSize / 2, center - logoSize / 2, logoSize, logoSize, 5);
    } else {
      ctx.rect(center - logoSize / 2, center - logoSize / 2, logoSize, logoSize);
    }
    ctx.fill();

    // Ícono en el centro
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const isFoodOrTable = this.isTableMode || (nicheInfo && nicheInfo.hasDineIn);
    ctx.fillStyle = "#080c14";
    ctx.font = `bold ${Math.round(logoSize * 0.55)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isFoodOrTable ? "🍽️" : "⚡", center, center);
  },

  getCleanDisplayUrl(catalogSlug = "") {
    const slug = AppState.getStoreSlug();
    const hostname = window.location.hostname;
    const isPagesDev = hostname.endsWith("pages.dev") || hostname.includes("localhost") || hostname === "127.0.0.1";
    const path = window.location.pathname;
    const isRoot = isPagesDev && (path === "/" || path === "/index.html" || !path.includes("/micro-catalogo-whatsapp"));

    let cleanBase = "";
    if (isRoot) {
      cleanBase = `${window.location.origin}/${encodeURIComponent(slug)}`;
    } else {
      const baseUrl = window.location.origin + window.location.pathname;
      cleanBase = baseUrl.replace(/\/index\.html$/i, "").replace(/\/+$/, "") + `?tienda=${encodeURIComponent(slug)}&mode=shop`;
    }

    if (catalogSlug && catalogSlug !== "all") {
      const sep = cleanBase.includes("?") ? "&" : "?";
      return `${cleanBase}${sep}cat=${encodeURIComponent(catalogSlug)}`;
    }
    return cleanBase;
  },

  buildPayload(forQR = false) {
    const slug = AppState.getStoreSlug();
    const filterImg = (imgUrl) => {
      if (!imgUrl) return "";
      if (imgUrl.startsWith("blob:") || imgUrl.startsWith("idb://")) return "";
      if (forQR && imgUrl.startsWith("data:image/")) return "";
      return imgUrl;
    };

    return {
      cfg: {
        n: AppState.shopConfig.name,
        s: slug,
        t: AppState.shopConfig.tagline,
        p: AppState.shopConfig.phone,
        c: AppState.shopConfig.currency,
        dc: AppState.shopConfig.deliveryCost,
        dt: AppState.shopConfig.deliveryTime,
        io: AppState.shopConfig.isOpen,
        l: filterImg(AppState.shopConfig.logoUrl),
        b: filterImg(AppState.shopConfig.bannerUrl),
        yp: AppState.shopConfig.yapePhone,
        yn: AppState.shopConfig.yapeName,
        yq: filterImg(AppState.shopConfig.yapeQrUrl),
        ye: AppState.shopConfig.yapeEnabled,
        np: AppState.activePreset,
        tm: AppState.shopConfig.themeMode || "light",
        ac: AppState.shopConfig.accentColor || "#3b82f6",
        tp: AppState.shopConfig.themePreset || "minimal-light",
        soc: AppState.shopConfig.socials || {},
        em: AppState.shopConfig.email || "",
        addr: AppState.shopConfig.address || "",
        hrs: AppState.shopConfig.hours || ""
      },
      cats: AppState.categories,
      catalogs: AppState.catalogs,
      prods: AppState.products
        .filter(p => p.available !== false)
        .map(p => {
          const rawImgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.img ? [p.img] : []);
          const filteredImgs = rawImgs.map(filterImg).filter(Boolean);
          return {
            id: p.id,
            sku: p.sku || "",
            n: p.name,
            cat: (p.category && p.category !== "undefined") ? p.category.trim() : "General",
            catalogId: p.catalogId || "cat_main",
            pr: p.price,
            cur: p.currency || AppState.shopConfig.currency || "S/",
            lt: p.listingType || "item",
            con: p.condition || "",
            loc: p.location || "",
            d: p.desc || "",
            img: filteredImgs[0] || filterImg(p.img),
            imgs: filteredImgs,
            sp: Array.isArray(p.specs) ? p.specs : [],
            vid: p.videoUrl && !p.videoUrl.startsWith("blob:") && !p.videoUrl.startsWith("idb://") ? p.videoUrl : "",
            sz: p.sizes || [],
            co: p.colors || [],
            pro: !!p.promo
          };
        })
    };
  },

  getTargetUrl(forQR = false, portable = false, catalogSlug = "") {
    const activeSlug = catalogSlug !== "" ? catalogSlug : (AppState.activeStudioCatalogId && AppState.activeStudioCatalogId !== "all" ? (AppState.catalogs.find(c => c.id === AppState.activeStudioCatalogId)?.slug || "") : "");
    const cleanStoreBase = this.getCleanDisplayUrl(activeSlug);

    if (this.isTableMode) {
      const tableVal = document.getElementById("qr-table-number")?.value.trim() || "Mesa 1";
      const separator = cleanStoreBase.includes("?") ? "&" : "?";
      return `${cleanStoreBase}${separator}mesa=${encodeURIComponent(tableVal)}`;
    }
    if (AppState.shopConfig.googleSheetUrl) {
      const separator = cleanStoreBase.includes("?") ? "&" : "?";
      return `${cleanStoreBase}${separator}sheet=${encodeURIComponent(AppState.shopConfig.googleSheetUrl)}`;
    }
    if (portable && typeof LZString !== "undefined") {
      try {
        const payload = this.buildPayload(forQR);
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
        return `${cleanStoreBase}#d=${compressed}`;
      } catch (err) {
        console.warn("Error comprimiendo catalogo para URL:", err);
      }
    }
    return cleanStoreBase;
  },

  getPortableUrl() {
    return this.getTargetUrl(false, true);
  },

  openQRModal() {
    const modal = document.getElementById("qr-modal");
    const canvas = document.getElementById("qr-canvas");
    const titleEl = document.getElementById("qr-store-title");
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const qrPillTable = document.getElementById("qr-pill-table");
    const qrPillGeneral = document.getElementById("qr-pill-general");
    const qrTableInputRow = document.getElementById("qr-table-input-row");
    const qrCatRow = document.getElementById("qr-catalog-select-row");
    const qrCatSelect = document.getElementById("qr-catalog-select");

    if (qrPillTable) {
      if (nicheInfo.hasDineIn) {
        qrPillTable.style.display = "inline-flex";
      } else {
        qrPillTable.style.display = "none";
        this.isTableMode = false;
        if (qrPillGeneral) qrPillGeneral.classList.add("active");
        if (qrTableInputRow) qrTableInputRow.classList.add("hidden");
      }
    }

    if (qrCatRow && qrCatSelect) {
      if (AppState.catalogs && AppState.catalogs.length > 1) {
        qrCatRow.classList.remove("hidden");
        let opts = `<option value="">Toda la tienda (Catálogo Completo)</option>`;
        AppState.catalogs.forEach(c => {
          opts += `<option value="${escapeHtml(c.slug)}">${escapeHtml(c.name)}${c.isDefault ? " (Principal)" : ""}</option>`;
        });
        qrCatSelect.innerHTML = opts;
        if (AppState.activeStudioCatalogId && AppState.activeStudioCatalogId !== "all") {
          const act = AppState.catalogs.find(c => c.id === AppState.activeStudioCatalogId);
          if (act) qrCatSelect.value = act.slug;
        } else {
          qrCatSelect.value = "";
        }
      } else {
        qrCatRow.classList.add("hidden");
      }
    }

    if (titleEl) titleEl.textContent = AppState.shopConfig.name;
    const initialSlug = (qrCatSelect && !qrCatRow?.classList.contains("hidden")) ? qrCatSelect.value : "";
    this.renderStoreQR(canvas, this.getTargetUrl(true, false, initialSlug));

    if (modal) modal.classList.remove("hidden");
  },

  closeQRModal() {
    const modal = document.getElementById("qr-modal");
    if (modal) modal.classList.add("hidden");
  },

  downloadQR() {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    const qrCatSelect = document.getElementById("qr-catalog-select");
    const catSuffix = (qrCatSelect && qrCatSelect.value) ? `-${qrCatSelect.value}` : "";
    const suffix = this.isTableMode ? (document.getElementById("qr-table-number")?.value.trim() || "Mesa") : `General${catSuffix}`;
    link.download = `QR-TiendaZap-${AppState.shopConfig.name.replace(/\s+/g, "_")}-${suffix}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    Toast.show("Código QR descargado", "⬇️");
  }
};

// ============================================================================
// 12. TOAST NOTIFICACIONES FLOTANTES
// ============================================================================
const Toast = {
  timeoutId: null,
  show(message, icon = "") {
    const toast = document.getElementById("app-toast");
    const msgEl = document.getElementById("toast-message");
    const iconEl = document.getElementById("toast-icon");

    if (!toast) return;

    if (msgEl) msgEl.textContent = message;
    if (iconEl) {
      if (icon) {
        iconEl.textContent = icon;
        iconEl.classList.remove("hidden");
      } else {
        iconEl.textContent = "";
        iconEl.classList.add("hidden");
      }
    }

    toast.classList.remove("hidden");

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2400);
  }
};

// ============================================================================
// 12.5 EXPORTACIÓN GLOBAL INMEDIATA
// ============================================================================
window.AppState = AppState;
window.ViewController = ViewController;
window.StudioController = StudioController;
window.CustomerUI = CustomerUI;
window.CartController = CartController;
window.OnboardingWizard = OnboardingWizard;
window.QRGenerator = QRGenerator;
window.ImageOptimizer = ImageOptimizer;
window.Toast = Toast;

// ============================================================================
// 13. REGISTRO DE EVENTOS & ARRANQUE
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  try {
    AppTheme.init();
    AppState.init();
    OnboardingWizard.init();
  } catch (err) {
    console.error("Error en AppState.init:", err);
  }

  // Conmutador Rápido de Tema Claro / Oscuro del Studio
  const appThemeToggleBtn = document.getElementById("app-theme-toggle-btn");
  if (appThemeToggleBtn) {
    appThemeToggleBtn.addEventListener("click", () => AppTheme.toggle());
  }

  // 1. Switch de Vista Previa vs Studio
  const openPreviewBtn = document.getElementById("open-preview-btn");
  const studioPreviewBtn = document.getElementById("studio-preview-btn");
  const closePreviewBtn = document.getElementById("close-preview-btn");

  const handleOpenPreview = () => {
    AppState.saveCurrentStoreState();
    ViewController.showCustomerPreview();
  };

  if (openPreviewBtn) openPreviewBtn.addEventListener("click", handleOpenPreview);
  if (studioPreviewBtn) studioPreviewBtn.addEventListener("click", handleOpenPreview);
  if (closePreviewBtn) closePreviewBtn.addEventListener("click", () => ViewController.showStudio());

  // 2. Switch Rápido de Tienda Abierta / Cerrada en el Topbar
  const toggleStoreBtn = document.getElementById("toggle-store-status-btn");
  if (toggleStoreBtn) toggleStoreBtn.addEventListener("click", () => StudioController.toggleStoreStatus());

  // 3. Portada Interactiva (Cambiar Portada con 1 Clic)
  const changeBannerBtn = document.getElementById("change-banner-btn");
  const bannerFileInput = document.getElementById("banner-file-input");

  if (changeBannerBtn && bannerFileInput) {
    changeBannerBtn.addEventListener("click", () => bannerFileInput.click());
    bannerFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) StudioController.handleBannerUpload(file);
    });
  }

  // 4. Logo Interactivo (Cambiar Avatar con 1 Clic)
  const changeLogoBtn = document.getElementById("change-logo-btn");
  const avatarEditContainer = document.getElementById("avatar-edit-container");
  const logoFileInput = document.getElementById("logo-file-input");

  if (logoFileInput) {
    if (changeLogoBtn) changeLogoBtn.addEventListener("click", () => logoFileInput.click());
    if (avatarEditContainer) {
      avatarEditContainer.addEventListener("click", (e) => {
        if (e.target !== changeLogoBtn && !changeLogoBtn.contains(e.target)) {
          logoFileInput.click();
        }
      });
    }
    logoFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) StudioController.handleLogoUpload(file);
    });
  }

  // 5. Edición En Vivo de Nombre y Eslogan en el Studio
  const liveStoreName = document.getElementById("live-store-name");
  const liveStoreTagline = document.getElementById("live-store-tagline");

  if (liveStoreName) {
    liveStoreName.addEventListener("input", (e) => {
      AppState.shopConfig.name = e.target.value.trim() || "Mi Tienda";
      AppState.saveConfig();
      AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
    });
  }

  if (liveStoreTagline) {
    liveStoreTagline.addEventListener("input", (e) => {
      AppState.shopConfig.tagline = e.target.value.trim();
      AppState.saveConfig();
      AppState.applyStoreTheme();
      CustomerUI.renderStoreHeader();
    });
  }

  // 5.1 Edición En Vivo de Datos Comerciales estilo WhatsApp Business
  const liveStoreEmail = document.getElementById("live-store-email");
  const liveStoreAddress = document.getElementById("live-store-address");
  const liveStoreHours = document.getElementById("live-store-hours");

  if (liveStoreEmail) {
    liveStoreEmail.addEventListener("input", (e) => {
      AppState.shopConfig.email = e.target.value.trim();
      AppState.saveConfig();
      CustomerUI.renderStoreHeader();
    });
  }

  if (liveStoreAddress) {
    liveStoreAddress.addEventListener("input", (e) => {
      AppState.shopConfig.address = e.target.value.trim();
      AppState.saveConfig();
      CustomerUI.renderStoreHeader();
    });
  }

  if (liveStoreHours) {
    liveStoreHours.addEventListener("input", (e) => {
      AppState.shopConfig.hours = e.target.value.trim();
      AppState.saveConfig();
      CustomerUI.renderStoreHeader();
    });
  }

  // 6. Barra de Acciones Rápidas del Studio (Copiar Enlace / Ver QR / Compartir)
  const studioCopyLinkBtn = document.getElementById("studio-copy-link-btn");
  const studioOpenQrBtn = document.getElementById("studio-open-qr-btn");
  const studioShareBtn = document.getElementById("studio-share-btn");

  const copyStoreLinkAction = () => {
    AppState.saveCurrentStoreState();
    const url = QRGenerator.getTargetUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        Toast.show("Enlace oficial de tu tienda copiado", "📋");
      }).catch(() => {
        prompt("Enlace seguro de tu tienda:", url);
      });
    } else {
      prompt("Enlace seguro de tu tienda:", url);
    }
  };

  if (studioCopyLinkBtn) studioCopyLinkBtn.addEventListener("click", copyStoreLinkAction);
  if (studioOpenQrBtn) studioOpenQrBtn.addEventListener("click", () => QRGenerator.openQRModal());
  if (studioShareBtn) {
    studioShareBtn.addEventListener("click", () => {
      const url = QRGenerator.getTargetUrl();
      const shareText = `🛍️ *Catálogo Oficial de ${AppState.shopConfig.name}*\n🔒 Enlace seguro: ${url}`;
      if (navigator.share) {
        navigator.share({
          title: `Catálogo Oficial de ${AppState.shopConfig.name}`,
          text: shareText,
          url: url
        }).catch(() => copyStoreLinkAction());
      } else {
        copyStoreLinkAction();
      }
    });
  }

  // 7. Pestañas de Navegación del Studio
  document.querySelectorAll(".studio-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.getAttribute("data-tab");
      StudioController.switchStudioTab(tabKey);
    });
  });

  // 8. Buscador en el Studio
  const studioSearchInput = document.getElementById("studio-search-input");
  const studioClearSearchBtn = document.getElementById("studio-clear-search-btn");

  if (studioSearchInput) {
    studioSearchInput.addEventListener("input", (e) => {
      AppState.studioSearchQuery = e.target.value;
      if (studioClearSearchBtn) {
        studioClearSearchBtn.classList.toggle("hidden", !AppState.studioSearchQuery);
      }
      StudioController.renderProductsList();
    });
  }

  if (studioClearSearchBtn) {
    studioClearSearchBtn.addEventListener("click", () => {
      if (studioSearchInput) studioSearchInput.value = "";
      AppState.studioSearchQuery = "";
      studioClearSearchBtn.classList.add("hidden");
      StudioController.renderProductsList();
    });
  }

  // 9. Botón "+ Añadir Producto" y Editor
  const studioAddProductBtn = document.getElementById("studio-add-product-btn");
  const closeEditorBtn = document.getElementById("close-editor-btn");
  const editorCancelBtn = document.getElementById("editor-cancel-btn");
  const studioProductForm = document.getElementById("studio-product-form");

  if (studioAddProductBtn) studioAddProductBtn.addEventListener("click", () => StudioController.openAddProduct());
  if (closeEditorBtn) closeEditorBtn.addEventListener("click", () => StudioController.closeProductEditor());
  if (editorCancelBtn) editorCancelBtn.addEventListener("click", () => StudioController.closeProductEditor());
  if (studioProductForm) studioProductForm.addEventListener("submit", (e) => StudioController.saveProduct(e));
  const saveProductBtn = document.getElementById("save-product-btn");
  if (saveProductBtn) saveProductBtn.addEventListener("click", (e) => {
    e.preventDefault();
    StudioController.saveProduct(e);
  });

  const editorToggleTypesBtn = document.getElementById("editor-toggle-types-btn");
  const editorListingTypePills = document.getElementById("editor-listing-type-pills");
  if (editorToggleTypesBtn && editorListingTypePills) {
    editorToggleTypesBtn.addEventListener("click", () => {
      editorListingTypePills.classList.toggle("hidden");
      const isVisible = !editorListingTypePills.classList.contains("hidden");
      editorToggleTypesBtn.textContent = isVisible ? "Ocultar tipos ✕" : "Cambiar tipo ▾";
    });
  }

  // 9.1 Gestor de Categorías (Modal y Paleta de Emojis)
  const studioManageCategoriesBtn = document.getElementById("studio-manage-categories-btn");
  const closeCategoriesModalBtn = document.getElementById("close-categories-modal-btn");
  const closeCategoriesModalDoneBtn = document.getElementById("close-categories-modal-done-btn");
  const catEmojiPickerBtn = document.getElementById("cat-emoji-picker-btn");
  const catEmojiPalette = document.getElementById("cat-emoji-palette");
  const addCategorySubmitBtn = document.getElementById("add-category-submit-btn");
  const newCategoryNameInput = document.getElementById("new-category-name-input");
  const editorQuickAddCatBtn = document.getElementById("editor-quick-add-cat-btn");

  if (studioManageCategoriesBtn) {
    studioManageCategoriesBtn.addEventListener("click", () => StudioController.openCategoryManager());
  }
  if (closeCategoriesModalBtn) {
    closeCategoriesModalBtn.addEventListener("click", () => StudioController.closeCategoryManager());
  }
  if (closeCategoriesModalDoneBtn) {
    closeCategoriesModalDoneBtn.addEventListener("click", () => StudioController.closeCategoryManager());
  }

  if (catEmojiPickerBtn && catEmojiPalette) {
    catEmojiPickerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      catEmojiPalette.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!catEmojiPalette.contains(e.target) && e.target !== catEmojiPickerBtn) {
        catEmojiPalette.classList.add("hidden");
      }
    });
  }

  document.querySelectorAll("#cat-emoji-palette .emoji-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const emoji = chip.getAttribute("data-emoji");
      if (catEmojiPickerBtn && emoji) {
        catEmojiPickerBtn.textContent = emoji;
      }
      if (catEmojiPalette) catEmojiPalette.classList.add("hidden");
    });
  });

  const handleCreateCategory = () => {
    if (!newCategoryNameInput) return;
    const name = newCategoryNameInput.value.trim();
    if (!name) {
      Toast.show("Escribe el nombre de la categoría", "✏️");
      newCategoryNameInput.focus();
      return;
    }
    const icon = catEmojiPickerBtn ? catEmojiPickerBtn.textContent.trim() : "🏷️";
    const added = AppState.addCategory(name, icon);
    if (added) {
      newCategoryNameInput.value = "";
      if (catEmojiPickerBtn) catEmojiPickerBtn.textContent = "🏷️";
      StudioController.renderCategoryManagerList();
      StudioController.renderCategoryFilters();
      CustomerUI.renderCategoryTabs();
    }
  };

  if (addCategorySubmitBtn) addCategorySubmitBtn.addEventListener("click", handleCreateCategory);
  if (newCategoryNameInput) {
    newCategoryNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCreateCategory();
      }
    });
  }

  if (editorQuickAddCatBtn) {
    editorQuickAddCatBtn.addEventListener("click", () => {
      const newCat = prompt("Ingresa el nombre de la nueva categoría:");
      if (newCat && newCat.trim()) {
        const added = AppState.addCategory(newCat.trim());
        if (added) {
          const catInp = document.getElementById("editor-category-input");
          if (catInp) catInp.value = added.name;
          StudioController.renderEditorCategoryChips(added.name);
          StudioController.renderCategoryFilters();
          CustomerUI.renderCategoryTabs();
        }
      }
    });
  }

  // 10. Subida de Foto en el Editor de Producto (Cámara o Galería)
  const productPhotoBox = document.getElementById("product-photo-upload-box");
  const editorTriggerFileBtn = document.getElementById("editor-trigger-file-btn");
  const editorFileInput = document.getElementById("editor-file-input");
  const editorToggleUrlBtn = document.getElementById("editor-toggle-url-btn");
  const editorUrlInput = document.getElementById("editor-url-input");

  if (productPhotoBox && editorFileInput) {
    productPhotoBox.addEventListener("click", () => editorFileInput.click());
  }
  if (editorTriggerFileBtn && editorFileInput) {
    editorTriggerFileBtn.addEventListener("click", () => editorFileInput.click());
  }
  if (editorFileInput) {
    editorFileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        StudioController.handleMultiPhotoUpload(files);
      }
      e.target.value = "";
    });
  }
  if (editorToggleUrlBtn && editorUrlInput) {
    editorToggleUrlBtn.addEventListener("click", () => {
      editorUrlInput.classList.toggle("hidden");
      if (!editorUrlInput.classList.contains("hidden")) editorUrlInput.focus();
    });
  }

  if (editorUrlInput) {
    editorUrlInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val) {
        StudioController.currentProductPhoto = val;
        if (!Array.isArray(StudioController.currentProductImages)) StudioController.currentProductImages = [];
        if (!StudioController.currentProductImages.includes(val)) {
          if (StudioController.currentProductImages.length === 0) {
            StudioController.currentProductImages.push(val);
          } else {
            StudioController.currentProductImages[0] = val;
          }
        }
        const previewImg = document.getElementById("editor-photo-preview");
        const placeholder = document.getElementById("editor-photo-placeholder");
        if (previewImg) {
          previewImg.src = val;
          previewImg.classList.remove("hidden");
        }
        if (placeholder) placeholder.classList.add("hidden");
        StudioController.renderEditorPhotosStrip();
      }
    });
  }

  // 10.1 Subida de Video en el Editor de Producto (Dropzone y Archivo)
  const productVideoUploadBox = document.getElementById("product-video-upload-box");
  const editorTriggerVideoBtn = document.getElementById("editor-trigger-video-btn");
  const editorVideoFileInput = document.getElementById("editor-video-file-input");
  const editorToggleVideoUrlBtn = document.getElementById("editor-toggle-video-url-btn");
  const editorVideoUrlInput = document.getElementById("editor-video-url-input");
  const editorRemoveVideoBtn = document.getElementById("editor-remove-video-btn");

  if (editorTriggerVideoBtn && editorVideoFileInput) {
    editorTriggerVideoBtn.addEventListener("click", () => editorVideoFileInput.click());
  }
  if (productVideoUploadBox && editorVideoFileInput) {
    productVideoUploadBox.addEventListener("click", (e) => {
      if (e.target !== editorTriggerVideoBtn && !editorTriggerVideoBtn.contains(e.target)) {
        editorVideoFileInput.click();
      }
    });
  }
  if (editorVideoFileInput) {
    editorVideoFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) StudioController.handleProductVideoUpload(file);
      e.target.value = "";
    });
  }
  if (editorToggleVideoUrlBtn && editorVideoUrlInput) {
    editorToggleVideoUrlBtn.addEventListener("click", () => {
      editorVideoUrlInput.classList.toggle("hidden");
      if (!editorVideoUrlInput.classList.contains("hidden")) {
        editorVideoUrlInput.focus();
      }
    });
  }
  if (editorVideoUrlInput) {
    editorVideoUrlInput.addEventListener("input", (e) => {
      StudioController.handleProductVideoUrlChange(e.target.value);
    });
  }
  if (editorRemoveVideoBtn) {
    editorRemoveVideoBtn.addEventListener("click", () => {
      StudioController.removeProductVideo();
    });
  }

  // 10.2 Selector de Temas Visuales y Colores de Tienda
  document.querySelectorAll(".theme-preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const themeId = card.dataset.themeId;
      if (!themeId || (typeof STORE_THEME_PRESETS !== "undefined" && !STORE_THEME_PRESETS[themeId])) return;
      const preset = STORE_THEME_PRESETS[themeId];
      AppState.shopConfig.themePreset = themeId;
      // Respetar el themeMode actual elegido por el usuario (no forzar a oscuro a menos que el usuario pulse Oscuro)
      if (!AppState.shopConfig.themeMode) {
        AppState.shopConfig.themeMode = preset.mode || "light";
      }
      AppState.shopConfig.accentColor = preset.accent;
      AppState.saveConfig();
      AppState.applyStoreTheme();
      Toast.show(`Estilo aplicado: ${preset.name}`, "");
    });
  });

  const customAccentColorInput = document.getElementById("store-custom-accent-color");
  if (customAccentColorInput) {
    customAccentColorInput.addEventListener("input", (e) => {
      AppState.shopConfig.accentColor = e.target.value;
      AppState.applyStoreTheme();
    });
    customAccentColorInput.addEventListener("change", () => {
      AppState.saveConfig();
      Toast.show("Color de botón actualizado", "");
    });
  }

  const themeModeLightBtn = document.getElementById("store-theme-mode-light");
  const themeModeDarkBtn = document.getElementById("store-theme-mode-dark");
  if (themeModeLightBtn) {
    themeModeLightBtn.addEventListener("click", () => {
      AppState.shopConfig.themeMode = "light";
      AppState.saveConfig();
      AppState.applyStoreTheme();
      Toast.show("Modo Claro activado", "");
    });
  }
  if (themeModeDarkBtn) {
    themeModeDarkBtn.addEventListener("click", () => {
      AppState.shopConfig.themeMode = "dark";
      AppState.saveConfig();
      AppState.applyStoreTheme();
      Toast.show("Modo Oscuro activado", "");
    });
  }

  // 11. Pestaña Ajustes (Cambio de rubro de la tienda activa)
  document.querySelectorAll(".niche-card-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const niche = btn.getAttribute("data-niche");
      if (!niche) return;
      AppState.changeStoreNiche(niche);
    });
  });

  const btnPortableLink = document.getElementById("btn-copy-portable-link");
  if (btnPortableLink) {
    btnPortableLink.addEventListener("click", () => {
      const portableUrl = QRGenerator.getPortableUrl();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(portableUrl).then(() => {
          Toast.show("Enlace portátil con catálogo completo copiado", "📤");
        });
      } else {
        prompt("Enlace portátil con datos incluidos:", portableUrl);
      }
    });
  }

  const studioSettingsForm = document.getElementById("studio-settings-form");
  if (studioSettingsForm) {
    studioSettingsForm.addEventListener("submit", (e) => StudioController.saveSettingsForm(e));
  }

  // Subida de QR de Yape del Vendedor
  const settingsYapeUploadBox = document.getElementById("settings-yape-upload-box");
  const triggerYapeQrBtn = document.getElementById("trigger-yape-qr-btn");
  const settingsYapeFileInput = document.getElementById("settings-yape-file-input");
  const removeYapeQrBtn = document.getElementById("remove-yape-qr-btn");

  if (settingsYapeUploadBox && settingsYapeFileInput) {
    settingsYapeUploadBox.addEventListener("click", () => settingsYapeFileInput.click());
  }
  if (triggerYapeQrBtn && settingsYapeFileInput) {
    triggerYapeQrBtn.addEventListener("click", () => settingsYapeFileInput.click());
  }
  if (settingsYapeFileInput) {
    settingsYapeFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) StudioController.handleYapeQrUpload(file);
    });
  }
  if (removeYapeQrBtn) {
    removeYapeQrBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      StudioController.removeYapeQr();
    });
  }

  // 12. Pestaña Nube & Respaldo
  const cloudSyncBtn = document.getElementById("cloud-sync-btn");
  const cloudCopyTemplateBtn = document.getElementById("cloud-copy-template-btn");
  const cloudSheetUrl = document.getElementById("cloud-sheet-url");

  if (cloudSyncBtn && cloudSheetUrl) {
    cloudSyncBtn.addEventListener("click", () => {
      const url = cloudSheetUrl.value.trim();
      if (!url) {
        alert("Pega primero el enlace de tu Google Sheet (Publicado en la web como CSV).");
        return;
      }
      AppState.shopConfig.googleSheetUrl = url;
      AppState.saveConfig();
      AppState.fetchGoogleSheetData(url, true);
    });
  }

  if (cloudCopyTemplateBtn) {
    cloudCopyTemplateBtn.addEventListener("click", () => {
      const template = `id,sku,nombre,precio,categoria,descripcion,tallas,colores,imagen,promo,disponible\n1,VES-101,Vestido Seda,79.00,Vestidos,Vestido de fiesta,"S, M, L","Negro, Blanco",,true,true`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(template).then(() => {
          alert("¡Plantilla copiada al portapapeles!\n\nPégala en tu Google Sheet con las columnas:\nid, sku, nombre, precio, categoria, descripcion, tallas, colores, imagen, promo, disponible");
        });
      } else {
        alert("Columnas recomendadas en Google Sheet:\nid | sku | nombre | precio | categoria | descripcion | tallas | colores | imagen | promo | disponible");
      }
    });
  }

  const cloudExportJsonBtn = document.getElementById("cloud-export-json-btn");
  const cloudImportJsonInput = document.getElementById("cloud-import-json-input");
  const cloudResetBtn = document.getElementById("cloud-reset-btn");

  if (cloudExportJsonBtn) cloudExportJsonBtn.addEventListener("click", () => StudioController.exportJSON());
  if (cloudImportJsonInput) cloudImportJsonInput.addEventListener("change", (e) => StudioController.importJSON(e));
  if (cloudResetBtn) {
    cloudResetBtn.addEventListener("click", () => {
      if (confirm("¿Deseas restaurar los valores iniciales de la plantilla actual?")) {
        AppState.applyPreset(AppState.activePreset);
      }
    });
  }

  // 13. Eventos del Cliente (Búsqueda, Carrito, Modales)
  const customerSearchInput = document.getElementById("customer-search-input");
  const customerClearSearchBtn = document.getElementById("customer-clear-search-btn");

  if (customerSearchInput) {
    customerSearchInput.addEventListener("input", (e) => {
      AppState.customerSearchQuery = e.target.value;
      if (customerClearSearchBtn) {
        customerClearSearchBtn.classList.toggle("hidden", !AppState.customerSearchQuery);
      }
      CustomerUI.renderProductCards();
    });
  }

  if (customerClearSearchBtn) {
    customerClearSearchBtn.addEventListener("click", () => {
      if (customerSearchInput) customerSearchInput.value = "";
      AppState.customerSearchQuery = "";
      customerClearSearchBtn.classList.add("hidden");
      CustomerUI.renderProductCards();
    });
  }

  // Carrito Flotante & Checkout
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  if (openCartBtn) openCartBtn.addEventListener("click", () => CustomerUI.openCartModal());
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => CustomerUI.closeCartModal());

  // Modal de Detalle de Producto
  const closeProdBtn = document.getElementById("close-product-modal-btn");
  if (closeProdBtn) closeProdBtn.addEventListener("click", () => CustomerUI.closeProductModal());

  // Lightbox Pantalla Completa & Zoom
  const lightboxModal = document.getElementById("media-lightbox-modal");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", () => CustomerUI.closeLightbox());
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("lightbox-content")) {
        CustomerUI.closeLightbox();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      CustomerUI.closeLightbox();
      CustomerUI.closeProductModal();
    }
  });

  const modalQtyMinus = document.getElementById("modal-qty-minus");
  const modalQtyPlus = document.getElementById("modal-qty-plus");
  const modalQtyVal = document.getElementById("modal-qty-val");
  const modalBtnTotal = document.getElementById("modal-button-total");
  const modalAddBtn = document.getElementById("modal-add-to-cart-btn");
  const modalNoteInput = document.getElementById("modal-product-note");

  if (modalQtyMinus && modalQtyPlus && modalQtyVal) {
    modalQtyMinus.addEventListener("click", () => {
      if (AppState.modalQuantity > 1) {
        AppState.modalQuantity--;
        modalQtyVal.textContent = AppState.modalQuantity;
        CustomerUI.updateModalPrice();
      }
    });

    modalQtyPlus.addEventListener("click", () => {
      AppState.modalQuantity++;
      modalQtyVal.textContent = AppState.modalQuantity;
      CustomerUI.updateModalPrice();
    });
  }

  if (modalAddBtn) {
    modalAddBtn.addEventListener("click", () => {
      if (AppState.selectedProductModal) {
        const note = modalNoteInput ? modalNoteInput.value.trim() : "";
        CartController.addToCart(
          AppState.selectedProductModal.id, 
          AppState.modalQuantity, 
          note, 
          AppState.modalSelectedSize, 
          AppState.modalSelectedColor
        );
        CustomerUI.closeProductModal();
      }
    });
  }

  // Modalidades de Entrega
  const modeDigital = document.getElementById("mode-digital");
  const modeDelivery = document.getElementById("mode-delivery");
  const modePickup = document.getElementById("mode-pickup");
  const modeDinein = document.getElementById("mode-dinein");
  const labelDigital = document.getElementById("option-digital-label");
  const labelDelivery = document.getElementById("option-delivery-label");
  const labelPickup = document.getElementById("option-pickup-label");
  const labelDinein = document.getElementById("option-dinein-label");
  const addressGroup = document.getElementById("address-field-group");
  const tableGroup = document.getElementById("table-field-group");
  const addressLabel = document.querySelector('label[for="client-address"]');
  const getGpsBtn = document.getElementById("get-gps-location-btn");

  if (modeDigital) {
    modeDigital.addEventListener("change", () => {
      AppState.deliveryMode = "digital";
      if (labelDigital) labelDigital.classList.add("active");
      if (labelDelivery) labelDelivery.classList.remove("active");
      if (labelPickup) labelPickup.classList.remove("active");
      if (labelDinein) labelDinein.classList.remove("active");
      if (addressGroup) addressGroup.style.display = "flex";
      if (addressLabel) addressLabel.textContent = "WhatsApp o Correo para entrega digital *";
      const addrInp = document.getElementById("client-address");
      if (addrInp) addrInp.placeholder = "Ej: tucorreo@gmail.com o 987654321";
      if (getGpsBtn) getGpsBtn.style.display = "none";
      if (tableGroup) tableGroup.classList.add("hidden");
      CustomerUI.renderCartItemsList();
      CustomerUI.updateCartTotals();
    });
  }

  if (modeDelivery) {
    modeDelivery.addEventListener("change", () => {
      AppState.deliveryMode = "delivery";
      if (labelDelivery) labelDelivery.classList.add("active");
      if (labelDigital) labelDigital.classList.remove("active");
      if (labelPickup) labelPickup.classList.remove("active");
      if (labelDinein) labelDinein.classList.remove("active");
      if (addressGroup) addressGroup.style.display = "flex";
      if (addressLabel) addressLabel.textContent = "Dirección y Referencia *";
      const addrInp = document.getElementById("client-address");
      if (addrInp) addrInp.placeholder = "Ej: Av. Las Palmeras 450, Dpto 302...";
      if (getGpsBtn) getGpsBtn.style.display = "inline-flex";
      if (tableGroup) tableGroup.classList.add("hidden");
      CustomerUI.renderCartItemsList();
      CustomerUI.updateCartTotals();
    });
  }

  if (modePickup) {
    modePickup.addEventListener("change", () => {
      AppState.deliveryMode = "pickup";
      if (labelPickup) labelPickup.classList.add("active");
      if (labelDigital) labelDigital.classList.remove("active");
      if (labelDelivery) labelDelivery.classList.remove("active");
      if (labelDinein) labelDinein.classList.remove("active");
      if (addressGroup) addressGroup.style.display = "none";
      if (tableGroup) tableGroup.classList.add("hidden");
      CustomerUI.renderCartItemsList();
      CustomerUI.updateCartTotals();
    });
  }

  if (modeDinein) {
    modeDinein.addEventListener("change", () => {
      AppState.deliveryMode = "dinein";
      if (labelDinein) labelDinein.classList.add("active");
      if (labelDigital) labelDigital.classList.remove("active");
      if (labelDelivery) labelDelivery.classList.remove("active");
      if (labelPickup) labelPickup.classList.remove("active");
      if (addressGroup) addressGroup.style.display = "none";
      if (tableGroup) tableGroup.classList.remove("hidden");
      CustomerUI.renderCartItemsList();
      CustomerUI.updateCartTotals();
    });
  }

  // Geolocalización GPS
  const clientAddressInput = document.getElementById("client-address");
  const gpsCoordsInput = document.getElementById("client-gps-coords");
  const gpsStatusBadge = document.getElementById("gps-status-badge");

  if (getGpsBtn) {
    getGpsBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocalización no disponible en este dispositivo.");
        return;
      }
      const originalText = getGpsBtn.innerHTML;
      getGpsBtn.disabled = true;
      getGpsBtn.innerHTML = `<span>⏳ Buscando tu ubicación...</span>`;
      Toast.show("Obteniendo coordenadas GPS...", "🛰️");

      const onLocationSuccess = async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const coords = `${lat},${lng}`;
        AppState.gpsCoords = coords;
        if (gpsCoordsInput) gpsCoordsInput.value = coords;
        if (gpsStatusBadge) gpsStatusBadge.classList.remove("hidden");

        // Geocodificación inversa real con Nominatim OpenStreetMap
        let addressFound = "";
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`, {
            signal: controller.signal,
            headers: { "Accept": "application/json" }
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.pedestrian || data.address.street || "";
              const number = data.address.house_number || "";
              const suburb = data.address.suburb || data.address.neighbourhood || data.address.city_district || "";
              const city = data.address.city || data.address.town || data.address.county || "";
              const parts = [road ? `${road} ${number}`.trim() : "", suburb, city].filter(Boolean);
              if (parts.length > 0) addressFound = parts.join(", ");
              else if (data.display_name) addressFound = data.display_name.split(",").slice(0, 3).join(",").trim();
            }
          }
        } catch (e) {
          console.warn("Geocodificación inversa no disponible o timeout:", e);
        }

        if (clientAddressInput) {
          clientAddressInput.value = addressFound || `Ubicación satelital adjunta (${coords})`;
        }
        getGpsBtn.disabled = false;
        getGpsBtn.innerHTML = originalText;
        Toast.show(addressFound ? `Dirección detectada: ${addressFound}` : "Coordenadas GPS adjuntadas", "📍");
      };

      const onLocationError = (err) => {
        if (err.code === 1) { // PERMISSION_DENIED
          alert("Por favor activa los permisos de ubicación en tu navegador (toca el candado 🔒 en la barra de direcciones) para enviar tu ubicación de entrega.");
          getGpsBtn.disabled = false;
          getGpsBtn.innerHTML = originalText;
          return;
        }
        // Fallback a baja precisión si falló la alta
        console.warn("Reintentando GPS con baja precisión...", err.message);
        navigator.geolocation.getCurrentPosition(
          onLocationSuccess,
          (err2) => {
            getGpsBtn.disabled = false;
            getGpsBtn.innerHTML = originalText;
            alert("No pudimos obtener tu ubicación satelital (" + err2.message + "). Por favor escribe tu dirección.");
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      };

      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    });
  }

  // Selector de Método de Pago y Conmutador Yape
  const paymentGrid = document.getElementById("payment-methods-grid");
  const cashChangeGroup = document.getElementById("cash-change-group");

  if (paymentGrid) {
    paymentGrid.querySelectorAll("input[type='radio']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        paymentGrid.querySelectorAll(".payment-pill-card").forEach(c => c.classList.remove("active"));
        e.target.closest(".payment-pill-card").classList.add("active");
        AppState.paymentMethod = e.target.value;

        if (cashChangeGroup) {
          cashChangeGroup.classList.toggle("hidden", AppState.paymentMethod !== "Efectivo");
        }
        CustomerUI.renderYapeCheckoutBox();
      });
    });
  }

  // Yape en Checkout: Copiar número
  const copyYapePhoneBtn = document.getElementById("copy-yape-phone-btn");
  if (copyYapePhoneBtn) {
    copyYapePhoneBtn.addEventListener("click", () => {
      const phone = AppState.shopConfig.yapePhone || AppState.shopConfig.phone || "987654321";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone).then(() => {
          Toast.show(`Número de Yape (${phone}) copiado`, "📋");
        });
      } else {
        prompt("Número de Yape:", phone);
      }
    });
  }

  // Yape en Checkout: Ver QR en grande
  const zoomYapeQrBtn = document.getElementById("zoom-yape-qr-btn");
  const yapeCheckoutQrImg = document.getElementById("yape-checkout-qr-img");
  const closeYapeZoomBtn = document.getElementById("close-yape-zoom-btn");
  const closeZoomDoneBtn = document.getElementById("close-zoom-done-btn");
  const copyZoomPhoneBtn = document.getElementById("copy-zoom-phone-btn");

  if (zoomYapeQrBtn) zoomYapeQrBtn.addEventListener("click", () => YapeQRZoom.open());
  if (yapeCheckoutQrImg) yapeCheckoutQrImg.addEventListener("click", () => YapeQRZoom.open());
  if (closeYapeZoomBtn) closeYapeZoomBtn.addEventListener("click", () => YapeQRZoom.close());
  if (closeZoomDoneBtn) closeZoomDoneBtn.addEventListener("click", () => YapeQRZoom.close());
  if (copyZoomPhoneBtn) {
    copyZoomPhoneBtn.addEventListener("click", () => {
      const phone = AppState.shopConfig.yapePhone || AppState.shopConfig.phone || "987654321";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone).then(() => {
          Toast.show(`Número copiado: ${phone}`, "📋");
        });
      } else {
        prompt("Número:", phone);
      }
    });
  }

  // Yape en Checkout: Subida de comprobante por el comprador
  const buyerVoucherDropzone = document.getElementById("buyer-voucher-dropzone");
  const buyerVoucherInput = document.getElementById("buyer-voucher-input");
  const removeVoucherBtn = document.getElementById("remove-voucher-btn");

  if (buyerVoucherDropzone && buyerVoucherInput) {
    buyerVoucherDropzone.addEventListener("click", (e) => {
      if (e.target !== removeVoucherBtn && !removeVoucherBtn?.contains(e.target)) {
        buyerVoucherInput.click();
      }
    });
  }
  if (buyerVoucherInput) {
    buyerVoucherInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) CustomerUI.handleBuyerVoucherUpload(file);
    });
  }
  if (removeVoucherBtn) {
    removeVoucherBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      CustomerUI.removeBuyerVoucher();
    });
  }

  // Enviar Pedido por WhatsApp
  const sendWaBtn = document.getElementById("send-whatsapp-order-btn");
  if (sendWaBtn) {
    sendWaBtn.addEventListener("click", () => WhatsAppOrder.sendOrder());
  }

  const ticketCloseBtn = document.getElementById("ticket-close-btn");
  if (ticketCloseBtn) {
    ticketCloseBtn.addEventListener("click", () => {
      const ticketModal = document.getElementById("ticket-modal");
      if (ticketModal) ticketModal.classList.add("hidden");
    });
  }

  // Compartir catálogo desde la vista del comprador (vitrina)
  const shareCustomerAction = () => {
    const url = window.location.href.split("#")[0];
    const storeName = AppState.shopConfig?.name || "esta tienda";
    const shareText = `🛍️ Mira el catálogo de ${storeName} aquí: ${url}`;
    if (navigator.share) {
      navigator.share({
        title: storeName,
        text: shareText,
        url: url
      }).catch(() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            Toast.show("Enlace copiado para compartir", "📋");
          });
        }
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        Toast.show("Enlace copiado para compartir", "📋");
      }).catch(() => {
        prompt("Enlace para compartir:", url);
      });
    } else {
      prompt("Enlace para compartir:", url);
    }
  };

  // QR Modal del Comercio y Header en Preview
  const previewQrBtn = document.getElementById("preview-qr-btn");
  const previewShareBtn = document.getElementById("preview-share-btn");
  if (previewQrBtn) previewQrBtn.addEventListener("click", () => QRGenerator.openQRModal());
  if (previewShareBtn) previewShareBtn.addEventListener("click", shareCustomerAction);

  const closeQrBtn = document.getElementById("close-qr-btn");
  const downloadQrBtn = document.getElementById("download-qr-btn");
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const qrPillGeneral = document.getElementById("qr-pill-general");
  const qrPillTable = document.getElementById("qr-pill-table");
  const qrTableInputRow = document.getElementById("qr-table-input-row");
  const qrTableInput = document.getElementById("qr-table-number");
  const qrCanvas = document.getElementById("qr-canvas");

  if (closeQrBtn) closeQrBtn.addEventListener("click", () => QRGenerator.closeQRModal());
  if (downloadQrBtn) downloadQrBtn.addEventListener("click", () => QRGenerator.downloadQR());
  if (copyLinkBtn) copyLinkBtn.addEventListener("click", copyStoreLinkAction);

  if (qrPillGeneral && qrPillTable) {
    qrPillGeneral.addEventListener("click", () => {
      QRGenerator.isTableMode = false;
      qrPillGeneral.classList.add("active");
      qrPillTable.classList.remove("active");
      if (qrTableInputRow) qrTableInputRow.classList.add("hidden");
      QRGenerator.renderStoreQR(qrCanvas, QRGenerator.getTargetUrl());
    });

    qrPillTable.addEventListener("click", () => {
      QRGenerator.isTableMode = true;
      qrPillTable.classList.add("active");
      qrPillGeneral.classList.remove("active");
      if (qrTableInputRow) qrTableInputRow.classList.remove("hidden");
      QRGenerator.renderStoreQR(qrCanvas, QRGenerator.getTargetUrl());
    });
  }

  if (qrTableInput) {
    qrTableInput.addEventListener("input", () => {
      if (QRGenerator.isTableMode) {
        QRGenerator.renderStoreQR(qrCanvas, QRGenerator.getTargetUrl());
      }
    });
  }

  // Eventos de Catálogos (Etapa 2)
  const qrCatalogSelect = document.getElementById("qr-catalog-select");
  if (qrCatalogSelect) {
    qrCatalogSelect.addEventListener("change", () => {
      if (qrCanvas) {
        const targetUrl = QRGenerator.getTargetUrl(true, false, qrCatalogSelect.value);
        QRGenerator.renderStoreQR(qrCanvas, targetUrl);
      }
    });
  }

  const clearCatFilterBtn = document.getElementById("btn-clear-customer-catalog");
  if (clearCatFilterBtn) {
    clearCatFilterBtn.addEventListener("click", () => {
      AppState.activeCustomerCatalogSlug = "";
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("cat");
        window.history.replaceState({}, "", url.toString());
      } catch (err) {}
      AppState.applyStoreTheme();
    CustomerUI.renderStoreHeader();
      CustomerUI.renderCategoryTabs();
      CustomerUI.renderProductCards();
      Toast.show("Mostrando toda la tienda", "🏪");
    });
  }

  const quickAddCatBtn = document.getElementById("editor-quick-add-catalog-btn");
  if (quickAddCatBtn) {
    quickAddCatBtn.addEventListener("click", () => {
      StudioController.promptCreateCatalog();
    });
  }

    // 14. EVENTOS DE LA INVITACIÓN & ONBOARDING ESTILO APPLE
  // Registro 100% Obligatorio: Se eliminaron los escapes o botones de omitir.

  // PASO 0: Invitación Oficial
  const appleAcceptInviteBtn = document.getElementById("apple-accept-invite-btn");
  if (appleAcceptInviteBtn) {
    appleAcceptInviteBtn.addEventListener("click", () => {
      OnboardingWizard.goToStep(1);
    });
  }

  // Permite hacer clic en los puntos segmentados para navegar
  document.querySelectorAll(".apple-dots-row .apple-dot").forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      if (idx <= OnboardingWizard.currentStep || localStorage.getItem("tiendazap_onboarding_done")) {
        OnboardingWizard.goToStep(idx);
      }
    });
  });

  // PASO 1: Registro del Propietario
  const applePrev1Btn = document.getElementById("apple-prev-1-btn");
  const appleNext1Btn = document.getElementById("apple-next-1-btn");
  if (applePrev1Btn) applePrev1Btn.addEventListener("click", () => OnboardingWizard.goToStep(0));
  if (appleNext1Btn) {
    appleNext1Btn.addEventListener("click", () => {
      const nameVal = document.getElementById("apple-reg-name")?.value.trim();
      const contactVal = document.getElementById("apple-reg-contact")?.value.trim();
      if (!nameVal) {
        Toast.show("Por favor ingresa tu nombre de comerciante", "✏️");
        document.getElementById("apple-reg-name")?.focus();
        return;
      }
      if (!contactVal) {
        Toast.show("Ingresa tu correo o celular para tu cuenta", "✏️");
        document.getElementById("apple-reg-contact")?.focus();
        return;
      }
      OnboardingWizard.saveCurrentStepData();
      OnboardingWizard.goToStep(2);
    });
  }

  // PASO 2: Identidad & Logo (Apple ID Avatar)
  const appleLogoCircle = document.getElementById("apple-logo-circle");
  const appleLogoFileInput = document.getElementById("apple-logo-file-input");
  if (appleLogoCircle && appleLogoFileInput) {
    appleLogoCircle.addEventListener("click", () => appleLogoFileInput.click());
    appleLogoFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = await ImageOptimizer.compressImage(file, 400, 0.88);
        AppState.shopConfig.logoUrl = url;
        const logoImg = document.getElementById("apple-logo-img");
        const logoPlc = document.getElementById("apple-logo-placeholder");
        if (logoImg) {
          logoImg.src = url;
          logoImg.classList.remove("hidden");
        }
        if (logoPlc) logoPlc.classList.add("hidden");
        AppState.saveConfig();
        StudioController.renderVisualCard();
        Toast.show("Logo de tu empresa guardado", "✨");
      }
    });
  }

  // Segmentos de Rubro
  document.querySelectorAll("#apple-niche-grid .apple-segment-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#apple-niche-grid .apple-segment-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const niche = pill.getAttribute("data-niche");
      AppState.activePreset = niche;

      const preset = BUSINESS_PRESETS[niche];
      if (preset) {
        const tagInp = document.getElementById("apple-store-tagline");
        if (tagInp && !tagInp.value) {
          tagInp.value = preset.config.tagline;
        }
        const prodCatInp = document.getElementById("apple-prod-cat");
        if (prodCatInp && !prodCatInp.value) {
          prodCatInp.value = preset.products[0]?.category || "Destacados";
        }
      }
      Toast.show(`Rubro: ${pill.textContent.trim()}`, "👌");
    });
  });

  const appleStoreNameInp = document.getElementById("apple-store-name");
  const appleStoreSlugInp = document.getElementById("apple-store-slug");
  const appleSlugPreview = document.getElementById("apple-slug-preview");

  if (appleStoreNameInp) {
    appleStoreNameInp.addEventListener("input", () => {
      if (!appleStoreSlugInp?.dataset.userEdited) {
        const slug = slugifyStoreName(appleStoreNameInp.value);
        if (appleStoreSlugInp) appleStoreSlugInp.value = slug;
        if (appleSlugPreview) appleSlugPreview.textContent = `${APP_BRAND.domainHint}/${slug}`;
      }
    });
  }

  if (appleStoreSlugInp) {
    appleStoreSlugInp.addEventListener("input", () => {
      appleStoreSlugInp.dataset.userEdited = "true";
      const slug = slugifyStoreName(appleStoreSlugInp.value);
      appleStoreSlugInp.value = slug;
      if (appleSlugPreview) appleSlugPreview.textContent = `${APP_BRAND.domainHint}/${slug}`;
    });
  }

  const applePrev2Btn = document.getElementById("apple-prev-2-btn");
  const appleNext2Btn = document.getElementById("apple-next-2-btn");
  if (applePrev2Btn) applePrev2Btn.addEventListener("click", () => OnboardingWizard.goToStep(1));
  if (appleNext2Btn) {
    appleNext2Btn.addEventListener("click", () => {
      const storeName = document.getElementById("apple-store-name")?.value.trim();
      if (!storeName) {
        Toast.show("Ingresa el nombre comercial de tu empresa", "✏️");
        document.getElementById("apple-store-name")?.focus();
        return;
      }
      OnboardingWizard.saveCurrentStepData();

      const yapeTitular = document.getElementById("apple-yape-titular");
      if (yapeTitular && !yapeTitular.value) {
        yapeTitular.value = AppState.merchant.name || storeName;
      }
      OnboardingWizard.goToStep(3);
    });
  }

  // PASO 3: Canales de Pago & WhatsApp
  const appleQrDropzone = document.getElementById("apple-qr-dropzone");
  const appleQrFileInput = document.getElementById("apple-qr-file-input");
  if (appleQrDropzone && appleQrFileInput) {
    appleQrDropzone.addEventListener("click", () => appleQrFileInput.click());
    appleQrFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = await ImageOptimizer.compressImage(file, 800, 0.88);
        AppState.shopConfig.yapeQrUrl = url;
        const qrImg = document.getElementById("apple-qr-img");
        const qrPlc = document.getElementById("apple-qr-placeholder");
        if (qrImg) {
          qrImg.src = url;
          qrImg.classList.remove("hidden");
        }
        if (qrPlc) qrPlc.classList.add("hidden");
        AppState.saveConfig();
        Toast.show("QR de Yape cargado con éxito", "📱");
      }
    });
  }

  const applePrev3Btn = document.getElementById("apple-prev-3-btn");
  const appleNext3Btn = document.getElementById("apple-next-3-btn");
  if (applePrev3Btn) applePrev3Btn.addEventListener("click", () => OnboardingWizard.goToStep(2));
  if (appleNext3Btn) {
    appleNext3Btn.addEventListener("click", () => {
      const phoneVal = document.getElementById("apple-store-phone")?.value.trim();
      if (!phoneVal) {
        Toast.show("Ingresa tu WhatsApp para recibir los pedidos", "📲");
        document.getElementById("apple-store-phone")?.focus();
        return;
      }

      const yapePhone = document.getElementById("apple-yape-phone");
      if (yapePhone && !yapePhone.value) {
        yapePhone.value = phoneVal;
      }

      OnboardingWizard.saveCurrentStepData();
      OnboardingWizard.goToStep(4);
    });
  }

  // PASO 4: Primer Producto del Catálogo
  const appleProdDropzone = document.getElementById("apple-prod-dropzone");
  const appleProdFileInput = document.getElementById("apple-prod-file-input");
  if (appleProdDropzone && appleProdFileInput) {
    appleProdDropzone.addEventListener("click", () => appleProdFileInput.click());
    appleProdFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = await ImageOptimizer.compressImage(file, 700, 0.88);
        const preview = document.getElementById("apple-prod-img");
        const placeholder = document.getElementById("apple-prod-placeholder");
        if (preview) {
          preview.src = url;
          preview.classList.remove("hidden");
        }
        if (placeholder) placeholder.classList.add("hidden");
        Toast.show("Fotografía del producto cargada", "📸");
      }
    });
  }

  const applePrev4Btn = document.getElementById("apple-prev-4-btn");
  const appleFinishBtn = document.getElementById("apple-finish-btn");
  if (applePrev4Btn) applePrev4Btn.addEventListener("click", () => OnboardingWizard.goToStep(3));
  if (appleFinishBtn) {
    appleFinishBtn.addEventListener("click", () => {
      OnboardingWizard.finishOnboarding();
    });
  }

  // PASO 5: Apple Digital Card & Enlaces
  const appleCopyLinkBtn = document.getElementById("apple-copy-link-btn");
  const appleOpenCustomerBtn = document.getElementById("apple-open-customer-btn");
  const appleOpenStudioBtn = document.getElementById("apple-open-studio-btn");

  if (appleCopyLinkBtn) {
    appleCopyLinkBtn.addEventListener("click", () => {
      const url = QRGenerator.getTargetUrl();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          Toast.show("Enlace exclusivo copiado al portapapeles", "📋");
        });
      } else {
        prompt("Enlace de tu catálogo para tus clientes:", url);
      }
    });
  }

  if (appleOpenCustomerBtn) appleOpenCustomerBtn.addEventListener("click", () => ViewController.showCustomerPreview());
  if (appleOpenStudioBtn) appleOpenStudioBtn.addEventListener("click", () => ViewController.showStudio());

  // ==========================================================================
  // ETAPA 1: EVENT LISTENERS MARKETPLACE, VISTAS Y FICHAS TÉCNICAS
  // ==========================================================================
  // Conmutador de vista de catálogo (Cuadrícula 2 cols vs Detallado 1 col)
  const toggleGridBtn = document.getElementById("toggle-view-grid");
  const toggleDetailedBtn = document.getElementById("toggle-view-detailed");
  const setCatalogView = (mode) => {
    AppState.catalogViewMode = mode;
    localStorage.setItem("tiendazap_view_mode", mode);
    if (toggleGridBtn) toggleGridBtn.classList.toggle("active", mode === "grid");
    if (toggleDetailedBtn) toggleDetailedBtn.classList.toggle("active", mode === "detailed");
    document.querySelectorAll("#customer-product-list .products-grid").forEach(grid => {
      grid.classList.toggle("view-detailed", mode === "detailed");
    });
  };
  if (toggleGridBtn) toggleGridBtn.addEventListener("click", () => setCatalogView("grid"));
  if (toggleDetailedBtn) toggleDetailedBtn.addEventListener("click", () => setCatalogView("detailed"));
  if (AppState.catalogViewMode === "detailed") {
    setCatalogView("detailed");
  }

  // Onboarding Step 4: Selector de Tipo de Publicación
  const appleTypeSelector = document.getElementById("apple-type-selector");
  const appleProdTypeInput = document.getElementById("apple-prod-type");
  if (appleTypeSelector) {
    appleTypeSelector.querySelectorAll(".apple-type-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        appleTypeSelector.querySelectorAll(".apple-type-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        if (appleProdTypeInput) appleProdTypeInput.value = pill.dataset.type || "item";
      });
    });
  }

  // Onboarding Step 4: Multi-foto
  const appleMultiFileInput = document.getElementById("apple-prod-file-input");
  const appleMultiStrip = document.getElementById("apple-multi-thumbs-strip");
  if (appleMultiFileInput) {
    appleMultiFileInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 6);
      if (files.length === 0) return;
      Toast.show("Optimizando fotos...", "⏳");
      OnboardingWizard.onboardingPhotos = [];
      for (const file of files) {
        try {
          const comp = await ImageOptimizer.compressImage(file, 800, 0.82);
          OnboardingWizard.onboardingPhotos.push(comp);
        } catch (err) {}
      }
      if (OnboardingWizard.onboardingPhotos.length > 0) {
        const preview = document.getElementById("apple-prod-img");
        const placeholder = document.getElementById("apple-prod-placeholder");
        if (preview) {
          preview.src = OnboardingWizard.onboardingPhotos[0];
          preview.classList.remove("hidden");
        }
        if (placeholder) placeholder.classList.add("hidden");
        if (appleMultiStrip) {
          appleMultiStrip.innerHTML = OnboardingWizard.onboardingPhotos.map((url, i) => `
            <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-subtle); flex-shrink: 0;">
              <img src="${url}" alt="Foto ${i+1}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          `).join("");
        }
      }
      Toast.show(`${OnboardingWizard.onboardingPhotos.length} fotos cargadas`, "📸");
    });
  }

  // Studio: Selector de Tipo de Publicación
  const studioTypePills = document.querySelectorAll("#editor-listing-type-pills .listing-pill, #editor-listing-type-pills .type-pill");
  const studioTypeInput = document.getElementById("editor-listing-type");
  studioTypePills.forEach(pill => {
    pill.addEventListener("click", () => {
      const chosenType = pill.dataset.type || "item";
      if (studioTypeInput) studioTypeInput.value = chosenType;
      StudioController.onListingTypeChange(chosenType, []);
    });
  });

  // Studio: Multi-foto input
  const studioMultiInput = document.getElementById("editor-multi-photo-input");
  if (studioMultiInput) {
    studioMultiInput.addEventListener("change", (e) => {
      StudioController.handleMultiPhotoUpload(e.target.files);
    });
  }

  // Triggers en el Studio
  const studioWizardBtn = document.getElementById("studio-open-wizard-btn");
  const studioResetBtn = document.getElementById("studio-reset-btn");

  if (studioWizardBtn) studioWizardBtn.addEventListener("click", () => ViewController.showOnboarding(1));
  if (studioResetBtn) studioResetBtn.addEventListener("click", () => OnboardingWizard.resetFromScratch());

  // ==========================================
  // REDISEÑO LIMPIO: NUEVOS EVENT LISTENERS
  // ==========================================
  // Onboarding Rápido
  const quickChipsContainer = document.getElementById("quick-niche-chips");
  const quickNicheHidden = document.getElementById("quick-selected-niche");
  if (quickChipsContainer && quickNicheHidden) {
    quickChipsContainer.querySelectorAll(".quick-niche-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        quickChipsContainer.querySelectorAll(".quick-niche-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        quickNicheHidden.value = chip.dataset.niche || "apparel";
      });
    });
  }

  const quickSetupForm = document.getElementById("quick-setup-form");
  if (quickSetupForm) {
    quickSetupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      OnboardingWizard.submitQuickSetup();
    });
  }
  const btnQuickCreateStore = document.getElementById("btn-quick-create-store");
  if (btnQuickCreateStore) {
    btnQuickCreateStore.addEventListener("click", (e) => {
      e.preventDefault();
      OnboardingWizard.submitQuickSetup();
    });
  }

  // 1. Store Switcher Trigger -> Menú Desplegable Flotante
  const storeSwitcherTrigger = document.getElementById("store-switcher-trigger");
  if (storeSwitcherTrigger) {
    storeSwitcherTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      StudioController.toggleStoreDropdown(e);
    });
  }

  // Cerrar dropdown al hacer click fuera
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("store-switcher-dropdown");
    const trigger = document.getElementById("store-switcher-trigger");
    if (dropdown && !dropdown.classList.contains("hidden")) {
      if (!dropdown.contains(e.target) && !trigger?.contains(e.target)) {
        StudioController.closeStoreDropdown();
      }
    }
  });

  // Botón Crear nueva tienda dentro del desplegable
  const dropdownCreateBtn = document.getElementById("dropdown-create-store-btn");
  if (dropdownCreateBtn) {
    dropdownCreateBtn.addEventListener("click", () => {
      StudioController.openCreateStoreModal();
    });
  }

  // Botón Abrir Asistente WhatsApp Business desde el desplegable
  const dropdownWizardBtn = document.getElementById("dropdown-reopen-wizard-btn");
  if (dropdownWizardBtn) {
    dropdownWizardBtn.addEventListener("click", () => {
      StudioController.closeStoreDropdown();
      ViewController.showOnboarding(1);
    });
  }

  // Botón Abrir Asistente desde Perfil de Empresa en Mi Tienda
  const settingsWizardBtn = document.getElementById("btn-reopen-wizard-settings");
  if (settingsWizardBtn) {
    settingsWizardBtn.addEventListener("click", () => {
      ViewController.showOnboarding(1);
    });
  }

  // 2. Botones de Difusión en Pestaña 1 (Mi Tienda)
  const storeCopyLinkBtn = document.getElementById("store-copy-link-btn");
  if (storeCopyLinkBtn) storeCopyLinkBtn.addEventListener("click", copyStoreLinkAction);

  const storeShareBtn = document.getElementById("store-share-btn");
  if (storeShareBtn) {
    storeShareBtn.addEventListener("click", () => {
      AppState.saveCurrentStoreState();
      const url = QRGenerator.getTargetUrl();
      const shareText = `🛍️ *Catálogo Oficial de ${AppState.shopConfig.name}*\n🔒 Enlace seguro: ${url}`;
      if (navigator.share) {
        navigator.share({
          title: `Catálogo Oficial de ${AppState.shopConfig.name}`,
          text: shareText,
          url: url
        }).catch(() => copyStoreLinkAction());
      } else {
        copyStoreLinkAction();
      }
    });
  }

  const storeOpenQrBtn = document.getElementById("store-open-qr-btn");
  if (storeOpenQrBtn) storeOpenQrBtn.addEventListener("click", () => QRGenerator.openQRModal());

  const btnCopyPortable = document.getElementById("btn-copy-portable-link");
  if (btnCopyPortable) {
    btnCopyPortable.addEventListener("click", () => {
      AppState.saveCurrentStoreState();
      const portableUrl = QRGenerator.getTargetUrl(false, true);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(portableUrl).then(() => {
          Toast.show("Enlace portátil con catálogo completo copiado", "📤");
        }).catch(() => prompt("Enlace portátil de tu tienda:", portableUrl));
      } else {
        prompt("Enlace portátil de tu tienda:", portableUrl);
      }
    });
  }

  // 3. Botones Guardar en Pestaña 1 y Pestaña 3
  const saveStoreBtn = document.getElementById("save-store-btn");
  if (saveStoreBtn) saveStoreBtn.addEventListener("click", () => StudioController.saveStoreIdentity());

  const savePaymentsBtn = document.getElementById("save-payments-btn");
  if (savePaymentsBtn) savePaymentsBtn.addEventListener("click", () => StudioController.savePaymentsSettings());

  // Studio Edit Store Btn -> Tab Mi Tienda
  const studioEditStoreBtn = document.getElementById("studio-edit-store-btn");
  if (studioEditStoreBtn) {
    studioEditStoreBtn.addEventListener("click", () => {
      StudioController.switchStudioTab("store");
    });
  }

  // Navegación Inferior Móvil Fija (3 Pestañas)
  document.querySelectorAll(".studio-bottom-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.getAttribute("data-tab");
      StudioController.switchStudioTab(tabKey);
    });
  });

  // Modal Crear Tienda: Apertura y Cierre
  const btnOpenCreateStore = document.getElementById("btn-open-create-store-modal");
  if (btnOpenCreateStore) {
    btnOpenCreateStore.addEventListener("click", () => StudioController.openCreateStoreModal());
  }

  // Cerrar modal Crear Tienda (soporta IDs canónicos y alias)
  const closeCreateStoreBtns = [
    document.getElementById("btn-close-create-store"),
    document.getElementById("close-create-store-modal-btn"),
    document.getElementById("btn-cancel-create-store"),
    document.getElementById("cancel-create-store-modal-btn")
  ];
  closeCreateStoreBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", () => StudioController.closeCreateStoreModal());
  });

  // Cerrar modal al hacer clic en el backdrop de #create-store-modal
  const createStoreModal = document.getElementById("create-store-modal");
  if (createStoreModal) {
    createStoreModal.addEventListener("click", (e) => {
      if (e.target === createStoreModal) {
        StudioController.closeCreateStoreModal();
      }
    });
  }

  // Modal Niche Chips (soporta tanto .niche-chip como .quick-niche-chip)
  const modalNicheChips = document.getElementById("modal-store-niche-chips");
  const modalSelectedNiche = document.getElementById("modal-store-selected-niche");
  if (modalNicheChips && modalSelectedNiche) {
    modalNicheChips.querySelectorAll(".niche-chip, .quick-niche-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        modalNicheChips.querySelectorAll(".niche-chip, .quick-niche-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        modalSelectedNiche.value = chip.dataset.niche || "tech";
      });
    });
  }

  // Botón rápido en la cabecera del Studio para crear tienda
  const studioHeaderCreateBtn = document.getElementById("studio-header-create-store-btn");
  if (studioHeaderCreateBtn) {
    studioHeaderCreateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      StudioController.openCreateStoreModal();
    });
  }

  // Confirmar creación de tienda (soporta IDs canónicos y alias)
  const confirmCreateStoreBtns = [
    document.getElementById("btn-confirm-create-store"),
    document.getElementById("submit-create-store-modal-btn")
  ];
  confirmCreateStoreBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("modal-new-store-name");
        const name = nameInput ? nameInput.value.trim() : "";
        if (!name) {
          Toast.show("Ingresa el nombre de la nueva tienda", "⚠️");
          if (nameInput) nameInput.focus();
          return;
        }
        const phoneInput = document.getElementById("modal-new-store-phone");
        const rawPhone = (phoneInput ? phoneInput.value : "").replace(/[^0-9]/g, "");
        if (rawPhone.length < 9) {
          Toast.show("Ingresa un WhatsApp válido de al menos 9 dígitos", "⚠️");
          if (phoneInput) phoneInput.focus();
          return;
        }
        const cleanPhone = rawPhone.startsWith("51") ? rawPhone : `51${rawPhone}`;

        const rawPreset = modalSelectedNiche?.value || "tech";
        const preset = AppState.normalizePresetKey(rawPreset);
        const currency = document.getElementById("modal-new-store-currency")?.value || (preset === "vehicles" ? "US$" : "S/");
        const yape = document.getElementById("modal-new-store-yape")?.value.trim() || "";

        AppState.createNewStore({ name, preset, phone: cleanPhone, currency, yapePhone: yape });
        StudioController.closeCreateStoreModal();
        StudioController.renderStoreDropdown();
        StudioController.switchStudioTab("products");
        StudioController.renderCatalogsBar();
        StudioController.renderProductsList();
        StudioController.populateSettingsTab();
        Toast.show(`¡Listo! Tu tienda «${name}» fue creada`, "✅");
      });
    }
  });

  // Tecla Escape para cerrar modales flotantes de Studio
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      StudioController.closeCreateStoreModal();
      StudioController.closeProductEditor();
      StudioController.closeStoreDropdown();
    }
  });

  // Backdrop click on product editor modal
  const productModal = document.getElementById("studio-product-modal");
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) {
        StudioController.closeProductEditor();
      }
    });
  }

  // Exportar al objeto global window para depuración y tests
  window.AppState = AppState;
  window.ViewController = ViewController;
  window.StudioController = StudioController;
  window.CustomerUI = CustomerUI;
  window.CartController = CartController;
  window.OnboardingWizard = OnboardingWizard;

});
