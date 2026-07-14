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