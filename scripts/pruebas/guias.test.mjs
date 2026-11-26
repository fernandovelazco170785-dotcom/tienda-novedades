// Pruebas de las guías de compra. Ejecuta: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { problemasDeGuia, validarGuias, contarPalabras, PALABRAS_MIN, PALABRAS_MAX } from '../../src/lib/guias-reglas.mjs';
import { validarCatalogo } from '../../src/lib/esquema.mjs';
import { leerGuias, productosCitadosEnGuias } from '../lib/guias.mjs';
import { aplicarRetiros } from '../lib/datos.mjs';

const ctx = {
  productos: ['amd-ryzen-5-9600x', 'mouse-razer-viper-v3-pro'],
  categorias: ['componentes', 'perifericos'],
  guias: ['guia-de-prueba', 'otra-guia'],
};

const datos = (cambios = {}) => ({
  titulo: 'Cómo elegir un procesador para tu PC',
  descripcion: 'Guía de prueba con una descripción lo bastante larga para cumplir el mínimo pedido por el esquema.',
  busqueda: 'cómo elegir procesador',
  categoria: 'componentes',
  productos: [{ id: 'amd-ryzen-5-9600x', motivo: 'Motivo de prueba con el largo mínimo pedido.' }],
  faq: [1, 2, 3].map((n) => ({
    pregunta: `¿Pregunta de prueba número ${n}?`,
    respuesta: 'Respuesta de prueba con el largo mínimo que pide el esquema de la guía.',
  })),
  publicada: '2026-11-26',
  ...cambios,
});

// Cuerpo válido de unas 1300 palabras con las secciones obligatorias.
const relleno = (n) => Array.from({ length: n }, (_, i) => `palabra${i}`).join(' ');
const cuerpo = (extra = '') =>
  `Introducción breve.\n\n## Criterios de compra\n\n${relleno(650)}\n\n## Errores comunes\n\n${relleno(620)}\n\n${extra}\n`;

const guia = (cambiosData = {}, extra = '') => ({ id: 'guia-de-prueba', data: datos(cambiosData), cuerpo: cuerpo(extra) });

test('una guía correcta no tiene problemas', () => {
  assert.deepEqual(problemasDeGuia(guia({}, 'Mira la [ficha](/producto/amd-ryzen-5-9600x/) y [otra guía](/guias/otra-guia/).'), ctx), []);
});

test('falla si cita un producto que no existe', () => {
  const g = guia({ productos: [{ id: 'producto-inventado', motivo: 'Motivo de prueba con el largo mínimo pedido.' }] });
  assert.match(problemasDeGuia(g, ctx).join('\n'), /producto-inventado", que no existe/);
  assert.throws(() => validarGuias([g], ctx), /src\/content\/guias\/guia-de-prueba\.md[\s\S]*producto-inventado/);
});

test('falla con enlaces externos, de Amazon, ASIN, HTML o precios', () => {
  const casos = [
    ['Ver [fabricante](https://www.amd.com/).', /enlaces externos/],
    ['Cómpralo en amazon.com/dp/x.', /dominios de Amazon/],
    ['Enlace corto amzn.to/abc.', /dominios de Amazon/],
    ['Su ASIN es B0D6NN6TM7.', /ASIN/],
    ['Texto con <a>etiqueta</a>.', /HTML/],
    ['Cuesta $199 en oferta.', /precios/],
    ['Ver [ficha](/producto/no-existe/).', /no-existe", que no existe/],
    ['Ver [categoría](/categoria/hogar/).', /categoría "hogar"/],
    ['Ver [guía](/guias/inexistente/).', /guía "inexistente"/],
    ['Ver [ficha](/producto/amd-ryzen-5-9600x).', /no está permitido/], // falta la / final
  ];
  for (const [extra, esperado] of casos) {
    assert.match(problemasDeGuia(guia({}, extra), ctx).join('\n'), esperado, extra);
  }
});

test('exige estructura y largo', () => {
  const sinSecciones = { id: 'guia-de-prueba', data: datos(), cuerpo: relleno(1300) };
  const p = problemasDeGuia(sinSecciones, ctx).join('\n');
  assert.match(p, /Criterios de compra/);
  assert.match(p, /Errores comunes/);
  assert.match(problemasDeGuia(guia({}, '# Otro título'), ctx).join('\n'), /H1/);
  assert.match(problemasDeGuia(guia({}, '## Preguntas frecuentes'), ctx).join('\n'), /frontmatter/);

  const corta = { id: 'guia-de-prueba', data: datos(), cuerpo: '## Criterios de compra\n\nPoco.\n\n## Errores comunes\n\nPoco.' };
  assert.match(problemasDeGuia(corta, ctx).join('\n'), new RegExp(`entre ${PALABRAS_MIN} y ${PALABRAS_MAX}`));
  assert.match(problemasDeGuia(guia({}, relleno(600)), ctx).join('\n'), /palabras; debe tener/);
});

test('cuenta palabras sin sintaxis Markdown', () => {
  assert.equal(contarPalabras('## Título de prueba\n\n- Uno, **dos** y [tres](/guias/x/).'), 7);
  assert.equal(contarPalabras('Pantalla de 15,6" con USB-C'), 5);
});

test('el script semanal no retira productos citados en guías', () => {
  const producto = (id) => ({ id, categoria: 'componentes' });
  const d = { productos: [producto('a'), producto('b'), producto('c')], descartados: [] };
  const retiros = ['a', 'b'].map((id) => ({ id, categoria: 'componentes', motivo: 'Reemplazado', fuentes: [] }));
  const { retirados, ignorados } = aplicarRetiros(d, retiros, 5, '2026-11-26', new Map([['a', ['guia-cpu']]]));
  assert.deepEqual(retirados.map((r) => r.producto.id), ['b']);
  assert.match(ignorados.join('\n'), /"a": aparece en la guía guia-cpu/);
});

test('las guías del repositorio cumplen las reglas', async () => {
  const productos = JSON.parse(readFileSync('data/products.json', 'utf8'));
  const categorias = JSON.parse(readFileSync('data/categorias.json', 'utf8'));
  const catalogo = validarCatalogo(productos, categorias);
  const guias = await leerGuias();
  validarGuias(guias, {
    productos: catalogo.productos.map((p) => p.id),
    categorias: catalogo.categorias.map((c) => c.slug),
  });
  // Todo id citado existe en el catálogo publicado.
  for (const id of (await productosCitadosEnGuias()).keys()) {
    assert.ok(catalogo.productos.some((p) => p.id === id), id);
  }
});
