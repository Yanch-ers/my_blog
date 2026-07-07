// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkObsidian],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: (filePath) => {
          const normalized = filePath.replace(/\\/g, '/');
          return !normalized.includes('/blog/content/obsidian')
            && !normalized.includes('/blog/src');
        },
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
  ],
});