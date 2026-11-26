// Pruebas del generador de guías (sin red: cliente falso y una API simulada local). Ejecuta: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import { validarCatalogo } from '../../src/lib/esquema.mjs';
import { problemasDeGuia } from '../../src/lib/guias-reglas.mjs';
import { leerConfig } from '../lib/config.mjs';
import { pedirPropuestas, usoVacio } from '../lib/claude.mjs';
import { leerGuias } from '../lib/guias.mjs';
import {
  aMarkdown,
  armarGuia,
  categoriaDelDia,
  citasPorProducto,
  generarGuia,
  mensajeGuia,
  planificarTemas,
  problemasDeGuiaNueva,
  resumenGeneracion,
} from '../lib/generar-guias.mjs';

const ejecutar = promisify(execFile);
const { productos, categorias } = validarCatalogo(
  JSON.parse(readFileSync('data/products.json', 'utf8')),
  JSON.parse(readFileSync('data/categorias.json', 'utf8')),
);
const categoria = categorias.find((c) => c.slug === 'perifericos');
const config = leerConfig({ ANTHROPIC_API_KEY: 'clave-de-prueba' });
const HOY = '2026-11-27';

const relleno = (n) => Array.from({ length: n }, (_, i) => `palabra${i}`).join(' ');
const entradaValida = (cambios = {}) => ({
  id: 'como-elegir-mousepad-gamer',
  titulo: 'Cómo elegir un mousepad gamer: tamaño, superficie y base',
  descripcion:
    'Tamaño, tela o superficie rígida, grosor y base antideslizante: qué revisar antes de comprar un mousepad para jugar con tu mouse.',
  busqueda: 'cómo elegir mousepad gamer',
  productos: [{ id: 'mouse-razer-viper-v3-pro', motivo: 'Mouse liviano que aprovecha una superficie de tela amplia y pareja.' }],
  faq: [1, 2, 3, 4].map((n) => ({
    pregunta: `¿Pregunta de prueba número ${n}?`,
    respuesta: 'Respuesta de prueba con el largo mínimo que pide el esquema de las guías.',
  })),
  cuerpo: `Introducción.\n\n## Criterios de compra\n\n${relleno(650)}\n\n## Errores comunes\n\n${relleno(600)}\n\nMira la [categoría](/categoria/perifericos/).`,
  ...cambios,
});

const respuesta = (content, stop_reason = 'tool_use') => ({
  id: 'msg_prueba',
  type: 'message',
  role: 'assistant',
  model: 'claude-opus-5-5',
  stop_reason,
  stop_sequence: null,
  content,
  usage: { input_tokens: 10000, output_tokens: 4000, server_tool_use: { web_search_requests: 2 } },
});
const entrega = (input, id = 'toolu_1', name = 'entregar_guia') => ({ type: 'tool_use', id, name, input });

/** Cliente falso del SDK: guarda una copia de cada petición y responde en orden. */
function clienteFalso(respuestas) {
  const llamadas = [];
  return {
    llamadas,
    beta: {
      messages: {
        create: async (params) => {
          llamadas.push(structuredClone(params));
          const r = respuestas.shift();
          if (!r) throw new Error('la prueba no preparó más respuestas');
          return r;
        },
      },
    },
  };
}

async function contexto() {
  const existentes = await leerGuias();
  return {
    categoria,
    productos,
    existentes,
    generadas: [],
    tema: null,
    ejemplo: null,
    hoy: HOY,
  };
}
const validador = (ctx) => (guia) =>
  problemasDeGuiaNueva(guia, {
    productos,
    categorias: categorias.map((c) => c.slug),
    existentes: ctx.existentes,
    generadas: ctx.generadas,
    categoria: categoria.slug,
  });

