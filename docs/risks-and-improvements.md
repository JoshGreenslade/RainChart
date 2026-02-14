# Structural Risks & Improvement Options

An honest assessment of the current codebase with concrete options for addressing each item. Items are ordered roughly by impact.

---

## 1. Incomplete Simulation Portfolio

**Risk:** Only the gravity simulation is fully implemented. Temperature and trajectory simulations are mentioned in documentation but have no corresponding source files.

**Impact:** The codebase appears incomplete, and any remaining config for missing simulations adds dead code.

**Options:**
- **A – Implement the missing simulations**: Follow the established pattern to add Temperature and Trajectory folders under `js/physics-sims/`. Validates the architecture's extensibility.
- **B – Remove references**: Strip temperature and trajectory config/docs until those simulations are actually built.
- **C – Document as planned work**: Keep references but clearly label them as "planned – not yet implemented".

**Recommendation:** Option A gives the most confidence in the architecture, but Option C is pragmatic if time is limited.

---

## 2. No Test Infrastructure

**Risk:** There are zero automated tests. The physics engines are pure functions with no DOM dependency, making them ideal candidates for unit testing, but no test runner or test files exist.

**Impact:** Regressions can be introduced silently. Refactoring is risky.

**Options:**
- **A – Lightweight browser-based tests**: Create a `tests/` directory with a simple HTML test runner (no npm required) that exercises integrators and physics engines in the browser. Keeps the zero-build-step philosophy.
- **B – Node.js test runner**: Add a minimal `package.json` with a test runner (e.g. Node's built-in `node --test`). Physics files would need minor adaptation (e.g. wrapping in modules or using a script loader).
- **C – Defer**: Accept the risk for now and add tests when the codebase grows.

**Recommendation:** Option A. A simple HTML-based test page fits the project's philosophy and covers the most valuable cases (integrator accuracy, force calculations).

---

## 3. BaseRenderer Manual Delegation

**Risk:** `BaseRenderer` manually proxies every method to the underlying `CanvasRenderer` or `D3Renderer`. When a new primitive is added to the backends, `BaseRenderer` must also be updated or the method is silently missing.

**Impact:** Easy to forget, leading to runtime errors when a simulation calls a method that `BaseRenderer` does not forward.

**Options:**
- **A – Use a `Proxy` object**: Replace manual delegation with a JavaScript `Proxy` that automatically forwards all method calls to the active renderer. Zero maintenance when adding new methods.
- **B – Automated code review check**: Keep the current pattern but rely on conventions doc reminders.
- **C – Remove `BaseRenderer`**: Have the application layer hold a direct reference to the concrete renderer. A factory function returns the correct type. This eliminates the proxy entirely.

**Recommendation:** Option C is simplest; Option A is most robust if the adapter is valued.

---

## 4. Animation Loop Uses `setInterval`

**Risk:** `GravitySimulation` uses `setInterval` for its animation loop. `setInterval` does not synchronise with the browser's repaint cycle, can drift, and keeps running even when the tab is not visible (wasting CPU).

**Impact:** Possible visual jank, unnecessary resource usage, and inconsistent frame timing.

**Options:**
- **A – Switch to `requestAnimationFrame`**: Use `requestAnimationFrame` inside the simulation controller. Automatically pauses when the tab is hidden, syncs with the display refresh rate, and produces smoother animation.
- **B – Keep `setInterval` with visibility handling**: Add a `visibilitychange` listener to pause/resume the interval when the tab is hidden.

**Recommendation:** Option A. `requestAnimationFrame` is the standard approach for browser animations.

---

## 5. Colour Scheme Regeneration on Renderer Switch

**Risk:** `CanvasRenderer` and `D3Renderer` each use hardcoded default colour arrays. Switching the renderer mode creates a new renderer instance. While both currently use the same array, the colours come from `options` which may differ.

**Impact:** Potential visual inconsistency when the user switches between Canvas and SVG.

**Options:**
- **A – Pass colour scheme into renderer constructors**: Generate the palette once at application startup and pass it as an option. Both renderers use the same palette.
- **B – Seed-based generation**: Allow a seed so the same seed reproduces the same palette across renderer instances.

**Recommendation:** Option A is the simplest fix.

---

## 6. Canvas `updateElement` / `removeElement` Are No-ops

**Risk:** `CanvasRenderer.updateElement()` and `removeElement()` exist to match the interface but do nothing meaningful in Canvas mode (canvas requires full redraws).

**Impact:** Calling code may expect these methods to work and be surprised when they don't.

**Options:**
- **A – Log a warning**: `console.warn('updateElement is not supported in Canvas mode')`.
- **B – Implement full-redraw support**: Track element state and redraw the full canvas on update/remove.
- **C – Document the limitation**: Note in `docs/architecture.md` (done – see renderer contract note).

**Recommendation:** Option A for immediate feedback during development; Option B if canvas update support becomes important.

---

## 7. CSS Duplication in HTML Files

**Risk:** Both `index.html` and `chart.html` contain large `<style>` blocks with duplicated CSS for controls, buttons, and layout. Changes must be made in both files.

**Impact:** Inconsistency and extra maintenance.

**Options:**
- **A – Extract to a shared stylesheet**: Move the common styles into `styles/main.css` (or a new `styles/controls.css`) and link from both HTML files.
- **B – Accept duplication**: If the pages are expected to diverge visually, keeping them separate may be acceptable.

**Recommendation:** Option A. The styles are currently identical and should stay in sync.

---

## Summary Table

| # | Risk | Severity | Effort | Recommended |
|---|---|---|---|---|
| 1 | Incomplete simulations | Medium | Medium | Implement or label as planned |
| 2 | No tests | High | Medium | Browser-based test page |
| 3 | BaseRenderer delegation | Low | Low | Remove or use Proxy |
| 4 | `setInterval` animation | Medium | Low | `requestAnimationFrame` |
| 5 | Colour scheme on switch | Low | Low | Pass scheme to constructors |
| 6 | Canvas no-op methods | Low | Low | Log a warning |
| 7 | CSS duplication | Low | Low | Extract shared stylesheet |
