// @ts-check
// Enfoque opcional de la actualización: pedir propuestas solo para una categoría y, si se quiere,
// para temas concretos ("RAM DDR5 de 32 GB; fuente de 750 W"). Sin enfoque, todo sigue igual.

/** @typedef {import('./datos.mjs').Categoria} Categoria */
/** @typedef {import('./config.mjs').Config} Config */

export const MAX_TEMAS = 8;

/**
 * @typedef {object} Enfoque
 * @property {Categoria | null} categoria null = todas las categorías
 * @property {string[]} temas
 */

/**
 * Interpreta --categoria y --temas. "todas" o vacío = sin enfoque de categoría.
 * @param {string | undefined} categoria @param {string | undefined} temas @param {Categoria[]} categorias
 * @returns {Enfoque}
 */
export function leerEnfoque(categoria, temas, categorias) {
  const slug = (categoria ?? '').trim();
  const lista = (temas ?? '')
    .split(/[;\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (lista.length > MAX_TEMAS) throw new Error(`--temas trae ${lista.length} temas; el máximo es ${MAX_TEMAS}.`);
  if (!slug || slug === 'todas') {
    if (lista.length) throw new Error('--temas necesita --categoria: los temas se piden dentro de una categoría.');
    return { categoria: null, temas: [] };
  }
  const encontrada = categorias.find((c) => c.slug === slug);
  if (!encontrada) {
    throw new Error(`--categoria "${slug}" no existe. Usa todas o una de: ${categorias.map((c) => c.slug).join(', ')}.`);
  }
  return { categoria: encontrada, temas: lista };
}

/**
 * Cuántas propuestas pedir por categoría y cuántas búsquedas web por llamada.
 * Con enfoque, la categoría elegida recibe todo el cupo de la ejecución (MAX_PRODUCTOS_NUEVOS) en vez de
 * MAX_POR_CATEGORIA, y las búsquedas suben a 2 por tema (tope 10). Los demás límites no cambian.
 * @param {Enfoque} enfoque @param {Config} config
 */
export function limitesConEnfoque(enfoque, config) {
  if (!enfoque.categoria) {
    return { porCategoria: config.maxPorCategoria, busquedas: config.maxBusquedasPorCategoria };
  }
  const porCategoria = enfoque.temas.length
    ? Math.min(config.maxProductosNuevos, enfoque.temas.length)
    : config.maxProductosNuevos;
  const busquedas = Math.min(10, Math.max(config.maxBusquedasPorCategoria, 2 * enfoque.temas.length));
  return { porCategoria, busquedas };
}
