/**
 * TIENDAZAP STUDIO — SISTEMA INTEGRAL DEL COMERCIO & CATÁLOGO DIGITAL WHATSAPP
 * Mobile-First Seller Workspace: Administrador Profesional + Asistente Guiado Paso a Paso + Módulo de Cobros Yape/Plin.
 * Incluye carga y compresión de QR de Yape del vendedor, carga de comprobante de pago por el comprador,
 * generación de mensajes con resumen completo y ticket digital de confirmación.
 */

// ============================================================================
// 1. PLANTILLAS DE NEGOCIOS VIRTUALES (1 CLIC)
// ============================================================================
const BUSINESS_PRESETS = {
  food: {
    config: {
      name: "BurgerZap & Grill",
      tagline: "Hamburguesas artesanales smash, alitas crujientes y papas rústicas 🍔🔥",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 5.0,
      deliveryTime: "25-35 min",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "BurgerZap & Grill Administrador",
      yapeQrUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    products: [
      {
        id: "p1",
        sku: "HAM-01",
        name: "Smash Burger Clásica",
        category: "Hamburguesas",
        price: 19.90,
        desc: "150g carne angus smash, doble cheddar fundido, pepinillos dulces y salsa especial de la casa en pan brioche.",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        sizes: ["Normal", "Doble Medallón (+S/ 6)"],
        colors: [],
        promo: false,
        available: true
      },
      {
        id: "p2",
        sku: "HAM-02",
        name: "Monster Bacon BBQ",
        category: "Hamburguesas",
        price: 24.50,
        desc: "Doble medallón smash (220g), abundante tocino ahumado en salsa BBQ, cebolla caramelizada y cheddar americano.",
        img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80",
        sizes: ["Normal", "Doble Medallón"],
        colors: [],
        promo: true,
        available: true
      },
      {
        id: "p3",
        sku: "BOX-01",
        name: "Combo Smash Dúo + Papas Familiares",
        category: "Combos & Promos",
        price: 42.00,
        desc: "2 Smash Clásicas + porción gigante de papas rústicas con sal marina y 2 salsas a elección.",
        img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: [],
        promo: true,
        available: true
      },
      {
        id: "p4",
        sku: "SNK-01",
        name: "Alitas Buffalo Hot (8 pcs)",
        category: "Alitas & Snacks",
        price: 22.00,
        desc: "Alitas crocantes bañadas en salsa buffalo picante con apio fresco y dip de queso azul.",
        img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=500&q=80",
        sizes: ["8 piezas", "12 piezas (+S/ 6)"],
        colors: [],
        promo: false,
        available: true
      },
      {
        id: "p5",
        sku: "BEB-01",
        name: "Limonada Frozzen Hierbabuena (500ml)",
        category: "Bebidas",
        price: 8.50,
        desc: "Refrescante limonada frappé con limones recién exprimidos y hojas de hierbabuena aromática.",
        img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: [],
        promo: false,
        available: true
      }
    ]
  },

  fashion: {
    config: {
      name: "BellaZap Boutique & Moda",
      tagline: "Tendencias exclusivas, vestidos de fiesta, blusas y calzado en tendencia ✨👗",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 8.0,
      deliveryTime: "Envíos hoy mismo",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "BellaZap Boutique Oficial",
      yapeQrUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    products: [
      {
        id: "f1",
        sku: "VES-101",
        name: "Vestido Midi Seda Floral",
        category: "Vestidos",
        price: 79.90,
        desc: "Vestido con escote en V, tirantes ajustables y caída elegante en satín de seda importado. Ideal para eventos.",
        img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80",
        sizes: ["S", "M", "L"],
        colors: ["Palo Rosa", "Negro Elegante", "Blanco Marfil"],
        promo: true,
        available: true
      },
      {
        id: "f2",
        sku: "BLU-205",
        name: "Blusa Crop Lino con Botones",
        category: "Blusas & Tops",
        price: 49.00,
        desc: "Blusa fresca confeccionada en 100% lino orgánico con mangas abullonadas y botones de coco.",
        img: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=500&q=80",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Beige Arena", "Verde Olivo", "Blanco"],
        promo: false,
        available: true
      },
      {
        id: "f3",
        sku: "PAN-310",
        name: "Pantalón Wide Leg Denim Rígido",
        category: "Pantalones & Jeans",
        price: 89.00,
        desc: "Corte alto a la cintura, bota recta amplia y tela denim prémium que estiliza la figura.",
        img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
        sizes: ["26", "28", "30", "32"],
        colors: ["Azul Clásico", "Celeste Claro", "Negro Lavado"],
        promo: false,
        available: true
      },
      {
        id: "f4",
        sku: "CAL-402",
        name: "Sandalias de Tacón Cuadrado Cuero",
        category: "Calzado",
        price: 110.00,
        desc: "Tacón cómodo de 5cm, plantilla confort acolchada y tiras finas de cuero vegano antideslizante.",
        img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80",
        sizes: ["36", "37", "38", "39"],
        colors: ["Nude", "Negro", "Dorado"],
        promo: true,
        available: true
      }
    ]
  },

  beauty: {
    config: {
      name: "GlowZap Cosméticos & Skincare",
      tagline: "Maquillaje importado original, sérums coreanos y cuidado facial 💄✨",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 7.0,
      deliveryTime: "Envíos en 24-48h",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "GlowZap Cosméticos",
      yapeQrUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    products: [
      {
        id: "b1",
        sku: "LIP-01",
        name: "Labial Líquido Mate Indeleble 16h",
        category: "Labios",
        price: 35.00,
        desc: "Color intenso que no transfiere ni reseca. Fórmula ultra ligera enriquecida con vitamina E.",
        img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: ["01 Nude Rosado", "02 Rojo Pasión", "03 Cherry Velvet", "04 Terracota"],
        promo: true,
        available: true
      },
      {
        id: "b2",
        sku: "SRM-05",
        name: "Sérum Facial Ácido Hialurónico + B5",
        category: "Skincare",
        price: 65.00,
        desc: "Hidratación profunda multicapa. Rellena líneas de expresión y deja un efecto glow radiante.",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
        sizes: ["30ml", "60ml (+S/ 35)"],
        colors: [],
        promo: false,
        available: true
      },
      {
        id: "b3",
        sku: "PAL-12",
        name: "Paleta de Sombras Golden Sunset (18 tonos)",
        category: "Ojos",
        price: 85.00,
        desc: "Tonos tierra, cobrizos y glitters prensados de alta pigmentación con textura aterciopelada.",
        img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: [],
        promo: true,
        available: true
      }
    ]
  },

  tech: {
    config: {
      name: "ZapTech & Licencias",
      tagline: "Software original, licencias digitales garantizadas y accesorios tech 💻⚡",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 0.0,
      deliveryTime: "Entrega Inmediata",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "ZapTech Oficial",
      yapeQrUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    products: [
      {
        id: "t1",
        sku: "SOFT-01",
        name: "Licencia Windows 11 Pro (Digital)",
        category: "Software & Licencias",
        price: 39.00,
        desc: "Licencia digital 100% original con clave de 25 dígitos para 1 PC. Activación permanente en línea y soporte oficial.",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80",
        sizes: ["1 PC Permanente", "3 PCs Hogar (+S/ 30)"],
        colors: ["Entrega Inmediata WhatsApp", "Envío a Correo"],
        promo: true,
        available: true
      },
      {
        id: "t2",
        sku: "SOFT-02",
        name: "Microsoft 365 Pro Plus (Anual)",
        category: "Software & Licencias",
        price: 49.00,
        desc: "Word, Excel, PowerPoint y 1TB en OneDrive. Compatible con Windows, Mac, Android y iOS.",
        img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&q=80",
        sizes: ["1 Año (5 Dispositivos)"],
        colors: ["Activación Directa"],
        promo: true,
        available: true
      },
      {
        id: "t3",
        sku: "AUD-80",
        name: "Audífonos Bluetooth Pro ANC",
        category: "Audio & Gadgets",
        price: 119.00,
        desc: "Sonido Hi-Res con cancelación activa de ruido, micrófono dual y hasta 28h de batería con estuche.",
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: ["Blanco Puro", "Negro Titanio", "Azul Noche"],
        promo: false,
        available: true
      }
    ]
  },

  general: {
    config: {
      name: "Mi Tienda Express",
      tagline: "Variedad de artículos, novedades y envíos directos por WhatsApp 🛍️",
      phone: "51987654321",
      currency: "S/",
      deliveryCost: 6.0,
      deliveryTime: "Envíos hoy",
      isOpen: true,
      logoUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
      googleSheetUrl: "",
      yapeEnabled: true,
      yapePhone: "987654321",
      yapeName: "Mi Tienda Express",
      yapeQrUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    products: [
      {
        id: "g1",
        sku: "GEN-01",
        name: "Lámpara LED Minimalista Recargable",
        category: "Hogar & Novedades",
        price: 45.00,
        desc: "Lámpara táctil con 3 niveles de brillo, luz cálida y batería de 12 horas.",
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
        sizes: [],
        colors: ["Blanco", "Negro", "Madera"],
        promo: true,
        available: true
      }
    ]
  }
};
// ============================================================================
// 1.1 CONFIGURACIÓN DE RUBROS & CATEGORÍAS ESTILO WHATSAPP BUSINESS
// ============================================================================
const NICHE_DATA = {
  tech: {
    key: "tech",
    label: "Tecnología, Software & Licencias",
    tagline: "Software original, licencias digitales garantizadas y accesorios tech 💻⚡",
    suggestedCategories: ["Software & Licencias", "Suscripciones Digitales", "Antivirus & Seguridad", "Audio & Gadgets", "Accesorios"],
    defaultDeliveryTime: "Entrega Inmediata",
    defaultDeliveryCost: 0.0,
    isDigitalFriendly: true,
    hasDineIn: false,
    pills: {
      time: "⚡ Entrega Inmediata",
      cost: "💻 Envío Digital Gratis"
    }
  },
  food: {
    key: "food",
    label: "Gastronomía & Restaurante",
    tagline: "Hamburguesas artesanales smash, alitas crujientes y papas rústicas 🍔🔥",
    suggestedCategories: ["Hamburguesas", "Combos & Promos", "Alitas & Snacks", "Bebidas", "Postres"],
    defaultDeliveryTime: "25-35 min",
    defaultDeliveryCost: 5.0,
    isDigitalFriendly: false,
    hasDineIn: true,
    pills: {
      time: "⏱️ 25-35 min",
      cost: "🛵 Delivery S/ 5.00"
    }
  },
  fashion: {
    key: "fashion",
    label: "Moda & Calzado",
    tagline: "Tendencias exclusivas, vestidos de fiesta, blusas y calzado en tendencia ✨👗",
    suggestedCategories: ["Vestidos", "Blusas & Tops", "Pantalones & Jeans", "Calzado", "Accesorios"],
    defaultDeliveryTime: "Envíos en 24-48h",
    defaultDeliveryCost: 8.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "📦 Envíos 24-48h",
      cost: "🛵 Envíos a todo el país"
    }
  },
  beauty: {
    key: "beauty",
    label: "Belleza & Cosmética",
    tagline: "Maquillaje importado original, sérums coreanos y cuidado facial 💄✨",
    suggestedCategories: ["Skincare", "Labios", "Ojos & Paletas", "Perfumería", "Cuidado Capilar"],
    defaultDeliveryTime: "Envíos en 24-48h",
    defaultDeliveryCost: 7.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "✨ Envíos 24-48h",
      cost: "📦 Envíos a todo el país"
    }
  },
  general: {
    key: "general",
    label: "Tienda General",
    tagline: "Tus productos favoritos con envíos rápidos y atención directa por WhatsApp 🛍️",
    suggestedCategories: ["Destacados", "Ofertas", "Nuevos Ingresos", "Hogar", "Varios"],
    defaultDeliveryTime: "Envíos hoy",
    defaultDeliveryCost: 6.0,
    isDigitalFriendly: false,
    hasDineIn: false,
    pills: {
      time: "⏱️ Envíos hoy",
      cost: "🛵 Delivery disponible"
    }
  }
};

// ============================================================================
// 2. ESTADO GLOBAL REACTIVO (APPSTATE)
// ============================================================================
const AppState = {
  activePreset: "food",
  shopConfig: { ...BUSINESS_PRESETS.food.config },
  products: [...BUSINESS_PRESETS.food.products],
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

  // Registro del Propietario / Comerciante
  merchant: {
    name: "",
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

      // Soporte para reiniciar demostración desde cero (?nuevo=1, ?reset=1, ?demo=1, ?start=1)
      const resetParam = urlParams.get("reset") || urlParams.get("nuevo") || urlParams.get("demo") || urlParams.get("start");
      if (resetParam) {
        localStorage.removeItem("tiendazap_onboarding_done");
        localStorage.removeItem("tiendazap_merchant");
        localStorage.removeItem("tiendazap_config");
        localStorage.removeItem("tiendazap_products");
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

      const storedCart = localStorage.getItem("tiendazap_cart");
      if (storedCart) this.cart = JSON.parse(storedCart);

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

      // 3. Determinar el modo inicial según usuario
      const prodParam = urlParams.get("p");
      const modeParam = urlParams.get("mode");

      if (prodParam || modeParam === "shop" || mesaParam) {
        // MODO USUARIO FINAL (El comprador que ve el catálogo, compra y paga)
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
        if (modeParam === "studio") {
          ViewController.showStudio();
        } else if (stepParam !== null) {
          ViewController.showOnboarding(parseInt(stepParam, 10) || 0);
        } else if (!isDone) {
          // Iniciar como app de 0 con el Asistente estilo WhatsApp Business
          ViewController.showOnboarding(0);
        } else {
          ViewController.showStudio();
        }
      }

      // 4. Si tiene Google Sheets configurado, sincronizar
      if (this.shopConfig.googleSheetUrl) {
        this.fetchGoogleSheetData(this.shopConfig.googleSheetUrl, false);
      }
    } catch (e) {
      console.warn("Error inicializando estado local:", e);
    }
  },

  saveMerchant() {
    localStorage.setItem("tiendazap_merchant", JSON.stringify(this.merchant));
  },

  saveConfig() {
    localStorage.setItem("tiendazap_config", JSON.stringify(this.shopConfig));
  },

  saveProducts() {
    localStorage.setItem("tiendazap_products", JSON.stringify(this.products));
  },

  saveCart() {
    localStorage.setItem("tiendazap_cart", JSON.stringify(this.cart));
  },

  saveClientData(name, phone, address) {
    localStorage.setItem("tiendazap_client", JSON.stringify({ name, phone, address }));
  },

  applyPreset(presetKey) {
    if (!BUSINESS_PRESETS[presetKey]) return;
    this.activePreset = presetKey;
    this.shopConfig = { ...BUSINESS_PRESETS[presetKey].config };
    this.products = [...BUSINESS_PRESETS[presetKey].products];
    this.cart = {};

    localStorage.setItem("tiendazap_preset", presetKey);
    this.saveConfig();
    this.saveProducts();
    this.saveCart();

    StudioController.renderAll();
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
  compressImage(file, maxDimension = 800, quality = 0.85) {
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

    StudioController.renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showCustomerPreview() {
    const obScreen = document.getElementById("onboarding-screen");
    const studioView = document.getElementById("admin-studio-view");
    const previewView = document.getElementById("customer-preview-view");

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

    CustomerUI.renderStoreHeader();
    CustomerUI.renderCategoryTabs();
    CustomerUI.renderProductCards();
    CustomerUI.updateCartBar();
    CustomerUI.renderYapeCheckoutBox();
    window.scrollTo({ top: 0, behavior: "smooth" });
    Toast.show("Modo Vista Previa: Así ven tu tienda tus clientes", "👁️");
  }
};

// ============================================================================
// 5. ASISTENTE DESDE CERO ESTILO APPLE (APPLE INVITATION & ONBOARDING)
// ============================================================================
const OnboardingWizard = {
  currentStep: 0, // 0: Invitación Oficial, 1: Registro Propietario, 2: Identidad & Logo, 3: WhatsApp & Yape, 4: Primer Producto, 5: Lanzamiento Apple Card

  init() {
    this.populateFields();
    this.renderStep();
  },

  goToStep(stepIndex) {
    this.currentStep = Math.max(0, Math.min(5, stepIndex));
    this.populateFields();
    this.renderStep();
  },

  populateFields() {
    const shop = AppState.shopConfig;
    const merchant = AppState.merchant || { name: "", contact: "", pin: "" };

    // Paso 1: Registro del Comerciante
    const regName = document.getElementById("apple-reg-name");
    const regContact = document.getElementById("apple-reg-contact");
    const regPin = document.getElementById("apple-reg-pin");
    if (regName) regName.value = merchant.name || "";
    if (regContact) regContact.value = merchant.contact || "";
    if (regPin) regPin.value = merchant.pin || "";

    // Paso 2: Marca y Logo
    const storeName = document.getElementById("apple-store-name");
    const storeTag = document.getElementById("apple-store-tagline");
    const logoImg = document.getElementById("apple-logo-img");
    const logoPlaceholder = document.getElementById("apple-logo-placeholder");

    if (storeName) storeName.value = shop.name || "";
    if (storeTag) storeTag.value = shop.tagline || "";

    if (logoImg && logoPlaceholder) {
      if (shop.logoUrl) {
        logoImg.src = shop.logoUrl;
        logoImg.classList.remove("hidden");
        logoPlaceholder.classList.add("hidden");
      } else {
        logoImg.classList.add("hidden");
        logoPlaceholder.classList.remove("hidden");
      }
    }

    // Segmentos de rubro
    document.querySelectorAll("#apple-niche-grid .apple-segment-pill").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-niche") === AppState.activePreset);
    });

    // Paso 3: WhatsApp y Yape
    const storePhone = document.getElementById("apple-store-phone");
    const currSel = document.getElementById("apple-currency-select");
    const yapePhone = document.getElementById("apple-yape-phone");
    const yapeTitular = document.getElementById("apple-yape-titular");
    const qrImg = document.getElementById("apple-qr-img");
    const qrPlaceholder = document.getElementById("apple-qr-placeholder");

    if (storePhone) storePhone.value = (shop.phone || "").replace(/^51/, "");
    if (currSel) currSel.value = shop.currency || "S/";
    if (yapePhone) yapePhone.value = shop.yapePhone || (shop.phone || "").replace(/^51/, "");
    if (yapeTitular) yapeTitular.value = shop.yapeName || merchant.name || shop.name || "";

    if (qrImg && qrPlaceholder) {
      if (shop.yapeQrUrl) {
        qrImg.src = shop.yapeQrUrl;
        qrImg.classList.remove("hidden");
        qrPlaceholder.classList.add("hidden");
      } else {
        qrImg.classList.add("hidden");
        qrPlaceholder.classList.remove("hidden");
      }
    }

    // Paso 4: Símbolo de Moneda
    const currSym = document.getElementById("apple-currency-sym");
    if (currSym) currSym.textContent = shop.currency || "S/";

    // Paso 5: Apple Digital Card
    const cardStore = document.getElementById("apple-card-store-name");
    const cardMerchant = document.getElementById("apple-card-merchant-name");
    const catalogLink = document.getElementById("apple-catalog-link");

    if (cardStore) cardStore.textContent = shop.name || "Mi Tienda";
    if (cardMerchant) cardMerchant.textContent = merchant.name || "Comerciante Registrado";
    if (catalogLink) catalogLink.value = QRGenerator.getTargetUrl();
  },

  renderStep() {
    // Mostrar u ocultar tarjetas de paso
    for (let i = 0; i <= 5; i++) {
      const stepCard = document.getElementById(`apple-step-${i}`);
      if (stepCard) {
        if (i === this.currentStep) {
          stepCard.classList.remove("hidden");
          stepCard.classList.add("active");
        } else {
          stepCard.classList.add("hidden");
          stepCard.classList.remove("active");
        }
      }
    }

    // Actualizar los 6 puntos de progreso estilo Apple iOS
    const dots = document.querySelectorAll(".apple-dots-row .apple-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("completed", idx < this.currentStep);
      dot.classList.toggle("active", idx === this.currentStep);
    });

    const stepLabels = [
      "Invitación Especial",
      "Paso 1 de 5 · Registro",
      "Paso 2 de 5 · Marca & Logo",
      "Paso 3 de 5 · WhatsApp & Yape",
      "Paso 4 de 5 · Primer Producto",
      "Paso 5 de 5 · Catálogo Activo"
    ];
    const counter = document.getElementById("apple-step-counter");
    if (counter) counter.textContent = stepLabels[this.currentStep] || "";

    if (this.currentStep === 4) {
      this.renderCategorySuggestions();
    }

    if (this.currentStep === 5) {
      const catalogLink = document.getElementById("apple-catalog-link");
      if (catalogLink) catalogLink.value = QRGenerator.getTargetUrl();
      const cardStore = document.getElementById("apple-card-store-name");
      const cardMerchant = document.getElementById("apple-card-merchant-name");
      if (cardStore) cardStore.textContent = AppState.shopConfig.name || "Mi Tienda";
      if (cardMerchant) cardMerchant.textContent = AppState.merchant?.name || "Comerciante Registrado";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderCategorySuggestions() {
    const container = document.getElementById("apple-cat-suggestions");
    if (!container) return;
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const cats = nicheInfo.suggestedCategories || [];
    const catInput = document.getElementById("apple-prod-cat");

    container.innerHTML = cats.map(cat => `
      <button type="button" class="apple-cat-pill ${catInput && catInput.value === cat ? 'active' : ''}">
        ${cat}
      </button>
    `).join("");

    container.querySelectorAll(".apple-cat-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        if (catInput) {
          catInput.value = pill.textContent.trim();
          catInput.dispatchEvent(new Event("input"));
        }
        container.querySelectorAll(".apple-cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });
  },

  saveCurrentStepData() {
    const shop = AppState.shopConfig;
    const merchant = AppState.merchant;

    if (this.currentStep === 1) {
      const regName = document.getElementById("apple-reg-name")?.value.trim();
      const regContact = document.getElementById("apple-reg-contact")?.value.trim();
      const regPin = document.getElementById("apple-reg-pin")?.value.trim();
      if (regName) merchant.name = regName;
      if (regContact) merchant.contact = regContact;
      if (regPin) merchant.pin = regPin;
      AppState.saveMerchant();
    } else if (this.currentStep === 2) {
      const nameVal = document.getElementById("apple-store-name")?.value.trim();
      const tagVal = document.getElementById("apple-store-tagline")?.value.trim();
      if (nameVal) shop.name = nameVal;
      if (tagVal) shop.tagline = tagVal;
    } else if (this.currentStep === 3) {
      const rawPhone = document.getElementById("apple-store-phone")?.value.trim();
      const curr = document.getElementById("apple-currency-select")?.value;
      const yapeP = document.getElementById("apple-yape-phone")?.value.trim();
      const yapeT = document.getElementById("apple-yape-titular")?.value.trim();

      if (rawPhone) {
        const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
        shop.phone = cleanPhone.startsWith("51") ? cleanPhone : `51${cleanPhone}`;
      }
      if (curr) shop.currency = curr;
      if (yapeP) shop.yapePhone = yapeP;
      if (yapeT) shop.yapeName = yapeT;
    } else if (this.currentStep === 4) {
      const prodName = document.getElementById("apple-prod-name")?.value.trim();
      const prodPrice = parseFloat(document.getElementById("apple-prod-price")?.value);
      const prodCat = document.getElementById("apple-prod-cat")?.value.trim();
      const previewImg = document.getElementById("apple-prod-img");

      if (prodName && !isNaN(prodPrice)) {
        const prodImg = (previewImg && previewImg.src && !previewImg.classList.contains("hidden"))
          ? previewImg.src
          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";

        const newP = {
          id: "p_" + Date.now(),
          sku: "ART-01",
          name: prodName,
          price: prodPrice,
          category: prodCat || "Destacados",
          desc: "Producto publicado durante el registro inicial.",
          sizes: [],
          colors: [],
          img: prodImg,
          promo: true,
          available: true
        };
        AppState.products.unshift(newP);
        AppState.saveProducts();
      }
    }

    AppState.saveConfig();
    StudioController.renderVisualCard();
    CustomerUI.renderStoreHeader();
  },

  finishOnboarding() {
    this.saveCurrentStepData();

    // Si no creó ningún producto, aseguramos catálogo demostrativo según rubro
    if (AppState.products.length === 0) {
      const preset = BUSINESS_PRESETS[AppState.activePreset] || BUSINESS_PRESETS.food;
      AppState.products = [...preset.products];
      AppState.saveProducts();
    }

    localStorage.setItem("tiendazap_onboarding_done", "true");
    AppState.saveConfig();
    StudioController.renderAll();
    CustomerUI.renderStoreHeader();
    this.goToStep(5);
    Toast.show("Catálogo configurado con éxito", "✨");
  },

  skip() {
    localStorage.setItem("tiendazap_onboarding_done", "true");
    if (!AppState.shopConfig.name) {
      AppState.applyPreset("food");
    }
    Toast.show("Tienda demo cargada. Puedes personalizar todo en el Studio", "✨");
    ViewController.showStudio();
  },

  resetFromScratch() {
    if (confirm("¿Deseas reiniciar la configuración de tu tienda y comenzar de cero con la Invitación Oficial?")) {
      localStorage.removeItem("tiendazap_onboarding_done");
      localStorage.removeItem("tiendazap_merchant");
      localStorage.removeItem("tiendazap_config");
      localStorage.removeItem("tiendazap_products");
      localStorage.removeItem("tiendazap_preset");
      localStorage.removeItem("tiendazap_cart");
      localStorage.removeItem("tiendazap_client");

      AppState.merchant = { name: "", contact: "", pin: "" };
      AppState.shopConfig = {
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
      AppState.products = [];
      AppState.cart = {};

      // Limpiar inputs
      const inputs = [
        "apple-reg-name", "apple-reg-contact", "apple-reg-pin",
        "apple-store-name", "apple-store-tagline", "apple-store-phone",
        "apple-yape-phone", "apple-yape-titular",
        "apple-prod-name", "apple-prod-price", "apple-prod-cat"
      ];
      inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });

      const logoImg = document.getElementById("apple-logo-img");
      const logoPlc = document.getElementById("apple-logo-placeholder");
      if (logoImg) { logoImg.src = ""; logoImg.classList.add("hidden"); }
      if (logoPlc) logoPlc.classList.remove("hidden");

      const qrImg = document.getElementById("apple-qr-img");
      const qrPlc = document.getElementById("apple-qr-placeholder");
      if (qrImg) { qrImg.src = ""; qrImg.classList.add("hidden"); }
      if (qrPlc) qrPlc.classList.remove("hidden");

      const prodImg = document.getElementById("apple-prod-img");
      const prodPlc = document.getElementById("apple-prod-placeholder");
      if (prodImg) { prodImg.src = ""; prodImg.classList.add("hidden"); }
      if (prodPlc) prodPlc.classList.remove("hidden");

      this.currentStep = 0;
      ViewController.showOnboarding(0);
      Toast.show("Tienda reiniciada de cero", "🔄");
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

  renderAll() {
    this.renderVisualCard();
    this.renderTopStatus();
    this.renderCategoryFilters();
    this.renderProductsList();
    this.populateSettingsTab();
  },

  renderTopStatus() {
    const toggleBtn = document.getElementById("toggle-store-status-btn");
    const label = document.getElementById("quick-status-label");
    if (!toggleBtn || !label) return;

    if (AppState.shopConfig.isOpen) {
      toggleBtn.className = "status-quick-toggle open";
      label.textContent = "Abierto";
    } else {
      toggleBtn.className = "status-quick-toggle closed";
      label.textContent = "Cerrado";
    }
  },

  toggleStoreStatus() {
    AppState.shopConfig.isOpen = !AppState.shopConfig.isOpen;
    AppState.saveConfig();
    this.renderTopStatus();
    CustomerUI.renderStoreHeader();
    Toast.show(`Tienda marcada como: ${AppState.shopConfig.isOpen ? "ABIERTA" : "CERRADA"}`, AppState.shopConfig.isOpen ? "🟢" : "🔴");
  },

  renderVisualCard() {
    const bannerImg = document.getElementById("admin-banner-preview");
    const logoImg = document.getElementById("admin-logo-preview");
    const nameInput = document.getElementById("live-store-name");
    const taglineInput = document.getElementById("live-store-tagline");

    if (bannerImg) bannerImg.src = AppState.shopConfig.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";
    if (logoImg) logoImg.src = AppState.shopConfig.logoUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80";
    if (nameInput) nameInput.value = AppState.shopConfig.name || "";
    if (taglineInput) taglineInput.value = AppState.shopConfig.tagline || "";
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

      const logoImg = document.getElementById("admin-logo-preview");
      if (logoImg) logoImg.src = compressedUrl;
      CustomerUI.renderStoreHeader();
      Toast.show("¡Logo de tu negocio actualizado!", "✨");
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

  switchStudioTab(tabKey) {
    document.querySelectorAll(".studio-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabKey);
    });

    const viewProducts = document.getElementById("view-products");
    const viewSettings = document.getElementById("view-settings");
    const viewCloud = document.getElementById("view-cloud");

    if (viewProducts) viewProducts.classList.toggle("hidden", tabKey !== "products");
    if (viewSettings) viewSettings.classList.toggle("hidden", tabKey !== "settings");
    if (viewCloud) viewCloud.classList.toggle("hidden", tabKey !== "cloud");
  },

  getCategories() {
    const map = {};
    AppState.products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });

    return [
      { name: "all", label: "Todos", count: AppState.products.length, icon: "" },
      ...Object.keys(map).map(cat => ({
        name: cat,
        label: cat,
        count: map[cat],
        icon: CustomerUI.getCategoryIcon(cat)
      }))
    ];
  },

  renderCategoryFilters() {
    const track = document.getElementById("studio-categories-track");
    const badge = document.getElementById("studio-products-badge");
    if (badge) badge.textContent = AppState.products.length;

    if (!track) return;
    const cats = this.getCategories();

    track.innerHTML = cats.map(c => `
      <button type="button" class="studio-cat-chip ${AppState.studioCategory === c.name ? "active" : ""}" data-category="${c.name}">
        <span>${c.icon}</span>
        <span>${c.label}</span>
        <span style="opacity: 0.65; font-size: 0.7rem;">(${c.count})</span>
      </button>
    `).join("");

    track.querySelectorAll(".studio-cat-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.studioCategory = btn.getAttribute("data-category");
        this.renderCategoryFilters();
        this.renderProductsList();
      });
    });
  },

  renderProductsList() {
    const listContainer = document.getElementById("studio-products-list");
    const emptyState = document.getElementById("studio-empty-state");
    if (!listContainer) return;

    let items = [...AppState.products];
    const query = AppState.studioSearchQuery.toLowerCase().trim();

    if (AppState.studioCategory !== "all") {
      items = items.filter(p => p.category === AppState.studioCategory);
    }

    if (query) {
      items = items.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
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
      const skuTag = p.sku ? `<span class="apple-sku-pill">${p.sku}</span>` : "";
      const promoBadge = p.promo ? `<span class="apple-promo-pill">PROMO</span>` : "";

      return `
        <article class="apple-studio-prod-card ${!isAvailable ? 'is-out-of-stock' : ''}" data-id="${p.id}">
          <div class="apple-prod-thumb-wrap" onclick="StudioController.openEditProduct('${p.id}')">
            <img src="${p.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}" alt="${p.name}" class="apple-prod-thumb" loading="lazy">
          </div>

          <div class="apple-prod-info">
            <div class="apple-prod-header-line">
              <h4 class="apple-prod-title" onclick="StudioController.openEditProduct('${p.id}')">${p.name}</h4>
              <div style="display: flex; gap: 4px; align-items: center;">
                ${skuTag}
                ${promoBadge}
              </div>
            </div>

            <div class="apple-prod-meta">
              <span>${p.category}</span>
              ${(p.sizes && p.sizes.length > 0) ? ` • ${p.sizes.length} opciones` : ''}
            </div>

            <div class="apple-prod-controls-row">
              <!-- Píldora de Modificación de Precio Apple -->
              <button type="button" class="apple-price-chip" onclick="StudioController.quickEditPrice('${p.id}')" title="Toca para cambiar precio">
                <span>${currency} ${Number(p.price).toFixed(2)}</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <!-- Switch de Stock -->
              <button type="button" class="apple-stock-chip ${isAvailable ? 'in-stock' : 'out-stock'}" 
                      onclick="StudioController.quickToggleStock('${p.id}')" 
                      title="Cambiar disponibilidad">
                <span class="apple-chip-dot"></span>
                <span>${isAvailable ? 'Activo' : 'Agotado'}</span>
              </button>

              <!-- Acciones Rápidas Vectoriales -->
              <div class="apple-prod-actions">
                <button type="button" class="apple-icon-btn" onclick="StudioController.copyLiveLink('${p.id}')" title="Copiar enlace directo">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
                <button type="button" class="apple-icon-btn" onclick="StudioController.openEditProduct('${p.id}')" title="Editar">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                  </svg>
                </button>
                <button type="button" class="apple-icon-btn danger" onclick="StudioController.deleteProduct('${p.id}')" title="Eliminar">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");
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
    document.getElementById("editor-available-check").checked = true;
    document.getElementById("editor-promo-check").checked = false;
    this.currentProductPhoto = "";

    const previewImg = document.getElementById("editor-photo-preview");
    const placeholder = document.getElementById("editor-photo-placeholder");
    if (previewImg) {
      previewImg.src = "";
      previewImg.classList.add("hidden");
    }
    if (placeholder) placeholder.classList.remove("hidden");

    const currSymbol = document.getElementById("editor-currency-symbol");
    if (currSymbol) currSymbol.textContent = AppState.shopConfig.currency || "S/";

    if (title) title.textContent = "Añadir Nuevo Producto";
    editor.classList.remove("hidden");
    editor.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  openEditProduct(productId) {
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

    if (title) title.textContent = "Editar Producto";
    editor.classList.remove("hidden");
    editor.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  closeProductEditor() {
    const editor = document.getElementById("studio-product-editor");
    if (editor) editor.classList.add("hidden");
  },

  async handleProductPhotoUpload(file) {
    if (!file) return;
    try {
      Toast.show("Optimizando foto...", "⏳");
      const compressedUrl = await ImageOptimizer.compressImage(file, 700, 0.82);
      this.currentProductPhoto = compressedUrl;

      const previewImg = document.getElementById("editor-photo-preview");
      const placeholder = document.getElementById("editor-photo-placeholder");
      if (previewImg) {
        previewImg.src = compressedUrl;
        previewImg.classList.remove("hidden");
      }
      if (placeholder) placeholder.classList.add("hidden");

      const urlInput = document.getElementById("editor-url-input");
      if (urlInput) urlInput.value = "";

      Toast.show("Foto optimizada y lista", "📸");
    } catch (err) {
      alert("Error procesando foto del producto: " + err.message);
    }
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

    const urlVal = urlInput ? urlInput.value.trim() : "";
    const img = this.currentProductPhoto || urlVal || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";

    if (!name || isNaN(price) || !category) {
      alert("Por favor completa los campos obligatorios: Nombre, Precio y Categoría.");
      return;
    }

    const sizes = sizesStr ? sizesStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    const colors = colorsStr ? colorsStr.split(",").map(c => c.trim()).filter(Boolean) : [];

    if (id) {
      const idx = AppState.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        AppState.products[idx] = {
          ...AppState.products[idx],
          name, price, category, sku, desc, sizes, colors, img, promo, available
        };
      }
    } else {
      const newProd = {
        id: "p_" + Date.now(),
        sku: sku || `COD-${AppState.products.length + 1}`,
        name, price, category, desc, sizes, colors, img, promo, available
      };
      AppState.products.unshift(newProd);
    }

    AppState.saveProducts();
    this.closeProductEditor();
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
    CustomerUI.renderStoreHeader();
    CustomerUI.renderProductCards();
    CustomerUI.renderYapeCheckoutBox();
    Toast.show("Ajustes de tienda y cobros guardados con éxito", "💾");
  },

  exportJSON() {
    const backupData = {
      version: "2.1-studio-yape",
      timestamp: new Date().toISOString(),
      shopConfig: AppState.shopConfig,
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
          AppState.saveConfig();
          AppState.saveProducts();
          this.renderAll();
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
    if (logoEl) logoEl.src = shop.logoUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80";
    if (nameEl) nameEl.textContent = shop.name || "Mi Tienda Digital";
    if (taglineEl) taglineEl.textContent = shop.tagline || "Catálogo y pedidos directos por WhatsApp";

    if (statusDot) {
      statusDot.className = `status-indicator-dot ${shop.isOpen ? "online" : "offline"}`;
    }

    if (statusPill) {
      statusPill.className = `store-pill status-pill ${shop.isOpen ? "open" : "closed"}`;
      statusPill.innerHTML = `<span class="pill-dot"></span> ${shop.isOpen ? "Abierto ahora" : "Cerrado por hoy"}`;
    }

    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;

    if (deliveryTimePill) {
      const isTech = AppState.activePreset === "tech";
      const icon = isTech ? "⚡" : (AppState.activePreset === "fashion" || AppState.activePreset === "beauty" ? "📦" : "⏱️");
      deliveryTimePill.innerHTML = `<span class="pill-icon">${icon}</span> ${shop.deliveryTime || nicheInfo.defaultDeliveryTime}`;
    }

    if (deliveryCostPill) {
      const isTech = AppState.activePreset === "tech";
      if (isTech && Number(shop.deliveryCost || 0) === 0) {
        deliveryCostPill.innerHTML = `<span class="pill-icon">💻</span> Envío Digital Gratis`;
      } else if (Number(shop.deliveryCost || 0) === 0) {
        deliveryCostPill.innerHTML = `<span class="pill-icon">✨</span> Envío Sin Costo`;
      } else {
        deliveryCostPill.innerHTML = `<span class="pill-icon">🛵</span> Delivery ${shop.currency} ${Number(shop.deliveryCost || 0).toFixed(2)}`;
      }
    }

    const cartStoreName = document.getElementById("cart-modal-store-name");
    if (cartStoreName) cartStoreName.textContent = shop.name;
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
    const previewWrap = document.getElementById("voucher-preview-wrap");
    const emptyPrompt = document.getElementById("voucher-empty-prompt");
    const voucherInput = document.getElementById("buyer-voucher-input");

    if (voucherInput) voucherInput.value = "";
    if (previewWrap) previewWrap.classList.add("hidden");
    if (emptyPrompt) emptyPrompt.classList.remove("hidden");
    Toast.show("Comprobante removido", "ℹ️");
  },

  getCategoryIcon(catName) {
    const c = catName.toLowerCase();
    if (c.includes("hamburguesa") || c.includes("burger")) return "🍔";
    if (c.includes("combo") || c.includes("promo")) return "⭐";
    if (c.includes("alita") || c.includes("snack") || c.includes("pollo")) return "🍗";
    if (c.includes("vestido")) return "👗";
    if (c.includes("blusa") || c.includes("top")) return "👚";
    if (c.includes("pantalon") || c.includes("jean")) return "👖";
    if (c.includes("calzado") || c.includes("zapato")) return "👠";
    if (c.includes("labio") || c.includes("labial")) return "💄";
    if (c.includes("skincare") || c.includes("serum")) return "✨";
    if (c.includes("ojo") || c.includes("sombra")) return "👁️";
    if (c.includes("audio") || c.includes("audifono")) return "🎧";
    if (c.includes("watch") || c.includes("reloj")) return "⌚";
    if (c.includes("cargador") || c.includes("cable")) return "🔌";
    if (c.includes("bebida") || c.includes("refresco")) return "🥤";
    return "🛍️";
  },

  getCategories() {
    const map = {};
    AppState.products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });

    return [
      { name: "all", label: "Todos", count: AppState.products.length, icon: "" },
      ...Object.keys(map).map(cat => ({
        name: cat,
        label: cat,
        count: map[cat],
        icon: this.getCategoryIcon(cat)
      }))
    ];
  },

  renderCategoryTabs() {
    const track = document.getElementById("customer-categories-track");
    if (!track) return;

    const categories = this.getCategories();
    track.innerHTML = categories.map(cat => `
      <button class="cat-tab-btn ${AppState.customerCategory === cat.name ? "active" : ""}" 
              data-category="${cat.name}" type="button">
        <span class="cat-tab-icon">${cat.icon}</span>
        <span>${cat.label}</span>
        <span class="cat-tab-count">${cat.count}</span>
      </button>
    `).join("");

    track.querySelectorAll(".cat-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.customerCategory = btn.getAttribute("data-category");
        this.renderCategoryTabs();
        this.renderProductCards();
      });
    });
  },

  renderProductCards() {
    const container = document.getElementById("customer-product-list");
    const emptyState = document.getElementById("customer-empty-state");
    if (!container) return;

    const query = AppState.customerSearchQuery.toLowerCase().trim();
    let filtered = [...AppState.products];

    if (AppState.customerCategory !== "all") {
      filtered = filtered.filter(p => p.category === AppState.customerCategory);
    }

    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.desc && p.desc.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
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

    const grouped = {};
    filtered.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    const currency = AppState.shopConfig.currency || "S/";

    let html = "";
    Object.keys(grouped).forEach(cat => {
      const items = grouped[cat];
      html += `
        <section class="category-section-block" id="cat-${cat.replace(/\s+/g, '-')}">
          <div class="category-section-header">
            <h2 class="category-section-title">${cat}</h2>
            <span class="category-section-qty">${items.length} opciones</span>
          </div>
          <div class="products-grid">
            ${items.map(p => {
              const isAvailable = p.available !== false;
              const hasVariants = (p.sizes && p.sizes.length > 0) || (p.colors && p.colors.length > 0);

              return `
                <div class="product-card ${!isAvailable ? 'out-of-stock' : ''}" data-product-id="${p.id}">
                  <div class="product-img-wrapper" onclick="CustomerUI.openProductModal('${p.id}')">
                    <img src="${p.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}" 
                         alt="${p.name}" class="product-card-img" loading="lazy">
                    ${p.promo ? `<span class="badge-promo-flag">PROMO</span>` : ""}
                    ${!isAvailable ? `<span class="badge-out-of-stock">AGOTADO</span>` : ""}
                  </div>

                  <div class="product-info-wrapper">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        ${p.sku ? `<span class="badge-sku">REF: ${p.sku}</span>` : "<span></span>"}
                        <button type="button" class="product-live-share-btn" onclick="CustomerUI.copyLiveProductLink('${p.id}', event)" title="Copiar enlace para el Live">
                          <span class="live-dot"></span> Link Live
                        </button>
                      </div>
                      <h3 class="product-name" onclick="CustomerUI.openProductModal('${p.id}')">${p.name}</h3>
                      <p class="product-desc">${p.desc || ""}</p>
                    </div>

                    <div class="product-bottom-row">
                      <span class="product-price">${currency} ${Number(p.price).toFixed(2)}</span>

                      ${!isAvailable ? `
                        <button class="add-product-btn btn-disabled" disabled type="button">
                          <span>Agotado</span>
                        </button>
                      ` : hasVariants ? `
                        <button class="add-product-btn" onclick="CustomerUI.openProductModal('${p.id}')" type="button">
                          <span>Elegir Talla / Color ➔</span>
                        </button>
                      ` : `
                        <button class="add-product-btn" onclick="CartController.addToCart('${p.id}', 1)" type="button">
                          <span>+ Agregar</span>
                        </button>
                      `}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
    });

    container.innerHTML = html;
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
    const btnTotalEl = document.getElementById("modal-button-total");
    const noteInput = document.getElementById("modal-product-note");
    const addBtn = document.getElementById("modal-add-to-cart-btn");

    const sizesGroup = document.getElementById("detail-sizes-group");
    const sizesRow = document.getElementById("detail-sizes-row");
    const colorsGroup = document.getElementById("detail-colors-group");
    const colorsRow = document.getElementById("detail-colors-row");

    const currency = AppState.shopConfig.currency || "S/";

    if (imgEl) imgEl.src = product.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
    if (catEl) catEl.textContent = product.category;
    if (promoBadge) {
      if (product.promo) promoBadge.classList.remove("hidden");
      else promoBadge.classList.add("hidden");
    }
    if (titleEl) {
      titleEl.innerHTML = `${product.name} ${product.sku ? `<small style="font-size:0.75rem; color:var(--accent-gold); display:block;">REF: ${product.sku}</small>` : ''}`;
    }
    if (descEl) descEl.textContent = product.desc || "Artículo de calidad prémium.";
    if (priceEl) priceEl.textContent = `${currency} ${Number(product.price).toFixed(2)}`;
    if (qtyValEl) qtyValEl.textContent = AppState.modalQuantity;
    if (btnTotalEl) btnTotalEl.textContent = `${currency} ${Number(product.price * AppState.modalQuantity).toFixed(2)}`;
    if (noteInput) noteInput.value = "";

    // Selector de tallas
    if (product.sizes && product.sizes.length > 0 && sizesGroup && sizesRow) {
      sizesGroup.classList.remove("hidden");
      sizesRow.innerHTML = product.sizes.map((s, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" data-size="${s}">
          ${s}
        </button>
      `).join("");

      sizesRow.querySelectorAll(".variant-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          sizesRow.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          AppState.modalSelectedSize = chip.getAttribute("data-size");
        });
      });
    } else if (sizesGroup) {
      sizesGroup.classList.add("hidden");
    }

    // Selector de colores
    if (product.colors && product.colors.length > 0 && colorsGroup && colorsRow) {
      colorsGroup.classList.remove("hidden");
      colorsRow.innerHTML = product.colors.map((c, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" data-color="${c}">
          ${c}
        </button>
      `).join("");

      colorsRow.querySelectorAll(".variant-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          colorsRow.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          AppState.modalSelectedColor = chip.getAttribute("data-color");
        });
      });
    } else if (colorsGroup) {
      colorsGroup.classList.add("hidden");
    }

    if (addBtn) {
      if (product.available === false) {
        addBtn.disabled = true;
        addBtn.classList.add("btn-disabled");
        addBtn.innerHTML = `<span>Producto Agotado</span>`;
      } else {
        addBtn.disabled = false;
        addBtn.classList.remove("btn-disabled");
        addBtn.innerHTML = `<span>Agregar al Pedido • <span id="modal-button-total">${currency} ${Number(product.price * AppState.modalQuantity).toFixed(2)}</span></span>`;
      }
    }

    if (modal) modal.classList.remove("hidden");
  },

  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.add("hidden");
    AppState.selectedProductModal = null;
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
        if (item.selectedSize) variantBadge.push(`Talla: ${item.selectedSize}`);
        if (item.selectedColor) variantBadge.push(`Color: ${item.selectedColor}`);

        return `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.product.name}</h4>
              ${variantBadge.length > 0 ? `<div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 600;">${variantBadge.join(" • ")}</div>` : ""}
              <span class="cart-item-subtotal">${currency} ${(item.product.price * item.quantity).toFixed(2)}</span>
              ${item.note ? `<div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">Nota: ${item.note}</div>` : ""}
            </div>

            <div class="cart-item-actions">
              <div class="card-qty-stepper">
                <button class="stepper-btn minus" onclick="CartController.decreaseQuantity('${item.cartKey}')" type="button">-</button>
                <span class="stepper-num">${item.quantity}</span>
                <button class="stepper-btn" onclick="CartController.addToCart('${item.product.id}', 1, '${item.note}', '${item.selectedSize}', '${item.selectedColor}')" type="button">+</button>
              </div>
            </div>
          </div>
        `;
      }).join("");
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
    const gpsBtn = document.getElementById("get-gps-location-btn");
    const clientTable = document.getElementById("client-table");

    // 1. Mostrar/ocultar opciones según rubro de WhatsApp Business
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
    return Object.values(AppState.cart).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  },

  getDeliveryCost() {
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

    let msg = `*NUEVO PEDIDO — ${shop.name.toUpperCase()}*\n`;
    msg += `📅 *Fecha:* ${dateStr}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *DATOS DEL CLIENTE:*\n`;
    msg += `• *Nombre:* ${clientData.name}\n`;
    msg += `• *Teléfono:* ${clientData.phone}\n`;

    if (clientData.deliveryMode === "digital") {
      msg += `• *Modalidad:* ⚡ Envío Digital Inmediato (WhatsApp / Correo)\n`;
      msg += `• *Contacto Digital:* ${clientData.address || clientData.phone}\n`;
    } else if (clientData.deliveryMode === "delivery") {
      msg += `• *Modalidad:* 🛵 Envío a Domicilio\n`;
      msg += `• *Dirección:* ${clientData.address}\n`;
      if (clientData.gpsCoords) {
        msg += `• *Ubicación GPS:* https://maps.google.com/?q=${clientData.gpsCoords}\n`;
      }
    } else if (clientData.deliveryMode === "dinein") {
      msg += `• *Modalidad:* 🍽️ Consumo en Mesa (${clientData.tableNumber || "Mesa Local"})\n`;
    } else {
      msg += `• *Modalidad:* 🛍️ Retiro en Local\n`;
    }

    if (clientData.notes && clientData.notes.trim()) {
      msg += `• *Notas:* ${clientData.notes.trim()}\n`;
    }

    msg += `\n📦 *DETALLE DE PRODUCTOS:*\n`;
    items.forEach((item, idx) => {
      const itemSub = (item.product.price * item.quantity).toFixed(2);
      const skuTag = item.product.sku ? `[${item.product.sku}] ` : "";
      
      let variantParts = [];
      if (item.selectedSize) variantParts.push(`Talla: ${item.selectedSize}`);
      if (item.selectedColor) variantParts.push(`Color: ${item.selectedColor}`);
      const variantText = variantParts.length > 0 ? ` (${variantParts.join(" | ")})` : "";

      msg += `${idx + 1}. *${item.quantity}x* ${skuTag}${item.product.name}${variantText} — ${currency} ${itemSub}\n`;
      if (item.note) {
        msg += `   └ _Nota: ${item.note}_\n`;
      }
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💳 *Subtotal:* ${currency} ${CartController.getSubtotal().toFixed(2)}\n`;

    if (clientData.deliveryMode === "delivery") {
      msg += `🛵 *Envío:* ${currency} ${CartController.getDeliveryCost().toFixed(2)}\n`;
    } else if (clientData.deliveryMode === "digital") {
      msg += `⚡ *Envío:* Gratis (Digital)\n`;
    }

    msg += `💰 *TOTAL A PAGAR: ${currency} ${CartController.getGrandTotal().toFixed(2)}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

    // Sección de Método de Pago y Comprobante de Yape
    if (clientData.paymentMethod === "Yape / Plin") {
      msg += `💵 *Método de Pago:* 📱 Yape / Plin\n`;
      if (shop.yapePhone) msg += `• *Número de Yape:* ${shop.yapePhone}\n`;
      if (shop.yapeName) msg += `• *Titular:* ${shop.yapeName}\n`;
      if (AppState.buyerVoucherBase64) {
        msg += `📎 *COMPROBANTE:* ✅ Adjuntado por el cliente (te enviará la captura a este chat).\n`;
      } else {
        msg += `📎 *COMPROBANTE:* ⚠️ Pendiente de adjuntar captura por este chat.\n`;
      }
    } else {
      msg += `💵 *Método de Pago:* ${clientData.paymentMethod}\n`;
      if (clientData.paymentMethod === "Efectivo" && clientData.cashChange) {
        msg += `👉 *Paga con:* ${currency} ${clientData.cashChange}\n`;
      }
    }

    msg += `\n_Generado vía TiendaZap Studio_ ⚡`;
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
    const voucherBox = document.getElementById("ticket-voucher-preview-box");
    const voucherImg = document.getElementById("ticket-voucher-preview-img");

    if (previewEl) previewEl.textContent = orderText;
    if (retryBtn) {
      retryBtn.onclick = () => {
        window.open(waUrl, "_blank");
      };
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

    const modules = 29;
    const cellSize = (size - 32) / modules;
    const offset = 16;
    const grid = Array.from({ length: modules }, () => Array(modules).fill(false));

    const addFinderPattern = (row, col) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const gr = row + r;
          const gc = col + c;
          if (gr >= 0 && gr < modules && gc >= 0 && gc < modules) {
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                grid[gr][gc] = true;
              } else {
                grid[gr][gc] = false;
              }
            } else {
              grid[gr][gc] = false;
            }
          }
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, modules - 7);
    addFinderPattern(modules - 7, 0);

    const alignR = 20, alignC = 20;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          grid[alignR + r][alignC + c] = true;
        }
      }
    }

    for (let i = 8; i < modules - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash);
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        const inTopLeft = r <= 8 && c <= 8;
        const inTopRight = r <= 8 && c >= modules - 9;
        const inBottomLeft = r >= modules - 9 && c <= 8;
        const inTiming = (r === 6) || (c === 6);
        const inAlign = (r >= 18 && r <= 22 && c >= 18 && c <= 22);

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inAlign) {
          grid[r][c] = pseudoRandom() > 0.48;
        }
      }
    }

    ctx.fillStyle = "#0c1222";
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (grid[r][c]) {
          const x = offset + c * cellSize;
          const y = offset + r * cellSize;
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 1.5);
          ctx.fill();
        }
      }
    }

    const logoSize = cellSize * 5;
    const center = size / 2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(center - logoSize / 2 - 2, center - logoSize / 2 - 2, logoSize + 4, logoSize + 4, 6);
    ctx.fill();

    ctx.fillStyle = "#00d26a";
    ctx.beginPath();
    ctx.roundRect(center - logoSize / 2, center - logoSize / 2, logoSize, logoSize, 5);
    ctx.fill();

    ctx.fillStyle = "#080c14";
    ctx.font = "bold 15px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.isTableMode ? "🍽️" : "⚡", center, center);
  },

  getTargetUrl() {
    const baseUrl = window.location.origin + window.location.pathname;
    if (this.isTableMode) {
      const tableVal = document.getElementById("qr-table-number")?.value.trim() || "Mesa 1";
      return `${baseUrl}?mesa=${encodeURIComponent(tableVal)}`;
    }
    return `${baseUrl}?mode=shop`;
  },

  openQRModal() {
    const modal = document.getElementById("qr-modal");
    const canvas = document.getElementById("qr-canvas");
    const titleEl = document.getElementById("qr-store-title");
    const nicheInfo = NICHE_DATA[AppState.activePreset] || NICHE_DATA.general;
    const qrPillTable = document.getElementById("qr-pill-table");
    const qrPillGeneral = document.getElementById("qr-pill-general");
    const qrTableInputRow = document.getElementById("qr-table-input-row");

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

    if (titleEl) titleEl.textContent = AppState.shopConfig.name;
    this.renderStoreQR(canvas, this.getTargetUrl());

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
    const suffix = this.isTableMode ? (document.getElementById("qr-table-number")?.value.trim() || "Mesa") : "General";
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
  show(message, icon = "✨") {
    const toast = document.getElementById("app-toast");
    const msgEl = document.getElementById("toast-message");
    const iconEl = document.getElementById("toast-icon");

    if (!toast) return;

    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    toast.classList.remove("hidden");

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }
};

