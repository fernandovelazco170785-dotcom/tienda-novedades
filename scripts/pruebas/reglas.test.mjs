// Pruebas de las reglas del catálogo. Ejecuta: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { problemaUrlAfiliado, productoSchema, validarCatalogo } from '../../src/lib/esquema.mjs';
import { agregarPropuestas, publicarListos } from '../lib/datos.mjs';

const TAG = 'tag=tiendanovedad-20';

const producto = (cambios = {}) => ({
  id: 'mouse-prueba',
  asin: '',
  titulo: 'Mouse de prueba inalámbrico',
  categoria: 'perifericos',
  descripcion_corta: 'Descripción de prueba con el largo mínimo que pide el esquema.',
  imagen: '',
  url_afiliado: 'https://amzn.to/4y3te4F',
  destacado: false,
  fecha_agregado: '2026-10-03',
  ...cambios,
});

test('acepta solo amzn.to y www.amazon.com con el tag', () => {
  const validos = [
    'https://amzn.to/4y3te4F',
    `https://www.amazon.com/dp/B0D6NN6TM7?${TAG}`,
    `https://www.amazon.com/Razer-Viper/dp/B0D6NN6TM7/ref=sr_1_1?${TAG}&linkCode=ll1`,
  ];
  for (const url of validos) assert.equal(problemaUrlAfiliado(url), null, url);

  const invalidos = [
    'http://amzn.to/4y3te4F', // sin https
    'https://amzn.to/', // sin código
    `https://amazon.com/dp/B0D6NN6TM7?${TAG}`, // sin www
    `https://www.amazon.es/dp/B0D6NN6TM7?${TAG}`, // otro país
    `https://smile.amazon.com/dp/B0D6NN6TM7?${TAG}`,
    'https://a.co/d/abc123',
    `https://www.amazon.com.otro-sitio.com/dp/B0D6NN6TM7?${TAG}`,
    `https://www.amazon.com@otro-sitio.com/dp/B0D6NN6TM7?${TAG}`,
    `https://www.amazon.com:8443/dp/B0D6NN6TM7?${TAG}`,
    'https://www.amazon.com/dp/B0D6NN6TM7', // sin tag
    'https://www.amazon.com/dp/B0D6NN6TM7?tag=otra-20', // tag ajeno
    'https://ejemplo.com/producto',
  ];
  for (const url of invalidos) assert.notEqual(problemaUrlAfiliado(url), null, url);
});

test('asin opcional con amzn.to', () => {
  const sinCampo = producto();
  delete sinCampo.asin;
  assert.equal(productoSchema.parse(sinCampo).asin, '');
  assert.equal(productoSchema.parse(producto({ asin: '' })).asin, '');
  assert.equal(productoSchema.parse(producto({ asin: 'B0D6NN6TM7' })).asin, 'B0D6NN6TM7');
});

test('con www.amazon.com el asin se toma del enlace', () => {
  const url = `https://www.amazon.com/dp/B0D6NN6TM7?${TAG}`;
  assert.equal(productoSchema.parse(producto({ url_afiliado: url, asin: '' })).asin, 'B0D6NN6TM7');
  assert.equal(productoSchema.safeParse(producto({ url_afiliado: url, asin: 'B000000001' })).success, false);
  // Enlace de amazon.com sin /dp/ y sin asin: no hay de dónde sacarlo.
  const sinDp = `https://www.amazon.com/stores/Razer/page/123?${TAG}`;
  assert.equal(productoSchema.safeParse(producto({ url_afiliado: sinDp, asin: '' })).success, false);
});

test('un dominio no permitido hace fallar el catálogo', () => {
  const productos = JSON.parse(readFileSync('data/products.json', 'utf8'));
  const categorias = JSON.parse(readFileSync('data/categorias.json', 'utf8'));
  assert.equal(validarCatalogo(productos, categorias).productos.length, productos.length);
  productos[0].url_afiliado = `https://www.amazon.es/dp/B0D6NN6TM7?${TAG}`;
  assert.throws(() => validarCatalogo(productos, categorias), /no está permitido/);
});

test('las propuestas de Claude entran sin asin ni enlace', () => {
  const datos = { productos: [], categorias: [], pendientes: [], descartados: [] };
  const base = {
    titulo: 'SSD Samsung 990 EVO Plus 2 TB, NVMe PCIe 4.0',
    descripcion_corta: 'Unidad rápida para juegos y archivos grandes; revisa que tu placa tenga una ranura M.2 libre.',
    motivo: 'Novedad del mes.',
    buscar_en_amazon: 'Samsung 990 EVO Plus 2TB',
    fuentes: [],
  };
  const { agregadas, rechazadas } = agregarPropuestas(
    datos,
    'almacenamiento',
    [
      // Campos de más (asin, enlace, precio) se ignoran.
      { ...base, id: 'ssd-samsung-990-evo-plus-2tb', asin: 'B0DHLCRF91', url_afiliado: 'https://amzn.to/x', precio: 9 },
      { ...base, id: 'ssd-con-asin', titulo: 'SSD Crucial T500 1 TB', buscar_en_amazon: 'Crucial T500 B0CK2V1XTV' },
      { ...base, id: 'ssd-con-link', titulo: 'SSD WD Black SN850X 1 TB', motivo: 'Visto en https://www.amazon.com/dp/B0B7CKVCCV' },
      { ...base, id: 'ssd-con-corto', titulo: 'SSD Kingston KC3000 1 TB', motivo: 'Link: amzn.to/abc' },
    ],
    5,
    '2026-10-03',
  );
  assert.deepEqual(
    agregadas.map((p) => [p.id, p.asin, p.url_afiliado, 'precio' in p]),
    [['ssd-samsung-990-evo-plus-2tb', '', '', false]],
  );
  assert.equal(rechazadas.length, 3);
  assert.ok(rechazadas.every((r) => r.includes('enlace o ASIN')));
});

test('solo se publica lo que tiene enlace pegado por el dueño', () => {
  const pendiente = (id, url) => ({
    id,
    estado: 'pendiente',
    url_afiliado: url,
    imagen: '',
    titulo: `Producto de prueba ${id}`,
    categoria: 'perifericos',
    descripcion_corta: 'Descripción de prueba con el largo mínimo que pide el esquema.',
    destacado: false,
    asin: '',
    buscar_en_amazon: 'prueba',
    motivo: 'prueba',
    fuentes: [],
    fecha_propuesta: '2026-10-01',
  });
  const datos = {
    productos: [],
    categorias: [],
    pendientes: [
      pendiente('sin-enlace', ''),
      pendiente('con-corto', 'https://amzn.to/4y3te4F'),
      pendiente('con-largo', `https://www.amazon.com/dp/B0D6NN6TM7?${TAG}`),
    ],
    descartados: [],
  };
  const { publicados } = publicarListos(datos, '2026-10-03');
  assert.deepEqual(
    publicados.map((p) => [p.id, p.asin]),
    [
      ['con-corto', ''],
      ['con-largo', 'B0D6NN6TM7'],
    ],
  );
  assert.deepEqual(
    datos.pendientes.map((p) => p.id),
    ['sin-enlace'],
  );
});
