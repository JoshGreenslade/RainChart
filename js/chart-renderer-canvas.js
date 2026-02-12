/**
 * Chart Renderers - Visualization Layer using Canvas API
 * Completely separate from physics - consumes physics data and renders it
 * Optimized for high performance with thousands of objects
 */

const ChartRenderer = {
    // Store canvas contexts and configurations
    _canvases: new Map(),
    _trails: new Map(),
    
    /**
     * Get or create canvas with optimized settings
     */
    _getCanvas(containerId, width, height, config) {
        const container = document.getElementById(containerId);
        let canvasData = this._canvases.get(containerId);
        
        if (!canvasData) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.border = `${config.borderWidth}px solid ${config.borderColor}`;
            canvas.style.background = config.backgroundColor;
            container.innerHTML = '';
            container.appendChild(canvas);
            
            const ctx = canvas.getContext('2d', {
                alpha: false, // Performance boost if we don't need transparency
                desynchronized: true // Allows better performance
            });
            
            canvasData = { canvas, ctx };
            this._canvases.set(containerId, canvasData);
        }
        
        return canvasData;
    },
    
    /**
     * Render gravity simulation state with extensive customization
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from GravitySimulator
     * @param {Object} options - Rendering options (width, height, config)
     */
    renderGravitySimulation(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 600;
        const config = { ...ChartConfig.gravity, ...(options.config || {}) };
        
        const { canvas, ctx } = this._getCanvas(containerId, width, height, config);
        
        // Performance optimization: Use willReadFrequently for better read performance
        ctx.imageSmoothingEnabled = config.enableAntialiasing;
        
        // Clear canvas efficiently
        if (config.showTrails) {
            // Fade effect for trails
            ctx.fillStyle = `rgba(248, 249, 250, ${1 - config.trailOpacity})`;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Draw grid if enabled
        if (config.showGrid) {
            this._drawGrid(ctx, width, height, config.gridSize, config.gridColor);
        }
        
        // Batch rendering for performance
        ctx.globalAlpha = config.bodyOpacity;
        
        // Draw bodies - optimized for thousands of objects
        const bodyCount = Math.min(state.bodies.length, config.maxBodies);
        for (let i = 0; i < bodyCount; i++) {
            const body = state.bodies[i];
            const color = config.bodyColors[i % config.bodyColors.length];
            const radius = Math.sqrt(body.mass) * config.bodySizeMultiplier;
            
            ctx.fillStyle = color;
            ctx.strokeStyle = config.bodyStrokeColor;
            ctx.lineWidth = config.bodyStrokeWidth;
            
            ctx.beginPath();
            ctx.arc(body.x, body.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            if (config.bodyStrokeWidth > 0) {
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1.0;
        
        // Draw body count if exceeding display limit
        if (state.bodies.length > config.maxBodies) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Showing ${config.maxBodies} of ${state.bodies.length} bodies`, 10, 20);
        }
    },
    
    /**
     * Draw grid helper
     */
    _drawGrid(ctx, width, height, gridSize, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        
        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        
        ctx.stroke();
    },

    
    /**
     * Render temperature distribution with customization
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from TemperatureSimulator
     * @param {Object} options - Rendering options
     */
    renderTemperature(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const config = { ...ChartConfig.temperature, ...(options.config || {}) };
        
        const { canvas, ctx } = this._getCanvas(containerId, width, height, config);
        
        // Clear canvas
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Find max temperature for scaling
        const maxTemp = Math.max(...state.temperatures, 1);
        
        // Draw temperature bars
        const barWidth = chartWidth / state.points;
        
        ctx.globalAlpha = config.barOpacity;
        for (let i = 0; i < state.temperatures.length; i++) {
            const temp = state.temperatures[i];
            const x = margin.left + i * barWidth;
            const barHeight = (temp / maxTemp) * chartHeight;
            const y = margin.top + chartHeight - barHeight;
            
            // Get color based on configuration
            ctx.fillStyle = getTemperatureColor(temp, maxTemp, config);
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Optional stroke
            if (config.barStroke) {
                ctx.strokeStyle = config.barStrokeColor;
                ctx.lineWidth = config.barStrokeWidth;
                ctx.strokeRect(x, y, barWidth, barHeight);
            }
        }
        ctx.globalAlpha = 1.0;
        
        // Draw axes if enabled
        if (config.showAxes) {
            ctx.strokeStyle = config.axisColor;
            ctx.lineWidth = config.axisWidth;
            ctx.fillStyle = config.axisColor;
            ctx.font = `${config.fontSize}px ${config.fontFamily}`;
            
            // X-axis
            ctx.beginPath();
            ctx.moveTo(margin.left, height - margin.bottom);
            ctx.lineTo(width - margin.right, height - margin.bottom);
            ctx.stroke();
            
            // Y-axis
            ctx.beginPath();
            ctx.moveTo(margin.left, margin.top);
            ctx.lineTo(margin.left, height - margin.bottom);
            ctx.stroke();
            
            // Labels
            ctx.textAlign = 'center';
            ctx.fillText(config.xAxisLabel, width / 2, height - 10);
            
            ctx.save();
            ctx.translate(15, height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(config.yAxisLabel, 0, 0);
            ctx.restore();
            
            // Y-axis tick marks
            if (config.showTickMarks) {
                ctx.textAlign = 'right';
                for (let i = 0; i <= config.tickMarkCount; i++) {
                    const y = margin.top + (chartHeight * i / config.tickMarkCount);
                    const value = maxTemp * (1 - i / config.tickMarkCount);
                    ctx.fillText(value.toFixed(1), margin.left - 5, y + 3);
                }
            }
        }
    },

    
    /**
     * Render trajectory path with customization
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from TrajectorySimulator
     * @param {Object} options - Rendering options
     */
    renderTrajectory(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const config = { ...ChartConfig.trajectory, ...(options.config || {}) };
        
        const { canvas, ctx } = this._getCanvas(containerId, width, height, config);
        
        // Clear canvas
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        
        if (state.trajectory.length === 0) {
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Click "Launch" to see the trajectory', width / 2, height / 2);
            return;
        }
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Find max values for scaling
        const maxX = Math.max(...state.trajectory.map(p => p.x)) * 1.1;
        const maxY = Math.max(...state.trajectory.map(p => p.y)) * 1.1;
        
        // Draw grid if enabled
        if (config.showGrid) {
            ctx.strokeStyle = config.gridColor;
            ctx.globalAlpha = config.gridOpacity;
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= 10; i++) {
                // Vertical grid lines
                const x = margin.left + (chartWidth * i / 10);
                ctx.beginPath();
                ctx.moveTo(x, margin.top);
                ctx.lineTo(x, height - margin.bottom);
                ctx.stroke();
                
                // Horizontal grid lines
                const y = margin.top + (chartHeight * i / 10);
                ctx.beginPath();
                ctx.moveTo(margin.left, y);
                ctx.lineTo(width - margin.right, y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
        }
        
        // Draw trajectory
        const pathColor = config.pathColors[state.resistanceType] || config.pathColors.none;
        ctx.strokeStyle = pathColor;
        ctx.lineWidth = config.pathWidth;
        ctx.globalAlpha = config.pathOpacity;
        ctx.beginPath();
        
        state.trajectory.forEach((point, i) => {
            const x = margin.left + (point.x / maxX) * chartWidth;
            const y = height - margin.bottom - (point.y / maxY) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        // Draw projectile marker at start if enabled
        if (config.showProjectile && state.trajectory.length > 0) {
            const start = state.trajectory[0];
            const x = margin.left + (start.x / maxX) * chartWidth;
            const y = height - margin.bottom - (start.y / maxY) * chartHeight;
            
            ctx.fillStyle = config.projectileColor;
            ctx.beginPath();
            ctx.arc(x, y, config.projectileSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw axes if enabled
        if (config.showAxes) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = config.axisWidth;
            ctx.fillStyle = '#000';
            ctx.font = `${config.fontSize}px Arial`;
            
            // X-axis
            ctx.beginPath();
            ctx.moveTo(margin.left, height - margin.bottom);
            ctx.lineTo(width - margin.right, height - margin.bottom);
            ctx.stroke();
            
            // Y-axis
            ctx.beginPath();
            ctx.moveTo(margin.left, margin.top);
            ctx.lineTo(margin.left, height - margin.bottom);
            ctx.stroke();
            
            // Labels
            ctx.textAlign = 'center';
            ctx.fillText('Horizontal Distance (m)', width / 2, height - 10);
            
            ctx.save();
            ctx.translate(15, height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Height (m)', 0, 0);
            ctx.restore();
            
            // Tick marks
            ctx.textAlign = 'center';
            for (let i = 0; i <= 5; i++) {
                const x = margin.left + (chartWidth * i / 5);
                const value = maxX * i / 5;
                ctx.fillText(value.toFixed(1), x, height - margin.bottom + 15);
            }
            
            ctx.textAlign = 'right';
            for (let i = 0; i <= 5; i++) {
                const y = margin.top + (chartHeight * i / 5);
                const value = maxY * (1 - i / 5);
                ctx.fillText(value.toFixed(1), margin.left - 5, y + 3);
            }
        }
        
        // Draw legend if enabled
        if (config.showLegend) {
            ctx.fillStyle = '#000';
            ctx.textAlign = 'left';
            ctx.font = `bold ${config.fontSize}px Arial`;
            const legendText = `Air Resistance: ${state.resistanceType}`;
            
            if (config.legendPosition === 'topRight') {
                ctx.fillText(legendText, width - margin.right - 150, margin.top + 10);
            }
        }
    }
};

