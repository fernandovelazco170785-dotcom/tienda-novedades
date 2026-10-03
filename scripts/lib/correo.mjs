// @ts-check
// Arma y envía el correo de aviso con Resend (https://resend.com).
// Sin dependencias: así funciona aunque haya fallado la instalación de paquetes.

const RESEND_URL = 'https://api.resend.com/emails';

/**
 * @typedef {object} ResumenCorreo contenido de tmp/resumen.json (ver resumen.mjs → resumenJson)
 * @property {string} fecha
 * @property {{ id: string, titulo: string, categoria: string }[]} publicados
 * @property {{ id: string, titulo: string, motivo: string }[]} retirados
 * @property {{ id: string, titulo: string, categoria: string, motivo: string }[]} propuestas
 * @property {{ id: string, titulo: string }[]} descartados
 * @property {number} pendientes_sin_revisar
 * @property {string[]} avisos
 * @property {{ costo: number } | null} consumo
 */

/** @typedef {{ asunto: string, html: string, texto: string }} Correo */

/** @param {string} texto */
const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/** Lista de correos separados por coma. Lanza un error claro si alguno no es válido. @param {string} texto */
export function validarDestinatarios(texto) {
  const lista = texto
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  if (lista.length === 0) {
    throw new Error(
      'Falta el secreto CORREO_AVISOS (el correo donde quieres recibir los avisos). Agrégalo en Settings → Secrets and variables → Actions.',
    );
  }
  const malos = lista.filter((x) => !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(x));
  if (malos.length > 0) throw new Error(`CORREO_AVISOS tiene ${malos.length} dirección(es) no válida(s).`);
  return lista;
}

/**
 * @param {object} p
 * @param {ResumenCorreo | null} p.resumen null si la ejecución falló antes de generarlo
 * @param {'success' | 'failure' | 'cancelled'} p.resultado
 * @param {string} [p.prUrl]
 * @param {string} [p.runUrl]
 * @param {string} p.hoy
 * @returns {Correo}
 */
export function armarCorreo({ resumen, resultado, prUrl, runUrl, hoy }) {
  const fecha = resumen?.fecha ?? hoy;
  /** @type {string[]} */
  const html = [];
  /** @type {string[]} */
  const texto = [];
  const seccion = (/** @type {string} */ titulo, /** @type {string[]} */ items) => {
    if (items.length === 0) return;
    html.push(
      `<h3 style="margin:24px 0 8px;font-size:16px">${esc(titulo)}</h3><ul style="margin:0;padding-left:20px">${items.map((i) => `<li style="margin:4px 0">${esc(i)}</li>`).join('')}</ul>`,
    );
    texto.push('', titulo, ...items.map((i) => `- ${i}`));
  };
  const enlace = (/** @type {string} */ textoEnlace, /** @type {string} */ url) => {
    html.push(
      `<p style="margin:24px 0"><a href="${esc(url)}" style="background:#f59e0b;color:#1c1917;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">${esc(textoEnlace)}</a></p>`,
    );
    texto.push('', `${textoEnlace}: ${url}`);
  };

  let asunto;
  if (resultado !== 'success') {
    const que = resultado === 'cancelled' ? 'Se canceló' : 'Falló';
    asunto = `MejorCompra · ${que} la actualización del catálogo (${fecha})`;
    html.push(`<h2 style="margin:0 0 8px;font-size:20px">${esc(que)} la actualización del catálogo</h2>`);
    html.push('<p style="margin:0">No se publicó nada. Revisa el detalle en GitHub para ver qué pasó.</p>');
    texto.push(`${que} la actualización del catálogo (${fecha}).`, 'No se publicó nada. Revisa el detalle en GitHub.');
    if (runUrl) enlace('Ver la ejecución en GitHub', runUrl);
    if (resumen) seccion('Avisos', resumen.avisos);
  } else {
    const r = /** @type {ResumenCorreo} */ (resumen);
    const n = (/** @type {number} */ k, /** @type {string} */ uno, /** @type {string} */ varios) => `${k} ${k === 1 ? uno : varios}`;
    asunto = `MejorCompra · ${n(r.publicados.length, 'agregado', 'agregados')}, ${n(r.retirados.length, 'quitado', 'quitados')}, ${n(r.propuestas.length, 'propuesta', 'propuestas')} (${fecha})`;
    html.push(`<h2 style="margin:0 0 8px;font-size:20px">Actualización del catálogo · ${esc(fecha)}</h2>`);
    html.push('<p style="margin:0">Los cambios están en un Pull Request. Nada llega a la web hasta que hagas merge.</p>');
    texto.push(`Actualización del catálogo · ${fecha}`, 'Los cambios están en un Pull Request. Nada llega a la web hasta que hagas merge.');
    seccion('Se agregan a la web (al hacer merge)', r.publicados.map((p) => p.titulo));
    seccion('Se quitan de la web (al hacer merge)', r.retirados.map((p) => `${p.titulo}: ${p.motivo}`));
    seccion('Propuestas que esperan tu enlace de SiteStripe', r.propuestas.map((p) => `${p.titulo}: ${p.motivo}`));
    seccion('Descartados por ti', r.descartados.map((p) => p.titulo));
    seccion('Avisos', r.avisos);
    if (prUrl) enlace('Revisar el Pull Request', prUrl);
    const pie = [`Pendientes sin revisar: ${r.pendientes_sin_revisar}.`];
    if (r.consumo) pie.push(`Costo estimado de la API: US$ ${r.consumo.costo.toFixed(2)}.`);
    html.push(`<p style="margin:16px 0 0;color:#64748b;font-size:13px">${esc(pie.join(' '))}</p>`);
    texto.push('', pie.join(' '));
  }

  html.push(
    '<p style="margin:24px 0 0;color:#94a3b8;font-size:12px">Correo automático del GitHub Action de tienda-novedades.</p>',
  );
  return {
    asunto,
    html: `<div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;line-height:1.5;max-width:600px">${html.join('')}</div>`,
    texto: `${texto.join('\n')}\n`,
  };
}

/**
 * Envía el correo. Devuelve el id que asigna Resend.
 * @param {object} p
 * @param {string} p.apiKey
 * @param {string} p.de remitente, ej. "MejorCompra <avisos@tu-dominio.com>"
 * @param {string[]} p.para
 * @param {Correo} p.correo
 * @param {typeof fetch} [p.fetchImpl] solo para pruebas
 */
export async function enviarConResend({ apiKey, de, para, correo, fetchImpl = fetch }) {
  const respuesta = await fetchImpl(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: de, to: para, subject: correo.asunto, html: correo.html, text: correo.texto }),
    signal: AbortSignal.timeout(20_000),
  });
  const cuerpo = /** @type {{ id?: string, message?: string }} */ (await respuesta.json().catch(() => ({})));
  if (!respuesta.ok) {
    const pista =
      respuesta.status === 401 || respuesta.status === 403
        ? ' Revisa RESEND_API_KEY y, si usas un remitente propio, que su dominio esté verificado en Resend.'
        : '';
    throw new Error(`Resend respondió ${respuesta.status}: ${cuerpo.message ?? 'sin detalle'}.${pista}`);
  }
  return cuerpo.id ?? '(sin id)';
}
