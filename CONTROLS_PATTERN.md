# Controls Pattern

## Overview

Each simulation defines its UI controls within its own folder, following the same pattern as configuration files. This makes simulations self-contained and easier to maintain.

The **main application layer** (`main.js`) is completely independent of concrete simulations and works through the `ISimulation` interface. It dynamically loads the simulation, config, and controls based on `app-config.js`.

## Structure

Controls are defined in a `{simulation}-controls.js` file within each simulation folder, following this pattern:

```
js/
├── app-config.js              (Specifies which simulation to load)
├── main.js                    (Generic - works with any simulation via interfaces)
└── physics-sims/
    └── Gravity/
        ├── gravity-simulation.js  (MVC controller)
        ├── gravity-engine.js       (Physics engine)
        ├── gravity-renderer.js     (Rendering logic)
        ├── gravity-config.js       (Visual/physics config)
        └── gravity-controls.js     (UI controls definition)
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

The application layer (`main.js`) is **completely generic** and works with any simulation through interfaces. It dynamically loads the simulation based on `app-config.js`:

```javascript
// app-config.js - Configure which simulation to run
export const AppConfig = {
    simulation: {
        name: 'Gravity',
        modulePath: './physics-sims/Gravity/gravity-simulation.js',
        className: 'GravitySimulation',
        configPath: './physics-sims/Gravity/gravity-config.js',
        configName: 'GravityConfig',
        controlsPath: './physics-sims/Gravity/gravity-controls.js',
        controlsName: 'GravityControls',
        initialParams: { bodyCount: 3, G: 1.0 }
    }
};

// main.js - Generic, works with any simulation
import { AppConfig } from './app-config.js';

async function initSimulation() {
    // Dynamically import simulation, config, and controls
    const SimulationModule = await import(AppConfig.simulation.modulePath);
    const SimulationClass = SimulationModule[AppConfig.simulation.className];
    
    const ConfigModule = await import(AppConfig.simulation.configPath);
    const simulationConfig = ConfigModule[AppConfig.simulation.configName];
    
    const ControlsModule = await import(AppConfig.simulation.controlsPath);
    const simulationControls = ControlsModule[AppConfig.simulation.controlsName];
    
    // Create simulation and wire up controls generically
    // ... (main.js has NO hardcoded references to GravitySimulation)
}
```

**Key Point**: `main.js` has NO imports of concrete simulations. It only imports `BaseRenderer`, `AppConfig`, and works through the `ISimulation` interface.

## Benefits

1. **Self-Contained Simulations**: Each simulation folder contains everything it needs
2. **Consistent Pattern**: Same approach as config files (gravity-config.js)
3. **Easy to Extend**: Adding new controls is simple and declarative
4. **Better Organization**: Control definitions live with the simulation code
5. **Reusability**: Controls can be queried and manipulated programmatically
6. **Complete Decoupling**: Main application is 100% independent of concrete simulations
7. **Interface-Driven**: Main.js works through ISimulation interface only
8. **Simple Configuration**: Switch simulations by editing app-config.js

## Switching Simulations

To switch to a different simulation, simply update `app-config.js`:

```javascript
export const AppConfig = {
    simulation: {
        name: 'Temperature',
        modulePath: './physics-sims/Temperature/temperature-simulation.js',
        className: 'TemperatureSimulation',
        configPath: './physics-sims/Temperature/temperature-config.js',
        configName: 'TemperatureConfig',
        controlsPath: './physics-sims/Temperature/temperature-controls.js',
        controlsName: 'TemperatureControls',
        initialParams: { points: 50, diffusivity: 0.1 }
    }
};
```

**No changes to main.js required!**

## Adding Controls to a New Simulation

When creating a new simulation, follow these steps:

1. **Create the controls file**: `js/physics-sims/YourSim/yoursim-controls.js`

2. **Define your controls**:
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
