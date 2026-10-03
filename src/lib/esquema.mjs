// @ts-check
// Reglas que deben cumplir data/products.json y data/categorias.json.
// Se usan en el build (si algo no cumple, el build falla con un mensaje claro)
// y en los scripts de actualización. Archivo .mjs para poder usarlo desde Node sin compilar.

import { z } from 'zod';

export const TAG_AFILIADO = 'tiendanovedad-20';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ASIN = /^[A-Z0-9]{10}$/;
// Detecta precios escritos a mano: "$59", "59 USD", "12 dólares"…
const PRECIO_FIJO = /\$\s?\d|\d\s?(?:usd|us\$|d[oó]lares)\b/i;

const sinPrecios = (/** @type {string} */ texto) => !PRECIO_FIJO.test(texto);
const MSG_SIN_PRECIOS = 'no escribas precios fijos; el precio se ve en Amazon';

/**
 * Devuelve el problema del enlace de afiliado, o null si está bien.
 * Acepta enlaces de amazon.com con tu tag o enlaces cortos amzn.to de SiteStripe.
 * @param {string} valor
 * @returns {string | null}
 */
export function problemaUrlAfiliado(valor) {
  let url;
  try {
    url = new URL(valor);
  } catch {
    return 'no es una URL válida';
  }
  if (url.protocol !== 'https:') return 'debe empezar con https://';
  if (url.hostname === 'amzn.to') return null;
  if (url.hostname !== 'www.amazon.com' && url.hostname !== 'amazon.com') {
    return 'debe ser un enlace de amazon.com o amzn.to';
  }
  if (url.searchParams.get('tag') !== TAG_AFILIADO) return `debe llevar tag=${TAG_AFILIADO}`;
  return null;
}

/**
 * Extrae el ASIN de un enlace largo de Amazon (/dp/ASIN o /gp/product/ASIN).
 * Los enlaces amzn.to no lo muestran: devuelve null.
 * @param {string} valor
 * @returns {string | null}
 */
export function asinDeUrl(valor) {
  const m = valor.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?#]|$)/);
  return m ? m[1] : null;
}

export const categoriaSchema = z.strictObject({
  slug: z.string().regex(SLUG, 'usa solo minúsculas, números y guiones (ej: "perifericos")'),
  nombre: z.string().trim().min(2),
  descripcion: z.string().trim().min(10).max(200),
});

export const productoSchema = z
  .strictObject({
    id: z.string().regex(SLUG, 'usa solo minúsculas, números y guiones (ej: "mouse-razer-viper")'),
    asin: z.union([z.literal(''), z.string().regex(ASIN, 'el ASIN tiene 10 letras/números en mayúscula')]),
    titulo: z.string().trim().min(5).max(140).refine(sinPrecios, MSG_SIN_PRECIOS),
    categoria: z.string().regex(SLUG, 'usa el "slug" de data/categorias.json'),
    descripcion_corta: z.string().trim().min(20).max(320).refine(sinPrecios, MSG_SIN_PRECIOS),
    imagen: z.union([z.literal(''), z.url({ protocol: /^https$/, error: 'debe ser una URL https o quedar vacía' })]),
    url_afiliado: z.string().superRefine((valor, ctx) => {
      const problema = problemaUrlAfiliado(valor);
      if (problema) ctx.addIssue({ code: 'custom', message: problema });
    }),
    destacado: z.boolean(),
    fecha_agregado: z.iso.date({ error: 'usa el formato AAAA-MM-DD' }),
  })
  .superRefine((p, ctx) => {
    const asinEnlace = asinDeUrl(p.url_afiliado);
    if (asinEnlace && p.asin && asinEnlace !== p.asin) {
      ctx.addIssue({
        code: 'custom',
        path: ['asin'],
        message: `no coincide con el ASIN del enlace (${asinEnlace})`,
      });
    }
  });

/** @typedef {z.infer<typeof productoSchema>} Producto */
/** @typedef {z.infer<typeof categoriaSchema>} Categoria */

const sangrar = (/** @type {string} */ texto) => texto.replace(/^/gm, '    ');

/**
 * Valida el catálogo completo. Si hay errores lanza uno solo que los lista todos.
 * @param {unknown} productosCrudos contenido de data/products.json
 * @param {unknown} categoriasCrudas contenido de data/categorias.json
 * @returns {{ productos: Producto[], categorias: Categoria[] }}
 */
export function validarCatalogo(productosCrudos, categoriasCrudas) {
  const cats = z.array(categoriaSchema).min(1).safeParse(categoriasCrudas);
  if (!cats.success) {
    throw new Error(`data/categorias.json tiene errores:\n${sangrar(z.prettifyError(cats.error))}`);
  }
  const slugs = cats.data.map((c) => c.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('data/categorias.json tiene slugs repetidos');
  }

  if (!Array.isArray(productosCrudos)) {
    throw new Error('data/products.json debe ser una lista: [ {...}, {...} ]');
  }

  /** @type {string[]} */
  const errores = [];
  /** @type {Producto[]} */
  const productos = [];
  const ids = new Set();
  const asins = new Set();

  productosCrudos.forEach((crudo, i) => {
    const id = crudo && typeof crudo.id === 'string' ? ` (id: ${crudo.id})` : '';
    const etiqueta = `Producto #${i + 1}${id}`;
    const r = productoSchema.safeParse(crudo);
    if (!r.success) {
      errores.push(`${etiqueta}:\n${sangrar(z.prettifyError(r.error))}`);
      return;
    }
    const p = r.data;
    if (!slugs.includes(p.categoria)) {
      errores.push(`${etiqueta}: la categoría "${p.categoria}" no existe (usa: ${slugs.join(', ')})`);
    }
    if (ids.has(p.id)) errores.push(`${etiqueta}: el id está repetido`);
    if (p.asin && asins.has(p.asin)) errores.push(`${etiqueta}: el ASIN ${p.asin} está repetido`);
    ids.add(p.id);
    if (p.asin) asins.add(p.asin);
    productos.push(p);
  });

  if (errores.length > 0) {
    throw new Error(`data/products.json tiene ${errores.length} error(es):\n\n${errores.join('\n\n')}`);
  }
  return { productos, categorias: cats.data };
}
