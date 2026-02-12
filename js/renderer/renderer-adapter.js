/**
 * Renderer Adapter - Translation Layer
 * Provides a unified interface for different rendering backends (Canvas, D3.js, etc.)
 * The application layer interacts only with this adapter, never directly with renderers
 */

class RendererAdapter {
    constructor(type = 'canvas') {
        this.type = type;
        this.backend = null;
        this.setRenderer(type);
    }
    
    /**
     * Set the rendering backend
     * @param {string} type - 'canvas' or 'd3'
     */
    setRenderer(type) {
        this.type = type;
        
        switch(type) {
            case 'd3':
                if (typeof D3Renderer === 'undefined') {
                    console.warn('D3Renderer not available, falling back to Canvas');
                    this.backend = new CanvasRenderer();
                    this.type = 'canvas';
                } else {
                    this.backend = new D3Renderer();
                }
                break;
            case 'canvas':
            default:
                this.backend = new CanvasRenderer();
                this.type = 'canvas';
                break;
        }
    }
    
    /**
     * Get current renderer type
     */
    getRendererType() {
        return this.type;
    }
    
    /**
     * Unified interface for rendering gravity simulation
     * @param {string} containerId - DOM element ID
     * @param {Object} state - Physics state
     * @param {Object} options - Rendering options
     */
    renderGravity(containerId, state, options = {}) {
        this.backend.renderGravity(containerId, state, options);
    }
    
    /**
     * Unified interface for rendering temperature simulation
     * @param {string} containerId - DOM element ID
     * @param {Object} state - Physics state
     * @param {Object} options - Rendering options
     */
    renderTemperature(containerId, state, options = {}) {
        this.backend.renderTemperature(containerId, state, options);
    }
    
    /**
     * Unified interface for rendering trajectory simulation
     * @param {string} containerId - DOM element ID
     * @param {Object} state - Physics state
     * @param {Object} options - Rendering options
     */
    renderTrajectory(containerId, state, options = {}) {
        this.backend.renderTrajectory(containerId, state, options);
    }
    
    /**
     * Clear a specific chart
     * @param {string} containerId - DOM element ID
     */
    clear(containerId) {
        if (this.backend.clear) {
            this.backend.clear(containerId);
        } else {
            // Fallback: clear container
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
        }
    }
    
    /**
     * Destroy renderer and clean up resources
     */
    destroy() {
        if (this.backend.destroy) {
            this.backend.destroy();
        }
    }
}

/**
 * Renderer Factory - Creates appropriate renderer instances
 */
class RendererFactory {
    static create(type = 'canvas', config = {}) {
        return new RendererAdapter(type);
    }
    
    static getAvailableRenderers() {
        const renderers = ['canvas'];
        
        // Check if D3 is available
        if (typeof d3 !== 'undefined') {
            renderers.push('d3');
        }
        
        return renderers;
    }
}
