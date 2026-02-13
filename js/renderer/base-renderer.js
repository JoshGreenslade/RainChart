/**
 * Base Renderer - Delegates to concrete renderer implementations
 * Acts as a factory and adapter that routes calls to Canvas or D3 renderers
 */

import { CanvasRenderer } from './canvas-renderer.js';
import { D3Renderer } from './d3-renderer.js';

export class BaseRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.renderMode = options.renderMode || 'svg'; // 'svg' or 'canvas'
        
        // Create the concrete renderer based on mode
        if (this.renderMode === 'canvas') {
            this.renderer = new CanvasRenderer(containerId, options);
        } else {
            this.renderer = new D3Renderer(containerId, options);
        }
    }
    
    /**
     * Delegate addCircle to concrete renderer
     */
    addCircle(x, y, radius, style = {}) {
        return this.renderer.addCircle(x, y, radius, style);
    }
    
    /**
     * Delegate addLine to concrete renderer
     */
    addLine(x1, y1, x2, y2, style = {}) {
        return this.renderer.addLine(x1, y1, x2, y2, style);
    }
    
    /**
     * Delegate addRectangle to concrete renderer
     */
    addRectangle(x, y, width, height, style = {}) {
        return this.renderer.addRectangle(x, y, width, height, style);
    }
    
    /**
     * Delegate addCurve to concrete renderer
     */
    addCurve(points, style = {}) {
        return this.renderer.addCurve(points, style);
    }
    
    /**
     * Delegate addPath to concrete renderer
     */
    addPath(pathData, style = {}) {
        return this.renderer.addPath(pathData, style);
    }
    
    /**
     * Delegate addAxis to concrete renderer
     */
    addAxis(type, position, min, max, options = {}) {
        return this.renderer.addAxis(type, position, min, max, options);
    }
    
    /**
     * Delegate updateElement to concrete renderer
     */
    updateElement(id, attributes) {
        return this.renderer.updateElement(id, attributes);
    }
    
    /**
     * Delegate removeElement to concrete renderer
     */
    removeElement(id) {
        return this.renderer.removeElement(id);
    }
    
    /**
     * Delegate clear to concrete renderer
     */
    clear() {
        return this.renderer.clear();
    }
    
    /**
     * Delegate resize to concrete renderer
     */
    resize(width, height) {
        return this.renderer.resize(width, height);
    }
    
    /**
     * Delegate getColorScheme to concrete renderer
     */
    getColorScheme() {
        return this.renderer.getColorScheme();
    }
}
