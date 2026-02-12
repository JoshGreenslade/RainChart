/**
 * Gravity Simulation - MVC Controller
 * Coordinates between GravityEngine (physics) and GravityRenderer (rendering)
 */

class GravitySimulation extends ISimulation {
    constructor(width, height, bodyCount = 3, G = 1.0) {
        super();
        this.width = width;
        this.height = height;
        this.isRunning = false;
        this.listeners = [];
        this.animationFrame = null;

        // Create engine and renderer components
        this.engine = new GravityEngine(width, height, bodyCount, G);
        this.renderer = null; // Will be set when renderer is provided

        this.initialize(bodyCount);
    }

    /**
     * Set the renderer for this simulation
     */
    setRenderer(renderer) {
        this.renderer = new GravityRenderer(renderer);
    }

    /**
     * Initialize bodies for simulation
     */
    initialize(bodyCount) {
        this.engine.initialize(bodyCount);
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
     * Get current simulation state
     */
    getState() {
        const engineState = this.engine.getState();
        return {
            ...engineState,
            time: Date.now(),
            isRunning: this.isRunning
        };
    }

    /**
     * Update simulation by one time step
     */
    step() {
        this.engine.step();
        this.notifyListeners();
    }

    /**
     * Start the simulation
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const timeStep = 0.016; // ~60 FPS
        this.animationFrame = setInterval(() => {
            if (this.isRunning) {
                this.step();
            }
        }, timeStep * 1000);
        
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
        this.engine.reset(bodyCount || this.engine.bodies.length);
        this.notifyListeners();
    }

    /**
     * Update gravitational constant
     */
    setG(newG) {
        this.engine.setG(newG);
    }

    /**
     * Render the simulation using the configured renderer
     */
    render(primitiveRenderer) {
        if (!this.renderer) {
            // If renderer hasn't been set, create it
            this.setRenderer(primitiveRenderer);
        } else if (primitiveRenderer !== this.renderer.renderer) {
            // If primitive renderer changed, update it
            this.renderer.setRenderer(primitiveRenderer);
        }
        
        const state = this.getState();
        this.renderer.render(state);
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
