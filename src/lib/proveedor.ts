// Datos "en vivo" de Amazon (foto y ranking) obtenidos con su API oficial de afiliados
// (Product Advertising API), nunca con scraping.
//
// Los precios NO se muestran nunca en la web, ni siquiera con la API conectada:
// siempre se usa "Ver precio actual en Amazon". Por eso aquí no hay campo de precio.
//
// Hoy no hay proveedor activo: el sitio usa solo data/products.json. Para conectar la API cuando tengas acceso:
//   1. Crea src/lib/proveedores/amazon.ts que implemente ProveedorDatos
//      (pide los ASIN en lotes y devuelve un DatosEnVivo por ASIN).
//   2. Devuélvelo en proveedorActivo() cuando existan sus credenciales
//      (variables de entorno en Vercel, nunca en el código).
// Las páginas y componentes ya leen estos datos: no hay que tocarlos.

export interface DatosEnVivo {
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
