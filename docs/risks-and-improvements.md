# Structural Risks & Improvement Options

An honest assessment of the current codebase with concrete options for addressing each item. Items are ordered roughly by impact.

---

## 1. Documentation Drift

**Risk:** The root-level markdown files (`ARCHITECTURE.md`, `RENDERER_ARCHITECTURE.md`, `REPOSITORY_SEPARATION.md`, `PRIMITIVE_CHART.md`, `REFACTORING_SUMMARY.md`) reference files and patterns that no longer exist after the MVC refactoring. For example they mention `physics-engine.js`, `gravity-sim.js`, `temperature-sim.js`, `trajectory-sim.js`, `renderer-adapter.js`, and a `ChartRenderer` class – none of which are in the current codebase.

**Impact:** New contributors will be confused and misled by outdated information.

**Options:**
- **A – Consolidate into `docs/`**: Remove or archive the stale root-level docs. Use `docs/architecture.md` and `docs/conventions.md` as the canonical references. Keep `README.md` and `QUICKSTART.md` as concise user-facing entry points and update them to reflect the current file structure.
- **B – Update in place**: Rewrite each root-level markdown to match the current code. More files to maintain, but preserves the existing document structure.

**Recommendation:** Option A. Fewer documents means less maintenance burden.

---

## 2. Incomplete Simulation Portfolio

**Risk:** Only the gravity simulation is fully implemented. Temperature and trajectory simulations are described in documentation and `ChartConfig` but have no corresponding source files. This creates a gap between stated capability and reality.

**Impact:** The codebase appears incomplete, and the config for missing simulations adds dead code.

**Options:**
- **A – Implement the missing simulations**: Follow the established MVC pattern to add `temperature-engine.js`, `temperature-renderer.js`, `temperature-simulation.js` (and similarly for trajectory). Validates the architecture's extensibility.
- **B – Remove references**: Strip temperature and trajectory config/docs until those simulations are actually built.
- **C – Document as planned work**: Keep the config and docs but clearly label them as "planned – not yet implemented".

**Recommendation:** Option A gives the most confidence in the architecture, but Option C is pragmatic if time is limited.

---

## 3. No Test Infrastructure

**Risk:** There are zero automated tests. The physics engines are pure functions with no DOM dependency, making them ideal candidates for unit testing, but no test runner or test files exist.

**Impact:** Regressions can be introduced silently. Refactoring is risky.

