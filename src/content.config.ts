// Colecciones de contenido. Las guías de compra son Markdown en src/content/guias/.
// Las reglas (productos que existen, sin precios ni enlaces externos, largo, secciones)
// están en src/lib/guias-reglas.mjs y se aplican en src/lib/guias.ts.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guiaSchema } from './lib/guias-reglas.mjs';

const guias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guias' }),
  schema: guiaSchema,
});

export const collections = { guias };
