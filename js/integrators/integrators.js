/**
 * Numerical Integrators - Backward Compatibility Wrapper
 * Generic numerical integration methods for ordinary differential equations (ODEs)
 * These integrators are physics-agnostic and work with any system of ODEs
 * 
 * This file provides the original Integrators object interface for backward compatibility
 * while delegating to individual integrator implementations.
 */

import { EulerIntegrator } from './euler-integrator.js';
import { RK4Integrator } from './rk4-integrator.js';
import { VerletIntegrator } from './verlet-integrator.js';
import { VelocityVerletIntegrator } from './velocity-verlet-integrator.js';

export const Integrators = {
    /**
     * Euler method (1st order explicit integration)
     * Simplest integration method: y(t+dt) = y(t) + dt * dy/dt
     * 
     * @param {Array|number} state - Current state (can be scalar or array)
     * @param {Function} derivative - Function that computes dy/dt given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array|number} New state after time step dt
     */
    euler(state, derivative, dt, t = 0) {
        return EulerIntegrator.integrate(state, derivative, dt, t);
    },

    /**
     * Verlet integration (symplectic 2nd order method)
     * Position Verlet: x(t+dt) = 2*x(t) - x(t-dt) + a(t)*dt²
     * 
     * @param {Array} state - Current state [position, previousPosition] as flat array
     * @param {Function} derivative - Function that computes acceleration given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array} New state [newPosition, currentPosition] as flat array
     */
    verlet(state, derivative, dt, t = 0) {
        return VerletIntegrator.integrate(state, derivative, dt, t);
    },

    /**
     * 4th-order Runge-Kutta method (RK4)
     * Higher accuracy integration: O(h⁴) local error
     * 
     * @param {Array|number} state - Current state (can be scalar or array)
     * @param {Function} derivative - Function that computes dy/dt given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array|number} New state after time step dt
     */
    rk4(state, derivative, dt, t = 0) {
        return RK4Integrator.integrate(state, derivative, dt, t);
    },

    /**
     * Velocity Verlet integration (symplectic 2nd order method)
     * More commonly used than position Verlet as it directly tracks velocity
     * 
     * @param {Array} state - Current state [position, velocity] as flat array
     * @param {Function} derivative - Function that computes [velocity, acceleration] given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array} New state [newPosition, newVelocity] as flat array
     */
    velocityVerlet(state, derivative, dt, t = 0) {
        return VelocityVerletIntegrator.integrate(state, derivative, dt, t);
    }
};

// Export individual integrators for direct use
export { EulerIntegrator } from './euler-integrator.js';
export { RK4Integrator } from './rk4-integrator.js';
export { VerletIntegrator } from './verlet-integrator.js';
export { VelocityVerletIntegrator } from './velocity-verlet-integrator.js';
export { IIntegrator } from './integrator-interface.js';
