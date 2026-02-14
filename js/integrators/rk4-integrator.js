/**
 * RK4 Integrator - 4th-order Runge-Kutta method
 * Implements IIntegrator interface
 * 
 * Higher accuracy integration: O(h⁴) local error
 * Standard method for most physics simulations requiring accuracy
 */

import { IIntegrator } from './integrator-interface.js';

export const RK4Integrator = {
    /**
     * 4th-order Runge-Kutta method (RK4)
     * 
     * @param {Array|number} state - Current state (can be scalar or array)
     * @param {Function} derivative - Function that computes dy/dt given (state, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Array|number} New state after time step dt
     * 
     * @example
     * // Projectile with drag: dv/dt = -g - k*v, dx/dt = v
     * const state = [x, y, vx, vy];
     * const newState = RK4Integrator.integrate(state, derivatives, dt);
     */
    integrate(state, derivative, dt, t = 0) {
        const isScalar = typeof state === 'number';
        const stateArray = isScalar ? [state] : state;
        
        // Helper to ensure derivative result is an array
        const ensureArray = (d) => typeof d === 'number' ? [d] : d;
        
        // k1 = f(t, y)
        const k1 = ensureArray(derivative(stateArray, t));
        
        // k2 = f(t + dt/2, y + k1*dt/2)
        const state2 = stateArray.map((val, i) => val + 0.5 * dt * k1[i]);
        const k2 = ensureArray(derivative(state2, t + 0.5 * dt));
        
        // k3 = f(t + dt/2, y + k2*dt/2)
        const state3 = stateArray.map((val, i) => val + 0.5 * dt * k2[i]);
        const k3 = ensureArray(derivative(state3, t + 0.5 * dt));
        
        // k4 = f(t + dt, y + k3*dt)
        const state4 = stateArray.map((val, i) => val + dt * k3[i]);
        const k4 = ensureArray(derivative(state4, t + dt));
        
        // y(t+dt) = y(t) + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
        const newState = stateArray.map((val, i) => 
            val + (dt / 6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i])
        );
        
        return isScalar ? newState[0] : newState;
    }
};

// Validate that this integrator implements the interface
IIntegrator.validate(RK4Integrator);
