/**
 * RainChart - Main Module Export
 * This file provides convenient barrel exports for all RainChart modules
 */

// Renderer modules
export { BaseRenderer } from './renderer/base-renderer.js';
export { CanvasRenderer } from './renderer/canvas-renderer.js';
export { D3Renderer } from './renderer/d3-renderer.js';
export { ColorScheme } from './renderer/color-scheme.js';
export { ChartConfig, interpolateColor, getTemperatureColor } from './renderer/chart-config.js';

// Physics simulation modules
export { ISimulation } from './physics-sims/simulation-interface.js';
export { GravitySimulation } from './physics-sims/Gravity/gravity-simulation.js';
export { GravityEngine } from './physics-sims/Gravity/gravity-engine.js';
export { GravityRenderer } from './physics-sims/Gravity/gravity-renderer.js';
export { GravityConfig } from './physics-sims/Gravity/gravity-config.js';

// Integrator utilities
export { Integrators } from './integrators/integrators.js';
