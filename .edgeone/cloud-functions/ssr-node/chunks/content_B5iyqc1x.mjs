globalThis.process ??= {};
globalThis.process.env ??= {};
import { E as unescapeHTML, _ as object, b as safeParseAsync, h as date, k as createComponent, m as array, p as generateCspDigest, t as spreadAttributes, u as renderTemplate, v as string } from "./server_DQ7XoPVS.mjs";
import { c as isRemotePath, d as removeBase } from "./path_BqUacSWD.mjs";
import { n as unflatten } from "./parse_DYC_yjKv.mjs";
import { Q as UnknownContentCollectionError, n as AstroError } from "./shorthash_CzXjtOZy.mjs";
import { r as VALID_INPUT_FORMATS } from "./consts_HylFXJJn.mjs";
import "fs";
import "path";
import "url";
//#region node_modules/neotraverse/dist/modern/min/modern.js
var e = (e) => Object.prototype.toString.call(e), t = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), o = (t) => "[object Date]" === e(t), n = (t) => "[object RegExp]" === e(t), r = (t) => "[object Error]" === e(t), s = (t) => "[object Boolean]" === e(t), l = (t) => "[object Number]" === e(t), i = (t) => "[object String]" === e(t), c = Array.isArray, u = Object.getOwnPropertyDescriptor, a = Object.prototype.propertyIsEnumerable, f = Object.getOwnPropertySymbols, p = Object.prototype.hasOwnProperty, h = Object.keys;
function d(e) {
	const t = h(e), o = f(e);
	for (let n = 0; n < o.length; n++) a.call(e, o[n]) && t.push(o[n]);
	return t;
}
function b(e, t) {
	return !u(e, t)?.writable;
}
function y(e, u) {
	if ("object" == typeof e && null !== e) {
		let a;
		if (c(e)) a = [];
		else if (o(e)) a = new Date(e.getTime ? e.getTime() : e);
		else if (n(e)) a = new RegExp(e);
		else if (r(e)) a = { message: e.message };
		else if (s(e) || l(e) || i(e)) a = Object(e);
		else {
			if (t(e)) return e.slice();
			a = Object.create(Object.getPrototypeOf(e));
		}
		const f = u.includeSymbols ? d : h;
		for (const t of f(e)) a[t] = e[t];
		return a;
	}
	return e;
}
var g = {
	includeSymbols: !1,
	immutable: !1
};
function m(e, t, o = g) {
	const n = [], r = [];
	let s = !0;
	const l = o.includeSymbols ? d : h, i = !!o.immutable;
	return function e(u) {
		const a = i ? y(u, o) : u, f = {};
		let h = !0;
		const d = {
			node: a,
			node_: u,
			path: [].concat(n),
			parent: r[r.length - 1],
			parents: r,
			key: n[n.length - 1],
			isRoot: 0 === n.length,
			level: n.length,
			circular: void 0,
			isLeaf: !1,
			notLeaf: !0,
			notRoot: !0,
			isFirst: !1,
			isLast: !1,
			update: function(e, t = !1) {
				d.isRoot || (d.parent.node[d.key] = e), d.node = e, t && (h = !1);
			},
			delete: function(e) {
				delete d.parent.node[d.key], e && (h = !1);
			},
			remove: function(e) {
				c(d.parent.node) ? d.parent.node.splice(d.key, 1) : delete d.parent.node[d.key], e && (h = !1);
			},
			keys: null,
			before: function(e) {
				f.before = e;
			},
			after: function(e) {
				f.after = e;
			},
			pre: function(e) {
				f.pre = e;
			},
			post: function(e) {
				f.post = e;
			},
			stop: function() {
				s = !1;
			},
			block: function() {
				h = !1;
			}
		};
		if (!s) return d;
		function g() {
			if ("object" == typeof d.node && null !== d.node) {
				d.keys && d.node_ === d.node || (d.keys = l(d.node)), d.isLeaf = 0 === d.keys.length;
				for (let e = 0; e < r.length; e++) if (r[e].node_ === u) {
					d.circular = r[e];
					break;
				}
			} else d.isLeaf = !0, d.keys = null;
			d.notLeaf = !d.isLeaf, d.notRoot = !d.isRoot;
		}
		g();
		const m = t(d, d.node);
		if (void 0 !== m && d.update && d.update(m), f.before && f.before(d, d.node), !h) return d;
		if ("object" == typeof d.node && null !== d.node && !d.circular) {
			r.push(d), g();
			for (const [t, o] of Object.entries(d.keys ?? [])) {
				n.push(o), f.pre && f.pre(d, d.node[o], o);
				const r = e(d.node[o]);
				i && p.call(d.node, o) && !b(d.node, o) && (d.node[o] = r.node), r.isLast = !!d.keys?.length && +t == d.keys.length - 1, r.isFirst = 0 == +t, f.post && f.post(d, r), n.pop();
			}
			r.pop();
		}
		return f.after && f.after(d, d.node), d;
	}(e).node;
}
var j = class {
	#e;
	#t;
	constructor(e, t = g) {
		this.#e = e, this.#t = t;
	}
	get(e) {
		let t = this.#e;
		for (let o = 0; t && o < e.length; o++) {
			const n = e[o];
			if (!p.call(t, n) || !this.#t.includeSymbols && "symbol" == typeof n) return;
			t = t[n];
		}
		return t;
	}
	has(e) {
		let t = this.#e;
		for (let o = 0; t && o < e.length; o++) {
			const n = e[o];
			if (!p.call(t, n) || !this.#t.includeSymbols && "symbol" == typeof n) return !1;
			t = t[n];
		}
		return !0;
	}
	set(e, t) {
		let o = this.#e, n = 0;
		for (n = 0; n < e.length - 1; n++) {
			const t = e[n];
			p.call(o, t) || (o[t] = {}), o = o[t];
		}
		return o[e[n]] = t, t;
	}
	map(e) {
		return m(this.#e, e, {
			immutable: !0,
			includeSymbols: !!this.#t.includeSymbols
		});
	}
	forEach(e) {
		return this.#e = m(this.#e, e, this.#t), this.#e;
	}
	reduce(e, t) {
		const o = 1 === arguments.length;
		let n = o ? this.#e : t;
		return this.forEach(((t, r) => {
			t.isRoot && o || (n = e(t, n, r));
		})), n;
	}
	paths() {
		const e = [];
		return this.forEach(((t) => {
			e.push(t.path);
		})), e;
	}
	nodes() {
		const e = [];
		return this.forEach(((t) => {
			e.push(t.node);
		})), e;
	}
	clone() {
		const e = [], o = [], n = this.#t;
		return t(this.#e) ? this.#e.slice() : function t(r) {
			for (let t = 0; t < e.length; t++) if (e[t] === r) return o[t];
			if ("object" == typeof r && null !== r) {
				const s = y(r, n);
				e.push(r), o.push(s);
				const l = n.includeSymbols ? d : h;
				for (const e of l(r)) s[e] = t(r[e]);
				return e.pop(), o.pop(), s;
			}
			return r;
		}(this.#e);
	}
};
//#endregion
//#region node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
//#endregion
//#region node_modules/astro/dist/assets/utils/resolveImports.js
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
//#endregion
//#region node_modules/astro/dist/content/data-store.js
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_C1yfE4aE.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			const map = unflatten(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule();
			return instance;
		},
		set: (store) => {
			instance = store;
		}
	};
}
var globalDataStore = dataStoreSingleton();
//#endregion
//#region node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
//#endregion
//#region node_modules/astro/dist/content/runtime.js
var cacheHintSchema = object({
	tags: array(string()).optional(),
	lastModified: date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_DUKddbio.mjs");
			const result = [];
			for (const rawEntry of store.values(collection)) {
				const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (store.hasCollection(collection)) {
			const entry = store.get(collection, lookupId);
			if (!entry) {
				console.warn(`Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_DUKddbio.mjs");
			const data = updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) console.error(message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
	const copy = structuredClone(data);
	new j(copy).forEach(function(ctx, val) {
		if (typeof val === "string" && val.startsWith("__ASTRO_IMAGE_")) {
			const src = val.replace(IMAGE_IMPORT_PREFIX, "");
			const id = imageSrcToImportId(src, fileName);
			if (!id) {
				ctx.update(src);
				return;
			}
			const imported = imageAssetMap?.get(id);
			if (imported) if (imported.__svgData) {
				const { __svgData: svgData, ...meta } = imported;
				ctx.update(createSvgComponent({
					meta,
					...svgData
				}));
			} else ctx.update(imported);
			else ctx.update(src);
		}
	});
	return copy;
}
//#endregion
//#region \0astro:content
var liveCollections = {};
var getCollection = createGetCollection({ liveCollections });
createGetEntry({ liveCollections });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
//#endregion
//#region src/lib/content.ts
/**
* Shared helpers for working with Obsidian-sourced content collections.
*
* Both `tech` and `essays` collections share the same Obsidian frontmatter schema:
*   title, tags[], description?, category?, create_date?, created?, updated?
*
* This module normalizes them into a unified shape for the UI.
*/
var subCategoryMap = {
	ai: {
		name: "AI",
		icon: "🤖"
	},
	english: {
		name: "英语学习",
		icon: "📚"
	},
	kubernetes: {
		name: "Kubernetes",
		icon: "☸️"
	},
	linux: {
		name: "Linux",
		icon: "🐧"
	},
	database: {
		name: "数据库",
		icon: "💾"
	},
	mysql: {
		name: "MySQL",
		icon: "🗄️"
	},
	redis: {
		name: "Redis",
		icon: "🔴"
	},
	elasticsearch: {
		name: "Elasticsearch",
		icon: "🔍"
	},
	kafka: {
		name: "Kafka",
		icon: "🦜"
	},
	docker: {
		name: "Docker",
		icon: "🐳"
	},
	ansible: {
		name: "Ansible",
		icon: "🔧"
	},
	network: {
		name: "网络",
		icon: "🌐"
	},
	gpu: {
		name: "GPU",
		icon: "🎮"
	},
	programming: {
		name: "编程",
		icon: "💻"
	},
	java: {
		name: "Java",
		icon: "☕"
	},
	python: {
		name: "Python",
		icon: "🐍"
	},
	shell: {
		name: "Shell",
		icon: "🐚"
	},
	monitoring: {
		name: "监控",
		icon: "📊"
	},
	storage: {
		name: "存储",
		icon: "💿"
	},
	ceph: {
		name: "Ceph",
		icon: "💎"
	},
	openstack: {
		name: "OpenStack",
		icon: "☁️"
	},
	microservices: {
		name: "微服务",
		icon: "🔗"
	},
	middleware: {
		name: "中间件",
		icon: "🔧"
	},
	cicd: {
		name: "CI/CD",
		icon: "🔄"
	}
};
var dimensionPrefixes = {
	"岗位/": "岗位",
	"考点/": "考点",
	"难度/": "难度",
	"题型/": "题型"
};
var tagColors = {
	kubernetes: {
		bg: "bg-blue-50",
		text: "text-blue-600",
		border: "border-blue-200"
	},
	k8s: {
		bg: "bg-blue-50",
		text: "text-blue-600",
		border: "border-blue-200"
	},
	ai: {
		bg: "bg-purple-50",
		text: "text-purple-600",
		border: "border-purple-200"
	},
	linux: {
		bg: "bg-green-50",
		text: "text-green-600",
		border: "border-green-200"
	},
	docker: {
		bg: "bg-cyan-50",
		text: "text-cyan-600",
		border: "border-cyan-200"
	},
	mysql: {
		bg: "bg-orange-50",
		text: "text-orange-600",
		border: "border-orange-200"
	},
	redis: {
		bg: "bg-red-50",
		text: "text-red-600",
		border: "border-red-200"
	},
	kafka: {
		bg: "bg-indigo-50",
		text: "text-indigo-600",
		border: "border-indigo-200"
	},
	elasticsearch: {
		bg: "bg-amber-50",
		text: "text-amber-600",
		border: "border-amber-200"
	},
	java: {
		bg: "bg-red-50",
		text: "text-red-600",
		border: "border-red-200"
	},
	python: {
		bg: "bg-yellow-50",
		text: "text-yellow-700",
		border: "border-yellow-200"
	},
	shell: {
		bg: "bg-gray-50",
		text: "text-gray-600",
		border: "border-gray-200"
	},
	network: {
		bg: "bg-teal-50",
		text: "text-teal-600",
		border: "border-teal-200"
	},
	monitoring: {
		bg: "bg-pink-50",
		text: "text-pink-600",
		border: "border-pink-200"
	},
	database: {
		bg: "bg-orange-50",
		text: "text-orange-600",
		border: "border-orange-200"
	},
	ceph: {
		bg: "bg-blue-50",
		text: "text-blue-600",
		border: "border-blue-200"
	},
	ansible: {
		bg: "bg-purple-50",
		text: "text-purple-600",
		border: "border-purple-200"
	},
	gpu: {
		bg: "bg-emerald-50",
		text: "text-emerald-600",
		border: "border-emerald-200"
	},
	programming: {
		bg: "bg-gray-50",
		text: "text-gray-600",
		border: "border-gray-200"
	},
	storage: {
		bg: "bg-stone-50",
		text: "text-stone-600",
		border: "border-stone-200"
	},
	microservices: {
		bg: "bg-violet-50",
		text: "text-violet-600",
		border: "border-violet-200"
	},
	middleware: {
		bg: "bg-fuchsia-50",
		text: "text-fuchsia-600",
		border: "border-fuchsia-200"
	},
	cicd: {
		bg: "bg-rose-50",
		text: "text-rose-600",
		border: "border-rose-200"
	}
};
function getTagColor(tag) {
	return tagColors[tag.toLowerCase()] || {
		bg: "bg-gray-50",
		text: "text-gray-600",
		border: "border-gray-200"
	};
}
/** Get the best available date from Obsidian frontmatter */
function getDate(post) {
	const d = post.data;
	return d.create_date ?? d.created ?? d.updated ?? /* @__PURE__ */ new Date("2000-01-01");
}
/** Get flat tag list, stripping Obsidian path-style tags like "岗位/AI" -> "AI" */
function getTags(post) {
	return (post.data.tags ?? []).map((tag) => {
		const parts = tag.split("/");
		return parts[parts.length - 1];
	});
}
/** Get description / summary text */
function getSummary(post) {
	return post.data.description ?? "";
}
/** Extract subcategory from post ID/path */
function getSubCategory(post) {
	if (post.collection === "essays") return null;
	const parts = post.id.split("/");
	if (parts.length >= 2 && parts[0] === "cloud-native") {
		if ([
			"database",
			"container",
			"network",
			"monitoring",
			"storage",
			"programming"
		].includes(parts[1]) && parts.length >= 3) return parts[2];
		return parts[1];
	}
	if (parts.length >= 1) return parts[0];
	return null;
}
/** Get subcategory display name */
function getSubCategoryName(post) {
	const subCat = getSubCategory(post);
	if (!subCat) return "";
	return subCategoryMap[subCat]?.name ?? subCat;
}
/** Get all published posts from both collections, sorted by date desc */
async function getAllPosts() {
	const [techPosts, essayPosts] = await Promise.all([getCollection("tech"), getCollection("essays")]);
	return [...techPosts, ...essayPosts].sort((a, b) => getDate(b).getTime() - getDate(a).getTime());
}
/** Get all unique flat tags across all posts */
async function getAllTags() {
	const posts = await getAllPosts();
	const map = /* @__PURE__ */ new Map();
	for (const post of posts) for (const tag of getTags(post)) map.set(tag, (map.get(tag) ?? 0) + 1);
	return map;
}
/** Get all subcategories with counts */
async function getAllSubCategories() {
	const posts = await getAllPosts();
	const counts = /* @__PURE__ */ new Map();
	for (const post of posts) {
		const subCat = getSubCategory(post);
		if (subCat) counts.set(subCat, (counts.get(subCat) ?? 0) + 1);
	}
	return Array.from(counts.entries()).map(([id, count]) => ({
		id,
		name: subCategoryMap[id]?.name ?? id,
		icon: subCategoryMap[id]?.icon,
		count
	})).sort((a, b) => b.count - a.count);
}
/** Get tags grouped by dimension (岗位/考点/难度/题型) */
async function getTagDimensions() {
	const posts = await getAllPosts();
	const dimensionMap = /* @__PURE__ */ new Map();
	for (const post of posts) for (const tag of post.data.tags ?? []) for (const [prefix, dimensionName] of Object.entries(dimensionPrefixes)) if (tag.startsWith(prefix)) {
		const value = tag.replace(prefix, "");
		if (!dimensionMap.has(dimensionName)) dimensionMap.set(dimensionName, /* @__PURE__ */ new Map());
		dimensionMap.get(dimensionName).set(value, (dimensionMap.get(dimensionName).get(value) ?? 0) + 1);
		break;
	}
	return Array.from(dimensionMap.entries()).map(([id, values]) => ({
		id,
		name: id,
		values: Array.from(values.entries()).map(([valueId, count]) => ({
			id: valueId,
			name: valueId,
			count
		})).sort((a, b) => b.count - a.count)
	}));
}
/** Format date to locale string */
function formatDate(date) {
	return date.toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function extractBacklinks(body) {
	return (body.match(/\[\[([^\]]+)\]\]/g) || []).map((m) => m.slice(2, -2).trim());
}
async function buildGraphData() {
	const posts = await getAllPosts();
	const titleToPost = /* @__PURE__ */ new Map();
	const idToTitle = /* @__PURE__ */ new Map();
	for (const post of posts) {
		const title = post.data.title || "Untitled";
		titleToPost.set(title.toLowerCase(), post);
		idToTitle.set(`${post.collection}/${post.id}`, title);
	}
	const nodeMap = /* @__PURE__ */ new Map();
	const edgeSet = /* @__PURE__ */ new Set();
	for (const post of posts) {
		const postId = `${post.collection}/${post.id}`;
		const title = post.data.title || "Untitled";
		const backlinks = extractBacklinks(post.body ?? "");
		if (!nodeMap.has(postId)) nodeMap.set(postId, {
			id: postId,
			title,
			collection: post.collection,
			subCategory: getSubCategory(post),
			backlinks: 0,
			connections: backlinks.length
		});
		else nodeMap.get(postId).connections = backlinks.length;
		for (const linkedTitle of backlinks) {
			const linkedPost = titleToPost.get(linkedTitle.toLowerCase());
			if (linkedPost) {
				const linkedId = `${linkedPost.collection}/${linkedPost.id}`;
				if (!nodeMap.has(linkedId)) nodeMap.set(linkedId, {
					id: linkedId,
					title: linkedPost.data.title || "Untitled",
					collection: linkedPost.collection,
					subCategory: getSubCategory(linkedPost),
					backlinks: 0,
					connections: 0
				});
				nodeMap.get(linkedId).backlinks += 1;
				const edgeKey = [postId, linkedId].sort().join("|");
				edgeSet.add(edgeKey);
			}
		}
	}
	return {
		nodes: Array.from(nodeMap.values()).filter((n) => n.connections > 0 || n.backlinks > 0),
		edges: Array.from(edgeSet).map((key) => {
			const [source, target] = key.split("|");
			return {
				source,
				target
			};
		})
	};
}
//#endregion
export { getAllTags as a, getSummary as c, getTags as d, getAllSubCategories as i, getTagColor as l, formatDate as n, getDate as o, getAllPosts as r, getSubCategoryName as s, buildGraphData as t, getTagDimensions as u };
