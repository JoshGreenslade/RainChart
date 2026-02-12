# Quick Start Guide

## Opening the Application

Simply open `index.html` in any modern web browser. No build step or server required!

## Using the Simulations

### Gravity Simulator
1. Click **Start** to begin the simulation
2. Watch as multiple bodies interact under gravitational forces
3. Adjust parameters:
   - **Bodies**: Number of gravitating objects (1-20)
   - **G Constant**: Gravitational constant (affects force strength)
4. Click **Stop** to pause, **Reset** to restart with new random positions

### Temperature Equalization
1. Click **Start** to watch heat diffuse along the bar
2. Hot regions (red/orange) gradually cool as heat spreads
3. Adjust parameters:
   - **Points**: Resolution of the bar (10-100)
   - **Diffusivity**: How quickly heat spreads (0.01-1.0)
4. Click **Stop** to pause, **Reset** to restart with initial conditions

### Trajectory Simulator
1. Set your desired initial conditions:
   - **Initial Velocity**: Launch speed (1-100 m/s)
   - **Angle**: Launch angle (0-90 degrees)
   - **Air Resistance**: Choose from:
     - **None (Vacuum)**: Classic parabolic path
     - **Linear**: F = -bv (light objects, low speeds)
     - **Quadratic**: F = -cv² (realistic for most projectiles)
   - **Drag Coefficient**: Strength of air resistance
2. Click **Launch** to fire the projectile
3. The trajectory path shows in blue (no resistance), red (linear), or orange (quadratic)
4. Click **Reset** to clear and try again

## Customizing the Appearance

Edit `styles/main.css` and modify the CSS variables at the top:

```css
:root {
    --primary-color: #2c3e50;      /* Header background */
    --secondary-color: #3498db;     /* Buttons and nav */
    --accent-color: #e74c3c;        /* Accents */
    --background-color: #ecf0f1;    /* Page background */
    --text-color: #2c3e50;          /* Text color */
    --border-color: #bdc3c7;        /* Borders */
    --chart-bg: #ffffff;            /* Chart backgrounds */
    --button-hover: #2980b9;        /* Button hover state */
}
```

Change these values to completely transform the look!

## Adding Your Own Simulation

See `ARCHITECTURE.md` for detailed instructions on extending the framework.

Basic steps:
1. Create a new physics simulator class (e.g., `js/my-sim.js`)
2. Add a renderer function to `js/chart-renderer.js`
3. Wire them together in `js/main.js`
4. Add UI controls to `index.html`

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires JavaScript enabled and HTML5 Canvas support.

## Troubleshooting

**Simulations not appearing:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Slow performance:**
- Reduce number of bodies in gravity sim
- Reduce number of points in temperature sim
- Close other browser tabs

**Strange behavior:**
- Click Reset to restore initial conditions
- Refresh the page for a full restart

## Next Steps

- Read `README.md` for project overview
- Read `ARCHITECTURE.md` to understand the code structure
- Explore the JavaScript files to see how simulations work
- Customize and extend with your own physics simulations!
