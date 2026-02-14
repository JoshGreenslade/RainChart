/**
 * Simulation Controls Interface - Base interface that all simulation controls must implement
 * This interface defines the required structure for simulation control objects
 * 
 * Note: JavaScript doesn't have built-in interface enforcement. This is a convention-based
 * interface that serves as documentation and validation contract.
 */

export class ISimulationControls {
    /**
     * Validate that a controls object implements the required structure
     * @param {Object} controls - The controls object to validate
     * @throws {Error} If controls doesn't implement required properties
     */
    static validate(controls) {
        // Check for required controls array
        if (!controls.controls || !Array.isArray(controls.controls)) {
            throw new Error('Controls must have a "controls" array property');
        }
        
        // Validate each control definition
        controls.controls.forEach((control, index) => {
            const requiredProps = ['id', 'type', 'label', 'action'];
            for (const prop of requiredProps) {
                if (!(prop in control)) {
                    throw new Error(`Control at index ${index} must have property: ${prop}`);
                }
            }
            
            // Validate type
            const validTypes = ['button', 'number', 'select', 'checkbox', 'text'];
            if (!validTypes.includes(control.type)) {
                throw new Error(`Control at index ${index} has invalid type: ${control.type}`);
            }
        });
        
        // Check for required helper methods
        if (typeof controls.getControl !== 'function') {
            throw new Error('Controls must have a "getControl" method');
        }
        
        if (typeof controls.getControlsByType !== 'function') {
            throw new Error('Controls must have a "getControlsByType" method');
        }
        
        return true;
    }
    
    /**
     * Get all control definitions
     * @param {Object} controls - The controls object
     * @returns {Array} Array of control definitions
     */
    static getControls(controls) {
        ISimulationControls.validate(controls);
        return controls.controls;
    }
    
    /**
     * Get a specific control by ID
     * @param {Object} controls - The controls object
     * @param {string} id - The control ID
     * @returns {Object|undefined} The control definition or undefined
     */
    static getControl(controls, id) {
        ISimulationControls.validate(controls);
        return controls.getControl(id);
    }
    
    /**
     * Get all controls of a specific type
     * @param {Object} controls - The controls object
     * @param {string} type - The control type
     * @returns {Array} Array of matching controls
     */
    static getControlsByType(controls, type) {
        ISimulationControls.validate(controls);
        return controls.getControlsByType(type);
    }
}

/**
 * Required structure for simulation controls objects:
 * 
 * {
 *     controls: [
 *         {
 *             id: string,              // HTML element ID
 *             type: string,            // Control type: 'button', 'number', 'select', 'checkbox', 'text'
 *             label: string,           // Display label
 *             action: string,          // Action name (maps to simulation method)
 *             // Optional properties based on type:
 *             min: number,             // For number inputs
 *             max: number,             // For number inputs
 *             step: number,            // For number inputs
 *             value: any,              // Default value
 *             options: Array           // For select controls: [{value, label}]
 *         }
 *     ],
 *     getControl(id): Object|undefined,
 *     getControlsByType(type): Array
 * }
 */
