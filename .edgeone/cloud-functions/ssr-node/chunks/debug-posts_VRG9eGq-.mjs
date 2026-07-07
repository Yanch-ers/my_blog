import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as createComponent, h as renderHead, u as renderTemplate } from "./server_D5dh6Vmy.mjs";
import "./compiler_C18s7X_v.mjs";
import { t as getCollection } from "./_astro_content_0wl0LdEB.mjs";
//#region src/pages/debug-posts.astro
var debug_posts_exports = /* @__PURE__ */ __exportAll({
	default: () => $$DebugPosts,
	file: () => $$file,
	url: () => $$url
});
var $$DebugPosts = createComponent(async ($$result, $$props, $$slots) => {
	const [techPosts] = await Promise.all([getCollection("tech")]);
	const samplePosts = techPosts.slice(0, 10);
	return renderTemplate`<html lang="zh-CN"><head><title>Debug Posts</title>${renderHead($$result)}</head><body><h1>Debug Posts</h1><table border="1"><tr><th>Index</th><th>ID (raw)</th><th>ID length</th><th>Has backslash</th><th>Has space</th><th>Title</th><th>URL (hyphenated)</th></tr>${samplePosts.map((post, index) => renderTemplate`<tr><td>${index}</td><td><code>${post.id}</code></td><td>${post.id.length}</td><td>${post.id.includes("\\") ? "YES" : "NO"}</td><td>${post.id.includes(" ") ? "YES" : "NO"}</td><td>${post.data.title}</td><td><code>/posts/tech/${post.id.replace(/\\/g, "/").replace(/ /g, "-")}</code></td></tr>`)}</table></body></html>`;
}, "D:/Qoder/blog/src/pages/debug-posts.astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/debug-posts.astro";
var $$url = "/debug-posts";
//#endregion
//#region \0virtual:astro:page:src/pages/debug-posts@_@astro
var page = () => debug_posts_exports;
//#endregion
export { page };
