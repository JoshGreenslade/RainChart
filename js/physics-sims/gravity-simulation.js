/**
 * Gravity Simulation - Brings together physics, integrators, and rendering
 * Uses PrimitiveRenderer to build the scene
 */

class GravitySimulation extends ISimulation {
    constructor(width, height, bodyCount = 3, G = 1.0) {
        super();
        this.width = width;
        this.height = height;
        this.G = G;
        this.bodies = [];
        this.isRunning = false;
        this.timeStep = 0.016; // ~60 FPS
        this.listeners = [];
        this.animationFrame = null;
        
        this.initialize(bodyCount);
    }

    /**
     * Physics Engine - Co-located within this simulation
     */
    static PhysicsEngine = {
        /**
         * Calculate gravitational force between two bodies
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
         * Generate random bodies for gravity simulation
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
        }
    };

    /**
     * Initialize bodies for simulation
     */
    initialize(bodyCount) {
        this.bodies = GravitySimulation.PhysicsEngine.generateRandomBodies(
            bodyCount, 
            this.width, 
            this.height
        );
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
                const force = GravitySimulation.PhysicsEngine.calculateGravitationalForce(
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
            GravitySimulation.PhysicsEngine.updatePosition(
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
     * Render the simulation using PrimitiveRenderer
     * This is where we use primitives (addCircle) to build the scene
     */
    render(renderer) {
        const config = ChartConfig.gravity || {};
        
        // Clear the renderer
        renderer.clear();
        
        // Draw grid if enabled
        if (config.showGrid) {
            this._drawGrid(renderer, config);
        }
        
        // Draw bodies using primitive addCircle
        const bodyCount = Math.min(this.bodies.length, config.maxBodies || 10000);
        for (let i = 0; i < bodyCount; i++) {
            const body = this.bodies[i];
            const color = (config.bodyColors || ['#e74c3c', '#3498db', '#2ecc71'])[i % 3];
            const radius = Math.sqrt(body.mass) * (config.bodySizeMultiplier || 3);
            
            // Use primitive renderer interface
            renderer.addCircle(body.x, body.y, radius, {
                fill: color,
                stroke: config.bodyStrokeColor || '#34495e',
                strokeWidth: config.bodyStrokeWidth || 1,
                opacity: config.bodyOpacity || 0.8
            });
        }
        
        // Draw body count if exceeding display limit
        if (this.bodies.length > (config.maxBodies || 10000)) {
            // Note: We would need a text primitive for this
            // For now, skip or add it to PrimitiveRenderer
        }
    }

    /**
     * Draw grid helper
     */
    _drawGrid(renderer, config) {
        const gridSize = config.gridSize || 50;
        const color = config.gridColor || '#e0e0e0';
        
        // Vertical lines
        for (let x = 0; x <= this.width; x += gridSize) {
            renderer.addLine(x, 0, x, this.height, {
                stroke: color,
                strokeWidth: 0.5,
                opacity: 0.5
            });
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.height; y += gridSize) {
            renderer.addLine(0, y, this.width, y, {
                stroke: color,
                strokeWidth: 0.5,
                opacity: 0.5
            });
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
