// @ts-check
// Lee las guías de compra (src/content/guias/*.md) fuera de Astro: para las pruebas y para que
// el script semanal no retire productos que una guía está citando.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import yaml from 'js-yaml';

export const DIR_GUIAS = 'src/content/guias';

/**
 * @param {string} [dir]
 * @returns {Promise<{ id: string, data: any, cuerpo: string }[]>}
 */
export async function leerGuias(dir = DIR_GUIAS) {
  let archivos;
  try {
    archivos = (await readdir(dir)).filter((a) => a.endsWith('.md')).sort();
  } catch (e) {
    if (/** @type {NodeJS.ErrnoException} */ (e).code === 'ENOENT') return [];
    throw e;
  }
  return Promise.all(
    archivos.map(async (archivo) => {
      const texto = await readFile(join(dir, archivo), 'utf8');
      const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!m) throw new Error(`${join(dir, archivo)}: falta el frontmatter entre líneas "---"`);
      return { id: archivo.replace(/\.md$/, ''), data: yaml.load(m[1]), cuerpo: m[2] };
    }),
  );
}

/**
 * Productos citados por las guías: id del producto → ids de las guías que lo citan.
 * @param {string} [dir]
 * @returns {Promise<Map<string, string[]>>}
 */
export async function productosCitadosEnGuias(dir = DIR_GUIAS) {
  /** @type {Map<string, string[]>} */
  const citados = new Map();
  for (const guia of await leerGuias(dir)) {
    for (const p of guia.data?.productos ?? []) {
      if (typeof p?.id !== 'string') continue;
      citados.set(p.id, [...(citados.get(p.id) ?? []), guia.id]);
    }
  }
  return citados;
}
