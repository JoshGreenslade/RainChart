/**
 * Physics Engine - Core physics calculations
 * Provides reusable physics functions for various simulations
 */

const PhysicsEngine = {
    /**
     * Calculate gravitational force between two bodies
     * @param {Object} body1 - First body with mass, x, y
     * @param {Object} body2 - Second body with mass, x, y
     * @param {number} G - Gravitational constant
     * @returns {Object} Force vector {fx, fy}
     */
    calculateGravitationalForce(body1, body2, G = 1) {
        const dx = body2.x - body1.x;
        const dy = body2.y - body1.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        
        // Avoid division by zero and extreme forces at very close distances
        if (distance < 1) return { fx: 0, fy: 0 };
        
        const forceMagnitude = G * body1.mass * body2.mass / distanceSquared;
        const fx = forceMagnitude * dx / distance;
        const fy = forceMagnitude * dy / distance;
        
        return { fx, fy };
    },

    /**
     * Update body position using numerical integration
     * Uses Euler method by default, but can be swapped with other integrators
     * @param {Object} body - Body with x, y, vx, vy, mass
     * @param {number} fx - Force in x direction
     * @param {number} fy - Force in y direction
     * @param {number} dt - Time step
     */
    updatePosition(body, fx, fy, dt) {
        // Define the state as [x, y, vx, vy]
        const state = [body.x, body.y, body.vx, body.vy];
        
        // Define the derivative function (equations of motion)
        const derivative = (s) => {
            const [x, y, vx, vy] = s;
            const ax = fx / body.mass;
            const ay = fy / body.mass;
            return [vx, vy, ax, ay]; // [dx/dt, dy/dt, dvx/dt, dvy/dt]
        };
        
        // Integrate using Euler method
        const newState = Integrators.euler(state, derivative, dt);
        
        // Update body state
        [body.x, body.y, body.vx, body.vy] = newState;
    },

    /**
     * Calculate heat diffusion using finite difference method
     * @param {Array} temperatures - Array of temperature values
     * @param {number} alpha - Thermal diffusivity
     * @param {number} dt - Time step
     * @param {number} dx - Spatial step
     * @returns {Array} New temperature array
     */
    heatDiffusion(temperatures, alpha, dt, dx = 1) {
        const n = temperatures.length;
        const newTemps = new Array(n);
        
        // Boundary conditions (fixed temperature at ends)
        newTemps[0] = temperatures[0];
        newTemps[n - 1] = temperatures[n - 1];
        
        // Update interior points using Euler integration on each point
        for (let i = 1; i < n - 1; i++) {
            // Derivative: dT/dt = alpha * d²T/dx²
            const derivative = () => {
                const d2Tdx2 = (temperatures[i - 1] - 2 * temperatures[i] + temperatures[i + 1]) / (dx * dx);
                return alpha * d2Tdx2;
            };
            
            newTemps[i] = Integrators.euler(temperatures[i], derivative, dt);
        }
        
        return newTemps;
    },

    /**
     * Calculate projectile motion with air resistance
     * @param {Object} state - Current state {x, y, vx, vy}
     * @param {number} g - Gravitational acceleration
     * @param {string} resistanceType - 'none', 'linear', or 'quadratic'
     * @param {number} dragCoeff - Drag coefficient
     * @param {number} dt - Time step
     * @returns {Object} New state
     */
    projectileMotion(state, g = 9.8, resistanceType = 'none', dragCoeff = 0.1, dt = 0.01) {
        // Define the state as [x, y, vx, vy]
        const stateArray = [state.x, state.y, state.vx, state.vy];
        
        // Define the derivative function (equations of motion)
        const derivative = (s) => {
            const [x, y, vx, vy] = s;
            let ax = 0;
            let ay = -g;
            
            const speed = Math.sqrt(vx * vx + vy * vy);
            
            if (resistanceType === 'linear' && speed > 0) {
                // Linear air resistance: F = -bv
                ax -= dragCoeff * vx;
                ay -= dragCoeff * vy;
            } else if (resistanceType === 'quadratic' && speed > 0) {
                // Quadratic air resistance: F = -cv^2
                const dragFactor = dragCoeff * speed;
                ax -= dragFactor * vx;
                ay -= dragFactor * vy;
            }
            
            return [vx, vy, ax, ay]; // [dx/dt, dy/dt, dvx/dt, dvy/dt]
        };
        
        // Integrate using Euler method
        const newState = Integrators.euler(stateArray, derivative, dt);
        
        return {
            x: newState[0],
            y: newState[1],
            vx: newState[2],
            vy: newState[3]
        };
    },

    /**
     * Generate random bodies for gravity simulation
     * @param {number} count - Number of bodies
     * @param {number} width - Width of area
     * @param {number} height - Height of area
     * @returns {Array} Array of body objects
     */
    generateRandomBodies(count, width, height) {
        const bodies = [];
        for (let i = 0; i < count; i++) {
            bodies.push({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                mass: Math.random() * 50 + 10
            });
        }
        return bodies;
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
};
