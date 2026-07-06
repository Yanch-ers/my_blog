---
title: "Astro 入门指南"
date: 2026-07-04
tags: ["技术", "Astro", "前端"]
summary: "一篇关于 Astro 框架的入门笔记，涵盖核心概念和基本用法。"
draft: false
---

## 什么是 Astro

Astro 是一个面向内容型网站的现代框架。它的核心理念是 **零 JavaScript 默认输出**，只在需要交互的地方才加载 JS。

### Islands 架构

Astro 使用 Islands 架构，可以将页面分为：

1. **静态部分** — 服务端渲染，不发送 JS
2. **交互岛屿** — 使用 React/Vue/Svelte 等框架的交互组件

### 内容集合

Astro 4.0+ 引入了 Content Collections，让 Markdown 内容管理变得类型安全：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});
```

### 性能优势

| 特性 | Astro | Next.js | Gatsby |
|------|-------|---------|--------|
| 默认 JS | 无 | 大量 | 大量 |
| 构建速度 | 快 | 中 | 慢 |
| 学习曲线 | 低 | 高 | 中 |

### 总结

Astro 非常适合博客、文档等内容驱动的网站。如果你追求极致的性能和简单的开发体验，Astro 是一个值得尝试的选择。
