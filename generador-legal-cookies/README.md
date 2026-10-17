# ⚖️ LegalFast — Generador de Políticas Legales y Cookies Express

> **Concepto:** Una micro app que permite a pequeños negocios, creadores y tiendas online generar sus documentos legales esenciales (Políticas de Privacidad, Términos y Condiciones, y Aviso de Cookies) en español en menos de 3 minutos, junto a un banner de cookies listo para pegar.

---

## 🎯 1. Problema que Resuelve
* Todo sitio web o tienda virtual necesita legalmente informar sobre privacidad, recolección de datos y cookies para evitar multas de organismos de protección al consumidor y cumplir con pasarelas de pago (Stripe, Mercado Pago o Culqi exigen estos enlaces antes de aprobar una cuenta).
* Contratar a un abogado especialista cuesta cientos de dólares, y los generadores en internet suelen estar en inglés, exigen suscripciones costosas en dólares o generan textos desactualizados.

---

## 💡 2. Propuesta de Valor
* **Cuestionario en Lenguaje Simple (5 Preguntas):**
  1. ¿Cuál es el nombre de tu sitio/empresa y país de operación?
  2. ¿Qué datos recolectas de los usuarios? (Nombres, emails, números de teléfono, datos de pago).
  3. ¿Utilizas herramientas de análisis o píxeles de publicidad? (Google Analytics, Meta Pixel).
  4. ¿Vendes productos físicos, productos digitales o servicios?
  5. ¿Cuál es la política de reembolsos y devoluciones de tu negocio?
* **Documentos Generados al Instante:**
  * **Política de Privacidad** adaptada a normativas de protección de datos personales.
  * **Términos y Condiciones** de uso de la web/tienda.
  * **Política y Banner de Cookies en JavaScript:** Un script liviano de 1 línea que añade el banner flotante de aceptación de cookies a cualquier web.

---

## 💰 3. Modelo de Monetización
* **Gratuito:** Generación y copia en texto plano de la Política de Privacidad básica.
* **Descarga Completa / Pack Legal ($9 USD / S/ 35 pago único):**
  * Descarga en formatos Word (`.docx`), PDF y HTML listo para incrustar.
  * Términos y Condiciones completos + Política de Reembolsos.
  * Código del Banner de Cookies personalizable (colores y textos a medida).

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, CSS moderno y JavaScript Vanilla.
* **Plantillas Legales:** Motor de interpolación de variables en JavaScript con cláusulas modulares validadas.
* **Exportador:** Biblioteca `docx` o `html-to-pdf` en el navegador para descarga inmediata.
