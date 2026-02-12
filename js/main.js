/**
 * Main Application Entry Point
 * Connects physics simulations with primitive renderers
 * Simulations now use PrimitiveRenderer to build their scenes
 */

// Global simulation and renderer instances
let gravitySimulation, temperatureSimulation, trajectorySimulation;
let gravityRenderer, temperatureRenderer, trajectoryRenderer;

// Initialize simulations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simulations
    initGravitySimulation();
    initTemperatureSimulation();
    initTrajectorySimulation();
});

/**
 * Initialize Gravity Simulation
 */
function initGravitySimulation() {
    const chartWidth = 800;
    const chartHeight = 600;
    
    // Create primitive renderer
    // Use PrimitiveRenderer with renderMode: 'canvas' for Canvas rendering
    // Use PrimitiveRenderer with renderMode: 'svg' for D3/SVG rendering (requires D3.js)
    gravityRenderer = new PrimitiveRenderer('gravity-chart', {
        width: chartWidth,
        height: chartHeight,
        renderMode: 'canvas'
    });
    
    // Create physics simulation (brings together physics, integrators, and rendering)
    gravitySimulation = new GravitySimulation(chartWidth, chartHeight, 3, 1.0);
    
    // Connect simulation to renderer
    gravitySimulation.onUpdate((state) => {
        // Simulation renders itself using primitive renderer
        gravitySimulation.render(gravityRenderer);
    });
    
    // Initial render
    gravitySimulation.notifyListeners();
    
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
}

/**
 * Initialize Temperature Simulation
 */
function initTemperatureSimulation() {
    const chartWidth = 800;
    const chartHeight = 400;
    
    // Create primitive renderer
    temperatureRenderer = new PrimitiveRenderer('temp-chart', {
        width: chartWidth,
        height: chartHeight,
        renderMode: 'canvas'
    });
    
    // Create physics simulation
    temperatureSimulation = new TemperatureSimulation(50, 0.1);
    
    // Connect simulation to renderer
    temperatureSimulation.onUpdate((state) => {
        // Simulation renders itself using primitive renderer
        temperatureSimulation.render(temperatureRenderer);
    });
    
    // Initial render
    temperatureSimulation.notifyListeners();
    
    // Connect UI controls
    document.getElementById('temp-start').addEventListener('click', () => {
        temperatureSimulation.start();
    });
    
    document.getElementById('temp-stop').addEventListener('click', () => {
        temperatureSimulation.stop();
    });
    
    document.getElementById('temp-reset').addEventListener('click', () => {
        const points = parseInt(document.getElementById('temp-points').value);
        temperatureSimulation.reset(points);
    });
    
    document.getElementById('temp-diffusivity').addEventListener('change', (e) => {
        temperatureSimulation.setDiffusivity(parseFloat(e.target.value));
    });
    
    document.getElementById('temp-points').addEventListener('change', (e) => {
        const points = parseInt(e.target.value);
        temperatureSimulation.reset(points);
    });
}

/**
 * Initialize Trajectory Simulation
 */
function initTrajectorySimulation() {
    const chartWidth = 800;
    const chartHeight = 400;
    
    // Create primitive renderer
    trajectoryRenderer = new PrimitiveRenderer('traj-chart', {
        width: chartWidth,
        height: chartHeight,
        renderMode: 'canvas'
    });
    
    // Create physics simulation
    trajectorySimulation = new TrajectorySimulation(50, 45, 'none', 0.1);
    
    // Connect simulation to renderer
    trajectorySimulation.onUpdate((state) => {
        // Simulation renders itself using primitive renderer
        trajectorySimulation.render(trajectoryRenderer);
    });
    
    // Initial render
    trajectorySimulation.notifyListeners();
    
    // Connect UI controls
    document.getElementById('traj-launch').addEventListener('click', () => {
        const velocity = parseFloat(document.getElementById('traj-velocity').value);
        const angle = parseFloat(document.getElementById('traj-angle').value);
        const resistance = document.getElementById('traj-resistance').value;
        const drag = parseFloat(document.getElementById('traj-drag').value);
        
        trajectorySimulation.setParameters(velocity, angle, resistance, drag);
        trajectorySimulation.launch();
    });
    
    document.getElementById('traj-reset').addEventListener('click', () => {
        trajectorySimulation.reset();
    });
}
