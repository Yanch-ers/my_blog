import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getAllPosts, getDate, getSummary } from '../lib/content';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const allPosts = await getAllPosts();

  return rss({
    title: 'My Blog',
    description: '技术笔记与生活随笔',
    site: context.site ?? 'https://your-blog.pages.dev',
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: getDate(post),
      description: getSummary(post),
      link: `/posts/${post.collection}/${post.id}`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>zh-CN</language>`,
  });
};
