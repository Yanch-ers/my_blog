// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-blog.pages.dev',
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
        // Watch submodule content directories and src for hot-reload
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
  adapter: cloudflare(),
});
