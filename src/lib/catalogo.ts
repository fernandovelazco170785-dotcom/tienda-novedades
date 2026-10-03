// Única puerta de entrada a los datos del sitio. Las páginas leen productos desde aquí,
// nunca directo del JSON, para que más adelante se pueda enriquecer cada producto
// (precio, foto, ranking vía PA-API) sin tocar las páginas.

import productosCrudos from '../../data/products.json';
import categoriasCrudas from '../../data/categorias.json';
import { validarCatalogo, type Producto, type Categoria } from './esquema.mjs';
import { proveedorActivo, type DatosEnVivo } from './proveedor';

export type { Producto, Categoria, DatosEnVivo };

// Si el JSON tiene errores, el build se detiene aquí con la lista de problemas.
const { productos, categorias } = validarCatalogo(productosCrudos, categoriasCrudas);

// Precio, foto y ranking desde la API de Amazon, si hay un proveedor activo (ver proveedor.ts).
const datosEnVivo = await proveedorActivo().obtener(productos.map((p) => p.asin).filter(Boolean));

const posicion = new Map(productos.map((p, i) => [p.id, i]));

/** Más recientes primero; con la misma fecha, el que está más abajo en el JSON va primero. */
function porFechaDesc(a: Producto, b: Producto): number {
  if (a.fecha_agregado !== b.fecha_agregado) return a.fecha_agregado < b.fecha_agregado ? 1 : -1;
  return (posicion.get(b.id) ?? 0) - (posicion.get(a.id) ?? 0);
}

export function datosDe(producto: Producto): DatosEnVivo {
  return (producto.asin && datosEnVivo.get(producto.asin)) || {};
}

/** Foto de la API si existe; si no, la de products.json (puede ser ""). */
export function imagenDe(producto: Producto): string {
  return datosDe(producto).imagen ?? producto.imagen;
}

export function todosLosProductos(): Producto[] {
  return productos;
}

export function productosEstrella(): Producto[] {
  return productos.filter((p) => p.destacado);
}

export function novedades(limite = 6): Producto[] {
  return [...productos].sort(porFechaDesc).slice(0, limite);
}

export function productosDeCategoria(slug: string): Producto[] {
  return productos.filter((p) => p.categoria === slug);
}

/** Solo las categorías que tienen al menos un producto (evita páginas vacías). */
export function categoriasConProductos(): Categoria[] {
  return categorias.filter((c) => productos.some((p) => p.categoria === c.slug));
}

export function categoriaDe(producto: Producto): Categoria {
  const categoria = categorias.find((c) => c.slug === producto.categoria);
  // validarCatalogo ya garantiza que existe.
  if (!categoria) throw new Error(`Categoría desconocida: ${producto.categoria}`);
  return categoria;
}

export function relacionados(producto: Producto, limite = 3): Producto[] {
  return productosDeCategoria(producto.categoria)
    .filter((p) => p.id !== producto.id)
    .slice(0, limite);
}

/**
 * Las imágenes de Amazon traen el tamaño en la URL (._AC_SL1500_.jpg).
 * Pedimos una versión más chica para que la página cargue rápido.
 * Si la URL no tiene ese formato, se devuelve igual.
 */
export function imagenConTamano(url: string, px: number): string {
  return url.replace(/\._AC_SL\d+_\./, `._AC_SL${px}_.`);
}

export function srcsetImagen(url: string, tamanos: number[]): string | undefined {
  if (!/\._AC_SL\d+_\./.test(url)) return undefined;
  return tamanos.map((px) => `${imagenConTamano(url, px)} ${px}w`).join(', ');
}

const formatoFecha = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatearFecha(iso: string): string {
  return formatoFecha.format(new Date(`${iso}T00:00:00Z`));
}

export function urlProducto(producto: Producto): string {
  return `/producto/${producto.id}/`;
}

export function urlCategoria(slug: string): string {
  return `/categoria/${slug}/`;
}