**Options:**
- **A – Lightweight browser-based tests**: Create a `tests/` directory with a simple HTML test runner (no npm required) that exercises integrators and physics engines in the browser. Keeps the zero-build-step philosophy.
- **B – Node.js test runner**: Add a minimal `package.json` with a test runner (e.g. Node's built-in `node --test`). Physics files would need minor adaptation (e.g. wrapping in modules or using a script loader).
- **C – Defer**: Accept the risk for now and add tests when the codebase grows.

**Recommendation:** Option A. A simple HTML-based test page fits the project's philosophy and covers the most valuable cases (integrator accuracy, force calculations).

---

## 4. No Module System

**Risk:** All JavaScript is loaded via `<script>` tags in a specific order. Dependencies are implicit globals. There is no way to statically verify that a file has access to the classes it references.

**Impact:** Adding or reordering scripts can cause subtle breakage. Makes the codebase harder to understand for newcomers.

**Options:**
- **A – ES modules with `<script type="module">`**: Modern browsers support ES modules natively – no bundler needed. Each file would use `import`/`export`. Load order is handled automatically.
- **B – Keep `<script>` tag loading**: Maintain the current approach but add a clear comment block in each HTML file documenting the required load order and why.
- **C – Introduce a bundler**: Use a tool like esbuild or Vite for fast bundling. Adds a build step but gives full module support and tree-shaking.

**Recommendation:** Option A. Native ES modules preserve the no-build-step guarantee while eliminating implicit global dependencies.

---

## 5. BaseRenderer Manual Delegation

**Risk:** `BaseRenderer` manually proxies every method to the underlying `CanvasRenderer` or `D3Renderer`. When a new primitive is added to the backends, `BaseRenderer` must also be updated or the method is silently missing.

**Impact:** Easy to forget, leading to runtime errors when a simulation calls a method that `BaseRenderer` does not forward.

**Options:**
- **A – Use a `Proxy` object**: Replace manual delegation with a JavaScript `Proxy` that automatically forwards all method calls to the active renderer. Zero maintenance when adding new methods.
- **B – Automated code review check**: Keep the current pattern but add a note in `docs/conventions.md` (done) reminding developers to update `BaseRenderer` when adding primitives.
- **C – Remove `BaseRenderer`**: Have the application layer hold a direct reference to the concrete renderer. A factory function returns the correct type. This eliminates the proxy entirely.

**Recommendation:** Option C is simplest; Option A is most robust if the adapter is valued.

---

## 6. Animation Loop Uses `setInterval`

**Risk:** `GravitySimulation` uses `setInterval` for its animation loop. `setInterval` does not synchronise with the browser's repaint cycle, can drift, and keeps running even when the tab is not visible (wasting CPU).

**Impact:** Possible visual jank, unnecessary resource usage, and inconsistent frame timing.

**Options:**
- **A – Switch to `requestAnimationFrame`**: Use `requestAnimationFrame` inside the simulation controller. Automatically pauses when the tab is hidden, syncs with the display refresh rate, and produces smoother animation.
- **B – Keep `setInterval` with visibility handling**: Add a `visibilitychange` listener to pause/resume the interval when the tab is hidden.

**Recommendation:** Option A. `requestAnimationFrame` is the standard approach for browser animations.

---

## 7. Global State in `main.js`

**Risk:** `main.js` declares `gravitySimulation` and `baseRenderer` as top-level `let` variables. These are accessible from the browser console and from any other script on the page.

**Impact:** Low severity today (single-page app), but makes future multi-simulation pages harder and pollutes the global namespace.

**Options:**
- **A – Wrap in an IIFE**: `(function() { … })();` to scope all variables.
- **B – Use ES modules**: Same as risk #4, Option A – modules have their own scope by default.
- **C – Accept for now**: The global scope is tolerable for a small project.

**Recommendation:** Address alongside the module migration (see "No Module System" above).

---

## 8. CSS Duplication in HTML Files

**Risk:** Both `index.html` and `chart.html` contain large `<style>` blocks with duplicated CSS for controls, buttons, and layout. Changes must be made in both files.

**Impact:** Inconsistency and extra maintenance.

**Options:**
- **A – Extract to a shared stylesheet**: Move the common styles into `styles/main.css` (or a new `styles/controls.css`) and link from both HTML files.
- **B – Accept duplication**: If the pages are expected to diverge visually, keeping them separate may be acceptable.

**Recommendation:** Option A. The styles are currently identical and should stay in sync.

---

## 9. Colour Scheme Regeneration on Renderer Switch

**Risk:** `CanvasRenderer` and `D3Renderer` each call `ColorScheme.generate()` in their constructor, producing a random palette. Switching the renderer mode creates a new renderer instance, changing all colours mid-session.

**Impact:** Jarring visual change when the user switches between Canvas and SVG.

**Options:**
- **A – Pass colour scheme into renderer constructors**: Generate the palette once at application startup and pass it as an option. Both renderers use the same palette.
- **B – Seed-based generation**: Allow `ColorScheme.generate(seed)` so the same seed reproduces the same palette across renderer instances.

**Recommendation:** Option A is the simplest fix.

---

## 10. Canvas `updateElement` / `removeElement` Are No-ops

**Risk:** `CanvasRenderer.updateElement()` and `removeElement()` exist to match the interface but do nothing meaningful in Canvas mode (canvas requires full redraws).

**Impact:** Calling code may expect these methods to work and be surprised when they don't.

**Options:**
- **A – Log a warning**: `console.warn('updateElement is not supported in Canvas mode')`.
- **B – Implement full-redraw support**: Track element state and redraw the full canvas on update/remove (current element tracking partially supports this already).
- **C – Document the limitation**: Note in `docs/architecture.md` that these methods are SVG-only.

**Recommendation:** Option A for immediate feedback during development; Option B if canvas update support becomes important.

---

## Summary Table

| # | Risk | Severity | Effort | Recommended |
|---|---|---|---|---|
| 1 | Documentation drift | High | Low | Consolidate into `docs/` |
| 2 | Incomplete simulations | Medium | Medium | Implement or label as planned |
| 3 | No tests | High | Medium | Browser-based test page |
| 4 | No module system | Medium | Medium | ES modules |
| 5 | BaseRenderer delegation | Low | Low | Remove or use Proxy |
| 6 | `setInterval` animation | Medium | Low | `requestAnimationFrame` |
| 7 | Global state | Low | Low | Address with modules |
| 8 | CSS duplication | Low | Low | Extract shared stylesheet |
| 9 | Colour scheme on switch | Low | Low | Pass scheme to constructors |
| 10 | Canvas no-op methods | Low | Low | Log a warning |
