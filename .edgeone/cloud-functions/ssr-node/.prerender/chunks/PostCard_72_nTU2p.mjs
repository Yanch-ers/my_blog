import { T as createComponent, f as renderTemplate, g as maybeRenderHead, v as addAttribute, w as createAstro } from "./server_BzLvcQuV.mjs";
import "./compiler_CykheeCx.mjs";
import { c as getSummary, d as getTags, n as formatDate, o as getDate, s as getSubCategoryName } from "./content_BhODR8ss.mjs";
//#region src/components/PostCard.astro
createAstro("https://your-blog.pages.dev");
var $$PostCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostCard;
	const { post } = Astro.props;
	const date = getDate(post);
	const tags = getTags(post);
	const summary = getSummary(post);
	const dateStr = formatDate(date);
	const subCategoryName = getSubCategoryName(post);
	const isEssay = post.collection === "essays";
	return renderTemplate`${maybeRenderHead($$result)}<article class="group relative rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-100 h-64"><a${addAttribute(`/posts/${post.collection}/${post.id}`, "href")} class="relative flex h-full flex-col gap-3"><div class="flex flex-wrap items-center gap-x-2 gap-y-1.5"><span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>${dateStr}</span>${subCategoryName && !isEssay && renderTemplate`<span class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600"><span class="h-1 w-1 rounded-full bg-blue-500"></span>${subCategoryName}</span>`}${isEssay && renderTemplate`<span class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-600"><span class="h-1 w-1 rounded-full bg-purple-500"></span>随笔</span>`}</div><h2 class="font-serif text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600 line-clamp-2">${post.data.title}</h2><div class="flex-1 flex flex-col">${summary && renderTemplate`<p class="text-sm leading-relaxed text-gray-600 line-clamp-3">${summary}</p>`}</div>${tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1.5">${tags.slice(0, 4).map((tag) => renderTemplate`<span${addAttribute(tag, "key")} class="inline-flex items-center gap-0.5 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500"><span class="h-0.5 w-0.5 rounded-full bg-gray-300"></span>${tag}</span>`)}${tags.length > 4 && renderTemplate`<span class="inline-flex items-center gap-0.5 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-400">+${tags.length - 4}</span>`}</div>`}<div class="flex items-center justify-between pt-2 text-gray-400"><span class="text-xs font-medium group-hover:text-blue-500 transition-colors">阅读全文</span><span class="text-xs group-hover:text-blue-500 transition-colors">→</span></div></a></article>`;
}, "D:/Qoder/blog/src/components/PostCard.astro", void 0);
//#endregion
export { $$PostCard as t };
