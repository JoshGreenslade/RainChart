/**
 * Base Renderer - Delegates to concrete renderer implementations
 * Acts as a factory and adapter that routes calls to Canvas, D3, or WGSL renderers
 */

import { CanvasRenderer } from './canvas-renderer.js';
import { D3Renderer } from './d3-renderer.js';
import { WGSLRenderer } from './wgsl-renderer.js';

export class BaseRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.renderMode = options.renderMode || 'svg'; // 'svg', 'canvas', or 'webgpu'
        
        // Create the concrete renderer based on mode
        if (this.renderMode === 'canvas') {
            this.renderer = new CanvasRenderer(containerId, options);
        } else if (this.renderMode === 'webgpu') {
            this.renderer = new WGSLRenderer(containerId, options);
        } else {
            this.renderer = new D3Renderer(containerId, options);
        }
    }
    
    /**
     * Add a circle to the scene
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} radius - Circle radius
     * @param {Object} style - Style properties (fill, stroke, etc.)
     * @returns {string} Element ID
     */
    addCircle(x, y, radius, style = {}) {
        return this.renderer.addCircle(x, y, radius, style);
    }
    
    /**
     * Add a line to the scene
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @param {Object} style - Style properties (stroke, strokeWidth, etc.)
     * @returns {string} Element ID
     */
    addLine(x1, y1, x2, y2, style = {}) {
        return this.renderer.addLine(x1, y1, x2, y2, style);
    }
    
    /**
     * Add a rectangle to the scene
     * @param {number} x - X coordinate of top-left corner
     * @param {number} y - Y coordinate of top-left corner
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {Object} style - Style properties (fill, stroke, etc.)
     * @returns {string} Element ID
     */
    addRectangle(x, y, width, height, style = {}) {
        return this.renderer.addRectangle(x, y, width, height, style);
    }
    
    /**
     * Add a curve to the scene
     * @param {Array<Array<number>>} points - Array of [x, y] coordinate pairs
     * @param {Object} style - Style properties (stroke, strokeWidth, etc.)
     * @returns {string} Element ID
     */
    addCurve(points, style = {}) {
        return this.renderer.addCurve(points, style);
    }
    
    /**
     * Add a path to the scene
     * @param {string} pathData - SVG path data string
     * @param {Object} style - Style properties (stroke, fill, etc.)
     * @returns {string} Element ID
     */
    addPath(pathData, style = {}) {
        return this.renderer.addPath(pathData, style);
    }
    
    /**
     * Add an axis to the scene
     * @param {string} type - Axis type ('x' or 'y')
     * @param {number} position - Position along the perpendicular axis
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {Object} options - Additional options (ticks, labels, etc.)
     * @returns {string} Element ID
     */
    addAxis(type, position, min, max, options = {}) {
        return this.renderer.addAxis(type, position, min, max, options);
    }
    
    /**
     * Update an existing element
     * @param {string} id - Element ID
     * @param {Object} attributes - Attributes to update
     */
    updateElement(id, attributes) {
        return this.renderer.updateElement(id, attributes);
    }
    
    /**
     * Remove an element from the scene
     * @param {string} id - Element ID
     */
    removeElement(id) {
        return this.renderer.removeElement(id);
    }
    
    /**
     * Clear all elements from the scene
     */
    clear() {
        return this.renderer.clear();
    }
    
    /**
     * Resize the rendering surface
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        return this.renderer.resize(width, height);
    }
    
    /**
     * Get the current color scheme
     * @returns {Object} Color scheme object with background, foreground, etc.
     */
    getColorScheme() {
        return this.renderer.getColorScheme();
    }
}
