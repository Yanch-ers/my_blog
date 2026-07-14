import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getDate, getTags, getSummary } from '../../lib/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [techPosts, essayPosts] = await Promise.all([
    getCollection('tech'),
    getCollection('essays'),
  ]);

  const allPosts = [...techPosts, ...essayPosts];

  const index = allPosts.map((post) => {
    const date = getDate(post);
    const tags = getTags(post);
    const summary = getSummary(post);
    const title = (post.data.title as string) || 'Untitled';

    const normalizedId = post.id.replace(/\\/g, '/').replace(/ /g, '-').toLowerCase();
    const url = `/posts/${post.collection}/${normalizedId}`;

    // Extract plain text from body for full-text search (strip markdown syntax)
    const bodyText = (post.body ?? '')
      .replace(/^---[\s\S]*?---/, '')      // remove frontmatter
      .replace(/#{1,6}\s+/g, '')           // headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links -> text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // images
      .replace(/[*_~`]+/g, '')             // emphasis
      .replace(/\[\[([^\]]+)\]\]/g, '$1')  // wikilinks -> text
      .replace(/>\s?/g, '')                // blockquotes
      .replace(/[-*+]\s/g, '')             // list markers
      .replace(/\n+/g, ' ')               // newlines -> space
      .replace(/\s+/g, ' ')               // collapse spaces
      .trim()
      .slice(0, 500);                      // limit size

    return {
      title,
      summary,
      tags,
      date: date ? date.toLocaleDateString('zh-CN') : '',
      timestamp: date ? date.getTime() : 0,
      url,
      body: bodyText,
    };
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
