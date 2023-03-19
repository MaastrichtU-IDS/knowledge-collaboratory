import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import image from '@astrojs/image';
import AstroPWA from '@vite-pwa/astro'
// import serviceWorker from 'astrojs-service-worker';
// import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://maastrichtu-ids.github.io',
  base: process.env.PUBLIC_BASE_URL || '',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    image(),
    // serviceWorker()
    AstroPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      includeAssets: ['icon.png'],
      manifest: {
        name: 'Knowledge Collaboratory',
        short_name: 'Knowledge Collaboratory',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        // navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^index.html$/]
        // navigateFallbackAllowlist: [/^\/404$/],
      },
    })
    // tailwind({
    //   config: {
    //     applyBaseStyles: false,
    //   },
    // }),
  ],
  output: 'static'
});
