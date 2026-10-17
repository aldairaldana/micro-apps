# 📋 BITÁCORA Y ESTADO DEL PROYECTO — MICRO APPS
> **Documento Central de Continuidad y Memoria Operativa**  
> *Última actualización:* Octubre 2026  
> *Objetivo:* Mantener el contexto, reglas del negocio, estado del desarrollo, ideas aprobadas y acuerdos tomados entre el usuario y la IA. En caso de cierre imprevisto de sesión o reinicio, este archivo es la fuente de verdad inmediata.

---

## 🏢 1. Visión del Ecosistema de Micro Apps

El proyecto consiste en una factoría de **Micro Apps y Micro SaaS** diseñadas para resolver un problema específico con máxima eficiencia, bajo costo de desarrollo y alta rentabilidad o viralidad.

### Estrategia de Organización
* Cada micro app vive en su propia carpeta dentro del workspace `micro apps/`.
* Antes de codificar, cada micro app cuenta con su `README.md` detallando:
  1. Problema real / dolor del mercado.
  2. Propuesta de valor y solución (MVP).
  3. Modelo de negocio y monetización (freemium, comisión, pago único, suscripción ligera).
  4. Flujo interactivo paso a paso.

---

## 📁 2. Inventario de Carpetas y Estado de Desarrollo

Actualmente existen **14 micro apps** estructuradas en el espacio de trabajo:

