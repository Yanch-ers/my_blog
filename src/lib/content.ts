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

/** Get the best available date from Obsidian frontmatter */
export function getDate(post: AnyPost): Date {
  const d = post.data;
  return d.create_date ?? d.created ?? d.updated ?? new Date('2000-01-01');
}

/** Get flat tag list, stripping Obsidian path-style tags like "岗位/AI" -> "AI" */
export function getTags(post: AnyPost): string[] {
  return (post.data.tags ?? []).map((tag) => {
    // Keep only the last segment of path-style tags
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
