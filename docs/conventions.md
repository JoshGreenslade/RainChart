# Conventions & Guidance

Ground rules for keeping this codebase simple, understandable, maintainable and extendable.

> **For AI agents:** Read this document in full before making any changes to the repository.

## General Philosophy

- **Prefer simplicity over cleverness.** If someone new to the project cannot understand a file in five minutes, it is too complex.
- **No build step.** The app runs by opening an HTML file. Avoid introducing tooling that requires compilation, transpilation, or bundling unless there is a compelling reason agreed on by the team.
- **Minimal dependencies.** Every external library is a maintenance burden. Justify any addition.
- **Small files, single responsibility.** Each file should do one thing. A good guideline is under 200 lines per file.

## Project Structure

```
docs/           Architecture, conventions, and planning documents (you are here)
js/
  main.js       Application entry point (generic simulation runner)
  rainchart.js  Barrel export for all public modules
  integrators/  Generic numerical solvers (each integrator in its own file)
  physics-sims/ Simulation interfaces, engines, controllers, renderers, configs, controls
  renderer/     Primitive rendering backends (Canvas, D3/SVG, and WebGPU/WGSL)
lib/            Vendored third-party libraries
styles/         CSS
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files | `kebab-case.js` | `gravity-engine.js` |
| Directories (simulations) | `PascalCase` | `Gravity/` |
| Classes | `PascalCase` | `GravityEngine` |
| Interfaces | `I` prefix + `PascalCase` | `ISimulation` |
| Methods/functions | `camelCase` | `calculateForce()` |
| Constants | `UPPER_SNAKE_CASE` | `SIMULATION_CONFIG_PATH` |
| Config object keys | `camelCase` | `bodyCount`, `maxMass` |
| Private methods | `_camelCase` prefix | `_drawBodies()` |
| CSS variables | `--kebab-case` | `--primary-color` |
| HTML IDs | `kebab-case` | `gravity-chart` |

### File Naming Pattern for Simulations

Each simulation lives in its own folder under `js/physics-sims/` and contains five files:

```
<Name>/
  <name>-engine.js       Pure physics calculations (extends ISimulationEngine)
  <name>-renderer.js     Scene composition using primitive draw calls
  <name>-simulation.js   Controller: lifecycle, observers, animation loop (extends ISimulation)
  <name>-config.js       Module metadata + renderer/engine configuration (ISimulationConfig)
  <name>-controls.js     UI control definitions (ISimulationControls)
```

## Coding Style

### JavaScript

- Use ES6 modules (`import` / `export`). Every file is a module.
- Use `class` for objects with state and behaviour.
- Use plain objects/closures for stateless utilities (e.g. `Integrators`, `GravityConfig`).
- Use `const` by default; `let` when reassignment is needed; never `var`.
- Use `===` for comparisons, never `==`.
- Keep functions short. If a function exceeds ~30 lines, consider splitting it.
- Use JSDoc `/** */` comments on every public method and class. Include `@param` and `@returns`.
- Avoid inline comments unless clarifying non-obvious logic.
- Relative paths in imports must include the `.js` extension.

### HTML

- Load D3.js as a regular `<script>` tag before any `<script type="module">` that needs it.
- Keep inline styles minimal; prefer CSS classes or CSS variables.

### CSS

- Use CSS custom properties (variables) in `:root` for theming.
- Keep selector specificity low. Avoid `!important`.

## Layer Boundaries

These rules keep the architecture clean:

### Physics layer MUST NOT

- Reference `document`, `window`, `canvas`, or any DOM API.
- Import or depend on any rendering library.
- Call rendering methods.

### Visualisation layer MUST NOT

- Perform physics calculations.
- Maintain physics state across frames.
- Call physics update methods.

### Application layer SHOULD

- Remain thin – only wiring and UI event handling.
- Not contain physics logic or rendering logic.
- Delegate to simulation controllers for lifecycle management.

## Interface & Config Patterns

- All simulations implement four interfaces: `ISimulation`, `ISimulationEngine`, `ISimulationConfig`, `ISimulationControls`.
- Interfaces are enforced by convention: base classes throw on unimplemented methods; config/controls use static `validate()` methods.
- Configs contain a `module` section with loading metadata so `main.js` can dynamically import the simulation without hardcoded references.
- Controls define UI elements declaratively; `main.js` iterates the array and attaches DOM event listeners.

## Extending the Renderer

When adding a new primitive method (e.g. `addText`):

1. Add the method to **all** renderer implementations (`CanvasRenderer`, `D3Renderer`, and `WGSLRenderer`).
2. Add a delegating method to `BaseRenderer`.
3. Update the `IRenderer` interface validation in `renderer-interface.js`.
4. Document the method in the renderer contract table in `docs/architecture.md`.

All backends must implement the same interface. Note that `WGSLRenderer` is optimized for circles and may not efficiently support all primitives.

## Error Handling

- Fail loudly during development. Use `console.error` for unexpected states.
- Physics engines should handle edge cases (division by zero, NaN) gracefully with softening or clamping.
- Never silently swallow exceptions.

## Performance Guidelines

- Canvas mode is preferred for high-particle-count simulations (1,000+).
- SVG/D3 mode is preferred for interactive or smaller-scale visualisations.
- Avoid creating objects in hot loops where possible; reuse arrays and objects.
- Prefer `requestAnimationFrame` over `setInterval` for animation loops in future work.

## Documentation

- Keep `docs/` as the single source of truth for architecture and planning.
- `README.md` is the user-facing overview and should remain concise.
- When refactoring, update documentation in the same commit.

## Version Control

- Commit messages should be short and descriptive (imperative mood): "Add wave simulation engine".
- One logical change per commit where practical.
- Keep the `.gitignore` up to date – no build artefacts, IDE settings, or `node_modules/` should be committed.
