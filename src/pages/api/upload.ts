/**
 * Video Upload API - 预留位置
 *
 * 后期实现时：
 * 1. 绑定 Cloudflare R2 bucket 到 wrangler.toml / wrangler.jsonc
 * 2. 接收 multipart/form-data 视频文件
 * 3. 上传到 R2 并返回公开访问 URL
 *
 * 示例实现：
 *
 * import type { APIRoute } from 'astro';
 *
 * export const prerender = false;
 *
 * export const POST: APIRoute = async ({ request }) => {
 *   const formData = await request.formData();
 *   const file = formData.get('video') as File;
 *
 *   if (!file) {
 *     return new Response(JSON.stringify({ error: 'No file provided' }), {
 *       status: 400,
 *       headers: { 'Content-Type': 'application/json' },
 *     });
 *   }
 *
 *   // Upload to R2
 *   // const env = Astro.locals.runtime.env;
 *   // await env.R2_BUCKET.put(`videos/${file.name}`, file.stream());
 *   // const url = `https://your-r2-public-url.com/videos/${file.name}`;
 *
 *   return new Response(JSON.stringify({ success: true }), {
 *     headers: { 'Content-Type': 'application/json' },
 *   });
 * };
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'Video upload is not yet implemented. This is a placeholder endpoint.',
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
