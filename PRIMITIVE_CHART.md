# Primitive Drawing Interface

## Overview

The Primitive Drawing Interface provides a simple, intuitive way to build custom visualizations using basic drawing primitives. It supports both **SVG** (via D3.js) and **Canvas** rendering modes, designed with a minimalistic full-screen layout and uses a randomly-generated HSL color scheme for visual appeal.

## Getting Started

Open `chart.html` in your browser to access the primitive drawing interface.

## Rendering Modes

The renderer supports two modes:
- **SVG Mode**: Uses D3.js for vector graphics (default)
- **Canvas Mode**: Uses HTML5 Canvas for raster graphics

Switch between modes using the "Renderer" dropdown in the interface.

## Color Scheme

The interface automatically generates a color scheme using HSL colors with:
- **Random Hue**: A random hue (0-360°) is selected on page load
- **Fixed Saturation**: 50% for all colors
- **Contrast Lightness**: Background uses 20% lightness (dark), foreground and objects use 80% lightness (light)

The color scheme regenerates each time you reload the page.

## Available Drawing Commands

The `BaseRenderer` class provides the following methods:

### Basic Shapes

#### `addCircle(x, y, radius, style)`
Adds a circle to the canvas.
- `x`, `y`: Center coordinates
- `radius`: Circle radius
- `style`: Optional style object (fill, stroke, strokeWidth, opacity)

#### `addLine(x1, y1, x2, y2, style)`
Adds a straight line to the canvas.
- `x1`, `y1`: Start point coordinates
- `x2`, `y2`: End point coordinates
- `style`: Optional style object (stroke, strokeWidth, opacity)

#### `addRectangle(x, y, width, height, style)`
Adds a rectangle to the canvas.
- `x`, `y`: Top-left corner coordinates
- `width`, `height`: Rectangle dimensions
- `style`: Optional style object (fill, stroke, strokeWidth, opacity)

### Advanced Shapes

#### `addCurve(points, style)`
Adds a smooth curve through the given points using Catmull-Rom interpolation (SVG) or line segments (Canvas).
- `points`: Array of `{x, y}` coordinate objects
- `style`: Optional style object (stroke, strokeWidth, fill, opacity)

#### `addPath(pathData, style)`
Adds a custom path (SVG path string for SVG mode, Path2D for Canvas mode).
- `pathData`: SVG path data string (e.g., "M 0 0 L 100 100")
- `style`: Optional style object (stroke, strokeWidth, fill, opacity)

#### `addAxis(type, position, min, max, options)`
Adds an axis (X or Y) with tick marks and labels.
- `type`: 'x' or 'y'
- `position`: Position of the axis (Y coordinate for X-axis, X coordinate for Y-axis)
- `min`: Minimum value on the axis
- `max`: Maximum value on the axis
- `options`: Optional configuration (ticks, showLabels, labelOffset, tickLength, stroke, strokeWidth, fontSize)

## Usage Example

```javascript
// Create renderer with SVG mode (default)
const renderer = new BaseRenderer('chart', {
    width: window.innerWidth,
    height: window.innerHeight,
    renderMode: 'svg' // or 'canvas'
});

// Add some shapes
renderer.addCircle(100, 100, 50);
renderer.addLine(0, 0, 200, 200);
renderer.addWave(0, 300, 800, 50, 3);

// Add an axis
renderer.addAxis('x', 300, 0, 100, { ticks: 10 });
```

## Interactive Features

The `chart.html` interface includes:
- **Add Circle**: Adds a random circle
- **Add Line**: Adds a random line
- **Add Rectangle**: Adds a random rectangle
- **Add Curve**: Adds a smooth curve through random points
- **Add Axis**: Adds an X or Y axis with labels
- **Clear**: Removes all shapes
- **Random Shapes**: Adds 10-30 random shapes
- **Renderer Dropdown**: Switch between SVG and Canvas rendering modes

## Building Custom Visualizations

To build custom visualizations:

1. Create a `PrimitiveRenderer` instance with your preferred rendering mode
2. Use the drawing primitives to build your visualization
3. For animations, redraw the canvas or use SVG updates
4. Use `updateElement()` to modify existing elements (SVG mode)
5. Use `removeElement()` to remove elements (SVG mode)

## API Reference

### Utility Methods

- `updateElement(id, attributes)`: Update an element's attributes (SVG mode only)
- `removeElement(id)`: Remove an element by ID (SVG mode only)
- `clear()`: Remove all elements
- `resize(width, height)`: Resize the canvas
- `getColorScheme()`: Get the current color scheme

## Technical Details

- Supports both SVG (via D3.js v7) and HTML5 Canvas rendering
- SVG mode: Vector graphics with D3.js manipulation
- Canvas mode: Raster graphics with immediate mode rendering
- Fully responsive design
- D3.js required only for SVG mode

## File Organization

```
js/
├── renderer/
│   ├── primitive-renderer.js  (Primitive drawing interface)
│   ├── canvas-renderer.js     (Canvas renderer for physics sims)
│   ├── d3-renderer.js         (D3 renderer for physics sims)
│   ├── renderer-adapter.js    (Renderer factory)
│   └── chart-config.js        (Configuration)
├── physics-sims/
│   ├── physics-engine.js
│   ├── gravity-sim.js
│   ├── temperature-sim.js
│   └── trajectory-sim.js
└── integrators/
    └── integrators.js
```
