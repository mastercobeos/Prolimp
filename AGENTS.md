<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Prolimp — errores comunes y cómo evitarlos

Estos son bugs reales que ocurrieron en este proyecto. Léelos antes de tocar código nuevo.

## Sanity + React (versiones de peers)

- **Sanity Studio requiere React 19.2.7+** (por `@portabletext/editor`).
  Si `package.json` tiene `react: 19.2.4` fijo, Studio renderiza en blanco con error "Invalid hook call" (dos copias de React coexistiendo). Usa `^19.2.8` como mínimo.

- **`@sanity/image-url` v2.1.1** quitó el subpath `/lib/types/types`.
  Importa `SanityImageSource` desde el paquete raíz:
  ```ts
  import type { SanityImageSource } from "@sanity/image-url";  // ✓
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";  // ✗ deprecated
  ```

## Sanity documentos

- **Los slugs con caracteres especiales rompen `createOrReplace`.**
  Símbolos como `″` (pulgadas), `'`, `` ` ``, tildes, ñ crashean con "not a valid document ID". Usa una función `cleanSlug` que:
  1. Normaliza acentos (`normalize("NFD").replace(/[\u0300-\u036f]/g, "")`)
  2. Reemplaza `″"'` por `in` o vacío
  3. Colapsa a `[a-z0-9-]+`
  4. Trunca a máx 96 chars

- **Todos los ítems de un array en Sanity necesitan `_key` único.**
  Bloques de portable text, galería, presentaciones, secciones — cada uno debe llevar `_key: crypto.randomBytes(6).toString("hex")`. Sin `_key` el Studio muestra warning "Missing keys" y no permite editar.

## Vercel deployment

- **Env vars deben configurarse en Vercel dashboard.**
  El build de `/sitemap.xml`, generateStaticParams de productos, etc. corren en build time y consultan Sanity. Sin envs → build falla en "Failed to collect page data".
  Variables requeridas:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - `SANITY_API_WRITE_TOKEN` (server-only, para scripts)
  - `PEXELS_API_KEY` (server-only)

- **TypeScript strict en Vercel** — `npx tsc --noEmit` local debe pasar cero errores antes de push. Turbopack dev es más permisivo que el build de producción.

- **Vercel image optimizer devuelve HTTP 402 en plan Hobby** cuando pasas el límite mensual (~1000 imágenes optimizadas).
  Síntoma: imágenes rotas en producción, `/_next/image?url=...` devuelve 402 Payment Required.
  Fix: setear `images.unoptimized: true` en `next.config.ts`. Si tus imágenes ya vienen optimizadas de la fuente (Sanity CDN, Unsplash, WebP locales), el optimizer de Vercel es redundante y solo quema quota.

## CSS / positioning

- **`position: fixed` dentro de un padre con `transform` NO es fijo al viewport.**
  El `transform` del padre crea un containing block. Solución: `createPortal` a `document.body` para modales/overlays.
  Ejemplo del bug: SearchBox estaba dentro de `.header` que tiene `transform: translateX(-50%)`. El overlay `position: fixed; inset: 0` se anclaba al header pill (68px) en vez del viewport.

- **CSS Modules hashea TODAS las clases.**
  Para composición `.classA.classB { ... }`, en JSX aplicar `clsx(s.classA, s.classB)` — no `s.classA` + `"classB"` string literal.

- **`clip-path: inset(N round 999px)`** en un elemento ancho crea forma circular gigante.
  Si el contenedor mide 1240x400px con `round 999px`, se ve como círculo. Usa el round sin unidad rígida o aplícalo solo a elementos donde tenga sentido (pills).

- **Backdrop-filter sobre overlay dim** puede crear halo rectangular visible.
  Cuando el overlay tiene `background: rgba(...)` semi-transparente Y el pill encima tiene `backdrop-filter: brightness(1.10)`, el composite crea una "isla" más clara. Solución: overlay 100% transparente o quitar el brightness del pill.

## Windows dev environment

- **PowerShell no soporta env vars inline al estilo bash.**
  `PORT=3020 npm run dev` NO funciona en PowerShell. Usa:
  ```powershell
  $env:PORT=3020; npm run dev
  ```
  O instala `cross-env` para scripts npm portátiles.

- **`Remove-Item -Recurse -Force node_modules` es MUY lento en Windows.**
  Windows PowerShell borrando `node_modules` (60k+ archivos) tarda 5-10 min. Alternativa `cmd`:
  ```powershell
  cmd /c "rd /s /q node_modules"
  ```
  30 segundos en vez de 10 minutos.

- **Windows bloquea archivos en uso** — no se pueden mover/borrar mientras el dev server corre.
  Antes de mover carpetas grandes (`web/`, `.next/`), detén el dev server. Si no cede, usa `xcopy` para copiar + `rd /s /q` para borrar.

- **Múltiples `package-lock.json`** confunden a Next.js sobre workspace root.
  Si haces `npm install` accidentalmente en una carpeta padre, crea un lockfile vacío que Next agarra como workspace. Warning: "We detected multiple lockfiles". Borra el fantasma.

## Turbopack (Next 16)

- **Caché de `.next/dev` sensible a Windows.**
  Con "Slow filesystem detected" el caché de Turbopack se corrompe intermitentemente. Errores típicos:
  - `Could not find the module "..." in the React Client Manifest`
  - `Cannot find module '@swc/helpers-XXXX/_/_interop_require_default'`
  Fix: `cmd /c "rd /s /q .next"` y reiniciar dev server.

## Rendering / hydration

- **Componentes con hooks deben ser client** (`"use client"`).
  El SearchBox usa `useState`, `useEffect`, `useRef` → client component. Si lo importas en un server component sin marcar, Next crashea silenciosamente en SSR.

- **`createPortal` requiere que estemos en cliente.**
  Antes de llamar `createPortal(..., document.body)`, verificar `mounted` state para evitar errores de hidratación.
