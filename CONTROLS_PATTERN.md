# Controls Pattern

## Overview

Each simulation defines its UI controls within its own folder, following the same pattern as configuration files. This makes simulations self-contained and easier to maintain.

The **main application layer** (`main.js`) is completely independent of concrete simulations and works through the `ISimulation` interface. It dynamically loads the simulation based on a single config path specified in `main.js`.

## Structure

Each simulation is fully self-contained with all metadata defined in its config file:

```
js/
├── main.js                    (Generic - points to simulation config)
└── physics-sims/
    └── Gravity/
        ├── gravity-simulation.js  (MVC controller)
        ├── gravity-engine.js       (Physics engine)
        ├── gravity-renderer.js     (Rendering logic)
        ├── gravity-config.js       (Config + module metadata)
        └── gravity-controls.js     (UI controls definition)
```

## Simulation Config Structure

Each simulation's config file contains both visual/physics configuration AND module loading metadata:

```javascript
export const GravityConfig = {
    // Module loading metadata - tells main.js how to load this simulation
    module: {
        name: 'Gravity',
        simulationPath: './gravity-simulation.js',
        simulationClass: 'GravitySimulation',
        controlsPath: './gravity-controls.js',
        controlsClass: 'GravityControls',
        initialParams: { bodyCount: 3, G: 1.0 },
        containerId: 'gravity-chart',
        defaultRenderMode: 'canvas'
    },
    
    // Visual configuration
    renderer: { /* ... */ },
    
    // Physics configuration
    engine: { /* ... */ }
};
```

## Control Definition Format

Controls are defined as an array of configuration objects:

```javascript
export const GravityControls = {
    controls: [
        {
            id: 'gravity-start',           // HTML element ID
            type: 'button',                 // Control type
            label: 'Start',                 // Display label
            action: 'start'                 // Action name
        },
        {
            id: 'gravity-bodies',
            type: 'number',
            label: 'Bodies',
            min: 1,
            max: 20,
            value: 3,
            action: 'setBodies'
        },
        {
            id: 'renderer-mode',
            type: 'select',
            label: 'Renderer',
            options: [
                { value: 'canvas', label: 'Canvas' },
                { value: 'svg', label: 'SVG' }
            ],
            value: 'canvas',
            action: 'setRendererMode'
        }
    ],

    // Helper methods
    getControl(id) {
        return this.controls.find(control => control.id === id);
    },

    getControlsByType(type) {
        return this.controls.filter(control => control.type === type);
    }
};
```

## Supported Control Types

- **`button`** - Action buttons (Start, Stop, Reset, etc.)
  - Properties: `id`, `type`, `label`, `action`
  
- **`number`** - Numeric input fields
  - Properties: `id`, `type`, `label`, `min`, `max`, `step`, `value`, `action`
  
- **`select`** - Dropdown menus
  - Properties: `id`, `type`, `label`, `options`, `value`, `action`

## Usage in Application Layer

The application layer (`main.js`) is **completely generic** and works with any simulation through interfaces. It points to a single simulation config path:

```javascript
// main.js - Single configuration point
const SIMULATION_CONFIG_PATH = './physics-sims/Gravity/gravity-config.js';

async function initSimulation() {
    // Load the simulation config
    const ConfigModule = await import(SIMULATION_CONFIG_PATH);
    const simulationConfig = ConfigModule.GravityConfig;
    
    // Config tells us how to load the simulation
    const { module } = simulationConfig;
    
    // Dynamically load simulation and controls
    const SimulationModule = await import(`${configBasePath}/${module.simulationPath}`);
    const ControlsModule = await import(`${configBasePath}/${module.controlsPath}`);
    
    // Create simulation using metadata from config
    const simulation = new SimulationModule[module.simulationClass](...);
    // ... (main.js has NO hardcoded references to specific simulations)
}
```

**Key Point**: `main.js` only needs to change ONE line (the config path) to switch simulations.
    // Create simulation and wire up controls generically
    // ... (main.js has NO hardcoded references to GravitySimulation)
}
```

**Key Point**: `main.js` only imports `BaseRenderer` and works through the `ISimulation` interface. All simulation-specific metadata is in the simulation's config file.

## Benefits

1. **Self-Contained Simulations**: Each simulation folder contains everything it needs including loading metadata
2. **Consistent Pattern**: Module metadata lives with simulation config
3. **Easy to Extend**: Adding new controls is simple and declarative
4. **Better Organization**: Control definitions live with the simulation code
5. **Reusability**: Controls can be queried and manipulated programmatically
6. **Complete Decoupling**: Main application is 100% independent of concrete simulations
7. **Interface-Driven**: Main.js works through ISimulation interface only
8. **Single Configuration Point**: Only change one line in main.js to switch simulations

## Switching Simulations

To switch to a different simulation, simply change ONE line in `main.js`:

```javascript
// In main.js, change this line:
const SIMULATION_CONFIG_PATH = './physics-sims/Temperature/temperature-config.js';
```

**That's it!** No other changes needed.

## Adding Controls to a New Simulation

When creating a new simulation, follow these steps:

1. **Create the config file with module metadata**: `js/physics-sims/YourSim/yoursim-config.js`

```javascript
export const YourSimConfig = {
    // Module loading metadata
    module: {
        name: 'YourSim',
        simulationPath: './yoursim-simulation.js',
        simulationClass: 'YourSimSimulation',
        controlsPath: './yoursim-controls.js',
        controlsClass: 'YourSimControls',
        initialParams: { /* your params */ },
        containerId: 'yoursim-chart',
        defaultRenderMode: 'canvas'
    },
    // ... renderer and engine config
};
```

2. **Create the controls file**: `js/physics-sims/YourSim/yoursim-controls.js`
```javascript
export const YourSimControls = {
    controls: [
        {
            id: 'yoursim-start',
            type: 'button',
            label: 'Start',
            action: 'start'
        },
        // ... more controls
    ],
    
    getControl(id) {
        return this.controls.find(control => control.id === id);
    }
};
```

3. **Export from main module** (rainchart.js):
```javascript
export { YourSimControls } from './physics-sims/YourSim/yoursim-controls.js';
```

4. **Use in application layer** (main.js):
```javascript
import { YourSimControls } from './physics-sims/YourSim/yoursim-controls.js';

// Set up controls using the definition
YourSimControls.controls.forEach(control => {
    // Wire up event handlers
});
```

## HTML Elements

The HTML still defines the actual UI elements (in index.html), but their IDs must match the control definitions:

```html
<div id="controls">
    <button id="gravity-start">Start</button>
    <button id="gravity-stop">Stop</button>
    <label>
        Bodies:
        <input type="number" id="gravity-bodies" min="1" max="20" value="3">
    </label>
</div>
```

This separation keeps the visual presentation (HTML/CSS) separate from the control logic (JavaScript), while maintaining a clear connection through IDs.
