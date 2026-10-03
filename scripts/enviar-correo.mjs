// @ts-check
// Aviso por correo al terminar el GitHub Action. OPCIONAL: si no existe RESEND_API_KEY no hace nada.
//
// Variables (en GitHub, como secretos):
//   RESEND_API_KEY     clave de https://resend.com. Sin ella el aviso queda desactivado.
//   CORREO_AVISOS      destinatario(s), separados por coma.
//   CORREO_REMITENTE   opcional (variable). Por defecto "MejorCompra <onboarding@resend.dev>",
//                      que Resend solo deja enviar al correo de tu propia cuenta de Resend.
// Las pone el workflow: RESULTADO (success | failure | cancelled), HAY_CAMBIOS, PR_URL, RUN_URL.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { armarCorreo, enviarConResend, validarDestinatarios } from './lib/correo.mjs';

/** @returns {Promise<import('./lib/correo.mjs').ResumenCorreo | null>} */
async function leerResumen() {
  try {
    return JSON.parse(await readFile(join(process.env.RESUMEN_DIR || 'tmp', 'resumen.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const env = process.env;
  const apiKey = (env.RESEND_API_KEY ?? '').trim();
  if (!apiKey) {
    console.log('Aviso por correo desactivado: no existe el secreto RESEND_API_KEY.');
    return;
  }
  const para = validarDestinatarios(env.CORREO_AVISOS ?? '');

  const resultado = env.RESULTADO === 'failure' || env.RESULTADO === 'cancelled' ? env.RESULTADO : 'success';
  const resumen = await leerResumen();
  if (resultado === 'success') {
    if (env.HAY_CAMBIOS !== 'si') {
      console.log('Sin cambios en el catálogo: no se envía correo.');
      return;
    }
    if (!resumen) throw new Error('No se encontró tmp/resumen.json para armar el correo.');
  }

  const correo = armarCorreo({
    resumen,
    resultado,
    prUrl: env.PR_URL,
    runUrl: env.RUN_URL,
    hoy: new Date().toISOString().slice(0, 10),
  });
  const de = (env.CORREO_REMITENTE ?? '').trim() || 'MejorCompra <onboarding@resend.dev>';
  const id = await enviarConResend({ apiKey, de, para, correo });
  console.log(`Correo enviado a ${para.length} destinatario(s). Id de Resend: ${id}`);
}

main().catch((error) => {
  console.error(`✖ Aviso por correo: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
