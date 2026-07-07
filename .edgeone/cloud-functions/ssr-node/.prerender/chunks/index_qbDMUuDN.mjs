import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { T as createComponent, f as renderTemplate, g as maybeRenderHead, o as renderComponent, v as addAttribute } from "./server_BzLvcQuV.mjs";
import "./compiler_CykheeCx.mjs";
import { n as $$Header, r as $$BaseLayout, t as $$Footer } from "./Footer_BfBjyjUc.mjs";
import { a as getAllTags, i as getAllSubCategories, l as getTagColor, t as buildGraphData, u as getTagDimensions } from "./content_BhODR8ss.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//#region src/components/GraphVisualization.tsx
var subCategoryColors = {
	ai: {
		fill: "#a855f7",
		stroke: "#a855f7"
	},
	kubernetes: {
		fill: "#3b82f6",
		stroke: "#3b82f6"
	},
	linux: {
		fill: "#22c55e",
		stroke: "#22c55e"
	},
	docker: {
		fill: "#06b6d4",
		stroke: "#06b6d4"
	},
	mysql: {
		fill: "#f97316",
		stroke: "#f97316"
	},
	redis: {
		fill: "#ef4444",
		stroke: "#ef4444"
	},
	kafka: {
		fill: "#6366f1",
		stroke: "#6366f1"
	},
	elasticsearch: {
		fill: "#f59e0b",
		stroke: "#f59e0b"
	},
	java: {
		fill: "#ef4444",
		stroke: "#ef4444"
	},
	python: {
		fill: "#eab308",
		stroke: "#eab308"
	},
	shell: {
		fill: "#6b7280",
		stroke: "#6b7280"
	},
	network: {
		fill: "#14b8a6",
		stroke: "#14b8a6"
	},
	monitoring: {
		fill: "#ec4899",
		stroke: "#ec4899"
	},
	database: {
		fill: "#f97316",
		stroke: "#f97316"
	},
	ceph: {
		fill: "#3b82f6",
		stroke: "#3b82f6"
	},
	ansible: {
		fill: "#a855f7",
		stroke: "#a855f7"
	},
	gpu: {
		fill: "#10b981",
		stroke: "#10b981"
	},
	programming: {
		fill: "#6b7280",
		stroke: "#6b7280"
	},
	storage: {
		fill: "#78716c",
		stroke: "#78716c"
	},
	microservices: {
		fill: "#8b5cf6",
		stroke: "#8b5cf6"
	},
	middleware: {
		fill: "#d946ef",
		stroke: "#d946ef"
	},
	cicd: {
		fill: "#f43f5e",
		stroke: "#f43f5e"
	}
};
function getNodeColor(node) {
	return subCategoryColors[node.subCategory?.toLowerCase() || ""] || {
		fill: "#9ca3af",
		stroke: "#9ca3af"
	};
}
function GraphVisualization({ nodes, edges }) {
	const containerRef = useRef(null);
	const [hoveredNode, setHoveredNode] = useState(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipPos, setTooltipPos] = useState({
		x: 0,
		y: 0
	});
	const sceneRef = useRef(null);
	const cameraRef = useRef(null);
	const rendererRef = useRef(null);
	const controlsRef = useRef(null);
	const raycasterRef = useRef(new THREE.Raycaster());
	const mouseRef = useRef(new THREE.Vector2());
	const nodeMeshMapRef = useRef(/* @__PURE__ */ new Map());
	const nodeDataMapRef = useRef(/* @__PURE__ */ new Map());
	const edgeMeshMapRef = useRef(/* @__PURE__ */ new Map());
	const originalEdgeColorsRef = useRef(/* @__PURE__ */ new Map());
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const width = container.clientWidth;
		const height = container.clientHeight;
		const scene = new THREE.Scene();
		scene.background = new THREE.Color("#ffffff");
		sceneRef.current = scene;
		const camera = new THREE.PerspectiveCamera(60, width / height, .1, 1e3);
		camera.position.set(0, 0, 160);
		cameraRef.current = camera;
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = .05;
		controls.enableZoom = true;
		controls.enablePan = false;
		controls.minDistance = 20;
		controls.maxDistance = 200;
		controlsRef.current = controls;
		const ambientLight = new THREE.AmbientLight(16777215, 1);
		scene.add(ambientLight);
		const centerGroup = new THREE.Group();
		scene.add(centerGroup);
		const sortedNodes = [...nodes].sort((a, b) => {
			const aScore = a.connections + a.backlinks;
			return b.connections + b.backlinks - aScore;
		});
		const nodePositions = /* @__PURE__ */ new Map();
		sortedNodes.forEach((node) => {
			const totalScore = node.connections + node.backlinks;
			const nodeSize = Math.max(.8, Math.min(2.5, totalScore * .15 + 1));
			const radius = 30 + Math.random() * 100;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			nodePositions.set(node.id, {
				x: radius * Math.sin(phi) * Math.cos(theta),
				y: radius * Math.sin(phi) * Math.sin(theta),
				z: radius * Math.cos(phi),
				size: nodeSize,
				vx: 0,
				vy: 0,
				vz: 0
			});
		});
		const repulsionStrength = 2e4;
		const attractionStrength = .01;
		const damping = .9;
		const maxIterations = 150;
		for (let iter = 0; iter < maxIterations; iter++) {
			for (const [id1, pos1] of nodePositions) for (const [id2, pos2] of nodePositions) {
				if (id1 === id2) continue;
				const dx = pos2.x - pos1.x;
				const dy = pos2.y - pos1.y;
				const dz = pos2.z - pos1.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || .1;
				const force = repulsionStrength / (distance * distance);
				pos1.vx -= dx / distance * force;
				pos1.vy -= dy / distance * force;
				pos1.vz -= dz / distance * force;
			}
			for (const edge of edges) {
				const pos1 = nodePositions.get(edge.source);
				const pos2 = nodePositions.get(edge.target);
				if (!pos1 || !pos2) continue;
				const dx = pos2.x - pos1.x;
				const dy = pos2.y - pos1.y;
				const dz = pos2.z - pos1.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || .1;
				const force = (distance - 30) * attractionStrength;
				pos1.vx += dx / distance * force;
				pos1.vy += dy / distance * force;
				pos1.vz += dz / distance * force;
				pos2.vx -= dx / distance * force;
				pos2.vy -= dy / distance * force;
				pos2.vz -= dz / distance * force;
			}
			for (const [, pos] of nodePositions) {
				pos.vx *= damping;
				pos.vy *= damping;
				pos.vz *= damping;
				pos.x += pos.vx;
				pos.y += pos.vy;
				pos.z += pos.vz;
				const distFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
				if (distFromCenter > 120) {
					pos.x = pos.x / distFromCenter * 120;
					pos.y = pos.y / distFromCenter * 120;
					pos.z = pos.z / distFromCenter * 120;
				}
			}
		}
		const placedPositions = /* @__PURE__ */ new Map();
		nodePositions.forEach((pos, id) => {
			placedPositions.set(id, {
				x: pos.x,
				y: pos.y,
				z: pos.z,
				size: pos.size
			});
		});
		sortedNodes.forEach((node) => {
			const pos = placedPositions.get(node.id);
			const color = getNodeColor(node);
			const geometry = new THREE.SphereGeometry(pos.size, 16, 16);
			const material = new THREE.MeshBasicMaterial({
				color: new THREE.Color(color.stroke),
				transparent: true,
				opacity: .8
			});
			const sphere = new THREE.Mesh(geometry, material);
			sphere.position.set(pos.x, pos.y, pos.z);
			centerGroup.add(sphere);
			nodeMeshMapRef.current.set(node.id, sphere);
			nodeDataMapRef.current.set(sphere, node);
		});
		const edgeMaterial = new THREE.LineBasicMaterial({
			color: 13751771,
			transparent: true,
			opacity: .4
		});
		edges.forEach((edge) => {
			const sourceMesh = nodeMeshMapRef.current.get(edge.source);
			const targetMesh = nodeMeshMapRef.current.get(edge.target);
			if (sourceMesh && targetMesh) {
				const points = [sourceMesh.position.clone(), targetMesh.position.clone()];
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				const line = new THREE.Line(geometry, edgeMaterial.clone());
				const edgeKey = [edge.source, edge.target].sort().join("|");
				edgeMeshMapRef.current.set(edgeKey, line);
				originalEdgeColorsRef.current.set(edgeKey, new THREE.Color(13751771));
				centerGroup.add(line);
			}
		});
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();
		const handleResize = () => {
			const newWidth = container.clientWidth;
			const newHeight = container.clientHeight;
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newWidth, newHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			controls.dispose();
			renderer.dispose();
			container.removeChild(renderer.domElement);
			centerGroup.traverse((object) => {
				if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
					object.geometry.dispose();
					if (object.material instanceof THREE.Material) object.material.dispose();
				}
			});
			nodeMeshMapRef.current.clear();
			nodeDataMapRef.current.clear();
			edgeMeshMapRef.current.clear();
			originalEdgeColorsRef.current.clear();
		};
	}, [nodes, edges]);
	const highlightNode = useCallback((nodeId) => {
		for (const [id, mesh] of nodeMeshMapRef.current) {
			const material = mesh.material;
			const node = nodeDataMapRef.current.get(mesh);
			const color = getNodeColor(node);
			if (nodeId === id) {
				material.color.set(color.stroke);
				material.opacity = 1;
				mesh.geometry.radius = Math.max(2, Math.min(5, (node.connections + node.backlinks) * .5 + 2));
			} else {
				material.color.set(color.stroke);
				material.opacity = nodeId ? .3 : .8;
				const originalSize = Math.max(1.5, Math.min(4, (node.connections + node.backlinks) * .4 + 1.5));
				mesh.geometry.radius = originalSize;
			}
		}
		for (const [key, line] of edgeMeshMapRef.current) {
			const material = line.material;
			const [sourceId, targetId] = key.split("|");
			if (nodeId && (sourceId === nodeId || targetId === nodeId)) {
				material.color.set("#a855f7");
				material.opacity = .8;
			} else {
				material.color.set(nodeId ? 15067115 : 13751771);
				material.opacity = nodeId ? .15 : .4;
			}
		}
	}, []);
	const handleMouseMove = useCallback((e) => {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		mouseRef.current.x = (e.clientX - rect.left) / rect.width * 2 - 1;
		mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
		const meshArray = Array.from(nodeMeshMapRef.current.values());
		const intersects = raycasterRef.current.intersectObjects(meshArray, true);
		if (intersects.length > 0) {
			let target = intersects[0].object;
			while (target.parent && !nodeDataMapRef.current.has(target)) target = target.parent;
			const node = nodeDataMapRef.current.get(target);
			if (node) {
				setHoveredNode(node);
				setTooltipPos({
					x: e.clientX,
					y: e.clientY
				});
				setShowTooltip(true);
				container.style.cursor = "pointer";
				highlightNode(node.id);
				return;
			}
		}
		setHoveredNode(null);
		setShowTooltip(false);
		container.style.cursor = "grab";
		highlightNode(null);
	}, [highlightNode]);
	const handleMouseLeave = useCallback(() => {
		setHoveredNode(null);
		setShowTooltip(false);
		highlightNode(null);
	}, [highlightNode]);
	const handleClick = useCallback((e) => {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		mouseRef.current.x = (e.clientX - rect.left) / rect.width * 2 - 1;
		mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
		const meshArray = Array.from(nodeMeshMapRef.current.values());
		const intersects = raycasterRef.current.intersectObjects(meshArray, true);
		if (intersects.length > 0) {
			let target = intersects[0].object;
			while (target.parent && !nodeDataMapRef.current.has(target)) target = target.parent;
			const node = nodeDataMapRef.current.get(target);
			if (node) window.location.href = `/posts/${node.id}`;
		}
	}, []);
	const getPostUrl = useCallback((node) => {
		return `/posts/${node.id}`;
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "relative w-full h-[500px] rounded-xl border border-gray-200 bg-white overflow-hidden",
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		onClick: handleClick,
		children: [
			showTooltip && hoveredNode && /* @__PURE__ */ jsxs("div", {
				className: "fixed z-50 rounded-lg shadow-xl border border-gray-100 bg-white p-3",
				style: {
					left: tooltipPos.x + 15,
					top: tooltipPos.y + 15,
					maxWidth: "250px"
				},
				children: [/* @__PURE__ */ jsx("a", {
					href: getPostUrl(hoveredNode),
					className: "font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate",
					children: hoveredNode.title
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1 text-xs text-gray-500 space-y-0.5",
					children: [
						/* @__PURE__ */ jsxs("p", { children: ["分类: ", hoveredNode.subCategory || "随笔"] }),
						/* @__PURE__ */ jsxs("p", { children: ["引用数: ", hoveredNode.backlinks] }),
						/* @__PURE__ */ jsxs("p", { children: ["链接数: ", hoveredNode.connections] })
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-4 left-4 flex gap-2 flex-wrap z-10",
				children: Object.entries(subCategoryColors).slice(0, 6).map(([key, value]) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-2 h-2 rounded-full",
						style: { backgroundColor: value.stroke }
					}), /* @__PURE__ */ jsx("span", {
						className: "text-gray-600",
						children: subCategoryMap[key]?.name || key
					})]
				}, key))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-4 right-4 text-xs text-gray-400 z-10",
				children: "鼠标拖拽旋转 | 滚轮缩放"
			})
		]
	});
}
var subCategoryMap = {
	ai: { name: "AI" },
	kubernetes: { name: "Kubernetes" },
	linux: { name: "Linux" },
	docker: { name: "Docker" },
	mysql: { name: "MySQL" },
	redis: { name: "Redis" },
	kafka: { name: "Kafka" },
	elasticsearch: { name: "Elasticsearch" },
	java: { name: "Java" },
	python: { name: "Python" },
	shell: { name: "Shell" },
	network: { name: "网络" },
	monitoring: { name: "监控" },
	database: { name: "数据库" },
	ceph: { name: "Ceph" },
	ansible: { name: "Ansible" },
	gpu: { name: "GPU" },
	programming: { name: "编程" },
	storage: { name: "存储" },
	microservices: { name: "微服务" },
	middleware: { name: "中间件" },
	cicd: { name: "CI/CD" }
};
//#endregion
//#region src/pages/tags/index.astro
var tags_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const tagMap = await getAllTags();
	const subCategories = await getAllSubCategories();
	const tagDimensions = await getTagDimensions();
	const graphData = await buildGraphData();
	const tags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "标签" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12"><header class="mb-10 animate-fade-in"><p class="mb-2 text-sm text-gray-400">标签</p><h1 class="font-serif text-3xl font-bold tracking-tight text-gray-900">标签云</h1><p class="mt-2 text-gray-500">共 ${tags.length} 个标签，${subCategories.length} 个分类</p></header><section class="mb-10 animate-fade-in animate-delay-1"><h2 class="mb-4 text-sm font-semibold text-gray-900">📂 分类导航</h2><div class="flex flex-wrap gap-2"><a href="/" class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md">全部文章</a>${subCategories.map((cat) => {
		const color = getTagColor(cat.id);
		return renderTemplate`<a${addAttribute(cat.id, "key")}${addAttribute(`/tags/${cat.id}`, "href")}${addAttribute(`inline-flex items-center gap-2 rounded-full border ${color.bg} ${color.border} ${color.text} px-4 py-2 text-sm transition-all hover:shadow-md hover:-translate-y-0.5`, "class")}>${cat.icon}${cat.name}<span${addAttribute(`rounded-full bg-white/50 px-2 py-0.5 text-xs ${color.text}`, "class")}>${cat.count}</span></a>`;
	})}</div></section>${tagDimensions.length > 0 && renderTemplate`<section class="mb-10 animate-fade-in animate-delay-1"><h2 class="mb-4 text-sm font-semibold text-gray-900">🎯 标签维度</h2><div class="grid gap-4 md:grid-cols-2">${tagDimensions.map((dim) => renderTemplate`<div${addAttribute(dim.id, "key")} class="rounded-xl border border-gray-200 bg-white p-4"><p class="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">${dim.name}</p><div class="flex flex-wrap gap-2">${dim.values.map((value) => {
		const color = getTagColor(value.id);
		return renderTemplate`<a${addAttribute(value.id, "key")}${addAttribute(`/tags/${value.id}`, "href")}${addAttribute(`inline-flex items-center gap-1 rounded-full border ${color.bg} ${color.border} ${color.text} px-3 py-1.5 text-xs transition-all hover:shadow-sm hover:-translate-y-0.5`, "class")}>${value.name}<span${addAttribute(color.text, "class")}>${value.count}</span></a>`;
	})}</div></div>`)}</div></section>`}<section class="animate-fade-in animate-delay-2"><h2 class="mb-4 text-sm font-semibold text-gray-900">🗺️ 知识图谱</h2><p class="mb-4 text-xs text-gray-500">基于文章双向链接自动生成，节点大小表示连接强度，颜色区分分类</p>${renderComponent($$result, "GraphVisualization", GraphVisualization, {
		"nodes": graphData.nodes,
		"edges": graphData.edges,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "D:/Qoder/blog/src/components/GraphVisualization.tsx",
		"client:component-export": "default"
	})}</section>${tags.length === 0 && renderTemplate`<p class="py-12 text-center text-[var(--color-text-muted)]">暂无标签</p>`}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "D:/Qoder/blog/src/pages/tags/index.astro", void 0);
var $$file = "D:/Qoder/blog/src/pages/tags/index.astro";
var $$url = "/tags";
//#endregion
//#region \0virtual:astro:page:src/pages/tags/index@_@astro
var page = () => tags_exports;
//#endregion
export { page };
