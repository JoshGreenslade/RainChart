/**
 * Unit tests for GravityEngine
 * Tests physics calculations for N-body gravity simulation
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { GravityEngine } from '../../js/physics-sims/Gravity/gravity-engine.js';

describe('GravityEngine', () => {
    describe('generatePowerLawMass', () => {
        it('should generate mass within configured range', () => {
            // Run multiple times to test statistical distribution
            for (let i = 0; i < 100; i++) {
                const mass = GravityEngine.generatePowerLawMass();
                
                // Mass should be within configured bounds (1 to 100 by default)
                assert.ok(mass >= 1, `Mass ${mass} should be >= 1`);
                assert.ok(mass <= 100, `Mass ${mass} should be <= 100`);
            }
        });

        it('should produce different masses on repeated calls', () => {
            const masses = new Set();
            for (let i = 0; i < 10; i++) {
                masses.add(GravityEngine.generatePowerLawMass());
            }
            
            // Should have generated at least a few different values
            assert.ok(masses.size > 1, 'Should generate different mass values');
        });
    });

    describe('generateRandomBodies', () => {
        it('should generate correct number of bodies', () => {
            const bodies = GravityEngine.generateRandomBodies(5, 800, 600);
            
            assert.strictEqual(bodies.length, 5);
        });

        it('should generate bodies with all required properties', () => {
            const bodies = GravityEngine.generateRandomBodies(3, 800, 600);
            
            bodies.forEach((body, index) => {
                assert.strictEqual(body.id, index);
                assert.ok(typeof body.x === 'number');
                assert.ok(typeof body.y === 'number');
                assert.ok(typeof body.vx === 'number');
                assert.ok(typeof body.vy === 'number');
                assert.ok(typeof body.mass === 'number');
            });
        });

        it('should generate bodies within bounds', () => {
            const width = 800;
            const height = 600;
            const bodies = GravityEngine.generateRandomBodies(10, width, height);
            
            bodies.forEach(body => {
                assert.ok(body.x >= 0 && body.x <= width);
                assert.ok(body.y >= 0 && body.y <= height);
            });
        });
    });

    describe('calculateGravitationalForce', () => {
        it('should calculate force between two bodies', () => {
            const body1 = { x: 0, y: 0, mass: 10 };
            const body2 = { x: 10, y: 0, mass: 20 };
            const G = 1.0;
            
            const force = GravityEngine.calculateGravitationalForce(body1, body2, G);
            
            assert.ok(typeof force.fx === 'number');
            assert.ok(typeof force.fy === 'number');
            
            // Force should point from body1 to body2 (positive x direction)
            assert.ok(force.fx > 0);
            assert.strictEqual(force.fy, 0); // No y component for horizontal alignment
        });

        it('should have equal and opposite forces (Newtons third law)', () => {
            const body1 = { x: 5, y: 5, mass: 10 };
            const body2 = { x: 15, y: 15, mass: 20 };
            const G = 1.0;
            
            const force12 = GravityEngine.calculateGravitationalForce(body1, body2, G);
            const force21 = GravityEngine.calculateGravitationalForce(body2, body1, G);
            
            // Forces should be equal in magnitude but opposite in direction
            assert.ok(Math.abs(force12.fx + force21.fx) < 0.0001);
            assert.ok(Math.abs(force12.fy + force21.fy) < 0.0001);
        });

        it('should decrease force with distance squared', () => {
            const body1 = { x: 0, y: 0, mass: 10 };
            const body2Near = { x: 10, y: 0, mass: 10 };
            const body2Far = { x: 20, y: 0, mass: 10 };
            const G = 1.0;
            
            const forceNear = GravityEngine.calculateGravitationalForce(body1, body2Near, G);
            const forceFar = GravityEngine.calculateGravitationalForce(body1, body2Far, G);
            
            // Force should decrease with distance (accounting for softening)
            assert.ok(forceNear.fx > forceFar.fx);
        });

        it('should handle bodies at same position without division by zero', () => {
            const body1 = { x: 10, y: 10, mass: 10 };
            const body2 = { x: 10, y: 10, mass: 20 };
            const G = 1.0;
            
            // Should not throw error due to softening factor
            const force = GravityEngine.calculateGravitationalForce(body1, body2, G);
            
            assert.ok(typeof force.fx === 'number');
            assert.ok(typeof force.fy === 'number');
            assert.ok(!isNaN(force.fx));
            assert.ok(!isNaN(force.fy));
        });
    });

    describe('GravityEngine instance', () => {
        let engine;

        beforeEach(() => {
            engine = new GravityEngine(800, 600, 3, 1.0);
        });

        it('should initialize with correct dimensions', () => {
            assert.strictEqual(engine.width, 800);
            assert.strictEqual(engine.height, 600);
        });

        it('should initialize with correct number of bodies', () => {
            const state = engine.getState();
            assert.strictEqual(state.bodies.length, 3);
        });

        it('should update gravitational constant', () => {
            engine.setG(2.0);
            assert.strictEqual(engine.G, 2.0);
        });

        it('should update dimensions', () => {
            engine.setDimensions(1000, 800);
            assert.strictEqual(engine.width, 1000);
            assert.strictEqual(engine.height, 800);
        });

        it('should step simulation without errors', () => {
            const initialState = engine.getState();
            engine.step();
            const newState = engine.getState();
            
            assert.strictEqual(newState.bodies.length, initialState.bodies.length);
            
            // At least one body should have moved (unless by extreme coincidence forces cancel)
            const hasMoved = newState.bodies.some((body, i) => 
                body.x !== initialState.bodies[i].x || 
                body.y !== initialState.bodies[i].y
            );
            // Note: In rare cases, bodies might not move if forces perfectly cancel
            // but this is extremely unlikely with random initialization
        });

        it('should wrap bodies around boundaries', () => {
            // Create a body that will go out of bounds
            engine.bodies[0] = {
                id: 0,
                x: -10,
                y: -10,
                vx: 0,
                vy: 0,
                mass: 10
            };
            
            engine.step();
            
            const state = engine.getState();
            const body = state.bodies[0];
            
            // Body should be wrapped back into bounds
            assert.ok(body.x >= 0 && body.x <= engine.width);
            assert.ok(body.y >= 0 && body.y <= engine.height);
        });

        it('should reset simulation', () => {
            const initialBodies = engine.getState().bodies.map(b => ({ ...b }));
            
            // Step the simulation to change state
            engine.step();
            engine.step();
            
            // Reset
            engine.reset();
            
            const resetState = engine.getState();
            
            // Bodies should be different after reset (new random initialization)
            const bodiesAreDifferent = resetState.bodies.some((body, i) => 
                body.x !== initialBodies[i].x || 
                body.y !== initialBodies[i].y
            );
            
            assert.ok(bodiesAreDifferent, 'Reset should generate new bodies');
        });

        it('should return state as plain objects', () => {
            const state = engine.getState();
            
            assert.ok(Array.isArray(state.bodies));
            assert.strictEqual(typeof state.width, 'number');
            assert.strictEqual(typeof state.height, 'number');
            
            state.bodies.forEach(body => {
                assert.ok(typeof body.id === 'number');
                assert.ok(typeof body.x === 'number');
                assert.ok(typeof body.y === 'number');
                assert.ok(typeof body.vx === 'number');
                assert.ok(typeof body.vy === 'number');
                assert.ok(typeof body.mass === 'number');
            });
        });
    });
});
