/**
 * Main Application Entry Point
 * Gravity Simulation using Base Renderer
 */

import { BaseRenderer } from './renderer/base-renderer.js';
import { GravitySimulation } from './physics-sims/Gravity/gravity-simulation.js';
import { GravityConfig } from './physics-sims/Gravity/gravity-config.js';
import { GravityControls } from './physics-sims/Gravity/gravity-controls.js';

let simulation;
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
    // Get background color from config
    const backgroundColor = GravityConfig.renderer.backgroundColor;
    
    // Create base renderer with full window size
    const renderMode = document.getElementById('renderer-mode').value;
    baseRenderer = new BaseRenderer('gravity-chart', {
        width: window.innerWidth,
        height: window.innerHeight,
        renderMode: renderMode,
        background: backgroundColor,
    });
    
    // Update controls background to match color scheme
    updateControlsBackground();
    
    // Create simulation (MVC controller) - using interface
    simulation = new GravitySimulation(window.innerWidth, window.innerHeight, 3, 1.0);
    
    // Connect simulation to renderer
    simulation.onUpdate((state) => {
        simulation.render(baseRenderer);
    });
    
    // Initial render
    simulation.notifyListeners();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        baseRenderer.resize(window.innerWidth, window.innerHeight);
        simulation.setDimensions(window.innerWidth, window.innerHeight);
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
 * Setup UI control event handlers using control definitions from GravityControls
 */
function setupUIControls() {
    // Iterate through all controls defined in GravityControls
    GravityControls.controls.forEach(control => {
        const element = document.getElementById(control.id);
        if (!element) {
            console.warn(`Control element with id '${control.id}' not found in DOM`);
            return;
        }

        // Determine the event type based on control type
        const eventType = control.type === 'button' ? 'click' : 'change';

        // Add event listener based on the action defined in the control
        element.addEventListener(eventType, (e) => {
            handleControlAction(control.action, e);
        });
    });
}

/**
 * Handle control actions
 */
function handleControlAction(action, event) {
    switch (action) {
        case 'start':
            simulation.start();
            break;
        
        case 'stop':
            simulation.stop();
            break;
        
        case 'reset': {
            // Read current body count from the bodies control
            const bodiesControl = GravityControls.getControl('gravity-bodies');
            const bodyCountElement = document.getElementById(bodiesControl.id);
            const bodyCount = parseInt(bodyCountElement.value);
            simulation.reset(bodyCount);
            break;
        }
        
        case 'setG':
            simulation.setG(parseFloat(event.target.value));
            break;
        
        case 'setBodies': {
            const bodyCount = parseInt(event.target.value);
            simulation.reset(bodyCount);
            break;
        }
        
        case 'setRendererMode':
            const renderMode = event.target.value;
            const backgroundColor = GravityConfig.renderer.backgroundColor;
            baseRenderer = new BaseRenderer('gravity-chart', {
                width: window.innerWidth,
                height: window.innerHeight,
                renderMode: renderMode,
                background: backgroundColor
            });
            
            // Update background colors
            updateControlsBackground();
            
            // Re-render
            simulation.render(baseRenderer);
            break;
        
        default:
            console.warn(`Unknown control action: ${action}`);
    }
}
