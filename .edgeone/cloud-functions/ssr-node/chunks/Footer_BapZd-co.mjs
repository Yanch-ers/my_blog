globalThis.process ??= {};
globalThis.process.env ??= {};
import { C as addAttribute, O as createAstro, S as renderHead, k as createComponent, s as renderSlot, u as renderTemplate, x as maybeRenderHead } from "./server_DQ7XoPVS.mjs";
import "./compiler_EmZuZXFe.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://your-blog.pages.dev");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description = "一个简约高级的个人博客" } = Astro.props;
	const siteName = "My Blog";
	return renderTemplate`<html lang="zh-CN" class="scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title} | ${siteName}</title><meta name="description"${addAttribute(description, "content")}><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}><!-- Twitter Card --><meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><!-- Dark mode init (avoid flash) --><script>
      (function () {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    <\/script>${renderHead($$result)}</head><body class="min-h-screen flex flex-col antialiased">${renderSlot($$result, $$slots["default"])}<!-- Dark mode toggle script --><script>
      window.toggleTheme = function () {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      };
    <\/script></body></html>`;
}, "D:/Qoder/blog/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/components/Header.astro
createAstro("https://your-blog.pages.dev");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const currentPath = Astro.url.pathname;
	const navLinks = [
		{
			href: "/",
			label: "首页"
		},
		{
			href: "/tags",
			label: "标签"
		},
		{
			href: "/about",
			label: "关于"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<header class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md"><nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"><a href="/" class="font-serif text-xl font-bold tracking-tight text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">NOVA BLOG</a><div class="hidden items-center gap-8 md:flex">${navLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["text-sm font-medium transition-colors hover:text-[var(--color-accent)]", currentPath === href || href !== "/" && currentPath.startsWith(href) ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"], "class:list")}>${label}</a>`)}<a href="/search" class="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors" title="搜索"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></a><button onclick="toggleTheme()" class="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors" title="切换主题"><svg class="hidden dark:block" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg><svg class="block dark:hidden" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg></button><a href="/rss.xml" class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]" title="订阅"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 8-8 8.5 8.5 0 0 1 7.5 4.75 8 8 0 0 1-4.5 11.25"></path><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path></svg>订阅</a></div><button class="md:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]" id="mobile-menu-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"></line><line x1="3" x2="21" y1="12" y2="12"></line><line x1="3" x2="21" y1="18" y2="18"></line></svg></button></nav><div id="mobile-menu" class="hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden"><div class="flex flex-col px-6 py-4 gap-4">${navLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["text-sm font-medium transition-colors", currentPath === href || href !== "/" && currentPath.startsWith(href) ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"], "class:list")}>${label}</a>`)}<a href="/search" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">搜索</a><button onclick="toggleTheme()" class="text-sm text-left text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">切换主题</button><a href="/rss.xml" class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] w-fit">订阅</a></div></div></header><script>
  (function () {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  })();
<\/script>`;
}, "D:/Qoder/blog/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="mt-auto border-t border-[var(--color-border)]"><div class="mx-auto max-w-3xl px-6 py-8"><div class="flex flex-col items-center gap-2 text-sm text-[var(--color-text-muted)]"><p>&copy; ${year} My Blog. All rights reserved.</p><p class="text-xs">Powered by <a href="https://astro.build" class="hover:text-[var(--color-accent)] transition-colors" target="_blank" rel="noopener">Astro</a>&amp;<a href="https://pages.cloudflare.com" class="hover:text-[var(--color-accent)] transition-colors" target="_blank" rel="noopener">Cloudflare Pages</a></p></div></div></footer>`;
}, "D:/Qoder/blog/src/components/Footer.astro", void 0);
//#endregion
export { $$Header as n, $$BaseLayout as r, $$Footer as t };
