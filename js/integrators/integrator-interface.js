/**
 * Integrator Interface - Base interface that all integrator implementations must implement
 * This interface defines the required methods for all numerical integration methods
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that serves as documentation and validation contract.
 */

export class IIntegrator {
    /**
     * Validate that an integrator object implements the required methods
     * @param {Object} integrator - The integrator object to validate
     * @throws {Error} If integrator doesn't implement required methods
     */
    static validate(integrator) {
        if (typeof integrator.integrate !== 'function') {
            throw new Error('Integrator must implement method: integrate');
        }
        
        return true;
    }
}

/**
 * Required interface method for all integrators:
 * 
 * integrate(state, derivative, dt, t): Array|number
 *   - Integrate the system for one time step
 *   - @param {Array|number} state - Current state (can be scalar or array)
 *   - @param {Function} derivative - Function that computes dy/dt given (state, t)
 *   - @param {number} dt - Time step
 *   - @param {number} t - Current time (optional, default 0)
 *   - @returns {Array|number} New state after time step dt
 * 
 * The derivative function should have the signature:
 *   derivative(state: Array|number, t: number): Array|number
 * 
 * For position-based integrators (like Verlet), the state format may differ:
 *   - Verlet: state = [position, previousPosition] as flat array
 *   - Velocity Verlet: state = [position, velocity] as flat array
 */
