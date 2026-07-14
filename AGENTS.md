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

## React & Astro Coding Rules

> Auto-applied rules extracted from [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills).
> These rules MUST be followed when writing, reviewing, or refactoring React/JSX code in this project.

### 1. Eliminating Waterfalls (CRITICAL)

- **Promise.all() for independent operations**: Never sequentially await independent data fetches. Use `Promise.all()` or parallel patterns.
- **Defer await until needed**: Move `await` into the branch where it's actually used. Don't block code paths that don't need the result.
- **Check cheap sync conditions before async**: Evaluate local/synchronous guards before awaiting remote values or flags.
- **Parallel nested fetching**: When fetching nested data per item, chain fetches inside `Promise.all` rather than sequential loops.

### 2. Bundle Size (CRITICAL)

- **Avoid barrel file imports**: Import directly from specific modules, not from index/barrel files (e.g., `import { Button } from 'ui/Button'` not `from 'ui'`).
- **Dynamic imports for heavy components**: Use `React.lazy()` / `next/dynamic` for components not needed on initial render (e.g., Three.js visualizations, modals, charts).
- **Defer third-party scripts**: Load analytics, logging, and non-critical third-party libraries after hydration.
- **Prefer statically analyzable paths**: Use import paths that bundlers can statically analyze to enable tree-shaking.

### 3. Re-render Optimization (MEDIUM)

- **Derive state during render, not effects**: If state can be computed from props/other state, calculate it during rendering. Don't use `useEffect` + `setState` to sync.
- **Use functional setState**: `setState(prev => prev + 1)` instead of `setState(state + 1)` for stable callbacks.
- **Don't define components inside components**: Nested component definitions cause unnecessary unmount/remount on every render.
- **Hoist default non-primitive values**: Extract default objects/arrays from memoized component parameters to module-level constants.
- **Use primitive dependencies in effects**: Avoid creating new objects/arrays in effect dependency arrays.
- **Subscribe to derived booleans, not raw values**: If a component only needs `isLoggedIn`, don't pass the entire `user` object.
- **Use `useRef` for transient frequent values**: Values that change often but don't need to trigger re-renders (e.g., timers, counters).
- **Use `startTransition` for non-urgent updates**: Wrap non-urgent state updates in `startTransition` to keep UI responsive.
- **No inline components**: Never define a component inside another component's render body.

### 4. Rendering Performance (MEDIUM)

- **Hoist static JSX**: Extract static JSX elements outside component functions to avoid re-creation.
- **Use `content-visibility` for long lists**: Apply CSS `content-visibility: auto` for off-screen content in long lists.
- **Use ternary, not `&&` for conditionals**: `condition ? <A /> : null` instead of `condition && <A />` to avoid rendering `0` or `false`.
- **Animate div wrapper, not SVG element**: Wrap SVGs in a `<div>` and animate the wrapper for better performance.
- **Reduce SVG coordinate precision**: Limit SVG path coordinate decimal places to reduce file size.

### 5. JavaScript Performance (LOW-MEDIUM)

- **Early return from functions**: Return as soon as the result is determined to avoid unnecessary work.
- **Combine multiple array iterations**: Merge `.filter().map()` into a single `.flatMap()` or `for` loop.
- **Use Set/Map for O(1) lookups**: Convert arrays to `Set` or `Map` when doing repeated `.includes()` or key lookups.
- **Hoist RegExp creation**: Move `new RegExp()` / regex literals outside loops and hot paths.
- **Cache property access in loops**: Store `obj.prop` in a local variable when accessed repeatedly in a loop.
- **Use `toSorted()` for immutability**: Prefer `toSorted()` over `sort()` to avoid mutating the original array.

### 6. React Composition Patterns (HIGH)

- **Avoid boolean prop proliferation**: Don't add `isX`, `showY`, `enableZ` boolean props. Each boolean doubles possible states. Use compound components or explicit variant components instead.
- **Use compound components**: Structure complex UIs as compound components with shared context. Each subcomponent accesses state via context, not props.
- **Prefer children over render props**: Use `children` for composition instead of `renderX` callback props. Use render props only when parent needs to provide data to children.
- **Lift state into providers**: Move state into dedicated Provider components. Sibling components access state through context, not prop drilling.
- **Decouple state from UI**: UI components consume context interface (`state`, `actions`, `meta`), not specific state implementations. Swap providers without changing UI.
- **Create explicit variant components**: Instead of one component with many modes/booleans, create separate `ThreadComposer`, `EditComposer`, `ForwardComposer` etc.

### 7. React 19 APIs

- **No `forwardRef`**: `ref` is now a regular prop. Use `function Component({ ref, ...props })` instead of `forwardRef`.
- **Use `use()` instead of `useContext()`**: `use()` can also be called conditionally, unlike `useContext()`.

### 8. Astro-Specific Rules

- **Prefer `.astro` components for static content**: Use Astro components for content that doesn't need client-side interactivity.
- **Use `client:*` directives sparingly**: Only add `client:load`, `client:visible`, `client:only` when interactivity is actually needed.
- **Use `getCollection()` for content**: Always use Astro content collections API for querying posts, not manual file reads.
- **Static output**: This project uses `output: 'static'`. All pages are pre-rendered at build time.