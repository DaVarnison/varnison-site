import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({ site: 'https://varnison.com', output: 'static', integrations: [sitemap()] });
