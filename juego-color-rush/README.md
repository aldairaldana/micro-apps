# 👁️ ColorRush — Desafío de Agudeza Visual en 15 Segundos (100% Celular)

> **Concepto:** Un micro-juego de velocidad extrema y ojo clínico diseñado para pantallas de celular. Encuentra el único cuadro de color ligeramente diferente antes de que el reloj llegue a cero. Cada acierto suma segundos; cada error te quita tiempo.

---

## 🎮 1. Mecánica del Juego (Ritmo Rápido de 1 Toque)
* **Orientación:** 100% Vertical para teléfonos.
* **Control:** Tocar el cuadro discordante con el pulgar.
* **Dinámica paso a paso:**
  1. **Inicio a Contrarreloj:** Empiezas con un temporizador de **15 segundos**.
  2. **La Cuadrícula de Color:**
     * Nivel 1: Matriz de 2x2 cuadros grandes con un color obvio (ejemplo: 3 cuadros rojos idénticos y 1 cuadro visiblemente anaranjado).
     * Conforme avanzas: La cuadrícula crece progresivamente a 3x3, 4x4, 5x5... hasta llegar a 7x7 cuadros pequeños.
     * La diferencia cromática (*Delta E*) se reduce al mínimo (del 20% de diferencia en los primeros niveles hasta un sutil 2% que exige máxima agudeza visual).
  3. **Sistema de Tiempo Dinámico:**
     * ✅ **Acierto:** Suma **+1 segundo** al reloj y pasa inmediatamente al siguiente nivel con una animación explosiva.
     * ❌ **Fallo (tocar cuadro incorrecto):** Penalización de **-3 segundos** en el temporizador y sacudida de pantalla (*screen shake*).
  4. **Fin del juego:** Cuando el cronómetro llega a 0.

---

## 🏆 2. El Gancho Competitivo ("Ojo de Halcón")
* Las partidas duran entre 30 y 60 segundos, haciéndolo ideal para jugar varias veces seguidas ("solo una partida más").
* **Rangos según tu resultado final:**
  * Niveles 1 a 10: *"Visión de Topo"* 🦔
  * Niveles 11 a 20: *"Visión Humana Promedio"* 👤
  * Niveles 21 a 35: *"Ojo de Lince"* 🐱
  * Niveles 36+: *"Ojo de Halcón Sobrehumano (Top 1%)"* 🦅
* **Compartir en Redes Sociales:**
  * Tarjeta gráfica lista para WhatsApp con tu puntaje y rango alcanzado para retar a tus amigos a ver quién tiene mejor vista.

---

## 🎨 3. Experiencia Sensorial Móvil
* **Generación Infinita de Colores:** Los colores base (azules, púrpuras, verdes, amarillos, rosas pastel) se generan aleatoriamente en el espacio de color HSL para que cada partida sea completamente distinta.
* **Micro-Animaciones Táctiles:** Efecto de pulsación en el cuadro tocado y partículas suaves al acertar.
* **Vibración de Emergencia:** El teléfono vibra rápidamente cuando te quedan menos de 5 segundos de tiempo para disparar la adrenalina.

---

## 💰 4. Modelo de Monetización
1. **Torneo Semanal de Récords:** Los usuarios compiten por estar en la tabla de los 10 mejores del país.
2. **Modo Duelo 1 vs 1 en el Mismo Celular:** Pantalla dividida donde dos amigos compiten en el mismo teléfono tocando su lado de la pantalla.
3. **Pase Sin Anuncios ($1.99 USD o S/ 5):** Quita banners promocionales y desbloquea modos de juego adicionales (ej. modo daltónico o modo contrarreloj de 60 segundos).

---

## 🛠️ 5. Stack Técnico Recomendado
* **Frontend:** HTML5, CSS Flexbox/Grid y JavaScript Vanilla.
* **Lógica Cromática:** Manipulación matemática de tonos HSL (`hsl(hue, saturation, lightness)`) calculando la variación de luminosidad en tiempo real.
* **Rendimiento Ultrarrápido:** Cero retrasos táctiles (`touch-action: manipulation` para eliminar los 300ms de retraso habitual de los navegadores móviles).
