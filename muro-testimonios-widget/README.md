# ⭐ SocialProof Widget — Generador de Muro de Testimonios

> **Concepto:** Una micro app que convierte capturas de pantalla de WhatsApp, comentarios de Instagram, tweets y reseñas en hermosas tarjetas de testimonios listas para embeber en cualquier web o descargar como imagen para redes.

---

## 🎯 1. Problema que Resuelve
* Los emprendedores y freelancers reciben mensajes genuinos de clientes satisfechos por chat, pero pegarlos como capturas cuadradas en sus sitios web se ve descuidado y poco profesional.
* Diseñar testimonios bonitos en Canva toma tiempo y los plugins de reseñas para WordPress o Shopify suelen ser costosos ($15 a $30 al mes).

---

## 💡 2. Propuesta de Valor
* **Creación en 30 segundos:** Pegas el texto de la reseña, el nombre del cliente, su foto (o avatar automático) y estrellas de calificación (1 a 5).
* **Múltiples formatos de salida:**
  * **Widget HTML/JS Embebible:** Un fragmento de código de 1 línea para incrustar en Carrd, Webflow, WordPress, Shopify o código personalizado.
  * **Exportador de Imagen HD:** Descarga la tarjeta de testimonio como imagen limpia con fondo degradado para postear en historias de Instagram o LinkedIn.
* **Diseños modernos:** Estilos tipo tweet, mensaje de chat de burbuja, tarjeta de cristal (*glassmorphism*) o minimalista en dark mode.

---

## 💰 3. Modelo de Monetización
* **Gratuito:** Hasta 3 tarjetas de testimonios con un pie de página pequeño *"Creado con SocialProof"*.
* **Pago Único ($9 USD / S/ 35) o Plan Pro ($4/mes):**
  * Sin marca de agua.
  * Testimonios ilimitados y carrusel deslizable interactivo.
  * Personalización de fuentes, colores corporativos y temas oscuros.
  * Formulario público para que tus clientes te dejen la reseña directamente con su foto.

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, CSS moderno y JavaScript Vanilla o React/Vite.
* **Descarga de imagen:** Biblioteca `html2canvas` para transformar el DOM en imagen PNG de alta resolución.
* **Embebido:** Script liviano `<script src=".../widget.js" data-id="..."></script>`.
