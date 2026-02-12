# Architecture Overview

## Clear Separation of Concerns

This project demonstrates a **clean architecture** with complete separation between physics calculations and visualization rendering. This design allows each layer to be developed, tested, and maintained independently - and even moved to separate repositories in the future.

## Layer Structure

```
┌─────────────────────────────────────────┐
│      Application Layer (main.js)        │
│   - Connects physics to visualization   │
│   - Handles UI interactions             │
│   - Manages simulation lifecycle        │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼─────────┐    ┌───────▼────────────┐
│  Physics Layer  │    │ Visualization Layer│
│  (Pure JS)      │    │ (Canvas/D3.js)     │
│                 │    │                    │
│ - No graphics   │    │ - Consumes data    │
│ - No DOM        │    │ - Renders visuals  │
│ - Pure math     │    │ - No physics logic │
└─────────────────┘    └────────────────────┘
```

## Physics Layer (Pure JavaScript)

**Files:**
- `js/physics-engine.js` - Core physics calculations
- `js/gravity-sim.js` - Gravity simulation logic
- `js/temperature-sim.js` - Heat diffusion logic  
- `js/trajectory-sim.js` - Projectile motion logic

**Characteristics:**
- ✅ Zero dependencies on visualization libraries
- ✅ No DOM manipulation
- ✅ Pure data output through observer pattern
- ✅ Can run in Node.js, Web Workers, or any JavaScript environment
- ✅ Easy to unit test
- ✅ **Ready to be extracted to a separate repository**

**API Pattern:**
```javascript
// Physics simulators expose a clean interface
const simulator = new GravitySimulator(width, height, bodyCount, G);

// Register observers to receive state updates
simulator.onUpdate((state) => {
    // state contains pure data: { bodies: [...], time: ..., isRunning: ... }
});

// Control simulation
simulator.start();
simulator.stop();
simulator.reset();
```

**Key Principle:** Physics simulators **never** call rendering functions. They only:
1. Perform calculations
2. Update internal state
3. Notify observers with pure data objects

## Visualization Layer

**Files:**
- `js/chart-renderer.js` - Rendering functions

**Characteristics:**
- ✅ Consumes pure physics data through a clean interface
- ✅ No physics calculations
- ✅ Currently uses HTML5 Canvas (easy to swap with D3.js, Three.js, etc.)
- ✅ Can be replaced without touching physics code
- ✅ **Ready to be extracted to a separate repository**

**API Pattern:**
```javascript
// Renderers are pure functions that consume data
ChartRenderer.renderGravitySimulation(containerId, state, options);
ChartRenderer.renderTemperature(containerId, state, options);
ChartRenderer.renderTrajectory(containerId, state, options);
```

**Key Principle:** Renderers **never** perform physics calculations. They only:
1. Receive data
2. Transform data to visual coordinates
3. Draw to canvas/SVG

## Application Layer

**Files:**
- `js/main.js` - Application initialization and glue code

**Responsibilities:**
- Wire physics simulators to renderers
- Handle UI events
- Pass user inputs to physics layer
- Pass physics outputs to visualization layer

**Example Connection:**
```javascript
// Create physics simulator (no rendering logic)
const simulator = new GravitySimulator(800, 600, 3, 1.0);

// Connect to renderer (observer pattern)
simulator.onUpdate((state) => {
    ChartRenderer.renderGravitySimulation('gravity-chart', state, {
        width: 800,
        height: 600
    });
});

// Handle UI
document.getElementById('start').addEventListener('click', () => {
    simulator.start();
});
```

## Benefits of This Architecture

### 1. Independent Development
- Physics developers don't need to know about rendering
- Graphics developers don't need to understand physics
- Each team can work in parallel

### 2. Easy Testing
- Physics can be unit tested without rendering
- Visual regression testing without physics complexity
- Mock one layer to test the other

### 3. Reusability
- Same physics engine can power:
  - Web visualizations (Canvas, SVG, WebGL)
  - Mobile apps
  - Desktop applications
  - Server-side calculations
  - CLI tools

### 4. Swappable Components
- Switch from Canvas to D3.js without touching physics
- Replace physics algorithms without touching renderer
- Use different renderers for different platforms

### 5. Repository Separation Ready
The architecture is designed so you can easily:
```
physics-engine/          (Separate repo)
├── physics-engine.js
├── gravity-sim.js
├── temperature-sim.js
└── trajectory-sim.js

visualization-library/   (Separate repo)
└── chart-renderer.js

physics-app/            (Main app repo)
├── index.html
├── main.js
└── styles/
```

## Data Flow

```
User Input → Application → Physics Simulator
                              ↓
                         (calculations)
                              ↓
                          Pure Data
                              ↓
                    Observer notification
                              ↓
                        Renderer Function
                              ↓
                      Visual Output (Canvas/SVG)
```

**Important:** Data only flows one way. Renderers never call back into physics.

## Extending the System

### Adding a New Simulation

1. **Create Physics Module** (e.g., `wave-sim.js`)
   ```javascript
   class WaveSimulator {
       constructor() { /* pure physics setup */ }
       onUpdate(callback) { /* observer pattern */ }
       getState() { /* return pure data */ }
       start() { /* run simulation */ }
       stop() { /* stop simulation */ }
   }
   ```

2. **Add Renderer** (in `chart-renderer.js`)
   ```javascript
   ChartRenderer.renderWave(containerId, state, options) {
       // Pure rendering logic
   }
   ```

3. **Wire Together** (in `main.js`)
   ```javascript
   const sim = new WaveSimulator();
   sim.onUpdate(state => ChartRenderer.renderWave('wave-chart', state));
   ```

### Switching Visualization Libraries

To use D3.js instead of Canvas:
1. Keep all physics files unchanged
2. Rewrite only `chart-renderer.js` using D3.js
3. Main.js stays the same (observer pattern is library-agnostic)

## Best Practices

### For Physics Layer
- ❌ Never import/require rendering libraries
- ❌ Never manipulate DOM
- ❌ Never use `document`, `window`, `canvas`, etc.
- ✅ Return plain JavaScript objects/arrays
- ✅ Use observer pattern for state updates
- ✅ Keep calculations pure when possible

### For Visualization Layer  
- ❌ Never perform physics calculations
- ❌ Never maintain physics state
- ❌ Never call physics update methods
- ✅ Render based only on data received
- ✅ Keep functions pure (same input = same output)
- ✅ Make rendering options configurable

### For Application Layer
- ✅ Keep it thin - just wiring
- ✅ Transform user inputs before passing to physics
- ✅ Don't put business logic here

## Future Enhancements

With this architecture, you can easily:
- Add 3D visualizations with Three.js
- Create a Node.js physics server
- Build a physics engine NPM package
- Create mobile apps with React Native
- Add WebGL accelerated rendering
- Run simulations in Web Workers
- Create a physics REST API
- Export simulation data for analysis
