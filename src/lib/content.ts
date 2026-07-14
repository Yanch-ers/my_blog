/**
 * Shared helpers for working with Obsidian-sourced content collections.
 *
 * Both `tech` and `essays` collections share the same Obsidian frontmatter schema:
 *   title, tags[], description?, category?, create_date?, created?, updated?
 *
 * This module normalizes them into a unified shape for the UI.
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type AnyPost = CollectionEntry<'tech'> | CollectionEntry<'essays'>;

export interface SubCategory {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

export interface TagDimension {
  id: string;
  name: string;
  values: { id: string; name: string; count: number }[];
}

const subCategoryMap: Record<string, { name: string; icon?: string }> = {
  ai: { name: 'AI', icon: '🤖' },
  kubernetes: { name: 'Kubernetes', icon: '☸️' },
  linux: { name: 'Linux', icon: '🐧' },
  database: { name: '数据库', icon: '💾' },
  mysql: { name: 'MySQL', icon: '🗄️' },
  redis: { name: 'Redis', icon: '🔴' },
  elasticsearch: { name: 'Elasticsearch', icon: '🔍' },
  kafka: { name: 'Kafka', icon: '🦜' },
  docker: { name: 'Docker', icon: '🐳' },
  ansible: { name: 'Ansible', icon: '🔧' },
  network: { name: '网络', icon: '🌐' },
  gpu: { name: 'GPU', icon: '🎮' },
  programming: { name: '编程', icon: '💻' },
  java: { name: 'Java', icon: '☕' },
  python: { name: 'Python', icon: '🐍' },
  shell: { name: 'Shell', icon: '🐚' },
  monitoring: { name: '监控', icon: '📊' },
  storage: { name: '存储', icon: '💿' },
  ceph: { name: 'Ceph', icon: '💎' },
  openstack: { name: 'OpenStack', icon: '☁️' },
  microservices: { name: '微服务', icon: '🔗' },
  middleware: { name: '中间件', icon: '🔧' },
  cicd: { name: 'CI/CD', icon: '🔄' },
};

const dimensionPrefixes: Record<string, string> = {
  '岗位/': '岗位',
  '考点/': '考点',
  '难度/': '难度',
  '题型/': '题型',
};

const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  kubernetes: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  k8s: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  ai: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  linux: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  docker: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  mysql: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  redis: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  kafka: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  elasticsearch: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  java: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  python: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  shell: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  network: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  monitoring: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  database: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  ceph: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  ansible: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  gpu: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  programming: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  storage: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
  microservices: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  middleware: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200' },
  cicd: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export function getTagColor(tag: string): { bg: string; text: string; border: string } {
  return tagColors[tag.toLowerCase()] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

const categoryAccentColors: Record<string, string> = {
  ai: '#f43f5e',
  kubernetes: '#0d9488',
  linux: '#10b981',
  database: '#f59e0b',
  mysql: '#f59e0b',
  redis: '#f43f5e',
  elasticsearch: '#f59e0b',
  kafka: '#0ea5e9',
  docker: '#06b6d4',
  ansible: '#f43f5e',
  network: '#0d9488',
  gpu: '#10b981',
  programming: '#64748b',
  java: '#f43f5e',
  python: '#eab308',
  shell: '#64748b',
  monitoring: '#8b5cf6',
  storage: '#78716c',
  ceph: '#0ea5e9',
  openstack: '#0ea5e9',
  microservices: '#8b5cf6',
  middleware: '#d946ef',
  cicd: '#f43f5e',
  container: '#06b6d4',
};

export function getCategoryColor(subCategory: string | null): string {
  if (!subCategory) return '#94a3b8';
  return categoryAccentColors[subCategory] || '#94a3b8';
}

/** Get the best available date from Obsidian frontmatter */
export function getDate(post: AnyPost): Date {
  const d = post.data;
  return d.create_date ?? d.created ?? d.updated ?? new Date('2000-01-01');
}

/** Get flat tag list, stripping Obsidian path-style tags like "岗位/AI" -> "AI" */
export function getTags(post: AnyPost): string[] {
  return (post.data.tags ?? []).map((tag) => {
    const parts = tag.split('/');
    return parts[parts.length - 1];
  });
}

/** Get description / summary text */
export function getSummary(post: AnyPost): string {
  return post.data.description ?? '';
}

/** Get the source collection name label */
export function getCategory(post: AnyPost): 'tech' | 'essays' {
  return post.collection as 'tech' | 'essays';
}

/** Extract subcategory from post ID/path */
export function getSubCategory(post: AnyPost): string | null {
  if (post.collection === 'essays') return null;
  
  const id = post.id;
  const parts = id.split('/');
  
  if (parts.length >= 2 && parts[0] === 'cloud-native') {
    const specialCases = ['database', 'container', 'network', 'monitoring', 'storage', 'programming'];
    if (specialCases.includes(parts[1]) && parts.length >= 3) {
      return parts[2];
    }
    return parts[1];
  }
  
  if (parts.length >= 1) {
    return parts[0];
  }
  
  return null;
}

