# ✂️ CitaYa — Reserva de Citas y Anticipos para Barberías y Salones

> **Concepto:** Una micro app de reservas ultrarrápida para barberos, estilistas, manicuristas y tatuadores. El profesional publica su enlace en Instagram/WhatsApp, el cliente elige día y hora disponible, y asegura su turno pagando un anticipo (seña).

---

## 🎯 1. El Problema que Resuelve (El "Dolor de Cabeza" del Emprendedor)
1. **Los "No-Shows" (Clientes fantasmas):** El mayor problema de una peluquería o salón es cuando un cliente pide cita por WhatsApp, el profesional rechaza a otros clientes para guardarle el turno, y el cliente nunca llega. **El profesional pierde tiempo y dinero.**
2. **Pérdida de tiempo en chats:** El peluquero está con las manos ocupadas cortando cabello o haciendo uñas y no puede contestar WhatsApps de: *"¿Tienes turno hoy a las 5?" "No, solo a las 6" "¿Y mañana?"*.
3. **Desorden de agenda:** Agendas de papel o notas desordenadas donde se superponen citas.

---

## 💡 2. La Solución Mejorada (Propuesta de Valor)
* **Perfil simple para el profesional:**
  * Define sus horarios de atención semanales (ej. Lunes de 2:00 PM a 8:00 PM, Martes a Sábado de 10:00 AM a 8:00 PM, Domingo bloqueado).
  * Lista sus servicios con duración y precio:
    * *Corte Clásico (30 min — S/ 25)*
    * *Corte + Barba (45 min — S/ 40)*
    * *Uñas Acrílicas (60 min — S/ 60)*
  * Enlace personalizado para su biografía de Instagram o estado de WhatsApp (ej: `citaya.pe/carlosbarber`).

* **Experiencia para el cliente (Menos de 60 segundos):**
  1. Abre el enlace en su celular.
  2. Selecciona el servicio.
  3. Ve en tiempo real solo los horarios que realmente están libres.
  4. Ingresa su nombre y teléfono.
  5. **Paga la seña de reserva (ej. S/ 10 vía Yape / Plin / Tarjeta)** para confirmar la cita.
  6. Recibe su ticket de cita con botón de ubicación en Google Maps.

---

## 💰 3. Modelo de Negocio y Ganancias (La División S/ 1 - S/ 9)

### Esquema por Comisión (Tu propuesta):
* **Costo de la reserva:** S/ 10 (seña).
* **Reparto automático:**
  * **S/ 1.00 para la plataforma (Tú):** Margen 100% neto por uso del software.
  * **S/ 9.00 para el emprendedor:** Se abona a su cuenta o se descuenta del precio total del servicio cuando el cliente asiste al local (el cliente paga el resto en efectivo o Yape al terminar).
* **Protección ante inasistencia:** Si el cliente no llega a su cita, el emprendedor se queda con sus S/ 9 por el tiempo reservado, erradicando el problema de las citas perdidas.

### Esquema Opcional para Escalar (Suscripción):
* Cuando un barbero tenga más de 60 citas al mes, puede optar por un plan mensual de **S/ 29/mes** con 0% de comisiones por cita.

---

## 📲 4. Funcionalidades Clave Añadidas (Mejoras Estratégicas)

1. **Integración con Yape / Plin (Indispensable para el mercado local):**
   * El cliente puede pagar directamente escaneando el QR o subiendo captura de confirmación automática.
2. **Recordatorio automático por WhatsApp:**
   * 2 horas antes de la cita, el sistema envía un mensaje automático al cliente:  
     *"Hola Juan, recuerda que tienes tu cita hoy a las 5:00 PM con Carlos Barber en Av. Principal 123. ¡Te esperamos!"*.
3. **Bloqueo dinámico de descansos o emergencias:**
   * Un botón de "Pausa / Bloquear horario" para cuando el profesional tiene que salir o almorzar.
4. **Política clara de cancelación:**
   * Cancelación gratuita si avisa con 12 horas de anticipación (libera el cupo para otro cliente). Si no avisa, no se reembolsa la seña.

---

## 🛠️ 5. Stack Técnico Recomendado
* **Frontend:** HTML, Tailwind CSS y JavaScript (interfaz optimizada para móviles, tipo app nativa).
* **Backend:** Node.js / Express o Supabase (para gestionar citas, disponibilidad de calendarios y estado de pagos).
* **Base de datos:** PostgreSQL / Supabase (gestión de emprendedores, turnos y reservas).
* **Notificaciones:** Integración con API de WhatsApp (Twilio o Baileys) para confirmaciones automáticas.
