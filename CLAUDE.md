# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal homepage + portfolio. SPA with a main profile route, an about page, and a D3 project grid; plus several legacy D3 visualization routes. Deployed on Cloudflare Pages with API endpoints as Cloudflare Workers under `functions/api/`.

**Stack:**

- Bun (package manager + script runner)
- React 19 + TypeScript (strict, target ES2023)
- wouter (lightweight router; ~2 KB gz)
- Rspack with builtin:swc-loader (TS/TSX compilation)
- @emotion/react for styling — via JSX automatic runtime (`jsxImportSource: "@emotion/react"`), so the `css` prop works in every `.tsx` file without per-file pragmas
- D3 v7 submodules (visualizations); page transitions via the View Transitions API (no framer-motion)
- Vitest + happy-dom + React Testing Library
- Cloudflare Pages + Workers

## Commands

```bash
bun run start            # rspack dev server with HMR (opens browser)
bun run build            # production build → dist/
bun run start:functions  # build + wrangler pages dev dist (preview Workers locally)
bun run analyze          # production build with Rsdoctor analyzer

bun run test             # vitest run (single pass)
bun run test:watch       # vitest watch
bun run test:browser     # vitest in Chrome (real DOM, not happy-dom)
bun run test:coverage    # v8 coverage

bun run typecheck        # tsc --noEmit
bun run lint             # eslint --fix src
bun run format:fix       # prettier --write .
```

Run a single test file: `bun run test -- src/path/to/Foo.test.tsx`. Filter by name: `bun run test -- -t "name fragment"`.

## Architecture

### Routing — two layers

`src/Root.tsx` uses wouter's `<Switch>` + `<Route>` with `React.lazy` and `Suspense`:

- `/reddit-visualization`, `/budget-sankey`, `/syria-network`, `/force-cluster`, `/congress-map`, `/gdp-growth`, `/d3/template` → `src/components/d3/...`
- catch-all → `src/components/Profile.tsx` (the main site)

Each lazy import unwraps a named `Component` export via `.then((m) => ({ default: m.Component }))` so `React.lazy` sees a default export. (This contract was inherited from React Router v7 lazy routes; it's preserved.) A new lazy-loaded route file must `export const Component = ...`.

`Profile.tsx` then defines the inner site routes (`/`, `/about`, `/d3`, with a catch-all `<Redirect to="/" />`). Page transitions use the View Transitions API: `Header.tsx`'s custom `NavLink` wraps `setLocation()` in `document.startViewTransition()`, and `GlobalStyles.tsx` defines 300 ms `::view-transition-old(root)` / `::view-transition-new(root)` cross-fade keyframes. Unsupported browsers fall back to instant navigation; `prefers-reduced-motion` disables the fade.

### Styling

- @emotion/react with the **`css` prop** and **object syntax**: `<div css={{ color: 'red' }}>` or `css={css({ ... })}`.
- **Never** use `@emotion/styled` or template-literal `css\`...\`` syntax.
- Global styles: `src/styles/GlobalStyles.tsx` (rendered once in `src/index.tsx`).
- Theme constants and shared utility styles: `src/styles/theme.ts`, `src/styles/utilityStyles.ts`, `src/styles/backgroundStyles.ts`.
- Per-component style modules co-located with their feature folder (e.g. `home/homeStyles.ts`, `header/headerStyles.ts`).

### Build & external modules

Everything bundles locally — no CDN externalization. `rspack.config.ts` (prod), `rspack.dev.ts` (dev server), `rspack.analyze.ts` (Rsdoctor). `splitChunks` carves vendor code into named groups (`emotion`, `vendor`, `common`) plus a per-route `d3` cacheGroup (no fixed name, so each viz route gets its own d3 chunk based on submodules it imports).

`rspack.CopyRspackPlugin` copies `public/_headers` and `public/data/` into `dist/` during build (the `public/data/` copy is required for D3 visualizations that fetch JSON/CSV at runtime).

The HTML template is `public/index.base.html`; favicon is `public/fav.ico`.

### TypeScript

- `strict`, `target: ES2023`, `module: esnext`, `moduleResolution: bundler`.
- Path alias `src/*` → `./src/*`. **Always use absolute `src/...` imports**, never relative (`../..`). Same-folder imports are the only exception (`eslint-plugin-no-relative-import-paths` enforces this).
- `jsxImportSource: "@emotion/react"` in both `tsconfig.json` and the Rspack swc-loader config so the `css` prop type-checks and compiles automatically.
- `types: ["vitest/globals", "@cloudflare/workers-types"]` — Vitest globals (`describe`/`it`/`expect`) are available without import.

### Testing

- Vitest with `happy-dom` (lightweight; not a full browser DOM).
- `src/test/setup.ts` imports `@testing-library/jest-dom` and **mocks `window.matchMedia`** — happy-dom doesn't implement it, and `src/utils/device.ts` hooks call it. Don't remove this mock.
- Shared helper: `src/test/renderWithRouter.tsx` wraps a tree in wouter's `<Router>` (using `memoryLocation` from `wouter/memory-location`) for component tests. Accepts an optional `initialEntries: string[]` for setting the starting path.
- Co-locate tests as `Foo.test.tsx` next to `Foo.tsx`.
- For tests that touch real browser APIs not in happy-dom, use `bun run test:browser` (Chrome via `@vitest/browser`).

### Code Style / Linting

- `eslint.config.mjs` is the flat config (not extending Airbnb). Key rules:
  - Function components **must** be arrow functions (`react/function-component-definition`).
  - `no-relative-import-paths/no-relative-import-paths` errors on any `../` import except same-folder.
  - `no-console` warns; `@typescript-eslint/no-explicit-any` warns.
- Prettier (`.prettierrc`): no semicolons, single quotes, trailing commas `es5`, tab width 2. Import ordering via `@trivago/prettier-plugin-sort-imports`: `react` → third-party → relative.
- Pre-commit: Husky → **lint-staged** (`.lintstagedrc.json`) → `eslint --fix` + `prettier --write` on staged `.ts/.tsx`, prettier on staged `.json/.md`. Commits are blocked on lint errors.

## Notes / gotchas

- **`Component` vs default exports:** Route-loaded modules referenced by `Root.tsx`'s `lazy()` (`Profile.tsx`, every `d3/legacy/*` file, `d3/template/D3Template`) must export a named `Component`. Regular UI components (`src/components/ui/Button.tsx`, etc.) use default arrow-function exports.
- **No Bootstrap, no SCSS pipeline.** Older versions of this README referenced both; they were removed. Styles are entirely Emotion + plain `.ts` style modules.
- **Don't add a separate `externalizedLibs.ts` or template-variable HTML.** The current externalization story is the `ImportMapPlugin` only.
- **`public/data/` is part of the runtime contract** — legacy D3 visualizations fetch from `/data/...`. Don't delete or rename without updating the visualization code.
- **happy-dom limitations** show up most often as missing browser APIs (e.g. `matchMedia`, `ResizeObserver`). Add a mock to `src/test/setup.ts` rather than skipping the test.
