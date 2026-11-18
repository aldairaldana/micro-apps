# Regla Obligatoria: Siempre ejecutar Git Push

Siempre que se realicen cambios, mejoras o correcciones en el código (HTML, CSS, JS, etc.):
1. Sincronizar los archivos entre `c:\Users\aldai\Desktop\tiendazap` y `c:\Users\aldai\Desktop\micro apps\micro-catalogo-whatsapp`.
2. Realizar `git add`, `git commit` y **`git push` obligatorio** inmediatamente a `origin main`:
   - `git -C "c:\Users\aldai\Desktop\tiendazap" push origin main`
   - `git -C "c:\Users\aldai\Desktop\micro apps\micro-catalogo-whatsapp" push origin main`
3. El usuario siempre prueba y revisa los cambios directamente en la web en vivo (`https://tiendazap.pages.dev`). Nunca omitir ni olvidar el `git push`.
