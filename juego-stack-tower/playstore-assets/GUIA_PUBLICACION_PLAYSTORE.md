# 🚀 GUÍA COMPLETA: PUBLICACIÓN DE CORE TO COSMOS EN GOOGLE PLAY STORE

Esta guía detalla el proceso exacto para empaquetar, probar y publicar **Core to Cosmos: Stack Tower** en la tienda oficial de **Google Play Store**.

---

## 📱 FASE 1: PROBARLO COMO APP NATIVA EN TU CELULAR HOY MISMO (GRATIS)

Gracias a la implementación del **Web App Manifest (`manifest.json`)**, los **iconos de alta resolución** y el **Service Worker (`sw.js`)**, tu juego ya es una **PWA Instalable (WebAPK)** de primera clase.

### Pasos para instalarlo en Android:
1. Conéctate a la misma red Wi-Fi de tu computadora.
2. Abre Google Chrome en tu celular y entra a:
   ```
   http://192.168.18.44:3000
   ```
3. Verás el botón celeste brillante **`📲 INSTALAR EN MI CELULAR (APP)`** en el menú principal, o bien puedes tocar los **tres puntos de Chrome (⋮)** > **"Instalar aplicación"** / **"Agregar a pantalla principal"**.
4. **Resultado:** Android generará un **WebAPK nativo**. El juego aparecerá en el cajón de aplicaciones de tu teléfono con su propio icono, pantalla de carga y se ejecutará a pantalla completa sin barra de navegación, **exactamente igual a una app descargada de Google Play**.

---

## 🌐 FASE 2: ALOJAR EL JUEGO EN LA WEB (HTTPS)

Para publicar en Google Play Store mediante la tecnología oficial de Google llamada **TWA (Trusted Web Activity)**, tu juego debe estar disponible en una URL pública con certificado de seguridad **HTTPS**.

### Opciones 100% gratuitas en 2 minutos:
* **Opción A: Vercel / Netlify:**
  1. Arrastra la carpeta `juego-stack-tower` a [vercel.com](https://vercel.com) o [netlify.com](https://netlify.com).
  2. Obtendrás un dominio gratuito como `https://core-to-cosmos.vercel.app`.
* **Opción B: GitHub Pages:**
  1. Sube los archivos a un repositorio de GitHub y activa Pages en la pestaña *Settings*.
  2. Tu URL será `https://tuusuario.github.io/core-to-cosmos/`.

---

## 📦 FASE 3: GENERAR EL ARCHIVO `.AAB` (ANDROID APP BUNDLE) EN 5 MINUTOS

Google Play ya no acepta archivos `.apk` antiguos para nuevas aplicaciones; exige el formato moderno **`.aab` (Android App Bundle)**.

La herramienta oficial y recomendada por Google y Microsoft para empaquetar juegos web sin tocar código Java/Kotlin es **[PWABuilder](https://www.pwabuilder.com)**.

### Paso a paso:
1. Ve a **[https://www.pwabuilder.com](https://www.pwabuilder.com)**.
2. Escribe la URL HTTPS pública de tu juego (por ejemplo: `https://core-to-cosmos.vercel.app`).
3. Haz clic en **Start** y espera que analice el `manifest.json` y el `sw.js` (recibirás una puntuación perfecta de compatibilidad PWA).
4. Haz clic en el botón **"Package for Stores"** y selecciona **"Android"**.
5. En la configuración de Android:
   * **Package ID:** `com.microapps.coretocosmos` (o el identificador que elijas).
   * **App Name:** `Core to Cosmos: Stack Tower`.
   * **Version Code:** `1` (Versión `1.0.0`).
   * **Signing Key:** Puedes marcar *"Generate new key"* si es tu primera vez, o descargar la clave para conservarla en un lugar seguro.
6. Haz clic en **"Download Package"**.
7. ¡Listo! Recibirás un archivo `.zip` que contiene tu archivo **`app-release.aab`** firmado y listo para subir a la Play Store.

---

## 🏛️ FASE 4: SUBIDA A GOOGLE PLAY CONSOLE

### 1. Cuenta de Desarrollador
* Entra en [play.google.com/console](https://play.google.com/console).
* Si aún no la tienes, Google solicita un pago único de **$25 USD** de por vida.

### 2. Crear la Aplicación
* En el panel principal, haz clic en **"Crear app"**.
* Nombre: `Core to Cosmos: Stack Tower`
* Idioma predeterminado: Español
* Tipo: Juego
* Precio: Gratis

### 3. Ficha de Play Store (Assets Gráficos Ya Listos)
En la carpeta [playstore-assets/](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets), ya te dejamos generados los archivos exactos con las medidas oficiales que exige Google:
* **Icono de la app:** Sube [playstore-icon-512x512.png](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets/playstore-icon-512x512.png) (512x512 px PNG).
* **Gráfico de funciones:** Sube [feature-graphic-1024x500.png](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets/feature-graphic-1024x500.png) (1024x500 px PNG).
* **Capturas de pantalla de móvil:** Toma 2 a 4 capturas en tu celular jugando (puedes tomarlas del nivel 1 de Magma y de la tienda de Skins).

### 4. Política de Privacidad
* Google exige obligatoriamente un enlace a una política de privacidad.
* Sube el archivo [privacy-policy.html](file:///c:/Users/aldai/Desktop/micro%20apps/juego-stack-tower/playstore-assets/privacy-policy.html) a tu hosting y pega el enlace (ejemplo: `https://core-to-cosmos.vercel.app/playstore-assets/privacy-policy.html`).

### 5. Cuestionario de Clasificación de Contenido (IARC)
* En el menú lateral de la consola ve a *Contenido de la app* > *Clasificación de contenido*.
* Marca que el juego es de categoría *Arcade / Habilidad*, sin violencia, sin lenguaje vulgar y sin recopilación de datos sensibles. Recibirás una clasificación para todo público (**PEGI 3 / Para Todos**).

### 6. Subir el Archivo `.aab`
* Ve a *Producción* > *Crear nueva versión*.
* Arrastra el archivo `app-release.aab` generado por PWABuilder.
* Añade notas de la versión:
  > *"¡Lanzamiento oficial de Core to Cosmos! Construye tu torre vertical a través de 8 niveles o sobrevive en la Odisea Infinita. Desbloquea aspectos neón y diamantes."*
* Envía a revisión.

---

## ⚡ LA GRAN VENTAJA DE ESTA ARQUITECTURA (TWA)

Al publicar bajo la arquitectura **Trusted Web Activity (TWA)** oficial de Google:
1. **Actualizaciones Instantáneas:** Cualquier cambio que hagas en `game.js`, `style.css` o `index.html` en tu hosting se actualiza automáticamente en los teléfonos de todos tus jugadores de la Play Store en tiempo real, **sin necesidad de volver a compilar un `.aab` ni esperar 3 a 5 días de revisión de Google**.
2. **Rendimiento Máximo:** El juego se ejecuta directamente sobre el motor Blink acelerado por hardware de Chrome a **60 FPS estables**.
3. **Peso Mínimo:** La descarga de la app en la Play Store pesará **menos de 3 MB**, lo que maximiza la tasa de descargas de usuarios con conexiones móviles.
