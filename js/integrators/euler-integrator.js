/**
 * Euler Integrator - 1st order explicit integration method
 * Implements IIntegrator interface
 * 
 * Simplest integration method: y(t+dt) = y(t) + dt * dy/dt
 */

import { IIntegrator } from './integrator-interface.js';

export const EulerIntegrator = {
    /**
     * Euler method (1st order explicit integration)
     * 
     * @param {Array|number} state - Current state (can be scalar or array)
     * @param {Function} derivative - Function that computes dy/dt given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array|number} New state after time step dt
     * 
     * @example
     * // Simple harmonic oscillator: d²x/dt² = -kx
     * const state = [x, vx];
     * const newState = EulerIntegrator.integrate(state, (s, t) => [s[1], -k * s[0]], dt);
     */
    integrate(state, derivative, dt, t = 0) {
        const isScalar = typeof state === 'number';
        const stateArray = isScalar ? [state] : state;
        const dState = derivative(stateArray, t);
        const dStateArray = typeof dState === 'number' ? [dState] : dState;
        
        const newState = stateArray.map((val, i) => val + dt * dStateArray[i]);
        return isScalar ? newState[0] : newState;
    }
};

// Validate that this integrator implements the interface
IIntegrator.validate(EulerIntegrator);
