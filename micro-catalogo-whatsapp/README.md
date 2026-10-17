# ⚡ TiendaZap Studio — Micro-Catálogo Móvil de Pedidos & Cobros WhatsApp

> **TiendaZap Studio** es una aplicación web móvil de alto rendimiento creada para que emprendedores de TikTok, Instagram, Lives y comercio local gestionen su catálogo digital, reciban pagos por Yape/Plin y reciban pedidos estructurados directamente en su WhatsApp sin pagar comisiones ni suscripciones.

---

## 🌟 Características Principales

### 1. 🪄 Asistente Guiado Paso a Paso (Onboarding Wizard)
* **Configuración en 4 Pasos:**
  1. **Datos de tu Negocio:** Nombre, eslogan, WhatsApp oficial y selección de rubro con plantillas predefinidas (Comida, Ropa, Belleza, Gadgets).
  2. **Identidad Visual:** Carga de Logo/Avatar y Foto de Portada con compresión automática.
  3. **Cobros con Yape / Plin:** Configuración del número celular, titular de cuenta y foto del código QR.
  4. **Primer Producto:** Carga de foto, nombre, precio y categoría.
* **100% Omitible:** Botón omnipresente **"Omitir por ahora"** para que el comerciante pueda empezar a explorar de inmediato sin bloqueos.
* **Banner y Acceso Rápido:** Acceso directo desde la cabecera del Studio con el botón **`🪄 Asistente Guiado`** en cualquier momento.

### 2. 📱 Sistema Integral de Pagos Yape / Plin
* **Para el Vendedor:**
  * Tarjeta de configuración en la pestaña **Ajustes & Delivery ⚙️**.
  * Switch para activar/desactivar pagos directos con Yape/Plin.
  * Carga y vista previa de la foto del código QR con compresión Canvas 2D.
* **Para el Comprador:**
  * Monto exacto calculado en el checkout.
  * Botón para **Copiar número celular en 1 toque** (`📋 Copiar`).
  * Vista previa del código QR del vendedor con modal para **ampliar en pantalla completa** (`🔍 Ver QR en Grande`).
  * Dropzone táctil para **subir captura del comprobante/voucher de pago** (`📸 Subir comprobante`).
* **Mensaje de WhatsApp Enriquecido:**
  * El pedido se envía al WhatsApp del vendedor con el desglose exacto de productos, envío, método de pago y estado de la constancia:
    ```text
    *NUEVO PEDIDO — BURGERZAP & GRILL*
    📅 Fecha: 15/10/2026, 11:30
    ━━━━━━━━━━━━━━━━━━━━━
    👤 DATOS DEL CLIENTE:
    • Nombre: Carlos Quispe
    • Teléfono: 912345678
    • Modalidad: 🛵 Envío a Domicilio
    • Dirección: Av. Principal 456
    
    📦 DETALLE DE PRODUCTOS:
    1. 2x [COD-1] Smash Burger Doble (Talla: Grande) — S/ 38.00
    2. 1x [COD-3] Alitas BBQ Crispy — S/ 16.00
    
    ━━━━━━━━━━━━━━━━━━━━━
    💳 Subtotal: S/ 54.00
    🛵 Envío: S/ 5.00
    💰 TOTAL A PAGAR: S/ 59.00
    ━━━━━━━━━━━━━━━━━━━━━
    💵 Método de Pago: 📱 Yape / Plin
    • Número de Yape: 987 654 321
    • Titular: Juan Pérez
    📎 COMPROBANTE: ✅ Adjuntado por el cliente
    
    Generado vía TiendaZap Studio ⚡
    ```
  * Pantalla de **Ticket Digital** post-orden con previsualización del comprobante adjuntado.

### 3. 🎨 Diseño Dark Mode Ergonómico Móvil
* Paleta moderna en tonos oscuros (`#090d16`), acentos en verde esmeralda (`#00d26a`) y morado Yape (`#7c3aed`).
* Áreas táctiles cómodas para operar con una sola mano desde el celular (mínimo 44px).
* **Edición de Precios en 1 Toque:** Píldoras rápidas directas en la lista de productos sin necesidad de abrir formularios complejos.
* **Switch Rápido de Estado:** Botón instantáneo `🟢 Abierto` / `🔴 Cerrado`.
* **Alternancia en Tiempo Real:** Botón superior `👁️ Vista Previa` para alternar entre el panel de control del vendedor y el catálogo del cliente.

---

## 🛠️ Stack Tecnológico
* **Frontend:** HTML5 Semántico, Vanilla CSS (Design Tokens, Glassmorphism, CSS Grid & Flexbox) y Vanilla JavaScript moderno (ES6+).
* **Compresión Gráfica:** `HTML5 Canvas 2D` para optimizar imágenes y comprobantes a < 60 KB, garantizando almacenamiento local en `localStorage` sin límites de cuota.
* **Integración WhatsApp:** Deep linking nativo con codificación URI (`https://wa.me/{phone}?text={encoded_msg}`).
* **Zero Dependencies:** Sin dependencias externas pesadas, sin frameworks lentos, carga en menos de 0.5s.

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
3. **Compartir en Vivo a Móviles (Túnel Cloudflare):**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
