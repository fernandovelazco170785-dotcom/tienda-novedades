// @ts-check
// Lectura, escritura y cambios sobre los archivos de data/.
// Todo pasa por los esquemas de src/lib/esquema.mjs: si algo no cumple, no se escribe.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  asinDeUrl,
  descartadoSchema,
  pendienteSchema,
  productoSchema,
  validarCatalogo,
  validarLista,
} from '../../src/lib/esquema.mjs';

/** @typedef {import('../../src/lib/esquema.mjs').Producto} Producto */
/** @typedef {import('../../src/lib/esquema.mjs').Categoria} Categoria */
/** @typedef {import('../../src/lib/esquema.mjs').Pendiente} Pendiente */
/** @typedef {import('../../src/lib/esquema.mjs').Descartado} Descartado */
/**
 * @typedef {object} Datos
 * @property {Producto[]} productos
 * @property {Categoria[]} categorias
 * @property {Pendiente[]} pendientes
 * @property {Descartado[]} descartados
 */

/** @param {string} ruta @param {unknown} [siNoExiste] */
async function leerJson(ruta, siNoExiste) {
  let texto;
  try {
    texto = await readFile(ruta, 'utf8');
  } catch (e) {
    if (siNoExiste !== undefined && /** @type {NodeJS.ErrnoException} */ (e).code === 'ENOENT') return siNoExiste;
    throw e;
  }
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`${ruta} no es JSON válido: ${/** @type {Error} */ (e).message}`);
  }
}

/** @param {string} ruta @param {unknown} datos */
async function escribirJson(ruta, datos) {
  await writeFile(ruta, `${JSON.stringify(datos, null, 2)}\n`, 'utf8');
}

/** @param {string} dir carpeta de datos (normalmente "data") @returns {Promise<Datos>} */
export async function leerDatos(dir) {
  const { productos, categorias } = validarCatalogo(
    await leerJson(join(dir, 'products.json')),
    await leerJson(join(dir, 'categorias.json')),
  );
  const pendientes = validarLista(pendienteSchema, await leerJson(join(dir, 'pendientes.json'), []), 'data/pendientes.json');
  const descartados = validarLista(
    descartadoSchema,
    await leerJson(join(dir, 'descartados.json'), []),
    'data/descartados.json',
  );

  const ids = new Set(productos.map((p) => p.id));
  for (const p of pendientes) {
    if (ids.has(p.id)) throw new Error(`data/pendientes.json: el id "${p.id}" está repetido o ya está publicado`);
    ids.add(p.id);
  }
  const slugs = categorias.map((c) => c.slug);
  for (const p of pendientes) {
    if (!slugs.includes(p.categoria)) {
      throw new Error(`data/pendientes.json: "${p.id}" tiene la categoría "${p.categoria}", que no existe`);
    }
  }
  return { productos, categorias, pendientes, descartados };
}

/** Valida todo de nuevo y escribe. Si algo falla, no se escribe ningún archivo. @param {string} dir @param {Datos} datos */
export async function guardarDatos(dir, datos) {
  validarCatalogo(datos.productos, datos.categorias);
  validarLista(pendienteSchema, datos.pendientes, 'data/pendientes.json');
  validarLista(descartadoSchema, datos.descartados, 'data/descartados.json');
  await escribirJson(join(dir, 'products.json'), datos.productos);
  await escribirJson(join(dir, 'pendientes.json'), datos.pendientes);
  await escribirJson(join(dir, 'descartados.json'), datos.descartados);
}

/** Texto comparable: minúsculas, sin tildes ni signos. @param {string} texto */
export function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Todo lo que ya se conoce (publicado, pendiente o descartado), para no repetirlo. @param {Datos} datos */
export function conocidos(datos) {
  return [
    ...datos.productos.map((p) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria, donde: 'publicado' })),
    ...datos.pendientes.map((p) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria, donde: 'pendiente' })),
    ...datos.descartados.map((d) => ({ id: d.item.id, titulo: d.item.titulo, categoria: d.item.categoria, donde: d.tipo })),
  ];
}

/**
 * Busca si una propuesta repite algo conocido: mismo id, mismo título,
 * o la búsqueda de Amazon (marca + modelo) contenida en un título existente.
 * @param {{ id: string, titulo: string, buscar_en_amazon: string }} propuesta
 * @param {{ id: string, titulo: string }[]} lista
 */
export function buscarRepetido(propuesta, lista) {
  const titulo = normalizar(propuesta.titulo);
  const modelo = normalizar(propuesta.buscar_en_amazon);
  return lista.find((c) => {
    const otro = normalizar(c.titulo);
    return c.id === propuesta.id || otro === titulo || (modelo.length >= 6 && otro.includes(modelo));
  });
}

/**
 * Mueve a products.json los pendientes que ya tienen url_afiliado,
 * y al historial los marcados como "descartado".
 * @param {Datos} datos se modifica en el lugar
 * @param {string} hoy AAAA-MM-DD
 */
