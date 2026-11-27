# tienda-novedades

Web de afiliados de Amazon (**MejorCompra**): productos estrella y novedades en componentes y periféricos de PC.
Sitio estático hecho con [Astro](https://astro.build) y desplegado en Vercel. No tiene base de datos ni login.

## Dónde está cada cosa

| Archivo | Qué es |
|---|---|
| `data/products.json` | **Todos los productos publicados.** Es lo único que lee la web. |
| `data/pendientes.json` | Productos propuestos que esperan tu enlace de afiliado. No aparecen en la web. |
| `data/descartados.json` | Historial de productos retirados o descartados (no se vuelven a proponer). |
| `data/categorias.json` | Categorías (slug, nombre y descripción). |
| `src/lib/esquema.mjs` | Reglas que valida el build: si un producto está mal, el build falla y dice por qué. |
| `src/lib/catalogo.ts` | Lee y ordena los productos para las páginas. |
| `src/lib/proveedor.ts` | Punto para conectar la API de Amazon (foto y ranking). Hoy desactivado. |
| `src/content/guias/` | **Guías de compra** en Markdown, una por archivo. Se publican en `/guias/<archivo>/`. |
| `src/lib/guias-reglas.mjs` | Reglas que valida el build en cada guía (productos que existen, sin precios ni enlaces externos, largo, secciones). |
| `scripts/actualizar.mjs` | Actualización semanal con Claude (`npm run actualizar`) y publicación de pendientes (`npm run publicar`). |
| `.github/workflows/actualizar-catalogo.yml` | GitHub Action semanal y manual que abre el Pull Request. |
| `scripts/enviar-correo.mjs` | Aviso opcional por correo con Resend (desactivado sin clave). |
| `src/pages/` | Páginas: portada, categoría, producto, guías, aviso de afiliado, 404 y `robots.txt`. |
| `src/config.ts` | Nombre del sitio y texto del aviso de afiliado. |
| `astro.config.mjs` | URL pública del sitio (`SITE_URL`), usada en el sitemap y las URL canónicas. |
| `.github/workflows/claude.yml` | Claude en GitHub: responde cuando escribes `@claude` en un issue o PR. |
| `scripts/generar-guias.mjs` | Genera guías de compra con la API de Claude y las valida con las reglas del build. |
| `.github/workflows/generar-guias.yml` | Workflow manual que ejecuta el generador y abre un PR con las guías. |
| `CLAUDE.md` | Reglas del proyecto que Claude sigue cuando trabaja en el repositorio. |

## Formato de un producto

```json
{
  "id": "mouse-razer-viper-v3-pro",
  "asin": "B0XXXXXXXX",
  "titulo": "Mouse gamer inalámbrico Razer Viper V3 Pro, 54 g, 8000 Hz",
  "categoria": "perifericos",
  "descripcion_corta": "Por qué vale la pena, en una o dos frases.",
  "imagen": "https://m.media-amazon.com/images/I/....jpg",
  "url_afiliado": "https://amzn.to/xxxxxxx",
  "destacado": true,
  "fecha_agregado": "2026-08-23"
}
```

- `id`: minúsculas, números y guiones. Es la URL de la ficha: `/producto/<id>/`.
- `asin`: 10 caracteres en mayúscula. **Opcional con enlaces `amzn.to`** (puede ir `""` o no estar).
  Con enlaces de `www.amazon.com` se toma solo del enlace (`/dp/ASIN`); si escribes uno distinto, el build falla.
- `categoria`: el `slug` de una categoría de `data/categorias.json`.
- `url_afiliado`: solo `https://amzn.to/CODIGO` (enlace corto de SiteStripe) o `https://www.amazon.com/...`
  con `tag=tiendanovedad-20`. Cualquier otro dominio (amazon.com sin www, amazon.es, a.co…) hace fallar el build.
- `imagen`: URL `https` o `""` (se muestra "Imagen no disponible").
- `destacado`: `true` lo muestra en "Productos estrella".
- `fecha_agregado`: `AAAA-MM-DD`. "Novedades de la semana" muestra los 6 más recientes.
- **La web no muestra precios.** No hay campo de precio (el build rechaza `precio`, `price`, `descuento`…)
  y tampoco acepta precios escritos en el título o la descripción. Siempre se usa "Ver precio actual en Amazon".

## Trabajar en local

Requiere Node 22.12 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ y valida products.json
npm test         # pruebas de las reglas (enlaces, ASIN, propuestas de Claude, guías)
```

## Guías de compra

Cada guía es un archivo Markdown en `src/content/guias/`. El nombre del archivo es la URL:
`como-elegir-teclado-mecanico.md` se publica en `/guias/como-elegir-teclado-mecanico/`.
Aparecen en el menú, en la portada (una por categoría), en su página de categoría y en el sitemap.

```markdown
---
titulo: "Cómo elegir un teclado mecánico: formato, switches, conexión y la tecla ñ"
descripcion: "Entre 70 y 160 caracteres: es la meta description."
busqueda: "cómo elegir teclado mecánico"     # búsqueda real a la que responde (no se muestra)
categoria: perifericos
productos:                                 # solo ids de data/products.json, en el orden en que se muestran
  - id: teclado-aula-f75-pro
    motivo: "Por qué aparece en esta guía."
faq:                                       # mínimo 3; se muestran en la página y van al schema FAQPage
  - pregunta: "¿Pregunta?"
    respuesta: "Respuesta."
publicada: 2026-11-26
actualizada: 2026-12-10                    # opcional
---

Texto de la guía en Markdown, con `## Criterios de compra` y `## Errores comunes`.
```

**El build falla** si una guía:

- cita un producto que no existe en `data/products.json` (en `productos` o en un enlace `/producto/<id>/`);
- trae enlaces externos o de Amazon, ASIN o HTML. Los productos se muestran con su tarjeta, que lleva tu enlace
  de afiliado. Solo se permiten enlaces internos: `/producto/<id>/`, `/categoria/<slug>/`, `/guias/<id>/`;
- escribe precios (en el texto, los motivos o las preguntas);
- no tiene las secciones "Criterios de compra" y "Errores comunes", o usa `# ` (el título sale del frontmatter);
- tiene menos de 1200 o más de 1800 palabras (cuerpo + preguntas frecuentes).

Cada guía publica su JSON-LD `Article` y `FAQPage`, título, descripción y URL canónica.
El script semanal **no retira productos citados en una guía**: si Claude propone retirarlo, el resumen del PR
lo avisa para que primero lo quites de la guía.

### Generar guías con Claude

**Todos los días a las 6:00 de Lima** el workflow *Generar guías de compra* escribe 2 guías. La categoría rota
cada día (componentes → periféricos → monitores → almacenamiento) y Claude elige los temas, priorizando los
productos de esa categoría que aparecen en menos guías.

También puedes lanzarlo a mano: Actions → *Generar guías de compra* → *Run workflow*, y elige:

- **categoria**: la categoría de las guías.
- **cantidad**: de 1 a 5.
- **temas** (opcional): separados por punto y coma, por ejemplo `cómo elegir un SSD NVMe; fuente de poder para PC gamer`.
  Si no pones temas, Claude elige búsquedas reales que no repitan las guías existentes.

El workflow llama a la API con el SDK, como el script semanal (mismo modelo, búsqueda web sin Amazon y
respaldo automático); no usa Claude Code. Claude recibe el catálogo y las guías existentes, y solo puede citar
productos del catálogo. Cada guía se valida con las mismas reglas del build. Si no cumple, se le devuelven los
problemas para que la corrija, como máximo 2 veces, y si aun así falla no se incluye. Al final se abre un PR
con las guías nuevas y un resumen con el **costo estimado**, que se mergea solo (ver [Merge automático](#merge-automático)).

Variables opcionales (Settings → Secrets and variables → Actions → Variables):

| Variable | Por defecto | Qué controla |
|---|---|---|
| `MAX_BUSQUEDAS_POR_GUIA` | `5` | Búsquedas web por guía. |
| `MAX_TOKENS_RESPUESTA_GUIAS` | `20000` | Tope de cada respuesta (tope absoluto 21000). |
| `MAX_TOKENS_EJECUCION_GUIAS` | `600000` | Tope de tokens de toda la ejecución; al llegar, no genera más guías. |

`CLAUDE_MODELO`, `CLAUDE_ESFUERZO` y `BUSQUEDA_WEB` son las mismas del script semanal.
En local: `npm run generar-guias -- --categoria perifericos --cantidad 1` (lee la clave de `.env`).
Escribe las guías en `src/content/guias/` y el resumen en `tmp/resumen-guias.md`; el PR lo abres tú.
Con `--categoria auto` usa la categoría del día, como el horario diario.

## Actualización automática

Cada lunes un GitHub Action ejecuta `scripts/actualizar.mjs` y abre un **Pull Request** con los cambios,
que se mergea solo si pasan las pruebas y el build (ver [Merge automático](#merge-automático)).
Las propuestas nuevas no aparecen en la web: quedan en `data/pendientes.json` hasta que les pongas enlace.

1. **Publica** los pendientes a los que ya pegaste enlace (pasan a `products.json` con la fecha del día).
2. **Pide a Claude** propuestas nuevas por categoría. Claude busca en la web (nunca en Amazon) y redacta
   título y descripción. Entran a `data/pendientes.json` **sin ASIN ni enlace**: esos los pones tú desde SiteStripe.
   Claude no puede aportarlos: si una propuesta trae un ASIN o un enlace de Amazon en el texto, se rechaza.
3. Puede **sugerir retiros** de productos descontinuados o reemplazados (máximo 2 por semana, con fuente).
   Quedan en `data/descartados.json`, desde donde se pueden devolver copiando `item` a `products.json`.

### Publicar o descartar propuestas

En GitHub abre `data/pendientes.json` en `main` → lápiz (editar) → *Commit changes* directo a `main`:

- **Publicar una propuesta:** pega el enlace de SiteStripe en `url_afiliado` (opcional: la URL de la foto en
  `imagen`, y `"destacado": true`). Al guardar, el Action la mueve solo a `products.json`, abre un PR y lo mergea
  si pasan las pruebas y el build. Sin usar la API.
- **Descartarla:** cambia `"estado": "pendiente"` por `"estado": "descartado"`.
- **Dejarla para después:** no hagas nada. Sigue en pendientes y no aparece en la web.

Si un PR del catálogo queda abierto (no se pudo mergear solo), las ejecuciones siguientes suman cambios a ese
mismo PR; también puedes editar `data/pendientes.json` en su rama. Si lo cierras sin merge, la próxima ejecución
empieza de cero.

### Merge automático

Los PR de *Generar guías de compra* y de *Actualizar catálogo* se mergean solos, desde el mismo workflow, cuando:

1. `npm test` y `npm run build` pasaron en esa ejecución (si algo falla, el workflow se detiene y GitHub te avisa);
2. `main` no cambió mientras corría (así lo que se publica es exactamente lo que se probó).

Si no se cumple lo segundo, el PR queda abierto con un comentario y lo mergeas tú. Los dos workflows comparten
la cola `tienda-bot`, así que nunca corren a la vez.

No hace falta activar *Allow auto-merge* en Settings ni configurar reglas de rama. **No agregues** una regla que
exija aprobaciones o checks para `main`: el bot no podría mergear y los PR quedarían esperando.
Para apagar el merge automático sin tocar el código: Settings → Secrets and variables → Actions → *Variables* →
`MERGE_AUTOMATICO` = `no`. Los PR se seguirán abriendo, pero los mergeas tú.

### Configuración en GitHub (una sola vez)

1. **Secreto:** Settings → Secrets and variables → Actions → *New repository secret* →
   nombre `ANTHROPIC_API_KEY`, valor: tu clave de [console.anthropic.com](https://console.anthropic.com).
2. **Permiso para abrir PR:** Settings → Actions → General → *Workflow permissions* →
   marca *Read and write permissions* y *Allow GitHub Actions to create and approve pull requests*.
3. Opcional, **límites de gasto:** Settings → Secrets and variables → Actions → pestaña *Variables*.

| Variable | Por defecto | Qué controla |
|---|---|---|
| `CLAUDE_MODELO` | `claude-opus-5-5` | Modelo. `claude-sonnet-5-5` cuesta la mitad. |
| `CLAUDE_ESFUERZO` | `medium` | `low`, `medium` o `high`: cuánto razona Claude (y cuánto gasta). |
| `BUSQUEDA_WEB` | `si` | `no` para que Claude use solo lo que ya sabe (más barato, menos actual). |
| `MAX_PRODUCTOS_NUEVOS` | `6` | Propuestas nuevas por ejecución (tope 20). |
| `MAX_POR_CATEGORIA` | `2` | Propuestas por categoría. |
| `MAX_PENDIENTES` | `12` | Si ya hay tantos pendientes sin revisar, no se piden más (no se gasta). |
| `MAX_RETIROS` | `2` | Retiros por ejecución. `0` = nunca quitar productos. |
| `MAX_BUSQUEDAS_POR_CATEGORIA` | `3` | Búsquedas web por categoría. |
| `MAX_TOKENS_RESPUESTA` | `16000` | Tope de cada respuesta de Claude (máximo 21000). |
| `MAX_TOKENS_EJECUCION` | `400000` | Tope de tokens de toda la ejecución; al llegar, se detiene. |

Cada PR trae al final el consumo y el **costo estimado** de la ejecución. Con los valores por defecto,
`MAX_TOKENS_EJECUCION` deja cada ejecución por debajo de unos US$3 en el peor caso; lo normal debería ser
bastante menos. Revisa el costo real de las primeras semanas y ajusta los límites si hace falta.

### Ejecutar a mano

- En GitHub: Actions → *Actualizar catálogo* → *Run workflow*. Modo `solo_publicar` no usa la API ni gasta.
- **Enfocar las propuestas** (modo `completo`): elige una **categoria** y, si quieres, **temas** separados por
  punto y coma, por ejemplo `RAM DDR5 de 32 GB (2x16); fuente de poder de 750 W`. Claude solo revisa esa categoría,
  propone como máximo un producto por tema (compatible con los productos actuales cuando aplica) y la categoría
  recibe todo el cupo de `MAX_PRODUCTOS_NUEVOS`, con hasta 2 búsquedas por tema (tope 10). Máximo 8 temas.
  En local: `npm run actualizar -- --categoria componentes --temas "placa madre AM5; fuente de 750 W"`.
- En tu computador: copia `.env.example` como `.env`, pon tu clave y ejecuta `npm run actualizar`
  (o `npm run publicar`, que no necesita clave). `.env` nunca se sube a GitHub.

## Avisos

### De GitHub (ya funcionan)

- **Pull Request nuevo:** el Action te asigna el PR, y GitHub te avisa por correo y en la campana.
- **Fallas:** GitHub avisa cuando el Action falla. Revisa en [github.com/settings/notifications](https://github.com/settings/notifications)
  que en *Actions* esté marcado *Email* y *Only notify for failed workflows*.
- Las ejecuciones programadas avisan a quien modificó por última vez la línea `cron` del workflow.
  Si no te llegan, cambia tú esa línea una vez (por ejemplo, la hora) y haz commit.

### Por correo con Resend (opcional)

Al terminar cada ejecución semanal o manual te envía un resumen: productos que se agregan y se quitan,
propuestas nuevas, avisos, el enlace al PR y el costo estimado. Si la ejecución falla, avisa con el enlace
al detalle. No envía nada si no hubo cambios ni por tus propias ediciones en el PR.

Queda **desactivado** mientras no exista el secreto `RESEND_API_KEY`. Para activarlo:

1. Crea una cuenta en [resend.com](https://resend.com) y una API key (permiso *Sending access*).
2. En GitHub, Settings → Secrets and variables → Actions → *New repository secret*:
   - `RESEND_API_KEY`: la clave de Resend.
   - `CORREO_AVISOS`: tu correo (varios, separados por coma).
3. Sin dominio propio, Resend envía desde `onboarding@resend.dev` y **solo** al correo de tu cuenta de Resend.
   Si verificas un dominio en Resend, crea la variable `CORREO_REMITENTE`, por ejemplo
   `MejorCompra <avisos@tu-dominio.com>`.

## Claude en GitHub (@claude)

Escribe `@claude` en un issue o en un Pull Request y Claude trabaja en el repositorio con el modelo Opus,
usando el secreto `ANTHROPIC_API_KEY`. Solo responde a quienes tienen permiso de escritura en el repo.

- **En un issue:** describe lo que quieres y menciona a `@claude` (en el texto del issue o en un comentario).
  Claude crea una rama `claude/…`, hace los cambios, corre `npm test` y `npm run build`, y abre un Pull Request
  hacia `main`. Tú revisas la vista previa de Vercel y haces merge.
- **En un Pull Request:** comenta `@claude` con lo que quieres cambiar o preguntar. Sube los cambios a la
  rama de ese PR.
- Mientras trabaja, actualiza un comentario con su avance. Cada pedido tiene un tope de 30 minutos y 40 turnos.
- Sigue las reglas de `CLAUDE.md` (sin precios, solo enlaces permitidos, nunca inventa ASIN ni enlaces).

**Una sola vez:** instala la [GitHub App de Claude](https://github.com/apps/claude) en este repositorio.
La acción la necesita para comentar, subir ramas y abrir el PR.

## Conectar la API de Amazon (más adelante)

Cuando Amazon te dé acceso a su API de afiliados, se implementa un proveedor en `src/lib/proveedor.ts`
con las credenciales en variables de entorno de Vercel. Las páginas ya usan la foto de la API cuando existe.
**Los precios no se muestran ni con la API conectada:** la web siempre envía a "Ver precio actual en Amazon".
