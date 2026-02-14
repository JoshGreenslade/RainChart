/**
 * Simulation Controls Interface - Base interface that all simulation controls must implement
 * This interface defines the required structure for simulation control objects
 * and provides methods to dynamically create control UI elements
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
    
    /**
     * Create DOM elements for all controls and append them to the container
     * @param {Object} controls - The controls object
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Optional configuration
     * @returns {void}
     */
    static createControlElements(controls, containerId = 'controls', options = {}) {
        ISimulationControls.validate(controls);
        
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        
        // Clear any existing controls
        container.innerHTML = '';
        
        // Create controls
        controls.controls.forEach((control, index) => {
            const element = ISimulationControls._createControlElement(control);
            container.appendChild(element);
            
            // Add separator after button groups (if next control is not a button)
            if (control.type === 'button' && index < controls.controls.length - 1) {
                const nextControl = controls.controls[index + 1];
                if (nextControl.type !== 'button') {
                    const separator = document.createElement('div');
                    separator.className = 'separator';
                    container.appendChild(separator);
                }
            }
        });
        
        // Add info section if provided
        if (options.info) {
            const infoContainer = document.getElementById('info');
            if (infoContainer) {
                infoContainer.innerHTML = '';
                if (Array.isArray(options.info)) {
                    options.info.forEach(text => {
                        const div = document.createElement('div');
                        div.textContent = text;
                        infoContainer.appendChild(div);
                    });
                } else {
                    infoContainer.textContent = options.info;
                }
            }
        }
    }
    
    /**
     * Create a single control element based on its definition
     * @private
     * @param {Object} control - Control definition
     * @returns {HTMLElement} The created control element
     */
    static _createControlElement(control) {
        switch (control.type) {
            case 'button':
                return ISimulationControls._createButton(control);
            case 'number':
                return ISimulationControls._createNumberInput(control);
            case 'select':
                return ISimulationControls._createSelect(control);
            case 'checkbox':
                return ISimulationControls._createCheckbox(control);
            case 'text':
                return ISimulationControls._createTextInput(control);
            default:
                throw new Error(`Unknown control type: ${control.type}`);
        }
    }
    
    /**
     * Create a button element
     * @private
     */
    static _createButton(control) {
        const button = document.createElement('button');
        button.id = control.id;
        button.textContent = control.label;
        if (control.className) button.className = control.className;
        return button;
    }
    
    /**
     * Create a number input element with label
     * @private
     */
    static _createNumberInput(control) {
        const label = document.createElement('label');
        label.textContent = control.label + ':';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = control.id;
        if (control.min !== undefined) input.min = control.min;
        if (control.max !== undefined) input.max = control.max;
        if (control.step !== undefined) input.step = control.step;
        if (control.value !== undefined) input.value = control.value;
        if (control.className) input.className = control.className;
        
        label.appendChild(document.createTextNode(' '));
        label.appendChild(input);
        return label;
    }
    
    /**
     * Create a select element with label
     * @private
     */
    static _createSelect(control) {
        const label = document.createElement('label');
        label.textContent = control.label + ':';
        
        const select = document.createElement('select');
        select.id = control.id;
        if (control.className) select.className = control.className;
        
        if (control.options && Array.isArray(control.options)) {
            control.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                if (control.value === option.value) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });
        }
        
        label.appendChild(document.createTextNode(' '));
        label.appendChild(select);
        return label;
    }
    
    /**
     * Create a checkbox element with label
     * @private
     */
    static _createCheckbox(control) {
        const label = document.createElement('label');
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = control.id;
        if (control.value !== undefined) input.checked = control.value;
        if (control.className) input.className = control.className;
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + control.label));
        return label;
    }
    
    /**
     * Create a text input element with label
     * @private
     */
    static _createTextInput(control) {
        const label = document.createElement('label');
        label.textContent = control.label + ':';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = control.id;
        if (control.value !== undefined) input.value = control.value;
        if (control.placeholder) input.placeholder = control.placeholder;
        if (control.className) input.className = control.className;
        
        label.appendChild(document.createTextNode(' '));
        label.appendChild(input);
        return label;
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
 *             options: Array,          // For select controls: [{value, label}]
 *             placeholder: string,     // For text inputs
 *             className: string        // CSS class name
 *         }
 *     ],
 *     getControl(id): Object|undefined,
 *     getControlsByType(type): Array
 * }
 */
