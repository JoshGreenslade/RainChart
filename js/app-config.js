/**
 * Application Configuration
 * Specifies which simulation to load and run
 * 
 * This config allows main.js to remain completely independent of concrete simulations.
 * Change the simulation here to switch between different physics simulations.
 */

export const AppConfig = {
    // Which simulation to load
    simulation: {
        // Name of the simulation (used for display purposes)
        name: 'Gravity',
        
        // Path to the simulation module
        modulePath: './physics-sims/Gravity/gravity-simulation.js',
        
        // Class name to import from the module
        className: 'GravitySimulation',
        
        // Path to the simulation config
        configPath: './physics-sims/Gravity/gravity-config.js',
        
        // Config object name to import
        configName: 'GravityConfig',
        
        // Path to the simulation controls
        controlsPath: './physics-sims/Gravity/gravity-controls.js',
        
        // Controls object name to import
        controlsName: 'GravityControls',
        
        // Initial parameters for the simulation constructor
        // These will be passed to the simulation when it's instantiated
        initialParams: {
            bodyCount: 3,
            G: 1.0
        }
    },
    
    // Renderer configuration
    renderer: {
        // Container element ID
        containerId: 'gravity-chart',
        
        // Default render mode
        defaultMode: 'canvas'
    }
};
