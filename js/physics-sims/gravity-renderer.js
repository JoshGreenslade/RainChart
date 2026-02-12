/**
 * Gravity Renderer - Handles all rendering logic for gravity simulation
 * Uses PrimitiveRenderer to build the scene
 */

class GravityRenderer {
    constructor(renderer) {
        this.renderer = renderer;
        this.config = ChartConfig.gravity || {};
    }

    /**
     * Render the complete gravity simulation scene
     * @param {Object} state - Simulation state containing bodies and dimensions
     */
    render(state) {
        // Clear the renderer
        this.renderer.clear();
        
        // Draw background (already handled by PrimitiveRenderer during clear)
        
        // Draw grid if enabled
        if (this.config.showGrid) {
            this._drawGrid(state.width, state.height);
        }
        
        // Draw bodies
        this._drawBodies(state.bodies);
        
        // Draw body count if exceeding display limit
        if (state.bodies.length > (this.config.maxBodies || 10000)) {
            // Note: Text primitive would be needed for this
            // For now, skip or add it to PrimitiveRenderer
        }
    }

    /**
     * Draw all bodies
     * @param {Array} bodies - Array of body objects
     */
    _drawBodies(bodies) {
        const bodyCount = Math.min(bodies.length, this.config.maxBodies || 10000);
        for (let i = 0; i < bodyCount; i++) {
            const body = bodies[i];
            const color = (this.config.bodyColors || ['#e74c3c', '#3498db', '#2ecc71'])[i % 3];
            const radius = Math.sqrt(body.mass) * (this.config.bodySizeMultiplier || 3);
            
            // Use primitive renderer interface
            this.renderer.addCircle(body.x, body.y, radius, {
                fill: color,
                stroke: this.config.bodyStrokeColor || '#34495e',
                strokeWidth: this.config.bodyStrokeWidth || 1,
                opacity: this.config.bodyOpacity || 0.8
            });
        }
    }

    /**
     * Draw grid helper
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    _drawGrid(width, height) {
        const gridSize = this.config.gridSize || 50;
        const color = this.config.gridColor || '#e0e0e0';
        
        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            this.renderer.addLine(x, 0, x, height, {
                stroke: color,
                strokeWidth: 0.5,
                opacity: 0.5
            });
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            this.renderer.addLine(0, y, width, y, {
                stroke: color,
                strokeWidth: 0.5,
                opacity: 0.5
            });
        }
    }

    /**
     * Update the renderer (e.g., when switching render modes)
     * @param {PrimitiveRenderer} renderer - New renderer instance
     */
    setRenderer(renderer) {
        this.renderer = renderer;
    }

    /**
     * Update configuration
     * @param {Object} config - New configuration options
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
