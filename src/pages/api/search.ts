import type { APIRoute } from 'astro';
import { getAllPosts, getDate, getTags, getSummary, formatDate } from '../../lib/content';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim().toLowerCase() || '';

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const allPosts = await getAllPosts();

  const results = allPosts
    .filter((post) => {
      const title = post.data.title.toLowerCase();
      const summary = getSummary(post).toLowerCase();
      const tags = getTags(post).map((t: string) => t.toLowerCase());
      return title.includes(query) || summary.includes(query) || tags.some((tag: string) => tag.includes(query));
    })
    .slice(0, 20)
    .map((post) => ({
      id: `${post.collection}/${post.id}`,
      title: post.data.title,
      summary: getSummary(post),
      date: formatDate(getDate(post)),
      collection: post.collection,
    }));

  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
