// @ts-check
// Genera guías de compra con la API de Claude (sin Claude Code), las valida con las reglas del build
// y las escribe en src/content/guias/. El Pull Request lo abre el workflow generar-guias.yml.
//
//   node scripts/generar-guias.mjs --categoria perifericos --cantidad 2 [--temas "tema 1; tema 2"]
//   node scripts/generar-guias.mjs --categoria auto --cantidad 2     (rota la categoría cada día)
//
// Usa los mismos límites que el script semanal (MAX_TOKENS_EJECUCION, MAX_TOKENS_RESPUESTA,
// MAX_BUSQUEDAS_POR_CATEGORIA como búsquedas por guía, CLAUDE_MODELO, CLAUDE_ESFUERZO, BUSQUEDA_WEB).
// Escribe un resumen con el costo estimado en tmp/resumen-guias.md y tmp/resumen-guias.json.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { costoEstimado, leerConfig, MENSAJE_FALTA_CLAVE } from './lib/config.mjs';
import { crearCliente, describirError, esErrorFatal, usoVacio } from './lib/claude.mjs';
import { leerGuias } from './lib/guias.mjs';
import {
  aMarkdown,
  categoriaDelDia,
  generarGuia,
  MAX_GUIAS,
  palabras,
  planificarTemas,
  problemasDeGuiaNueva,
  resumenGeneracion,
} from './lib/generar-guias.mjs';
import { validarCatalogo } from '../src/lib/esquema.mjs';
import { validarGuias } from '../src/lib/guias-reglas.mjs';

const DIR_DATOS = process.env.CATALOGO_DIR || 'data';
const DIR_GUIAS = process.env.GUIAS_DIR || 'src/content/guias';
const DIR_RESUMEN = process.env.RESUMEN_DIR || 'tmp';

