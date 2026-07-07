import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { T as createComponent, f as renderTemplate, g as maybeRenderHead, o as renderComponent, v as addAttribute, w as createAstro } from "./server_BzLvcQuV.mjs";
import "./compiler_CykheeCx.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BfBjyjUc.mjs";
import { r as getAllPosts } from "./content_Dz-elcKP.mjs";
import { t as $$PostCard } from "./PostCard_ZeclHVRJ.mjs";
import { t as $$Sidebar } from "./Sidebar_BDZK4Psp.mjs";
//#region src/pages/page/[page].astro
var _page__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Page,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true,
	url: () => $$url
});
createAstro("https://your-blog.pages.dev");
async function getStaticPaths() {
	const allPosts = await getAllPosts();
	const POSTS_PER_PAGE = 12;
	const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
	return Array.from({ length: totalPages }, (_, i) => {
		const startIndex = i * POSTS_PER_PAGE;
		return {
			params: { page: String(i + 1) },
			props: {
				posts: allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE),
				currentPage: i + 1,
				totalPages
			}
		};
	}).filter((route) => route.params.page !== "1");
}
var $$Page = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Page;
	const { posts, currentPage, totalPages } = Astro.props;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `第 ${currentPage} 页` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="mx-auto flex max-w-[1600px] flex-1 flex-col px-6 py-10"><div class="flex flex-col gap-8 xl:flex-row xl:items-start"><div class="flex flex-col gap-6 flex-1"><div class="flex items-center justify-between"><h2 class="font-serif text-2xl font-bold text-gray-900">精选文章</h2><span class="text-sm text-gray-400">第 ${currentPage} / ${totalPages} 页</span></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${posts.map((post, index) => renderTemplate`<div${addAttribute(`animate-fade-in animate-delay-${Math.min(index + 1, 3)}`, "class")}>${renderComponent($$result, "PostCard", $$PostCard, { "post": post })}</div>`)}</div><nav class="mt-8 flex items-center justify-center gap-3"><a${addAttribute(currentPage === 2 ? "/" : `/page/${currentPage - 1}`, "href")} class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>上一页</a><span class="text-sm text-gray-400">${currentPage} / ${totalPages}</span>${currentPage < totalPages && renderTemplate`<a${addAttribute(`/page/${currentPage + 1}`, "href")} class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-sm">下一页<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg></a>`}</nav></div>${renderComponent($$result, "Sidebar", $$Sidebar, {})}</div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "D:/Qoder/blog/src/pages/page/[page].astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/page/[page].astro";
var $$url = "/page/[page]";
//#endregion
//#region \0virtual:astro:page:src/pages/page/[page]@_@astro
var page = () => _page__exports;
//#endregion
export { page };
