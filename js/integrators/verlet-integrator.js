/**
 * Verlet Integrator - Symplectic 2nd order method
 * Implements IIntegrator interface
 * 
 * Position Verlet: x(t+dt) = 2*x(t) - x(t-dt) + a(t)*dt²
 * Commonly used for molecular dynamics and N-body simulations
 * Conserves energy better than Euler for oscillatory systems
 */

import { IIntegrator } from './integrator-interface.js';

export const VerletIntegrator = {
    /**
     * Verlet integration (symplectic 2nd order method)
     * 
     * @param {Array} state - Current state [position, previousPosition] as flat array
     * @param {Function} derivative - Function that computes acceleration given (state, t)
     *                                 Should return acceleration array
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array} New state [newPosition, currentPosition] as flat array
     * 
     * @example
     * // For gravity: a = F/m
     * // State format: [x1, y1, x2, y2, ..., prevX1, prevY1, prevX2, prevY2, ...]
     * const state = [...position, ...previousPosition];
     * const derivative = (s, t) => {
     *     const n = s.length / 2;
     *     const pos = s.slice(0, n);
     *     return acceleration(pos, t); // Return acceleration array
     * };
     * const newState = VerletIntegrator.integrate(state, derivative, dt);
     */
    integrate(state, derivative, dt, t = 0) {
        const n = state.length / 2;
        const position = state.slice(0, n);
        const previousPosition = state.slice(n);
        
        const acc = derivative(state, t);
        const newPosition = position.map((x, i) => 
            2 * x - previousPosition[i] + acc[i] * dt * dt
        );
        
        // Return [newPosition, currentPosition]
        return [...newPosition, ...position];
    }
};

// Validate that this integrator implements the interface
IIntegrator.validate(VerletIntegrator);
