/**
 * Primitive Renderer - Simple drawing interface using D3.js primitives
 * Provides basic drawing commands: AddCircle, AddLine, AddRectangle, AddCurve, AddPath
 * Designed for building custom visualizations like quantum wave propagation
 */

class PrimitiveRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
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
            // Alternate between light and dark for contrast with background
            const lightness = background.includes('20%') ? 80 : 20;
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
     * @param {Object} style - Style options (fill, stroke, opacity, etc.)
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
        
        const circle = this.mainGroup.append('circle')
            .attr('id', id)
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius)
            .attr('fill', defaultStyle.fill)
            .attr('stroke', defaultStyle.stroke)
            .attr('stroke-width', defaultStyle.strokeWidth)
            .attr('opacity', defaultStyle.opacity);
        
        this.elements.push({ id, type: 'circle', element: circle });
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
        
        const line = this.mainGroup.append('line')
            .attr('id', id)
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', defaultStyle.stroke)
            .attr('stroke-width', defaultStyle.strokeWidth)
            .attr('opacity', defaultStyle.opacity);
        
        this.elements.push({ id, type: 'line', element: line });
        return id;
    }
    
    /**
     * Add a rectangle to the canvas
     * @param {number} x - X coordinate (top-left corner)
     * @param {number} y - Y coordinate (top-left corner)
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {Object} style - Style options (fill, stroke, opacity, etc.)
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
        
        this.elements.push({ id, type: 'rectangle', element: rect });
        return id;
    }
    
    /**
     * Add a smooth curve (quadratic or cubic bezier)
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
        
        // Create a smooth curve using D3's curve functions
        const lineGenerator = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveCatmullRom.alpha(0.5)); // Smooth curve
        
        const path = this.mainGroup.append('path')
            .attr('id', id)
            .attr('d', lineGenerator(points))
            .attr('stroke', defaultStyle.stroke)
            .attr('stroke-width', defaultStyle.strokeWidth)
            .attr('fill', defaultStyle.fill)
            .attr('opacity', defaultStyle.opacity);
        
        this.elements.push({ id, type: 'curve', element: path });
        return id;
    }
    
    /**
     * Add a custom path (for complex shapes like waves)
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
        
        const path = this.mainGroup.append('path')
            .attr('id', id)
            .attr('d', pathData)
            .attr('stroke', defaultStyle.stroke)
            .attr('stroke-width', defaultStyle.strokeWidth)
            .attr('fill', defaultStyle.fill)
            .attr('opacity', defaultStyle.opacity);
        
        this.elements.push({ id, type: 'path', element: path });
        return id;
    }
    
    /**
     * Add a sine wave (useful for quantum wave visualization)
     * @param {number} startX - Starting X position
     * @param {number} centerY - Center Y position
     * @param {number} width - Wave width
     * @param {number} amplitude - Wave amplitude
     * @param {number} frequency - Wave frequency
     * @param {Object} style - Style options
     * @returns {string} - Element ID
     */
    addWave(startX, centerY, width, amplitude, frequency, style = {}) {
        const points = [];
        const steps = 100;
        
        for (let i = 0; i <= steps; i++) {
            const x = startX + (width * i / steps);
            const phase = (i / steps) * frequency * Math.PI * 2;
            const y = centerY + amplitude * Math.sin(phase);
            points.push({ x, y });
        }
        
        return this.addCurve(points, style);
    }
    
    /**
     * Add a spreading quantum wave packet visualization
     * @param {number} centerX - Center X position
     * @param {number} centerY - Center Y position
     * @param {number} time - Time parameter for animation
     * @param {Object} options - Wave options (spread, wavelength, etc.)
     * @returns {Array} - Array of element IDs
     */
    addQuantumWavePacket(centerX, centerY, time, options = {}) {
        const {
            initialSpread = 50,
            wavelength = 20,
            numWaves = 5,
            maxAmplitude = 30
        } = options;
        
        const spread = initialSpread * (1 + time * 0.1); // Wave spreads over time
        const elementIds = [];
        
        // Create multiple wave components
        for (let i = 0; i < numWaves; i++) {
            const amplitude = maxAmplitude * Math.exp(-(i / numWaves) * 2);
            const phase = i * Math.PI / numWaves;
            
            const points = [];
            const steps = 100;
            
            for (let j = 0; j <= steps; j++) {
                const angle = (j / steps) * Math.PI * 2;
                const r = spread;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                
                // Add wave modulation
                const modulation = amplitude * Math.sin(angle * wavelength + phase + time);
                const modulatedR = r + modulation;
                
                points.push({
                    x: centerX + modulatedR * Math.cos(angle),
                    y: centerY + modulatedR * Math.sin(angle)
                });
            }
            
            const opacity = 0.3 + (0.5 * (numWaves - i) / numWaves);
            const id = this.addCurve(points, { opacity });
            elementIds.push(id);
        }
        
        return elementIds;
    }
    
    /**
     * Update an element's position (for animations)
     * @param {string} id - Element ID
     * @param {Object} attributes - Attributes to update
     */
    updateElement(id, attributes) {
        const element = this.elements.find(e => e.id === id);
        if (!element) return;
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.element.attr(key, value);
        });
    }
    
    /**
     * Remove an element
     * @param {string} id - Element ID
     */
    removeElement(id) {
        const index = this.elements.findIndex(e => e.id === id);
        if (index !== -1) {
            this.elements[index].element.remove();
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
