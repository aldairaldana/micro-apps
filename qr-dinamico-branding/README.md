# 🔲 QRCraft — Generador de Códigos QR Dinámicos y con Marca

> **Concepto:** Una micro app que genera códigos QR de diseño premium con logos, colores y marcos de llamada a la acción ("Escanea para Menú", "Conéctate al Wi-Fi", "Síguenos"). Incluye QR dinámicos reales (puedes cambiar el link de destino sin tener que volver a imprimir el código).

---

## 🎯 1. Problema que Resuelve (La Gran Trampa de los QR en Internet)
* El 95% de los generadores de QR que aparecen en Google engañan al usuario:
  * Te dejan crear el QR "gratis", el restaurante o tienda imprime 500 cartas o stickers...
  * A los 14 días el QR deja de funcionar y redirige a una pantalla de pago que exige $25 o $35 **al mes** para reactivarlo.
* La gente está harta de suscripciones abusivas por un simple código QR.

---

## 💡 2. Propuesta de Valor
* **Generación honesta y transparente:**
  * **QR Estáticos (Gratis para siempre):** Wi-Fi, vCard de contactos, texto, enlaces directos. Nunca vencen, sin letra chica.
  * **QR Dinámicos (El valor de pago):** Un enlace intermedio que permite al dueño del restaurante cambiar la URL del menú en cualquier momento sin reimprimir los stickers de las mesas.
* **Diseño y Personalización de Alto Nivel:**
  * Incrustar el logo de la empresa en el centro en alta resolución.
  * Paleta de colores de la marca, bordes redondeados y patrones modernos.
  * Marcos atractivos con texto: *"Escanea aquí"*, *"Pide por WhatsApp"*, *"Califícanos en Google"*.
* **Descarga en formatos de imprenta:** PNG de alta resolución y SVG vectorial para impresiones en gigantografías o letreros.

---

## 💰 3. Modelo de Monetización
* **Gratuito:** QR Estáticos ilimitados en formato PNG.
* **Pago Único Accesible ($5 USD / S/ 19 por QR Dinámico de por vida):**
  * Sin suscripción mensual.
  * Edición ilimitada del destino del enlace.
  * Conteo de escaneos (cuánta gente escaneó el código cada día).
* **Pack Emprendedor / Agencia ($19 USD pago único):**
  * Hasta 10 códigos QR dinámicos con analítica y descarga en SVG vectorial.

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, CSS moderno y JavaScript.
* **Bibliotecas Clave:** `qr-code-styling` (biblioteca líder en renderizado de QR modernos en SVG y Canvas con soporte de logos y estilos visuales).
* **Backend ligero (para QR dinámicos):** Node.js / Cloudflare Workers o Supabase para la redirección dinámica (`qr.app/r/codigo123` ➔ redirecciona al destino configurado).
