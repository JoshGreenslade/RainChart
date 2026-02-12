/**
 * Main Application Entry Point
 * Connects physics simulations with chart renderers
 */

// Initialize simulations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Create physics simulator (no visualization dependencies)
    const simulator = new GravitySimulator(chartWidth, chartHeight, 3, 1.0);
    
    // Connect simulator to chart renderer
    simulator.onUpdate((state) => {
        ChartRenderer.renderGravitySimulation('gravity-chart', state, {
            width: chartWidth,
            height: chartHeight
        });
    });
    
    // Initial render
    simulator.notifyListeners();
    
    // Connect UI controls
    document.getElementById('gravity-start').addEventListener('click', () => {
        simulator.start();
    });
    
    document.getElementById('gravity-stop').addEventListener('click', () => {
        simulator.stop();
    });
    
    document.getElementById('gravity-reset').addEventListener('click', () => {
        const bodyCount = parseInt(document.getElementById('gravity-bodies').value);
        simulator.reset(bodyCount);
    });
    
    document.getElementById('gravity-constant').addEventListener('change', (e) => {
        simulator.setG(parseFloat(e.target.value));
    });
    
    document.getElementById('gravity-bodies').addEventListener('change', (e) => {
        const bodyCount = parseInt(e.target.value);
        simulator.reset(bodyCount);
    });
}

/**
 * Initialize Temperature Simulation
 */
function initTemperatureSimulation() {
    const chartWidth = 800;
    const chartHeight = 400;
    
    // Create physics simulator (no visualization dependencies)
    const simulator = new TemperatureSimulator(50, 0.1);
    
    // Connect simulator to chart renderer
    simulator.onUpdate((state) => {
        ChartRenderer.renderTemperature('temp-chart', state, {
            width: chartWidth,
            height: chartHeight
        });
    });
    
    // Initial render
    simulator.notifyListeners();
    
    // Connect UI controls
    document.getElementById('temp-start').addEventListener('click', () => {
        simulator.start();
    });
    
    document.getElementById('temp-stop').addEventListener('click', () => {
        simulator.stop();
    });
    
    document.getElementById('temp-reset').addEventListener('click', () => {
        const points = parseInt(document.getElementById('temp-points').value);
        simulator.reset(points);
    });
    
    document.getElementById('temp-diffusivity').addEventListener('change', (e) => {
        simulator.setDiffusivity(parseFloat(e.target.value));
    });
    
    document.getElementById('temp-points').addEventListener('change', (e) => {
        const points = parseInt(e.target.value);
        simulator.reset(points);
    });
}

/**
 * Initialize Trajectory Simulation
 */
function initTrajectorySimulation() {
    const chartWidth = 800;
    const chartHeight = 400;
    
    // Create physics simulator (no visualization dependencies)
    const simulator = new TrajectorySimulator(50, 45, 'none', 0.1);
    
    // Connect simulator to chart renderer
    simulator.onUpdate((state) => {
        ChartRenderer.renderTrajectory('traj-chart', state, {
            width: chartWidth,
            height: chartHeight
        });
    });
    
    // Initial render
    simulator.notifyListeners();
    
    // Connect UI controls
    document.getElementById('traj-launch').addEventListener('click', () => {
        const velocity = parseFloat(document.getElementById('traj-velocity').value);
        const angle = parseFloat(document.getElementById('traj-angle').value);
        const resistance = document.getElementById('traj-resistance').value;
        const drag = parseFloat(document.getElementById('traj-drag').value);
        
        simulator.setParameters(velocity, angle, resistance, drag);
        simulator.launch();
    });
    
    document.getElementById('traj-reset').addEventListener('click', () => {
        simulator.reset();
    });
}
