/**
 * Gravity Simulation Controls Configuration
 * Defines the UI controls for the gravity simulation
 */

export const GravityControls = {
    // Control definitions for the gravity simulation
    controls: [
        {
            id: 'gravity-start',
            type: 'button',
            label: 'Start',
            action: 'start'
        },
        {
            id: 'gravity-stop',
            type: 'button',
            label: 'Stop',
            action: 'stop'
        },
        {
            id: 'gravity-reset',
            type: 'button',
            label: 'Reset',
            action: 'reset'
        },
        {
            id: 'gravity-bodies',
            type: 'number',
            label: 'Bodies',
            min: 1,
            max: 20,
            value: 3,
            action: 'setBodies'
        },
        {
            id: 'gravity-constant',
            type: 'number',
            label: 'G Constant',
            step: 0.1,
            value: 1.0,
            action: 'setG'
        },
        {
            id: 'renderer-mode',
            type: 'select',
            label: 'Renderer',
            options: [
                { value: 'canvas', label: 'Canvas' },
                { value: 'svg', label: 'SVG' }
            ],
            value: 'canvas',
            action: 'setRendererMode'
        }
    ],

    // Helper method to get control by id
    /**
     * Get a control definition by its ID
     * @param {string} id - The control ID to search for
     * @returns {Object|undefined} The control definition or undefined if not found
     */
    getControl(id) {
        return this.controls.find(control => control.id === id);
    },

    // Helper method to get all controls by type
    /**
     * Get all controls of a specific type
     * @param {string} type - The control type to filter by (e.g., 'button', 'number', 'select')
     * @returns {Array} Array of control definitions matching the specified type
     */
    getControlsByType(type) {
        return this.controls.filter(control => control.type === type);
    }
};
