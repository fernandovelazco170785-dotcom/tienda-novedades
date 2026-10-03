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
| `src/lib/proveedor.ts` | Punto para conectar la API de Amazon (precio, foto, ranking). Hoy desactivado. |
| `scripts/actualizar.mjs` | Actualización semanal con Claude (`npm run actualizar`) y publicación de pendientes (`npm run publicar`). |
| `.github/workflows/actualizar-catalogo.yml` | GitHub Action semanal y manual que abre el Pull Request. |
| `scripts/enviar-correo.mjs` | Aviso opcional por correo con Resend (desactivado sin clave). |
| `src/pages/` | Páginas: portada, categoría, producto, aviso de afiliado, 404 y `robots.txt`. |
| `src/config.ts` | Nombre del sitio y texto del aviso de afiliado. |
| `astro.config.mjs` | URL pública del sitio (`SITE_URL`), usada en el sitemap y las URL canónicas. |

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
- `asin`: 10 caracteres en mayúscula, o `""` si aún no lo tienes.
- `categoria`: el `slug` de una categoría de `data/categorias.json`.
- `url_afiliado`: enlace de SiteStripe (`amzn.to/...`) o de amazon.com con `tag=tiendanovedad-20`.
- `imagen`: URL `https` o `""` (se muestra "Imagen no disponible").
- `destacado`: `true` lo muestra en "Productos estrella".
- `fecha_agregado`: `AAAA-MM-DD`. "Novedades de la semana" muestra los 6 más recientes.
- **No escribas precios** en el título ni en la descripción: el build los rechaza. El precio se ve en Amazon.

## Trabajar en local

Requiere Node 22.12 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ y valida products.json
```

## Actualización automática

Cada lunes un GitHub Action ejecuta `scripts/actualizar.mjs` y abre un **Pull Request** con los cambios.
Nada llega a la web hasta que haces merge.

1. **Publica** los pendientes a los que ya pegaste enlace (pasan a `products.json` con la fecha del día).
2. **Pide a Claude** propuestas nuevas por categoría. Claude busca en la web (nunca en Amazon) y redacta
   título y descripción. Entran a `data/pendientes.json` **sin ASIN ni enlace**: esos los pones tú desde SiteStripe.
3. Puede **sugerir retiros** de productos descontinuados o reemplazados (máximo 2 por semana, con fuente).
   Quedan en `data/descartados.json`, desde donde se pueden devolver copiando `item` a `products.json`.

### Revisar el Pull Request

- **Publicar una propuesta:** en el PR abre `data/pendientes.json` → editar → pega el enlace de SiteStripe en
  `url_afiliado` (opcional: la URL de la foto en `imagen`, y `"destacado": true`). Al guardar en esa rama,
  el Action la mueve solo a `products.json` en el mismo PR.
- **Descartarla:** cambia `"estado": "pendiente"` por `"estado": "descartado"`.
- **Dejarla para después:** no hagas nada. Sigue en pendientes y no aparece en la web.
- Revisa la vista previa de Vercel del PR y haz **merge**.

Mientras el PR esté abierto, las ejecuciones siguientes suman cambios al mismo PR.
Si lo cierras sin merge, la próxima ejecución empieza de cero.

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
| `MAX_TOKENS_RESPUESTA` | `16000` | Tope de cada respuesta de Claude. |
| `MAX_TOKENS_EJECUCION` | `400000` | Tope de tokens de toda la ejecución; al llegar, se detiene. |

Cada PR trae al final el consumo y el **costo estimado** de la ejecución. Con los valores por defecto,
`MAX_TOKENS_EJECUCION` deja cada ejecución por debajo de unos US$3 en el peor caso; lo normal debería ser
bastante menos. Revisa el costo real de las primeras semanas y ajusta los límites si hace falta.

### Ejecutar a mano

- En GitHub: Actions → *Actualizar catálogo* → *Run workflow*. Modo `solo_publicar` no usa la API ni gasta.
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

## Conectar la API de Amazon (más adelante)

Cuando Amazon te dé acceso a su API de afiliados, se implementa un proveedor en `src/lib/proveedor.ts`
con las credenciales en variables de entorno de Vercel. Las páginas ya usan esos datos: muestran el precio
con su fecha y hora, y la foto de la API. Sin proveedor, siguen mostrando "Ver precio actual en Amazon".
Para usar precios, Amazon exige actualizarlos al menos cada 24 horas: habría que recompilar el sitio a diario.
