/**
 * Primitive Renderer - Simple drawing interface supporting both Canvas and SVG (via D3)
 * Provides basic drawing commands: addCircle, addLine, addRectangle, addCurve, addPath, addAxis
 * Designed for building custom visualizations
 */

class PrimitiveRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.elements = [];
        this.idCounter = 0;
        this.renderMode = options.renderMode || 'svg'; // 'svg' or 'canvas'
        
        // Generate random HSL color scheme
        this.colorScheme = this._generateColorScheme();
        
        // Set default options
        this.options = {
            width: options.width || window.innerWidth,
            height: options.height || window.innerHeight,
            background: options.background || this.colorScheme.background,
            foreground: options.foreground || this.colorScheme.foreground,
            ...options
        };
        
        if (this.renderMode === 'canvas') {
            this._initCanvas();
        } else {
            if (typeof d3 === 'undefined') {
                console.error('D3.js is required for SVG rendering mode');
                throw new Error('D3.js not loaded');
            }
            this.container = d3.select(`#${containerId}`);
            this._initSVG();
        }
    }
    
    /**
     * Generate HSL color scheme with random hue, 50% saturation, 20%/80% lightness
     */
    _generateColorScheme() {
        const hue = Math.floor(Math.random() * 360);
        const background = `hsl(${hue}, 50%, 20%)`; // Dark background
        const foreground = `hsl(${hue}, 50%, 80%)`; // Light foreground
        
        // Generate object colors with different hues but same saturation/lightness rules
        const objectColors = [];
        for (let i = 0; i < 10; i++) {
            const objectHue = (hue + (i * 36)) % 360; // Spread hues evenly
            // Use 80% lightness for objects to contrast with 20% dark background
            const lightness = 80;
            objectColors.push(`hsl(${objectHue}, 50%, ${lightness}%)`);
        }
        
        return {
            hue,
            background,
            foreground,
            objectColors
        };
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
     * Initialize SVG canvas
     */
    _initSVG() {
        // Clear container
        this.container.html('');
        
        // Create SVG
        this.svg = this.container.append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('background', this.options.background)
            .style('display', 'block');
        
        // Create main group for all elements
        this.mainGroup = this.svg.append('g')
            .attr('class', 'main-group');
    }
    
    /**
     * Get next color from the color scheme
     */
    _getNextColor() {
        const colors = this.colorScheme.objectColors;
        return colors[this.idCounter % colors.length];
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
            stroke: this.colorScheme.foreground,
            strokeWidth: 1,
            opacity: 0.8,
            ...style
        };
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering
            const circle = this.mainGroup.append('circle')
                .attr('id', id)
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', radius)
                .attr('fill', defaultStyle.fill)
                .attr('stroke', defaultStyle.stroke)
                .attr('stroke-width', defaultStyle.strokeWidth)
                .attr('opacity', defaultStyle.opacity);
            
            this.elements.push({ id, type: 'circle', element: circle, data: { x, y, radius, style: defaultStyle } });
        }
        
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
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering
            const line = this.mainGroup.append('line')
                .attr('id', id)
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2)
                .attr('stroke', defaultStyle.stroke)
                .attr('stroke-width', defaultStyle.strokeWidth)
                .attr('opacity', defaultStyle.opacity);
            
            this.elements.push({ id, type: 'line', element: line, data: { x1, y1, x2, y2, style: defaultStyle } });
        }
        
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
            stroke: this.colorScheme.foreground,
            strokeWidth: 1,
            opacity: 0.6,
            ...style
        };
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering
            const rect = this.mainGroup.append('rect')
                .attr('id', id)
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', defaultStyle.fill)
                .attr('stroke', defaultStyle.stroke)
                .attr('stroke-width', defaultStyle.strokeWidth)
                .attr('opacity', defaultStyle.opacity);
            
            this.elements.push({ id, type: 'rectangle', element: rect, data: { x, y, width, height, style: defaultStyle } });
        }
        
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
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering with D3 curve
            const lineGenerator = d3.line()
                .x(d => d.x)
                .y(d => d.y)
                .curve(d3.curveCatmullRom.alpha(0.5));
            
            const path = this.mainGroup.append('path')
                .attr('id', id)
                .attr('d', lineGenerator(points))
                .attr('stroke', defaultStyle.stroke)
                .attr('stroke-width', defaultStyle.strokeWidth)
                .attr('fill', defaultStyle.fill)
                .attr('opacity', defaultStyle.opacity);
            
            this.elements.push({ id, type: 'curve', element: path, data: { points, style: defaultStyle } });
        }
        
        return id;
    }
    
    /**
     * Add a custom path (for complex shapes)
     * @param {string} pathData - SVG path data string (for SVG mode) or array of commands (for canvas mode)
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
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering
            const path = this.mainGroup.append('path')
                .attr('id', id)
                .attr('d', pathData)
                .attr('stroke', defaultStyle.stroke)
                .attr('stroke-width', defaultStyle.strokeWidth)
                .attr('fill', defaultStyle.fill)
                .attr('opacity', defaultStyle.opacity);
            
            this.elements.push({ id, type: 'path', element: path, data: { pathData, style: defaultStyle } });
        }
        
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
            stroke: this.colorScheme.foreground,
            strokeWidth: 1,
            fontSize: 12,
            ...options
        };
        
        const isXAxis = type.toLowerCase() === 'x';
        const length = isXAxis ? this.options.width : this.options.height;
        const tickSpacing = (max - min) / defaultOptions.ticks;
        
        if (this.renderMode === 'canvas') {
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
        } else {
            // SVG rendering
            const axisGroup = this.mainGroup.append('g')
                .attr('id', id)
                .attr('class', 'axis');
            
            if (isXAxis) {
                // X axis line
                axisGroup.append('line')
                    .attr('x1', 0)
                    .attr('y1', position)
                    .attr('x2', length)
                    .attr('y2', position)
                    .attr('stroke', defaultOptions.stroke)
                    .attr('stroke-width', defaultOptions.strokeWidth);
                
                // Ticks and labels
                for (let i = 0; i <= defaultOptions.ticks; i++) {
                    const x = (i / defaultOptions.ticks) * length;
                    const value = min + (i * tickSpacing);
                    
                    // Tick
                    axisGroup.append('line')
                        .attr('x1', x)
                        .attr('y1', position)
                        .attr('x2', x)
                        .attr('y2', position + defaultOptions.tickLength)
                        .attr('stroke', defaultOptions.stroke)
                        .attr('stroke-width', defaultOptions.strokeWidth);
                    
                    // Label
                    if (defaultOptions.showLabels) {
                        axisGroup.append('text')
                            .attr('x', x)
                            .attr('y', position + defaultOptions.labelOffset + defaultOptions.tickLength)
                            .attr('text-anchor', 'middle')
                            .attr('fill', defaultOptions.stroke)
                            .attr('font-size', defaultOptions.fontSize)
                            .text(value.toFixed(1));
                    }
                }
            } else {
                // Y axis line
                axisGroup.append('line')
                    .attr('x1', position)
                    .attr('y1', 0)
                    .attr('x2', position)
                    .attr('y2', length)
                    .attr('stroke', defaultOptions.stroke)
                    .attr('stroke-width', defaultOptions.strokeWidth);
                
                // Ticks and labels
                for (let i = 0; i <= defaultOptions.ticks; i++) {
                    const y = (i / defaultOptions.ticks) * length;
                    const value = max - (i * tickSpacing); // Inverted for Y axis
                    
                    // Tick
                    axisGroup.append('line')
                        .attr('x1', position - defaultOptions.tickLength)
                        .attr('y1', y)
                        .attr('x2', position)
                        .attr('y2', y)
                        .attr('stroke', defaultOptions.stroke)
                        .attr('stroke-width', defaultOptions.strokeWidth);
                    
                    // Label
                    if (defaultOptions.showLabels) {
                        axisGroup.append('text')
                            .attr('x', position - defaultOptions.labelOffset)
                            .attr('y', y + 5)
                            .attr('text-anchor', 'end')
                            .attr('fill', defaultOptions.stroke)
                            .attr('font-size', defaultOptions.fontSize)
                            .text(value.toFixed(1));
                    }
                }
            }
            
            this.elements.push({ id, type: 'axis', element: axisGroup, data: { type, position, min, max, options: defaultOptions } });
        }
        
        return id;
    }
    
    /**
     * Update an element's position (for animations)
     * @param {string} id - Element ID
     * @param {Object} attributes - Attributes to update
     */
    updateElement(id, attributes) {
        const element = this.elements.find(e => e.id === id);
        if (!element) return;
        
        if (this.renderMode === 'svg' && element.element) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.element.attr(key, value);
            });
        }
        // For canvas mode, would need to redraw entire canvas
    }
    
    /**
     * Remove an element
     * @param {string} id - Element ID
     */
    removeElement(id) {
        const index = this.elements.findIndex(e => e.id === id);
        if (index !== -1) {
            if (this.renderMode === 'svg' && this.elements[index].element) {
                this.elements[index].element.remove();
            }
            this.elements.splice(index, 1);
        }
        // For canvas mode, would need to redraw entire canvas
    }
    
    /**
     * Clear all elements
     */
    clear() {
        if (this.renderMode === 'canvas') {
            this.ctx.fillStyle = this.options.background;
            this.ctx.fillRect(0, 0, this.options.width, this.options.height);
        } else {
            this.mainGroup.selectAll('*').remove();
        }
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
        
        if (this.renderMode === 'canvas') {
            this.canvas.width = width;
            this.canvas.height = height;
        } else {
            this.svg
                .attr('width', width)
                .attr('height', height);
        }
    }
    
    /**
     * Get the color scheme being used
     */
    getColorScheme() {
        return this.colorScheme;
    }
}
