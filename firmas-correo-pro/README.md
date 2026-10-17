# ✉️ Signatify — Creador de Firmas de Correo Profesionales

> **Concepto:** Una micro app interactiva que permite a profesionales y empresas crear firmas de correo electrónico con aspecto corporativo y moderno en menos de 2 minutos, compatibles con Gmail, Outlook, Apple Mail y Thunderbird sin descuadrarse en celulares.

---

## 🎯 1. Problema que Resuelve
* Diseñar una firma HTML para correo que funcione bien en todos los clientes de email es una pesadilla técnica:
  * Los emails no admiten CSS moderno; requieren tablas anidadas complejas (`<table>`) y estilos en línea (`style="..."`).
  * Si un usuario copia una imagen o diseño de Canva, muchos clientes de correo la bloquean como spam o la muestran borrosa en pantallas móviles y retina.
  * La mayoría de herramientas en internet exigen suscripciones costosas de $12 a $20 mensuales por usuario para algo que solo necesitas configurar una vez.

---

## 💡 2. Propuesta de Valor
* **Editor Visual Intuitivo:**
  * **Datos Personales:** Nombre, cargo, empresa, teléfono, email, sitio web.
  * **Identidad Visual:** Foto redonda/cuadrada o logo de empresa (alojado en la nube para que nunca falle).
  * **Redes Sociales:** Iconos elegantes con enlaces directos (LinkedIn, WhatsApp, Instagram, X/Twitter, GitHub).
  * **Llamadas a la Acción (CTA):** Botón estilizado tipo *"Reserva una reunión conmigo"* o *"Ver catálogo"*.
* **Botón Mágico "Copiar para Gmail / Outlook":**
  * Con 1 solo clic, la app copia el HTML renderizado al portapapeles. El usuario solo entra a la configuración de su correo, pega (`Ctrl + V`) y listo.

---

## 💰 3. Modelo de Monetización
* **Gratuito:** 2 plantillas esenciales con un pequeño crédito sutil en la firma (*"Creado con Signatify"*).
* **Pago Único Personal ($7 USD / S/ 25):**
  * Sin marca de agua.
  * Acceso a 10+ plantillas premium (estilos ejecutivos, creativos, minimalistas).
  * Banners promocionales y avisos legales de confidencialidad (*disclaimer*).
* **Pack Empresas / Equipos ($19 USD pago único):**
  * Generador de firmas en lote (subes un Excel con 10 o 20 empleados y genera la firma de todo el equipo con la misma identidad corporativa).

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML5, CSS y JavaScript Vanilla (100% responsivo).
* **Renderizado:** Generador de plantillas HTML retrocompatibles basadas en tablas (`table-layout`), compatibles al 100% con Microsoft Outlook y Gmail.
* **Almacenamiento de imágenes:** Imgur API o Cloudinary para hosting gratuito y persistente de logos y avatares.
