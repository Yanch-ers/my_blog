import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { pathToFileURL, fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

// Resolve project root from this file's location (src/content.config.ts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const TECH_DIR = pathToFileURL(resolve(projectRoot, 'content/obsidian/20-areas')).href;
const ESSAYS_DIR = pathToFileURL(resolve(projectRoot, 'content/obsidian/30-life/essays')).href;

// Flexible schema to handle Obsidian frontmatter variations
// Uses z.any() broadly to avoid parse errors from non-standard Obsidian files
const postSchema = z.object({
  title: z.any().transform((v) => (typeof v === 'string' && v ? v : 'Untitled')).optional(),
  tags: z.any().transform((v) => {
    if (!v) return [];
    if (!Array.isArray(v)) return [];
    return v.filter((t): t is string => typeof t === 'string');
  }).optional(),
  description: z.any().transform((v) => (typeof v === 'string' ? v : undefined)).optional(),
  category: z.any().transform((v) => (typeof v === 'string' ? v : undefined)).optional(),
  // Handle multiple date field names
  create_date: z.any().transform((v) => (v ? new Date(v) : undefined)).optional(),
  created: z.any().transform((v) => (v ? new Date(v) : undefined)).optional(),
  updated: z.any().transform((v) => (v ? new Date(v) : undefined)).optional(),
  source: z.any().optional().transform(() => undefined),
}).catchall(z.any());

const tech = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!ai/提示词/**', '!english/**'], base: TECH_DIR }),
  schema: postSchema,
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: ESSAYS_DIR }),
  schema: postSchema,
});

export const collections = { tech, essays };
