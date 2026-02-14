# Controls Pattern

## Overview

Each simulation defines its UI controls within its own folder, following the same pattern as configuration files. This makes simulations self-contained and easier to maintain.

The **main application layer** (`main.js`) is completely independent of concrete simulations and works through defined interfaces. It dynamically loads the simulation based on a single config path specified in `main.js`.

## Interface Requirements

All simulations must implement these interfaces to work with main.js:

1. **`ISimulation`** - Simulation class must extend this interface
2. **`ISimulationEngine`** - Engine class must extend this interface  
3. **`ISimulationConfig`** - Config object must follow this structure
4. **`ISimulationControls`** - Controls object must follow this structure

These interfaces ensure **any simulation will work with main.js** without modifications.

## Structure

Each simulation is fully self-contained with all metadata defined in its config file:

```
js/
├── main.js                           (Generic - points to simulation config)
└── physics-sims/
    ├── simulation-interface.js       (ISimulation - interface for simulations)
    ├── engine-interface.js           (ISimulationEngine - interface for engines)
    ├── config-interface.js           (ISimulationConfig - interface for configs)
    ├── controls-interface.js         (ISimulationControls - interface for controls)
    └── Gravity/
        ├── gravity-simulation.js     (extends ISimulation)
        ├── gravity-engine.js          (extends ISimulationEngine)
        ├── gravity-renderer.js        (Rendering logic)
        ├── gravity-config.js          (implements ISimulationConfig)
        └── gravity-controls.js        (implements ISimulationControls)
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

**Key Point**: `main.js` validates all loaded modules against interfaces, ensuring any simulation that implements the interfaces will work correctly.

## Benefits

1. **Self-Contained Simulations**: Each simulation folder contains everything it needs including loading metadata
2. **Consistent Pattern**: Module metadata lives with simulation config
3. **Easy to Extend**: Adding new controls is simple and declarative
4. **Better Organization**: Control definitions live with the simulation code
5. **Reusability**: Controls can be queried and manipulated programmatically
6. **Complete Decoupling**: Main application is 100% independent of concrete simulations
7. **Interface-Driven**: All components implement interfaces for guaranteed compatibility
8. **Single Configuration Point**: Only change one line in main.js to switch simulations
9. **Type Safety**: Interfaces enforce structure and throw errors if requirements not met

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
import { ISimulationConfig } from '../config-interface.js';

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
    renderer: { /* visual config */ },
    engine: { /* physics config */ }
};

// Validate config implements the interface
ISimulationConfig.validate(YourSimConfig);
```

2. **Create the controls file**: `js/physics-sims/YourSim/yoursim-controls.js`

```javascript
import { ISimulationControls } from '../controls-interface.js';

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
    },
    
    getControlsByType(type) {
        return this.controls.filter(control => control.type === type);
    }
};

// Validate controls implements the interface
ISimulationControls.validate(YourSimControls);
```

3. **Create the engine class**: `js/physics-sims/YourSim/yoursim-engine.js`

```javascript
import { ISimulationEngine } from '../engine-interface.js';

export class YourSimEngine extends ISimulationEngine {
    constructor(width, height, ...params) {
        super();
        // Your engine implementation
    }
    
    initialize(...args) { /* implement */ }
    reset(...args) { /* implement */ }
    step() { /* implement */ }
    getState() { /* implement */ }
    setDimensions(width, height) { /* implement */ }
}
```

4. **Create the simulation class**: `js/physics-sims/YourSim/yoursim-simulation.js`

```javascript
import { ISimulation } from '../simulation-interface.js';

export class YourSimSimulation extends ISimulation {
    constructor(width, height, ...params) {
        super();
        // Your simulation implementation
    }
    
    // Implement all ISimulation methods
}
```

5. **Export from main module** (rainchart.js):

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
