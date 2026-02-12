# Conventions & Guidance

Ground rules for keeping this codebase simple, understandable, maintainable and extendable.

## General Philosophy

- **Prefer simplicity over cleverness.** If someone new to the project cannot understand a file in five minutes, it is too complex.
- **No build step.** The app runs by opening an HTML file. Avoid introducing tooling that requires compilation, transpilation, or bundling unless there is a compelling reason agreed on by the team.
- **Minimal dependencies.** Every external library is a maintenance burden. Justify any addition.
- **Small files, single responsibility.** Each file should do one thing. A good guideline is under 200 lines per file.

## Project Structure

```
docs/           Architecture and planning documents (you are here)
js/
  integrators/  Generic numerical solvers
  physics-sims/ Physics engines, simulation controllers, simulation renderers
  renderer/     Primitive rendering backends and config
lib/            Vendored third-party libraries
styles/         CSS
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files | `kebab-case.js` | `gravity-engine.js` |
| Classes | `PascalCase` | `GravityEngine` |
| Methods/functions | `camelCase` | `calculateForce()` |
| Constants | `UPPER_SNAKE_CASE` | `CONFIG.softening_factor` |
| Private methods | `_camelCase` prefix | `_drawBodies()` |
| CSS variables | `--kebab-case` | `--primary-color` |
| HTML IDs | `kebab-case` | `gravity-chart` |

### File Naming Pattern for Simulations

Each simulation has up to three files:

```
<name>-engine.js       Pure physics calculations
<name>-renderer.js     Visual scene composition using primitives
<name>-simulation.js   Controller: lifecycle, observers, animation loop
```

## Coding Style

### JavaScript

- Use `class` for objects with state and behaviour.
- Use plain objects/closures for stateless utilities (e.g. `Integrators`, `ChartConfig`).
- Use `const` by default; `let` when reassignment is needed; never `var`.
- Use `===` for comparisons, never `==`.
- Keep functions short. If a function exceeds ~30 lines, consider splitting it.
- Use JSDoc `/** */` comments on every public method and class. Include `@param` and `@returns`.
- Avoid inline comments unless clarifying non-obvious logic.

### HTML

- Load scripts at the end of `<body>` in dependency order.
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

## Extending the Renderer

When adding a new primitive method (e.g. `addText`):

1. Add the method to **both** `CanvasRenderer` and `D3Renderer`.
2. Add a delegating method to `BaseRenderer`.
3. Document the method in the renderer contract table in `docs/architecture.md`.

Both backends must always implement the same interface.

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
- Root-level markdown files (`README.md`, `QUICKSTART.md`, etc.) are user-facing overviews and should remain concise.
- When refactoring, update documentation in the same commit.

## Version Control

- Commit messages should be short and descriptive (imperative mood): "Add wave simulation engine".
- One logical change per commit where practical.
- Keep the `.gitignore` up to date – no build artefacts, IDE settings, or `node_modules/` should be committed.
