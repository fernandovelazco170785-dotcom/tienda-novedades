// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pública del sitio: se usa para el sitemap, las URL canónicas y Open Graph.
// Si cambias de dominio, cámbiala solo aquí.
const SITE_URL = 'https://tienda-novedades.vercel.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
