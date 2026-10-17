# 📊 RateCraft — Calculadora de Precios para Servicios & Freelancers

> **Concepto:** Una micro app interactiva que ayuda a freelancers, consultores y creadores de servicios a calcular exactamente cuánto deben cobrar por hora o por proyecto sin perder dinero ni subestimar sus costos.

---

## 🎯 1. El Problema Real
La mayoría de los profesionales independientes cometen uno de estos errores comunes:
1. **Cobran "al ojo"** o copiando los precios de la competencia sin conocer sus costos reales.
2. **Olvidan las horas no facturables:** dedican tiempo a reuniones, prospección, administración y soporte que nadie les paga directamente.
3. **No contemplan imprevistos ni impuestos:** al final de mes se dan cuenta de que ganaron menos del salario mínimo real después de gastos y retenciones.

---

## 💡 2. La Solución (Propuesta de Valor)
Una herramienta limpia, visual y sin fricción donde en **menos de 2 minutos** el usuario ingresa sus números y obtiene:
* Su **tarifa mínima viable por hora (TMV)**.
* Su **tarifa objetivo (con margen de beneficio)**.
* Un **cotizador rápido por proyecto** para enviar a clientes.

---

## 👥 3. Público Objetivo
* Freelancers (diseñadores, desarrolladores, redactores, editores de video).
* Consultores y coaches independientes.
* Pequeños negocios de servicios (fotografía, catering, eventos).

---

## ⚙️ 4. Funcionalidades Principales (MVP)

### 📌 Paso 1: Ingreso de Datos Financieros
* **Meta de ingresos netos deseada:** ¿Cuánto quieres llevarte al bolsillo cada mes?
* **Costos fijos mensuales de trabajo:** Software, internet, suscripciones, espacio de trabajo, etc.
* **Porcentaje de impuestos estimado:** Según su país o régimen fiscal.

### 📌 Paso 2: Tiempo Real de Trabajo
* **Días laborables por semana.**
* **Horas totales trabajadas por día.**
* **Factor de ocupación / horas facturables reales:** (Por defecto un 60-70%, ya que el resto es prospección, emails y descanso).
* **Semanas de vacaciones / descanso al año.**

### 📌 Paso 3: Resultados y Cotizador de Proyectos
* **Tarifa por hora recomendada** (mostrando desglose: costo base, impuestos y margen de ganancia).
* **Calculadora de Proyecto:**
  * Estimación de horas del proyecto.
  * Complejidad / Riesgo (multiplicador del 10% al 30%).
  * **Precio final sugerido al cliente.**
* **Botón de exportación:** Descargar resumen o copiar cotización en texto listo para WhatsApp/Email.

---

## 🧮 5. Fórmula Lógica del Cálculo

$$\text{Horas Facturables Anuales} = (\text{Horas semanales} \times \text{Factor facturable}) \times (52 - \text{Semanas vacaciones})$$

$$\text{Presupuesto Anual Necesario} = \frac{\text{Ingreso Neto Deseado} + \text{Gastos Fijos Anuales}}{1 - \text{Tasa Impuestos}}$$

$$\text{Tarifa Base por Hora} = \frac{\text{Presupuesto Anual Necesario}}{\text{Horas Facturables Anuales}} \times (1 + \text{Margen Beneficio})$$

---

## 💰 6. Modelo de Monetización

1. **Versión Gratuita:**
   * Cálculo ilimitado en pantalla.
   * Copiar presupuesto básico en texto plano.

2. **Versión Pro (Pago único de $12 USD o $4 USD/mes):**
   * Exportación de presupuesto en **PDF con diseño profesional y logo personalizado** del freelancer.
   * Guardar múltiples perfiles de clientes y proyectos.
   * Enlace web compartible para que el cliente vea la cotización interactiva.

---

## 🛠️ 7. Stack Técnico Recomendado
* **Frontend:** HTML5, CSS moderno (Tailwind o Vanilla CSS con estética minimalista/dark mode) y JavaScript.
* **Almacenamiento local:** `localStorage` (para que los datos del usuario no se borren al recargar, sin obligar a registrarse).
* **Exportación:** `jsPDF` o `html2canvas` para generar el PDF al instante.
