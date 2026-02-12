/**
 * D3 Renderer - Extends PrimitiveRenderer for D3/SVG rendering
 * Implements only primitive drawing methods, no simulation-specific logic
 */

class D3Renderer extends PrimitiveRenderer {
    constructor(containerId, options = {}) {
        // Force SVG mode
        super(containerId, { ...options, renderMode: 'svg' });
    }
}
