// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import edgeone from '@edgeone/astro';
import sitemap from '@astrojs/sitemap';
import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';
import { unified } from '@astrojs/markdown-remark';

const siteUrl = process.env.SITE_URL || 'https://your-blog.pages.dev';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkObsidian],
      rehypePlugins: [],
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
  adapter: edgeone({
    entrypointResolution: 'auto',
  }),
});
