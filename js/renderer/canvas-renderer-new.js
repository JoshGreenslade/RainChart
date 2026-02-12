/**
 * Canvas Renderer - Extends PrimitiveRenderer for Canvas rendering
 * Implements only primitive drawing methods, no simulation-specific logic
 */

class CanvasRenderer extends PrimitiveRenderer {
    constructor(containerId, options = {}) {
        // Force canvas mode
        super(containerId, { ...options, renderMode: 'canvas' });
    }
}
