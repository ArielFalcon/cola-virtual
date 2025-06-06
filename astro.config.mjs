import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import vercel from '@astrojs/vercel';
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://cola-virtual.vercel.app',

  compressHTML: true,
  integrations: [sitemap()],
  adapter: vercel(
    {
      webAnalytics: {
        enabled: true,
      },
    }
  )
});