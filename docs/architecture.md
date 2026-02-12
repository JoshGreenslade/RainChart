# Architecture Plan

This document describes the intended architecture for the RainChart project, serving as the canonical reference for how the system is structured and how it should evolve.

## Purpose

RainChart is an interactive physics simulation framework rendered in the browser. It provides a collection of simulations (currently gravity) with pluggable rendering backends (Canvas and SVG/D3). The core design goal is **complete separation between physics calculations and visualisation**.

## Guiding Principles

1. **No build step** – Open `index.html` in a browser and everything works.
2. **Minimal dependencies** – Only D3.js is included (and only needed for SVG mode).
3. **Separation of concerns** – Physics knows nothing about rendering; rendering knows nothing about physics.
4. **Small surface area** – Each class/module should do one thing well.

## Layer Diagram

```
┌──────────────────────────────────────────────┐
│          Application Layer (main.js)         │
│  - Wires physics to rendering                │
│  - Handles UI events and controls            │
│  - Manages simulation lifecycle              │
└──────────────┬───────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────────────┐  ┌──▼────────────────────┐
│  Physics Layer   │  │  Visualisation Layer   │
│                  │  │                        │
│ Integrators      │  │ BaseRenderer (factory) │
│ Engines          │  │  ├─ CanvasRenderer     │
│ Simulations      │  │  └─ D3Renderer         │
│ (ISimulation)    │  │                        │
│                  │  │ Simulation Renderers    │
│                  │  │  └─ GravityRenderer     │
│                  │  │                        │
│                  │  │ ColorScheme, ChartConfig│
└──────────────────┘  └────────────────────────┘
```

## File Map

```
js/
├── main.js                          # Application layer – entry point, UI wiring
├── integrators/
│   └── integrators.js               # Generic ODE solvers (Euler, RK4, Verlet)
├── physics-sims/
│   ├── simulation-interface.js      # ISimulation – abstract base class
│   ├── gravity-engine.js            # Pure physics: N-body force/position math
│   ├── gravity-renderer.js          # Scene composition: maps state → primitives
│   └── gravity-simulation.js        # MVC controller: owns engine + renderer
└── renderer/
    ├── base-renderer.js             # Factory/adapter – routes to Canvas or D3
    ├── canvas-renderer.js           # HTML5 Canvas primitives implementation
    ├── d3-renderer.js               # SVG/D3.js primitives implementation
    ├── color-scheme.js              # Random HSL palette generator
    └── chart-config.js              # Visual configuration constants

styles/
└── main.css                         # Shared CSS variables and base styles

lib/
└── d3.v7.min.js                     # Vendored D3 library (optional)

index.html                           # Gravity simulator app
chart.html                           # Primitive drawing demo
```

## Data Flow

```
User Input
    │
    ▼
Application (main.js)
    │
    ├──► GravitySimulation.start() / stop() / reset()
    │         │
    │         ▼
    │    GravityEngine.step()        ← pure physics, no DOM
    │         │
    │         ▼
    │    notifyListeners(state)      ← observer pattern
    │         │
    │         ▼
    │    GravitySimulation.render(baseRenderer)
    │         │
    │         ▼
    │    GravityRenderer.render(state)
    │         │
    │         ▼
    │    BaseRenderer.addCircle / addLine / …
    │         │
    │         ▼
    │    CanvasRenderer or D3Renderer
    │
    ▼
Visual Output (Canvas element or SVG element)
```

**Key rule:** Data flows in one direction. Renderers never call back into physics.

## Component Responsibilities

### Integrators (`js/integrators/integrators.js`)
- Physics-agnostic ODE solvers.
- Uniform interface: `(state, derivative, dt, t) → newState`.
- Available: Euler, RK4, position Verlet, velocity Verlet.
- Selected per-engine via `CONFIG.integrator`.

### Physics Engines (e.g. `gravity-engine.js`)
- Contain all domain-specific maths (forces, accelerations, boundary conditions).
- Expose `initialize()`, `step()`, `getState()`, `reset()`.
- Return plain data objects; never reference the DOM.

### Simulation Controllers (e.g. `gravity-simulation.js`)
- Extend `ISimulation` – the shared contract.
- Own an engine instance and a renderer instance.
- Manage the animation loop (currently `setInterval`).
- Expose observer callbacks via `onUpdate()`.

### Simulation Renderers (e.g. `gravity-renderer.js`)
- Map domain state (bodies, temperatures, trajectories) to primitive draw calls.
- Contain visual logic like grid drawing, colour mapping, and size scaling.
- Depend only on the primitive renderer interface, not on a specific backend.

### BaseRenderer → CanvasRenderer / D3Renderer
- `BaseRenderer` is a thin factory/adapter that delegates every call to the active backend.
- Both backends implement the same primitive interface: `addCircle`, `addLine`, `addRectangle`, `addCurve`, `addPath`, `addAxis`, `clear`, `resize`.
- Backends can be swapped at runtime by recreating `BaseRenderer`.

### Application Layer (`main.js`)
- Creates the renderer and simulation.
- Connects simulation updates to the renderer.
- Attaches DOM event listeners for UI controls.
- Should remain thin – no physics or rendering logic.

## Adding a New Simulation

1. **Create an engine** in `js/physics-sims/<name>-engine.js`
   - Implement `initialize()`, `step()`, `getState()`, `reset()`.
   - Use integrators from `js/integrators/integrators.js`.
   - Return plain objects from `getState()`.

2. **Create a renderer** in `js/physics-sims/<name>-renderer.js`
   - Accept a primitive renderer in the constructor.
   - Implement `render(state)` using `addCircle`, `addLine`, etc.

3. **Create a simulation controller** in `js/physics-sims/<name>-simulation.js`
   - Extend `ISimulation`.
   - Compose the engine and renderer.
   - Implement all interface methods.

4. **Wire into the app**
   - Add `<script>` tags to `index.html` (order matters – dependencies first).
   - Instantiate in `main.js` and connect to UI controls.

## Renderer Contract

Any renderer backend must implement these methods:

| Method | Signature | Returns |
|---|---|---|
| `addCircle` | `(x, y, radius, style)` | element ID |
| `addLine` | `(x1, y1, x2, y2, style)` | element ID |
| `addRectangle` | `(x, y, width, height, style)` | element ID |
| `addCurve` | `(points, style)` | element ID |
| `addPath` | `(pathData, style)` | element ID |
| `addAxis` | `(type, position, min, max, options)` | element ID |
| `updateElement` | `(id, attributes)` | – |
| `removeElement` | `(id)` | – |
| `clear` | `()` | – |
| `resize` | `(width, height)` | – |
| `getColorScheme` | `()` | scheme object |

## Future Directions

- Additional simulations (temperature, trajectory, waves, electromagnetism).
- `requestAnimationFrame`-based animation loop for smoother rendering.
- ES module migration when a build step becomes acceptable.
- Optional test harness for physics engines (runnable in Node.js).
- Potential extraction into separate NPM packages (physics, visualisation, app).
