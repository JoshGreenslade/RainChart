/**
 * Canvas Renderer - Implements Canvas-specific rendering logic
 * Implements only primitive drawing methods, no simulation-specific logic
 */

export class CanvasRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.elements = [];
        this.idCounter = 0;
        
        // Set default options - colors come from options or defaults
        this.options = {
            width: options.width || window.innerWidth,
            height: options.height || window.innerHeight,
            background: options.background || '#000000',
            foreground: options.foreground || '#ffffff',
            ...options
        };
        
        // Simple default colors for objects
        this.defaultColors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
            '#1abc9c', '#e67e22', '#34495e', '#16a085', '#27ae60'
        ];
        
        this._initCanvas();
    }
    
    /**
     * Initialize Canvas
     */
    _initCanvas() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.background = this.options.background;
        this.canvas.style.display = 'block';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Clear canvas with background color
        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.options.width, this.options.height);
    }
    
    /**
     * Get next color from the default colors
     */
    _getNextColor() {
        return this.defaultColors[this.idCounter % this.defaultColors.length];
    }
    
    /**
     * Add a circle to the canvas
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} radius - Circle radius
     * @param {Object} style - Style options (fill, stroke, strokeWidth, opacity, etc.)
     * @returns {string} - Element ID
     */
    addCircle(x, y, radius, style = {}) {
        const id = `circle-${this.idCounter++}`;
        const defaultStyle = {
            fill: this._getNextColor(),
            stroke: this.options.foreground,
            strokeWidth: 1,
            opacity: 0.8,
            ...style
        };
        
        // Canvas rendering
        this.ctx.save();
        this.ctx.globalAlpha = defaultStyle.opacity;
        this.ctx.fillStyle = defaultStyle.fill;
        this.ctx.strokeStyle = defaultStyle.stroke;
        this.ctx.lineWidth = defaultStyle.strokeWidth;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        if (defaultStyle.strokeWidth > 0) {
            this.ctx.stroke();
        }
        this.ctx.restore();
        
        this.elements.push({ id, type: 'circle', data: { x, y, radius, style: defaultStyle } });
        
        return id;
    }
    
    /**
     * Add a line to the canvas
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @param {Object} style - Style options (stroke, strokeWidth, opacity, etc.)
     * @returns {string} - Element ID
     */
    addLine(x1, y1, x2, y2, style = {}) {
        const id = `line-${this.idCounter++}`;
        const defaultStyle = {
            stroke: this._getNextColor(),
            strokeWidth: 2,
            opacity: 0.8,
            ...style
        };
        
        // Canvas rendering
        this.ctx.save();
        this.ctx.globalAlpha = defaultStyle.opacity;
        this.ctx.strokeStyle = defaultStyle.stroke;
        this.ctx.lineWidth = defaultStyle.strokeWidth;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
        
        this.elements.push({ id, type: 'line', data: { x1, y1, x2, y2, style: defaultStyle } });
        
        return id;
    }
    
    /**
     * Add a rectangle to the canvas
     * @param {number} x - X coordinate (top-left corner)
     * @param {number} y - Y coordinate (top-left corner)
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {Object} style - Style options (fill, stroke, strokeWidth, opacity, etc.)
     * @returns {string} - Element ID
     */
    addRectangle(x, y, width, height, style = {}) {
        const id = `rect-${this.idCounter++}`;
        const defaultStyle = {
            fill: this._getNextColor(),
            stroke: this.options.foreground,
            strokeWidth: 1,
            opacity: 0.6,
            ...style
        };
        
        // Canvas rendering
        this.ctx.save();
        this.ctx.globalAlpha = defaultStyle.opacity;
        this.ctx.fillStyle = defaultStyle.fill;
        this.ctx.strokeStyle = defaultStyle.stroke;
        this.ctx.lineWidth = defaultStyle.strokeWidth;
        
        this.ctx.fillRect(x, y, width, height);
        if (defaultStyle.strokeWidth > 0) {
            this.ctx.strokeRect(x, y, width, height);
        }
        this.ctx.restore();
        
        this.elements.push({ id, type: 'rectangle', data: { x, y, width, height, style: defaultStyle } });
        
        return id;
    }
    
    /**
     * Add a smooth curve through points
     * @param {Array} points - Array of {x, y} points
     * @param {Object} style - Style options (stroke, strokeWidth, fill, opacity, etc.)
     * @returns {string} - Element ID
     */
    addCurve(points, style = {}) {
        const id = `curve-${this.idCounter++}`;
        const defaultStyle = {
            stroke: this._getNextColor(),
            strokeWidth: 2,
            fill: 'none',
            opacity: 0.8,
            ...style
        };
        
        // Canvas rendering with smooth curve
        this.ctx.save();
        this.ctx.globalAlpha = defaultStyle.opacity;
        this.ctx.strokeStyle = defaultStyle.stroke;
        this.ctx.lineWidth = defaultStyle.strokeWidth;
        
        if (points.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            // Simple curve drawing - can be enhanced with bezier
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            
            this.ctx.stroke();
        }
        this.ctx.restore();
        
        this.elements.push({ id, type: 'curve', data: { points, style: defaultStyle } });
        
        return id;
    }
    
    /**
     * Add a custom path (for complex shapes)
     * @param {string} pathData - SVG path data string or array of commands
     * @param {Object} style - Style options (stroke, strokeWidth, fill, opacity, etc.)
     * @returns {string} - Element ID
     */
    addPath(pathData, style = {}) {
        const id = `path-${this.idCounter++}`;
        const defaultStyle = {
            stroke: this._getNextColor(),
            strokeWidth: 2,
            fill: 'none',
            opacity: 0.8,
            ...style
        };
        
        // Canvas rendering - pathData should be a Path2D object or array of commands
        this.ctx.save();
        this.ctx.globalAlpha = defaultStyle.opacity;
        this.ctx.strokeStyle = defaultStyle.stroke;
        this.ctx.lineWidth = defaultStyle.strokeWidth;
        
        if (typeof pathData === 'string') {
            const path2D = new Path2D(pathData);
            this.ctx.stroke(path2D);
        }
        
        this.ctx.restore();
        
        this.elements.push({ id, type: 'path', data: { pathData, style: defaultStyle } });
        
        return id;
    }
    
    /**
     * Add an axis (X or Y)
     * @param {string} type - 'x' or 'y'
     * @param {number} position - Position of the axis
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {Object} options - Options (ticks, labels, style, etc.)
     * @returns {string} - Element ID
     */
    addAxis(type, position, min, max, options = {}) {
        const id = `axis-${this.idCounter++}`;
        const defaultOptions = {
            ticks: 10,
            showLabels: true,
            labelOffset: 10,
            tickLength: 5,
            stroke: this.options.foreground,
            strokeWidth: 1,
            fontSize: 12,
            ...options
        };
        
        const isXAxis = type.toLowerCase() === 'x';
        const length = isXAxis ? this.options.width : this.options.height;
        const tickSpacing = (max - min) / defaultOptions.ticks;
        
        // Canvas rendering
        this.ctx.save();
        this.ctx.strokeStyle = defaultOptions.stroke;
        this.ctx.fillStyle = defaultOptions.stroke;
        this.ctx.lineWidth = defaultOptions.strokeWidth;
        this.ctx.font = `${defaultOptions.fontSize}px sans-serif`;
        
        // Draw main axis line
        if (isXAxis) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, position);
            this.ctx.lineTo(length, position);
            this.ctx.stroke();
            
            // Draw ticks and labels
            for (let i = 0; i <= defaultOptions.ticks; i++) {
                const x = (i / defaultOptions.ticks) * length;
                const value = min + (i * tickSpacing);
                
                // Tick
                this.ctx.beginPath();
                this.ctx.moveTo(x, position);
                this.ctx.lineTo(x, position + defaultOptions.tickLength);
                this.ctx.stroke();
                
                // Label
                if (defaultOptions.showLabels) {
                    this.ctx.fillText(value.toFixed(1), x - 10, position + defaultOptions.labelOffset + defaultOptions.tickLength);
                }
            }
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(position, 0);
            this.ctx.lineTo(position, length);
            this.ctx.stroke();
            
            // Draw ticks and labels
            for (let i = 0; i <= defaultOptions.ticks; i++) {
                const y = (i / defaultOptions.ticks) * length;
                const value = max - (i * tickSpacing); // Inverted for Y axis
                
                // Tick
                this.ctx.beginPath();
                this.ctx.moveTo(position - defaultOptions.tickLength, y);
                this.ctx.lineTo(position, y);
                this.ctx.stroke();
                
                // Label
                if (defaultOptions.showLabels) {
                    this.ctx.fillText(value.toFixed(1), position - defaultOptions.labelOffset - 30, y + 5);
                }
            }
        }
        
        this.ctx.restore();
        
        this.elements.push({ id, type: 'axis', data: { type, position, min, max, options: defaultOptions } });
        
        return id;
    }
    
    /**
     * Update an element's position (for animations)
     * Canvas mode requires redrawing entire canvas
     * @param {string} id - Element ID
     * @param {Object} attributes - Attributes to update
     */
    updateElement(id, attributes) {
        // For canvas mode, would need to redraw entire canvas
        // This is a limitation of canvas rendering
    }
    
    /**
     * Remove an element
     * Canvas mode requires redrawing entire canvas
     * @param {string} id - Element ID
     */
    removeElement(id) {
        const index = this.elements.findIndex(e => e.id === id);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
        // For canvas mode, would need to redraw entire canvas
    }
    
    /**
     * Clear all elements
     */
    clear() {
        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.options.width, this.options.height);
        this.elements = [];
        this.idCounter = 0;
    }
    
    /**
     * Resize the canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.options.width = width;
        this.options.height = height;
        
        this.canvas.width = width;
        this.canvas.height = height;
    }
    
    /**
     * Get the color scheme being used
     */
    getColorScheme() {
        return {
            background: this.options.background,
            foreground: this.options.foreground,
            objectColors: this.defaultColors
        };
    }
}