| # | Carpeta / Micro App | Tipo | Estado | Modelo de Negocio |
| :---: | :--- | :---: | :---: | :--- |
| **1** | [juego-stack-tower](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower) (**Core to Cosmos**) | Micro-Juego Arcade | **100% Funcional (v4.6)** (Campaña Infinita + 3D Shading Orgánico sin Líneas IA + Fondos Vivos + Bloqueo Háptico + WebAPK) | Viralidad, retención, micropagos cosméticos, Google Play Store |
| **2** | [reserva-citas-emprendedores](file:///c:/Users/aldai/Desktop/micro%20apps/reserva-citas-emprendedores) (**CitaYa**) | Micro-SaaS B2B | Documentado (`README.md`) | Comisión por seña (S/ 1 por cita reservada de S/ 10) |
| **3** | [calculadora-precios-servicios](file:///c:/Users/aldai/Desktop/micro%20apps/calculadora-precios-servicios) (**RateCraft**) | Utilidad Financiera | Documentado (`README.md`) | Freemium / Exportación de presupuestos Pro en PDF ($9) |
| **4** | [micro-catalogo-whatsapp](file:///c:/Users/aldai/Desktop/micro%20apps/micro-catalogo-whatsapp) (**TiendaZap Studio**) | E-commerce / Catálogo Móvil WhatsApp | **100% Funcional (v1.0)** (Onboarding 4 Pasos + Nichos WhatsApp Business + Pagos Yape/Plin + QR Fullscreen + Pedido WhatsApp + GitHub & Pages) | Gratis hasta 5 productos; Plan Pro $5/mes o $29 pago único |
| **5** | [muro-testimonios-widget](file:///c:/Users/aldai/Desktop/micro%20apps/muro-testimonios-widget) (**SocialProof Widget**) | Widget Web B2B | Documentado (`README.md`) | Gratis con marca; $9 pago único marca blanca |
| **6** | [limpiador-datos-csv](file:///c:/Users/aldai/Desktop/micro%20apps/limpiador-datos-csv) (**DataCleanse**) | Utilidad de Datos | Documentado (`README.md`) | Gratis hasta 100 filas; micropago $3 por archivo masivo |
| **7** | [qr-dinamico-branding](file:///c:/Users/aldai/Desktop/micro%20apps/qr-dinamico-branding) (**BrandQR**) | Marketing QR | Documentado (`README.md`) | $14 pago único de por vida (frente a suscripciones caras) |
| **8** | [audio-whatsapp-a-tareas](file:///c:/Users/aldai/Desktop/micro%20apps/audio-whatsapp-a-tareas) (**VoiceToTask**) | Productividad IA | Documentado (`README.md`) | 10 audios/mes gratis; suscripción de $4.99/mes |
| **9** | [firmas-correo-pro](file:///c:/Users/aldai/Desktop/micro%20apps/firmas-correo-pro) (**SigNature**) | Utilidad Branding | Documentado (`README.md`) | 1 firma gratis; $6 paquete de plantillas ilimitadas |
| **10** | [generador-legal-cookies](file:///c:/Users/aldai/Desktop/micro%20apps/generador-legal-cookies) (**CookiePolicy Simple**) | Legal Tech | Documentado (`README.md`) | $9 pago único por paquete legal completo |
| **11** | [compresor-imagenes-webp](file:///c:/Users/aldai/Desktop/micro%20apps/compresor-imagenes-webp) (**WebPFast**) | Utilidad Web | Documentado (`README.md`) | Gratis ilimitado en navegador; Pro $12 con compresión batch |
| **12** | [calculadora-ingreso-liquido](file:///c:/Users/aldai/Desktop/micro%20apps/calculadora-ingreso-liquido) (**NetIncome Calc**) | Utilidad Financiera | Documentado (`README.md`) | Afiliación pasarelas + hoja interactiva $5 |
| **13** | [juego-color-rush](file:///c:/Users/aldai/Desktop/micro%20apps/juego-color-rush) | Micro-Juego Reflejos | Documentado (`README.md`) | Juegos casuales, anuncios ligeros |
| **14** | [juego-memory-recall](file:///c:/Users/aldai/Desktop/micro%20apps/juego-memory-recall) | Micro-Juego Memoria | Documentado (`README.md`) | Juegos mentales, pases de entrenamiento diario |

---

## 🎮 3. Evolución y Estado Técnico de `juego-stack-tower` (Core to Cosmos)

### Concepto del Juego
Construcción de torre isométrica 3D vertical desde el **núcleo magmático de la Tierra (-6,371 km)** hasta los **planetas del cosmos (+15,000 km)** a través de 8 biomas con físicas, texturas y mecánicas evolutivas.

### Fases de Desarrollo Implementadas:
* **Versión 1.0 (Endless Arcade Inicial):**
  - Motor isométrico en Canvas 2D sin librerías externas pesadas.
  - Síntesis de audio armónico procedural con *Web Audio API* (sin archivos MP3 externos).
  - Cálculo de corte de bloques sobrantes y sistema de combos perfectos continuos.
  - Vibración háptica en celulares y botón para compartir récord en WhatsApp.
* **Versión 2.0 (Evolución de Biomas y Físicas Especiales):**
  - Sistema de altímetro dinámico (-6,371 km a +15,000 km).
  - 8 capas: Núcleo Magmático, Caverna Slime, Minas de Oro, Metrópolis, Cielo Glaciar, Estratósfera, Órbita Lunar y Cosmos.
  - Físicas únicas: Bloques de Slime (rebote elástico *squash & stretch*), Bloques de Hielo (deslizamiento por inercia), Bloque Magnético (autocorrección hacia el centro).
  - Menú Metajuego: Tabla de Récords de Lunes a Domingo, Salón de la Fama y Modal de Ajustes.
* **Versión 3.0 (Misiones por Niveles y Texturas Deluxe — Último Cambio Realizado):**
  - **Misiones con meta clara:** Salir del núcleo requiere 25 bloques (Nivel 1), Caverna Slime 30 bloques (Nivel 2), etc.
  - **Pantalla de Victoria con 1 a 3 Estrellas (⭐⭐⭐):** Basado en precisión y combos perfectos, con botón *"Siguiente Nivel ▶"*.
  - **Selector de Niveles y Guardado:** Progreso persistente en `localStorage`.
  - **Texturas Procedurales Deluxe:**
    - 🪙 **Oro Metálico:** Gradiente especular con bisel y destello de luz animado (*glint*).
    - 🌋 **Magma Incandescente:** Roca negra basáltica con grietas ardientes pulsantes.
    - 💎 **Slime Cristalino:** Burbujas internas y deformación elástica.
    - ❄️ **Hielo Glaciar:** Grietas blancas de fractura y fricción baja.

* **Versión 4.0 (GitHub Arcade Deluxe Upgrade — ¡Implementada con Éxito!):**
  - **Física de Escombros 3D (*Tumbling Debris*):** Los trozos rebanados se proyectan con rotación 3D Euler en tiempo real (`rotX, rotY, rotZ`), inercia angular, aceleración gravitacional y desvanecimiento progresivo, transformando el impacto visual de los cortes.
  - **Screen Shake (Sacudida Háptica de Pantalla):** Temblor cinemático de impacto en el canvas ante cortes forzados, inercia de hielo y colisiones de game over.
  - **Hit-Stop & Flash Bloom:** Micro-pausa de satisfacción (~50ms) en combos perfectos acompañados de un destello de luz blanco brillante.
  - **Números y Puntajes Flotantes:** Textos de impacto flotantes (`+25`, `+50 ¡PERFECTO!`, `+150 COMBO x3!`) que emergen del bloque con tipografía moderna y sombra brillante.
  - **Lluvia de Confeti / Celebración Festiva:** 90 cintas festivas multicolor con física de aleteo (*wobble*) que inundan el canvas al completar la meta del nivel.
  - **Sala de Trofeos y Logros (6 Medallas):** Sistema completo de logros (`Escapista del Magma`, `Fiebre de Combos`, `Toque de Midas`, `Patinador Glaciar`, `Coleccionista Estelar`, `Pionero del Cosmos`) con modal interactivo y banner **Toast flotante** animado en vivo.
  - **Exclusión de Vidas:** Se descartó el sistema de vidas por acuerdo con el usuario para conservar la tensión arcade pura de muerte súbita.

* **Versión 4.1 (Resolución de Bug Visual HiDPI & Unificación de Canvas):**
  - **Diagnóstico del Gran Problema:** En pantallas de alta densidad / escalado de Windows (125% o 150% DPR), el juego se encogía al ~66% en la esquina superior izquierda debido a desincronización entre la resolución de buffer de dos canvas separados (`bg-canvas` y `game-canvas`), dejando márgenes negros con torres verdes congeladas y estelas de confeti en bucle.
  - **Unificación de Canvas:** Se eliminó el canvas secundario y se consolidó todo el renderizado en un único canvas (`#game-canvas`).
  - **Manejo Riguroso de HiDPI:** En cada frame se resetea la transformación a píxeles físicos (`setTransform(1, 0, 0, 1, 0, 0)`) para limpiar el 100% del buffer real, y luego se aplica la escala `dpr` (`setTransform(dpr, 0, 0, dpr, 0, 0)`), garantizando pantalla completa nítida y sin residuos en cualquier monitor o teléfono móvil.
  - **Ciclo de Vida de Confeti:** Se implementó amortiguación de inercia horizontal (`vx *= 0.98`), desvanecimiento alfa progresivo y reseteo estricto al reiniciar o cambiar de nivel.

* **Versión 4.2 (Optimización Móvil Integral para Android & iOS — Pantalla Respirable y Fluida):**
  - **Fórmula Isométrica Adaptativa (`updateResponsiveDimensions`):** En celulares (ancho < 500px), el tamaño del bloque base se calcula dinámicamente (`~28% del ancho visible` = 90px a 112px, altura 22px), evitando que la torre sea gigante y asfixie la pantalla.
  - **Balanceo Seguro del Bloque Móvil:** El rango de oscilación lateral se acota con `maxSafeRange = (width / (ISO_COS * 2)) * 0.82`, asegurando que el bloque NUNCA se corte ni se salga de los bordes del celular en ningún extremo.
  - **Anclaje Vertical de Cámara (`centerY`):** En celulares se ancla la base de la torre en `height * 0.68` a `0.72`, dejando espacio amplio y limpio debajo del HUD para que la torre suba con elegancia sin rozar el contador de pisos.
  - **HUD Móvil sin Solapamiento:** El altímetro cuenta con margen derecho reservado (`margin-right: 48px`), impidiendo que el botón de pausa se monte sobre el contador de pisos. El marcador de puntaje usa `clamp(2.8rem, 11vw, 4.6rem)`.
  - **Viewport Moderno Dinámico (`100dvh` / `100dvw`):** Se blindó el contenedor contra barras de navegación dinámicas de Safari iOS y Chrome Android, y se configuró `overscroll-behavior: none` para erradicar el rebote elástico.
  - **Media Queries Dedicadas (`max-width: 600px` y `max-height: 720px`):** Reducción armónica de logos, tarjetas de bioma, grilla de niveles y trofeos para caber en una sola vista sin necesidad de scroll forzado.

* **Versión 4.3 (Desacople de Eventos Táctiles Móviles y Popup Modal de Pausa Interactivo):**
  - **Aislamiento de Eventos Táctiles del Menú:** Se corrigió el secuestro de eventos donde tocar cualquier parte de la pantalla (ajustes, selector de nivel, logros, ranking o espacio vacío) iniciaba la partida de inmediato (`startMissionGame()`). Ahora `window.addEventListener('pointerdown')` solo intercepta toques y llama a `placeBlock()` cuando `state === 'PLAYING'`, ignorando botones y modales. Se eliminó la bifurcación `if (state === 'START')` de `placeBlock()`, permitiendo una navegación táctil 100% nativa en Android e iOS sin falsos arranques.
  - **Popup Modal de Pausa en Vivo (`#pause-modal`):** Al tocar el botón de pausa (⏸️) durante la partida se congela la física y se despliega una ventana flotante con:
    - Indicador de nivel y progreso actual (ej. `🌋 NIVEL 1 • Pisos: X / 25`).
    - Controles de sonido rápidos: Switches interactivos para *Efectos de Sonido* y *Vibración Háptica*, sincronizados en tiempo real con `localStorage` y el modal de ajustes general.
    - Acciones clave: **▶️ Reanudar Partida**, **🔄 Reiniciar Nivel** e **🏠 Ir al Menú Principal** (que oculta el HUD y devuelve limpiamente a la pantalla de inicio).
    - Preservación visual del bloque móvil congelado bajo el overlay en lugar de desaparecer.

* **Versión 4.4 (Super Expansión Arcade — Modo Infinito, Skins, Power-Ups, Guía Holográfica y Música Procedural):**
  - **♾️ Modo Infinito ("Odisea Infinita") & Mecánica Ketchapp de Recuperación de Bloques:**
    - Selector de modo interactivo en el Menú Principal (*Misiones* vs *Odisea Infinita*).
    - En el modo infinito, la torre avanza sin límite por ciclos de biomas cada 20 pisos, con altímetro infinito y aumento progresivo de velocidad.
    - **Combo Recovery:** Al encadenar 4 o más aciertos perfectos consecutivos, el tamaño del bloque se expande automáticamente (+8px en ancho y profundidad hasta el máximo base), premiando la precisión extrema con redención de tamaño, sonido armónico de campana (`playRecoveryChime()`) y aviso flotante `¡RECUPERACIÓN +8PX!`.
  - **🪙 Economía de Monedas Cósmicas & Tienda de Aspectos (Skins Shop):**
    - Sistema de monedas ganado por juego (+1 por bloque colocado, +3 por corte perfecto, +5 por estrella en misiones y bonus cada 10 pisos).
    - Monedas persistentes en `localStorage` con indicador en la barra superior del menú y badge en el HUD del juego.
    - Tienda interactiva (`#skins-modal`) con 4 aspectos cosméticos renderizados proceduralmente:
      - 🔷 **Clásico:** La estética original pulida con colores adaptativos de cada bioma.
      - 🟣 **Cyberpunk Neón (100 monedas):** Bordes luminosos magenta y cian con núcleo negro digital y sombras de neón brillantes.
      - 💎 **Diamante Cristal (250 monedas):** Refracción especular azul/cian, caras facetadas semitransparentes y brillos de joya.
      - 👾 **Retro 8-Bit (400 monedas):** Bloques con contornos pixelados oscuros, sombreado plano y textura dither nostálgica arcade.
  - **⚡ Power-Ups Tácticos con Cooldown en HUD:**
    - **Chrono / Slow-Mo (`⏱️`):** Ralentiza la oscilación del bloque al 45% de velocidad durante 5 segundos (cooldown de 15s) para permitir alineaciones quirúrgicas.
    - **Bloque Titán (`🧱`):** Restaura el bloque activo al 100% de la anchura y profundidad base de la torre (cooldown de 25s), salvando al jugador tras recortes agresivos.
    - Interfaz táctil con anillos de recarga translúcidos (`.pu-cd-overlay`), micro-animación pulsante (`.active-powerup`) y desacople total de toques para evitar soltar bloques por error.
  - **🎵 Banda Sonora Sintetizada Procedural Web Audio API:**
    - Música ambiental espacial generada 100% en tiempo real mediante osciladores, filtros paso-bajo y envolventes de ganancia suaves (sin archivos MP3 externos ni consumo de ancho de banda).
    - Arpegios pentatónicos atmosféricos y bajos resonantes que se adaptan suavemente y respetan el estado de silencio o pausa del juego.
    - Controles de encendido/apagado en Ajustes y en el popup de pausa en vivo.
  - **🎯 Proyector Fantasma / Guía Holográfica Láser:**
    - Proyección isométrica semitransparente que se dibuja en tiempo real sobre el bloque previo, proyectando exactamente la huella donde aterrizará el bloque móvil.
    - Cambia dinámicamente de color: cian translúcido durante el movimiento, y dorado/blanco brillante con retícula central cuando el bloque entra en la zona de alineación perfecta (`PERFECT_TOLERANCE`).
    - Configurable desde el menú de Ajustes y el popup de Pausa.

* **Versión 4.5 (Optimización Móvil Integral, Arquitectura PWA WebAPK y Pipeline de Google Play Store):**
  - **📱 Pantalla Completa Inmersiva (Fullscreen API):** Botón dedicado `⛶` en la barra superior del menú y en el HUD del juego que oculta por completo las barras del navegador en Android e iOS, ofreciendo una experiencia nativa sin distracciones.
  - **🔋 Screen Wake Lock API:** Activación automática del bloqueo de pantalla mientras el jugador está apilando bloques para evitar que el teléfono atenúe el brillo o se suspenda en momentos críticos. Se libera limpiamente al pausar, terminar el nivel o volver al menú.
  - **⚡ DPR Clamping (Rendimiento 60 FPS y Ahorro de Batería):** Acotación inteligente del Device Pixel Ratio a `Math.min(devicePixelRatio, 2)` en la función `resize()`, erradicando el calentamiento y caídas de frames en smartphones con pantallas 3x / Quad HD.
  - **🔊 Desbloqueo Preventivo de AudioContext:** El motor de audio se desbloquea con el primer toque en pantalla (`pointerdown`), garantizando que los efectos y música suenen de inmediato en navegadores móviles restrictivos.
  - **📲 Botón de Instalación Directa PWA (`#pwa-install-btn`):** Captura del evento `beforeinstallprompt` para permitir instalar el juego como WebAPK nativo directamente en el cajón de apps del teléfono móvil sin pasar por tiendas.
  - **🏛️ Pipeline Oficial para Google Play Store (TWA):**
    - `manifest.json`: Manifiesto web estandarizado con orientación vertical (`portrait-primary`), colores de tema e iconos de aplicación.
    - `sw.js`: Service Worker con estrategia de caché *Stale-While-Revalidate* para ejecución instantánea 100% offline.
    - [icons/](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/icons): Generación de iconos oficiales en PNG de 192x192, 512x512, maskable y apple-touch-icon.
    - [playstore-assets/](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets): Icono oficial de tienda (512x512 PNG), Gráfico de funciones promocional (1024x500 PNG), [privacy-policy.html](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets/privacy-policy.html) y la [GUIA_PUBLICACION_PLAYSTORE.md](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets/GUIA_PUBLICACION_PLAYSTORE.md).

* **Versión 4.6 (Revolución Visual, Campaña Procedural Infinita, Texturas Volumétricas y UI Táctil Arcade):**
  - **🎨 Erradicación Total de "Líneas Falsas" de IA:** Eliminadas las líneas geométricas artificiales en forma de 'Y' invertida que se dibujaban sobre los bloques. Se implementó sombreado volumétrico real en 3 caras (luz cenital, penumbra lateral y sombra de profundidad) + sombra de contacto ambiental inferior bajo los bloques + piscinas orgánicas de magma volcánico hirviente con gradientes radiales térmicos pulsantes (`#ffffff` -> `#fff59d` -> `#ff5722` -> `#d82600`).
  - **♾️ Campaña Infinita Procedural (1 a 10,000+ Niveles):** Superado el límite de 8 niveles estáticos. Se integró `getLevelData(levelNum)` organizado en Sectores de 10 niveles, con curva de dificultad en ola (tensión/alivio), niveles *Fiebre de Oro* (bonificación de monedas en el nivel 5 de cada sector), niveles de Clímax/Jefe (nivel 10) y navegador de mundos interactivo con flechas (`#prev-world-btn`, `#next-world-btn`).
  - **🌋 Fondos Vivos y Atmosféricos:** Sustituido el fondo plano por un entorno atmosférico reactivo con ascuas volcánicas ascendentes con oscilación horizontal turbulenta, resplandor térmico inferior, nebulosas cósmicas suaves y estrellas titilantes.
  - **📳 Bloqueo Magnético Háptico y Resplandor de Base Reforzado:** Detección del instante exacto en que el bloque entra en la zona perfecta con micro-vibración háptica (`triggerVibrate(14)`), resplandor radiante cian/oro en la base con desenfoque de 24px, haces láser holográficos verticales y brackets en las esquinas.
  - **🪙 Economía de Monedas en Modo Infinito:** Ganancia acumulada de monedas durante toda la partida (+2 por bloque, +10 por combo, +30 cada 10 pisos), reflejándose claramente en la pantalla final de Game Over (`#go-coins-val`) para gastar en la tienda de skins.
  - **💀 Limpieza de Pantalla de Game Over:** Eliminación del botón gigante invasivo de WhatsApp al perder; la pantalla ahora se enfoca limpiamente en *Reintentar* y *Menú Principal*, mostrando el resumen de monedas cósmicas ganadas.
  - **📲 Asistente Visual de Instalación WebAPK / PWA:** Botón `#pwa-install-btn` adaptable y modal de ayuda paso a paso (`#install-help-modal`) con instrucciones visuales claras para Android (Chrome) e iOS (Safari) cuando el prompt automático no está disponible.
  - **⚡ Micro-Animaciones Llamativas de Power-Ups:** Animación flotante idle (`puIdleFloat`) y destello continuo de barrido (`puShimmer`) en los botones Chrono y Titán para invitar al jugador a utilizarlos.
  - **📱 HUD Blindado sin Solapamiento:** Reestructuración flexbox `.hud-top-bar` garantizando separación absoluta entre el badge de monedas y el medidor de altitud en teléfonos de cualquier resolución.

---

## 🔬 4. Hallazgos e Inspiración de Repositorios GitHub (>1,000 ⭐)

Investigamos los repositorios open-source más exitosos de la comunidad en mecánicas de apilamiento y física:
1. **`iamkun/tower_game` (~1,610 ⭐):** Mecánicas de combo y multiplicadores progresivos.
2. **`ste-vg/Tower-Blocks` (>1,500 ⭐):** Física de escombros en caída 3D y seguimiento suave de cámara (*lerp camera*).
3. **`KilledByAPixel/LittleJS` (~4,200 ⭐):** Screen shake, hit-stop y partículas festivas.
4. **`gabrielecirulli/2048` (~12,000 ⭐):** Textos flotantes y sistema de logros de rejugabilidad.

---

## 🗺️ 5. Plan Maestro de Evolución — Los 20 Bloques Temáticos (Mundos) y Mecánicas Adictivas

### 🏛️ Arquitectura de los 20 Bloques (168 Niveles Totales)
* **16 Bloques Estándar (8 niveles c/u):** Niveles 1-7 progresión temática, **Nivel 8: JEFE DEL BLOQUE**.
* **4 Bloques de Capítulo Especial (10 niveles c/u — Bloques 5, 10, 15 y 20):** Niveles 1-9 alta tensión, **Nivel 10: SÚPER JEFE DE CAPÍTULO**.
* **Cálculo Total:** (16 × 8) + (4 × 10) = **168 niveles diseñados de salida**.

#### Desglose Detallado de los 20 Mundos:
| Bloque | Nombre de Temática | Rango Niveles | Tipo de Bloque | Jefe Cumbre (Nivel Final del Bloque) |
| :---: | :--- | :---: | :---: | :--- |
| **1** | 🌋 Núcleo Magmático | Niveles 1 - 8 | Estándar (8) | **Jefe Lvl 8:** Golem de Magma Furioso |
| **2** | 💎 Caverna Slime Jade | Niveles 9 - 16 | Estándar (8) | **Jefe Lvl 16:** Rey Slime Ámbar Gigante |
| **3** | 🪙 Minas de Oro & Cuarzo | Niveles 17 - 24 | Estándar (8) | **Jefe Lvl 24:** Coloso Midas Dorado |
| **4** | 🏙️ La Metrópolis Cyber | Niveles 25 - 32 | Estándar (8) | **Jefe Lvl 32:** Cyber-Titán 2099 |
| **5** | 🗿 **Templo Titán Ancestral** | **Niveles 33 - 42** | **CAPÍTULO (10)** | **👑 SÚPER JEFE Lvl 42: REY TITÁN PRIMORDIAL** |
| **6** | ❄️ Cielo Glaciar | Niveles 43 - 50 | Estándar (8) | **Jefe Lvl 50:** Dragón de Escarcha Polar |
| **7** | 🌊 Océano Abisal & Arrecife | Niveles 51 - 58 | Estándar (8) | **Jefe Lvl 58:** Leviatán de las Profundidades |
| **8** | 🏴‍☠️ Galeón Fantasma Pirata | Niveles 59 - 66 | Estándar (8) | **Jefe Lvl 66:** Capitán Davy Jones |
| **9** | 🔥 Volcán de Fuego Azul | Niveles 67 - 74 | Estándar (8) | **Jefe Lvl 74:** Fénix de Plasma Volcánico |
| **10** | 🛸 **Nave Nodriza Alienígena** | **Niveles 75 - 84** | **CAPÍTULO (10)** | **👾 SÚPER JEFE Lvl 84: NAVE REINA NODRIZA ALIEN** |
| **11** | 🌌 Estratósfera Aurora | Niveles 85 - 92 | Estándar (8) | **Jefe Lvl 92:** Valkiria Boreal Electromagnética |
| **12** | 🛰️ Órbita Lunar & Cráteres | Niveles 93 - 100 | Estándar (8) | **Jefe Lvl 100:** Centinela de Regolito Lunar |
| **13** | 🪐 Anillos de Saturno | Niveles 101 - 108 | Estándar (8) | **Jefe Lvl 108:** Titán de Hielo Planetario |
| **14** | ☀️ Nebulosa Solar Radiactiva | Niveles 109 - 116 | Estándar (8) | **Jefe Lvl 116:** Bestia de Llamaradas Solares |
| **15** | 🌀 **Vórtice Agujero Negro** | **Niveles 117 - 126** | **CAPÍTULO (10)** | **🕳️ SÚPER JEFE Lvl 126: VÓRTICE SINGULARIDAD CUÁNTICA** |
| **16** | 🔴 Planeta Rojo & Ruinas Marcianas | Niveles 127 - 134 | Estándar (8) | **Jefe Lvl 134:** Señor de la Guerra Marciano |
| **17** | 🌠 Galaxia Andrómeda | Niveles 135 - 142 | Estándar (8) | **Jefe Lvl 142:** Oráculo de Polvo Estelar |
| **18** | 🪞 Dimensión Prisma Espejo | Niveles 143 - 150 | Estándar (8) | **Jefe Lvl 150:** Espectro Cromático Prisma |
| **19** | ⚡ Hiperespacio Warp Taquión | Niveles 151 - 158 | Estándar (8) | **Jefe Lvl 158:** Guardián del Tiempo Warp |
| **20** | 🌌 **Núcleo del Cosmos Primordial** | **Niveles 159 - 168** | **CAPÍTULO FINAL (10)** | **👑 SÚPER JEFE FINAL Lvl 168: DEIDAD CÓSMICA SUPREMA** |

---

### 🛡️ Protocolo de No-Conflicto (Implementación Segura por Fases)
Para asegurar que ningún cambio pise o desestabilice el trabajo previo:
1. **Aislamiento Modular de Datos:** El motor de niveles se desacopla mediante funciones puras (`getWorldInfoForLevel(lvlNum)`, `getWorldStartLevel(wIndex)`, `getLevelData(lvlNum)`). Cualquier llamada previa de `LEVELS[idx]` continúa funcionando sin romper guardados ni retrocompatibilidad.
2. **Persistencia Segura en `localStorage`:** Los índices guardados se validan con límites elásticos para que partidas existentes no queden bloqueadas ni corruptas.
3. **Paso a Paso Estricto:**
   - **Fase 1 (COMPLETADA Y VERIFICADA):** Mapeo de 20 Bloques, 168 niveles, 16 Jefes y 4 Súper Jefes en `game.js` + UI de selector de mundos de 1 a 20 con tarjetas dinámicas (`.boss-card`, `.superboss-card`, `.bonus-gold-card`) y cofres de recompensa (+50 🪙 y +100 🪙).
   - **Fase 2 (COMPLETADA Y VERIFICADA):** Modo Infinito con rotación aleatoria de biomas (Sneak-Peek) que toma dinámicamente de los 20 mundos cada 15 pisos, detecta mundos aún no alcanzados en la campaña, dispara alertas cinemáticas `👀 ¡SNEAK-PEEK: [MUNDO]!` y bonificaciones de +50 monedas.
   - **Fase 3 (COMPLETADA Y VERIFICADA):** Mecánicas Adictivas y Game Juice:
     1. **🔥 Modo Fiebre (Fever Mode):** Activado tras 5 aciertos perfectos consecutivos (`combo >= 5`), con fanfarria sintetizada en Web Audio API, sacudida de pantalla intensa, viñeta perimetral de fuego/neón pulsante (`drawFeverAura`), multiplicador de monedas x3 en todos los eventos y asistencia magnética suave (14px) para mantener el ritmo arcade frenético.
     2. **🎯 Bloque Péndulo (Harmonic Motion):** Probabilidad del 14% de aparición tras el piso 3. Se mueve con oscilación armónica física senoidal (`x = centerRef + sin(t) * range`), acelerando en el centro y frenando en los extremos. Cuenta con un haz láser de anclaje oscilatorio en el techo (`drawIsoBox`) para avisar al jugador.
     3. **💎 Catch the Loot (Botín Flotante):** Aparición de monedas de oro o gemas cósmicas prismáticas flotantes sobre la cima de la torre con giro 3D y oscilación vertical (*bobbing*). Al colocar el bloque sobre ellas, se recogen con chimes cristalinos (`playLootCollectSound`), destellos de partículas y bonificaciones de monedas (+15 🪙 / +35 💎, triplicadas en Fiebre).
   - **Fase 4 (COMPLETADA Y VERIFICADA):**
     1. **Catálogo Masivo de 501 Skins Procedurales:** Generador algorítmico determinista (`generateAllSkins`) con 1 aspecto clásico evolucionario + 10 colecciones temáticas de 50 variantes cada una (500 aspectos = 501 total): Metales Divinos, Gemas Astrales, Cyber Synthwave, Fuerzas Elementales, Bio & Naturaleza, Retro 8-Bit Arcade, Cosmos & Galaxias, Reinos & Tronos, Blindaje Hi-Tech y Míticos & Leyendas.
     2. **Sistema de Rarezas y Ventajas Pasivas:** Común (40%, 120 🪙, +0), Raro (30%, 250 🪙, +1/bloque), Épico (18%, 600 🪙, +2/bloque), Legendario (8%, 1200 🪙, +3/bloque), Mítico (4%, 2500 🪙, +5/bloque con animación `@keyframes mythicGlow`).
     3. **Shaders Procedurales Volumétricos (`drawProceduralSkin`):** 10 arquetipos de sombreado Canvas 2D en tiempo real (metálico con glint móvil, cristal con faceta diagonal, neón con bordes láser y shadowBlur, elemental, orgánico, cel-shaded pixel-art, polvo de estrellas cósmico, filigrana dorada real, fibra de carbono hi-tech y aura mítica celestial).
     4. **Audio Síntesis Dedicado por Categoría (`playSkinSound`):** Timbres Web Audio API personalizados según la textura del bloque colocado.
     5. **Cofre Misterioso Gacha (150 🪙):** Tirada aleatoria garantizada de cualquier rareza para aspectos bloqueados, con fanfarria de victoria y confeti festivo.
     6. **UI de Tienda Paginada y Fluida:** Grid virtualizado (20 aspectos por página con botones Anterior/Siguiente), pestañas de filtro horizontal por categoría con contadores (`(50)`), selector por rareza, y badge de porcentaje de progreso de colección (`X / 501`).
   - **Fase 5 (SIGUIENTE PASO):** Batallas y Efectos Visuales de Jefes (banners cinemáticos en niveles 8 y 10, mecánicas de tensión épica, y fanfare de victoria final del Núcleo del Cosmos).

    - **Fase 4.7 (Optimización Móvil Definitiva y Rediseño de Tienda 2-Columnas — 100% Verificada):**
      1. **Rediseño Móvil de la Tienda (Grilla de 2 Columnas Coleccionable):**
         - Transformación de la vista de aspectos de una lista vertical apretada de 1 columna a una grilla de 2 columnas optimizada para teléfonos móviles (8 aspectos visibles simultáneamente en pantalla sin scroll invasivo).
         - Miniatura 3D vectorial isométrica centrada de 50x50px sobre pedestal de luz radial.
         - Botón de acción único y unificado (`✓ EN USO`, `EQUIPAR`, `🪙 350`, `💎 15`, `🔒 NIVEL X`) que elimina etiquetas de precio redundantes.
         - Tapping en cualquier punto de la tarjeta acciona la compra o equipamiento para comodidad táctil.
      2. **Header de Tienda Blindado de 2 Filas (Cero Solapamientos):**
         - Fila 1: Botón `◀ VOLVER` (izquierda) y Balances compactos `🪙 1000K` y `💎 10K` (derecha), garantizando más de 170px de espacio libre entre ambos y erradicando colisiones horizontales.
         - Fila 2: Título centrado `🎨 TIENDA DE ASPECTOS` con chip `217` coleccionables sin truncamientos de texto.
      3. **Formateo Compacto de Moneda (`formatCurrencyCompact`):**
         - Valores `>= 1,000` se compactan a `K` y `>= 1,000,000` a `M`, evitando que números de 6 dígitos desborden la barra superior.
         - En pantallas de 360px (Samsung Galaxy, etc.) y 390px (iPhone), el botón `[⚙️ MENÚ]` ahora mantiene un margen de seguridad de 10px desde el borde derecho sin recorte alguno.
      4. **Potenciadores Pre-Partida y Menú Descomprimido:**
         - Altura reducida de `.pregame-boosters-card` en móvil, ahorrando 40px verticales para que la pantalla de inicio respire con holgura natural sin apretar los botones.
      5. **Purga Automática de Caché y Service Worker (`v20261014-lava-radiant`):**
         - Detección automática en `game.js` de cambio de versión que borra cachés antiguas de `CacheStorage` y fuerza `reg.update()`, garantizando que los celulares reciban el diseño fresco de inmediato sin quedar atascados en versiones cacheadas obsoletas.
      6. **Shader de Magma / Lava Incandescente de Alto Contraste (Cero Oscuridad):**
         - Eliminada por completo la roca basáltica negra opaca que volvía invisibles el bloque base y móvil contra el fondo oscuro del Nivel 1.
         - Cara superior rediseñada como un mar de lava líquida radiante con núcleo blanco-dorado solar (`#ffffff` -> `#fff6a6` -> `#ff9800`) y ondas térmicas pulsantes.
         - Caras laterales 3D volumétricas en gradientes de magma vivo (`#ff8000` a `#c71c00`), con contraste natural y cálido entre luz y sombra (nunca negro opaco).
         - Bisel perimetral incandescente en las 4 esquinas (`rgba(255, 230, 120, 0.92)` con resplandor neón de 6px), permitiendo ver con precisión milimétrica dónde empieza y termina el bloque al oscilar.
         - Resplandor térmico inferior (`shadowColor: rgba(255, 60, 0, 0.6)`) proyectando calor sobre los bloques inferiores.
         - Corrección del HUD en partida: Indicador de pisos ajustado a `${score} / ${target}` (ej. `0 / 15`), eliminando el corte de texto (`0 / 15 pis`).

       7. **Textura Procedural Orgánica de Lava Volcánica Genuina (v20261014-lava-cracked-magma):**
          - Implementado generador procedural determinista de textura de magma sobre canvas offscreen (`getLavaPattern`), con ruido multi-octava sinusoidal orgánico.
          - Elimina cualquier artefacto sintético (líneas rectas o discos planos) y cubre el bloque de magma con ríos de lava incandescentes, vetas doradas (`#ffea6c`, `#ff9900`) y micro-grietas de corteza basáltica (`#38160e`).
          - Mapeado con iluminación 3D envolvente en cara izquierda y sombra de penumbra en cara derecha, más bisel incandescente de precisión quirúrgica para el jugador.

---

## 🚀 4. Fase 5: Preparación para Google Play Store y Monetización

### 1. Modelos de Ingresos (Monetización Real)
* **Google AdMob Rewarded Video Ads:**
  - Revivir gratuito (Segunda Oportunidad) tras Game Over.
  - Multiplicador de Monedas x2 tras completar nivel.
  - Regalo diario de diamantes por ver un video bonificado.
* **Google Play In-App Billing (IAP):**
  - "Eliminar Anuncios" ($1.99 USD).
  - Paquetes de Diamantes Cósmicos ($0.99, $2.99, $6.99 USD).

### 2. Servicios de Google Play Games (GPGS)
* **Leaderboards:** Tabla de clasificación mundial de altitud máxima (Pisos alcanzados en Modo Infinito).
* **Logros (Achievements):** Mapeo de logros locales ya existentes a IDs de Google Play Games con otorgamiento de puntos de experiencia (XP) para el jugador.
* **Cloud Save:** Respaldo automático de compras, monedas y progreso en la cuenta de Google.

### 3. Empaquetado Android (TWA / Bubblewrap / PWABuilder)
* Generación de archivo firmado `.aab` (Android App Bundle).
* Assets oficiales listos: Ícono HD 512×512, Gráfico de Funciones 1024×500 y Capturas de Pantalla HD.
* Política de Privacidad activa en `privacy.html`.

---

## 🛍️ 6. Evolución y Estado Técnico de `micro-catalogo-whatsapp` (TiendaZap Studio)

### Concepto y Propuesta de Valor
Aplicación web móvil de alto rendimiento que permite a emprendedores de TikTok, Instagram, Lives y comercio local gestionar su catálogo digital, configurar su identidad visual, aceptar pagos con Yape/Plin con comprobante visual y recibir pedidos estructurados directamente en su WhatsApp sin intermediarios ni comisiones.

### Hitos Implementados y Verificados (v1.0):
1. **Asistente Guiado Paso a Paso (Onboarding Wizard) Inteligente:**
   - **Paso 0:** Bienvenida y opción para empezar desde cero o saltar directamente al Studio.
   - **Paso 1 (Datos de Negocio & Nicho):** Nombre, eslogan, WhatsApp oficial y selección dinámica de rubro:
     - 📱 *Tecnología & Digital*
     - 🍔 *Restaurantes & Comida Rápida*
     - 👗 *Moda & Ropa*
     - 💄 *Belleza & Cosmética*
     - 📦 *Tienda General*
   - **Paso 2 (Identidad Visual):** Carga de Logo/Avatar y Banner de portada con compresión Canvas 2D en memoria (< 60 KB).
   - **Paso 3 (Cobros Yape / Plin):** Configuración de número de celular, titular y foto del código QR.
   - **Paso 4 (Primer Producto):** Carga de imagen, nombre, precio y píldoras interactivas de categorías sugeridas según el rubro elegido (ej. para tecnología: *Smartphones, Audífonos, Accesorios*; para comida: *Burgers, Bebidas, Combos*).
   - **Control de Estado:** Parámetro `?nuevo=1` o `?reset=1` que resetea la sesión y abre el onboarding limpio para demostraciones.

2. **Ajuste de Modalidades por Nicho (Eliminación de "En Mesa" en Digitales):**
   - Para negocios de *Tecnología & Digital* o *Tienda General*, se suprimió por completo la opción "En Mesa" y se reemplazó por `⚡ Envío Digital (Por WhatsApp)` a costo S/ 0.00.
   - Para *Restaurantes*, se mantiene la opción `🍽️ En Mesa / Salón` con selector de número de mesa.

3. **Panel de Administración (TiendaZap Studio):**
   - Pestañas funcionales: **Mis Productos 📦**, **Ajustes & Delivery ⚙️** y **Nube & Respaldo ☁️**.
   - Acceso permanente al botón **`🪄 Asistente Guiado`** en la cabecera para reconfigurar el negocio en cualquier momento.
   - Switch rápido `🟢 Abierto` / `🔴 Cerrado`.
   - Edición rápida de precios y stock en 1 toque.
   - Botón `👁️ Ver Catálogo` para previsualizar inmediatamente la vista del cliente.

4. **Experiencia del Cliente & Checkout WhatsApp:**
   - Catálogo responsive optimizado para smartphones con botón flotante del carrito.
   - Modal de checkout con cálculo automático de subtotal, envío y total.
   - **Módulo de Pago Yape/Plin:**
     - Botón `📋 Copiar` número de celular en 1 toque.
     - Botón `🔍 Ver QR en Grande` que abre el modal a pantalla completa para escanear fácilmente.
     - Dropzone táctil para subir captura del voucher/comprobante de pago.
   - **Deep Link WhatsApp (`wa.me`):** Construcción del mensaje con formato WhatsApp legible (emojis, desglose de ítems, totales, datos de entrega y confirmación de comprobante adjunto).
   - Ticket digital post-orden con previsualización del voucher.

5. **Infraestructura, Git y Despliegues en Vivo:**
   - **Repositorio GitHub:** [https://github.com/aldairaldana/micro-catalogo-whatsapp](https://github.com/aldairaldana/micro-catalogo-whatsapp)
   - **Despliegue Web en GitHub Pages:** [https://aldairaldana.github.io/micro-catalogo-whatsapp/](https://aldairaldana.github.io/micro-catalogo-whatsapp/)
   - **Enlace Demo Limpio (Móvil):** [https://aldairaldana.github.io/micro-catalogo-whatsapp/?nuevo=1](https://aldairaldana.github.io/micro-catalogo-whatsapp/?nuevo=1)
   - `.gitignore` configurado aislando binarios (`cloudflared.exe` de 55 MB) y capturas de prueba.

---

## 🎮 7. Estado del Despliegue de `juego-stack-tower` (Core to Cosmos)
- **Empaquetado Netlify Listo:** Generado archivo zip autónomo en:
  `c:\Users\aldai\Desktop\mi-juego-netlify.zip` (1.3 MB).
- **Instrucción de Despliegue en 2 Clics:**
  1. Abrir [app.netlify.com/drop](https://app.netlify.com/drop).
  2. Arrastrar y soltar `mi-juego-netlify.zip` para obtener URL HTTPS pública instantánea.

---

## 🧭 8. Próximos Pasos y Acuerdos de Trabajo
1. **TiendaZap Studio (`micro-catalogo-whatsapp`):**
   - Repositorio y GitHub Pages 100% operativos.
   - Posibles mejoras futuras: Soporte para múltiples fotos por producto, exportación/importación del catálogo en JSON y pasarelas de pago adicionales.
2. **Juego Stack Tower (`juego-stack-tower`):**
   - ZIP para Netlify preparado en el Escritorio.
   - Preparación para Google Play Console con APK/AAB (TWA).
3. **Continuidad de Conversación:**
   - Bitácora actualizada para permitir la apertura de un nuevo chat limpio y rápido sin pérdida de contexto técnico.


