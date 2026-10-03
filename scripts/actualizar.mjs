// @ts-check
// Actualización del catálogo. Dos modos:
//   npm run actualizar   → publica pendientes con enlace + pide propuestas nuevas a Claude (usa la API)
//   npm run publicar     → solo publica pendientes con enlace (sin API, sin costo)
// Escribe data/*.json y un resumen en tmp/resumen.md y tmp/resumen.json.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { costoEstimado, leerConfig, MENSAJE_FALTA_CLAVE } from './lib/config.mjs';
import {
  agregarPropuestas,
  aplicarRetiros,
  conocidos,
  guardarDatos,
  leerDatos,
  publicarListos,
} from './lib/datos.mjs';
import { crearCliente, describirError, esErrorFatal, pedirPropuestas, usoVacio } from './lib/claude.mjs';
import { resumenJson, resumenMarkdown } from './lib/resumen.mjs';

/** @typedef {import('./lib/resumen.mjs').Resumen} Resumen */
/** @typedef {import('./lib/datos.mjs').Datos} Datos */
/** @typedef {import('./lib/config.mjs').Config} Config */

const DIR_DATOS = process.env.CATALOGO_DIR || 'data';
const DIR_RESUMEN = process.env.RESUMEN_DIR || 'tmp';

function fechaDeHoy() {
  const fija = process.env.FECHA_HOY; // solo para pruebas
  if (fija) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fija)) throw new Error('FECHA_HOY debe tener el formato AAAA-MM-DD');
    return fija;
  }
  return new Date().toISOString().slice(0, 10);
}

/**
 * Pide propuestas a Claude categoría por categoría, respetando todos los límites.
 * @param {Datos} datos @param {Config} config @param {string} hoy @param {Resumen} resumen
 * @returns {Promise<boolean>} true si todas las categorías fallaron por errores de la API
 */
async function proponer(datos, config, hoy, resumen) {
  const sinRevisar = datos.pendientes.length;
  if (sinRevisar >= config.maxPendientes) {
    resumen.avisos.push(
      `No se pidieron propuestas: hay ${sinRevisar} pendientes sin revisar (límite MAX_PENDIENTES=${config.maxPendientes}).`,
    );
    return false;
  }
  let cupoTotal = Math.min(config.maxProductosNuevos, config.maxPendientes - sinRevisar);
  if (cupoTotal === 0) {
    resumen.avisos.push('No se pidieron propuestas: MAX_PRODUCTOS_NUEVOS es 0.');
    return false;
  }

  const cliente = crearCliente(config);
  const uso = usoVacio();
  const cuantos = (/** @type {string} */ slug) => datos.productos.filter((p) => p.categoria === slug).length;
  // Primero las categorías con menos productos: si se acaba el presupuesto, quedan cubiertas las que más lo necesitan.
  const categorias = [...datos.categorias].sort((a, b) => cuantos(a.slug) - cuantos(b.slug));
  // Dos productos de categorías distintas como ejemplo de estilo.
  const ejemplos = datos.categorias
    .map((c) => datos.productos.find((p) => p.categoria === c.slug))
    .filter((p) => p !== undefined)
    .slice(0, 2);

  /** @type {{ id: string, categoria: string, motivo: string, fuentes: string[] }[]} */
  const retiros = [];
  let correctas = 0;
  let fallidas = 0;

  for (const [i, categoria] of categorias.entries()) {
    if (cupoTotal === 0) break;
    if (uso.entrada + uso.salida >= config.maxTokensEjecucion) {
      const omitidas = categorias.slice(i).map((c) => c.nombre).join(', ');
      resumen.avisos.push(`Se alcanzó MAX_TOKENS_EJECUCION; quedaron sin revisar: ${omitidas}.`);
      break;
    }
    const cupo = Math.min(config.maxPorCategoria, cupoTotal);
    console.log(`→ ${categoria.nombre}: pidiendo hasta ${cupo} propuesta(s)…`);
    try {
      const r = await pedirPropuestas({
        cliente,
        config,
        uso,
        contexto: {
          categoria,
          actuales: datos.productos.filter((p) => p.categoria === categoria.slug),
          conocidos: conocidos(datos),
          ejemplos,
          cupo,
          hoy,
        },
      });
      correctas += 1;
      if (r.aviso) resumen.avisos.push(`${categoria.nombre}: ${r.aviso}.`);
      const { agregadas, rechazadas } = agregarPropuestas(datos, categoria.slug, r.propuestas, cupo, hoy);
      cupoTotal -= agregadas.length;
      resumen.propuestas.push(...agregadas);
      for (const motivo of rechazadas) resumen.avisos.push(`${categoria.nombre}, propuesta no aceptada: ${motivo}.`);
      retiros.push(...r.retiros.map((x) => ({ ...x, categoria: categoria.slug })));
      console.log(`  ${agregadas.length} aceptada(s), ${rechazadas.length} rechazada(s), ${r.retiros.length} retiro(s) sugerido(s)`);
    } catch (error) {
      if (esErrorFatal(error)) throw new Error(describirError(error));
      fallidas += 1;
      resumen.avisos.push(`${categoria.nombre}: ${describirError(error)}`);
      console.error(`  ✖ ${describirError(error)}`);
    }
  }

  const { retirados, ignorados } = aplicarRetiros(datos, retiros, config.maxRetiros, hoy);
  resumen.retirados = retirados;
  for (const motivo of ignorados) resumen.avisos.push(`Retiro no aplicado: ${motivo}.`);

  resumen.consumo = {
    modelo: uso.modelos.join(' + ') || config.modelo,
    llamadas: uso.llamadas,
    entrada: uso.entrada,
    salida: uso.salida,
    busquedas: uso.busquedas,
    costo: costoEstimado(config, uso),
  };
  return correctas === 0 && fallidas > 0;
}

async function main() {
  const { values } = parseArgs({ options: { modo: { type: 'string', default: 'completo' } } });
  const modo = values.modo;
  if (modo !== 'completo' && modo !== 'solo_publicar') {
    throw new Error(`--modo "${modo}" no es válido. Usa completo o solo_publicar.`);
  }

  const config = leerConfig(process.env);
  if (modo === 'completo' && !config.apiKey) {
    console.error(`✖ ${MENSAJE_FALTA_CLAVE}`);
    process.exitCode = 1;
    return;
  }

  const hoy = fechaDeHoy();
  const datos = await leerDatos(DIR_DATOS);

  /** @type {Resumen} */
  const resumen = {
    fecha: hoy,
    modo,
    publicados: [],
    retirados: [],
    propuestas: [],
    descartados: [],
    pendientesSinRevisar: 0,
    avisos: [],
    consumo: null,
  };

  const publicacion = publicarListos(datos, hoy);
  resumen.publicados = publicacion.publicados;
  resumen.descartados = publicacion.descartadosAhora;
  resumen.avisos.push(...publicacion.errores);

  const fallaronTodas = modo === 'completo' ? await proponer(datos, config, hoy, resumen) : false;
  resumen.pendientesSinRevisar = datos.pendientes.length;

  await guardarDatos(DIR_DATOS, datos);
  await mkdir(DIR_RESUMEN, { recursive: true });
  const markdown = resumenMarkdown(resumen);
  await writeFile(join(DIR_RESUMEN, 'resumen.md'), markdown, 'utf8');
  await writeFile(join(DIR_RESUMEN, 'resumen.json'), `${JSON.stringify(resumenJson(resumen), null, 2)}\n`, 'utf8');

  console.log(`\n${markdown}`);
  if (fallaronTodas) {
    console.error('✖ Ninguna categoría se pudo procesar por errores de la API (ver avisos).');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
