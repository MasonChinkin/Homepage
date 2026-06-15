# Phase 1 — D3 submodule imports: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every `import * as d3 from 'd3'` with named submodule imports so each viz route only ships the d3 subset it actually uses. Per-route d3 chunks instead of one 134 KB shared chunk.

**Architecture:** Mechanical refactor. For each file, identify the d3 APIs used (already audited — see API → submodule mapping below), rewrite the import line, and call sites change from `d3.foo` → `foo`. Then prune `d3` umbrella from `package.json` and add explicit submodule deps. Finally, update `webpack.prod.ts` splitChunks to give each viz its own d3 chunk.

**Tech Stack:** d3 v7 submodules, webpack 5, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-12-stack-diet-design.md` Phase 1.

---

## API → submodule reference table

This is the source of truth for what each file needs to import. Built from grep audit of `d3\.[a-zA-Z]+` patterns plus manual inspection of multi-line force-chain calls.

| File                       | d3-array                   | d3-axis              | d3-drag            | d3-ease    | d3-fetch  | d3-force                                                                 | d3-format | d3-geo                             | d3-interpolate    | d3-scale                                           | d3-scale-chromatic | d3-selection                        | d3-shape                                                                                                                 | d3-time-format        | d3-timer | d3-zoom            |
| -------------------------- | -------------------------- | -------------------- | ------------------ | ---------- | --------- | ------------------------------------------------------------------------ | --------- | ---------------------------------- | ----------------- | -------------------------------------------------- | ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------- | -------- | ------------------ |
| budget-sankey/vizScript.ts | extent, group, max         |                      |                    |            | csv       |                                                                          | format    |                                    |                   | ScaleBand, ScaleLinear (types)                     |                    | select, selectAll, Selection (type) | stack, stackOffsetDiverging, Series (type), SeriesPoint (type)                                                           |                       |          |                    |
| budget-sankey/utils.ts     | max, min                   |                      |                    |            |           |                                                                          | format    |                                    |                   | ScaleBand (type), scaleLinear, ScaleLinear (type)  |                    | select, selectAll                   |                                                                                                                          |                       |          |                    |
| budget-sankey/d3sankey.ts  | ascending, group, min, sum |                      |                    |            |           |                                                                          |           |                                    | interpolateNumber |                                                    |                    |                                     |                                                                                                                          |                       |          |                    |
| congress-map/vizScript.ts  |                            |                      |                    |            | csv, json |                                                                          | format    | geoPath, GeoGeometryObjects (type) |                   |                                                    |                    | select, selectAll, Selection (type) |                                                                                                                          |                       |          | D3ZoomEvent (type) |
| force-cluster/vizScript.ts | range                      |                      |                    |            |           | forceSimulation, forceX, forceY, forceCollide                            |           |                                    |                   | scaleOrdinal                                       | schemeCategory10   |                                     |                                                                                                                          |                       | interval |                    |
| gdp-growth/vizScript.ts    | max, min                   | axisLeft, axisRight  |                    |            | csv       |                                                                          |           |                                    |                   | ScaleBand (type), ScaleLinear (type), scaleOrdinal | schemeCategory10   | select, selectAll                   | stack, stackOffsetDiverging, stackOrderAscending, stackOrderInsideOut, curveMonotoneX, Series (type), SeriesPoint (type) | timeFormat, timeParse |          |                    |
| reddit/vizScript.ts        |                            |                      |                    |            |           |                                                                          |           |                                    |                   |                                                    |                    | select                              |                                                                                                                          |                       |          |                    |
| reddit/utils/bars.ts       | max, range                 |                      |                    | easeQuadIn |           |                                                                          | format    |                                    |                   | scaleBand                                          |                    | select                              |                                                                                                                          |                       |          |                    |
| reddit/utils/bubbles.ts    | max, min                   |                      |                    |            |           | forceManyBody, forceSimulation                                           | format    |                                    |                   | scaleOrdinal                                       |                    | select                              |                                                                                                                          |                       |          |                    |
| reddit/utils/scatter.ts    | max, min                   | axisBottom, axisLeft |                    |            |           |                                                                          | format    |                                    |                   | scaleOrdinal                                       |                    | select                              |                                                                                                                          |                       |          |                    |
| reddit/utils/tooltip.ts    |                            |                      |                    |            |           |                                                                          | format    |                                    |                   |                                                    |                    | select                              |                                                                                                                          | timeFormat            |          |                    |
| reddit/utils/utils.ts      |                            |                      |                    |            |           |                                                                          |           |                                    |                   |                                                    |                    | select                              |                                                                                                                          |                       |          |                    |
| syria-network/vizScript.ts |                            |                      | D3DragEvent (type) |            | json      | forceSimulation, forceCenter, forceLink, ForceLink (type), forceManyBody |           |                                    |                   |                                                    |                    | select, selectAll                   |                                                                                                                          |                       |          |                    |
| template/D3Template.tsx    |                            | axisBottom, axisLeft |                    |            |           |                                                                          |           |                                    |                   | scaleLinear                                        |                    | select                              |                                                                                                                          |                       |          |                    |

Notes:

- `d3.schemeCategory10` is the actual export name; the audit truncated as `schemeCategory`.
- `Selection`, `ScaleBand`, `ScaleLinear`, `Series`, `SeriesPoint`, `GeoGeometryObjects`, `D3ZoomEvent`, `D3DragEvent`, `ForceLink` are TYPES — use `import type { ... }` where possible to avoid pulling runtime code.
- `congress-map` uses `d3.D3ZoomEvent` (type). It also chain-calls `.zoom()` — check during conversion; if `d3.zoom()` is called, add `zoom` (runtime) to imports.
- `d3.csv` and `d3.json` are exported from `d3-fetch`.

## File map

**Modify:** all 14 viz/util files in the table above, `package.json`, `webpack.prod.ts`.

---

## Task 1: Convert reddit-visualization files (5 files: simplest, sanity-check the pattern)

These have the smallest API surface — good first conversion to validate the approach. The reddit utils all share `d3.select`, plus a handful of others.

- [ ] **Step 1: Convert `reddit-visualization/vizScript.ts`**

Replace `import * as d3 from 'd3'` → `import { select } from 'd3-selection'`. Then replace `d3.select` → `select` throughout.

- [ ] **Step 2: Convert `reddit-visualization/utils/utils.ts`**

Same pattern: only uses `d3.select`. Replace import + all `d3.select` calls.

- [ ] **Step 3: Convert `reddit-visualization/utils/tooltip.ts`**

```ts
import { format } from 'd3-format'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
```

Replace `d3.format` → `format`, `d3.select` → `select`, `d3.timeFormat` → `timeFormat`.

- [ ] **Step 4: Convert `reddit-visualization/utils/bars.ts`**

```ts
import { max, range } from 'd3-array'
import { easeQuadIn } from 'd3-ease'
import { format } from 'd3-format'
import { scaleBand } from 'd3-scale'
import { select } from 'd3-selection'
```

Replace `d3.X` → `X` for each. The current `d3.range(0, dataset.length)` becomes `range(0, dataset.length)`.

- [ ] **Step 5: Convert `reddit-visualization/utils/bubbles.ts`**

```ts
import { max, min } from 'd3-array'
import { forceManyBody, forceSimulation } from 'd3-force'
import { format } from 'd3-format'
import { scaleOrdinal } from 'd3-scale'
import { select } from 'd3-selection'
```

Be careful with multi-line `d3\n  .forceSimulation()` chains — they become bare `forceSimulation()`.

- [ ] **Step 6: Convert `reddit-visualization/utils/scatter.ts`**

```ts
import { max, min } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { format } from 'd3-format'
import { scaleOrdinal } from 'd3-scale'
import { select } from 'd3-selection'
```

- [ ] **Step 7: Verify**

```bash
bun run typecheck && bun run test
```

Expected: passes. No new errors.

- [ ] **Step 8: Smoke build**

```bash
bun run build
```

Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/components/d3/legacy/components/reddit-visualization/
git commit -m "D3 submodule imports: reddit-visualization"
```

