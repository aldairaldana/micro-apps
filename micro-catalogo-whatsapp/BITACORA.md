# 📋 BITÁCORA — TiendaZap Studio (Micro-Catálogo WhatsApp)

> **Documento de Continuidad Operativa**  
> *Fecha:* Octubre 2026  
> *Repositorio:* [aldairaldana/micro-catalogo-whatsapp](https://github.com/aldairaldana/micro-catalogo-whatsapp)  
> *Despliegue GitHub Pages:* [aldairaldana.github.io/micro-catalogo-whatsapp](https://aldairaldana.github.io/micro-catalogo-whatsapp/)  

---

## 🚀 Estado Actual (v1.0 - 100% Funcional)

### 1. Wizard de Onboarding Guiado (Paso a Paso)
- **Paso 0:** Pantalla de bienvenida con opción de inicio limpio o salto al Studio.
- **Paso 1:** Nombre, eslogan, WhatsApp oficial y selección de rubro (Tecnología, Comida, Ropa, Belleza, Tienda General).
- **Paso 2:** Logo/Avatar y Banner de portada con compresión Canvas 2D (< 60 KB).
- **Paso 3:** Configuración de Yape / Plin (Celular, titular y foto QR).
- **Paso 4:** Primer producto con categorías sugeridas automáticas según el rubro.
- **Parámetro Demo:** `?nuevo=1` o `?reset=1` para reiniciar el wizard y hacer pruebas desde cero.

### 2. Lógica de Negocio por Nicho
- Se suprimió la opción "En Mesa" para negocios digitales o de tecnología, reemplazada por `⚡ Envío Digital (Por WhatsApp)` a costo S/ 0.00.
- La opción de salón/mesa se preserva exclusivamente para rubros gastronómicos/restaurantes.

### 3. Studio Admin & Catálogo de Clientes
- Vistas operativas: **Mis Productos**, **Ajustes & Delivery**, **Nube & Respaldo**.
- Carrito de compras móvil interactivo con selector de entrega y dropzone de comprobante Yape/Plin.
- Generación de mensaje estructurado a WhatsApp (`wa.me`) con emoji, detalle de productos, totales y constancia de comprobante adjunto.

### 4. Git & Despliegues
- Repositorio: `https://github.com/aldairaldana/micro-catalogo-whatsapp`
- Rama: `main`
- GitHub Pages: `https://aldairaldana.github.io/micro-catalogo-whatsapp/`
- Demo Móvil Limpio: `https://aldairaldana.github.io/micro-catalogo-whatsapp/?nuevo=1`
