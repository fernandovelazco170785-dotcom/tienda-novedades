// @ts-check
// Configuración y límites de gasto. Todo se puede ajustar con variables de entorno
// (en GitHub: Settings → Secrets and variables → Actions → Variables), dentro de topes fijos.

// Precios de referencia en US$ por millón de tokens (entrada, salida) para estimar el costo.
// Fuente: documentación de Anthropic, septiembre de 2026.
// Revisa los vigentes en https://platform.claude.com/docs/en/about-claude/pricing
const PRECIOS = {
  'claude-opus-5-5': { entrada: 4, salida: 20 },
  'claude-sonnet-5-5': { entrada: 2, salida: 10 },
};
// US$ por búsqueda web (10 por cada 1.000).
const PRECIO_BUSQUEDA = 10 / 1000;

/** @typedef {keyof typeof PRECIOS} Modelo */

/**
 * @typedef {object} Config
 * @property {string} apiKey
 * @property {Modelo} modelo
 * @property {'low' | 'medium' | 'high'} esfuerzo
 * @property {boolean} busquedaWeb
 * @property {number} maxProductosNuevos total de propuestas nuevas por ejecución
 * @property {number} maxPorCategoria
 * @property {number} maxPendientes si ya hay tantos pendientes sin revisar, no se piden más
 * @property {number} maxRetiros
 * @property {number} maxBusquedasPorCategoria
 * @property {number} maxTokensRespuesta tope de cada respuesta (incluye razonamiento)
 * @property {number} maxTokensEjecucion tope de tokens (entrada + salida) de toda la ejecución
 */

/**
 * Lee un entero de una variable de entorno. Vacía = valor por defecto.
 * @param {NodeJS.ProcessEnv} env @param {string} nombre @param {number} defecto @param {number} min @param {number} max
 */
function entero(env, nombre, defecto, min, max) {
  const texto = (env[nombre] ?? '').trim();
  if (texto === '') return defecto;
  const n = Number(texto);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`${nombre}="${texto}" no es válido: usa un número entero entre ${min} y ${max}.`);
  }
  return n;
}

/** @param {NodeJS.ProcessEnv} env @returns {Config} */
export function leerConfig(env) {
  const modelo = (env.CLAUDE_MODELO ?? '').trim() || 'claude-opus-5-5';
  if (!(modelo in PRECIOS)) {
    throw new Error(`CLAUDE_MODELO="${modelo}" no está soportado. Usa uno de: ${Object.keys(PRECIOS).join(', ')}.`);
  }
  const esfuerzo = (env.CLAUDE_ESFUERZO ?? '').trim() || 'medium';
  if (!['low', 'medium', 'high'].includes(esfuerzo)) {
    throw new Error(`CLAUDE_ESFUERZO="${esfuerzo}" no es válido. Usa low, medium o high.`);
  }
  const web = (env.BUSQUEDA_WEB ?? '').trim().toLowerCase() || 'si';
  if (!['si', 'sí', 'no'].includes(web)) throw new Error(`BUSQUEDA_WEB="${web}" no es válido. Usa si o no.`);

  return {
    apiKey: (env.ANTHROPIC_API_KEY ?? '').trim(),
    modelo: /** @type {Modelo} */ (modelo),
    esfuerzo: /** @type {Config['esfuerzo']} */ (esfuerzo),
    busquedaWeb: web !== 'no',
    maxProductosNuevos: entero(env, 'MAX_PRODUCTOS_NUEVOS', 6, 0, 20),
    maxPorCategoria: entero(env, 'MAX_POR_CATEGORIA', 2, 1, 5),
    maxPendientes: entero(env, 'MAX_PENDIENTES', 12, 1, 50),
    maxRetiros: entero(env, 'MAX_RETIROS', 2, 0, 5),
    maxBusquedasPorCategoria: entero(env, 'MAX_BUSQUEDAS_POR_CATEGORIA', 3, 1, 10),
    maxTokensRespuesta: entero(env, 'MAX_TOKENS_RESPUESTA', 16000, 2000, 32000),
    maxTokensEjecucion: entero(env, 'MAX_TOKENS_EJECUCION', 400000, 20000, 2000000),
  };
}

export const MENSAJE_FALTA_CLAVE = `Falta la clave ANTHROPIC_API_KEY.
  • En GitHub: Settings → Secrets and variables → Actions → New repository secret,
    con el nombre ANTHROPIC_API_KEY y tu clave de console.anthropic.com.
  • En tu computador: copia .env.example como .env y pega la clave ahí (.env nunca se sube).
  • Para publicar pendientes sin usar la API: npm run publicar`;

/** Costo estimado en US$ (precios de lista). @param {Config} config @param {import('./claude.mjs').Uso} uso */
export function costoEstimado(config, uso) {
  const p = PRECIOS[config.modelo];
  return (uso.entrada * p.entrada + uso.salida * p.salida) / 1e6 + uso.busquedas * PRECIO_BUSQUEDA;
}
