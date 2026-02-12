/**
 * D3 Renderer - Implements D3/SVG-specific rendering logic
 * Implements only primitive drawing methods, no simulation-specific logic
 */

class D3Renderer {
    constructor(containerId, options = {}) {
        if (typeof d3 === 'undefined') {
            console.error('D3.js is required for SVG rendering mode');
            throw new Error('D3.js not loaded');
        }
        
        this.containerId = containerId;
        this.elements = [];
        this.idCounter = 0;
        
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
        
        this.container = d3.select(`#${containerId}`);
        this._initSVG();
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
        
        return id;
    }
    
    /**
     * Add a custom path (for complex shapes)
     * @param {string} pathData - SVG path data string
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
        
        // SVG rendering
        const path = this.mainGroup.append('path')
            .attr('id', id)
            .attr('d', pathData)
            .attr('stroke', defaultStyle.stroke)
            .attr('stroke-width', defaultStyle.strokeWidth)
            .attr('fill', defaultStyle.fill)
            .attr('opacity', defaultStyle.opacity);
        
        this.elements.push({ id, type: 'path', element: path, data: { pathData, style: defaultStyle } });
        
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
        
        if (element.element) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.element.attr(key, value);
            });
        }
    }
    
    /**
     * Remove an element
     * @param {string} id - Element ID
     */
    removeElement(id) {
        const index = this.elements.findIndex(e => e.id === id);
        if (index !== -1) {
            if (this.elements[index].element) {
                this.elements[index].element.remove();
            }
            this.elements.splice(index, 1);
        }
    }
    
    /**
     * Clear all elements
     */
    clear() {
        this.mainGroup.selectAll('*').remove();
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
        
        this.svg
            .attr('width', width)
            .attr('height', height);
    }
    
    /**
     * Get the color scheme being used
     */
    getColorScheme() {
        return this.colorScheme;
    }
}
