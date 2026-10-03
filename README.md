# tienda-novedades

Web de afiliados de Amazon (**MejorCompra**): productos estrella y novedades en componentes y periféricos de PC.
Sitio estático hecho con [Astro](https://astro.build) y desplegado en Vercel. No tiene base de datos ni login.

## Dónde está cada cosa

| Archivo | Qué es |
|---|---|
| `data/products.json` | **Todos los productos publicados.** Es lo único que hay que editar para cambiar el catálogo. |
| `data/categorias.json` | Categorías (slug, nombre y descripción). |
| `src/lib/esquema.mjs` | Reglas que valida el build: si un producto está mal, el build falla y dice por qué. |
| `src/lib/catalogo.ts` | Lee y ordena los productos para las páginas. |
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
