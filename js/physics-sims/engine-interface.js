/**
 * Simulation Engine Interface - Base interface that all simulation engines must implement
 * This interface defines the contract for physics/simulation engines
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that throws errors if methods are not overridden. All engine classes should
 * extend this class and implement all required methods.
 */

export class ISimulationEngine {
    /**
     * Initialize the engine with required parameters
     * @abstract
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {...any} args - Additional engine-specific parameters
     */
    initialize(...args) {
        throw new Error(`${this.constructor.name} must implement initialize()`);
    }
    
    /**
     * Reset the engine to initial state
     * @abstract
     * @param {...any} args - Reset parameters
     */
    reset(...args) {
        throw new Error(`${this.constructor.name} must implement reset()`);
    }
    
    /**
     * Perform one simulation step
     * @abstract
     */
    step() {
        throw new Error(`${this.constructor.name} must implement step()`);
    }
    
    /**
     * Get current engine state
     * @abstract
     * @returns {Object} Current state with all relevant data
     */
    getState() {
        throw new Error(`${this.constructor.name} must implement getState()`);
    }
    
    /**
     * Update engine dimensions
     * @abstract
     * @param {number} width - New width
     * @param {number} height - New height
     */
    setDimensions(width, height) {
        throw new Error(`${this.constructor.name} must implement setDimensions()`);
    }
}

/**
 * Recommended engine structure:
 * 
 * class YourEngine extends ISimulationEngine {
 *     constructor(width, height, ...customParams) {
 *         super();
 *         this.width = width;
 *         this.height = height;
 *         this.timeStep = 0.016; // or your value
 *         // ... initialize engine state
 *     }
 *     
 *     initialize(param1, param2, ...) {
 *         // Set up initial state
 *     }
 *     
 *     reset(param1, param2, ...) {
 *         // Reset to initial conditions
 *     }
 *     
 *     step() {
 *         // Perform one physics/simulation step
 *     }
 *     
 *     getState() {
 *         return {
 *             // All data needed for rendering
 *         };
 *     }
 *     
 *     setDimensions(width, height) {
 *         this.width = width;
 *         this.height = height;
 *         // Update any dependent calculations
 *     }
 * }
 */
