/**
 * Numerical Integrators
 * Collection of numerical integration methods for physics simulations
 * Separated from physics calculations for modularity and reusability
 */

const Integrators = {
    /**
     * Euler integration for position updates
     * Simple first-order integration method
     * @param {Object} body - Body with x, y, vx, vy, mass
     * @param {number} fx - Force in x direction
     * @param {number} fy - Force in y direction
     * @param {number} dt - Time step
     */
    euler(body, fx, fy, dt) {
        const ax = fx / body.mass;
        const ay = fy / body.mass;
        
        body.vx += ax * dt;
        body.vy += ay * dt;
        body.x += body.vx * dt;
        body.y += body.vy * dt;
    },

    /**
     * Euler integration for projectile motion
     * Updates state with acceleration based on forces
     * @param {Object} state - Current state {x, y, vx, vy}
     * @param {number} ax - Acceleration in x direction
     * @param {number} ay - Acceleration in y direction
     * @param {number} dt - Time step
     * @returns {Object} New state
     */
    eulerProjectile(state, ax, ay, dt) {
        return {
            x: state.x + state.vx * dt,
            y: state.y + state.vy * dt,
            vx: state.vx + ax * dt,
            vy: state.vy + ay * dt
        };
    },

    /**
     * Finite difference method for heat diffusion (1D)
     * Solves the heat equation using explicit method
     * @param {Array} temperatures - Array of temperature values
     * @param {number} alpha - Thermal diffusivity
     * @param {number} dt - Time step
     * @param {number} dx - Spatial step
     * @returns {Array} New temperature array
     */
    heatDiffusion1D(temperatures, alpha, dt, dx = 1) {
        const n = temperatures.length;
        const newTemps = new Array(n);
        const r = alpha * dt / (dx * dx);
        
        // Boundary conditions (fixed temperature at ends)
        newTemps[0] = temperatures[0];
        newTemps[n - 1] = temperatures[n - 1];
        
        // Update interior points
        for (let i = 1; i < n - 1; i++) {
            newTemps[i] = temperatures[i] + r * (
                temperatures[i - 1] - 2 * temperatures[i] + temperatures[i + 1]
            );
        }
        
        return newTemps;
    }
};
