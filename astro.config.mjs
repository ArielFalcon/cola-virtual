import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import vercel from '@astrojs/vercel';
export default defineConfig({
  vite: {
   plugins: [tailwindcss()],
 },

  // add yur domain name here
  site: 'https://lexingtonthemes.com',

  compressHTML: true,
  integrations: [sitemap()],
  adapter: vercel()
});