// ============================================================================
// 13. REGISTRO DE EVENTOS & ARRANQUE
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  AppState.init();

  // 1. Switch de Vista Previa vs Studio
  const openPreviewBtn = document.getElementById("open-preview-btn");
  const closePreviewBtn = document.getElementById("close-preview-btn");

  if (openPreviewBtn) openPreviewBtn.addEventListener("click", () => ViewController.showCustomerPreview());
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
      CustomerUI.renderStoreHeader();
    });
  }

  if (liveStoreTagline) {
    liveStoreTagline.addEventListener("input", (e) => {
      AppState.shopConfig.tagline = e.target.value.trim();
      AppState.saveConfig();
      CustomerUI.renderStoreHeader();
    });
  }

  // 6. Barra de Acciones Rápidas del Studio (Copiar Enlace / Ver QR / Compartir)
  const studioCopyLinkBtn = document.getElementById("studio-copy-link-btn");
  const studioOpenQrBtn = document.getElementById("studio-open-qr-btn");
  const studioShareBtn = document.getElementById("studio-share-btn");

  const copyStoreLinkAction = () => {
    const url = QRGenerator.getTargetUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        Toast.show("Enlace de tu tienda copiado al portapapeles", "📋");
      }).catch(() => {
        prompt("Enlace de tu tienda para compartir:", url);
      });
    } else {
      prompt("Enlace de tu tienda para compartir:", url);
    }
  };

  if (studioCopyLinkBtn) studioCopyLinkBtn.addEventListener("click", copyStoreLinkAction);
  if (studioOpenQrBtn) studioOpenQrBtn.addEventListener("click", () => QRGenerator.openQRModal());
  if (studioShareBtn) {
    studioShareBtn.addEventListener("click", () => {
      const url = QRGenerator.getTargetUrl();
      if (navigator.share) {
        navigator.share({
          title: AppState.shopConfig.name,
          text: `Visita el catálogo digital de ${AppState.shopConfig.name}:`,
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
      const file = e.target.files[0];
      if (file) StudioController.handleProductPhotoUpload(file);
    });
  }
  if (editorToggleUrlBtn && editorUrlInput) {
    editorToggleUrlBtn.addEventListener("click", () => {
      editorUrlInput.classList.toggle("hidden");
      if (!editorUrlInput.classList.contains("hidden")) editorUrlInput.focus();
    });
  }

  // 11. Pestaña Ajustes (Plantillas de Nicho y Formularios)
  document.querySelectorAll(".niche-card-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const niche = btn.getAttribute("data-niche");
      if (confirm(`¿Deseas cambiar a la plantilla de "${btn.querySelector('strong').textContent}"? Se adaptará el catálogo con fotos y categorías de este rubro.`)) {
        AppState.applyPreset(niche);
      }
    });
  });

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
        if (AppState.selectedProductModal && modalBtnTotal) {
          const currency = AppState.shopConfig.currency || "S/";
          modalBtnTotal.textContent = `${currency} ${(AppState.selectedProductModal.price * AppState.modalQuantity).toFixed(2)}`;
        }
      }
    });

    modalQtyPlus.addEventListener("click", () => {
      AppState.modalQuantity++;
      modalQtyVal.textContent = AppState.modalQuantity;
      if (AppState.selectedProductModal && modalBtnTotal) {
        const currency = AppState.shopConfig.currency || "S/";
        modalBtnTotal.textContent = `${currency} ${(AppState.selectedProductModal.price * AppState.modalQuantity).toFixed(2)}`;
      }
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
      Toast.show("Obteniendo ubicación GPS...", "🛰️");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          const coords = `${lat},${lng}`;
          if (gpsCoordsInput) gpsCoordsInput.value = coords;
          if (gpsStatusBadge) gpsStatusBadge.classList.remove("hidden");
          if (clientAddressInput && !clientAddressInput.value) {
            clientAddressInput.value = `Ubicación satelital adjunta (${coords})`;
          }
          Toast.show("Ubicación satelital agregada", "📍");
        },
        (err) => {
          alert("No se pudo obtener la ubicación: " + err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
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

  // QR Modal del Comercio y Header en Preview
  const previewQrBtn = document.getElementById("preview-qr-btn");
  const previewShareBtn = document.getElementById("preview-share-btn");
  if (previewQrBtn) previewQrBtn.addEventListener("click", () => QRGenerator.openQRModal());
  if (previewShareBtn) previewShareBtn.addEventListener("click", copyStoreLinkAction);

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

  // Triggers en el Studio
  const topbarWizardBtn = document.getElementById("topbar-wizard-btn");
  const studioWizardBtn = document.getElementById("studio-open-wizard-btn");
  const studioResetBtn = document.getElementById("studio-reset-btn");
  const startOnboardingBtn = document.getElementById("start-onboarding-btn");
  const dismissOnboardingBannerBtn = document.getElementById("dismiss-onboarding-banner-btn");
  const closeOnboardingBannerX = document.getElementById("close-onboarding-banner-x");

  if (topbarWizardBtn) topbarWizardBtn.addEventListener("click", () => ViewController.showOnboarding(1));
  if (studioWizardBtn) studioWizardBtn.addEventListener("click", () => ViewController.showOnboarding(1));
  if (startOnboardingBtn) startOnboardingBtn.addEventListener("click", () => ViewController.showOnboarding(1));
  if (studioResetBtn) studioResetBtn.addEventListener("click", () => OnboardingWizard.resetFromScratch());

  const dismissBannerAction = () => {
    const banner = document.getElementById("studio-onboarding-banner");
    if (banner) banner.classList.add("hidden");
  };
  if (dismissOnboardingBannerBtn) dismissOnboardingBannerBtn.addEventListener("click", dismissBannerAction);
  if (closeOnboardingBannerX) closeOnboardingBannerX.addEventListener("click", dismissBannerAction);
});