---

## Task 2: Convert template + simpler vizScripts (force-cluster, syria-network)

- [ ] **Step 1: Convert `template/D3Template.tsx`**

```ts
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
```

- [ ] **Step 2: Convert `force-cluster/vizScript.ts`**

```ts
import { range } from 'd3-array'
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { interval } from 'd3-timer'
```

Verify `d3.schemeCategory10` is the actual call site (audit grepped as truncated `schemeCategory`).

- [ ] **Step 3: Convert `syria-network/vizScript.ts`**

```ts
import type { D3DragEvent } from 'd3-drag'
import { json } from 'd3-fetch'
import {
  type ForceLink,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { select, selectAll } from 'd3-selection'
```

The type imports (`D3DragEvent`, `ForceLink`) use `import type { ... }` since they're type-only.

- [ ] **Step 4: Verify + smoke build**

```bash
bun run typecheck && bun run test && bun run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/d3/template/ src/components/d3/legacy/components/force-cluster/ src/components/d3/legacy/components/syria-network/
git commit -m "D3 submodule imports: template, force-cluster, syria-network"
```

---

## Task 3: Convert congress-map

Larger because it uses d3-geo and d3-zoom.

- [ ] **Step 1: Inspect zoom usage**

```bash
grep -n "zoom" /Users/masonchinkin/Desktop/repos/homepage/src/components/d3/legacy/components/congress-map/vizScript.ts
```

