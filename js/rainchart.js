/**
 * RainChart - Main Module Export
 * This file provides convenient barrel exports for all RainChart modules
 */

// Simulation interfaces
export { ISimulation } from './physics-sims/simulation-interface.js';
export { ISimulationEngine } from './physics-sims/engine-interface.js';
export { ISimulationConfig } from './physics-sims/config-interface.js';
export { ISimulationControls } from './physics-sims/controls-interface.js';

// Renderer modules
export { BaseRenderer } from './renderer/base-renderer.js';
export { CanvasRenderer } from './renderer/canvas-renderer.js';
export { D3Renderer } from './renderer/d3-renderer.js';

// Physics simulation modules
export { GravitySimulation } from './physics-sims/Gravity/gravity-simulation.js';
export { GravityEngine } from './physics-sims/Gravity/gravity-engine.js';
export { GravityRenderer } from './physics-sims/Gravity/gravity-renderer.js';
export { GravityConfig } from './physics-sims/Gravity/gravity-config.js';
export { GravityControls } from './physics-sims/Gravity/gravity-controls.js';

// Integrator utilities
export { Integrators } from './integrators/integrators.js';

// Color utilities
export { DEFAULT_COLOR_PALETTE, BASE_COLOR_PALETTE } from './utils/color-palette.js';
