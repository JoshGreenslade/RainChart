/**
 * Simulation Config Interface - Base interface that all simulation configs must implement
 * This interface defines the required structure for simulation configuration objects
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that serves as documentation and validation contract.
 */

export class ISimulationConfig {
    /**
     * Validate that a config object implements the required structure
     * @param {Object} config - The config object to validate
     * @throws {Error} If config doesn't implement required properties
     */
    static validate(config) {
        // Check for required module metadata
        if (!config.module) {
            throw new Error('Config must have a "module" property');
        }
        
        const requiredModuleProps = [
            'name',
            'simulationPath',
            'simulationClass',
            'controlsPath',
            'controlsClass',
            'initialParams',
            'containerId',
            'defaultRenderMode'
        ];
        
        for (const prop of requiredModuleProps) {
            if (!(prop in config.module)) {
                throw new Error(`Config.module must have property: ${prop}`);
            }
        }
        
        // Check for renderer configuration
        if (!config.renderer) {
            throw new Error('Config must have a "renderer" property');
        }
        
        // Check for engine configuration
        if (!config.engine) {
            throw new Error('Config must have an "engine" property');
        }
        
        return true;
    }
    
    /**
     * Get module loading metadata
     * @returns {Object} Module metadata
     */
    static getModuleMetadata(config) {
        ISimulationConfig.validate(config);
        return config.module;
    }
    
    /**
     * Get renderer configuration
     * @returns {Object} Renderer config
     */
    static getRendererConfig(config) {
        ISimulationConfig.validate(config);
        return config.renderer;
    }
    
    /**
     * Get engine configuration
     * @returns {Object} Engine config
     */
    static getEngineConfig(config) {
        ISimulationConfig.validate(config);
        return config.engine;
    }
}

/**
 * Required structure for simulation config objects:
 * 
 * {
 *     module: {
 *         name: string,                    // Display name of simulation
 *         simulationPath: string,          // Relative path to simulation class
 *         simulationClass: string,         // Name of simulation class to import
 *         controlsPath: string,            // Relative path to controls module
 *         controlsClass: string,           // Name of controls object to import
 *         initialParams: Object,           // Parameters for simulation constructor
 *         containerId: string,             // HTML container element ID
 *         defaultRenderMode: string        // Default render mode ('canvas' or 'svg')
 *     },
 *     renderer: {
 *         // Visual configuration (colors, sizes, etc.)
 *     },
 *     engine: {
 *         // Physics/simulation engine configuration
 *     }
 * }
 */