If `d3.zoom()` is called (runtime), add `zoom` to imports. If only `d3.D3ZoomEvent` (type), only import the type.

- [ ] **Step 2: Convert `congress-map/vizScript.ts`**

Base import list (adjust based on Step 1 finding):

```ts
import { csv, json } from 'd3-fetch'
import { format } from 'd3-format'
import { type GeoGeometryObjects, geoPath } from 'd3-geo'
import { select, selectAll, type Selection } from 'd3-selection'
import { type D3ZoomEvent, zoom } from 'd3-zoom'

// only include `zoom` if d3.zoom() is called
```

- [ ] **Step 3: Verify + smoke build**

```bash
bun run typecheck && bun run test && bun run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/d3/legacy/components/congress-map/
git commit -m "D3 submodule imports: congress-map"
```

---

## Task 4: Convert gdp-growth

Largest single-file API surface — exercises stacks, axes, time formatting, scales.

- [ ] **Step 1: Convert `gdp-growth/vizScript.ts`**

```ts
import { max, min } from 'd3-array'
import { axisLeft, axisRight } from 'd3-axis'
import { csv } from 'd3-fetch'
import { type ScaleBand, type ScaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select, selectAll } from 'd3-selection'
import {
  type Series,
  type SeriesPoint,
  curveMonotoneX,
  stack,
  stackOffsetDiverging,
  stackOrderAscending,
  stackOrderInsideOut,
} from 'd3-shape'
import { timeFormat, timeParse } from 'd3-time-format'
```

- [ ] **Step 2: Verify + smoke build**

```bash
bun run typecheck && bun run test && bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/d3/legacy/components/gdp-growth/
git commit -m "D3 submodule imports: gdp-growth"
```

---

## Task 5: Convert budget-sankey (3 files)

- [ ] **Step 1: Convert `budget-sankey/d3sankey.ts`**

```ts
import { ascending, group, min, sum } from 'd3-array'
import { interpolateNumber } from 'd3-interpolate'
```

- [ ] **Step 2: Convert `budget-sankey/utils.ts`**

```ts
import { max, min } from 'd3-array'
import { format } from 'd3-format'
import { type ScaleBand, type ScaleLinear, scaleLinear } from 'd3-scale'
import { select, selectAll } from 'd3-selection'
```

- [ ] **Step 3: Convert `budget-sankey/vizScript.ts`**

```ts
import { extent, group, max } from 'd3-array'
import { csv } from 'd3-fetch'
import { format } from 'd3-format'
import { type ScaleBand, type ScaleLinear } from 'd3-scale'
import { type Selection, select, selectAll } from 'd3-selection'
import {
  type Series,
  type SeriesPoint,
  stack,
  stackOffsetDiverging,
} from 'd3-shape'
```

Keep the existing `import { sliderHorizontal } from 'd3-simple-slider'` line.

