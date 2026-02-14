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
        it('should export infrastructure modules', async () => {
            const rainchart = await import('../../js/rainchart.js');
            
            // Check that infrastructure exports are present
            assert.ok(rainchart.Integrators, 'Should export Integrators');
            assert.ok(rainchart.BaseRenderer, 'Should export BaseRenderer');
            assert.ok(rainchart.ISimulation, 'Should export ISimulation');
            assert.ok(rainchart.ISimulationEngine, 'Should export ISimulationEngine');
            assert.ok(rainchart.ISimulationConfig, 'Should export ISimulationConfig');
            assert.ok(rainchart.ISimulationControls, 'Should export ISimulationControls');
        });

        it('should allow selective imports', async () => {
            const { Integrators, BaseRenderer } = await import('../../js/rainchart.js');
            
            assert.ok(Integrators);
            assert.ok(BaseRenderer);
        });
    });
});