test('genera una guía válida con el mismo modelo, búsqueda web y respaldo que el script semanal', async () => {
  const ctx = await contexto();
  const cliente = clienteFalso([respuesta([entrega(entradaValida())])]);
  const uso = usoVacio();
  const r = await generarGuia({ cliente, config, uso, contexto: ctx, validar: validador(ctx) });

  assert.equal(r.intentos, 1);
  assert.ok(r.guia);
  // El archivo final se puede leer de vuelta y cumple las reglas del build.
  const [, fm, cuerpo] = aMarkdown(r.guia).match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  const guias = [...ctx.existentes.map((g) => g.id), r.guia.id];
  assert.deepEqual(
    problemasDeGuia({ id: r.guia.id, data: yaml.load(fm), cuerpo }, { productos: productos.map((p) => p.id), categorias: categorias.map((c) => c.slug), guias }),
    [],
  );

  const [p] = cliente.llamadas;
  assert.equal(p.model, 'claude-opus-5-5');
  assert.equal(p.fallbacks, 'default');
  assert.deepEqual(p.betas, ['server-side-fallback-2026-07-01']);
  const herramienta = p.tools.find((t) => t.name === 'entregar_guia');
  assert.equal(herramienta.strict, true);
  // Solo puede citar ids del catálogo.
  assert.deepEqual(herramienta.input_schema.properties.productos.items.properties.id.enum, productos.map((x) => x.id));
  const web = p.tools.find((t) => t.name === 'web_search');
  assert.equal(web.type, 'web_search_20260209');
  assert.ok(web.blocked_domains.includes('amazon.com'));
  // El mensaje trae las guías existentes para no repetir temas.
  assert.match(p.messages[0].content, /como-elegir-teclado-mecanico/);
  assert.equal(uso.llamadas, 1);
  assert.equal(uso.busquedas, 2);
});

test('si la guía no cumple, le devuelve los problemas a Claude y acepta la versión corregida', async () => {
  const ctx = await contexto();
  const mala = entradaValida({ cuerpo: `${entradaValida().cuerpo}\nCuesta $99 en https://ejemplo.com.` });
  const cliente = clienteFalso([respuesta([entrega(mala, 'toolu_1')]), respuesta([entrega(entradaValida(), 'toolu_2')])]);
  const r = await generarGuia({ cliente, config, uso: usoVacio(), contexto: ctx, validar: validador(ctx) });

  assert.equal(r.intentos, 2);
  assert.ok(r.guia);
  const segunda = cliente.llamadas[1].messages;
  // La conversación solo se extiende: el primer turno no cambió.
  assert.deepEqual(segunda.slice(0, 2), [cliente.llamadas[0].messages[0], { role: 'assistant', content: [entrega(mala, 'toolu_1')] }]);
  const [resultado] = segunda.at(-1).content;
  assert.equal(resultado.type, 'tool_result');
  assert.equal(resultado.tool_use_id, 'toolu_1');
  assert.equal(resultado.is_error, true);
  assert.match(resultado.content, /precios/);
  assert.match(resultado.content, /enlaces externos/);
});

test('se rinde después de 2 correcciones y no devuelve guía', async () => {
  const ctx = await contexto();
  const mala = entradaValida({ productos: [] });
  const cliente = clienteFalso([1, 2, 3].map((n) => respuesta([entrega(mala, `toolu_${n}`)])));
  const r = await generarGuia({ cliente, config, uso: usoVacio(), contexto: ctx, validar: validador(ctx) });
  assert.equal(r.guia, null);
  assert.equal(r.intentos, 3);
  assert.equal(cliente.llamadas.length, 3);
  assert.match(r.aviso, /2 correcciones/);
  assert.ok(r.problemas.length > 0);
});

test('rechaza ids y temas repetidos, y guías sin productos de la categoría pedida', async () => {
  const ctx = await contexto();
  const validar = validador(ctx);
  const repetida = armarGuia(
    entradaValida({ id: 'como-elegir-teclado-mecanico', busqueda: 'Cómo elegir teclado mecánico' }),
    'perifericos',
    HOY,
  );
  const p = validar(repetida).join('\n');
  assert.match(p, /ya existe una guía con el id/);
  assert.match(p, /repite el tema/);

  const otraCategoria = armarGuia(
    entradaValida({ productos: [{ id: 'amd-ryzen-5-9600x', motivo: 'Motivo de prueba con el largo mínimo pedido.' }] }),
    'perifericos',
    HOY,
  );
  assert.match(validar(otraCategoria).join('\n'), /al menos un producto de la categoría "perifericos"/);
});

