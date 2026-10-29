import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  build: { inlineStylesheets: 'always' },
  site: 'https://bigpicturearchitect.com',
  integrations: [sitemap({ filter: (p) => !p.includes('/thanks') && !p.includes('/one-sheet') && !p.includes('/portal') && !p.includes('/alan') && !p.includes('/partner') && !p.includes('/booked') && !p.includes('/claude-coaching/audit') })],
});