export function publicarListos(datos, hoy) {
  /** @type {Producto[]} */
  const publicados = [];
  /** @type {Pendiente[]} */
  const descartadosAhora = [];
  /** @type {string[]} */
  const errores = [];
  /** @type {Pendiente[]} */
  const quedan = [];

  for (const p of datos.pendientes) {
    if (p.estado === 'descartado') {
      datos.descartados.push({ tipo: 'descartado', fecha: hoy, motivo: 'Descartado al revisar', fuentes: [], item: p });
      descartadosAhora.push(p);
      continue;
    }
    if (!p.url_afiliado) {
      quedan.push(p);
      continue;
    }
    const candidato = {
      id: p.id,
      asin: p.asin || asinDeUrl(p.url_afiliado) || '',
      titulo: p.titulo,
      categoria: p.categoria,
      descripcion_corta: p.descripcion_corta,
      imagen: p.imagen,
      url_afiliado: p.url_afiliado,
      destacado: p.destacado,
      fecha_agregado: hoy,
    };
    const r = productoSchema.safeParse(candidato);
    if (!r.success) {
      errores.push(`"${p.id}" no se publicó: ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
      quedan.push(p);
      continue;
    }
    if (r.data.asin && datos.productos.some((x) => x.asin === r.data.asin)) {
      errores.push(`"${p.id}" no se publicó: el ASIN ${r.data.asin} ya está en products.json`);
      quedan.push(p);
      continue;
    }
    datos.productos.push(r.data);
    publicados.push(r.data);
  }

  datos.pendientes = quedan;
  return { publicados, descartadosAhora, errores };
}

// Claude nunca aporta ASIN ni enlaces: si aparece uno escrito en el texto, la propuesta se rechaza.
const ENLACE_AMAZON = /amzn\.to|amazon\.[a-z]{2,3}(?:\.[a-z]{2})?\//i;
const CODIGO_ASIN = /\bB0[A-Z0-9]{8}\b/;

/**
 * Agrega propuestas nuevas a pendientes.json, sin repetir nada conocido.
 * Entran siempre con asin y url_afiliado vacíos: solo el dueño los completa al pegar su enlace de SiteStripe.
 * @param {Datos} datos se modifica en el lugar
 * @param {string} categoria slug
 * @param {{ id: string, titulo: string, descripcion_corta: string, motivo: string, buscar_en_amazon: string, fuentes: string[] }[]} propuestas
 * @param {number} cupo cuántas se pueden agregar como máximo
 * @param {string} hoy
 */
export function agregarPropuestas(datos, categoria, propuestas, cupo, hoy) {
  /** @type {Pendiente[]} */
  const agregadas = [];
  /** @type {string[]} */
  const rechazadas = [];

  for (const propuesta of propuestas) {
    if (agregadas.length >= cupo) {
      rechazadas.push(`"${propuesta.titulo}": se alcanzó el máximo de propuestas`);
      continue;
    }
    const textos = [propuesta.titulo, propuesta.descripcion_corta, propuesta.motivo, propuesta.buscar_en_amazon].join(' ');
    if (ENLACE_AMAZON.test(textos) || CODIGO_ASIN.test(textos)) {
      rechazadas.push(`"${propuesta.titulo}": incluye un enlace o ASIN de Amazon; esos los pones tú`);
      continue;
    }
    const repetido = buscarRepetido(propuesta, conocidos(datos));
    if (repetido) {
      rechazadas.push(`"${propuesta.titulo}": repite "${repetido.titulo}"`);
      continue;
    }
    const candidato = {
      id: propuesta.id,
      estado: 'pendiente',
      url_afiliado: '',
      imagen: '',
      titulo: propuesta.titulo,
      categoria,
      descripcion_corta: propuesta.descripcion_corta,
      destacado: false,
      asin: '',
      buscar_en_amazon: propuesta.buscar_en_amazon,
      motivo: propuesta.motivo,
      // Por regla no se aceptan enlaces de Amazon como fuente.
      fuentes: propuesta.fuentes.filter((f) => !/(^|\.)(amazon\.[a-z.]+|amzn\.[a-z]+)(\/|$)/i.test(urlHost(f))).slice(0, 3),
      fecha_propuesta: hoy,
    };
    const r = pendienteSchema.safeParse(candidato);
    if (!r.success) {
      rechazadas.push(
        `"${propuesta.titulo}": ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
      );
      continue;
    }
    datos.pendientes.push(r.data);
    agregadas.push(r.data);
  }
  return { agregadas, rechazadas };
}

/** @param {string} url */
function urlHost(url) {
  try {
    return `${new URL(url).hostname}/`;
  } catch {
    return '';
  }
}

/**
 * Quita de products.json los productos que Claude propone retirar (con tope) y los guarda en el historial.
 * @param {Datos} datos se modifica en el lugar
 * @param {{ id: string, categoria: string, motivo: string, fuentes: string[] }[]} retiros
 * @param {number} maximo
 * @param {string} hoy
 */
export function aplicarRetiros(datos, retiros, maximo, hoy) {
  /** @type {{ producto: Producto, motivo: string, fuentes: string[] }[]} */
  const retirados = [];
  /** @type {string[]} */
  const ignorados = [];

  for (const retiro of retiros) {
    const i = datos.productos.findIndex((p) => p.id === retiro.id && p.categoria === retiro.categoria);
    if (i === -1) {
      ignorados.push(`"${retiro.id}": no existe en esa categoría`);
      continue;
    }
    if (retirados.length >= maximo) {
      ignorados.push(`"${retiro.id}": se alcanzó el máximo de retiros (${maximo})`);
      continue;
    }
    if (datos.productos.filter((p) => p.categoria === retiro.categoria).length <= 1) {
      ignorados.push(`"${retiro.id}": es el último producto de su categoría`);
      continue;
    }
    const motivo = retiro.motivo.trim() || 'Sin motivo';
    const fuentes = retiro.fuentes.slice(0, 5);
    const [producto] = datos.productos.splice(i, 1);
    datos.descartados.push({ tipo: 'retirado', fecha: hoy, motivo, fuentes, item: producto });
    retirados.push({ producto, motivo, fuentes });
  }
  return { retirados, ignorados };
}
