# 📜 PROMPT MAESTRO / DOSSIER TÉCNICO DEL PROYECTO
> **Instrucciones para la otra IA:** Lee este documento atentamente. Representa el 100% del contexto arquitectónico, técnico, de diseño, mecánicas y objetivos comerciales del videojuego. Asume el rol de Arquitecto de Software y Diseñador de Videojuegos experto para responder o proponer código sobre esta base.

---

## 1. 🎮 IDENTIDAD Y CONCEPTO DEL JUEGO
- **Nombre Oficial:** *Core to Cosmos: Stack Tower* (o *Chroma Stack: Cosmic Ascend*).
- **Género:** Arcade / Casual / Tower Stacker / Roguelike Liviano.
- **Premisa Temática:** El jugador inicia en las profundidades ardientes del subsuelo terrestre (Núcleo Magmático) y debe apilar bloques ascendiendo piso a piso a través de la corteza, atmósfera y el espacio profundo, hasta conquistar el Núcleo del Cosmos.
- **Inspiración y Referencias:** *Stack* (Ketchapp), *Tower Bloxx*, *Crossy Road* (estética voxel/isométrica y monetización no invasiva).
- **Público Objetivo:** Jugadores móviles de partidas rápidas (1 a 4 minutos), altamente adictivo y gratificante, optimizado para celulares táctiles (Android e iOS).

---

## 2. 💻 STACK TECNOLÓGICO Y ARQUITECTURA
El proyecto fue construido bajo la filosofía de **cero dependencias externas pesadas**, garantizando tiempos de carga inferiores a 1 segundo y 60 FPS estables en cualquier teléfono modesto:
- **Lenguaje Core:** Vanilla JavaScript moderno (ES6+, modularizado dentro de un IIFE / closure central para evitar colisiones globales).
- **Motor Gráfico:** Canvas 2D nativo de HTML5 con proyección isométrica custom (`isoX = (x - z) * cos(30°)`, `isoY = (x + z) * sin(30°) - y`). Soporta pantallas HiDPI / Retina mediante `window.devicePixelRatio`.
- **Estilos e Interfaz:** Vanilla CSS3 con Custom Properties (Variables CSS), Glassmorphism con `backdrop-filter: blur()`, sombras multicapa y unidades de viewport modernas (`100dvh` y `100dvw`).
- **Diseño Móvil Primero (Mobile-First):** Integración nativa con `env(safe-area-inset-*)` para notches, cámaras perforadas y barras de navegación por gestos de Android / iPhone.
- **Motor de Audio:** Web Audio API sintético procedural (cero archivos `.mp3` o `.wav` externos). Todos los efectos (pops de colocación, fanfarrias de victoria, chimes de combo, bajos de impacto, alarmas de jefe) se sintetizan en tiempo real mediante osciladores sinusoidales, triangulares y curvas de ganancia exponenciales.
- **Monetización Simulada (AdMob Ready):** Reproductor de video publicitario interactivo renderizado directamente en Canvas con temporizador de 5 segundos, botones de cierre y callbacks para anuncios bonificados (Rewarded Ads).
- **Distribución PWA / Tiendas:** Progressive Web App completa con `manifest.json`, iconos maskable en todas las resoluciones y `sw.js` (Service Worker) con estrategia de caché Network-First. Empaquetable para Google Play Store mediante **TWA (Trusted Web Activity) / Bubblewrap** o **Capacitor**.

---

## 3. ⚙️ MECÁNICAS DE JUEGO (CORE LOOP & FÍSICAS)
1. **Apilamiento Isométrico Alternado:**
   - Los bloques se desplazan de izquierda a derecha en el eje X, y en el siguiente piso de atrás hacia adelante en el eje Z.
   - El jugador toca la pantalla en cualquier punto para detener el bloque en movimiento sobre la torre.
2. **Sistema de Corte Preciso (Slicing):**
   - El excedente que no queda alineado con el bloque anterior se corta y cae como escombros físicos (`debris`) con gravedad y aceleración angular.
   - El bloque apilado se reduce al tamaño del área superpuesta.