test('reparte los temas opcionales entre las guías pedidas', () => {
  assert.deepEqual(planificarTemas('SSD NVMe; fuente de poder\n', 3), { temas: ['SSD NVMe', 'fuente de poder', null], ignorados: [] });
  assert.deepEqual(planificarTemas('a; b; c', 2), { temas: ['a', 'b'], ignorados: ['c'] });
  assert.deepEqual(planificarTemas('', 1), { temas: [null], ignorados: [] });
});

test('el resumen del PR incluye el costo estimado', () => {
  const guia = armarGuia(entradaValida(), 'perifericos', HOY);
  const md = resumenGeneracion({
    fecha: HOY,
    categoria,
    pedidas: 2,
    generadas: [{ guia, intentos: 2, palabras: 1300 }],
    fallidas: [{ numero: 2, tema: 'algo', motivo: 'no cumplió las reglas', problemas: ['tiene 900 palabras'] }],
    avisos: [],
    consumo: { modelo: 'claude-opus-5-5', llamadas: 4, entrada: 120000, salida: 15000, busquedas: 6, costo: 0.84 },
  });
  assert.match(md, /costo estimado: US\$ 0\.84/);
  assert.match(md, /como-elegir-mousepad-gamer\.md/);
  assert.match(md, /1 corrección/);
  assert.match(md, /No se generaron/);
});

test('el script semanal sigue igual tras compartir la conversación con el generador', async () => {
  const cliente = clienteFalso([
    respuesta([{ type: 'server_tool_use', id: 'srvtoolu_1', name: 'web_search', input: { query: 'x' } }], 'pause_turn'),
    respuesta([entrega({ propuestas: [], retiros: [] }, 'toolu_1', 'entregar_propuestas')]),
  ]);
  const r = await pedirPropuestas({
    cliente,
    config,
    uso: usoVacio(),
    contexto: { categoria, actuales: [], conocidos: [], ejemplos: [], cupo: 2, hoy: HOY },
  });
  assert.deepEqual(r, { propuestas: [], retiros: [] });
  assert.equal(cliente.llamadas.length, 2);
  assert.equal(cliente.llamadas[1].messages.at(-1).role, 'assistant'); // reanuda la pausa sin agregar texto
});

