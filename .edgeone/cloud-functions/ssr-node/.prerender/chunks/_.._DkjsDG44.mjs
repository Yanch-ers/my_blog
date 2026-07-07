import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { T as createComponent, f as renderTemplate, g as maybeRenderHead, o as renderComponent, v as addAttribute, w as createAstro } from "./server_BzLvcQuV.mjs";
import { n as renderEntry, t as getCollection } from "./_astro_content_C7znbMFL.mjs";
import "./compiler_CykheeCx.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BfBjyjUc.mjs";
import { c as getSummary, d as getTags, f as readingTime, n as formatDate, o as getDate, s as getSubCategoryName } from "./content_BhODR8ss.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/VideoPlayer.tsx
function VideoPlayer({ src, poster }) {
	return /* @__PURE__ */ jsx("div", {
		className: "my-6 overflow-hidden rounded-lg border border-[var(--color-border)]",
		children: /* @__PURE__ */ jsxs("video", {
			controls: true,
			preload: "metadata",
			poster,
			className: "w-full",
			children: [/* @__PURE__ */ jsx("source", {
				src,
				type: "video/mp4"
			}), "您的浏览器不支持视频播放。"]
		})
	});
}
//#endregion
//#region src/pages/posts/[collection]/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true,
	url: () => $$url
});
createAstro("https://your-blog.pages.dev");
async function getStaticPaths() {
	const [techPosts, essayPosts] = await Promise.all([getCollection("tech"), getCollection("essays")]);
	const urlMapObject = {};
	function buildUrl(collection, id) {
		return `/posts/${collection}/${id.replace(/\\/g, "/").replace(/ /g, "-").toLowerCase()}`;
	}
	for (const post of techPosts) {
		const title = post.data.title || "";
		const safeId = post.id.replace(/\\/g, "/");
		const url = buildUrl("tech", post.id);
		if (title) {
			urlMapObject[title] = url;
			urlMapObject[title.toLowerCase()] = url;
		}
		urlMapObject[safeId] = url;
		urlMapObject[safeId.toLowerCase()] = url;
		const filename = safeId.split("/").pop() || "";
		if (filename) {
			urlMapObject[filename] = url;
			urlMapObject[filename.toLowerCase()] = url;
		}
	}
	for (const post of essayPosts) {
		const title = post.data.title || "";
		const safeId = post.id.replace(/\\/g, "/");
		const url = buildUrl("essays", post.id);
		if (title) {
			urlMapObject[title] = url;
			urlMapObject[title.toLowerCase()] = url;
		}
		urlMapObject[safeId] = url;
		urlMapObject[safeId.toLowerCase()] = url;
		const filename = safeId.split("/").pop() || "";
		if (filename) {
			urlMapObject[filename] = url;
			urlMapObject[filename.toLowerCase()] = url;
		}
	}
	return [...techPosts.map((post) => ({
		params: {
			collection: "tech",
			slug: post.id.replace(/\\/g, "/")
		},
		props: {
			post,
			urlMap: urlMapObject
		}
	})), ...essayPosts.map((post) => ({
		params: {
			collection: "essays",
			slug: post.id.replace(/\\/g, "/")
		},
		props: {
			post,
			urlMap: urlMapObject
		}
	}))];
}
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Component;
	const { post, urlMap } = Astro.props;
	const { Content, headings } = await renderEntry(post);
	const date = getDate(post);
	const tags = getTags(post);
	const summary = getSummary(post);
	const formattedDate = formatDate(date);
	const bodyText = post.body ?? "";
	const rt = readingTime(bodyText);
	const charCount = bodyText.replace(/\s/g, "").length;
	const subCategoryName = getSubCategoryName(post);
	const toc = headings.filter((h) => h.depth === 2 || h.depth === 3);
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": post.data.title,
		"description": summary
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div id="title-url-map" style="display:none;"${addAttribute(JSON.stringify(urlMap), "data-map")}></div>${renderComponent($$result, "Header", $$Header, {})}<main class="mx-auto flex max-w-4xl flex-1 flex-col gap-8 px-6 py-8 md:flex-row"><div class="flex flex-col gap-8 md:flex-1"><div id="progress-bar" class="progress-bar" style="width: 0%"></div><header class="animate-fade-in"><div class="flex flex-wrap items-center gap-3 mb-4">${subCategoryName && renderTemplate`<span class="rounded-full bg-[var(--color-accent-light)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">${subCategoryName}</span>`}${post.collection === "essays" && renderTemplate`<span class="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs text-[var(--color-text-muted)]">随笔</span>`}</div><h1 class="font-serif text-3xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">${post.data.title}</h1><div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)]"><time${addAttribute(date.toISOString(), "datetime")}>${formattedDate}</time><span class="text-[var(--color-border)]">·</span><span>${rt} 分钟阅读</span><span class="text-[var(--color-border)]">·</span><span>${charCount} 字</span></div>${tags.length > 0 && renderTemplate`<div class="mt-4">${tags.map((tag) => renderTemplate`<a${addAttribute(tag, "key")}${addAttribute(`/tags/${tag}`, "href")} class="inline-block rounded-full bg-[var(--color-bg-secondary)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)]">${tag}</a>`)}</div>`}${summary && renderTemplate`<div class="mt-6 rounded-xl border-l-4 border-[var(--color-accent)] bg-[var(--color-bg-secondary)] p-5"><p class="text-base leading-relaxed text-[var(--color-text-secondary)]">${summary}</p></div>`}</header>${toc.length > 0 && renderTemplate`<details class="toc-container mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 animate-fade-in animate-delay-1"><summary class="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--color-text)] select-none hover:text-[var(--color-accent)] transition-colors"><span>📋 目录</span><svg class="toc-chevron h-4 w-4 text-[var(--color-text-muted)] transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg></summary><nav class="mt-4 pt-4 border-t border-[var(--color-border)]"><ul class="flex flex-col gap-2">${toc.map((heading) => renderTemplate`<li><a${addAttribute(`#${heading.slug}`, "href")}${addAttribute(["block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]", heading.depth === 3 ? "pl-6 text-[var(--color-text-muted)]" : "font-medium text-[var(--color-text-secondary)]"], "class:list")}>${heading.text}</a></li>`)}</ul></nav></details>`}<article class="prose animate-fade-in animate-delay-1">${renderComponent($$result, "Content", Content, {})}</article>${post.data.video && renderTemplate`<div class="mt-10 animate-fade-in">${renderComponent($$result, "VideoPlayer", VideoPlayer, {
		"client:load": true,
		"src": post.data.video,
		"client:component-hydration": "load",
		"client:component-path": "D:/Qoder/blog/src/components/VideoPlayer.tsx",
		"client:component-export": "default"
	})}</div>`}<div class="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><a href="/" class="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>返回首页</a><a href="/rss.xml" class="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 8-8 8.5 8.5 0 0 1 7.5 4.75 8 8 0 0 1-4.5 11.25"></path><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path></svg>订阅更新</a></div></div></div>${toc.length > 0 && renderTemplate`<div class="hidden w-56 flex-shrink-0 lg:block"><div class="sticky top-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"><h3 class="mb-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">目录</h3><nav class="flex flex-col gap-1">${toc.map((heading) => renderTemplate`<a${addAttribute(heading.slug, "key")}${addAttribute(`#${heading.slug}`, "href")}${addAttribute(["rounded-lg px-2 py-1 text-xs transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]", heading.depth === 3 ? "pl-4 text-[var(--color-text-muted)]" : "text-[var(--color-text-secondary)]"], "class:list")}>${heading.text}</a>`)}</nav></div></div>`}</main>${renderComponent($$result, "Footer", $$Footer, {})}<script>
    (function () {
      const bar = document.getElementById('progress-bar');
      if (!bar) return;
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
      });
    })();

    document.addEventListener('DOMContentLoaded', function() {
      const article = document.querySelector('article');
      if (!article) return;

      const mapElement = document.getElementById('title-url-map');
      const rawData = mapElement ? mapElement.dataset.map : '';
      const titleUrlMap = mapElement ? JSON.parse(rawData) : {};
      
      const wikilinkRegex = /\\[\\[([^\\]|]+)(?:\\|([^\\]]+))?\\]\\]/g;

      const resolveWikilink = function(target) {
        let url = titleUrlMap[target];
        if (!url) url = titleUrlMap[target.toLowerCase()];
        
        if (!url) {
          const filename = target.split('/').pop() || '';
          url = titleUrlMap[filename];
          if (!url) url = titleUrlMap[filename.toLowerCase()];
        }
        
        if (!url) {
          const cleanTarget = target.replace(/^\\.\\.\\//g, '').replace(/^\\.\\//g, '');
          url = titleUrlMap[cleanTarget];
          if (!url) url = titleUrlMap[cleanTarget.toLowerCase()];
        }
        
        return url;
      };
      
      const replaceWikilinks = function(element) {
        element.childNodes.forEach(function(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text && text.includes('[[')) {
              const replaced = text.replace(wikilinkRegex, function(match, target, label) {
                let anchor = '';
                let cleanTarget = target;
                
                if (target.includes('#')) {
                  const parts = target.split('#');
                  cleanTarget = parts[0];
                  anchor = '#' + parts.slice(1).join('#');
                }
                
                const url = resolveWikilink(cleanTarget);
                if (url) {
                  const encodedUrl = url.replace(/ /g, '%20');
                  return '<a href="' + encodedUrl + anchor + '" class="internal-link">' + (label || target) + '</a>';
                }
                return label || target;
              });
              if (replaced !== text) {
                const span = document.createElement('span');
                span.innerHTML = replaced;
                node.parentNode.replaceChild(span, node);
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A') {
            replaceWikilinks(node);
          }
        });
      };

      replaceWikilinks(article);
    });
  <\/script>` })}`;
}, "D:/Qoder/blog/src/pages/posts/[collection]/[...slug].astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/posts/[collection]/[...slug].astro";
var $$url = "/posts/[collection]/[...slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/posts/[collection]/[...slug]@_@astro
var page = () => ____slug__exports;
//#endregion
export { page };
