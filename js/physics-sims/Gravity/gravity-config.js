/**
 * Gravity Simulation Configuration
 * Implements ISimulationConfig interface
 * 
 * Contains:
 * - Module loading metadata (how to load this simulation)
 * - Renderer configuration (visual settings)
 * - Engine configuration (physics settings)
 */

import { Integrators } from '../../integrators/integrators.js';
import { ISimulationConfig } from '../config-interface.js';
import { DEFAULT_COLOR_PALETTE } from '../../utils/color-palette.js';

export const GravityConfig = {
    // Module loading metadata - tells main.js how to load this simulation
    module: {
        // Name of the simulation (used for display purposes)
        name: 'Gravity',
        
        // Path to the simulation class module (relative to this config file)
        simulationPath: './gravity-simulation.js',
        
        // Class name to import from the simulation module
        simulationClass: 'GravitySimulation',
        
        // Path to the controls module (relative to this config file)
        controlsPath: './gravity-controls.js',
        
        // Controls object name to import
        controlsClass: 'GravityControls',
        
        // Initial parameters for the simulation constructor
        initialParams: {
            bodyCount: 3,
            G: 1.0
        },
        
        // Container element ID for the renderer
        containerId: 'gravity-chart',
        
        // Default render mode
        defaultRenderMode: 'canvas'
    },

    // Gravity Simulation Visual Config
    renderer: {
        // Canvas settings
        backgroundColor: 'hsl(240, 50%, 10%)',
        borderColor: '#bdc3c7',
        borderWidth: 1,
        
        // Body appearance
        bodyColors: DEFAULT_COLOR_PALETTE,
        bodyStrokeColor: '#000000',
        bodyStrokeWidth: 1,
        bodyOpacity: 0.9,
        bodySizeMultiplier: 2,
        
        // Trail settings
        showTrails: false,
        trailLength: 50,
        trailOpacity: 0.3,
        trailFadeRate: 0.95,
        
        // Grid settings
        showGrid: true,
        gridColor: '#e0e0e0',
        gridSize: 50,
        
        // Performance settings
        enableAntialiasing: true,
        maxBodies: 10000
    },

    engine: {
        // Integrator
        integrator: Integrators.rk4,
        
        // Constants
        softeningFactor: 5,
        
        // Mass power law generator
        minMass: 2,
        maxMass: 10000,
        massPowerLawScaling: 2.35
    }
}

// Validate config implements the interface
ISimulationConfig.validate(GravityConfig);
