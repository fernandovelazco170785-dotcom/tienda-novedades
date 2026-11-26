// @ts-check
// Reglas de las guías de compra (src/content/guias/*.md). Las usan el build (src/lib/guias.ts)
// y las pruebas (npm test). Si una guía no cumple, el build falla y dice qué arreglar.

import { z } from 'zod';
import { tienePrecioEscrito } from './esquema.mjs';

export const PALABRAS_MIN = 1200;
export const PALABRAS_MAX = 1800;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sinPrecio = (/** @type {string} */ t) => !tienePrecioEscrito(t);
const MSG_PRECIO = 'no escribas precios: la web nunca los muestra';

// Frontmatter de cada guía.
export const guiaSchema = z.strictObject({
  titulo: z.string().trim().min(20).max(90).refine(sinPrecio, MSG_PRECIO),
  descripcion: z.string().trim().min(70).max(160).refine(sinPrecio, MSG_PRECIO),
  // Búsqueda real a la que responde la guía (no se muestra; sirve para revisar el enfoque).
  busqueda: z.string().trim().min(5).max(120),
  categoria: z.string().regex(SLUG, 'usa el "slug" de data/categorias.json'),
  productos: z
    .array(
      z.strictObject({
        id: z.string().regex(SLUG, 'usa el id de data/products.json'),
        motivo: z.string().trim().min(20).max(280).refine(sinPrecio, MSG_PRECIO),
      }),
    )
    .min(1, 'cita al menos un producto del catálogo'),
  faq: z
    .array(
      z.strictObject({
        pregunta: z.string().trim().min(10).max(160).refine(sinPrecio, MSG_PRECIO),
        respuesta: z.string().trim().min(40).max(800).refine(sinPrecio, MSG_PRECIO),
      }),
    )
    .min(3, 'incluye al menos 3 preguntas frecuentes')
    .max(8),
  // YAML convierte 2026-11-26 en fecha; se acepta como fecha o como texto.
  publicada: z.coerce.date(),
  actualizada: z.coerce.date().optional(),
});

/** @typedef {z.infer<typeof guiaSchema>} DatosGuia */

/**
 * Cuenta palabras como lo haría un lector: sin sintaxis Markdown ni direcciones de enlaces.
 * @param {string} texto
 */
