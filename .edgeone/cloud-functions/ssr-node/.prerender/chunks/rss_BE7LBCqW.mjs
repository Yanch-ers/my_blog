import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as getSummary, o as getDate, r as getAllPosts } from "./content_BhODR8ss.mjs";
import rss from "@astrojs/rss";
//#region src/pages/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
var GET = async (context) => {
	const allPosts = await getAllPosts();
	return rss({
		title: "My Blog",
		description: "技术笔记与生活随笔",
		site: context.site ?? void 0 ?? "https://your-blog.pages.dev",
		items: allPosts.map((post) => ({
			title: post.data.title,
			pubDate: getDate(post),
			description: getSummary(post),
			link: `/posts/${post.collection}/${post.id}`,
			categories: post.data.tags ?? []
		})),
		customData: `<language>zh-CN</language>`
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/rss.xml@_@ts
var page = () => rss_xml_exports;
//#endregion
export { page };
