/**
 * Temperature Equalization Simulator - Physics Layer
 * Pure physics simulation without any graphing dependencies
 */

class TemperatureSimulator {
    constructor(points = 50, diffusivity = 0.1) {
        this.points = points;
        this.diffusivity = diffusivity;
        this.temperatures = [];
        this.isRunning = false;
        this.timeStep = 0.01;
        this.listeners = [];
        
        this.initialize();
    }

    /**
     * Initialize temperature distribution
     */
    initialize() {
        this.temperatures = new Array(this.points);
        
        // Set up initial temperature distribution
        // Hot in the middle, cold at the ends
        for (let i = 0; i < this.points; i++) {
            const normalized = i / (this.points - 1);
            // Gaussian-like distribution
            this.temperatures[i] = 100 * Math.exp(-Math.pow((normalized - 0.5) * 4, 2));
        }
        
        // Fixed boundary conditions
        this.temperatures[0] = 0;
        this.temperatures[this.points - 1] = 0;
    }

    /**
     * Register a callback to be notified of state updates
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
     * Get current simulation state (pure data)
     */
    getState() {
        return {
            temperatures: [...this.temperatures],
            points: this.points,
            time: Date.now(),
            isRunning: this.isRunning
        };
    }

    /**
     * Update simulation by one time step
     */
    step() {
        this.temperatures = PhysicsEngine.heatDiffusion(
            this.temperatures,
            this.diffusivity,
            this.timeStep
        );
        
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
        }, 50); // Update every 50ms
        
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
    reset(points) {
        this.stop();
        if (points) this.points = points;
        this.initialize();
        this.notifyListeners();
    }

    /**
     * Update diffusivity constant
     */
    setDiffusivity(newDiffusivity) {
        this.diffusivity = newDiffusivity;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
