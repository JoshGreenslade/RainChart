/**
 * Main Application Entry Point
 * Generic simulation runner that works with any simulation through interfaces
 * 
 * This file is completely independent of concrete simulations.
 * To switch simulations, change the SIMULATION_CONFIG_PATH below.
 * 
 * All simulations must implement:
 * - ISimulation (simulation class)
 * - ISimulationEngine (engine class)
 * - ISimulationConfig (config object structure)
 * - ISimulationControls (controls object structure)
 */

import { BaseRenderer } from './renderer/base-renderer.js';
import { ISimulationConfig } from './physics-sims/config-interface.js';
import { ISimulationControls } from './physics-sims/controls-interface.js';

// ============================================================================
// CONFIGURATION: Change this path to switch simulations
// ============================================================================
const SIMULATION_CONFIG_PATH = './physics-sims/Gravity/gravity-config.js';
// ============================================================================

let simulation;
let simulationConfig;
let simulationControls;
let baseRenderer;

/**
 * Show a temporary notification to the user
 * @param {string} message - The notification message
 * @param {string} type - Type of notification ('info' or 'warning')
 * @param {number} duration - Duration in milliseconds (0 = persistent)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 16px;
        background: ${type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        font-family: system-ui, sans-serif;
        font-size: 14px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

/**
 * Show loading indicator for WebGPU initialization
 * @param {string} containerId - The container to append the loading indicator to
 * @returns {HTMLElement} The loading indicator element
 */
function showLoadingIndicator(containerId) {
    const container = document.getElementById(containerId);
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'renderer-loading';
    loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-family: monospace;
        font-size: 14px;
        background: rgba(0,0,0,0.7);
        padding: 20px;
        border-radius: 8px;
    `;
    loadingDiv.textContent = 'Initializing WebGPU...';
    container.appendChild(loadingDiv);
    return loadingDiv;
}

/**
 * Remove loading indicator
 * @param {HTMLElement} loadingDiv - The loading indicator element to remove
 */
function removeLoadingIndicator(loadingDiv) {
    if (loadingDiv && loadingDiv.parentNode) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
}

/**
 * Initialize renderer with loading indicator and fallback support
 * @param {string} containerId - Container element ID
 * @param {string} renderMode - Desired render mode ('canvas', 'svg', 'webgpu')
 * @param {*} backgroundColor - Background color
 * @returns {Promise<BaseRenderer>} Initialized renderer
 */
async function initializeRendererWithFallback(containerId, renderMode, backgroundColor) {
    let renderer = new BaseRenderer(containerId, {
        width: window.innerWidth,
        height: window.innerHeight,
        renderMode: renderMode,
        background: backgroundColor,
    });
    
    // Show loading state for WebGPU (Canvas/SVG are instant)
    let loadingDiv = null;
    if (renderMode === 'webgpu') {
        loadingDiv = showLoadingIndicator(containerId);
    }
    
    try {
        await renderer.waitForReady();
        if (loadingDiv) {
            removeLoadingIndicator(loadingDiv);
        }
        return renderer;
    } catch (err) {
        if (loadingDiv) {
            removeLoadingIndicator(loadingDiv);
        }
        
        console.error('Renderer initialization failed:', err);
        
        // If WebGPU failed, fall back to Canvas
        if (renderMode === 'webgpu') {
            console.warn('Falling back to Canvas renderer');
            
            showNotification(
                'WebGPU not available - using Canvas mode instead. ' +
                'For best performance with 10k+ objects, use a WebGPU-compatible browser.',
                'warning',
                5000
            );
            
            // Recreate renderer in Canvas mode
            renderer = new BaseRenderer(containerId, {
                width: window.innerWidth,
                height: window.innerHeight,
                renderMode: 'canvas',
                background: backgroundColor,
            });
            
            // Update dropdown to reflect actual mode
            const rendererModeElement = document.getElementById('renderer-mode');
            if (rendererModeElement) {
                rendererModeElement.value = 'canvas';
            }
            
            return renderer;
        }
        
        // For other renderers, re-throw the error
        throw err;
    }
}

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
    // Load the simulation config module
    const ConfigModule = await import(SIMULATION_CONFIG_PATH);
    const configName = Object.keys(ConfigModule).find(key => key.endsWith('Config'));
    simulationConfig = ConfigModule[configName];
    
    // Validate config implements ISimulationConfig interface
    ISimulationConfig.validate(simulationConfig);
    
    // Get the base path of the config file for resolving relative paths
    const configBasePath = SIMULATION_CONFIG_PATH.substring(0, SIMULATION_CONFIG_PATH.lastIndexOf('/'));
    
    // Extract module loading metadata from the config
    const { module: moduleConfig } = simulationConfig;
    
    // Resolve relative paths from the config file location
    const simulationPath = `${configBasePath}/${moduleConfig.simulationPath}`;
    const controlsPath = `${configBasePath}/${moduleConfig.controlsPath}`;
    
    // Load simulation module
    const SimulationModule = await import(simulationPath);
    const SimulationClass = SimulationModule[moduleConfig.simulationClass];
    
    // Load controls module
    const ControlsModule = await import(controlsPath);
    simulationControls = ControlsModule[moduleConfig.controlsClass];
    
    // Validate controls implements ISimulationControls interface
    ISimulationControls.validate(simulationControls);
    
    // Create control UI elements dynamically
    ISimulationControls.createControlElements(simulationControls, 'controls', {
        info: simulationControls.info
    });
    
    // Get background color from config (if available)
    const backgroundColor = simulationConfig?.renderer?.backgroundColor;
    
    // Create base renderer with full window size using helper with fallback
    const rendererModeElement = document.getElementById('renderer-mode');
    const renderMode = (rendererModeElement && rendererModeElement.value) || moduleConfig.defaultRenderMode;
    baseRenderer = await initializeRendererWithFallback(
        moduleConfig.containerId,
        renderMode,
        backgroundColor
    );
    
    // Update controls background to match color scheme
    updateControlsBackground();
    
    // Create simulation instance using configured parameters
    const params = moduleConfig.initialParams;
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
            const containerId = simulationConfig.module.containerId;
            
            // Use the helper function with fallback support
            initializeRendererWithFallback(containerId, renderMode, backgroundColor)
                .then(renderer => {
                    baseRenderer = renderer;
                    
                    // Update background colors
                    updateControlsBackground();
                    
                    // Re-render using interface method
                    simulation.render(baseRenderer);
                })
                .catch(err => {
                    console.error('Failed to switch renderer:', err);
                    showNotification('Failed to switch renderer mode', 'warning', 3000);
                });
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
