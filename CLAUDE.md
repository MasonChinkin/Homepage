# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal homepage built with React and TypeScript. The site is a single-page application with multiple routes (home, about, D3 visualizations) and is deployed on Cloudflare Pages with backend API functions via Cloudflare Workers.

**Key Technologies:**

- React 18.2.0 with TypeScript
- React Router v6 for client-side routing
- Webpack 5 for bundling (with esbuild-loader for compilation)
- @emotion/react for CSS-in-JS styling (use `css` prop, NEVER use @emotion/styled)
- D3 for data visualization
- Vitest for unit testing
- Cloudflare Pages + Workers for deployment
- Bun for package management and task running

## Development Commands

### Common Tasks

- **Start dev server:** `bun run start` (opens browser with HMR)
- **Run tests:** `bun run test` (single run)
- **Watch tests:** `bun run test:watch` (continuous mode)
- **Run single test:** `bun run test -- path/to/test.tsx` (or use `--grep "test name"`)
- **Browser tests:** `bun run test:browser` (runs in Chrome)
- **Build production:** `bun run build` (NODE_ENV=production webpack)
- **Lint & fix:** `bun run lint` (eslint --fix src)
- **Format check:** `bun run format:check` (prettier)
- **Format fix:** `bun run format:fix` (prettier --write)
- **Build & preview Cloudflare Pages:** `bun run start:functions` (wrangler pages dev dist)
- **Analyze bundle:** `bun run analyze` (Rsdoctor)

## Architecture

### Routing Structure

Root routing is in `src/Root.tsx` using lazy-loaded routes:

- `/` and `/\*` → `Profile` component (main profile/portfolio)
- `/reddit-visualization` → legacy D3 visualization

The `Profile` component (`src/components/Profile.tsx`) implements the actual site navigation:

- `/` → Home page (intro + featured projects)
- `/about` → About page
- `/d3` → D3 project grid visualization

Routes use React Router v6 lazy loading for code splitting. Page transitions use `react-css-transition-replace` with fade animation (500ms defined in `src/styles/base.scss`).

### Component Structure

```
src/components/
├── Profile.tsx           # Main router/layout component
├── Header.tsx            # Navigation header
├── Background.tsx        # Animated background
├── header/              # Header subcomponents
├── home/                # Home page (Intro + FeaturedProjects)
├── about/               # About page
├── projects/            # D3ProjectGrid visualization
└── d3/legacy/           # Old D3 visualizations
```

Most components are functional arrow functions exporting as default (eslint rule enforces this). Test files live alongside their components with `.test.tsx` suffix.

### Styling

**IMPORTANT: Use @emotion/react with the `css` prop for all component styling. NEVER use @emotion/styled.**

- Primary styling: @emotion/react with `css` prop for component-scoped styles
- Global styles defined in `src/styles/GlobalStyles.tsx` using Emotion's `Global` component
- Theme constants exported from `src/styles/theme.ts`
- Use the `css()` function with object syntax: `<div css={css({ color: 'red' })}>`
- **DO NOT** use template literal syntax `css\`...\``- always use object syntax`css({ ... })`
- **DO NOT** use `styled` components from @emotion/styled

### Build & Externals

Large libraries are externalized (loaded from CDN):

- React, ReactDOM, Bootstrap, D3
- Configured in `externalizedLibs.ts` with different URLs for dev/prod
- HTML template in `public/index.base.html` uses template variables like `${reactUrl}` injected by webpack

### Webpack Configuration

- `webpack.prod.ts` - base production config
- `webpack.dev.ts` - development override (dev server + HMR)
- `webpack.analyze.ts` - production + Rsdoctor analyzer
- Uses esbuild-loader for TS/TSX compilation (fast)
- Resolves extensions: `.ts`, `.tsx`, `.js`, `.jpg`, `.png`, `.webp`, `.svg`
- Alias path from tsconfig: `src/*` can be imported directly

### TypeScript Configuration

- Strict mode enabled
- Target: ES6
- Module: ESNext (tree-shakeable)
- Path alias: `src/*` maps to `./src/*`
- Type checking includes Cloudflare Workers types and Vitest globals

### Testing

- Vitest with happy-dom environment (lightweight DOM)
- Tests use globals (no need to import describe/it/expect)
- Same path alias as main tsconfig
- Run tests in watch mode during development

### Code Quality

**Linting:** ESLint with Airbnb config

- Airbnb base + React + hooks + TypeScript
- No relative imports except same-folder (eslint-plugin-no-relative-import-paths)
- Always use absolute imports with `src/` prefix
- Function components must be arrow functions
- Pre-commit hooks via Husky run: eslint --fix + prettier --write

**Formatting:** Prettier with custom imports plugin

- Import order: react, react-router-dom, third-party, relative
- Trailing commas: es5
- Tab width: 2
- No semicolons, single quotes

## Deployment

The site uses **Cloudflare Pages with Workers for API functions**:

```bash
bun run build          # Builds to dist/
bun run start:functions # Local preview: wrangler pages dev dist
```

Static assets in `public/` (favicon, base HTML) are copied into dist during build. API endpoints in `functions/api/` become available at `/api/*` routes.

## Important Notes

- **Path aliases:** Always use `src/` prefix for imports, never relative paths (except same folder)
- **Lazy routes:** Routes via `Root.tsx` use React Router lazy() for code splitting
- **Externalized libraries:** React, ReactDOM, Bootstrap, D3 are loaded from CDN in production; don't bundle these
- **Component exports:** Use default arrow function export (not named)
- **Styling:** Use @emotion/react with `css()` object syntax (NOT template literals); NEVER use @emotion/styled. Global styles in `GlobalStyles.tsx`, theme constants in `theme.ts`
- **Testing:** happy-dom is lightweight but not a full browser DOM; use `vitest --browser=chrome` for browser testing if needed
- **Pre-commit:** Husky hooks auto-fix eslint and prettier issues; commits are blocked if linting fails
