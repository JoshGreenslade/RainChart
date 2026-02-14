/**
 * Velocity Verlet Integrator - Symplectic 2nd order method
 * Implements IIntegrator interface
 * 
 * More commonly used than position Verlet as it directly tracks velocity
 * x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
 * v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
 */

import { IIntegrator } from './integrator-interface.js';

export const VelocityVerletIntegrator = {
    /**
     * Velocity Verlet integration (symplectic 2nd order method)
     * 
     * @param {Array} state - Current state [position, velocity] as flat array
     * @param {Function} derivative - Function that computes [velocity, acceleration] given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array} New state [newPosition, newVelocity] as flat array
     * 
     * @example
     * // For N-body: a = sum of forces / mass
     * // State format: [x, y, vx, vy]
     * const derivative = (s, t) => {
     *     const n = s.length / 2;
     *     const pos = s.slice(0, n);
     *     const vel = s.slice(n);
     *     const acc = computeAcceleration(pos, vel, t);
     *     return [...vel, ...acc]; // Returns [vx, vy, ax, ay]
     * };
     * const newState = VelocityVerletIntegrator.integrate(state, derivative, dt);
     */
    integrate(state, derivative, dt, t = 0) {
        const n = state.length / 2;
        const position = state.slice(0, n);
        const velocity = state.slice(n);
        
        // Get [velocity, acceleration] from derivative
        const dState = derivative(state, t);
        const acc1 = dState.slice(n); // Second half is acceleration
        
        // Update position: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
        const newPosition = position.map((x, i) => 
            x + velocity[i] * dt + 0.5 * acc1[i] * dt * dt
        );
        
        // Compute acceleration at new position
        const newState1 = [...newPosition, ...velocity];
        const dState2 = derivative(newState1, t + dt);
        const acc2 = dState2.slice(n);
        
        // Update velocity: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
        const newVelocity = velocity.map((v, i) => 
            v + 0.5 * (acc1[i] + acc2[i]) * dt
        );
        
        // Return [newPosition, newVelocity]
        return [...newPosition, ...newVelocity];
    }
};

// Validate that this integrator implements the interface
IIntegrator.validate(VelocityVerletIntegrator);
