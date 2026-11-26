# Instrucciones para Claude en este repositorio

Web de afiliados de Amazon (MejorCompra) hecha con Astro. Antes de cambiar algo, lee `README.md`: sus reglas valen siempre.
Escribe en español latino y tutea. Commits pequeños, con mensajes en español.

## Reglas que nunca se rompen

1. **Sin precios.** La web nunca muestra precios ni descuentos; siempre dice "Ver precio actual en Amazon".
   No agregues campos de precio ni escribas precios en títulos, descripciones o guías.
2. **Solo enlaces permitidos.** `url_afiliado` es `https://amzn.to/CODIGO` o `https://www.amazon.com/...` con
   `tag=tiendanovedad-20`. Ningún otro dominio.
3. **Nunca inventes productos, ASIN ni enlaces.** Los enlaces de afiliado los pega el dueño desde SiteStripe.
   Un producto nuevo entra a `data/pendientes.json` sin `asin` ni `url_afiliado`; solo pasa a `data/products.json`
   si el dueño te da su enlace.
4. **Sin scraping de Amazon**, ni directo ni con herramientas.
5. **Guías de compra** (`src/content/guias/`): solo productos del catálogo por su `id`, sin enlaces externos,
   entre 1200 y 1800 palabras, con "Criterios de compra", "Errores comunes" y preguntas frecuentes en el frontmatter.
   Las reglas exactas están en `src/lib/guias-reglas.mjs`.
6. **Nada de claves en el código.** Las claves van en GitHub Secrets; `.env` nunca se sube.

## Antes de terminar

```bash
npm test         # reglas de enlaces, ASIN, guías y script semanal
npm run build    # valida data/*.json y las guías; si falla, arréglalo
```

No hagas merge ni push a `main`: trabaja en una rama y deja que el dueño revise el Pull Request.