function fechaDeHoy() {
  const fija = process.env.FECHA_HOY; // solo para pruebas
  if (fija) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fija)) throw new Error('FECHA_HOY debe tener el formato AAAA-MM-DD');
    return fija;
  }
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const { values } = parseArgs({
    options: {
      categoria: { type: 'string' },
      cantidad: { type: 'string', default: '1' },
      temas: { type: 'string', default: '' },
    },
  });

  const config = leerConfig(process.env);
  if (!config.apiKey) {
    console.error(`✖ ${MENSAJE_FALTA_CLAVE}`);
    process.exitCode = 1;
    return;
  }

  const cantidad = Number(values.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_GUIAS) {
    throw new Error(`--cantidad "${values.cantidad}" no es válida: usa un número entre 1 y ${MAX_GUIAS}.`);
  }

  const { productos, categorias } = validarCatalogo(
    JSON.parse(await readFile(join(DIR_DATOS, 'products.json'), 'utf8')),
    JSON.parse(await readFile(join(DIR_DATOS, 'categorias.json'), 'utf8')),
  );
  const hoy = fechaDeHoy();
  const conProductos = categorias.filter((c) => productos.some((p) => p.categoria === c.slug));
  // "auto" (horario diario): una categoría distinta cada día, entre las que tienen productos.
  const categoria =
    values.categoria === 'auto' ? categoriaDelDia(conProductos, hoy) : categorias.find((c) => c.slug === values.categoria);
  if (!categoria) {
    throw new Error(
      `--categoria "${values.categoria ?? ''}" no existe. Usa auto o una de: ${categorias.map((c) => c.slug).join(', ')}.`,
    );
  }
  console.log(`Categoría: ${categoria.slug}${values.categoria === 'auto' ? ' (rotación diaria)' : ''}`);
  if (!productos.some((p) => p.categoria === categoria.slug)) {
    throw new Error(`La categoría "${categoria.slug}" no tiene productos publicados: una guía no podría mostrar ninguno.`);
  }

  const existentes = await leerGuias(DIR_GUIAS);
  // Una guía publicada (de la misma categoría si hay) como modelo de tono y estructura.
  const guiaDeEjemplo = existentes.find((g) => g.data?.categoria === categoria.slug) ?? existentes[0];
  const ejemplo = guiaDeEjemplo ? await readFile(join(DIR_GUIAS, `${guiaDeEjemplo.id}.md`), 'utf8') : null;
  const { temas, ignorados } = planificarTemas(values.temas ?? '', cantidad);

  const cliente = crearCliente(config);
  const uso = usoVacio();
  /** @type {{ guia: import('./lib/generar-guias.mjs').GuiaCruda, intentos: number, palabras: number | null }[]} */
  const generadas = [];
  /** @type {{ numero: number, tema: string | null, motivo: string, problemas: string[] }[]} */
  const fallidas = [];
  /** @type {string[]} */
  const avisos = ignorados.length ? [`Se ignoraron ${ignorados.length} tema(s) porque superan la cantidad pedida: ${ignorados.join('; ')}.`] : [];
  const catSlugs = categorias.map((c) => c.slug);

  for (const [i, tema] of temas.entries()) {
    const numero = i + 1;
    if (uso.entrada + uso.salida >= config.maxTokensEjecucion) {
      avisos.push(`Se alcanzó MAX_TOKENS_EJECUCION: no se generaron las guías ${numero} a ${cantidad}.`);
      break;
    }
    console.log(`→ Guía ${numero} de ${cantidad}${tema ? ` (tema: ${tema})` : ''}…`);
    const yaGeneradas = generadas.map((g) => g.guia);
    try {
      const r = await generarGuia({
        cliente,
        config,
        uso,
        contexto: { categoria, productos, existentes, generadas: yaGeneradas, tema, ejemplo, hoy },
        validar: (guia) =>
          problemasDeGuiaNueva(guia, { productos, categorias: catSlugs, existentes, generadas: yaGeneradas, categoria: categoria.slug }),
      });
      if (r.guia) {
        await writeFile(join(DIR_GUIAS, `${r.guia.id}.md`), aMarkdown(r.guia), 'utf8');
        generadas.push({ guia: r.guia, intentos: r.intentos, palabras: palabras(r.guia) });
        console.log(`  ✓ ${r.guia.id} (${r.intentos} intento(s))`);
      } else {
        fallidas.push({ numero, tema, motivo: r.aviso ?? 'no se pudo generar', problemas: r.problemas });
        console.log(`  ✖ ${r.aviso ?? 'no se pudo generar'}`);
      }
    } catch (error) {
      if (esErrorFatal(error)) throw new Error(describirError(error));
      fallidas.push({ numero, tema, motivo: describirError(error), problemas: [] });
      console.error(`  ✖ ${describirError(error)}`);
    }
  }

  // Revisión final de todas las guías tal como quedaron en disco (mismas reglas que el build).
  if (generadas.length) {
    validarGuias(await leerGuias(DIR_GUIAS), { productos: productos.map((p) => p.id), categorias: catSlugs });
  }

  const consumo = {
    modelo: uso.modelos.join(' + ') || config.modelo,
    llamadas: uso.llamadas,
    entrada: uso.entrada,
    salida: uso.salida,
    busquedas: uso.busquedas,
    costo: costoEstimado(config, uso),
  };
  const resumen = { fecha: hoy, categoria, pedidas: cantidad, generadas, fallidas, avisos, consumo };
  const markdown = resumenGeneracion(resumen);
  await mkdir(DIR_RESUMEN, { recursive: true });
  await writeFile(join(DIR_RESUMEN, 'resumen-guias.md'), markdown, 'utf8');
  await writeFile(
    join(DIR_RESUMEN, 'resumen-guias.json'),
    `${JSON.stringify(
      {
        fecha: hoy,
        categoria: categoria.slug,
        pedidas: cantidad,
        generadas: generadas.map((g) => ({ id: g.guia.id, titulo: g.guia.data.titulo, intentos: g.intentos, palabras: g.palabras })),
        fallidas,
        avisos,
        consumo,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(`\n${markdown}`);

  if (generadas.length === 0) {
    console.error('✖ No se generó ninguna guía (ver el resumen).');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
