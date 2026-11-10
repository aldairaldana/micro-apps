# 📋 BITÁCORA — TiendaZap Studio (Micro-Catálogo WhatsApp)

> **Documento de Continuidad Operativa**  
> *Fecha:* Noviembre 2026  
> *Repositorio:* [aldairaldana/micro-catalogo-whatsapp](https://github.com/aldairaldana/micro-catalogo-whatsapp)  
> *Despliegue GitHub Pages:* [aldairaldana.github.io/micro-catalogo-whatsapp](https://aldairaldana.github.io/micro-catalogo-whatsapp/)  

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
