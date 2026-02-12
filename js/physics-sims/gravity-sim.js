/**
 * Gravity Simulator - Physics Layer
 * Pure physics simulation without any graphing dependencies
 */

class GravitySimulator {
    constructor(width, height, bodyCount = 3, G = 1.0) {
        this.width = width;
        this.height = height;
        this.G = G;
        this.bodies = [];
        this.isRunning = false;
        this.timeStep = 0.016; // ~60 FPS
        this.listeners = [];
        
        this.initialize(bodyCount);
    }

    /**
     * Initialize bodies for simulation
     */
    initialize(bodyCount) {
        this.bodies = PhysicsEngine.generateRandomBodies(bodyCount, this.width, this.height);
    }

    /**
     * Register a callback to be notified of state updates
     * @param {Function} callback - Function to call with updated state
     */
    onUpdate(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify all listeners of state update
     */
    notifyListeners() {
        const state = this.getState();
        this.listeners.forEach(listener => listener(state));
    }

    /**
     * Get current simulation state (pure data, no rendering info)
     * @returns {Object} Current state
     */
    getState() {
        return {
            bodies: this.bodies.map(b => ({
                id: b.id,
                x: b.x,
                y: b.y,
                vx: b.vx,
                vy: b.vy,
                mass: b.mass
            })),
            time: Date.now(),
            isRunning: this.isRunning
        };
    }

    /**
     * Update simulation by one time step
     */
    step() {
        // Calculate forces between all pairs of bodies
        const forces = this.bodies.map(() => ({ fx: 0, fy: 0 }));
        
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const force = PhysicsEngine.calculateGravitationalForce(
                    this.bodies[i],
                    this.bodies[j],
                    this.G
                );
                
                forces[i].fx += force.fx;
                forces[i].fy += force.fy;
                forces[j].fx -= force.fx;
                forces[j].fy -= force.fy;
            }
        }
        
        // Update positions
        for (let i = 0; i < this.bodies.length; i++) {
            PhysicsEngine.updatePosition(
                this.bodies[i],
                forces[i].fx,
                forces[i].fy,
                this.timeStep
            );
            
            // Boundary conditions - wrap around edges
            if (this.bodies[i].x < 0) this.bodies[i].x += this.width;
            if (this.bodies[i].x > this.width) this.bodies[i].x -= this.width;
            if (this.bodies[i].y < 0) this.bodies[i].y += this.height;
            if (this.bodies[i].y > this.height) this.bodies[i].y -= this.height;
        }
        
        this.notifyListeners();
    }

    /**
     * Start the simulation
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animationFrame = setInterval(() => {
            if (this.isRunning) {
                this.step();
            }
        }, this.timeStep * 1000);
        
        this.notifyListeners();
    }

    /**
     * Stop the simulation
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            clearInterval(this.animationFrame);
            this.animationFrame = null;
        }
        this.notifyListeners();
    }

    /**
     * Reset the simulation
     */
    reset(bodyCount) {
        this.stop();
        this.initialize(bodyCount || this.bodies.length);
        this.notifyListeners();
    }

    /**
     * Update gravitational constant
     */
    setG(newG) {
        this.G = newG;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
