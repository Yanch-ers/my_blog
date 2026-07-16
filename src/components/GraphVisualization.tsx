import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GraphNode, GraphEdge } from '../lib/content';

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const subCategoryColors: Record<string, { fill: string; stroke: string }> = {
  ai: { fill: '#a855f7', stroke: '#a855f7' },
  kubernetes: { fill: '#3b82f6', stroke: '#3b82f6' },
  linux: { fill: '#22c55e', stroke: '#22c55e' },
  docker: { fill: '#06b6d4', stroke: '#06b6d4' },
  mysql: { fill: '#f97316', stroke: '#f97316' },
  redis: { fill: '#ef4444', stroke: '#ef4444' },
  kafka: { fill: '#6366f1', stroke: '#6366f1' },
  elasticsearch: { fill: '#f59e0b', stroke: '#f59e0b' },
  java: { fill: '#ef4444', stroke: '#ef4444' },
  python: { fill: '#eab308', stroke: '#eab308' },
  shell: { fill: '#6b7280', stroke: '#6b7280' },
  network: { fill: '#14b8a6', stroke: '#14b8a6' },
  monitoring: { fill: '#ec4899', stroke: '#ec4899' },
  database: { fill: '#f97316', stroke: '#f97316' },
  ceph: { fill: '#3b82f6', stroke: '#3b82f6' },
  ansible: { fill: '#a855f7', stroke: '#a855f7' },
  gpu: { fill: '#10b981', stroke: '#10b981' },
  programming: { fill: '#6b7280', stroke: '#6b7280' },
  storage: { fill: '#78716c', stroke: '#78716c' },
  microservices: { fill: '#8b5cf6', stroke: '#8b5cf6' },
  middleware: { fill: '#d946ef', stroke: '#d946ef' },
  cicd: { fill: '#f43f5e', stroke: '#f43f5e' },
};

function getNodeColor(node: GraphNode) {
  const subCat = node.subCategory?.toLowerCase() || '';
  return subCategoryColors[subCat] || { fill: '#9ca3af', stroke: '#9ca3af' };
}

