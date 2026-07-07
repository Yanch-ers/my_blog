import { c as getTags, h as __exportAll, i as getAllTags, n as getAllPosts, r as getAllSubCategories } from "./content_DVRZEqeP.mjs";
import { T as createComponent, f as renderTemplate, g as maybeRenderHead, o as renderComponent, v as addAttribute, w as createAstro } from "./server_CUCY0GF4.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_Kq32CAfA.mjs";
import { t as $$PostCard } from "./PostCard_Df5fjiFz.mjs";
//#region src/pages/tags/[tag].astro
var _tag__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Tag,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true,
	url: () => $$url
});
createAstro("https://your-blog.pages.dev");
async function getStaticPaths() {
	const tagMap = await getAllTags();
	return Array.from(tagMap.keys()).map((tag) => ({ params: { tag } }));
}
var $$Tag = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tag;
	const { tag } = Astro.params;
	const posts = (await getAllPosts()).filter((p) => getTags(p).includes(tag));
	const matchedSubCategory = (await getAllSubCategories()).find((cat) => cat.id === tag);
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `标签: ${tag}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12"><header class="mb-10 animate-fade-in"><div class="flex flex-wrap items-center gap-3">${matchedSubCategory && renderTemplate`<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">${matchedSubCategory.icon} ${matchedSubCategory.name}</span>`}<span class="text-sm text-gray-400">标签</span></div><h1 class="font-serif text-3xl font-bold tracking-tight text-gray-900">${tag}</h1><p class="mt-2 text-gray-500">共 ${posts.length} 篇文章</p></header><section class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${posts.map((post, index) => renderTemplate`<div${addAttribute(`animate-fade-in animate-delay-${Math.min(index + 1, 3)}`, "class")}>${renderComponent($$result, "PostCard", $$PostCard, { "post": post })}</div>`)}</section>${posts.length === 0 && renderTemplate`<div class="flex flex-col items-center justify-center py-16 text-center"><span class="mb-4 text-5xl">🔍</span><p class="text-[var(--color-text-secondary)]">暂无相关文章</p></div>`}<div class="mt-12"><a href="/tags" class="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>返回标签列表</a></div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "D:/Qoder/blog/src/pages/tags/[tag].astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/tags/[tag].astro";
var $$url = "/tags/[tag]";
//#endregion
//#region \0virtual:astro:page:src/pages/tags/[tag]@_@astro
var page = () => _tag__exports;
//#endregion
export { page };
