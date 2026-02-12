/**
 * Trajectory Simulation - Brings together physics, integrators, and rendering
 * Uses PrimitiveRenderer to build the scene
 */

class TrajectorySimulation extends ISimulation {
    constructor(velocity = 50, angle = 45, resistanceType = 'none', dragCoeff = 0.1) {
        super();
        this.initialVelocity = velocity;
        this.angle = angle;
        this.resistanceType = resistanceType;
        this.dragCoeff = dragCoeff;
        this.g = 9.8;
        this.timeStep = 0.01;
        this.trajectory = [];
        this.isRunning = false;
        this.listeners = [];
    }

    /**
     * Physics Engine - Co-located within this simulation
     */
    static PhysicsEngine = {
        /**
         * Calculate projectile motion with air resistance
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
        }
    };

    /**
     * Initialize (not used in trajectory, but required by interface)
     */
    initialize() {
        // Trajectory doesn't need initialization
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
            trajectory: [...this.trajectory],
            resistanceType: this.resistanceType,
            isRunning: this.isRunning,
            initialVelocity: this.initialVelocity,
            angle: this.angle,
            dragCoeff: this.dragCoeff
        };
    }

    /**
     * Update simulation by one time step (not used for trajectory)
     */
    step() {
        // Trajectory is calculated all at once, not step by step
    }

    /**
     * Start the simulation (launch)
     */
    start() {
        this.launch();
    }

    /**
     * Launch projectile with current settings
     */
    launch() {
        this.stop();
        this.trajectory = [];
        
        // Convert angle to radians and set initial state
        const angleRad = this.angle * Math.PI / 180;
        const state = {
            x: 0,
            y: 0,
            vx: this.initialVelocity * Math.cos(angleRad),
            vy: this.initialVelocity * Math.sin(angleRad)
        };
        
        // Calculate trajectory
        while (state.y >= 0 && this.trajectory.length < 10000) {
            this.trajectory.push({ x: state.x, y: state.y });
            
            const newState = TrajectorySimulation.PhysicsEngine.projectileMotion(
                state,
                this.g,
                this.resistanceType,
                this.dragCoeff,
                this.timeStep
            );
            
            state.x = newState.x;
            state.y = newState.y;
            state.vx = newState.vx;
            state.vy = newState.vy;
            
            // Break if projectile has landed
            if (state.y < 0) {
                // Interpolate to find exact landing point
                const prevPoint = this.trajectory[this.trajectory.length - 1];
                const t = prevPoint.y / (prevPoint.y - state.y);
                const landingX = prevPoint.x + t * (state.x - prevPoint.x);
                this.trajectory.push({ x: landingX, y: 0 });
                break;
            }
        }
        
        this.notifyListeners();
    }

    /**
     * Stop/clear current trajectory
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Reset the simulation
     */
    reset() {
        this.stop();
        this.trajectory = [];
        this.notifyListeners();
    }

    /**
     * Update simulation parameters
     */
    setParameters(velocity, angle, resistanceType, dragCoeff) {
        this.initialVelocity = velocity;
        this.angle = angle;
        this.resistanceType = resistanceType;
        this.dragCoeff = dragCoeff;
    }

    /**
     * Render the simulation using PrimitiveRenderer
     * This is where we use primitives (addCurve, addCircle) to build the scene
     */
    render(renderer, options = {}) {
        const config = ChartConfig.trajectory || {};
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const chartWidth = renderer.options.width - margin.left - margin.right;
        const chartHeight = renderer.options.height - margin.top - margin.bottom;
        
        // Clear the renderer
        renderer.clear();
        
        if (this.trajectory.length === 0) {
            // Could add text primitive to show message
            return;
        }
        
        // Find max values for scaling
        const maxX = Math.max(...this.trajectory.map(p => p.x)) * 1.1;
        const maxY = Math.max(...this.trajectory.map(p => p.y)) * 1.1;
        
        // Draw grid if enabled
        if (config.showGrid) {
            this._drawGrid(renderer, margin, chartWidth, chartHeight, config);
        }
        
        // Scale trajectory points to chart coordinates
        const scaledPoints = this.trajectory.map(point => ({
            x: margin.left + (point.x / maxX) * chartWidth,
            y: renderer.options.height - margin.bottom - (point.y / maxY) * chartHeight
        }));
        
        // Draw trajectory using primitive addCurve
        const pathColor = (config.pathColors && config.pathColors[this.resistanceType]) || 
                          config.pathColors?.none || '#e74c3c';
        
        renderer.addCurve(scaledPoints, {
            stroke: pathColor,
            strokeWidth: config.pathWidth || 2,
            fill: 'none',
            opacity: config.pathOpacity || 1.0
        });
        
        // Draw projectile marker at start if enabled
        if (config.showProjectile && scaledPoints.length > 0) {
            const start = scaledPoints[0];
            renderer.addCircle(start.x, start.y, config.projectileSize || 5, {
                fill: config.projectileColor || '#e74c3c',
                stroke: 'none',
                opacity: 1.0
            });
        }
        
        // Draw axes if enabled
        if (config.showAxes) {
            this._drawAxes(renderer, margin, chartWidth, chartHeight, config);
        }
    }

    /**
     * Draw grid helper
     */
    _drawGrid(renderer, margin, chartWidth, chartHeight, config) {
        const gridColor = config.gridColor || '#e0e0e0';
        const gridOpacity = config.gridOpacity || 0.3;
        
        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = margin.left + (chartWidth * i / 10);
            renderer.addLine(
                x, 
                margin.top, 
                x, 
                renderer.options.height - margin.bottom,
                { stroke: gridColor, strokeWidth: 0.5, opacity: gridOpacity }
            );
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = margin.top + (chartHeight * i / 10);
            renderer.addLine(
                margin.left, 
                y, 
                renderer.options.width - margin.right, 
                y,
                { stroke: gridColor, strokeWidth: 0.5, opacity: gridOpacity }
            );
        }
    }

    /**
     * Draw axes helper
     */
    _drawAxes(renderer, margin, chartWidth, chartHeight, config) {
        const axisColor = config.axisColor || '#000';
        const axisWidth = config.axisWidth || 2;
        
        // X-axis
        renderer.addLine(
            margin.left,
            renderer.options.height - margin.bottom,
            renderer.options.width - margin.right,
            renderer.options.height - margin.bottom,
            { stroke: axisColor, strokeWidth: axisWidth }
        );
        
        // Y-axis
        renderer.addLine(
            margin.left,
            margin.top,
            margin.left,
            renderer.options.height - margin.bottom,
            { stroke: axisColor, strokeWidth: axisWidth }
        );
        
        // Note: Tick marks and labels would require text primitives
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
