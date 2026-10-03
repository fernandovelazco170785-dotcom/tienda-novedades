// Datos "en vivo" de Amazon (precio, foto, ranking) obtenidos con su API oficial de afiliados
// (Product Advertising API), nunca con scraping.
//
// Hoy no hay proveedor activo: el sitio usa solo data/products.json y muestra
// "Ver precio actual en Amazon". Para conectar la API cuando tengas acceso:
//   1. Crea src/lib/proveedores/amazon.ts que implemente ProveedorDatos
//      (pide los ASIN en lotes y devuelve un DatosEnVivo por ASIN).
//   2. Devuélvelo en proveedorActivo() cuando existan sus credenciales
//      (variables de entorno en Vercel, nunca en el código).
// Las páginas y componentes ya leen estos datos: no hay que tocarlos.
//
// Ojo con las reglas de Amazon: si se muestra el precio, debe ir con la fecha y hora en que
// se obtuvo, y actualizarse al menos cada 24 horas (habría que recompilar el sitio a diario).

export interface DatosEnVivo {
  /** Precio ya formateado (ej. "US$179.99") y momento en que se obtuvo (ISO 8601). */
  precio?: { texto: string; obtenido: string };
  /** URL de la imagen principal entregada por la API. */
  imagen?: string;
  /** Posición en el ranking de ventas de su categoría. */
  ranking?: number;
}

export interface ProveedorDatos {
  nombre: string;
  /** Recibe ASIN y devuelve los datos de los que encontró. Los que falten se muestran sin datos en vivo. */
  obtener(asins: string[]): Promise<Map<string, DatosEnVivo>>;
}

const sinProveedor: ProveedorDatos = {
  nombre: 'ninguno',
  obtener: async () => new Map(),
};

export function proveedorActivo(): ProveedorDatos {
  return sinProveedor;
}
