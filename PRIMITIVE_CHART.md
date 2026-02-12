# Primitive Chart Interface

## Overview

The Primitive Chart Interface provides a simple, intuitive way to build custom visualizations using basic drawing primitives. It's designed with a minimalistic full-screen layout and uses a randomly-generated HSL color scheme for visual appeal.

## Getting Started

Open `chart.html` in your browser to access the primitive chart interface.

## Color Scheme

The interface automatically generates a color scheme using HSL colors with:
- **Random Hue**: A random hue (0-360°) is selected on page load
- **Fixed Saturation**: 50% for all colors
- **Contrast Lightness**: Background uses 20% lightness (dark), foreground and objects use 80% lightness (light)

The color scheme regenerates each time you reload the page.

## Available Drawing Commands

The `PrimitiveRenderer` class provides the following methods:

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
Adds a smooth curve through the given points using Catmull-Rom interpolation.
- `points`: Array of `{x, y}` coordinate objects
- `style`: Optional style object (stroke, strokeWidth, fill, opacity)

#### `addPath(pathData, style)`
Adds a custom SVG path.
- `pathData`: SVG path data string (e.g., "M 0 0 L 100 100")
- `style`: Optional style object (stroke, strokeWidth, fill, opacity)

#### `addWave(startX, centerY, width, amplitude, frequency, style)`
Adds a sine wave across the canvas.
- `startX`: Starting X position
- `centerY`: Center Y position (wave oscillates around this)
- `width`: Wave width
- `amplitude`: Wave amplitude (height of oscillation)
- `frequency`: Number of complete wave cycles
- `style`: Optional style object

#### `addQuantumWavePacket(centerX, centerY, time, options)`
Creates a visualization of a spreading quantum wave packet - perfect for demonstrating wave propagation.
- `centerX`, `centerY`: Center position
- `time`: Time parameter for animation
- `options`: Object with `initialSpread`, `wavelength`, `numWaves`, `maxAmplitude`

## Usage Example

```javascript
// Create renderer
const renderer = new PrimitiveRenderer('chart', {
    width: window.innerWidth,
    height: window.innerHeight
});

// Add some shapes
renderer.addCircle(100, 100, 50);
renderer.addLine(0, 0, 200, 200);
renderer.addWave(0, 300, 800, 50, 3);

// Add quantum wave packet
const waveIds = renderer.addQuantumWavePacket(400, 300, 0, {
    initialSpread: 100,
    wavelength: 20,
    numWaves: 5,
    maxAmplitude: 40
});
```

## Interactive Features

The `chart.html` interface includes:
- **Add Circle**: Adds a random circle
- **Add Line**: Adds a random line
- **Add Rectangle**: Adds a random rectangle
- **Add Wave**: Adds a sine wave across the screen
- **Quantum Wave**: Adds a quantum wave packet visualization
- **Clear**: Removes all shapes
- **Random Shapes**: Adds 10-30 random shapes
- **Animate**: Animates the quantum wave packet (if present)
- **Speed Slider**: Controls animation speed

## Building Custom Visualizations

To build custom visualizations like quantum wave propagation:

1. Create a `PrimitiveRenderer` instance
2. Use the drawing primitives to build your visualization
3. For animations, update element positions in an animation loop
4. Use `updateElement()` to modify existing elements
5. Use `removeElement()` and re-add to create smooth animations

## API Reference

### Utility Methods

- `updateElement(id, attributes)`: Update an element's attributes
- `removeElement(id)`: Remove an element by ID
- `clear()`: Remove all elements
- `resize(width, height)`: Resize the canvas
- `getColorScheme()`: Get the current color scheme

## Technical Details

- Built with D3.js v7
- Uses SVG for rendering
- Fully responsive design
- No dependencies other than D3.js
