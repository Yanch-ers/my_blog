globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll, r as __toESM } from "./rolldown-runtime_C1qw6IGW.mjs";
import { i as renderComponent, k as createComponent, u as renderTemplate, x as maybeRenderHead } from "./server_DQ7XoPVS.mjs";
import { t as require_react } from "./react_DbpihYAH.mjs";
import "./compiler_EmZuZXFe.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BapZd-co.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime_BHhg5U2r.mjs";
//#region src/components/SearchBar.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function SearchBar() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [searched, setSearched] = (0, import_react.useState)(false);
	const handleSearch = (0, import_react.useCallback)(async (value) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: query,
					onChange: (e) => handleSearch(e.target.value),
					placeholder: "搜索文章标题或摘要...",
					className: "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 pl-10 text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "11",
						cy: "11",
						r: "8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 21-4.3-4.3" })]
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-sm text-[var(--color-text-muted)]",
				children: "搜索中..."
			}),
			!loading && searched && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-sm text-[var(--color-text-muted)]",
				children: "没有找到相关文章"
			}),
			!loading && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-3",
				children: results.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `/posts/${result.id}`,
					className: "block rounded-lg border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-[var(--color-text)]",
							children: result.title
						}),
						result.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2",
							children: result.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
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
