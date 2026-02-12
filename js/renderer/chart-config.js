/**
 * Chart Configuration System
 * Provides extensive customization options for chart appearance
 */

const ChartConfig = {
    // Gravity Simulation Visual Config
    gravity: {
        // Canvas settings
        backgroundColor: '#f8f9fa',
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
    
    // Temperature Simulation Visual Config
    temperature: {
        // Canvas settings
        backgroundColor: '#ffffff',
        borderColor: '#bdc3c7',
        
        // Color scheme for temperature
        colorScheme: 'redBlue', // 'redBlue', 'rainbow', 'thermal', 'grayscale'
        minColor: { r: 0, g: 0, b: 255 },    // Cold color
        maxColor: { r: 255, g: 0, b: 0 },    // Hot color
        
        // Bar appearance
        barOpacity: 1.0,
        barStroke: false,
        barStrokeColor: '#000000',
        barStrokeWidth: 0.5,
        
        // Axis settings
        showAxes: true,
        axisColor: '#000000',
        axisWidth: 1,
        fontSize: 12,
        fontFamily: 'Arial',
        
        // Label customization
        xAxisLabel: 'Position along bar',
        yAxisLabel: 'Temperature',
        showTickMarks: true,
        tickMarkCount: 5
    },
    
    // Trajectory Simulation Visual Config
    trajectory: {
        // Canvas settings
        backgroundColor: '#ffffff',
        borderColor: '#bdc3c7',
        
        // Path appearance
        pathColors: {
            'none': '#3498db',
            'linear': '#e74c3c',
            'quadratic': '#f39c12'
        },
        pathWidth: 2,
        pathOpacity: 1.0,
        
        // Projectile marker
        showProjectile: true,
        projectileSize: 5,
        projectileColor: '#2c3e50',
        
        // Grid settings
        showGrid: true,
        gridColor: '#e0e0e0',
        gridOpacity: 0.3,
        
        // Axis settings
        showAxes: true,
        axisColor: '#000000',
        axisWidth: 1,
        fontSize: 12,
        
        // Legend
        showLegend: true,
        legendPosition: 'topRight'
    }
};

/**
 * Helper function to interpolate colors
 */
function interpolateColor(color1, color2, factor) {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * factor),
        g: Math.round(color1.g + (color2.g - color1.g) * factor),
        b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
}

/**
 * Get color based on temperature and color scheme
 */
function getTemperatureColor(temp, maxTemp, config) {
    const ratio = temp / maxTemp;
    
    switch (config.colorScheme) {
        case 'rainbow':
            const hue = (1 - ratio) * 240; // Blue to red
            return `hsl(${hue}, 100%, 50%)`;
            
        case 'thermal':
            if (ratio < 0.33) {
                const c = interpolateColor({r: 0, g: 0, b: 0}, {r: 128, g: 0, b: 128}, ratio * 3);
                return `rgb(${c.r}, ${c.g}, ${c.b})`;
            } else if (ratio < 0.66) {
                const c = interpolateColor({r: 128, g: 0, b: 128}, {r: 255, g: 0, b: 0}, (ratio - 0.33) * 3);
                return `rgb(${c.r}, ${c.g}, ${c.b})`;
            } else {
                const c = interpolateColor({r: 255, g: 0, b: 0}, {r: 255, g: 255, b: 0}, (ratio - 0.66) * 3);
                return `rgb(${c.r}, ${c.g}, ${c.b})`;
            }
            
        case 'grayscale':
            const gray = Math.round(255 * ratio);
            return `rgb(${gray}, ${gray}, ${gray})`;
            
        default: // 'redBlue'
            const c = interpolateColor(config.minColor, config.maxColor, ratio);
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
    }
}
