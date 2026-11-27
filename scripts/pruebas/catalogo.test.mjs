// Enfoque opcional de "Actualizar catálogo": una categoría y temas concretos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import { leerConfig } from '../lib/config.mjs';
import { mensajeCategoria } from '../lib/claude.mjs';
import { leerEnfoque, limitesConEnfoque } from '../lib/enfoque.mjs';

const ejecutar = promisify(execFile);
const categorias = JSON.parse(readFileSync('data/categorias.json', 'utf8'));
const componentes = categorias.find((c) => c.slug === 'componentes');
const config = leerConfig({ ANTHROPIC_API_KEY: 'clave-de-prueba' });
const TEMAS = 'RAM DDR5 de 32 GB (2x16); placa madre AM5; placa madre LGA 1851; tarjeta gráfica de gama media; fuente de poder de 750 W';

test('sin enfoque todo sigue igual; con enfoque, una categoría y sus temas', () => {
  assert.deepEqual(leerEnfoque('', '', categorias), { categoria: null, temas: [] });
  assert.deepEqual(leerEnfoque('todas', undefined, categorias), { categoria: null, temas: [] });
  const e = leerEnfoque('componentes', TEMAS, categorias);
  assert.equal(e.categoria.slug, 'componentes');
  assert.deepEqual(e.temas, [
    'RAM DDR5 de 32 GB (2x16)',
    'placa madre AM5',
    'placa madre LGA 1851',
    'tarjeta gráfica de gama media',
    'fuente de poder de 750 W',
  ]);
  assert.throws(() => leerEnfoque('hogar', '', categorias), /no existe/);
  assert.throws(() => leerEnfoque('todas', 'algo', categorias), /necesita --categoria/);
  assert.throws(() => leerEnfoque('componentes', Array(9).fill('x').join(';'), categorias), /máximo es 8/);
});

test('con enfoque la categoría recibe el cupo de la ejecución, sin pasar los límites', () => {
  assert.deepEqual(limitesConEnfoque({ categoria: null, temas: [] }, config), { porCategoria: 2, busquedas: 3 });
  const cinco = limitesConEnfoque(leerEnfoque('componentes', TEMAS, categorias), config);
  assert.deepEqual(cinco, { porCategoria: 5, busquedas: 10 });
  assert.deepEqual(limitesConEnfoque(leerEnfoque('componentes', '', categorias), config), { porCategoria: 6, busquedas: 3 });
  const corto = leerConfig({ ANTHROPIC_API_KEY: 'x', MAX_PRODUCTOS_NUEVOS: '3' });
  assert.equal(limitesConEnfoque(leerEnfoque('componentes', TEMAS, categorias), corto).porCategoria, 3);
});

test('el mensaje a Claude lista los temas y pide compatibilidad solo si hay enfoque', () => {
  const base = { categoria: componentes, actuales: [], conocidos: [], ejemplos: [], cupo: 5, hoy: '2026-11-27' };
  assert.doesNotMatch(mensajeCategoria(base), /enfocar/);
  const conTemas = mensajeCategoria({ ...base, temas: ['placa madre AM5', 'fuente de poder de 750 W'] });
  assert.match(conTemas, /- placa madre AM5\n- fuente de poder de 750 W/);
  assert.match(conTemas, /compatible con ellos/);
});

test('el workflow ofrece "todas" más las categorías de data/categorias.json', () => {
  const flujo = yaml.load(readFileSync('.github/workflows/actualizar-catalogo.yml', 'utf8'));
  const entradas = flujo.on.workflow_dispatch.inputs;
  assert.deepEqual(entradas.categoria.options, ['todas', ...categorias.map((c) => c.slug)]);
  assert.equal(entradas.categoria.default, 'todas');
  assert.equal(entradas.temas.required, false);
});

test('el CLI enfocado pide solo esa categoría y guarda las propuestas en pendientes', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'catalogo-'));
  cpSync('data', join(dir, 'data'), { recursive: true });
  const peticiones = [];
  const propuesta = {
    id: 'fuente-ejemplo-750w',
    titulo: 'Fuente de poder Ejemplo 750 W 80 Plus Gold modular',
    descripcion_corta:
      'Entrega 750 W con certificación 80 Plus Gold, suficiente para una tarjeta gráfica de gama media con margen. Es modular, así que solo conectas los cables que usas y el gabinete queda ordenado.',
    motivo: 'Tema pedido: fuente de 750 W, compatible con los procesadores del catálogo.',
    buscar_en_amazon: 'fuente Ejemplo 750W 80 Plus Gold',
    fuentes: ['https://www.ejemplo.com/review'],
  };
  const servidor = createServer((req, res) => {
    let cuerpo = '';
    req.on('data', (c) => (cuerpo += c));
    req.on('end', () => {
      peticiones.push(JSON.parse(cuerpo));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'msg_prueba',
          type: 'message',
          role: 'assistant',
          model: 'claude-opus-5-5',
          stop_reason: 'tool_use',
          stop_sequence: null,
          content: [{ type: 'tool_use', id: 'toolu_1', name: 'entregar_propuestas', input: { propuestas: [propuesta], retiros: [] } }],
          usage: { input_tokens: 1000, output_tokens: 500 },
        }),
      );
    });
  });
  await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
  const env = {
    ...process.env,
    ANTHROPIC_API_KEY: 'clave-de-prueba',
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${servidor.address().port}`,
    NO_PROXY: '127.0.0.1',
    CATALOGO_DIR: join(dir, 'data'),
    RESUMEN_DIR: join(dir, 'tmp'),
    FECHA_HOY: '2026-11-27',
  };
  try {
    await ejecutar(
      process.execPath,
      ['scripts/actualizar.mjs', '--modo', 'completo', '--categoria=componentes', `--temas=${TEMAS}`],
      { env },
    );
  } finally {
    servidor.close();
  }
  assert.equal(peticiones.length, 1, 'solo se pide la categoría enfocada');
  const mensaje = peticiones[0].messages[0].content;
  assert.match(mensaje, /Categoría: Componentes/);
  assert.match(mensaje, /como máximo 5 producto/);
  assert.match(mensaje, /- fuente de poder de 750 W/);
  const busqueda = peticiones[0].tools.find((t) => t.name === 'web_search');
  assert.equal(busqueda.max_uses, 10);

  const pendientes = JSON.parse(readFileSync(join(dir, 'data', 'pendientes.json'), 'utf8'));
  const nueva = pendientes.find((p) => p.id === 'fuente-ejemplo-750w');
  assert.equal(nueva.categoria, 'componentes');
  assert.equal(nueva.url_afiliado, '');
  assert.equal(nueva.asin, '');
  assert.match(readFileSync(join(dir, 'tmp', 'resumen.md'), 'utf8'), /Enfoque pedido: \*\*Componentes\*\* · temas: RAM DDR5/);
});
