# RainChart

Interactive physics simulations rendered in the browser with pluggable visualisation backends.

## Quick Start

Open `index.html` in any modern browser. No build step, no `npm install` – it just works.

- **`index.html`** – Gravity simulator (N-body gravitational interactions).
- **`chart.html`** – Primitive drawing demo (add circles, lines, rectangles, curves).

## What's Inside

| Simulation | Status | Description |
|---|---|---|
| Gravity | ✅ Implemented | N-body gravitational interactions with configurable body count and G constant |
| Temperature | 🔲 Planned | Heat diffusion along a 1D bar |
| Trajectory | 🔲 Planned | Projectile motion with air resistance |

The architecture cleanly separates **physics** from **rendering**. Physics engines produce plain data; renderers consume it through a primitive drawing interface (`addCircle`, `addLine`, etc.). You can swap between Canvas and SVG (D3.js) at runtime.

## Project Structure

```
js/
├── main.js                              # Application entry point (generic simulation runner)
├── rainchart.js                         # Barrel export for all public modules
├── integrators/
│   └── integrators.js                   # Generic ODE solvers (Euler, RK4, Verlet, Velocity Verlet)
├── physics-sims/
│   ├── simulation-interface.js          # ISimulation – abstract base class
│   ├── engine-interface.js              # ISimulationEngine – abstract base class
│   ├── config-interface.js              # ISimulationConfig – validation helper
│   ├── controls-interface.js            # ISimulationControls – validation helper
│   └── Gravity/
│       ├── gravity-simulation.js        # Controller: lifecycle, observers, animation loop
│       ├── gravity-engine.js            # Pure physics: N-body force/position calculations
│       ├── gravity-renderer.js          # Scene composition: maps state → primitives
│       ├── gravity-config.js            # Module metadata + renderer/engine configuration
│       └── gravity-controls.js          # UI control definitions
└── renderer/
    ├── base-renderer.js                 # Factory/adapter – delegates to Canvas or D3
    ├── canvas-renderer.js               # HTML5 Canvas primitives
    └── d3-renderer.js                   # SVG/D3.js primitives

styles/
└── main.css                             # Shared CSS variables

lib/
└── d3.v7.min.js                         # Vendored D3 (only needed for SVG mode)

docs/
├── architecture.md                      # Detailed architecture reference
├── conventions.md                       # Coding conventions and patterns
└── risks-and-improvements.md            # Known issues and improvement options
```

## Using as a Module

```javascript
import { BaseRenderer, GravitySimulation } from './js/rainchart.js';

const renderer = new BaseRenderer('my-container', {
    width: 800,
    height: 600,
    renderMode: 'canvas' // or 'svg'
});

const simulation = new GravitySimulation(800, 600, 3, 1.0);
simulation.onUpdate(() => simulation.render(renderer));
simulation.start();
```

See `example-module.html` for a working example.

## Testing

The project includes comprehensive unit and integration tests:

```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
```

See [test/README.md](test/README.md) for detailed testing documentation.

## Adding a New Simulation

1. Create a folder under `js/physics-sims/YourSim/`.
2. Add five files following the gravity pattern: `*-engine.js`, `*-renderer.js`, `*-simulation.js`, `*-config.js`, `*-controls.js`.
3. Change the `SIMULATION_CONFIG_PATH` in `main.js` to point at your new config.

Full details are in [docs/architecture.md](docs/architecture.md).

## Documentation

| Document | Purpose |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Layer design, data flow, component responsibilities, and extension guide |
| [docs/conventions.md](docs/conventions.md) | Naming rules, coding style, layer boundaries, and contribution guidelines |
| [docs/risks-and-improvements.md](docs/risks-and-improvements.md) | Known technical debt and improvement options |

## Browser Compatibility

ES6 modules are required: Chrome 61+, Firefox 60+, Safari 11+, Edge 16+.

## License

MIT