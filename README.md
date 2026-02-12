# RainChart

Interactive physics simulations rendered in the browser with highly customizable visualizations.

## Overview

This project provides a collection of interactive physics simulations that can be viewed in a web browser. The architecture is designed with a **clear separation between physics calculations and visualization**, allowing each layer to be developed and maintained independently.

## Architecture

The project is structured in three distinct layers:

### 1. Physics Layer (Pure JavaScript - No Dependencies)
Location: `js/*-sim.js` and `js/physics-engine.js`

- **`physics-engine.js`**: Core physics calculations (gravity, heat diffusion, projectile motion)
- **`gravity-sim.js`**: Gravity simulation logic
- **`temperature-sim.js`**: Heat equalization simulation logic
- **`trajectory-sim.js`**: Projectile trajectory simulation logic

**Key Characteristics:**
- Zero dependencies on visualization libraries
- Pure data output (no rendering logic)
- Observer pattern for state updates
- Can be extracted to a separate repository

### 2. Visualization Layer (HTML5 Canvas or D3.js)
Location: `js/chart-renderer.js`

- Consumes pure physics data through a clean interface
- Currently implemented with HTML5 Canvas (no external dependencies)
- Can easily be replaced with D3.js, Three.js, or other visualization libraries
- Highly customizable styling through CSS variables
- Can be swapped with other charting libraries

**Note:** The current implementation uses Canvas to avoid external dependencies. To use D3.js instead, simply rewrite `chart-renderer.js` - no changes needed to physics code!

### 3. Application Layer
Location: `js/main.js`

- Connects physics simulations to chart renderers
- Handles UI interactions
- Manages simulation lifecycle

## Features

### Included Simulations

1. **Gravity Simulator**
   - Multi-body gravitational interactions
   - Configurable gravitational constant
   - Variable number of bodies
   - Real-time visualization

2. **Temperature Equalization**
   - Heat diffusion along a 1D bar
   - Configurable thermal diffusivity
   - Variable spatial resolution
   - Color-coded temperature visualization

3. **Trajectory Simulator**
   - Projectile motion simulation
   - Three air resistance modes:
     - None (vacuum)
     - Linear drag
     - Quadratic drag
   - Configurable initial conditions

## Customization

### Styling

All visual styling is controlled through CSS variables in `styles/main.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --background-color: #ecf0f1;
    --text-color: #2c3e50;
    --border-color: #bdc3c7;
    --chart-bg: #ffffff;
    --button-hover: #2980b9;
}
```

Simply modify these variables to change the entire look and feel.

### Physics Parameters

Each simulation exposes parameters through the UI:
- Gravity: body count, gravitational constant
- Temperature: number of points, thermal diffusivity
- Trajectory: velocity, angle, air resistance type, drag coefficient

### Adding New Simulations

1. **Create Physics Module**: Implement simulation logic in a new file (e.g., `js/new-sim.js`)
   - Extend with state management and observer pattern
   - Keep it independent of visualization libraries

2. **Create Renderer**: Add rendering function to `js/chart-renderer.js`
   - Consume pure physics data
   - Use D3.js for visualization

3. **Connect in main.js**: Wire up the simulation and renderer

## Usage

Simply open `index.html` in a modern web browser. No build step required.

## Future Plans

- Extract physics layer to separate repository
- Add more simulations (waves, electromagnetism, etc.)
- Support for 3D visualizations
- Export simulation data

## License

MIT