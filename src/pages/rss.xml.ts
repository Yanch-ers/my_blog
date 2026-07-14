import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getAllPosts, getDate, getSummary } from '../lib/content';

export const prerender = true;

function toSlug(id: string): string {
  return id.replace(/\.md$/, '').replace(/ /g, '-').toLowerCase();
}

export const GET: APIRoute = async (context) => {
  const allPosts = await getAllPosts();

  const rssResponse = await rss({
    title: 'Yanche Blog',
    description: '技术笔记与生活随笔',
    site: context.site ?? import.meta.env.SITE_URL ?? 'https://yanche.chat',
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: getDate(post),
      description: getSummary(post),
      link: `/posts/${post.collection}/${toSlug(post.id)}`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>zh-CN</language>`,
  });

  // @astrojs/rss URL-encodes Chinese characters, but our static routes use raw Chinese.
  // Decode URLs so browsers can properly request the actual file paths.
  const xmlString = await rssResponse.text();
  const decodedXml = xmlString.replace(
    /<(?:link|guid isPermaLink="true")>([^<]+)<\/(?:link|guid)>/g,
    (match: string, url: string) => match.replace(url, decodeURIComponent(url))
  );

  return new Response(decodedXml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
