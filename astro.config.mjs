// @ts-check
import { defineConfig } from 'astro/config';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()]
  }
});