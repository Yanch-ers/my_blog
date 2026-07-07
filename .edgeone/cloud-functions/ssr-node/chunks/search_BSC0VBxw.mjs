import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as getSummary, d as getTags, n as formatDate, o as getDate, r as getAllPosts } from "./content_Lm_VOP1N.mjs";
//#region src/pages/api/search.ts
var search_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	const query = url.searchParams.get("q")?.trim().toLowerCase() || "";
	if (!query) return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" } });
	const results = (await getAllPosts()).filter((post) => {
		const title = post.data.title.toLowerCase();
		const summary = getSummary(post).toLowerCase();
		const tags = getTags(post).map((t) => t.toLowerCase());
		return title.includes(query) || summary.includes(query) || tags.some((tag) => tag.includes(query));
	}).slice(0, 20).map((post) => ({
		id: `${post.collection}/${post.id}`,
		title: post.data.title,
		summary: getSummary(post),
		date: formatDate(getDate(post)),
		collection: post.collection
	}));
	return new Response(JSON.stringify({ results }), { headers: { "Content-Type": "application/json" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/search@_@ts
var page = () => search_exports;
//#endregion
export { page };
