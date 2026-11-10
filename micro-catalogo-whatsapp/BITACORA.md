# 📋 BITÁCORA — TiendaZap Studio (Micro-Catálogo WhatsApp)

> **Documento de Continuidad Operativa**  
> *Fecha:* Noviembre 2026  
> *Repositorio:* [aldairaldana/micro-catalogo-whatsapp](https://github.com/aldairaldana/micro-catalogo-whatsapp)  
> *Despliegue GitHub Pages:* [aldairaldana.github.io/micro-catalogo-whatsapp](https://aldairaldana.github.io/micro-catalogo-whatsapp/)  

---

## 🔒 Versión 1.3 — URLs Personalizadas /nombre-tienda, Despliegue Cloudflare & Sello Oficial (Noviembre 2026)

### 1. URLs Amigables y Personalizadas con Slugs Oficiales
- **Generación Automática de Slugs (`slugifyStoreName`):** Convierte nombres como "Flores Vanesa" en `flores-vanesa` (minúsculas, normalización de tildes y diacríticos, guiones limpios).
- **Vista Previa en Vivo:** Integrado en el Paso 2 de Onboarding (`#apple-slug-preview-box`) y en la Pestaña Ajustes (`#settings-store-slug`), permitiendo al comerciante editar y personalizar su slug oficial con el prefijo de dominio `tiendazap.pages.dev/`.

### 2. Soporte de Enrutamiento SPA 100% Gratuito en Cloudflare Pages y GitHub Pages
- **Archivo `_redirects`:** Regla `/* /index.html 200` para que Cloudflare Pages resuelva cualquier subruta limpia (`/flores-vanesa`) hacia `index.html` sin error 404.
- **Archivo `404.html`:** Redireccionador de SPA para GitHub Pages que captura la ruta no encontrada y la reenvía a `index.html?tienda=<slug>`, preservando parámetros de consulta y fragmentos `#d=`.

### 3. Sello de Seguridad y Confianza Oficial para el Comprador
- **Píldora Verificada en Catálogo:** `#store-verified-seal` con ícono de candado verde `🔒 Enlace Oficial Verificado · /[storeSlug]`.
- **Título de Navegador y Vista Previa:** `document.title` dinámico formateado como `✅ ${shopConfig.name} — Catálogo Oficial & Pedidos por WhatsApp`.
- **Encabezado en Mensajes WhatsApp:** El generador de pedidos y el botón compartir incorporan el encabezado formal `🛍️ *Catálogo Oficial Verificado de [Nombre]*` y `🔒 Enlace seguro: [URL]`.

### 4. Sincronización Gratuita sin Servidor via Hash Fragment (`#d=...`)
- **Transporte de Catálogo en Fragmento Hash:** Se migró el transporte comprimido de catálogo por defecto a `#d=${compressedData}` (manteniendo retrocompatibilidad con `?c=...`), asegurando que las URLs en la barra de direcciones sean limpias y no envíen datos pesados en los headers HTTP al servidor.
- **Protección de Catálogo Local (`isViewingRemoteCatalog`):** Cuando un usuario que también es comerciante abre la tienda de otro comerciante, el catálogo remoto solo se carga en memoria; `saveConfig()` y `saveProducts()` ignoran el guardado para evitar sobrescribir su propio negocio local.

### 5. Configuración de Marca Centralizada (`APP_BRAND`)
- Configuración global `APP_BRAND = { name: "TiendaZap", suffix: "Studio", domainHint: "tiendazap.pages.dev" }` para unificación de nombres de dominio sugeridos y textos de marca.

### 6. Preset Ampliado "Flores & Joyas Vanesa"
- Adaptado para florerías, regalos sorpresa y joyería fina con slug `flores-vanesa`, variantes dinámicas de arreglo/ocasión y productos preconfigurados con precios en Soles.

---

## 🚀 Versión 1.2 — Edición Emprendedores Perú: Videos, Multi-Rubro y Compartición Gratuita (Noviembre 2026)

### 1. Reproductor de Video + Foto Orgánico (Estilo Reels / TikTok)
- **Soporte Híbrido en Editor y Onboarding:** Entrada dual para subir clips cortos desde galería/cámara o enlazar videos externos (Instagram Reels, TikTok, YouTube Shorts, o video directo `.mp4`/`.webm`).
- **Badge Flotante en Catálogo:** Los productos con video muestran automáticamente la píldora `🎥 Video` con efecto glassmorphism en la esquina superior del producto.
- **Conmutador Foto / Video en Modal de Detalle:** Pestañas interactivas para alternar entre fotografía en alta resolución y reproductor `<video controls playsinline muted loop>` o `<iframe>` embebido responsivo de YouTube Shorts, así como botones directos de redirección para Reels y TikTok.

### 2. 7 Rubros Comerciales y Variantes Dinámicas Adaptativas
- **Ampliación de `BUSINESS_PRESETS` y `NICHE_DATA`:** Plantillas listas con precios en Soles (S/), categorías auténticas y variantes reales para:
  - 👟 **Zapatillas & Calzado (sneakers):** "Talla (EUR / US)" y "Color / Modelo".
  - ✨ **Perfumes & Belleza (beauty):** "Presentación / Mililitros" (Decants 10ml, Frascos) y "Aroma / Familia".
  - ⌚ **Relojes & Joyas (watches):** "Modelo / Tamaño de Caja" y "Color / Correa".
  - 👖 **Ropa & Moda (fashion):** "Talla (S, M, L o 28, 30, 32)" y "Color / Tela".
  - 🍰 **Postres & Comida (food):** "Tamaño / Porciones" y "Sabor / Relleno".
  - 💻 **Tecnología & Gadgets (tech):** "Variantes / Licencia" y "Color / Tipo".
  - 🛍️ **Tienda General (general):** "Opciones" y "Modelo".
- **Etiquetas Dinámicas en Tiempo Real:** El editor `#studio-product-form` y el modal de compra `#product-detail-modal` actualizan sus rótulos contextuales (`#editor-sizes-label`, `#editor-colors-label`, `#detail-sizes-label`, `#detail-colors-label`) automáticamente según el rubro comercial activo.

### 3. Compartición Universal Gratuita sin Servidor (LZ-String & IndexedDB)
- **Compresión de Catálogo en URL:** Integración de la librería `lz-string` (1.5.0) para serializar y comprimir el catálogo completo en el parámetro `?mode=shop&c=...`. Cualquier comprador abre el link en su navegador y visualiza los productos y configuración del negocio inmediatamente con S/ 0.00 en infraestructura.
- **Sincronización con Google Sheets:** Compatibilidad con parámetro `?mode=shop&sheet=...` para cargar catálogos desde hojas de cálculo publicadas como CSV.
- **Almacenamiento Local `MediaStore` (IndexedDB):** Wrapper asíncrono para guardar clips de video locales y fotos de alta resolución en el navegador del vendedor sin riesgo de sobrepasar la cuota de `localStorage`.

### 4. Generación de QR Real Adaptativo
- Selección inteligente de nivel de corrección de error (`M` y `L`) en `QRGenerator.renderStoreQR()` para garantizar la generación de códigos QR de alta densidad que contengan la URL comprimida del catálogo completo o la hoja de cálculo.

---

## 🚀 Versión 1.1 — Corrección Integral, Seguridad y Optimización (Noviembre 2026)

### 1. Código QR 100% Real y Escaneable
- Integración de `qrcode-generator` vía CDN jsDelivr con nivel de corrección de errores **H (30% de redundancia)**.
- Reemplazo del generador pseudoaleatorio por codificación matricial estricta sobre Canvas 2D.
- Módulos redondeados de alta legibilidad, distintivo central en verde esmeralda (`#00d26a`) con ícono contextual (`🍽️` para comida/mesas y `⚡` para otros rubros).
- Fallback visual limpio en Canvas ante falta de conexión a internet.

### 2. Privacidad de Compradores & Protección por PIN
- Adición de `isCustomerOnlyMode`: los compradores con enlace directo (`?mode=shop`, `?mesa=...`, `?p=...`) no ven la barra `.preview-mode-bar` ni pueden saltar al Studio administrativo.
- Validación de **PIN de Seguridad (4 a 6 dígitos)** en `ViewController.showStudio()` con sesión `tiendazap_pin_unlocked` para proteger el panel de administración en el dispositivo móvil.

### 3. Botón de Estado del Studio
- Restauración del estilo Apple (`.apple-status-pill.open` y `.apple-status-pill.closed`) en `StudioController.renderTopStatus()`.
- Soporte visual con borde, fondo y punto luminoso en color rojo (`#ff453a`) cuando la vitrina está cerrada.

### 4. Recargos Numéricos en Variantes y Tallas
- Creación de helpers `CartController.getVariantExtraPrice(sizeStr, colorStr)` y `CartController.getUnitPrice(product, size, color)` con regex para capturar recargos (`+S/ X`, `+$X`, etc.).
- Suma instantánea en el botón `#modal-button-total` y `#detail-price` al interactuar con chips o contador de cantidad.
- Aplicación de recargos en `CartController.getSubtotal()`, `CustomerUI.renderCartItemsList()` y el desglose de texto de `WhatsAppOrder.buildOrderMessage()`.

### 5. Flujo de Comprobante Yape/Plin & Web Share API
- Texto informativo transparente en el checkout sobre el envío del comprobante al abrir WhatsApp.
- Almacenamiento de la referencia original del archivo (`AppState.buyerVoucherFile`).
- Botón adicional `📤 Compartir Comprobante + Pedido` en el ticket modal mediante `navigator.share` en móviles Android/iOS compatibles.

### 6. Sanitización Anti-XSS y Eventos Desacoplados
- Función global `escapeHtml(str)` para sanear comillas, `<`, `>` y ampersands.
- Reemplazo de atributos `onclick` con concatenación de cadenas en `renderCategoryManagerList()` y `renderProductsList()` por atributos `data-*` y listeners `addEventListener` limpios.

### 7. Almacenamiento Protegido y Limpieza de Reset
- Adición de `AppState.safeSetItem()` con detección de `QuotaExceededError`.
- `OnboardingWizard.resetFromScratch()` ahora limpia `tiendazap_categories`, reinicia `AppState.categories = []` y borra el desbloqueo del PIN de sesión.
- Parámetros por defecto de `ImageOptimizer.compressImage()` ajustados a 640px y 0.78 de calidad.

### 8. Depuración de CSS Huérfano
- Eliminación de selectores obsoletos de versiones iniciales (`.onboarding-overlay`, `.ob-niche-grid`, `.admin-topbar`, `.btn-skip-onboarding`, `.onboarding-banner-*`), reduciendo casi 500 líneas de código muerto en `style.css`.

---

## 🌟 Versión 1.0 — Onboarding Guiado Apple & Gestor de Categorías (Octubre 2026)

### 1. Wizard de Onboarding Guiado (Paso a Paso)
- **Paso 0:** Invitación oficial y bienvenida VIP.
- **Paso 1:** Nombre, contacto y PIN de seguridad.
- **Paso 2:** Nombre comercial, eslogan, rubro (Tecnología, Comida, Ropa, Belleza, Tienda General) y carga de Logo/Portada.
- **Paso 3:** WhatsApp y cobros Yape/Plin (Celular, titular y foto QR).
- **Paso 4:** Primer producto con categorías sugeridas por nicho.
- **Paso 5:** Credencial de Comerciante Apple Card Pass con enlace directo.
- **Parámetro Demo:** `?nuevo=1` o `?reset=1` para reiniciar el wizard desde cero.

### 2. Gestor de Categorías
- Creación rápida con selector de emojis y barra de filtros deslizables.
- Reordenamiento con ⬆️ / ⬇️ y reasignación en cascada de productos huérfanos.
