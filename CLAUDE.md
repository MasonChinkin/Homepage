# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal homepage + portfolio. SPA with a main profile route, an about page, and a D3 project grid; plus several legacy D3 visualization routes. Deployed on Cloudflare Pages with API endpoints as Cloudflare Workers under `functions/api/`.

**Stack:**

- Bun (package manager + script runner)
- React 19 + TypeScript (strict, target ES2022)
- React Router v7
- Webpack 5 with esbuild-loader (TS/TSX compilation)
- @emotion/react for styling — via JSX automatic runtime (`jsxImportSource: "@emotion/react"`), so the `css` prop works in every `.tsx` file without per-file pragmas
- D3 v7 (visualizations) and framer-motion (page transitions)
- Vitest + happy-dom + React Testing Library
- Cloudflare Pages + Workers

## Commands

```bash
bun run start            # webpack dev server with HMR (opens browser)
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

`src/Root.tsx` defines a `createBrowserRouter` with React Router v7 **lazy routes**. Each lazy chunk's module is expected to export a named `Component` (this is the v7 lazy-route contract, NOT a default export):

- `/*` → `src/components/Profile.tsx` (the main site)
- `/reddit-visualization`, `/budget-sankey`, `/syria-network`, `/force-cluster`, `/congress-map`, `/gdp-growth` → `src/components/d3/legacy/*` (each exports `Component`)
- `/d3/template` → `src/components/d3/template/D3Template`

`Profile.tsx` then defines the inner site routes (`/`, `/about`, `/d3`, with `/*` redirecting to `/`) and wraps them in framer-motion's `AnimatePresence` / `motion.div` for a ~300ms fade between pages keyed on `location.pathname`. It is NOT using `react-css-transition-replace` or any SCSS transition.

**Implication:** A new lazy-loaded route file must `export const Component = ...`. A regular nested component used inside `Profile` can use a default export. Don't change this without updating the matching `lazy()` call.

### Styling

- @emotion/react with the **`css` prop** and **object syntax**: `<div css={{ color: 'red' }}>` or `css={css({ ... })}`.
- **Never** use `@emotion/styled` or template-literal `css\`...\`` syntax.
- Global styles: `src/styles/GlobalStyles.tsx` (rendered once in `src/index.tsx`).
- Theme constants and shared utility styles: `src/styles/theme.ts`, `src/styles/utilityStyles.ts`, `src/styles/backgroundStyles.ts`.
- Per-component style modules co-located with their feature folder (e.g. `home/homeStyles.ts`, `header/headerStyles.ts`).

### Build & external modules

Production uses a custom `ImportMapPlugin` (see `webpack-importmap-plugin.ts`, wired in `webpack.prod.ts`) to:

1. Mark `react`, `react/jsx-runtime`, `react-dom`, and `react-dom/client` as webpack externals.
2. Generate an `<script type="importmap">` in `index.html` pointing those names at `https://esm.sh/...`.
3. Inject `<link rel="preload">` tags ordered **after** the import map but **before** module scripts (race-condition-sensitive — see comments in the plugin).

So React/ReactDOM are loaded from a CDN at runtime; D3, framer-motion, @emotion, etc. are bundled. The plugin also intentionally re-orders all `preload`/`modulepreload` tags so the import map is always parsed first — preserve this ordering if you touch the plugin.

`splitChunks` carves vendor code into named groups (`emotion`, `router`, `d3`, `animation`, `radix`, `vendor`, `common`) for caching.

`CopyWebpackPlugin` copies `public/_headers` and `public/data/` into `dist/` during build (the `public/data/` copy is required for D3 visualizations that fetch JSON/CSV at runtime).

The HTML template is `public/index.base.html`; favicon is `public/fav.ico`.

### TypeScript

- `strict`, `target: ES2022`, `module: esnext`, `moduleResolution: bundler`.
- Path alias `src/*` → `./src/*`. **Always use absolute `src/...` imports**, never relative (`../..`). Same-folder imports are the only exception (`eslint-plugin-no-relative-import-paths` enforces this).
- `jsxImportSource: "@emotion/react"` in both `tsconfig.json` and `esbuild-loader` so the `css` prop type-checks and compiles automatically.
- `types: ["vitest/globals", "@cloudflare/workers-types"]` — Vitest globals (`describe`/`it`/`expect`) are available without import.

### Testing

- Vitest with `happy-dom` (lightweight; not a full browser DOM).
- `src/test/setup.ts` imports `@testing-library/jest-dom` and **mocks `window.matchMedia`** — happy-dom doesn't implement it, and `src/utils/device.ts` hooks call it. Don't remove this mock.
- Shared helper: `src/test/renderWithRouter.tsx` wraps a tree in a `MemoryRouter` for component tests.
- Co-locate tests as `Foo.test.tsx` next to `Foo.tsx`.
- For tests that touch real browser APIs not in happy-dom, use `bun run test:browser` (Chrome via `@vitest/browser`).

### Code Style / Linting

- `eslint.config.mjs` is the flat config (not extending Airbnb). Key rules:
  - Function components **must** be arrow functions (`react/function-component-definition`).
  - `no-relative-import-paths/no-relative-import-paths` errors on any `../` import except same-folder.
  - `no-console` warns; `@typescript-eslint/no-explicit-any` warns.
- Prettier (`.prettierrc`): no semicolons, single quotes, trailing commas `es5`, tab width 2. Import ordering via `@trivago/prettier-plugin-sort-imports`: `react` → `react-router-dom` → third-party → relative.
- Pre-commit: Husky → **lint-staged** (`.lintstagedrc.json`) → `eslint --fix` + `prettier --write` on staged `.ts/.tsx`, prettier on staged `.json/.md`. Commits are blocked on lint errors.

## Notes / gotchas

- **`Component` vs default exports:** Route-loaded modules referenced by `Root.tsx`'s `lazy()` (`Profile.tsx`, every `d3/legacy/*` file, `d3/template/D3Template`) must export a named `Component`. Regular UI components (`src/components/ui/Button.tsx`, etc.) use default arrow-function exports.
- **No Bootstrap, no SCSS pipeline.** Older versions of this README referenced both; they were removed. Styles are entirely Emotion + plain `.ts` style modules.
- **Don't add a separate `externalizedLibs.ts` or template-variable HTML.** The current externalization story is the `ImportMapPlugin` only.
- **`public/data/` is part of the runtime contract** — legacy D3 visualizations fetch from `/data/...`. Don't delete or rename without updating the visualization code.
- **happy-dom limitations** show up most often as missing browser APIs (e.g. `matchMedia`, `ResizeObserver`). Add a mock to `src/test/setup.ts` rather than skipping the test.
- The `postinstall` script (`rm -rf node_modules/webpack-dev-middleware/node_modules/schema-utils`) is a workaround for the ajv v6 / v8 conflict between ESLint and webpack — don't remove it without re-validating `bun install && bun run start`.
