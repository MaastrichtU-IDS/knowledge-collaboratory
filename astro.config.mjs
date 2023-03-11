import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  // site: 'https://maastrichtu-ids.github.io',
  // base: '/knowledge-collaboratory',
  integrations: [
    react(),
    image(),
  ],
  output: 'static',
});