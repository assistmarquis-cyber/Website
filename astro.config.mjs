import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bigpicturearchitect.com',
  integrations: [sitemap({ filter: (p) => !p.includes('/thanks') && !p.includes('/one-sheet') })],
});
