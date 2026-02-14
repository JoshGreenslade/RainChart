/**
 * Main Application Entry Point
 * Generic simulation runner that works with any simulation through interfaces
 * 
 * This file is completely independent of concrete simulations.
 * Configure which simulation to run in app-config.js
 */

import { BaseRenderer } from './renderer/base-renderer.js';
import { AppConfig } from './app-config.js';

let simulation;
let simulationConfig;
let simulationControls;
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
document.addEventListener('DOMContentLoaded', async () => {
    await initSimulation();
});

/**
 * Initialize Simulation (Generic - works with any simulation)
 */
async function initSimulation() {
    // Dynamically import the simulation, config, and controls based on AppConfig
    const { simulation: simConfig } = AppConfig;
    
    // Load simulation module
    const SimulationModule = await import(simConfig.modulePath);
    const SimulationClass = SimulationModule[simConfig.className];
    
    // Load config module
    const ConfigModule = await import(simConfig.configPath);
    simulationConfig = ConfigModule[simConfig.configName];
    
    // Load controls module
    const ControlsModule = await import(simConfig.controlsPath);
    simulationControls = ControlsModule[simConfig.controlsName];
    
    // Get background color from config (if available)
    const backgroundColor = simulationConfig?.renderer?.backgroundColor;
    
    // Create base renderer with full window size
    const rendererModeElement = document.getElementById('renderer-mode');
    const renderMode = (rendererModeElement && rendererModeElement.value) || AppConfig.renderer.defaultMode;
    baseRenderer = new BaseRenderer(AppConfig.renderer.containerId, {
        width: window.innerWidth,
        height: window.innerHeight,
        renderMode: renderMode,
        background: backgroundColor,
    });
    
    // Update controls background to match color scheme
    updateControlsBackground();
    
    // Create simulation instance using configured parameters
    const params = simConfig.initialParams;
    simulation = new SimulationClass(
        window.innerWidth,
        window.innerHeight,
        params.bodyCount,
        params.G
    );
    
    // Connect simulation to renderer (using interface methods)
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
    
    // Connect UI controls (generic)
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
 * Setup UI control event handlers (Generic - works with any simulation)
 */
function setupUIControls() {
    // Iterate through all controls defined in the loaded simulation controls
    simulationControls.controls.forEach(control => {
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
 * Handle control actions (Generic - delegates to simulation interface methods)
 */
function handleControlAction(action, event) {
    switch (action) {
        // Standard interface actions that all simulations must support
        case 'start':
            simulation.start();
            break;
        
        case 'stop':
            simulation.stop();
            break;
        
        case 'reset': {
            // For reset, get the appropriate parameters from controls
            // This is generic - reads from any control that might affect reset
            const params = getResetParameters();
            simulation.reset(...params);
            break;
        }
        
        // setBodies action should trigger a reset with new body count
        case 'setBodies': {
            const bodyCount = parseControlValue(event.target.value, event.target.type);
            simulation.reset(bodyCount);
            break;
        }
        
        // Renderer mode is application-level, not simulation-specific
        case 'setRendererMode': {
            const renderMode = event.target.value;
            const backgroundColor = simulationConfig?.renderer?.backgroundColor;
            baseRenderer = new BaseRenderer(AppConfig.renderer.containerId, {
                width: window.innerWidth,
                height: window.innerHeight,
                renderMode: renderMode,
                background: backgroundColor
            });
            
            // Update background colors
            updateControlsBackground();
            
            // Re-render using interface method
            simulation.render(baseRenderer);
            break;
        }
        
        // For any other action, try to call it as a method on the simulation
        // This allows simulations to define custom actions (like setG, setTemperature, etc.)
        default: {
            // Check if the simulation has this method
            if (typeof simulation[action] === 'function') {
                // Extract the value from the event
                const value = event.target.value;
                // Find the corresponding control to get its type
                const control = simulationControls.controls.find(c => c.action === action);
                const controlType = control ? control.type : 'text';
                // Call the method with the parsed value
                const parsedValue = parseControlValue(value, controlType);
                simulation[action](parsedValue);
            } else {
                console.warn(`Unknown control action: ${action}, and simulation doesn't have method ${action}()`);
            }
            break;
        }
    }
}

/**
 * Get parameters for reset based on current control values
 * @returns {Array} Parameters to pass to simulation.reset()
 */
function getResetParameters() {
    // This is simulation-agnostic - looks for any controls that should be passed to reset
    const params = [];
    
    // Common pattern: find controls that have reset-related data
    // For example, bodyCount, particle count, etc.
    simulationControls.controls.forEach(control => {
        // Look for controls that might affect reset (e.g., body count, particle count)
        if (control.action === 'setBodies' || control.id.includes('bodies') || 
            control.id.includes('particles') || control.id.includes('count')) {
            const element = document.getElementById(control.id);
            if (element) {
                params.push(parseControlValue(element.value, control.type));
            }
        }
    });
    
    // If no specific parameters found, return empty array (reset with defaults)
    return params;
}

/**
 * Parse control value based on its type
 * @param {string} value - The value to parse
 * @param {string} type - The type of control
 * @returns {*} Parsed value
 */
function parseControlValue(value, type) {
    if (type === 'number') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return value;
}
