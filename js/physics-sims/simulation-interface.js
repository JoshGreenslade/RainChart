/**
 * Simulation Interface - Base interface that all simulations must implement
 * This interface defines the contract between simulations and the application layer
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that throws errors if methods are not overridden. All simulation classes should
 * extend this class and implement all required methods.
 */

export class ISimulation {
    /**
     * Initialize the simulation with required parameters
     * @abstract
     */
    initialize(...args) {
        throw new Error('initialize() must be implemented by subclass');
    }

    /**
     * Register a callback to be notified of state updates
     * @abstract
     * @param {Function} callback - Function to call with updated state
     */
    onUpdate(callback) {
        throw new Error('onUpdate() must be implemented by subclass');
    }

    /**
     * Get current simulation state
     * @abstract
     * @returns {Object} Current state
     */
    getState() {
        throw new Error('getState() must be implemented by subclass');
    }

    /**
     * Update simulation by one time step
     * @abstract
     */
    step() {
        throw new Error('step() must be implemented by subclass');
    }

    /**
     * Start the simulation
     * @abstract
     */
    start() {
        throw new Error('start() must be implemented by subclass');
    }

    /**
     * Stop the simulation
     * @abstract
     */
    stop() {
        throw new Error('stop() must be implemented by subclass');
    }

    /**
     * Reset the simulation to initial state
     * @abstract
     */
    reset(...args) {
        throw new Error('reset() must be implemented by subclass');
    }

    /**
     * Render the current state using the provided renderer
     * @abstract
     * @param {BaseRenderer} renderer - The renderer to use for drawing
     */
    render(renderer) {
        throw new Error('render() must be implemented by subclass');
    }

    /**
     * Clean up resources
     * @abstract
     */
    destroy() {
        throw new Error('destroy() must be implemented by subclass');
    }
}
