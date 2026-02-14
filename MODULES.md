# RainChart ES6 Module System

RainChart has been modularized using ES6 modules with complete separation between the application layer and concrete simulations.

## Architecture

The application follows a **clean architecture** pattern:

- **`main.js`** - Generic simulation runner (works with ANY simulation through ISimulation interface)
- **`app-config.js`** - Configuration specifying which simulation to load
- **Simulation modules** - Self-contained folders with simulation, engine, renderer, config, and controls

**Key principle**: `main.js` has NO hardcoded dependencies on specific simulations. It dynamically loads simulations based on `app-config.js` and works purely through the `ISimulation` interface.

## Switching Simulations

To run a different simulation, simply edit `app-config.js`:

```javascript
export const AppConfig = {
    simulation: {
        name: 'Gravity',  // Change this
        modulePath: './physics-sims/Gravity/gravity-simulation.js',
        className: 'GravitySimulation',
        // ... config and controls paths
        initialParams: { bodyCount: 3, G: 1.0 }
    }
};
```

No changes to `main.js` or `index.html` required!

## Using RainChart Modules

### Option 1: Import from the Main Module (Recommended)

The easiest way to use RainChart is to import from the main module file:

```javascript
import { 
    BaseRenderer,
    GravitySimulation,
    ColorScheme
} from './js/rainchart.js';

// Use the imports
const renderer = new BaseRenderer('my-container', {
    width: 800,
    height: 600,
    renderMode: 'svg' // or 'canvas'
});

const simulation = new GravitySimulation(800, 600, 3, 1.0);
```

### Option 2: Import Specific Modules

You can also import directly from specific module files:

```javascript
// Import renderer modules
import { BaseRenderer } from './js/renderer/base-renderer.js';
import { CanvasRenderer } from './js/renderer/canvas-renderer.js';
import { D3Renderer } from './js/renderer/d3-renderer.js';
import { ColorScheme } from './js/renderer/color-scheme.js';

// Import application configuration
import { AppConfig } from './js/app-config.js';

// Import physics modules
import { GravitySimulation } from './js/physics-sims/Gravity/gravity-simulation.js';
import { GravityEngine } from './js/physics-sims/Gravity/gravity-engine.js';
import { GravityConfig } from './js/physics-sims/Gravity/gravity-config.js';
import { GravityControls } from './js/physics-sims/Gravity/gravity-controls.js';

// Import utilities
import { Integrators } from './js/integrators/integrators.js';
import { ChartConfig } from './js/renderer/chart-config.js';
```

## Available Modules

### Application Configuration

- **`AppConfig`** (`js/app-config.js`) - Specifies which simulation to load and run

### Renderer Modules (`js/renderer/`)

- **`BaseRenderer`** - Main renderer interface (delegates to Canvas or D3)
- **`CanvasRenderer`** - HTML5 Canvas implementation
- **`D3Renderer`** - D3.js/SVG implementation
- **`ColorScheme`** - Color scheme generation utility
- **`ChartConfig`** - Configuration system for visual styling

### Physics Simulation Modules (`js/physics-sims/`)

- **`ISimulation`** - Base interface for all simulations (main.js works through this interface only)
- **Gravity Simulation** (`js/physics-sims/Gravity/`):
  - **`GravitySimulation`** - Gravity simulation controller
  - **`GravityEngine`** - Physics engine for gravity calculations
  - **`GravityRenderer`** - Rendering logic for gravity visualization
  - **`GravityConfig`** - Configuration for gravity simulation
  - **`GravityControls`** - UI control definitions for gravity simulation

### Utility Modules

- **`Integrators`** (`js/integrators/integrators.js`) - Numerical integration methods

## HTML Integration

To use modules in your HTML file, add `type="module"` to your script tag:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My RainChart App</title>
</head>
<body>
    <div id="chart"></div>
    
    <!-- Load D3.js if using SVG renderer -->
    <script src="lib/d3.v7.min.js"></script>
    
    <!-- Your module script -->
    <script type="module">
        import { BaseRenderer, GravitySimulation } from './js/rainchart.js';
        
        const renderer = new BaseRenderer('chart', {
            width: window.innerWidth,
            height: window.innerHeight,
            renderMode: 'canvas'
        });
        
        const simulation = new GravitySimulation(
            window.innerWidth, 
            window.innerHeight, 
            3,  // number of bodies
            1.0 // gravitational constant
        );
        
        simulation.onUpdate(() => {
            simulation.render(renderer);
        });
        
        simulation.start();
    </script>
</body>
</html>
```

## External Script Example

You can also create a separate module file:

**my-app.js:**
```javascript
import { BaseRenderer, GravitySimulation } from './js/rainchart.js';

export function initApp(containerId, options = {}) {
    const renderer = new BaseRenderer(containerId, {
        width: options.width || 800,
        height: options.height || 600,
        renderMode: options.renderMode || 'svg'
    });
    
    const simulation = new GravitySimulation(
        options.width || 800,
        options.height || 600,
        options.bodies || 3,
        options.G || 1.0
    );
    
    simulation.onUpdate(() => {
        simulation.render(renderer);
    });
    
    return { renderer, simulation };
}
```

**index.html:**
```html
<script type="module">
    import { initApp } from './my-app.js';
    
    const { simulation } = initApp('chart', {
        width: window.innerWidth,
        height: window.innerHeight,
        bodies: 5,
        renderMode: 'canvas'
    });
    
    simulation.start();
</script>
```

## Benefits

1. **No Loading Order Dependencies** - The browser automatically resolves import dependencies
2. **Tree Shaking** - Only load what you need
3. **Better IDE Support** - Improved autocomplete and type hints
4. **Namespace Isolation** - No global scope pollution
5. **Easier Testing** - Modules can be imported and tested independently
6. **Future Ready** - Standard ES6 module format

## Browser Compatibility

ES6 modules are supported in all modern browsers:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

For older browsers, you can use a bundler like Webpack or Rollup to create a compatible build.

## Notes

- Module scripts are always in strict mode
- Module scripts are deferred by default
- D3.js must be loaded before using the D3Renderer (load it as a regular script, not a module)
- Relative paths in imports must include the `.js` extension