export function contarPalabras(texto) {
  const limpio = texto
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  return (limpio.match(/[\p{L}\p{N}]+(?:[-'’.,][\p{L}\p{N}]+)*/gu) ?? []).length;
}

/** Palabras de la guía tal como se lee en la página: cuerpo + preguntas frecuentes. @param {DatosGuia} data @param {string} cuerpo */
export function palabrasDeGuia(data, cuerpo) {
  return contarPalabras(cuerpo) + data.faq.reduce((n, f) => n + contarPalabras(`${f.pregunta} ${f.respuesta}`), 0);
}

/**
 * @typedef {object} Contexto
 * @property {string[]} productos ids publicados en data/products.json
 * @property {string[]} categorias slugs de data/categorias.json
 * @property {string[]} guias ids de todas las guías (para enlaces entre guías)
 */

/**
 * Enlaces internos permitidos en el cuerpo. Todo enlace debe apuntar a una página que existe.
 * @param {string} destino @param {Contexto} ctx @returns {string | null}
 */
function problemaEnlace(destino, ctx) {
  const [ruta] = destino.split('#');
  if (ruta === '' || ruta === '/' || ruta === '/guias/' || ruta === '/aviso-de-afiliado/') return null;
  let m;
  if ((m = ruta.match(/^\/producto\/([a-z0-9-]+)\/$/))) {
    return ctx.productos.includes(m[1]) ? null : `enlaza al producto "${m[1]}", que no existe en data/products.json`;
  }
  if ((m = ruta.match(/^\/categoria\/([a-z0-9-]+)\/$/))) {
    return ctx.categorias.includes(m[1]) ? null : `enlaza a la categoría "${m[1]}", que no existe`;
  }
  if ((m = ruta.match(/^\/guias\/([a-z0-9-]+)\/$/))) {
    return ctx.guias.includes(m[1]) ? null : `enlaza a la guía "${m[1]}", que no existe`;
  }
  return `el enlace "${destino}" no está permitido: solo enlaces internos como /producto/<id>/, /categoria/<slug>/ o /guias/<id>/ (con / final)`;
}

/**
 * Revisa una guía completa. Devuelve la lista de problemas (vacía si está bien).
 * @param {{ id: string, data: unknown, cuerpo: string }} guia
 * @param {Contexto} ctx
 * @returns {string[]}
 */
export function problemasDeGuia({ id, data: crudo, cuerpo }, ctx) {
  /** @type {string[]} */
  const problemas = [];
  if (!SLUG.test(id)) problemas.push(`el nombre del archivo "${id}" debe usar solo minúsculas, números y guiones`);

  const r = guiaSchema.safeParse(crudo);
  if (!r.success) {
    for (const i of r.error.issues) problemas.push(`frontmatter → ${i.path.join('.') || '(raíz)'}: ${i.message}`);
    return problemas;
  }
  const data = r.data;

  // Productos: solo del catálogo publicado, sin repetir. Nunca se inventan.
  if (!ctx.categorias.includes(data.categoria)) {
    problemas.push(`la categoría "${data.categoria}" no existe (usa: ${ctx.categorias.join(', ')})`);
  }
  const vistos = new Set();
  for (const { id: pid } of data.productos) {
    if (!ctx.productos.includes(pid)) problemas.push(`cita el producto "${pid}", que no existe en data/products.json`);
    if (vistos.has(pid)) problemas.push(`cita dos veces el producto "${pid}"`);
    vistos.add(pid);
  }

  // Cuerpo: sin precios, sin enlaces externos ni de Amazon, sin ASIN, sin HTML.
  if (tienePrecioEscrito(cuerpo)) problemas.push(MSG_PRECIO);
  if (/https?:\/\/|www\./i.test(cuerpo)) {
    problemas.push('no se permiten enlaces externos: los productos se muestran con sus tarjetas, que llevan tu enlace de afiliado');
  }
  if (/amzn\.|amazon\.[a-z]/i.test(cuerpo)) problemas.push('no escribas dominios de Amazon: el enlace va en la tarjeta del producto');
  if (/\bB0[A-Z0-9]{8}\b/.test(cuerpo)) problemas.push('no escribas ASIN en el texto');
  if (/<[a-z!/]/i.test(cuerpo)) problemas.push('no uses HTML dentro del Markdown');
  for (const [, destino] of cuerpo.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    const p = problemaEnlace(destino, ctx);
    if (p) problemas.push(p);
  }
  for (const [, destino] of cuerpo.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) {
    const p = problemaEnlace(destino, ctx);
    if (p) problemas.push(p);
  }

  // Estructura: el título va en el frontmatter y las preguntas frecuentes también.
  if (/^#\s/m.test(cuerpo)) problemas.push('no uses "# " en el cuerpo: el título (H1) sale del frontmatter');
  if (!/^##\s+Criterios de compra/im.test(cuerpo)) problemas.push('falta la sección "## Criterios de compra"');
  if (!/^##\s+Errores comunes/im.test(cuerpo)) problemas.push('falta la sección "## Errores comunes"');
  if (/^##\s+Preguntas frecuentes/im.test(cuerpo)) {
    problemas.push('las preguntas frecuentes van en el frontmatter (faq), no en el cuerpo');
  }

  // Largo.
  const palabras = palabrasDeGuia(data, cuerpo);
  if (palabras < PALABRAS_MIN || palabras > PALABRAS_MAX) {
    problemas.push(`tiene ${palabras} palabras; debe tener entre ${PALABRAS_MIN} y ${PALABRAS_MAX} (cuerpo + preguntas frecuentes)`);
  }
  return problemas;
}

/**
 * Revisa todas las guías y lanza un solo error con todos los problemas.
 * @param {{ id: string, data: unknown, cuerpo: string }[]} guias
 * @param {Omit<Contexto, 'guias'>} ctx
 */
export function validarGuias(guias, ctx) {
  const completo = { ...ctx, guias: guias.map((g) => g.id) };
  const errores = guias
    .map((g) => ({ id: g.id, problemas: problemasDeGuia(g, completo) }))
    .filter((g) => g.problemas.length > 0)
    .map((g) => `src/content/guias/${g.id}.md:\n${g.problemas.map((p) => `    ✖ ${p}`).join('\n')}`);
  if (errores.length > 0) {
    throw new Error(`Hay ${errores.length} guía(s) con errores:\n\n${errores.join('\n\n')}`);
  }
}
