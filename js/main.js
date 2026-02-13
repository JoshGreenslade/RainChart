/**
 * Main Application Entry Point
 * Gravity Simulation using Base Renderer
 */

import { BaseRenderer } from './renderer/base-renderer.js';
import { GravitySimulation } from './physics-sims/gravity-simulation.js';

let gravitySimulation;
let baseRenderer;

/**
 * Helper function to convert HSL color to HSLA with transparency
 */
function toTransparentColor(hslColor, alpha = 0.85) {
    // Check if color is already in HSL format
    if (hslColor && hslColor.includes('hsl')) {
        return hslColor.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
    }
    // Fallback to default dark transparent background
    return `rgba(0, 0, 0, ${alpha})`;
}

// Initialize simulation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGravitySimulation();
});

/**
 * Initialize Gravity Simulation
 */
function initGravitySimulation() {
    // Create base renderer with full window size
    const renderMode = document.getElementById('renderer-mode').value;
    baseRenderer = new BaseRenderer('gravity-chart', {
        width: window.innerWidth,
        height: window.innerHeight,
        renderMode: renderMode
    });
    
    // Update controls background to match color scheme
    updateControlsBackground();
    
    // Create simulation (MVC controller)
    gravitySimulation = new GravitySimulation(window.innerWidth, window.innerHeight, 3, 1.0);
    
    // Connect simulation to renderer
    gravitySimulation.onUpdate((state) => {
        gravitySimulation.render(baseRenderer);
    });
    
    // Initial render
    gravitySimulation.notifyListeners();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        baseRenderer.resize(window.innerWidth, window.innerHeight);
        gravitySimulation.setDimensions(window.innerWidth, window.innerHeight);
    });
    
    // Connect UI controls
    setupUIControls();
}

/**
 * Update controls background to match color scheme
 */
function updateControlsBackground() {
    const controls = document.getElementById('controls');
    const info = document.getElementById('info');
    const scheme = baseRenderer.getColorScheme();
    
    // Use the background color with transparency for controls
    const controlsBg = toTransparentColor(scheme.background);
    controls.style.background = controlsBg;
    info.style.background = controlsBg;
}

/**
 * Setup UI control event handlers
 */
function setupUIControls() {
    document.getElementById('gravity-start').addEventListener('click', () => {
        gravitySimulation.start();
    });
    
    document.getElementById('gravity-stop').addEventListener('click', () => {
        gravitySimulation.stop();
    });
    
    document.getElementById('gravity-reset').addEventListener('click', () => {
        const bodyCount = parseInt(document.getElementById('gravity-bodies').value);
        gravitySimulation.reset(bodyCount);
    });
    
    document.getElementById('gravity-constant').addEventListener('change', (e) => {
        gravitySimulation.setG(parseFloat(e.target.value));
    });
    
    document.getElementById('gravity-bodies').addEventListener('change', (e) => {
        const bodyCount = parseInt(e.target.value);
        gravitySimulation.reset(bodyCount);
    });
    
    // Renderer mode change
    document.getElementById('renderer-mode').addEventListener('change', (e) => {
        const renderMode = e.target.value;
        baseRenderer = new BaseRenderer('gravity-chart', {
            width: window.innerWidth,
            height: window.innerHeight,
            renderMode: renderMode
        });
        
        // Update background colors
        updateControlsBackground();
        
        // Re-render
        gravitySimulation.render(baseRenderer);
    });
}
