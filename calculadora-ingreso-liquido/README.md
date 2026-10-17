# 💵 NetIncome Calc — Calculadora de Facturación Líquida ("Lo que debes cobrar")

> **Concepto:** Una micro app financiera para freelancers, contratistas y proveedores de servicios que calcula cuánto deben facturar en bruto para recibir exactamente la cantidad neta deseada en su cuenta bancaria tras descontar retenciones de impuestos, comisiones bancarias y de pasarelas de pago.

---

## 🎯 1. Problema que Resuelve
* Cuando un cliente pregunta: *"¿Cuánto me cobras por este trabajo?"*, el profesional piensa: *"Quiero ganar S/ 1,500 en mano"*.
* Envía la cotización por S/ 1,500, pero cuando cobra:
  * El fisco le retiene el impuesto a la renta (ej. 8% en recibos por honorarios).
  * La pasarela de pago o banco le descuenta 3.99% + comisión fija.
  * Al final le quedan solo S/ 1,310 en el bolsillo. **Perdió casi S/ 200 sin darse cuenta.**

---

## 💡 2. Propuesta de Valor
* **Cálculo Inverso Inteligente (De Neto a Bruto):**
  * El usuario ingresa: *"Quiero que me lleguen exactamente $500 USD (o S/ 1,800)"*.
  * Selecciona el método de cobro:
    * Recibo por Honorarios / Factura con retención fiscal.
    * PayPal / Stripe / Culqi / Mercado Pago / Tarjeta de Crédito.
    * Transferencia bancaria internacional (SWIFT).
* **Resultado Inmediato y Desglosado:**
  * **Monto Bruto que debes cobrar:** `$542.80`
  * Desglose visual:
    * Monto Líquido en tu bolsillo: `$500.00`
    * Comisión de la pasarela: `$21.70`
    * Retención tributaria: `$21.10`
* **Generador de Presupuesto Copiable:** Un texto formal listo para pegar al cliente justificando el costo de transacción de forma transparente.

---

## 💰 3. Modelo de Monetización
* **Gratuito:** Uso ilimitado en la web.
* **Afiliación Financiera:** Enlaces de recomendación a pasarelas de pago y neobancos que pagan comisión por cada usuario referido.
* **Versión Pro ($6 USD / S/ 20 pago único):**
  * Comparador de pasarelas de pago: Muestra lado a lado cuál pasarela te cobra menos comisión para ese monto exacto.
  * Plantilla descargable en Excel/Google Sheets para cotizaciones masivas.

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, CSS y JavaScript Vanilla (con gráficos de dona interactivos mostrando el reparto porcentual).
* **Fórmula Matemática:** Cálculo inverso de comisiones fijas y porcentuales:
  $$\text{Monto Bruto} = \frac{\text{Neto Deseado} + \text{Comisión Fija}}{1 - (\text{Tasa Impuesto} + \text{Tasa Pasarela})}$$
