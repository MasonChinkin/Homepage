# Stack-diet migration design

Status: draft (awaiting user review)
Date: 2026-05-12

## Context

Audit of the current production bundle (May 2026) found ~125 KB gzipped of
initial JavaScript (including React loaded from `esm.sh` via a custom
`ImportMapPlugin`), plus ~150 KB of blocking external CSS/font requests for
icons and fonts that are either unused (Material Icons) or trivially
replaceable (FontAwesome 5.7 used for 8 distinct icons; Google Fonts Roboto
used only inside the D3 layout). Per-D3-route chunk is 134 KB raw / 45 KB gz
and contains all 24 d3 submodules because every viz uses `import * as d3`.

## Goals

- Cut total initial download (JS + blocking external CSS/font requests) by
  over half. Net initial JS target ~50–55 KB gzipped (includes React
  bundled locally, no CDN), down from ~125 KB gz today, AND zero external
  blocking requests (currently ~150 KB of FA + Material Icons + Roboto).
- Remove every external blocking CDN load (FontAwesome, Material Icons,
  Google Fonts, esm.sh).
- Migrate webpack → Rspack and delete the custom `ImportMapPlugin`.
- Ship each phase as a separate, reversible PR. Repo green between phases.
- No visual or functional regressions.

## Non-goals

- No Cloudflare Pages → Workers Static Assets migration.
- No design refresh. Same look, same content.
- No SSR. Site remains client-rendered.
- No new features.

## Constraints

- Each phase ends with `bun run typecheck && bun run test && bun run build`
  passing.
- Each phase = one commit / one PR. Reversible.
- Tests are added/updated alongside behavioral changes, never after.
- Visual parity verified in the browser for any phase touching animation,
  fonts, or layout.

## Phases

The seven phases below are ordered for safety, but most are mutually
independent (see "Phase ordering" at the end). Each phase has its own
acceptance criteria; nothing in a later phase depends on Phase 0 cleanups
beyond hygiene.

### Phase 0 — Cleanup & dead-load removal

Zero risk. Pure deletion + tiny replacements.

**Changes:**

- `public/index.base.html`: remove FontAwesome `<link rel="preload">` and
  `<link rel="stylesheet">`, Material Icons stylesheet, all three
  `dns-prefetch` entries (esm.sh stays until Phase 4; fontawesome and cdnjs
  go now; Google Fonts goes now).
- New `src/components/ui/icons/` directory with one inline-SVG component per
  used icon: `Github`, `LinkedIn`, `Mail`, `ArrowLeft`, `LongArrowLeft`,
  `Moon`, `Sun`, `ChartBar`. Hand-rolled; no icon-library dependency.
- Replace `<i className="fa..." />` usages in:
  `src/components/header/contactConstants.ts` (refactor: replace string
  `icon` field with a component reference),
  `src/components/header/MobileContact.tsx` (and wherever socialLinks render),
  `src/components/d3/legacy/Header.tsx`,
  `src/components/d3/layout/D3Layout.tsx`,
  `src/components/d3/legacy/components/reddit-visualization/components/Visualization.tsx`,
  `src/components/d3/legacy/styles/legacyStyles.tsx` (CSS rule referencing
  `.fa-chart-bar` — keep selector if needed for the new SVG or drop the
  rule).
- `src/components/d3/layout/D3Layout.tsx` `containerStyle.fontFamily`:
  `"'Roboto', sans-serif"` → `inherit`.
- `src/styles/GlobalStyles.tsx` body font-family: `sans-serif, roboto` →
  `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- `src/styles/backgroundStyles.ts`: replace runtime `generateStars` with a
  build-time generated constant. Approach: write a small `scripts/gen-stars.ts`
  that emits a `src/styles/starsData.generated.ts` containing
  `export const shadowsSmall = '...'; export const shadowsMedium = '...';
