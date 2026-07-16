# Yanche Blog

一个基于 Astro 7 构建的个人技术博客，内容来自独立的 Obsidian 仓库，站点静态生成并部署到腾讯云 EdgeOne。

[在线访问](https://yanche.chat)

## 项目简介

Yanche Blog 用于沉淀云原生运维、Linux、Kubernetes、数据库、AI 自动化等技术笔记。项目采用代码仓库和内容仓库分离的方式：博客代码负责展示、路由、样式和构建流程，文章内容继续保留在 Obsidian 工作流中维护。

## 特性

- Astro 静态生成，适合内容型站点和 CDN 托管
- Obsidian Markdown 内容接入，支持 `[[双向链接]]` 和 Callout 语法转换
- 技术文章与随笔两类内容集合统一检索、分页和展示
- React 交互组件按需加载，包括搜索、终端 Hero、知识图谱和视频播放器
- Three.js 知识图谱，根据文章双链关系生成关联可视化
- RSS 订阅、Sitemap、标签页、分页页和文章详情页
- EdgeOne 自动构建部署，支持内容仓库更新后触发博客重建

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 框架 | Astro 7 |
| UI 交互 | React 19 |
| 样式 | Tailwind CSS 4 + 全局 CSS 变量 |
| 内容 | Astro Content Collections + Obsidian Markdown |
| Markdown 扩展 | 自定义 remark 插件 |
| 可视化 | Three.js |
| 部署 | 腾讯云 EdgeOne |
| CI/CD | GitHub Actions + repository_dispatch |

## 仓库架构

项目采用双仓库模式：

| 仓库 | 用途 | 分支 |
| --- | --- | --- |
| [my_blog](https://github.com/Yanch-ers/my_blog) | 博客代码、页面、样式、构建配置 | `master` |
| [obsidian_vault](https://github.com/Yanch-ers/obsidian_vault) | Obsidian Markdown 文章内容 | `main` |

构建时会把 `obsidian_vault` 克隆到 `content/obsidian`，再由 Astro Content Collections 读取指定目录生成页面。

## 目录结构

```text
.
├── src/
│   ├── components/              # Astro 与 React 组件
│   ├── layouts/                 # 页面布局
│   ├── lib/                     # 内容归一化、URL 映射、知识图谱数据
│   ├── pages/                   # Astro 路由
│   │   ├── posts/[collection]/  # 文章详情页
│   │   ├── tags/                # 标签页
│   │   ├── page/                # 分页列表
│   │   └── api/search.json.ts   # 静态搜索索引
│   ├── plugins/                 # remark-obsidian 插件
│   ├── styles/                  # 全局样式
│   └── content.config.ts        # 内容集合配置
├── scripts/
│   └── clone-content.cjs        # 构建时克隆内容仓库
├── content/                     # 本地内容目录，来自 obsidian_vault
├── public/                      # 静态资源
├── .edgeone/                    # EdgeOne 构建产物目录
├── astro.config.mjs             # 生产构建配置
├── astro.config.dev.mjs         # 本地开发配置
└── package.json
```

## 快速开始

### 环境要求

- Node.js `>=22.12.0`
- npm
- 可访问内容仓库的 GitHub Token

### 安装依赖

```bash
npm install
```

### 准备内容

```bash
GH_TOKEN=your_github_token npm run setup
```

该命令会把 `obsidian_vault` 克隆到 `content/obsidian`。

### 启动开发服务器

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:4321
```

> 本项目约定启动 Astro 开发服务器时优先使用后台模式：`astro dev --background`。可通过 `astro dev status`、`astro dev logs` 和 `astro dev stop` 管理后台服务。

### 生产构建

```bash
npm run build
```

EdgeOne 构建环境使用：

```bash
npm run build:cf
```

## 内容模型

内容集合定义在 `src/content.config.ts`：

- `tech`：读取 `content/obsidian/20-areas`
- `essays`：读取 `content/obsidian/30-life/essays`

Frontmatter 字段兼容 Obsidian 的常见写法：

```yaml
---
title: 文章标题
tags:
  - Kubernetes
  - Linux
description: 文章摘要
category: cloud-native
created: 2026-07-16
updated: 2026-07-16
---
```

日期字段会按 `create_date`、`created`、`updated` 的顺序兜底读取。

## Obsidian 语法支持

自定义插件 `src/plugins/remark-obsidian.mjs` 负责处理 Obsidian 专有语法：

- `[[文章标题]]` 转换为站内链接
- `[[文章标题|展示文本]]` 转换为带别名的站内链接
- `> [!info]`、`> [!warning]` 等 Callout 转换为可样式化的提示块
- `dataview` 代码块在构建时过滤，避免静态站点渲染异常

文章标题到 URL 的映射由 `src/lib/title-url-map.ts` 生成，支持按标题、相对路径和文件名匹配。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run setup` | 克隆内容仓库到 `content/obsidian` |
| `npm run dev` | 启动 Astro 开发服务器 |
| `npm run build` | 构建静态站点 |
| `npm run build:cf` | EdgeOne 构建流程：克隆内容、构建、复制产物 |
| `npm run preview` | 本地预览构建产物 |
| `npm run postbuild` | 将 `dist` 复制到 `.edgeone/assets` |

## 部署流程

EdgeOne 监听 `my_blog` 的 `master` 分支变更，并执行：

```bash
npm run build:cf
```

构建流程：

1. 使用 `GH_TOKEN` 克隆 `obsidian_vault`
2. 将 Markdown 文件的 CRLF 转换为 LF，避免 Linux 构建环境中的 YAML 解析问题
3. 执行 `astro build` 生成静态站点
4. 将 `dist` 复制到 `.edgeone/assets`

内容仓库更新时，`obsidian_vault` 通过 GitHub Actions 向 `my_blog` 发送 `repository_dispatch` 事件；`my_blog` 收到事件后创建空提交，从而触发 EdgeOne 重新构建。

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `GH_TOKEN` | 是 | GitHub PAT，用于克隆内容仓库 |
| `SITE_URL` | 否 | 站点域名，默认 `https://yanche.chat` |
| `GITEE_TOKEN` | 否 | 内容仓库备用克隆源 Token |

## 开发注意事项

- 代码改动在 `my_blog` 仓库完成，文章内容在 `obsidian_vault` 仓库维护
- 本地开发前需要确保 `content/obsidian` 存在，否则内容集合为空
- 项目使用 `output: 'static'`，新增页面时应优先考虑静态生成
- 交互组件应只在必要时使用 `client:*` 指令，避免无意义的客户端 JavaScript
- 搜索数据来自构建期生成的 `/api/search.json`
- Windows 本地执行 `npm run build` 时，`postbuild` 中的 Unix 命令可能不可用；EdgeOne/Linux 环境中可正常执行

## License

MIT
