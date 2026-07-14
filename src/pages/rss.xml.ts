import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getAllPosts, getDate, getSummary } from '../lib/content';

export const prerender = true;

function toSlug(id: string): string {
  return id.replace(/\.md$/, '').replace(/ /g, '-').toLowerCase();
}

export const GET: APIRoute = async (context) => {
  const allPosts = await getAllPosts();

  const rssOutput = await rss({
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

  // @astrojs/rss encodes Chinese characters in URLs, but our routes use raw Chinese.
  // Decode the URL-encoded characters back to raw Chinese to match actual routes.
  const xmlString = await rssOutput.text();
  const decodedXml = xmlString.replace(
    /<link>([^<]+)<\/link>/g,
    (_match: string, url: string) => `<link>${decodeURIComponent(url)}</link>`
  ).replace(
    /<guid isPermaLink="true">([^<]+)<\/guid>/g,
    (_match: string, url: string) => `<guid isPermaLink="true">${decodeURIComponent(url)}</guid>`
  );

  return new Response(decodedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
