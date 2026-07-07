import { h as __exportAll, i as getAllTags, n as getAllPosts, r as getAllSubCategories } from "./content_Yf5gNan9.mjs";
import { T as createComponent, f as renderTemplate, g as maybeRenderHead, o as renderComponent, v as addAttribute, w as createAstro } from "./server_CUCY0GF4.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BrwTZVBX.mjs";
import { t as $$PostCard } from "./PostCard_B2bRxsPs.mjs";
//#region src/components/Sidebar.astro
var $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
	const subCategories = await getAllSubCategories();
	const tags = await getAllTags();
	const sortedTags = Array.from(tags.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
	return renderTemplate`${maybeRenderHead($$result)}<aside class="hidden w-68 flex-shrink-0 flex-col gap-5 xl:block xl:sticky xl:top-24 xl:self-start"><div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100"><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white"><span class="text-sm font-bold">Q</span></div><div><h3 class="font-semibold text-gray-900">NOVA BLOG</h3><p class="text-xs text-gray-500">记录技术与生活</p></div></div><p class="text-sm leading-relaxed text-gray-600">记录技术笔记、设计观察与日常思考，分享云原生、Linux、数据库等技术领域的学习心得。</p></div><div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100"><h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900"><span class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600">📂</span>文章分类</h3><nav class="flex max-h-60 flex-col gap-1 overflow-y-auto scrollbar-thin"><a href="/" class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-gray-300"></span>全部文章</span></a>${subCategories.map((cat) => renderTemplate`<a${addAttribute(cat.id, "key")}${addAttribute(`/tags/${cat.id}`, "href")} class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-400"></span>${cat.name}</span><span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">${cat.count}</span></a>`)}</nav></div><div class="rounded-xl bg-white p-5 shadow-sm border border-gray-100"><h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900"><span class="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-purple-600">🏷️</span>热门标签</h3><div class="flex flex-wrap gap-2">${sortedTags.map(([tag, count]) => renderTemplate`<a${addAttribute(tag, "key")}${addAttribute(`/tags/${tag}`, "href")} class="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600">${tag}<span class="text-[10px] opacity-70">${count}</span></a>`)}</div></div><div class="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-sm"><h3 class="mb-2 flex items-center gap-2 text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 8-8 8.5 8.5 0 0 1 7.5 4.75 8 8 0 0 1-4.5 11.25"></path><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path></svg>订阅更新</h3><p class="mb-4 text-xs text-blue-100">获取最新文章推送，不错过任何更新</p><a href="/rss.xml" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 8-8 8.5 8.5 0 0 1 7.5 4.75 8 8 0 0 1-4.5 11.25"></path><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path></svg>RSS Feed</a></div></aside>`;
}, "D:/Qoder/blog/src/components/Sidebar.astro", void 0);
//#endregion
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
