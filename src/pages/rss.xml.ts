import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getAllPosts, getDate, getSummary } from '../lib/content';

export const prerender = true;

function toSlug(id: string): string {
  return id.replace(/\.md$/, '').replace(/ /g, '-').toLowerCase();
}

export const GET: APIRoute = async (context) => {
  const allPosts = await getAllPosts();

  return rss({
    title: 'Yanche Blog',
    description: '技术笔记与生活随笔',
    site: context.site ?? import.meta.env.SITE_URL ?? 'https://yanche.blog',
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: getDate(post),
      description: getSummary(post),
      link: `/posts/${post.collection}/${toSlug(post.id)}`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>zh-CN</language>`,
  });
};
