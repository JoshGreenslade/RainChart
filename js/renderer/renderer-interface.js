/**
 * Renderer Interface - Base interface that all renderer implementations must implement
 * This interface defines the required methods for all rendering backends
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that serves as documentation and validation contract.
 */

export class IRenderer {
    /**
     * Validate that a renderer object implements the required methods
     * @param {Object} renderer - The renderer object to validate
     * @throws {Error} If renderer doesn't implement required methods
     */
    static validate(renderer) {
        const requiredMethods = [
            'addCircle',
            'addLine',
            'addRectangle',
            'addCurve',
            'addPath',
            'addAxis',
            'updateElement',
            'removeElement',
            'clear',
            'resize',
            'getColorScheme'
        ];
        
        for (const method of requiredMethods) {
            if (typeof renderer[method] !== 'function') {
                throw new Error(`Renderer must implement method: ${method}`);
            }
        }
        
        return true;
    }
}

/**
 * Required interface methods for all renderers:
 * 
 * addCircle(x, y, radius, style): string
 *   - Add a circle to the scene
 *   - @param {number} x - X coordinate
 *   - @param {number} y - Y coordinate
 *   - @param {number} radius - Circle radius
 *   - @param {Object} style - Style properties (fill, stroke, etc.)
 *   - @returns {string} Element ID
 * 
 * addLine(x1, y1, x2, y2, style): string
 *   - Add a line to the scene
 *   - @param {number} x1 - Start X coordinate
 *   - @param {number} y1 - Start Y coordinate
 *   - @param {number} x2 - End X coordinate
 *   - @param {number} y2 - End Y coordinate
 *   - @param {Object} style - Style properties (stroke, strokeWidth, etc.)
 *   - @returns {string} Element ID
 * 
 * addRectangle(x, y, width, height, style): string
 *   - Add a rectangle to the scene
 *   - @param {number} x - X coordinate of top-left corner
 *   - @param {number} y - Y coordinate of top-left corner
 *   - @param {number} width - Rectangle width
 *   - @param {number} height - Rectangle height
 *   - @param {Object} style - Style properties (fill, stroke, etc.)
 *   - @returns {string} Element ID
 * 
 * addCurve(points, style): string
 *   - Add a curve to the scene
 *   - @param {Array<Array<number>>} points - Array of [x, y] coordinate pairs
 *   - @param {Object} style - Style properties (stroke, strokeWidth, etc.)
 *   - @returns {string} Element ID
 * 
 * addPath(pathData, style): string
 *   - Add a path to the scene
 *   - @param {string} pathData - SVG path data string
 *   - @param {Object} style - Style properties (stroke, fill, etc.)
 *   - @returns {string} Element ID
 * 
 * addAxis(type, position, min, max, options): string
 *   - Add an axis to the scene
 *   - @param {string} type - Axis type ('x' or 'y')
 *   - @param {number} position - Position along the perpendicular axis
 *   - @param {number} min - Minimum value
 *   - @param {number} max - Maximum value
 *   - @param {Object} options - Additional options (ticks, labels, etc.)
 *   - @returns {string} Element ID
 * 
 * updateElement(id, attributes): void
 *   - Update an existing element
 *   - @param {string} id - Element ID
 *   - @param {Object} attributes - Attributes to update
 * 
 * removeElement(id): void
 *   - Remove an element from the scene
 *   - @param {string} id - Element ID
 * 
 * clear(): void
 *   - Clear all elements from the scene
 * 
 * resize(width, height): void
 *   - Resize the rendering surface
 *   - @param {number} width - New width
 *   - @param {number} height - New height
 * 
 * getColorScheme(): Object
 *   - Get the current color scheme
 *   - @returns {Object} Color scheme object with background, foreground, etc.
 */
