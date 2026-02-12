/**
 * Numerical Integrators
 * Generic numerical integration methods for ordinary differential equations (ODEs)
 * These integrators are physics-agnostic and work with any system of ODEs
 */

const Integrators = {
    /**
     * Euler method (1st order explicit integration)
     * Simplest integration method: y(t+dt) = y(t) + dt * dy/dt
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
     * const newState = Integrators.euler(state, (s, t) => [s[1], -k * s[0]], dt);
     */
    euler(state, derivative, dt, t = 0) {
        const isScalar = typeof state === 'number';
        const stateArray = isScalar ? [state] : state;
        const dState = derivative(stateArray, t);
        const dStateArray = typeof dState === 'number' ? [dState] : dState;
        
        const newState = stateArray.map((val, i) => val + dt * dStateArray[i]);
        return isScalar ? newState[0] : newState;
    },

    /**
     * Verlet integration (symplectic 2nd order method)
     * Position Verlet: x(t+dt) = 2*x(t) - x(t-dt) + a(t)*dt²
     * Commonly used for molecular dynamics and N-body simulations
     * Conserves energy better than Euler for oscillatory systems
     * 
     * @param {Array} position - Current position array
     * @param {Array} previousPosition - Position at previous time step
     * @param {Function} acceleration - Function that computes acceleration given (position, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Object} {position: new position, previousPosition: current position}
     * 
     * @example
     * // For gravity: a = F/m
     * const result = Integrators.verlet(pos, prevPos, (p, t) => [fx/m, fy/m], dt);
     */
    verlet(position, previousPosition, acceleration, dt, t = 0) {
        const acc = acceleration(position, t);
        const newPosition = position.map((x, i) => 
            2 * x - previousPosition[i] + acc[i] * dt * dt
        );
        
        return {
            position: newPosition,
            previousPosition: position
        };
    },

    /**
     * 4th-order Runge-Kutta method (RK4)
     * Higher accuracy integration: O(h⁴) local error
     * Standard method for most physics simulations requiring accuracy
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
     * const newState = Integrators.rk4(state, derivatives, dt);
     */
    rk4(state, derivative, dt, t = 0) {
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
    },

    /**
     * Velocity Verlet integration (symplectic 2nd order method)
     * More commonly used than position Verlet as it directly tracks velocity
     * x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
     * v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
     * 
     * @param {Array} position - Current position array
     * @param {Array} velocity - Current velocity array
     * @param {Function} acceleration - Function that computes acceleration given (position, velocity, t)
     * @param {number} dt - Time step
     * @param {number} t - Current time (optional, default 0)
     * @returns {Object} {position: new position, velocity: new velocity}
     * 
     * @example
     * // For N-body: a = sum of forces / mass
     * const result = Integrators.velocityVerlet(pos, vel, computeAcceleration, dt);
     */
    velocityVerlet(position, velocity, acceleration, dt, t = 0) {
        // Compute acceleration at current state
        const acc1 = acceleration(position, velocity, t);
        
        // Update position: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
        const newPosition = position.map((x, i) => 
            x + velocity[i] * dt + 0.5 * acc1[i] * dt * dt
        );
        
        // Compute acceleration at new position (with current velocity)
        const acc2 = acceleration(newPosition, velocity, t + dt);
        
        // Update velocity: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
        const newVelocity = velocity.map((v, i) => 
            v + 0.5 * (acc1[i] + acc2[i]) * dt
        );
        
        return {
            position: newPosition,
            velocity: newVelocity
        };
    }
};
