// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';
import { unified } from '@astrojs/markdown-remark';

const rawSiteUrl = process.env.SITE_URL || '';
const siteUrl = rawSiteUrl && !rawSiteUrl.startsWith('http') ? `https://${rawSiteUrl}` : rawSiteUrl || 'https://yanche.chat';

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
});
