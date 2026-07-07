import { t as getCollection } from "./_astro_content_C7znbMFL.mjs";
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
/** Estimate reading time */
function readingTime(body) {
	const chars = (body ?? "").replace(/\s/g, "").length;
	return Math.max(1, Math.ceil(chars / 400));
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
export { getAllTags as a, getSummary as c, getTags as d, readingTime as f, getAllSubCategories as i, getTagColor as l, formatDate as n, getDate as o, getAllPosts as r, getSubCategoryName as s, buildGraphData as t, getTagDimensions as u };