- [ ] **Step 4: Verify + smoke build**

```bash
bun run typecheck && bun run test && bun run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/d3/legacy/components/budget-sankey/
git commit -m "D3 submodule imports: budget-sankey"
```

---

## Task 6: Update package.json + webpack splitChunks

- [ ] **Step 1: Add submodule deps + remove `d3` umbrella**

Run in repo root:

```bash
bun remove d3
bun add d3-array d3-axis d3-drag d3-ease d3-fetch d3-force d3-format d3-geo d3-interpolate d3-scale d3-scale-chromatic d3-selection d3-shape d3-time-format d3-timer d3-zoom
```

(If congress-map's zoom() audit determined `zoom` isn't called runtime, you can drop `d3-zoom`.)

- [ ] **Step 2: Verify nothing broke**

```bash
bun run typecheck && bun run test && bun run build
```

If `bun run build` complains about a missing module, that means a file you missed still has `import * as d3 from 'd3'`. Find it with `grep -rn "from 'd3'" src/`.

- [ ] **Step 3: Update webpack splitChunks for per-route d3 chunks**

In `webpack.prod.ts`, replace the existing `d3` cacheGroup:

```ts
// D3 visualization packages (heavy)
d3: {
  test: /[\\/]node_modules[\\/]d3/,
  name: 'd3',
  priority: 30,
},
```

with a cacheGroup that names the chunk per importing route (so each viz gets its own d3 bundle):

```ts
// D3 submodule packages — split per importing chunk
d3: {
  test: /[\\/]node_modules[\\/]d3[-]/,
  priority: 30,
  // Don't fix the name — let webpack derive from chunk-id so each
  // viz route gets its own per-route d3 chunk.
  reuseExistingChunk: true,
  enforce: true,
},
```

Note: `chunks: 'all'` from the parent splitChunks config still applies. With no `name` set, webpack auto-generates a name; each viz route's lazy chunk pulls in only the d3 submodules it imports, giving us per-route chunks.

- [ ] **Step 4: Rebuild and inspect chunks**

```bash
bun run build
ls -lhS dist/*.chunk.js | head -10
```

Each viz route should have a distinct d3 chunk; the old monolithic 134 KB `d3.*.chunk.js` should be gone.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock webpack.prod.ts
git commit -m "Replace d3 umbrella with submodule deps; split per-route d3 chunks"
```

---

## Task 7: Final verification

- [ ] **Step 1: Confirm no `import * as d3` remains**

```bash
grep -rn "from 'd3'" src/
```

Expected: zero hits.

- [ ] **Step 2: Full gauntlet**

```bash
bun run typecheck && bun run lint && bun run test && bun run build
```

All exit 0.

- [ ] **Step 3: Measure new chunks**

```bash
for f in dist/*.chunk.js; do
  gz=$(gzip -c "$f" | wc -c)
  raw=$(wc -c <"$f")
  printf "%-50s raw=%6dK  gz=%5dK\n" "$(basename $f)" "$(($raw/1024))" "$(($gz/1024))"
done | sort -t= -k3 -rn | head
```

Expected: per-route d3 chunks <30 KB gz each (most <15 KB).

- [ ] **Step 4: Browser smoke test (manual)**

`bun run start`. Walk all 7 viz routes; each renders.

- [ ] **Step 5: Push branch + open stacked PR**

```bash
git push -u origin stack-diet/phase-1-d3-submodules
gh pr create --base stack-diet/phase-0-cleanup --title "Phase 1: D3 submodule imports" --body "..."
```

---

## Notes

- Use `import type` for type-only imports (Selection, ScaleBand, etc.) so they're erased at runtime.
- Avoid renaming during the rewrite — keep `select`, `format` etc. as bare names matching the d3 source. Don't alias.
- Webpack 5 + the d3 v7 ESM submodules tree-shake correctly with named imports. The umbrella `d3` package is what defeats it.
- `d3-simple-slider` (used by budget-sankey) stays as-is. It's a separate dep, already correctly imported by name.
- If a file has zero d3 usage after the rewrite (e.g., `utils.ts` only had `d3.select`), it still keeps `import { select } from 'd3-selection'` — that's fine.
