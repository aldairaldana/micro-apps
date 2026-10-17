# 🎙️ AudioTask — Convertidor de Audios de WhatsApp a Tareas con IA

> **Concepto:** Una micro app y bot que transforma notas de voz largas y desordenadas de WhatsApp o reuniones en resúmenes ejecutivos de 2 líneas y listas claras de tareas con responsables y fechas límite.

---

## 🎯 1. Problema que Resuelve
* Clientes, socios o jefes envían audios de 3 a 7 minutos por WhatsApp llenos de pausas, rodeos y explicaciones caóticas:
  * *"Hola mira... estaba pensando en lo del diseño, pero antes acuérdate de llamar a Juan el martes a las 10 y mandar la cotización con el 10% de descuento antes de las 3... y avísame..."*
* El receptor pierde minutos enteros escuchando el audio varias veces para no olvidar detalles importantes o tareas críticas.

---

## 💡 2. Propuesta de Valor
* **Método de uso rápido:**
  * **Opción Web:** Arrastras el archivo `.ogg`, `.mp3` o `.m4a` descargado de WhatsApp.
  * **Opción Bot:** Reenvías el audio directamente a un contacto de WhatsApp o Telegram del bot.
* **Resultado Estructurado en 5 segundos:**
  1. 📌 **Resumen Ejecutivo (2 líneas):** De qué trata el audio en esencia.
  2. ✅ **Lista de Acciones / Tareas Clave:**
     - [ ] Llamar a Juan el martes a las 10:00 AM.
     - [ ] Enviar cotización con 10% de descuento antes de las 3:00 PM.
  3. ⚠️ **Alertas / Fechas Límite Detectadas:** Plazos importantes o condiciones mencionadas.
* **Botón de 1 Clic:** Copiar texto listo para WhatsApp o exportar directamente a Trello, Notion o Google Keep.

---

## 💰 3. Modelo de Monetización
* **Uso Gratuito:** 3 transcripciones diarias de hasta 2 minutos de duración.
* **Paquete de Créditos (Pay as you go):**
  * $3 USD (S/ 12) por 50 créditos de audios sin vencimiento.
* **Plan Pro Mensual ($5 USD / S/ 19 al mes):**
  * Audios ilimitados de hasta 15 minutos de duración.
  * Respuestas automáticas con IA (ej. *"Generar borrador de respuesta educada confirmando las tareas"*).
  * Integración automática con Notion y Google Calendar.

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, Tailwind CSS y JavaScript.
* **Transcripción IA:** OpenAI Whisper API o Gemini Flash 1.5 / 2.0 (Gemini procesa audio directamente a costo casi cero y a una velocidad asombrosa).
* **Backend:** Node.js o Python con FastAPI para recibir el audio y pasar el prompt de estructuración a la IA.