export default function GraphVisualization({ nodes, edges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRectRef = useRef<DOMRect | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  const nodeMeshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const nodeDataMapRef = useRef<Map<THREE.Object3D, GraphNode>>(new Map());
  const edgeMeshMapRef = useRef<Map<string, THREE.Line>>(new Map());
  const originalEdgeColorsRef = useRef<Map<string, THREE.Color>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 160);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.maxDistance = 200;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    const sortedNodes = [...nodes].sort((a, b) => {
      const aScore = a.connections + a.backlinks;
      const bScore = b.connections + b.backlinks;
      return bScore - aScore;
    });

    const nodePositions = new Map<string, { x: number; y: number; z: number; size: number; vx: number; vy: number; vz: number }>();

    sortedNodes.forEach((node) => {
      const totalScore = node.connections + node.backlinks;
      const nodeSize = Math.max(0.8, Math.min(2.5, totalScore * 0.15 + 1));

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
        vz: 0,
      });
    });

    const repulsionStrength = 20000;
    const attractionStrength = 0.01;
    const damping = 0.9;
    const maxIterations = 150;

    for (let iter = 0; iter < maxIterations; iter++) {
      for (const [id1, pos1] of nodePositions) {
        for (const [id2, pos2] of nodePositions) {
          if (id1 === id2) continue;

          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const dz = pos2.z - pos1.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

          const force = repulsionStrength / (distance * distance);
          pos1.vx -= (dx / distance) * force;
          pos1.vy -= (dy / distance) * force;
          pos1.vz -= (dz / distance) * force;
        }
      }

      for (const edge of edges) {
        const pos1 = nodePositions.get(edge.source);
        const pos2 = nodePositions.get(edge.target);
        if (!pos1 || !pos2) continue;

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

        const force = (distance - 30) * attractionStrength;
        pos1.vx += (dx / distance) * force;
        pos1.vy += (dy / distance) * force;
        pos1.vz += (dz / distance) * force;
        pos2.vx -= (dx / distance) * force;
        pos2.vy -= (dy / distance) * force;
        pos2.vz -= (dz / distance) * force;
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
          pos.x = (pos.x / distFromCenter) * 120;
          pos.y = (pos.y / distFromCenter) * 120;
          pos.z = (pos.z / distFromCenter) * 120;
        }
      }
    }

    const placedPositions = new Map<string, { x: number; y: number; z: number; size: number }>();
    nodePositions.forEach((pos, id) => {
      placedPositions.set(id, { x: pos.x, y: pos.y, z: pos.z, size: pos.size });
    });

    sortedNodes.forEach((node) => {
      const pos = placedPositions.get(node.id)!;
      const color = getNodeColor(node);

      const geometry = new THREE.SphereGeometry(pos.size, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color.stroke),
        transparent: true,
        opacity: 0.8,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(pos.x, pos.y, pos.z);

      centerGroup.add(sphere);
      nodeMeshMapRef.current.set(node.id, sphere);
      nodeDataMapRef.current.set(sphere, node);
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xd1d5db,
      transparent: true,
      opacity: 0.4,
    });

    edges.forEach(edge => {
      const sourceMesh = nodeMeshMapRef.current.get(edge.source);
      const targetMesh = nodeMeshMapRef.current.get(edge.target);

      if (sourceMesh && targetMesh) {
        const points = [
          sourceMesh.position.clone(),
          targetMesh.position.clone(),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, edgeMaterial.clone());
        
        const edgeKey = [edge.source, edge.target].sort().join('|');
        edgeMeshMapRef.current.set(edgeKey, line);
        originalEdgeColorsRef.current.set(edgeKey, new THREE.Color(0xd1d5db));
        
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);

      centerGroup.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      nodeMeshMapRef.current.clear();
      nodeDataMapRef.current.clear();
      edgeMeshMapRef.current.clear();
      originalEdgeColorsRef.current.clear();
    };
  }, [nodes, edges]);

  const highlightNode = useCallback((nodeId: string | null) => {
    for (const [id, mesh] of nodeMeshMapRef.current) {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const node = nodeDataMapRef.current.get(mesh)!;
      const color = getNodeColor(node);
      
      if (nodeId === id) {
        material.color.set(color.stroke);
        material.opacity = 1;
        (mesh.geometry as THREE.SphereGeometry).radius = Math.max(2, Math.min(5, (node.connections + node.backlinks) * 0.5 + 2));
      } else {
        material.color.set(color.stroke);
        material.opacity = nodeId ? 0.3 : 0.8;
        const originalSize = Math.max(1.5, Math.min(4, (node.connections + node.backlinks) * 0.4 + 1.5));
        (mesh.geometry as THREE.SphereGeometry).radius = originalSize;
      }
    }

    for (const [key, line] of edgeMeshMapRef.current) {
      const material = line.material as THREE.LineBasicMaterial;
      const [sourceId, targetId] = key.split('|');
      
      if (nodeId && (sourceId === nodeId || targetId === nodeId)) {
        material.color.set('#a855f7');
        material.opacity = 0.8;
      } else {
        material.color.set(nodeId ? 0xe5e7eb : 0xd1d5db);
        material.opacity = nodeId ? 0.15 : 0.4;
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    containerRectRef.current = rect;
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

    const meshArray = Array.from(nodeMeshMapRef.current.values());
    const intersects = raycasterRef.current.intersectObjects(meshArray, true);

    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target.parent && !nodeDataMapRef.current.has(target)) {
        target = target.parent;
      }
      
      const node = nodeDataMapRef.current.get(target);
      if (node) {
        setHoveredNode(node);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setShowTooltip(true);
        container.style.cursor = 'pointer';
        highlightNode(node.id);
        return;
      }
    }

    setHoveredNode(null);
    setShowTooltip(false);
    container.style.cursor = 'grab';
    highlightNode(null);
  }, [highlightNode]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
    setShowTooltip(false);
    highlightNode(null);
  }, [highlightNode]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

    const meshArray = Array.from(nodeMeshMapRef.current.values());
    const intersects = raycasterRef.current.intersectObjects(meshArray, true);

    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target.parent && !nodeDataMapRef.current.has(target)) {
        target = target.parent;
      }
      
      const node = nodeDataMapRef.current.get(target);
      if (node) {
        window.location.href = `/posts/${node.id}`;
      }
    }
  }, []);

  const getPostUrl = useCallback((node: GraphNode) => {
    return `/posts/${node.id}`;
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[500px] rounded-xl border border-gray-200 bg-white overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showTooltip && hoveredNode && (
        <div
          className="absolute z-50 rounded-lg shadow-xl border border-gray-100 bg-white p-3 pointer-events-none"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
            maxWidth: '250px',
          }}
        >
          <a
            href={getPostUrl(hoveredNode)}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
          >
            {hoveredNode.title}
          </a>
          <div className="mt-1 text-xs text-gray-500 space-y-0.5">
            <p>分类: {hoveredNode.subCategory || '随笔'}</p>
            <p>引用数: {hoveredNode.backlinks}</p>
            <p>链接数: {hoveredNode.connections}</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap z-10">
        {Object.entries(subCategoryColors).slice(0, 6).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: value.stroke }}
            />
            <span className="text-gray-600">{subCategoryMap[key]?.name || key}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 text-xs text-gray-400 z-10">
        鼠标拖拽旋转 | 滚轮缩放
      </div>
    </div>
  );
}

const subCategoryMap: Record<string, { name: string }> = {
  ai: { name: 'AI' },
  kubernetes: { name: 'Kubernetes' },
  linux: { name: 'Linux' },
  docker: { name: 'Docker' },
  mysql: { name: 'MySQL' },
  redis: { name: 'Redis' },
  kafka: { name: 'Kafka' },
  elasticsearch: { name: 'Elasticsearch' },
  java: { name: 'Java' },
  python: { name: 'Python' },
  shell: { name: 'Shell' },
  network: { name: '网络' },
  monitoring: { name: '监控' },
  database: { name: '数据库' },
  ceph: { name: 'Ceph' },
  ansible: { name: 'Ansible' },
  gpu: { name: 'GPU' },
  programming: { name: '编程' },
  storage: { name: '存储' },
  microservices: { name: '微服务' },
  middleware: { name: '中间件' },
  cicd: { name: 'CI/CD' },
};
