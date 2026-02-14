/**
 * Integration tests for module imports and exports
 * Tests that the module system works correctly
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Module System', () => {
    describe('Integrators module', () => {
        it('should export Integrators object with all methods', async () => {
            const { Integrators } = await import('../../js/integrators/integrators.js');
            
            assert.ok(Integrators, 'Integrators should be exported');
            assert.ok(typeof Integrators.euler === 'function');
            assert.ok(typeof Integrators.rk4 === 'function');
            assert.ok(typeof Integrators.verlet === 'function');
            assert.ok(typeof Integrators.velocityVerlet === 'function');
        });
    });

    describe('Physics interfaces', () => {
        it('should export ISimulation interface', async () => {
            const { ISimulation } = await import('../../js/physics-sims/simulation-interface.js');
            
            assert.ok(ISimulation, 'ISimulation should be exported');
            assert.ok(typeof ISimulation === 'function', 'ISimulation should be a class/constructor');
        });

        it('should export ISimulationEngine interface', async () => {
            const { ISimulationEngine } = await import('../../js/physics-sims/engine-interface.js');
            
            assert.ok(ISimulationEngine, 'ISimulationEngine should be exported');
            assert.ok(typeof ISimulationEngine === 'function');
        });

        it('should export ISimulationConfig interface', async () => {
            const { ISimulationConfig } = await import('../../js/physics-sims/config-interface.js');
            
            assert.ok(ISimulationConfig, 'ISimulationConfig should be exported');
        });

        it('should export ISimulationControls interface', async () => {
            const { ISimulationControls } = await import('../../js/physics-sims/controls-interface.js');
            
            assert.ok(ISimulationControls, 'ISimulationControls should be exported');
        });
    });

    describe('Gravity simulation modules', () => {
        it('should export GravityEngine', async () => {
            const { GravityEngine } = await import('../../js/physics-sims/Gravity/gravity-engine.js');
            
            assert.ok(GravityEngine, 'GravityEngine should be exported');
            assert.ok(typeof GravityEngine === 'function');
        });

        it('should export GravitySimulation', async () => {
            const { GravitySimulation } = await import('../../js/physics-sims/Gravity/gravity-simulation.js');
            
            assert.ok(GravitySimulation, 'GravitySimulation should be exported');
            assert.ok(typeof GravitySimulation === 'function');
        });

        it('should export GravityConfig', async () => {
            const { GravityConfig } = await import('../../js/physics-sims/Gravity/gravity-config.js');
            
            assert.ok(GravityConfig, 'GravityConfig should be exported');
            assert.ok(typeof GravityConfig === 'object');
            assert.ok(GravityConfig.module, 'Config should have module metadata');
            assert.ok(GravityConfig.engine, 'Config should have engine settings');
            assert.ok(GravityConfig.renderer, 'Config should have renderer settings');
        });

        it('should export GravityControls', async () => {
            const { GravityControls } = await import('../../js/physics-sims/Gravity/gravity-controls.js');
            
            assert.ok(GravityControls, 'GravityControls should be exported');
            assert.ok(Array.isArray(GravityControls.controls));
        });
    });

    describe('Renderer modules', () => {
        it('should export BaseRenderer', async () => {
            const { BaseRenderer } = await import('../../js/renderer/base-renderer.js');
            
            assert.ok(BaseRenderer, 'BaseRenderer should be exported');
            assert.ok(typeof BaseRenderer === 'function');
        });

        it('should export CanvasRenderer', async () => {
            const { CanvasRenderer } = await import('../../js/renderer/canvas-renderer.js');
            
            assert.ok(CanvasRenderer, 'CanvasRenderer should be exported');
            assert.ok(typeof CanvasRenderer === 'function');
        });

        it('should export D3Renderer', async () => {
            const { D3Renderer } = await import('../../js/renderer/d3-renderer.js');
            
            assert.ok(D3Renderer, 'D3Renderer should be exported');
            assert.ok(typeof D3Renderer === 'function');
        });
    });

    describe('Barrel export (rainchart.js)', () => {
        it('should export all public modules', async () => {
            const rainchart = await import('../../js/rainchart.js');
            
            // Check that major exports are present
            assert.ok(rainchart.Integrators, 'Should export Integrators');
            assert.ok(rainchart.BaseRenderer, 'Should export BaseRenderer');
            assert.ok(rainchart.ISimulation, 'Should export ISimulation');
            assert.ok(rainchart.ISimulationEngine, 'Should export ISimulationEngine');
            assert.ok(rainchart.GravitySimulation, 'Should export GravitySimulation');
            assert.ok(rainchart.GravityEngine, 'Should export GravityEngine');
        });

        it('should allow selective imports', async () => {
            const { Integrators, BaseRenderer } = await import('../../js/rainchart.js');
            
            assert.ok(Integrators);
            assert.ok(BaseRenderer);
        });
    });

    describe('Module instantiation', () => {
        it('should be able to instantiate GravityEngine from import', async () => {
            const { GravityEngine } = await import('../../js/physics-sims/Gravity/gravity-engine.js');
            
            const engine = new GravityEngine(800, 600, 3, 1.0);
            
            assert.ok(engine);
            assert.strictEqual(engine.width, 800);
            assert.strictEqual(engine.height, 600);
        });

        it('should be able to instantiate GravitySimulation from import', async () => {
            const { GravitySimulation } = await import('../../js/physics-sims/Gravity/gravity-simulation.js');
            
            const simulation = new GravitySimulation(800, 600, 3, 1.0);
            
            assert.ok(simulation);
            assert.strictEqual(simulation.width, 800);
            assert.strictEqual(simulation.height, 600);
        });
    });

    describe('Cross-module dependencies', () => {
        it('should handle circular dependencies correctly', async () => {
            // Import modules that depend on each other
            const { GravitySimulation } = await import('../../js/physics-sims/Gravity/gravity-simulation.js');
            const { GravityEngine } = await import('../../js/physics-sims/Gravity/gravity-engine.js');
            
            // Both should be available
            assert.ok(GravitySimulation);
            assert.ok(GravityEngine);
            
            // Should be able to create instances
            const simulation = new GravitySimulation(800, 600, 3, 1.0);
            assert.ok(simulation.engine instanceof GravityEngine);
        });
    });
});
