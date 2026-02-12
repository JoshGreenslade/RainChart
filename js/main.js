/**
 * Main Application Entry Point
 * Connects physics simulations with chart renderers via the RendererAdapter
 * Application layer only interacts with the adapter interface
 */

// Global renderer instances (can be switched by user)
let gravityRenderer, temperatureRenderer, trajectoryRenderer;

// Initialize simulations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Determine default renderer (Canvas for now, can be changed by UI)
    const defaultRenderer = 'canvas';
    
    // Initialize renderers
    gravityRenderer = RendererFactory.create(defaultRenderer);
    temperatureRenderer = RendererFactory.create(defaultRenderer);
    trajectoryRenderer = RendererFactory.create(defaultRenderer);
    
    // Initialize simulations
    initGravitySimulation();
    initTemperatureSimulation();
    initTrajectorySimulation();
    
    // Initialize renderer switching UI if multiple renderers available
    initRendererSelector();
});

/**
 * Initialize renderer selector UI
 */
function initRendererSelector() {
    const availableRenderers = RendererFactory.getAvailableRenderers();
    
    if (availableRenderers.length > 1) {
        // Add renderer selection UI to each simulation
        addRendererControls('gravity', gravityRenderer, (newRenderer) => {
            gravityRenderer = newRenderer;
        });
        addRendererControls('temperature', temperatureRenderer, (newRenderer) => {
            temperatureRenderer = newRenderer;
        });
        addRendererControls('trajectory', trajectoryRenderer, (newRenderer) => {
            trajectoryRenderer = newRenderer;
        });
    }
}

/**
 * Add renderer control to a simulation section
 */
function addRendererControls(sectionId, renderer, onRendererChange) {
    const controls = document.querySelector(`#${sectionId} .controls`);
    if (!controls) return;
    
    const availableRenderers = RendererFactory.getAvailableRenderers();
    
    const label = document.createElement('label');
    label.innerHTML = 'Renderer: ';
    
    const select = document.createElement('select');
    select.className = 'renderer-selector';
    
    availableRenderers.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.toUpperCase();
        if (type === renderer.getRendererType()) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        const newRenderer = RendererFactory.create(e.target.value);
        onRendererChange(newRenderer);
        
        // Clear and re-render with new renderer
        newRenderer.clear(`${sectionId}-chart`);
    });
    
    label.appendChild(select);
    controls.appendChild(label);
}

/**
 * Initialize Gravity Simulation
 */
function initGravitySimulation() {
    const chartWidth = 800;
    const chartHeight = 600;
    
    // Create physics simulator (no visualization dependencies)
    const simulator = new GravitySimulator(chartWidth, chartHeight, 3, 1.0);
    
    // Connect simulator to renderer via adapter interface
    simulator.onUpdate((state) => {
        gravityRenderer.renderGravity('gravity-chart', state, {
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
    
    // Connect simulator to renderer via adapter interface
    simulator.onUpdate((state) => {
        temperatureRenderer.renderTemperature('temp-chart', state, {
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
    
    // Connect simulator to renderer via adapter interface
    simulator.onUpdate((state) => {
        trajectoryRenderer.renderTrajectory('traj-chart', state, {
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