export const shadowsBig = '...';`. Run once, commit the output. Delete the
  runtime generator.
- `src/components/Profile.tsx`: fix `key={location.pathname}` on every
  `<Route>` — `<Routes>` does not need per-route keys; drop them.
- `src/components/d3/layout/D3Layout.tsx`: fix `vizContainerInnerStyle`'s
  `css(vizConfig.className)` call. `vizConfig.className` is typed as
  `string` but `css()` expects a serialized style or an object. Decision:
  drop `className` from `vizConfig` entirely — no caller uses it, and the
  D3Layout API is small enough not to need a styling escape hatch.
- `webpack.prod.ts` `splitChunks.animation.test`: remove the
  `react-css-transition-replace` alternative (package not installed).

**Acceptance:**

- Initial DOM Network panel shows zero requests to `use.fontawesome.com`,
  `fonts.googleapis.com`, `cdnjs.cloudflare.com`.
- All visible icons render identically (manual visual check + RTL test
  asserting the new SVG components mount).
- Stars background animates exactly as before.
- `bun run test` adds at least one test asserting no `<link>` tag in
  rendered HTML points to fontawesome or gfonts.

### Phase 1 — D3 submodule imports

**Changes:**

- Replace `import * as d3 from 'd3'` in every file under
  `src/components/d3/**` with named submodule imports.
- Update all `d3.<api>` call sites to use the bare imported name.
- Audit per-viz usage (confirmed during the audit):
  - `budget-sankey`: `d3-csv`/`d3-fetch`, `d3-array` (extent, max, group),
    `d3-format`, `d3-selection`, `d3-shape` (stack, stackOffsetDiverging),
    `d3-scale` types. (Note: `d3.nest` was removed in d3 v6; verify whether
    `vizScript.ts` still calls it and replace with `d3.group`.)
  - `congress-map`: `d3-fetch` (csv, json), `d3-format`, `d3-geo` (geoPath),
    `d3-selection`.
  - `force-cluster`: `d3-force` (forceX, forceY), `d3-timer`/`d3-interval`,
    `d3-array` (range), `d3-scale` (scaleOrdinal),
    `d3-scale-chromatic` (schemeCategory).
  - `gdp-growth`: `d3-axis`, `d3-fetch` (csv), `d3-shape` (stack family,
    curveMonotoneX), `d3-array` (max, min), `d3-scale` types,
    `d3-scale-chromatic`, `d3-time-format`, `d3-selection`.
  - `reddit-visualization`: `d3-selection` + utils files have their own
    imports — audit `bars.ts`, `bubbles.ts`, `scatter.ts`, `tooltip.ts`,
    `utils.ts` separately.
  - `syria-network`: `d3-force` (forceCenter, forceLink, forceManyBody),
    `d3-fetch` (json), `d3-selection`.
  - `template/D3Template.tsx`: `d3-axis`, `d3-scale`, `d3-selection`.
- Remove `d3` umbrella from `package.json`. Add the specific submodule deps
  identified above.
- `@types/d3` stays.
- Update `webpack.prod.ts` (or Rspack config in Phase 5) `splitChunks.d3`
  cacheGroup to split per-route: name each viz's d3 chunk after the viz, so
  `/budget-sankey` doesn't ship `d3-geo` and `/congress-map` doesn't ship
  `d3-force`.

**Acceptance:**

- All 7 D3 routes load and render correctly (manual visual sweep).
- Per-route d3 chunks <30 KB gz each (most should be <15 KB).
- No `import * as d3` remains in `src/`.

### Phase 2 — Remove framer-motion

**Changes:**

- `src/components/Profile.tsx`: replace `AnimatePresence` + `motion.div`
  route fade with the View Transitions API. Intercept route changes (in
  wouter after Phase 3, or in v7 before then) and wrap the navigation
  state-update in `document.startViewTransition(() => setLocation(...))`.
  When `document.startViewTransition` is undefined, call the state-update
  directly — the route just changes without a fade. Add a CSS rule for the
  `::view-transition-old(root)` / `::view-transition-new(root)`
  pseudo-elements (300 ms opacity fade) and a
  `@media (prefers-reduced-motion: reduce) { animation: none }` override.
- `src/components/d3/layout/D3Layout.tsx` `ThemeToggle`: replace
  `motion.div layout` with a plain `<div>` whose `marginLeft` is animated
  via CSS `transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)`.
- Remove `framer-motion` from `package.json`.
- Remove `animation` splitChunks cacheGroup.

**Acceptance:**

- Route fade visible in Chrome, Safari, Firefox (latest stable).
- `prefers-reduced-motion: reduce` disables the fade and toggle animation
  (RTL test for the toggle; manual check for the fade).
- Initial JS drops by ~40 KB gz.

### Phase 3 — React Router v7 → wouter

**Changes:**

- Add `wouter` dep. Remove `react-router-dom`.
- `src/Root.tsx`: rewrite with wouter's `<Router>` and `<Route>`. Each route
  uses `React.lazy()` + `<Suspense>` instead of v7's `lazy()` API. Route
  modules can return to **default exports** (the named `Component` export
  contract from CLAUDE.md goes away).
- `src/components/Profile.tsx`: replace `<Navigate to="/" />` with
  wouter's `<Redirect to="/" />`; replace `Routes` with wouter's `<Switch>`.
- `src/components/d3/layout/D3Layout.tsx`: replace `useNavigate` with
  wouter's `useLocation` (`const [, setLocation] = useLocation()`).
- Update `src/test/renderWithRouter.tsx` to use wouter's `<Router hook=...>`
  with `memoryLocation` for tests.
- Update `Root.test.tsx` and `Profile.test.tsx` for the new test helper.
- Update `CLAUDE.md`: remove the "named-`Component`-export contract" section
  under Architecture → Routing. Replace with the wouter-specific notes
  (default exports OK, `React.lazy` is the lazy pattern).
- Update test memory entries (in user MEMORY.md) that mention named
  `Component` exports.
- Remove `router` splitChunks cacheGroup.

**Acceptance:**

- All 9 routes (3 in Profile + 6 legacy + `/d3/template`) navigate
  correctly, including the `/*` redirect.
- `bun run test` passes with the updated test helper.
- Initial JS drops by ~25 KB gz.

### Phase 4 — Drop ImportMapPlugin / bundle React

**Changes:**

- Delete `webpack-importmap-plugin.ts`.
- `webpack.prod.ts` (or Rspack config if Phase 5 done first): remove
  `ImportMapPlugin` invocation, `externalsType: 'module'`, and
  `experiments.outputModule`. Keep code-splitting.
- `public/index.base.html`: remove `<link rel="dns-prefetch" href="https://esm.sh" />`.
- React + ReactDOM now bundle into the `vendor` chunk.
- Remove the `postinstall` script from `package.json` (ajv conflict was
  introduced by the import-map setup interaction with webpack-dev-middleware;
  verify by running `bun install && bun run start` after removal).

**Acceptance:**

- Service worker disabled in DevTools → reload → site still loads (no
  external JS requests required after first cache).
- `index.html` contains zero `https://esm.sh/...` references.
- Initial JS goes back up by ~45 KB gz (React bundled), but total external
  blocking requests = 0.

### Phase 5 — webpack → Rspack

**Changes:**

- `package.json`: replace `webpack`, `webpack-cli`, `webpack-dev-server`,
  `webpack-merge`, `esbuild-loader`, `html-webpack-plugin`,
  `copy-webpack-plugin`, `fork-ts-checker-webpack-plugin` with
  `@rspack/core`, `@rspack/cli`, `@rspack/dev-server`, and
  `ts-checker-rspack-plugin`. Rsdoctor already works with both — re-wire to
  Rspack.
- Rename `webpack.prod.ts` → `rspack.config.ts`; `webpack.dev.ts` →
  `rspack.dev.ts`; `webpack.analyze.ts` → `rspack.analyze.ts`. Update
  imports.
- Replace `esbuild-loader` with `builtin:swc-loader`. Configure JSX:
  `parser: { syntax: 'typescript', tsx: true }`,
  `transform: { react: { runtime: 'automatic', importSource: '@emotion/react' } }`.
- Replace `HtmlWebpackPlugin` with `rspack.HtmlRspackPlugin`. Update
  options (the API is mostly compatible but `inject` semantics differ
  slightly — verify).
- Replace `CopyWebpackPlugin` with `rspack.CopyRspackPlugin`.
- Update `package.json` scripts: `webpack ...` → `rspack ...`,
  `webpack serve` → `rspack serve`.
- Verify Husky/lint-staged are unaffected.
- After Phase 4 cleanup, `splitChunks` no longer needs `animation`,
  `router`, or `emotion` groups (emotion is tiny). Reduce to:
  `vendor` (everything in node_modules), `d3-<per-viz>` from Phase 1,
  and `common` (>=2 chunks).

**Acceptance:**

- `bun run start` cold-starts in <500 ms.
- `bun run build` output gzipped initial JS ≤ current Phase 4 baseline ±5%.
- All tests pass.
- All routes load.

### Phase 6 — Misc smaller wins

**Changes:**

- `tsconfig.json` `target` and Rspack SWC `target` → `es2023`.
- Simplify `public/data/congress-map/us_congress_2016_lower_48.json`
  (1.4 MB) with `mapshaper`. Output TopoJSON at ~80 KB. Add `topojson-client`
  (`feature` import only) to `congress-map/vizScript.ts`. Commit both the
  simplification command (as a `scripts/` entry) and the new file.
- Verify map renders identically on `/congress-map`.

**Acceptance:**

- `/congress-map` route loads <500 ms on a cold cache (was several seconds
  on slow connections due to 1.4 MB JSON).
- Map visual parity (manual check).

### Phase 7 — ESLint hardening

**Changes:**

- `eslint.config.mjs`: promote `no-console` from `warn` → `error`,
  `@typescript-eslint/no-explicit-any` from `warn` → `error`.
- Fix all violations. Use `// eslint-disable-next-line ... -- <reason>` only
  where intentional (e.g., a deliberate `console.error` in a global error
  handler).
- `package.json` `lint` script: add `--max-warnings 0`.

**Acceptance:**

- `bun run lint` exits 0 on a clean tree.
- CI fails on any new warning.

## Phase ordering

Independent (can ship in any order): 0, 1, 2, 3, 6.

Coupled:

- Phase 4 must come before Phase 5 (deletes the only custom plugin, so
  Phase 5 doesn't need to port it). Alternatively, swap: do Phase 5 first
  with the plugin ported (it uses only standard hooks and should work
  unmodified under Rspack), then Phase 4 deletes it. Either order works;
  default to 4 → 5 for less throwaway work.
- Phase 7 last, so we're not fighting lint rules during refactors.

Recommended sequence: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7.

## Risks & mitigations

- **Wouter parity (Phase 3):** v7 and wouter differ on nested-route
  semantics. The current router is shallow (one parent route + flat inner
  `<Routes>` in Profile), so the risk is low. Each phase is its own PR —
  revert is trivial if a problem shows up.
- **View Transitions support (Phase 2):** Baseline since Oct 2025; iOS
  Safari shipped it in 18. Fallback to instant navigation in unsupported
  browsers is acceptable for a portfolio.
- **D3 submodule typing (Phase 1):** Audit notes that `d3.D` appears in
  congress-map and syria-network — almost certainly a type alias used as a
  type assertion, not a runtime call. Verify during implementation.
- **Rspack plugin ecosystem (Phase 5):** With Phase 4 done first, no custom
  plugins remain. Only standard ones — all have Rspack equivalents.
- **Husky/lint-staged across migrations:** Each phase keeps the pre-commit
  hook green. Lint and tests run as part of acceptance.

## Testing strategy

- RTL tests for each new icon component (Phase 0).
- Browser test (`bun run test:browser`) for the View Transitions route
  fade (Phase 2) and theme toggle CSS transition (Phase 2).
- Test asserting no external `<link>` tags after Phase 0 and no
  `https://esm.sh/` references after Phase 4.
- Manual visual sweep across all 9 routes after Phases 1, 2, 3, 6.
- Optional: bundle-size budget script run by CI that fails if initial
  gzipped JS exceeds 50 KB (after Phase 4; before Phase 5 if you want
  early signal).

## Target end-state numbers

These are targets, not commitments. Actuals will land in each phase PR.

| metric                              | now                                   | end                   |
| ----------------------------------- | ------------------------------------- | --------------------- |
| initial JS (gz, React bundled)      | ~125 KB (with esm.sh)                 | ~50–55 KB             |
| external blocking CSS/font requests | 3 (FA, Material, gfonts)              | 0                     |
| external blocking JS requests       | 4 (esm.sh React+jsx+RDOM+RDOM/client) | 0                     |
| FA + icon font weight (compressed)  | ~150 KB                               | 0                     |
| d3 chunk per viz route              | 45 KB gz (one shared)                 | <15 KB gz (per route) |
| dev server cold start               | ~3 s (webpack)                        | <500 ms (Rspack)      |
| custom build plugins                | 1 (ImportMapPlugin)                   | 0                     |
| top route data payload              | 1.4 MB (congress-map JSON)            | <100 KB (TopoJSON)    |
