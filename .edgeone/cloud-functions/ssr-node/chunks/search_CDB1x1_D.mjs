import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as createComponent, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_D5dh6Vmy.mjs";
import "./compiler_C18s7X_v.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BlSFgz6t.mjs";
import { useCallback, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/SearchBar.tsx
function SearchBar() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const handleSearch = useCallback(async (value) => {
		setQuery(value);
		if (value.trim().length < 1) {
			setResults([]);
			setSearched(false);
			return;
		}
		setLoading(true);
		try {
			const data = await (await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`)).json();
			setResults(data.results || []);
			setSearched(true);
		} catch {
			setResults([]);
			setSearched(true);
		} finally {
			setLoading(false);
		}
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("input", {
					type: "text",
					value: query,
					onChange: (e) => handleSearch(e.target.value),
					placeholder: "搜索文章标题或摘要...",
					className: "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 pl-10 text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent)]"
				}), /* @__PURE__ */ jsxs("svg", {
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]",
					xmlns: "http://www.w3.org/2000/svg",
					width: "18",
					height: "18",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "11",
						cy: "11",
						r: "8"
					}), /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })]
				})]
			}),
			loading && /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-center text-sm text-[var(--color-text-muted)]",
				children: "搜索中..."
			}),
			!loading && searched && results.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-center text-sm text-[var(--color-text-muted)]",
				children: "没有找到相关文章"
			}),
			!loading && results.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-col gap-3",
				children: results.map((result) => /* @__PURE__ */ jsxs("a", {
					href: `/posts/${result.id}`,
					className: "block rounded-lg border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-sm",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "font-bold text-[var(--color-text)]",
							children: result.title
						}),
						result.summary && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2",
							children: result.summary
						}),
						/* @__PURE__ */ jsx("time", {
							className: "mt-2 block text-xs text-[var(--color-text-muted)]",
							children: result.date
						})
					]
				}, result.id))
			})
		]
	});
}
//#endregion
//#region src/pages/search.astro
var search_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Search,
	file: () => $$file,
	url: () => $$url
});
var $$Search = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "搜索" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="mx-auto w-full max-w-3xl flex-1 px-6 py-12"><h1 class="mb-8 text-3xl font-bold tracking-tight text-[var(--color-text)] animate-fade-in">搜索</h1><div class="animate-fade-in animate-delay-1">${renderComponent($$result, "SearchBar", SearchBar, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "D:/Qoder/blog/src/components/SearchBar.tsx",
		"client:component-export": "default"
	})}</div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "D:/Qoder/blog/src/pages/search.astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/search.astro";
var $$url = "/search";
//#endregion
//#region \0virtual:astro:page:src/pages/search@_@astro
var page = () => search_exports;
//#endregion
export { page };
