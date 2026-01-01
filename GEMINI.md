# GEMINI.md

This file serves as a context guide for Gemini when working with this repository.

## Project Overview

This is a personal homepage and portfolio application built with **React** and **TypeScript**. It features a single-page application structure with multiple routes for a home page, about section, and D3.js visualizations. The project is deployed on **Cloudflare Pages** and utilizes **Cloudflare Workers** for backend API functions.

**Key Technologies:**

- **Runtime/Package Manager:** Bun
- **Frontend Framework:** React 19 (Functional Components + Hooks)
- **Language:** TypeScript
- **Bundler:** Webpack 5 (with esbuild-loader)
- **Styling:** `@emotion/react` (CSS-in-JS using the `css` prop)
- **Routing:** React Router v6
- **Visualization:** D3.js (v7)
- **Testing:** Vitest
- **Deployment:** Cloudflare Pages + Workers

## Building and Running

The project uses `bun` for script execution.

- **Install Dependencies:**

  ```bash
  bun install
  ```

- **Start Development Server:**

  ```bash
  bun run start
  ```

  - Starts the Webpack dev server with HMR.

- **Build for Production:**

  ```bash
  bun run build
  ```

  - Builds the application to the `dist` directory using `webpack.prod.ts`.

- **Run Cloudflare Pages Preview:**

  ```bash
  bun run start:functions
  ```

  - Builds the app and runs `wrangler pages dev` to simulate the Cloudflare environment.

- **Run Tests:**

  ```bash
  bun run test          # Run all tests once
  bun run test:watch    # Run tests in watch mode
  bun run test:browser  # Run tests in Chrome
  ```

- **Linting and Formatting:**
  ```bash
  bun run lint          # Run ESLint (fixable)
  bun run format:fix    # Run Prettier
  ```

## Development Conventions

### Coding Style

- **Components:** Use functional components defined as arrow functions.
- **Exports:** Use **default exports** for components (e.g., `export default MyComponent`).
- **Imports:** Always use absolute imports starting with `src/` (e.g., `import X from 'src/components/X'`). Avoid relative imports (e.g., `../../`) unless importing from the same directory.
- **Strict Mode:** TypeScript strict mode is enabled.

### Styling (`@emotion/react`)

- **Method:** Use the `css` prop from `@emotion/react`.
- **Syntax:** Use **object syntax** for styles (e.g., `css={{ color: 'red' }}`).
  - **DO NOT** use template literal syntax (e.g., `css`...``).
  - **DO NOT** use `@emotion/styled` or `styled-components`.
- **Global Styles:** Defined in `src/styles/GlobalStyles.tsx`.
- **Theme:** Theme constants are exported from `src/styles/theme.ts`.

### Architecture

- **Routing:**
  - `src/Root.tsx`: Handles root-level routing and lazy loading.
  - `src/components/Profile.tsx`: Manages the main site navigation (`/`, `/about`, `/d3`).
- **Directory Structure:**
  - `src/components/`: UI components organized by feature (home, about, header, etc.).
  - `src/components/d3/legacy/`: Older D3 visualizations.
  - `functions/`: Cloudflare Worker functions for API endpoints.
  - `public/`: Static assets and HTML templates.

### Testing

- **Framework:** Vitest with `happy-dom` environment.
- **Location:** Test files are co-located with components (e.g., `Component.test.tsx` next to `Component.tsx`).
- **Globals:** Test globals (`describe`, `it`, `expect`) are available without import.

## Configuration Files

- `webpack.*.ts`: Webpack configurations for dev, prod, and analysis.
- `wrangler.toml`: Cloudflare Pages configuration.
- `tsconfig.json`: TypeScript configuration (includes `src/*` path alias).
- `vitest.config.mts`: Vitest configuration.
