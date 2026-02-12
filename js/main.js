/**
 * Main Application Entry Point
 * Gravity Simulation using Primitive Renderer
 */

let gravitySimulation;
let gravityRenderer;

/**
 * Helper function to convert HSL color to HSLA with transparency
 */
function toTransparentColor(hslColor, alpha = 0.85) {
    // Check if color is already in HSL format
    if (hslColor && hslColor.includes('hsl')) {
        return hslColor.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
    }
    // Fallback to default dark transparent background
    return `rgba(0, 0, 0, ${alpha})`;
}

// Initialize simulation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGravitySimulation();
});

/**
 * Initialize Gravity Simulation
 */
function initGravitySimulation() {
    // Create renderer with full window size
    const renderMode = document.getElementById('renderer-mode').value;
    gravityRenderer = new PrimitiveRenderer('gravity-chart', {
        width: window.innerWidth,
        height: window.innerHeight,
        renderMode: renderMode
    });
    
    // Update controls background to match color scheme
    const controls = document.getElementById('controls');
    const info = document.getElementById('info');
    const scheme = gravityRenderer.getColorScheme();
    
    // Use the background color with transparency for controls
    const controlsBg = toTransparentColor(scheme.background);
    controls.style.background = controlsBg;
    info.style.background = controlsBg;
    
    // Create physics simulation
    gravitySimulation = new GravitySimulation(window.innerWidth, window.innerHeight, 3, 1.0);
    
    // Connect simulation to renderer
    gravitySimulation.onUpdate((state) => {
        gravitySimulation.render(gravityRenderer);
    });
    
    // Initial render
    gravitySimulation.notifyListeners();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        gravityRenderer.resize(window.innerWidth, window.innerHeight);
        gravitySimulation.width = window.innerWidth;
        gravitySimulation.height = window.innerHeight;
    });
    
    // Connect UI controls
    document.getElementById('gravity-start').addEventListener('click', () => {
        gravitySimulation.start();
    });
    
    document.getElementById('gravity-stop').addEventListener('click', () => {
        gravitySimulation.stop();
    });
    
    document.getElementById('gravity-reset').addEventListener('click', () => {
        const bodyCount = parseInt(document.getElementById('gravity-bodies').value);
        gravitySimulation.reset(bodyCount);
    });
    
    document.getElementById('gravity-constant').addEventListener('change', (e) => {
        gravitySimulation.setG(parseFloat(e.target.value));
    });
    
    document.getElementById('gravity-bodies').addEventListener('change', (e) => {
        const bodyCount = parseInt(e.target.value);
        gravitySimulation.reset(bodyCount);
    });
    
    // Renderer mode change
    document.getElementById('renderer-mode').addEventListener('change', (e) => {
        const renderMode = e.target.value;
        gravityRenderer = new PrimitiveRenderer('gravity-chart', {
            width: window.innerWidth,
            height: window.innerHeight,
            renderMode: renderMode
        });
        
        // Update background colors
        const scheme = gravityRenderer.getColorScheme();
        const controlsBg = toTransparentColor(scheme.background);
        controls.style.background = controlsBg;
        info.style.background = controlsBg;
        
        // Re-render
        gravitySimulation.render(gravityRenderer);
    });
}
