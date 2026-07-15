# Yanche Blog

> 云原生运维的技术笔记 — Linux / Kubernetes / 数据库 / AI 自动化

一个基于 **Astro 7** 构建的个人技术博客，采用森林绿主题与毛玻璃视觉风格，部署在腾讯云 EdgeOne 上。

🔗 [yanche.chat](https://yanche.chat)

---

## 设计思路

### 视觉语言

博客以**森林**为核心意象，整体采用深绿色调，营造沉浸式的阅读氛围：

- **动态背景**：桌面端播放森林视频背景，移动端降级为 CSS 渐变，兼顾视觉体验与性能
- **毛玻璃卡片**：全站内容卡片使用 `backdrop-filter` 实现毛玻璃效果，与背景形成层次分明的视觉分层
- **明暗双模式**：支持亮色/暗色主题切换，两套配色方案均围绕森林绿色调设计，暗色模式使用动态渐变背景
- **字体系统**：标题使用 Noto Serif SC 衬线体，正文使用 Inter + Noto Sans SC 无衬线体，代码使用 JetBrains Mono 等宽字体

### 交互设计

- **Scroll Snap 首页**：首页采用全屏滚动吸附设计，分为 Hero 终端动画 → 最新文章 → 最近更新三个区域，配合右侧导航圆点指示当前视图
- **终端风格 Hero**：首页 Hero 区域模拟终端界面，自动循环展示运维常用命令的打字动画
- **卡片入场动画**：内容卡片在滚动进入视口时触发交错入场动画，提升浏览节奏感
- **响应式布局**：从移动端到桌面端自适应，卡片网格从单列到三列平滑过渡

---

## 整体架构

### 双仓库分离

代码与内容完全解耦，独立维护：

| 仓库 | 用途 | 分支 |
|------|------|------|
| [my_blog](https://github.com/Yanch-ers/my_blog) | 博客代码、样式、配置 | `master` |
| [obsidian_vault](https://github.com/Yanch-ers/obsidian_vault) | 文章内容（Obsidian Markdown） | `main` |

### 技术栈

| 层级 | 技术 |
|------|------|
| **框架** | Astro 7（静态输出） |
| **UI 组件** | React 19（搜索栏、知识图谱、终端动画） |
| **样式** | Tailwind CSS 4 + CSS 自定义属性主题系统 |
| **3D 可视化** | Three.js（知识图谱力导向图） |
| **内容处理** | remark 自定义插件（Obsidian 双向链接、Callout 语法转换） |
| **部署** | 腾讯云 EdgeOne（静态站点托管 + 自动构建） |
| **CI/CD** | GitHub Actions（repository_dispatch 跨仓库触发） |

### 构建流程

```
代码推送 (my_blog) ──→ EdgeOne 检测 ──→ npm run build:cf ──→ 部署
                                                              ↑
内容推送 (obsidian_vault) ──→ GitHub Actions ──→ repository_dispatch ──┘
```

`build:cf` 脚本在 EdgeOne 构建环境中执行：
1. 使用 `GH_TOKEN` 克隆 `obsidian_vault` 内容仓库
2. 自动转换 Markdown 文件行尾符（CRLF → LF），确保 Linux 环境 YAML 解析兼容
3. `astro build` 生成静态页面（492+ 页面）
4. 产物复制到 `.edgeone/assets/` 完成部署

### 项目结构

```
.
├── src/
│   ├── components/          # UI 组件
│   │   ├── Header.astro         # 响应式导航栏（移动端抽屉菜单）
│   │   ├── HeroSection.astro    # 首页终端动画横幅
│   │   ├── TerminalHero.tsx     # React 终端打字动画组件
│   │   ├── PostCard.astro       # 文章卡片（毛玻璃风格）
│   │   ├── RightNavPanel.astro  # 右侧导航面板
│   │   ├── GraphVisualization.tsx # Three.js 知识图谱
│   │   ├── SearchBar.tsx        # 客户端全文搜索
│   │   ├── TagList.astro        # 标签云
│   │   └── VideoPlayer.tsx      # 背景视频播放器（移动端降级）
│   ├── layouts/
│   │   ── BaseLayout.astro     # 基础布局（视频背景 + 遮罩层）
│   ├── lib/
│   │   ├── content.ts           # 内容处理工具（日期、摘要、标签、分类）
│   │   └── title-url-map.ts     # 标题到 URL 映射（双向链接解析）
│   ├── pages/
│   │   ├── index.astro          # 首页（Scroll Snap 三区域）
│   │   ├── page/[page].astro    # 文章分页
│   │   ├── posts/[collection]/[...slug].astro # 文章详情页
│   │   ├── tags/                # 标签索引与标签文章列表
│   │   ├── search.astro         # 搜索页
│   │   ├── about.astro          # 关于页（GitHub 贡献热力图）
│   │   ├── rss.xml.ts           # RSS Feed
│   │   └── rss.astro            # RSS 订阅引导页
│   ├── plugins/
│   │   ── remark-obsidian.mjs  # Obsidian 语法转换插件
│   ├── styles/
│   │   └── global.css           # 全局样式（主题变量 + 毛玻璃 + 动画）
│   └── content.config.ts        # Astro Content Collections 配置
├── scripts/
│   └── clone-content.cjs        # 内容仓库克隆脚本
├── .github/workflows/
│   └── deploy.yml               # repository_dispatch 监听 + 空提交触发
└── astro.config.mjs             # Astro 配置（React + Tailwind + Sitemap）
```

---

## 项目亮点

### Obsidian 原生内容工作流

- 使用 Obsidian 作为写作工具，Markdown 文件独立存储在 `obsidian_vault` 仓库
- 自定义 remark 插件完整支持 Obsidian 语法：
  - **双向链接** `[[文章标题]]` / `[[文章标题|显示文本]]` 自动解析为站内链接
  - **Callout 语法** `> [!info]` / `> [!warning]` 等 15 种类型转换为带样式的提示块
  - **Dataview 代码块** 自动过滤，避免构建错误

### 知识图谱可视化

- 基于文章间的双向链接关系，使用 Three.js 构建力导向知识图谱
- 节点大小反映文章关联度，连线表示引用关系
- 支持拖拽交互与缩放

### 智能内容处理

- **自动摘要**：从文章正文提取前 N 个字符作为预览
- **阅读时间估算**：基于正文字数计算预计阅读时长
- **分类色彩系统**：不同技术分类自动分配主题色，标签与卡片视觉统一
- **GitHub 贡献热力图**：关于页根据文章发布日期自动生成 52×7 热力图

### RSS 友好

- 标准 RSS 2.0 Feed，支持中文标题与描述的 URL 编码
- 独立 RSS 订阅引导页，提供 Feedly / Inoreader 一键订阅按钮
- 文章图片使用腾讯云 COS 永久链接，确保 RSS 阅读器中正常显示

### 性能优化

- **静态输出**：Astro 预渲染所有页面，零运行时 JavaScript
- **视频降级策略**：移动端跳过 50MB 视频，使用 CSS 渐变背景
- **按需加载 React**：仅搜索、图谱、终端动画等交互组件使用 React，其余为纯 Astro 组件
- **字体优化**：Google Fonts 预连接 + 字体子集化

---

## 快速开始

### 本地开发

```bash
# 克隆代码仓库
git clone https://github.com/Yanch-ers/my_blog.git
cd my_blog

# 克隆内容仓库
GH_TOKEN=your_token npm run setup

# 启动开发服务器
npm run dev
# → http://localhost:4321
```

### 构建部署

```bash
# 生产构建
npm run build:cf

# 预览
npm run preview
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `GH_TOKEN` | GitHub PAT（需 `repo` 权限），用于克隆内容仓库 |
| `SITE_URL` | 网站域名（默认 `https://yanche.chat`） |

---

## License

MIT
# YANCHE BLOG

一个基于 Astro 7 构建的个人技术博客，部署在腾讯云 EdgeOne 上。

## 📁 项目架构

本项目采用**双仓库架构**，代码和文档分离存储：

| 仓库 | 用途 | 地址 |
|------|------|------|
| `my_blog` | 博客代码、样式、配置 | https://github.com/Yanch-ers/my_blog |
| `obsidian_vault` | 文章内容（Obsidian Markdown） | https://github.com/Yanch-ers/obsidian_vault |

### 项目结构

```
.
├── src/
│   ├── components/          # UI组件
│   │   ├── Header.astro     # 导航栏
│   │   ├── HeroSection.astro # 首页横幅
│   │   ├── PostCard.astro   # 文章卡片
│   │   ├── LargePostCard.astro # 大号文章卡片
│   │   ├── Sidebar.astro    # 侧边栏
│   │   ├── GraphVisualization.tsx # 知识图谱
│   │   └── SearchBar.tsx    # 搜索栏
│   ├── layouts/             # 页面布局
│   │   └── BaseLayout.astro # 基础布局
│   ├── lib/                 # 工具函数
│   │   ├── content.ts       # 内容处理工具
│   │   └── title-url-map.ts # 标题到URL映射
│   ├── pages/               # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── page/[page].astro # 分页
│   │   ├── tags/            # 标签页面
│   │   ├── posts/           # 文章详情页
│   │   ├── search.astro     # 搜索页
│   │   └── about.astro      # 关于页
│   ├── content.config.ts    # 内容集合配置
│   ├── plugins/
│   │   └── remark-obsidian.mjs # Obsidian链接转换插件
│   └── styles/              # 样式文件
├── scripts/
│   └── clone-content.cjs    # 克隆内容仓库脚本
├── .edgeone/
│   ├── assets/              # EdgeOne构建产物
│   └── config.json          # EdgeOne路由配置
├── astro.config.mjs         # Astro配置
└── package.json
```

## 🚀 自动构建流程

### 触发条件

网站会在以下两种情况自动触发构建：

1. **代码仓库更新**：推送到 `my_blog` 仓库的 `master` 分支
2. **文档仓库更新**：推送到 `obsidian_vault` 仓库的 `master` 分支

### 工作原理

```
┌─────────────────────────────────────────────────────────────────┐
│                      自动构建流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  代码仓库更新                    文档仓库更新                    │
│       │                              │                          │
│       ▼                              ▼                          │
│  Push to my_blog              Push to obsidian_vault           │
│       │                              │                          │
│       │                              ▼                          │
│       │              GitHub Actions (vault-trigger-template.yml)│
│       │                              │                          │
│       │                              ▼                          │
│       │              Repository Dispatch → my_blog              │
│       │                              │                          │
│       ▼                              ▼                          │
│  EdgeOne检测到                    EdgeOne检测到                  │
│  仓库变化                         仓库变化                      │
│       │                              │                          │
│       ▼                              ▼                          │
│  edgeone makers build          edgeone makers build             │
│       │                              │                          │
│       ├── npm install                ├── npm install            │
│       ├── npm run build:cf          ├── npm run build:cf       │
│       │       ├── clone-content      │       ├── clone-content  │
│       │       ├── astro build        │       ├── astro build   │
│       │       └── postbuild          │       └── postbuild     │
│       ▼                              ▼                          │
│  部署到EdgeOne                 部署到EdgeOne                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 构建命令

```bash
npm run build:cf
```

该命令执行以下步骤：
1. 使用 `GH_TOKEN` 克隆内容仓库到 `content/obsidian/`
2. 删除 `.git` 目录（避免子模块问题）
3. 执行 `astro build` 生成静态文件
4. 执行 `postbuild` 将产物复制到 `.edgeone/assets/`

## 🔧 环境配置

### 本地开发

首次开发时需要手动克隆内容：

```bash
GH_TOKEN=your_token npm run setup
```

或者直接运行：

```bash
git clone --depth 1 https://github.com/Yanch-ers/obsidian_vault.git content/obsidian
rm -rf content/obsidian/.git
```

### 运行项目

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### EdgeOne 配置

在 EdgeOne 控制台配置以下环境变量：

| 变量名 | 说明 | 来源 |
|--------|------|------|
| `GH_TOKEN` | GitHub 个人访问令牌，用于克隆内容仓库 | GitHub Settings → Developer settings → Personal access tokens |
| `SITE_URL` | 网站域名 | EdgeOne 域名配置 |

### 文档仓库配置

在 `obsidian_vault` 仓库中添加以下文件和配置：

1. 创建 `.github/workflows/trigger-blog-rebuild.yml`，内容见 `vault-trigger-template.yml`
2. 在仓库 Settings → Secrets and variables → Actions 中添加：
   - `PERSONAL_ACCESS_TOKEN`: 具有 `repo` 权限的 GitHub 个人访问令牌

## 🛠️ 技术栈

- **框架**: Astro 7
- **样式**: Tailwind CSS 4
- **部署**: 腾讯云 EdgeOne
- **内容**: Obsidian Markdown (双向链接 `[[标题]]`)
- **语言**: TypeScript
- **可视化**: Three.js (知识图谱)
- **搜索**: React 客户端搜索

## 📌 注意事项

1. **不要提交 content/obsidian/** - 该目录已在 `.gitignore` 中
2. **内容更新**: 修改文章需在 `obsidian_vault` 仓库中进行
3. **本地测试**: 需要先运行 `npm run setup` 或手动克隆内容
4. **双向链接**: 支持 Obsidian 风格的 `[[标题]]` 和 `[[标题\|显示文本]]` 格式
5. **知识图谱**: 基于文章中的双向链接自动生成关联图谱
6. **路径处理**: Windows 反斜杠会自动转换为 URL 正斜杠

## 🔄 CI/CD 流程

### 代码仓库 (`my_blog`)

- **deploy.yml**: 监听 `vault_updated` 事件，收到通知后推送空提交触发 EdgeOne 重建

### 文档仓库 (`obsidian_vault`)

- **trigger-blog-rebuild.yml**: 推送时发送 `repository_dispatch` 到博客仓库

### EdgeOne

- 监听 GitHub 仓库变化，自动执行构建和部署
- 构建命令: `npm run build:cf`