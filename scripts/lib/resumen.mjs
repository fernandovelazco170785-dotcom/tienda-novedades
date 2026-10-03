// @ts-check
// Resumen de cada ejecución: Markdown para el Pull Request y JSON para el aviso por correo.

/** @typedef {import('./datos.mjs').Producto} Producto */
/** @typedef {import('./datos.mjs').Pendiente} Pendiente */

/**
 * @typedef {object} Resumen
 * @property {string} fecha
 * @property {'completo' | 'solo_publicar'} modo
 * @property {Producto[]} publicados pasaron de pendientes a la web
 * @property {{ producto: Producto, motivo: string, fuentes: string[] }[]} retirados quitados de la web
 * @property {Pendiente[]} propuestas nuevas en pendientes.json
 * @property {Pendiente[]} descartados descartados por el dueño
 * @property {number} pendientesSinRevisar
 * @property {string[]} avisos
 * @property {{ modelo: string, llamadas: number, entrada: number, salida: number, busquedas: number, costo: number } | null} consumo
 */

/** @param {Resumen} r */
export function hayCambios(r) {
  return r.publicados.length + r.retirados.length + r.propuestas.length + r.descartados.length > 0;
}

/** @param {string} texto */
const md = (texto) => texto.replace(/([\\`*_[\]<>|])/g, '\\$1');

/** @param {Resumen} r */
export function resumenMarkdown(r) {
  const l = [];
  l.push(`## Actualización del catálogo · ${r.fecha}`);
  l.push('');
  l.push(
    `**${r.publicados.length}** publicados · **${r.retirados.length}** retirados · **${r.propuestas.length}** propuestas nuevas · **${r.pendientesSinRevisar}** pendientes sin revisar`,
  );

  if (r.publicados.length) {
    l.push('', '### Publicados (entran a la web al hacer merge)');
    for (const p of r.publicados) l.push(`- ${md(p.titulo)} (\`${p.categoria}\`)`);
  }

  if (r.retirados.length) {
    l.push('', '### Retirados (salen de la web al hacer merge)');
    for (const { producto, motivo, fuentes } of r.retirados) {
      const f = fuentes.length ? ` Fuente: ${fuentes.map((u) => `<${u}>`).join(' ')}` : '';
      l.push(`- **${md(producto.titulo)}**: ${md(motivo)}.${f}`);
    }
    l.push('', '_Si no estás de acuerdo con un retiro, devuélvelo desde `data/descartados.json` antes de hacer merge._');
  }

  if (r.propuestas.length) {
    l.push('', '### Propuestas nuevas en `data/pendientes.json`');
    for (const p of r.propuestas) {
      l.push(`- **${md(p.titulo)}** (\`${p.categoria}\`)`);
      l.push(`  - Por qué: ${md(p.motivo)}`);
      l.push(`  - Buscar en Amazon: \`${p.buscar_en_amazon.replace(/`/g, '')}\``);
      if (p.fuentes.length) l.push(`  - Fuentes: ${p.fuentes.map((u) => `<${u}>`).join(' ')}`);
    }
  }

  if (r.descartados.length) {
    l.push('', '### Descartados por ti (pasan al historial)');
    for (const p of r.descartados) l.push(`- ${md(p.titulo)}`);
  }

  if (r.avisos.length) {
    l.push('', '### Avisos');
    for (const a of r.avisos) l.push(`- ${md(a)}`);
  }

  l.push(
    '',
    '### Cómo revisar',
    '1. **Publicar una propuesta:** en `data/pendientes.json`, pega el enlace de SiteStripe en `url_afiliado` (y si quieres, la URL de la foto en `imagen`). Al guardar en esta rama, un proceso automático la mueve a `products.json`.',
    '2. **Descartarla:** cambia `"estado": "pendiente"` por `"estado": "descartado"`. No se volverá a proponer.',
    '3. **Dejarla para después:** no hagas nada; se queda en pendientes y no aparece en la web.',
    '4. Revisa la vista previa de Vercel y haz **merge**.',
  );

  if (r.consumo) {
    const c = r.consumo;
    l.push(
      '',
      '<details><summary>Consumo de la API</summary>',
      '',
      `Modelo: ${c.modelo} · llamadas: ${c.llamadas} · tokens de entrada: ${c.entrada.toLocaleString('es')} · tokens de salida: ${c.salida.toLocaleString('es')} · búsquedas web: ${c.busquedas} · **costo estimado: US$ ${c.costo.toFixed(2)}**`,
      '',
      '</details>',
    );
  }

  return `${l.join('\n')}\n`;
}

/** Versión compacta en JSON (para el correo de la fase 3 y para depurar). @param {Resumen} r */
export function resumenJson(r) {
  return {
    fecha: r.fecha,
    modo: r.modo,
    publicados: r.publicados.map((p) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria })),
    retirados: r.retirados.map(({ producto, motivo }) => ({ id: producto.id, titulo: producto.titulo, motivo })),
    propuestas: r.propuestas.map((p) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria, motivo: p.motivo })),
    descartados: r.descartados.map((p) => ({ id: p.id, titulo: p.titulo })),
    pendientes_sin_revisar: r.pendientesSinRevisar,
    avisos: r.avisos,
    consumo: r.consumo,
  };
}
