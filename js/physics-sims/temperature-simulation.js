/**
 * Temperature Simulation - Brings together physics, integrators, and rendering
 * Uses PrimitiveRenderer to build the scene
 */

class TemperatureSimulation extends ISimulation {
    constructor(points = 50, diffusivity = 0.1) {
        super();
        this.points = points;
        this.diffusivity = diffusivity;
        this.temperatures = [];
        this.isRunning = false;
        this.timeStep = 0.01;
        this.listeners = [];
        this.animationFrame = null;
        
        this.initialize();
    }

    /**
     * Physics Engine - Co-located within this simulation
     */
    static PhysicsEngine = {
        /**
         * Calculate heat diffusion using finite difference method
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
        }
    };

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
     * Get current simulation state
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
        this.temperatures = TemperatureSimulation.PhysicsEngine.heatDiffusion(
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
     * Render the simulation using PrimitiveRenderer
     * This is where we use primitives (addRectangle) to build the scene
     */
    render(renderer, options = {}) {
        const config = ChartConfig.temperature || {};
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const chartWidth = renderer.options.width - margin.left - margin.right;
        const chartHeight = renderer.options.height - margin.top - margin.bottom;
        
        // Clear the renderer
        renderer.clear();
        
        // Find max temperature for scaling
        const maxTemp = Math.max(...this.temperatures, 1);
        
        // Draw temperature bars using primitive addRectangle
        const barWidth = chartWidth / this.points;
        
        for (let i = 0; i < this.temperatures.length; i++) {
            const temp = this.temperatures[i];
            const x = margin.left + i * barWidth;
            const barHeight = (temp / maxTemp) * chartHeight;
            const y = margin.top + chartHeight - barHeight;
            
            // Get color based on temperature
            const color = this._getTemperatureColor(temp, maxTemp, config);
            
            // Use primitive renderer interface
            renderer.addRectangle(x, y, barWidth, barHeight, {
                fill: color,
                stroke: config.barStrokeColor || 'none',
                strokeWidth: config.barStroke ? (config.barStrokeWidth || 1) : 0,
                opacity: config.barOpacity || 0.8
            });
        }
        
        // Draw axes if enabled
        if (config.showAxes) {
            this._drawAxes(renderer, margin, chartWidth, chartHeight, maxTemp, config);
        }
    }

    /**
     * Get color based on temperature
     */
    _getTemperatureColor(temp, maxTemp, config) {
        if (config.colorScheme === 'gradient') {
            const ratio = temp / maxTemp;
            if (ratio < 0.33) {
                return `rgb(0, ${Math.floor(ratio * 3 * 255)}, 255)`;
            } else if (ratio < 0.66) {
                const r = Math.floor((ratio - 0.33) * 3 * 255);
                return `rgb(${r}, 255, ${255 - r})`;
            } else {
                return `rgb(255, ${Math.floor((1 - ratio) * 3 * 255)}, 0)`;
            }
        }
        // Default single color
        return config.barColor || '#3498db';
    }

    /**
     * Draw axes helper
     */
    _drawAxes(renderer, margin, chartWidth, chartHeight, maxTemp, config) {
        const axisColor = config.axisColor || '#000';
        
        // X-axis
        renderer.addLine(
            margin.left,
            renderer.options.height - margin.bottom,
            renderer.options.width - margin.right,
            renderer.options.height - margin.bottom,
            { stroke: axisColor, strokeWidth: config.axisWidth || 2 }
        );
        
        // Y-axis
        renderer.addLine(
            margin.left,
            margin.top,
            margin.left,
            renderer.options.height - margin.bottom,
            { stroke: axisColor, strokeWidth: config.axisWidth || 2 }
        );
        
        // Note: Tick marks and labels would require text primitives
        // which we could add to PrimitiveRenderer if needed
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
