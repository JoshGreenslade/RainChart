/**
 * Primitive Renderer - DEPRECATED: Use BaseRenderer instead
 * This class is maintained for backward compatibility
 * Delegates to BaseRenderer which routes calls to Canvas or D3 renderers
 */

class PrimitiveRenderer extends BaseRenderer {
    constructor(containerId, options = {}) {
        super(containerId, options);
    }
}

