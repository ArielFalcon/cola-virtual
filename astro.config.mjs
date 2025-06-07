import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://cola-virtual.vercel.app',

  compressHTML: true,
  integrations: [
    {
      name: 'set-prerender',
      hooks: {
        'astro:route:setup': ({ route }) => {
          if (route.component.startsWith('src/pages/api/')) {
            route.prerender = false;
          }
        },
      },
    }
  ],
  adapter: vercel(
    {
      webAnalytics: {
        enabled: true,
      },
    }
  )
});