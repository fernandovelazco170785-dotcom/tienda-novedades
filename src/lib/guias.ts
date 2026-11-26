// Única puerta de entrada a las guías de compra. Si una guía no cumple las reglas
// (por ejemplo, cita un producto que no existe), el build se detiene aquí.

import { getCollection, type CollectionEntry } from 'astro:content';
import { validarGuias, palabrasDeGuia } from './guias-reglas.mjs';
import { todosLosProductos, categoriasConProductos, type Producto } from './catalogo';
import categorias from '../../data/categorias.json';

export type Guia = CollectionEntry<'guias'>;

const entradas: Guia[] = await getCollection('guias');

validarGuias(
  entradas.map((g) => ({ id: g.id, data: g.data, cuerpo: g.body ?? '' })),
  { productos: todosLosProductos().map((p) => p.id), categorias: categorias.map((c) => c.slug) },
);

// Más recientes primero; con la misma fecha, por título.
const ordenadas = [...entradas].sort(
  (a, b) => b.data.publicada.getTime() - a.data.publicada.getTime() || a.data.titulo.localeCompare(b.data.titulo, 'es'),
);

export function todasLasGuias(): Guia[] {
  return ordenadas;
}

export function guiasDeCategoria(slug: string): Guia[] {
  return ordenadas.filter((g) => g.data.categoria === slug);
}

/** Productos que cita la guía, en su orden, con el motivo por el que aparecen. */
export function productosDeGuia(guia: Guia): { producto: Producto; motivo: string }[] {
  const porId = new Map(todosLosProductos().map((p) => [p.id, p]));
  // validarGuias ya garantizó que todos existen.
  return guia.data.productos.map(({ id, motivo }) => ({ producto: porId.get(id) as Producto, motivo }));
}

export function urlGuia(id: string): string {
  return `/guias/${id}/`;
}

/** Minutos de lectura aproximados (unas 200 palabras por minuto). */
export function minutosDeLectura(guia: Guia): number {
  return Math.max(1, Math.round(palabrasDeGuia(guia.data, guia.body ?? '') / 200));
}

/** Categorías que tienen guías, en el orden de data/categorias.json. */
export function categoriasConGuias() {
  return categoriasConProductos().filter((c) => guiasDeCategoria(c.slug).length > 0);
}

/** Fecha corta en español para mostrar en la página. */
const formato = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function fechaLegible(fecha: Date): string {
  return formato.format(fecha);
}

/** AAAA-MM-DD, para metadatos y schema.org. */
export function fechaIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/**
 * Datos estructurados de la guía: Article + FAQPage (schema.org, JSON-LD).
 * Las preguntas son las mismas que se ven en la página, como exige Google.
 */
export function jsonLdDeGuia(guia: Guia, opciones: { url: string; sitio: { nombre: string; url: string }; seccion: string; imagen?: string }) {
  const { data } = guia;
  const actualizada = data.actualizada ?? data.publicada;
  const autor = { '@type': 'Organization', name: opciones.sitio.nombre, url: opciones.sitio.url };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${opciones.url}#articulo`,
        headline: data.titulo,
        description: data.descripcion,
        inLanguage: 'es',
        articleSection: opciones.seccion,
        datePublished: fechaIso(data.publicada),
        dateModified: fechaIso(actualizada),
        url: opciones.url,
        mainEntityOfPage: opciones.url,
        author: autor,
        publisher: autor,
        ...(opciones.imagen ? { image: [opciones.imagen] } : {}),
      },
      {
        '@type': 'FAQPage',
        '@id': `${opciones.url}#preguntas-frecuentes`,
        mainEntity: data.faq.map((f) => ({
          '@type': 'Question',
          name: f.pregunta,
          acceptedAnswer: { '@type': 'Answer', text: f.respuesta },
        })),
      },
    ],
  };
}
