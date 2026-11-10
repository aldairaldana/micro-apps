# ⚡ TiendaZap Studio — Micro-Catálogo Móvil de Pedidos & Cobros WhatsApp

> **TiendaZap Studio** es una aplicación web móvil de alto rendimiento creada para que emprendedores de TikTok, Instagram, Lives y comercio local gestionen su catálogo digital, reciban pagos por Yape/Plin y reciban pedidos estructurados directamente en su WhatsApp sin pagar comisiones ni suscripciones.

---

## 🌟 Características Principales

### 1. 🪄 Onboarding Guiado Estilo Apple (Pasos 0 al 5)
* **Flujo Integral Obligatorio de Configuración:**
  * **Paso 0 · Invitación Oficial:** Bienvenida interactiva tipo pase VIP para iniciar el alta del negocio.
  * **Paso 1 · Registro del Propietario:** Nombre, teléfono y **PIN de seguridad (4 a 6 dígitos)** para proteger el acceso al panel administrador en el teléfono.
  * **Paso 2 · Marca & Logo:** Nombre comercial, eslogan, selección de rubro (Comida, Tecnología, Ropa, Belleza, Tienda General) y carga de Logo/Portada optimizados con Canvas 2D.
  * **Paso 3 · WhatsApp & Cobros Yape / Plin:** Número de WhatsApp para recibir pedidos, cuenta de Yape/Plin (titular y celular) y foto de código QR de cobro.
  * **Paso 4 · Primer Producto:** Carga inicial con sugerencias inteligentes de categorías según el rubro elegido.
  * **Paso 5 · Credencial de Comerciante & Enlace Exclusivo:** Pase digital Apple Card con resumen de negocio y enlace de cliente listo para compartir.
* **Seguridad y Privacidad:** Protección por PIN en `showStudio()` para evitar que compradores en el dispositivo accedan al panel administrativo.
* **Modo Exclusivo de Comprador (`isCustomerOnlyMode`):** Oculta la barra de retorno al Studio cuando el cliente entra vía enlace directo (`?mode=shop`, `?mesa=...`, `?p=...`).

---

### 2. 🏷️ Gestor Dinámico de Categorías con Iconos
* **Modal de Gestión Integral:** Añade, renombra, reordena y elimina categorías en tiempo real.
* **Paleta de Emojis:** Selector visual rápido de 20+ emojis representativos por nicho comercial.
* **Reorganización en 1 Toque:** Flechas ⬆️ / ⬇️ para posicionar las categorías prioritarias al inicio del catálogo.
* **Eliminación Segura con Reasignación:** Al eliminar una sección con productos, se ofrece moverlos automáticamente a "General" o a otra sección sin perder inventario.

---

### 3. 🔲 Código QR 100% Real y Escaneable (Nivel H)
* **Codificación Real:** Matriz generada con la librería ultraligera `qrcode-generator` en nivel de corrección de errores **H (30% de tolerancia)**.
* **Diseño Apple Dark Mode:** Módulos oscuros redondeados sobre fondo blanco de alto contraste, con recuadro esmeralda central (`#00d26a`) e ícono del rubro (`🍽️` o `⚡`).
* **Soporte Bimodal:** Generación automática para modo vitrina general (`?mode=shop`) o por número de mesa para restaurantes (`?mesa=Mesa%201`).
* **Descarga PNG Inmediata:** Exporta el código en resolución óptima para imprimirlo en vitrinas, cartas o stickers.

---

### 4. 🛒 Variantes, Tallas y Suma Dinámica de Recargos
* **Cálculo Automático de Extras:** Detección de recargos en tallas y opciones (ej. *"Doble Medallón (+S/ 6)"*, *"60ml (+S/ 35)"*).
* **Reflejo en Tiempo Real:** El precio unitario y el botón de agregar se actualizan instantáneamente al cambiar de variante o cantidad en el modal de producto.
* **Exactitud en Carrito y WhatsApp:** El subtotal del carrito y el detalle estructurado de la orden para WhatsApp desglosan los recargos numéricos exactos de cada variante.

---

### 5. 📱 Sistema Integral de Pagos Yape / Plin & Web Share
* **Para el Vendedor:**
  * Configuración en la pestaña **Ajustes & Delivery ⚙️**.
  * Carga y vista previa del código QR con compresión Canvas 2D.
* **Para el Comprador:**
  * Cálculo exacto del monto total a pagar.
  * Botón para **Copiar número celular en 1 toque** (`📋 Copiar`).
  * Modal para ampliar el QR del comercio en pantalla completa (`🔍 Ver QR en Grande`).
  * Dropzone táctil para **subir captura del comprobante/voucher de pago** (`📸 Subir comprobante`).
  * **Web Share API (`📤 Compartir Comprobante + Pedido`):** En móviles compatibles, comparte la imagen del voucher y el texto del pedido juntos directamente a WhatsApp.

---

### 6. 🛡️ Sanitización XSS y Almacenamiento Protegido
* **Sanitización Global (`escapeHtml`):** Todos los textos de productos, categorías, notas y campos ingresados por el comerciante o el cliente son sanitizados contra inyecciones XSS y comillas conflictivas.
* **Event Listeners Desacoplados:** Eliminación de `onclick` inline frágiles en listas dinámicas, utilizando atributos `data-*` limpios.
* **Protección contra Desbordamiento de `localStorage`:** Método `safeSetItem` con detección de `QuotaExceededError` y advertencia al usuario.
* **Compresión Gráfica Optimizada:** Parámetros por defecto de compresión en Canvas a 640px y 0.78 de calidad para mantener cada imagen por debajo de 50 KB.

---

## 🛠️ Stack Tecnológico
* **Frontend:** HTML5 Semántico, Vanilla CSS (Apple Design Tokens, Glassmorphism, CSS Grid & Flexbox) y Vanilla JavaScript moderno (ES6+).
* **Códigos QR:** `qrcode-generator` (CDN jsDelivr, Nivel H 30%).
* **Compresión Gráfica:** `HTML5 Canvas 2D` para optimizar imágenes y comprobantes a < 50 KB.
* **Integración WhatsApp:** Deep linking nativo (`wa.me`) con soporte complementario de `navigator.share` en dispositivos móviles.
* **Zero Heavy Frameworks:** Carga ultrarrápida en menos de 0.4s en cualquier conexión 3G/4G/5G.

---

## 🚀 Cómo Ejecutar Localmente o en Móvil

1. **Iniciar servidor local:**
   ```bash
   python -m http.server 3000
   ```
2. **Abrir en navegador:**
   * **Modo Administrador (Studio):** `http://localhost:3000`
   * **Modo Catálogo (Cliente):** `http://localhost:3000/?mode=shop`
   * **Modo Mesa (Restaurante):** `http://localhost:3000/?mesa=Mesa%205`
   * **Reinicio Limpio:** `http://localhost:3000/?nuevo=1`
