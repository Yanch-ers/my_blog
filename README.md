# NOVA BLOG

一个基于 Astro 7 构建的个人技术博客，部署在 Cloudflare Pages 上。

## 📁 项目结构

```
.
├── src/
│   ├── components/          # UI组件
│   │   ├── Header.astro     # 导航栏
│   │   ├── HeroSection.astro # 首页横幅
│   │   ├── PostCard.astro   # 文章卡片
│   │   ├── LargePostCard.astro # 大号文章卡片
│   │   └── Sidebar.astro    # 侧边栏
│   ├── layouts/             # 页面布局
│   │   └── BaseLayout.astro # 基础布局
│   ├── lib/                 # 工具函数
│   │   └── content.ts       # 内容处理工具
│   ├── pages/               # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── page/[page].astro # 分页
│   │   ├── tags/            # 标签页面
│   │   └── posts/           # 文章详情页
│   ├── content.config.ts    # 内容集合配置
│   └── styles/              # 样式文件
├── scripts/
│   └── clone-content.cjs    # 克隆内容仓库脚本
├── content/                 # 内容目录（构建时生成）
│   └── obsidian/            # Obsidian文档（来自远程仓库）
├── astro.config.mjs         # Astro配置
├── wrangler.toml            # Cloudflare配置
└── package.json
```

## 📝 内容来源

**重要：文章内容存储在独立的 GitHub 仓库中，不在本项目内！**

- **内容仓库**: `https://github.com/Yanch-ers/obsidian_vault.git`
- **本地目录**: `content/obsidian/`（构建时自动克隆）

### 本地开发

首次开发时需要手动克隆内容：

```bash
# 使用 GH_TOKEN 环境变量进行认证
GH_TOKEN=your_token npm run setup
```

或者直接运行：

```bash
git clone --depth 1 https://github.com/Yanch-ers/obsidian_vault.git content/obsidian
rm -rf content/obsidian/.git
```

### 构建部署

Cloudflare Pages 构建时自动执行：

```bash
npm run build:cf
```

该命令会：
1. 使用环境变量中的 `GH_TOKEN` 克隆内容仓库
2. 删除 `.git` 目录（避免子模块问题）
3. 执行 `astro build`

## 🚀 运行项目

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🛠️ 技术栈

- **框架**: Astro 7
- **样式**: Tailwind CSS 4
- **部署**: Cloudflare Pages
- **内容**: Obsidian Markdown
- **语言**: TypeScript

## 📌 注意事项

1. **不要提交 content/obsidian/** - 该目录已在 `.gitignore` 中
2. **内容更新**: 修改文章需在 `obsidian_vault` 仓库中进行
3. **本地测试**: 需要先运行 `npm run setup` 或手动克隆内容
4. **关系图谱**: 基于文章中的双向链接 `[[标题]]` 自动生成