3. **Mecánica de Golpes Perfectos (Combos & Pitch):**
   - Si la desalineación es menor a 2.8 píxeles, se activa un **¡PERFECTO!**, restaurando el bloque al tamaño completo y reproduciendo una nota musical en escala cromática ascendente.
   - Al acumular 7 perfectos consecutivos, se activa el **MODO FIEBRE (Fever Mode)**: los siguientes 3 bloques son gigantes y dorados, otorgando lluvia de monedas cósmicas.
4. **Combates contra Jefes (Boss Fights):**
   - Cada 5 niveles (ej. Niveles 5, 10, 15... 50), el jugador se enfrenta a un Jefe Cósmico con condiciones especiales:
     - *Gravedad Invertida:* La pantalla gira 180° y se debe apilar de cabeza.
     - *Bloques Fantasma:* El bloque parpadea y se vuelve translúcido.
     - *Piso Resbaladizo / Hielo:* Aumento repentino de velocidad o inercia.
     - *Bomba / Magma:* Temporizador de cuenta regresiva para colocar el bloque.
5. **Modos de Juego:**
   - **Modo Misiones / Campaña:** 50 niveles con metas fijas (ej. 20, 25, 40 pisos), sistema de 1 a 3 estrellas por precisión, y desbloqueo progresivo de mundos.
   - **Modo Infinito (Odisea Cósmica):** Ascenso sin límite donde la torre cambia de bioma cada 15 pisos, registrando récord local (`c2c_endless_best`) y tabla de clasificación semanal.

---

## 4. 🪙 ECONOMÍA Y SISTEMA DE COLECCIÓN
- **Monedas Cósmicas (🪙):** Se obtienen apilando pisos, logrando combos perfectos y cofres diarios. Se usan para comprar potenciadores y desbloquear aspectos comunes y raros.
- **Diamantes Astrales (💎):** Moneda premium escasa obtenida derrotando jefes, logrando 3 estrellas en niveles o completando logros. Se usan para aspectos Épicos, Legendarios y Míticos, o para el Seguro de Resurrección.
- **Colección de 217 Aspectos de Bloques:**
   - 6 Categorías temáticas: Metales Divinos, Gemas Astrales, Elementos Primordiales, Neón Cyberpunk, Bioma Orgánico y Núcleos Cósmicos.
   - 5 Rarezas: Común, Raro, Épico, Legendario y Mítico.
   - Cada aspecto posee renderizado visual propio (gradientes, patrones, brillos estelares y partículas).
   - Bloque Inicial Neutro: El juego inicia con un bloque clásico limpio para que la personalización sea un incentivo de progresión.
- **Potenciadores Pre-Partida:**
   - *Chrono -40%:* Ralentiza la velocidad del bloque durante momentos críticos.
   - *Base Titán:* Restaura el tamaño de la torre al tamaño máximo inicial.
   - *Seguro Revivir:* Salva automáticamente al jugador de una caída sin reiniciar la partida.

---

## 5. 🎯 OBJETIVOS DEL PROYECTO
1. **Publicación Exitosa en Google Play Store:**
   - Empaquetar la aplicación como PWA / TWA lista para Android con soporte offline total.
   - Integrar monetización mediante Google AdMob (Rewarded Video para revivir y duplicar recompensas) y Google Play Billing (IAP para remover anuncios por $1.99).
2. **Experiencia Móvil Impecable (Ergonomía Táctil):**
   - Interfaces táctiles generosas (touch targets mínimos de 44px).
   - Márgenes seguros alejados de los bordes físicos del teléfono y barras de navegación por gestos.
   - Menú de pausa ultracompacto con controles por iconos para no abrumar al jugador.
3. **Rendimiento Ultrarrápido:**
   - 60 FPS en Android y Web con consumo de batería mínimo y soporte de `wakeLock` para evitar que la pantalla se apague mientras se juega.

---

## 6. 📁 ESTRUCTURA DE ARCHIVOS CLAVE
- `index.html`: Estructura semántica, canvas de juego, overlays, HUD, modales compactos y tienda en pantalla completa.
- `style.css`: Sistema de diseño moderno, variables CSS, glassmorphism, media queries móviles y ajustes de áreas seguras.
- `game.js`: Motor de física, renderizado isométrico, sintetizador Web Audio, lógica de niveles, economía, tienda y gestión de estados.
- `sw.js`: Service worker para juego offline, caché Network-First y control de versiones.
- `manifest.json`: Configuración PWA para instalación como app nativa en Android y escritorio.
