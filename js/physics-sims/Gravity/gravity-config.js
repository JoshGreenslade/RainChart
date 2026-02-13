import { Integrators } from '../../integrators/integrators.js';

export const GravityConfig = {
    // Gravity Simulation Visual Config
    renderer: {
        // Canvas settings
        backgroundColor: 'hsl(240, 50%, 10%)',
        borderColor: '#bdc3c7',
        borderWidth: 1,
        
        // Body appearance
        bodyColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
                     '#1abc9c', '#e67e22', '#34495e', '#16a085', '#27ae60',
                     '#c0392b', '#2980b9', '#27ae60', '#d35400', '#8e44ad'],
        bodyStrokeColor: '#000000',
        bodyStrokeWidth: 1,
        bodyOpacity: 0.9,
        bodySizeMultiplier: 2,
        
        // Trail settings
        showTrails: false,
        trailLength: 50,
        trailOpacity: 0.3,
        trailFadeRate: 0.95,
        
        // Grid settings
        showGrid: false,
        gridColor: '#e0e0e0',
        gridSize: 50,
        
        // Performance settings
        enableAntialiasing: true,
        maxBodies: 10000
    },

    engine: {
        // Integrator
        integrator: Integrators.rk4,
        
        // Constants
        softening_factor: 5,
        
        // Mass power law generator
        minMass: 2,
        maxMass: 10000,
        massPowerLawScaling: 2.35
    }
}
