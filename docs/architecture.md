# Architecture

Canonical reference for how RainChart is structured. Keep this in sync with the code.

## Purpose

RainChart is an interactive physics simulation framework rendered in the browser. It currently ships a gravity simulation with pluggable rendering backends (Canvas and SVG/D3). The core design goal is **complete separation between physics calculations and visualisation**.

## Guiding Principles

1. **No build step** – Open `index.html` in a browser and everything works.
2. **Minimal dependencies** – Only D3.js is included (vendored, optional – only needed for SVG mode).
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
└──────────────────┘  └────────────────────────┘
```

## File Map

```
js/
├── main.js                          # Application layer – entry point, generic simulation runner
├── rainchart.js                     # Barrel export for all public modules
├── integrators/
│   └── integrators.js               # Generic ODE solvers (Euler, RK4, Verlet, Velocity Verlet)
├── physics-sims/
│   ├── simulation-interface.js      # ISimulation – abstract base class
│   ├── engine-interface.js          # ISimulationEngine – abstract base class
│   ├── config-interface.js          # ISimulationConfig – validation helper
│   ├── controls-interface.js        # ISimulationControls – validation helper
│   └── Gravity/
│       ├── gravity-simulation.js    # Controller: owns engine + renderer, animation loop
│       ├── gravity-engine.js        # Pure physics: N-body force/position calculations
│       ├── gravity-renderer.js      # Scene composition: maps state → primitive draw calls
│       ├── gravity-config.js        # Module metadata + renderer/engine configuration
│       └── gravity-controls.js      # UI control definitions
└── renderer/
    ├── base-renderer.js             # Factory/adapter – routes to Canvas or D3
    ├── canvas-renderer.js           # HTML5 Canvas primitives implementation
    └── d3-renderer.js               # SVG/D3.js primitives implementation

styles/
└── main.css                         # Shared CSS variables and base styles

lib/
└── d3.v7.min.js                     # Vendored D3 library (optional – SVG mode only)

index.html                           # Gravity simulator app
chart.html                           # Primitive drawing demo
example-module.html                  # Module usage example
test-selective-import.html           # Module import testing
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

Physics-agnostic ODE solvers with a uniform interface: `(state, derivative, dt, t) → newState`.

Available methods: Euler, RK4, position Verlet, velocity Verlet. Each engine selects its integrator via its config (e.g. `GravityConfig.engine.integrator`).

### Physics Engines (e.g. `gravity-engine.js`)

- Extend `ISimulationEngine`.
- Contain all domain-specific maths (forces, accelerations, boundary conditions).
- Expose `initialize()`, `step()`, `getState()`, `reset()`, `setDimensions()`.
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
- Both backends implement the same primitive interface (see table below).
- Backends can be swapped at runtime by recreating `BaseRenderer` with a different `renderMode`.

### Simulation Configs (e.g. `gravity-config.js`)

- Implement the `ISimulationConfig` structure (validated at load time).
- Contain three sections: `module` (loading metadata), `renderer` (visual settings), `engine` (physics settings).
- `main.js` reads the config path, dynamically imports the simulation and controls, and wires everything together.

### Simulation Controls (e.g. `gravity-controls.js`)

- Implement the `ISimulationControls` structure (validated at load time).
- Define UI controls as a declarative array of objects (`{ id, type, label, action, ... }`).
- `main.js` iterates the array, attaches DOM event listeners, and delegates actions to the simulation.

### Application Layer (`main.js`)

- Completely generic – has **no hardcoded references** to any specific simulation.
- Points to a single `SIMULATION_CONFIG_PATH` constant; change it to switch simulations.
- Dynamically imports the simulation class and controls from the config's `module` metadata.
- Validates loaded modules against interfaces (`ISimulationConfig`, `ISimulationControls`).
- Should remain thin – no physics or rendering logic.

## Renderer Primitive Interface

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

> **Note:** `updateElement` and `removeElement` are no-ops in Canvas mode because the canvas requires a full redraw.

## ISimulation Interface

All simulation controllers must extend `ISimulation` and implement:

| Method | Purpose |
|---|---|
| `initialize(...args)` | Set up initial state |
| `onUpdate(callback)` | Register observer for state changes |
| `getState()` | Return current state as a plain object |
| `step()` | Advance simulation by one time step |
| `start()` | Begin the animation loop |
| `stop()` | Pause the animation loop |
| `reset(...args)` | Reinitialise to starting conditions |
| `render(renderer)` | Draw current state using a `BaseRenderer` |
| `destroy()` | Clean up resources |

## Adding a New Simulation

1. **Create a folder** `js/physics-sims/YourSim/`.

2. **Create an engine** (`yoursim-engine.js`):
   - Extend `ISimulationEngine`.
   - Implement `initialize()`, `step()`, `getState()`, `reset()`, `setDimensions()`.
   - Use integrators from `js/integrators/integrators.js`.
   - Return plain objects from `getState()`.

3. **Create a renderer** (`yoursim-renderer.js`):
   - Accept a `BaseRenderer` in the constructor.
   - Implement `render(state)` using `addCircle`, `addLine`, etc.

4. **Create a simulation controller** (`yoursim-simulation.js`):
   - Extend `ISimulation`.
   - Compose the engine and renderer.
   - Implement all interface methods.

5. **Create a config** (`yoursim-config.js`):
   - Follow the `ISimulationConfig` structure with `module`, `renderer`, and `engine` sections.
   - Call `ISimulationConfig.validate(YourSimConfig)` at the bottom.

6. **Create controls** (`yoursim-controls.js`):
   - Follow the `ISimulationControls` structure with a `controls` array and helper methods.
   - Call `ISimulationControls.validate(YourSimControls)` at the bottom.

7. **Wire into the app**:
   - Update the `SIMULATION_CONFIG_PATH` in `main.js`.
   - Add matching HTML controls to `index.html` (IDs must match `controls[].id` values).
   - Optionally export new classes from `rainchart.js`.

## Switching Simulations

Change **one line** in `main.js`:

```javascript
const SIMULATION_CONFIG_PATH = './physics-sims/YourSim/yoursim-config.js';
```

## Future Directions

- Additional simulations (temperature, trajectory, waves, electromagnetism).
- `requestAnimationFrame`-based animation loop for smoother rendering.
- Optional test harness for physics engines (runnable in Node.js or browser).
- Potential extraction into separate NPM packages (physics, visualisation, app).
