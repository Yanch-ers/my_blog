## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Deployment

### Architecture

- **Code repo**: `my_blog` - blog code and configuration
- **Content repo**: `obsidian_vault` - Obsidian Markdown articles

### Build Process

EdgeOne builds automatically on push to `my_blog` master branch:

```bash
npm run build:cf
```

This command:
1. Clones content from `obsidian_vault` using `GH_TOKEN`
2. Runs `astro build` (static output)
3. Copies artifacts to `.edgeone/assets/`

### Auto-trigger Flow

1. **Code changes**: Push to `my_blog` → EdgeOne detects → builds
2. **Content changes**: Push to `obsidian_vault` → GitHub Actions → dispatches to `my_blog` → EdgeOne builds

### Environment Variables

Required in EdgeOne console:
- `GH_TOKEN` - GitHub PAT for cloning content
- `SITE_URL` - Domain URL

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)