/** Corre el CLI contra un servidor local que imita la API y siempre entrega `entradaValida()`. */
async function correrCli(args, fecha = HOY) {
  const dir = mkdtempSync(join(tmpdir(), 'guias-'));
  const guias = join(dir, 'guias');
  cpSync('src/content/guias', guias, { recursive: true });
  const peticiones = [];
  const servidor = createServer((req, res) => {
    let cuerpo = '';
    req.on('data', (c) => (cuerpo += c));
    req.on('end', () => {
      peticiones.push(JSON.parse(cuerpo));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(respuesta([entrega(entradaValida())])));
    });
  });
  await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
  const env = {
    ...process.env,
    ANTHROPIC_API_KEY: 'clave-de-prueba',
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${servidor.address().port}`,
    NO_PROXY: '127.0.0.1',
    GUIAS_DIR: guias,
    RESUMEN_DIR: join(dir, 'tmp'),
    FECHA_HOY: fecha,
  };
  try {
    const { stdout } = await ejecutar(process.execPath, ['scripts/generar-guias.mjs', ...args], { env });
    return { dir, guias, peticiones, stdout };
  } finally {
    servidor.close();
  }
}

test('el CLI genera la guía, la escribe y deja el resumen con el costo', async () => {
  const { dir, guias, peticiones } = await correrCli(['--categoria', 'perifericos', '--cantidad', '1']);
  assert.equal(peticiones.length, 1);
  assert.ok(existsSync(join(guias, 'como-elegir-mousepad-gamer.md')));
  const nueva = (await leerGuias(guias)).find((g) => g.id === 'como-elegir-mousepad-gamer');
  assert.equal(nueva.data.categoria, 'perifericos');
  assert.match(readFileSync(join(dir, 'tmp', 'resumen-guias.md'), 'utf8'), /costo estimado: US\$ \d+\.\d{2}/);
});

test('con --categoria auto (horario diario) usa la categoría del día', async () => {
  // 2026-11-28 le toca a periféricos en la rotación (ver la prueba de categoriaDelDia).
  const { dir, peticiones, stdout } = await correrCli(['--categoria', 'auto', '--cantidad', '1'], '2026-11-28');
  assert.match(stdout, /Categoría: perifericos \(rotación diaria\)/);
  assert.match(peticiones[0].messages[0].content, /slug: perifericos/);
  assert.equal(JSON.parse(readFileSync(join(dir, 'tmp', 'resumen-guias.json'), 'utf8')).categoria, 'perifericos');
});

test('el CLI falla con un mensaje claro sin clave o con datos inválidos', async () => {
  const sinClave = { ...process.env, ANTHROPIC_API_KEY: '' };
  await assert.rejects(
    ejecutar(process.execPath, ['scripts/generar-guias.mjs', '--categoria', 'perifericos'], { env: sinClave }),
    (e) => e.code === 1 && /Falta la clave ANTHROPIC_API_KEY/.test(e.stderr),
  );
  const conClave = { ...process.env, ANTHROPIC_API_KEY: 'clave-de-prueba' };
  await assert.rejects(
    ejecutar(process.execPath, ['scripts/generar-guias.mjs', '--categoria', 'perifericos', '--cantidad', '9'], { env: conClave }),
    (e) => e.code === 1 && /entre 1 y 5/.test(e.stderr),
  );
  await assert.rejects(
    ejecutar(process.execPath, ['scripts/generar-guias.mjs', '--categoria', 'hogar'], { env: conClave }),
    (e) => e.code === 1 && /no existe/.test(e.stderr),
  );
});

test('el workflow ofrece las mismas categorías que data/categorias.json', () => {
  const flujo = yaml.load(readFileSync('.github/workflows/generar-guias.yml', 'utf8'));
  const entradas = flujo.on.workflow_dispatch.inputs;
  assert.deepEqual(entradas.categoria.options, categorias.map((c) => c.slug));
  assert.deepEqual(entradas.cantidad.options, ['1', '2', '3', '4', '5']);
  assert.equal(entradas.temas.required, false);
});

test('el script semanal conserva su recordatorio cuando Claude no entrega', async () => {
  const cliente = clienteFalso([
    respuesta([{ type: 'text', text: 'Lo pienso…' }], 'end_turn'),
    respuesta([entrega({ propuestas: [], retiros: [] }, 'toolu_1', 'entregar_propuestas')]),
  ]);
  await pedirPropuestas({
    cliente,
    config,
    uso: usoVacio(),
    contexto: { categoria, actuales: [], conocidos: [], ejemplos: [], cupo: 2, hoy: HOY },
  });
  assert.equal(
    cliente.llamadas[1].messages.at(-1).content,
    'Entrega el resultado llamando a la herramienta entregar_propuestas (usa listas vacías si no hay nada).',
  );
});

test('una respuesta cortada por el tope de tokens no se acepta como guía', async () => {
  const ctx = await contexto();
  const cliente = clienteFalso([respuesta([entrega(entradaValida())], 'max_tokens')]);
  const r = await generarGuia({ cliente, config, uso: usoVacio(), contexto: ctx, validar: validador(ctx) });
  assert.equal(r.guia, null);
  assert.match(r.aviso, /MAX_TOKENS_RESPUESTA/);
  assert.equal(cliente.llamadas.length, 1);
});

test('la categoría del horario diario rota un día cada una, sin saltarse ninguna', () => {
  const conProductos = categorias.filter((c) => productos.some((p) => p.categoria === c.slug));
  const dias = ['2026-11-27', '2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01'];
  const elegidas = dias.map((d) => categoriaDelDia(conProductos, d).slug);
  assert.deepEqual(elegidas, ['componentes', 'perifericos', 'monitores', 'almacenamiento', 'componentes']);
  assert.equal(new Set(elegidas.slice(0, conProductos.length)).size, conProductos.length);
});

test('pide priorizar los productos de la categoría con menos guías', async () => {
  const ctx = await contexto();
  const citas = citasPorProducto(ctx.existentes);
  const deLaCategoria = productos.filter((p) => p.categoria === categoria.slug);
  const minimo = Math.min(...deLaCategoria.map((p) => citas.get(p.id) ?? 0));
  const menos = deLaCategoria.filter((p) => (citas.get(p.id) ?? 0) === minimo).map((p) => p.id);
  const mas = deLaCategoria.filter((p) => (citas.get(p.id) ?? 0) > minimo).map((p) => p.id);

  const texto = mensajeGuia(ctx);
  const prioriza = texto.split('\n').find((l) => l.startsWith('Prioriza'));
  assert.ok(prioriza, 'sin tema pedido, el mensaje debe pedir priorizar');
  for (const id of menos) assert.ok(prioriza.includes(id), `${id} es de los menos citados`);
  for (const id of mas) assert.ok(!prioriza.includes(id), `${id} ya tiene más guías`);

  // En el catálogo del mensaje, los de la categoría van primero y de menos a más citados.
  const orden = texto
    .split('\n')
    .filter((l) => l.startsWith('- ') && l.includes(' — '))
    .map((l) => l.slice(2, l.indexOf(' — ')));
  const primeros = orden.slice(0, deLaCategoria.length);
  assert.deepEqual(new Set(primeros), new Set(deLaCategoria.map((p) => p.id)));
  const n = primeros.map((id) => citas.get(id) ?? 0);
  assert.deepEqual(n, [...n].sort((a, b) => a - b));

  // Las guías generadas en la misma ejecución también cuentan.
  const sinGuias = { ...ctx, existentes: [] };
  const prioridad = (c) => mensajeGuia(c).split('\n').find((l) => l.startsWith('Prioriza'));
  assert.match(prioridad(sinGuias), /\(0 guías cada uno\): teclado-aula-f75-pro, mouse-razer-viper-v3-pro\.$/);
  const conUna = { ...sinGuias, generadas: [armarGuia(entradaValida(), categoria, HOY)] }; // cita el mouse
  assert.match(prioridad(conUna), /\(0 guías cada uno\): teclado-aula-f75-pro\.$/);

  // Con un tema pedido por el dueño, no se le impone otro.
  assert.ok(!mensajeGuia({ ...ctx, tema: 'mousepad gamer' }).includes('Prioriza'));
});

const pasos = (archivo, job) => {
  const flujo = yaml.load(readFileSync(`.github/workflows/${archivo}`, 'utf8'));
  return { flujo, pasos: flujo.jobs[job].steps };
};

test('los dos bots mergean solo después de npm test y npm run build, sin pisarse', () => {
  const guias = pasos('generar-guias.yml', 'generar');
  const catalogo = pasos('actualizar-catalogo.yml', 'actualizar');
  for (const { flujo, pasos: lista } of [guias, catalogo]) {
    const i = (nombre) => lista.findIndex((p) => p.name === nombre);
    const merge = lista[i('Merge automático')];
    assert.ok(i('Pruebas') >= 0 && i('Comprobar que la web compila') >= 0 && merge);
    assert.equal(lista[i('Pruebas')].run, 'npm test');
    assert.equal(lista[i('Comprobar que la web compila')].run, 'npm run build');
    assert.ok(i('Pruebas') < i('Merge automático') && i('Comprobar que la web compila') < i('Merge automático'));
    // Sin always()/failure(): si una prueba o el build fallan, el paso no corre.
    assert.doesNotMatch(String(merge.if ?? ''), /always|failure|cancelled/);
    for (const p of lista.slice(0, i('Merge automático'))) assert.ok(!p['continue-on-error'], `${p.name} no debe ignorar fallas`);
    assert.match(merge.run, /--match-head-commit/);
    assert.match(merge.run, /BASE_SHA/);
    assert.equal(flujo.concurrency.group, 'tienda-bot');
    assert.equal(flujo.concurrency['cancel-in-progress'], false);
  }
});

test('el horario diario corre a las 6:00 de Lima y genera 2 guías de la categoría del día', () => {
  const { flujo, pasos: lista } = pasos('generar-guias.yml', 'generar');
  assert.deepEqual(flujo.on.schedule, [{ cron: '0 11 * * *' }]); // Lima es UTC-5 todo el año
  const generar = lista.find((p) => p.name === 'Generar guías con Claude');
  assert.equal(generar.env.CATEGORIA, "${{ inputs.categoria || 'auto' }}");
  assert.equal(generar.env.CANTIDAD, "${{ inputs.cantidad || '2' }}");
});
