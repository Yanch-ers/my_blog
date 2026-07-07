import { readFileSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

let projectRoot: string | null = null;
let TECH_DIR: string | null = null;
let ESSAYS_DIR: string | null = null;

function initPaths() {
  if (projectRoot) return;
  
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    projectRoot = resolve(__dirname, '../..');
    TECH_DIR = resolve(projectRoot, 'content/obsidian/20-areas');
    ESSAYS_DIR = resolve(projectRoot, 'content/obsidian/30-life/essays');
  } catch (e) {
    console.warn('Failed to initialize paths using import.meta.url:', e);
    projectRoot = process.cwd();
    TECH_DIR = resolve(projectRoot, 'content/obsidian/20-areas');
    ESSAYS_DIR = resolve(projectRoot, 'content/obsidian/30-life/essays');
  }
}

interface TitleUrlMapEntry {
  url: string;
  title: string;
}

let cachedTitleUrlMap: Map<string, TitleUrlMapEntry> | null = null;

function extractFrontmatterTitle(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/^title\s*[=:]\s*["']?([^"'\n]+)["']?/m);
  if (titleMatch) return titleMatch[1].trim();
  
  return null;
}

function collectMarkdownFiles(dir: string, baseDir: string): { filePath: string; relativePath: string; astroId: string }[] {
  const results: { filePath: string; relativePath: string; astroId: string }[] = [];
  
  const dirNormalized = dir.replace(/\\/g, '/');
  const baseDirNormalized = baseDir.replace(/\\/g, '/');
  
  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      const fullPathNormalized = fullPath.replace(/\\/g, '/');
      
      const relativePath = fullPathNormalized.startsWith(baseDirNormalized + '/') 
        ? fullPathNormalized.slice(baseDirNormalized.length + 1)
        : fullPathNormalized;
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const astroId = relativePath
          .replace(/\.md$/, '')
          .replace(/ /g, '-')
          .toLowerCase();
        results.push({ filePath: fullPath, relativePath, astroId });
      }
    }
  }
  
  traverse(dirNormalized);
  return results;
}

export function buildTitleUrlMap(): Map<string, TitleUrlMapEntry> {
  if (cachedTitleUrlMap) return cachedTitleUrlMap;
  
  initPaths();
  
  const map = new Map<string, TitleUrlMapEntry>();

  function addMappings(title: string, url: string, relativePath: string) {
    const safeId = relativePath.replace(/\.md$/, '');
    const filename = safeId.split('/').pop() || '';

    if (title) {
      map.set(title, { url, title });
      map.set(title.toLowerCase(), { url, title });
    }

    map.set(safeId, { url, title: title || '' });
    map.set(safeId.toLowerCase(), { url, title: title || '' });

    if (filename) {
      map.set(filename, { url, title: title || '' });
      map.set(filename.toLowerCase(), { url, title: title || '' });
    }
  }
  
  if (TECH_DIR) {
    try {
      const techFiles = collectMarkdownFiles(TECH_DIR, TECH_DIR);
      for (const { filePath, relativePath, astroId } of techFiles) {
        try {
          const content = readFileSync(filePath, 'utf-8');
          const title = extractFrontmatterTitle(content);
          const url = `/posts/tech/${astroId}`;
          addMappings(title || '', url, relativePath);
        } catch (e) {
          console.warn(`Failed to read tech file: ${filePath}`, e);
        }
      }
    } catch (e) {
      console.warn('Failed to read tech directory', e);
    }
  }
  
  if (ESSAYS_DIR) {
    try {
      const essaysFiles = collectMarkdownFiles(ESSAYS_DIR, ESSAYS_DIR);
      for (const { filePath, relativePath, astroId } of essaysFiles) {
        try {
          const content = readFileSync(filePath, 'utf-8');
          const title = extractFrontmatterTitle(content);
          const url = `/posts/essays/${astroId}`;
          addMappings(title || '', url, relativePath);
        } catch (e) {
          console.warn(`Failed to read essays file: ${filePath}`, e);
        }
      }
    } catch (e) {
      console.warn('Failed to read essays directory', e);
    }
  }
  
  cachedTitleUrlMap = map;
  return map;
}

export function getPostUrlByTitle(title: string): string | null {
  const map = buildTitleUrlMap();
  const entry = map.get(title.toLowerCase());
  return entry?.url ?? null;
}