# 🧹 DataCleanse — Limpiador de Excels y CSVs "Feos"

> **Concepto:** Una micro app web que permite a administrativos, analistas, mercadólogos y dueños de negocio limpiar, desduplicar y formatear bases de datos sucias en segundos sin saber fórmulas complejas de Excel ni macros.

---

## 🎯 1. Problema que Resuelve
* Los reportes descargados de bancos, CRMs antiguos, formularios de Google o pasarelas de pago vienen llenos de defectos:
  * Espacios en blanco innecesarios al inicio o final de las palabras.
  * Nombres completos en una sola columna en vez de separados por Nombre y Apellido.
  * Números de teléfono sin código de país o con guiones raros.
  * Fechas en formatos incompatibles (mezcla de `DD/MM/AAAA` con `AAAA-MM-DD`).
  * Filas repetidas que arruinan métricas.
* El 90% de los usuarios no sabe usar macros o Power Query en Excel y pierde horas limpiando a mano fila por fila.

---

## 💡 2. Propuesta de Valor
* **Arrastrar y Soltar:** Subes tu archivo `.csv` o `.xlsx`.
* **Caja de herramientas de 1 clic (Casillas mágicas):**
  * ☑️ *Eliminar filas duplicadas automáticamente.*
  * ☑️ *Limpiar espacios dobles o invisibles.*
  * ☑️ *Capitalizar textos (ej. "jUAN pErEz" ➔ "Juan Pérez").*
  * ☑️ *Separar "Nombre Completo" en "Nombre" y "Apellido".*
  * ☑️ *Unificar formato de fechas a tu estándar preferido.*
  * ☑️ *Limpiar números de teléfono (dejar solo dígitos válidos).*
* **Vista previa instantánea:** Muestra un "Antes y Después" de las primeras 10 filas antes de descargar.
* **100% Privado:** Los datos se procesan en el navegador del usuario vía JavaScript (las bases de datos nunca viajan a ningún servidor externo).

---

## 💰 3. Modelo de Monetización
* **Uso Gratuito:** Limpieza ilimitada para archivos de hasta 150 filas.
* **Pase por Archivo / Créditos:** $2 USD por limpiar un archivo pesado de hasta 50,000 filas.
* **Suscripción Pro ($7 USD / S/ 25 al mes):**
  * Archivos ilimitados sin límite de tamaño.
  * Fórmulas personalizadas de extracción de datos (Regex visual).
  * Exportación en múltiples formatos (.csv, .xlsx, .json).

---

## 🛠️ 4. Stack Técnico Recomendado
* **Frontend:** HTML, CSS y JavaScript Vanilla.
* **Bibliotecas Clave:** `PapaParse` (para parseo ultrarrápido de CSV) y `SheetJS (xlsx)` para lectura y escritura nativa de hojas de cálculo de Excel directamente en el navegador del cliente.