/** Get subcategory display name */
export function getSubCategoryName(post: AnyPost): string {
  const subCat = getSubCategory(post);
  if (!subCat) return '';
  return subCategoryMap[subCat]?.name ?? subCat;
}

/** Get all published posts from both collections, sorted by date desc */
export async function getAllPosts(): Promise<AnyPost[]> {
  const [techPosts, essayPosts] = await Promise.all([
    getCollection('tech'),
    getCollection('essays'),
  ]);
  return [...techPosts, ...essayPosts].sort(
    (a, b) => getDate(b).getTime() - getDate(a).getTime()
  );
}

/** Get all unique flat tags across all posts */
export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of getTags(post)) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return map;
}

/** Get all subcategories with counts */
export async function getAllSubCategories(): Promise<SubCategory[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  
  for (const post of posts) {
    const subCat = getSubCategory(post);
    if (subCat) {
      counts.set(subCat, (counts.get(subCat) ?? 0) + 1);
    }
  }
  
  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      name: subCategoryMap[id]?.name ?? id,
      icon: subCategoryMap[id]?.icon,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Get tags grouped by dimension (岗位/考点/难度/题型) */
export async function getTagDimensions(): Promise<TagDimension[]> {
  const posts = await getAllPosts();
  const dimensionMap = new Map<string, Map<string, number>>();
  
  for (const post of posts) {
    for (const tag of (post.data.tags ?? [])) {
      for (const [prefix, dimensionName] of Object.entries(dimensionPrefixes)) {
        if (tag.startsWith(prefix)) {
          const value = tag.replace(prefix, '');
          if (!dimensionMap.has(dimensionName)) {
            dimensionMap.set(dimensionName, new Map());
          }
          dimensionMap.get(dimensionName)!.set(value, (dimensionMap.get(dimensionName)!.get(value) ?? 0) + 1);
          break;
        }
      }
    }
  }
  
  return Array.from(dimensionMap.entries()).map(([id, values]) => ({
    id,
    name: id,
    values: Array.from(values.entries())
      .map(([valueId, count]) => ({ id: valueId, name: valueId, count }))
      .sort((a, b) => b.count - a.count),
  }));
}

/** Format date to locale string */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Estimate reading time */
export function readingTime(body: string): number {
  const chars = (body ?? '').replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 400));
}

export interface GraphNode {
  id: string;
  title: string;
  collection: 'tech' | 'essays';
  subCategory: string | null;
  backlinks: number;
  connections: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function extractBacklinks(body: string): string[] {
  const matches = body.match(/\[\[([^\]]+)\]\]/g) || [];
  return matches.map(m => m.slice(2, -2).trim());
}

export async function buildGraphData(): Promise<GraphData> {
  const posts = await getAllPosts();
  
  const titleToPost = new Map<string, AnyPost>();
  const idToTitle = new Map<string, string>();
  
  for (const post of posts) {
    const title = (post.data.title as string) || 'Untitled';
    titleToPost.set(title.toLowerCase(), post);
    idToTitle.set(`${post.collection}/${post.id}`, title);
  }

  const nodeMap = new Map<string, GraphNode>();
  const edgeSet = new Set<string>();

  for (const post of posts) {
    const postId = `${post.collection}/${post.id}`;
    const title = (post.data.title as string) || 'Untitled';
    const backlinks = extractBacklinks(post.body ?? '');
    
    if (!nodeMap.has(postId)) {
      nodeMap.set(postId, {
        id: postId,
        title,
        collection: post.collection as 'tech' | 'essays',
        subCategory: getSubCategory(post),
        backlinks: 0,
        connections: backlinks.length,
      });
    } else {
      nodeMap.get(postId)!.connections = backlinks.length;
    }

    for (const linkedTitle of backlinks) {
      const linkedPost = titleToPost.get(linkedTitle.toLowerCase());
      if (linkedPost) {
        const linkedId = `${linkedPost.collection}/${linkedPost.id}`;
        
        if (!nodeMap.has(linkedId)) {
          nodeMap.set(linkedId, {
            id: linkedId,
            title: (linkedPost.data.title as string) || 'Untitled',
            collection: linkedPost.collection as 'tech' | 'essays',
            subCategory: getSubCategory(linkedPost),
            backlinks: 0,
            connections: 0,
          });
        }
        
        nodeMap.get(linkedId)!.backlinks += 1;
        
        const edgeKey = [postId, linkedId].sort().join('|');
        edgeSet.add(edgeKey);
      }
    }
  }

  const nodes = Array.from(nodeMap.values()).filter(n => n.connections > 0 || n.backlinks > 0);
  const edges = Array.from(edgeSet).map(key => {
    const [source, target] = key.split('|');
    return { source, target };
  });

  return { nodes, edges };
}

export { buildTitleUrlMap, getPostUrlByTitle } from './title-url-map.ts';
