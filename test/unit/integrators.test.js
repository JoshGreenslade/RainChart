/**
 * Unit tests for Integrators module
 * Tests all numerical integration methods with known ODE solutions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Integrators } from '../../js/integrators/integrators.js';

describe('Integrators', () => {
    describe('euler', () => {
        it('should integrate a constant function correctly', () => {
            // dy/dt = 2, so y(t) = y0 + 2*t
            const state = 0;
            const derivative = () => 2;
            const dt = 0.1;
            
            const newState = Integrators.euler(state, derivative, dt);
            
            // Expected: 0 + 0.1 * 2 = 0.2
            assert.strictEqual(newState, 0.2);
        });

        it('should integrate a linear function', () => {
            // dy/dt = t, so y(t) = y0 + t^2/2
            let t = 0;
            const state = 0;
            const derivative = (s, time) => time;
            const dt = 0.1;
            
            const newState = Integrators.euler(state, derivative, dt, t);
            
            // Expected: 0 + 0.1 * 0 = 0
            assert.strictEqual(newState, 0);
        });

        it('should handle array states', () => {
            // Simple harmonic oscillator: dx/dt = v, dv/dt = -x
            const state = [1, 0]; // [position, velocity]
            const derivative = (s) => [s[1], -s[0]];
            const dt = 0.01;
            
            const newState = Integrators.euler(state, derivative, dt);
            
            // Expected: [1 + 0.01*0, 0 + 0.01*(-1)] = [1, -0.01]
            assert.strictEqual(newState.length, 2);
            assert.strictEqual(newState[0], 1);
            assert.strictEqual(newState[1], -0.01);
        });
    });

    describe('rk4', () => {
        it('should integrate a constant function correctly', () => {
            // dy/dt = 2, so y(t) = y0 + 2*t
            const state = 0;
            const derivative = () => 2;
            const dt = 0.1;
            
            const newState = Integrators.rk4(state, derivative, dt);
            
            // RK4 is exact for polynomials up to degree 3
            // Expected: 0 + 0.1 * 2 = 0.2
            assert.strictEqual(newState, 0.2);
        });

        it('should be more accurate than Euler for exponential functions', () => {
            // dy/dt = y, so y(t) = y0 * e^t
            const y0 = 1;
            const derivative = (y) => y;
            const dt = 0.1;
            
            const eulerResult = Integrators.euler(y0, derivative, dt);
            const rk4Result = Integrators.rk4(y0, derivative, dt);
            
            // Exact solution: e^0.1 ≈ 1.10517
            const exactSolution = Math.exp(dt);
            
            // RK4 should be more accurate than Euler
            const eulerError = Math.abs(eulerResult - exactSolution);
            const rk4Error = Math.abs(rk4Result - exactSolution);
            
            assert.ok(rk4Error < eulerError, 'RK4 should be more accurate than Euler');
            assert.ok(rk4Error < 0.00001, 'RK4 error should be very small');
        });

        it('should handle array states', () => {
            // Simple harmonic oscillator: dx/dt = v, dv/dt = -x
            const state = [1, 0]; // [position, velocity]
            const derivative = (s) => [s[1], -s[0]];
            const dt = 0.01;
            
            const newState = Integrators.rk4(state, derivative, dt);
            
            assert.strictEqual(newState.length, 2);
            // For small dt, x(t+dt) ≈ x(t) + v(t)*dt - x(t)*dt^2/2
            assert.ok(Math.abs(newState[0] - 1) < 0.0001);
            assert.ok(Math.abs(newState[1] - (-0.01)) < 0.0001);
        });
    });

    describe('verlet', () => {
        it('should integrate position correctly using Verlet method', () => {
            // State format: [current_position, previous_position]
            // For constant acceleration: x(t+dt) = 2*x(t) - x(t-dt) + a*dt^2
            const position = [1.0];
            const previousPosition = [0.9];
            const state = [...position, ...previousPosition];
            
            // Constant acceleration a = 1
            const derivative = () => [1.0];
            const dt = 0.1;
            
            const newState = Integrators.verlet(state, derivative, dt);
            
            // Expected: 2*1.0 - 0.9 + 1.0*0.01 = 1.11
            assert.strictEqual(newState.length, 2);
            assert.ok(Math.abs(newState[0] - 1.11) < 0.0001);
            assert.strictEqual(newState[1], 1.0); // Previous position is current position
        });

        it('should handle multi-dimensional states', () => {
            // 2D position
            const position = [1.0, 2.0];
            const previousPosition = [0.9, 1.8];
            const state = [...position, ...previousPosition];
            
            // Acceleration [ax, ay]
            const derivative = () => [0.5, -0.5];
            const dt = 0.1;
            
            const newState = Integrators.verlet(state, derivative, dt);
            
            assert.strictEqual(newState.length, 4);
            // Check that new positions are computed and old positions stored
            assert.ok(newState[0] > position[0]);
            assert.ok(newState[1] > position[1]);
            assert.strictEqual(newState[2], position[0]);
            assert.strictEqual(newState[3], position[1]);
        });
    });

    describe('velocityVerlet', () => {
        it('should integrate position and velocity correctly', () => {
            // State format: [position, velocity]
            const state = [1.0, 0.5]; // [x, v]
            
            // Derivative returns [velocity, acceleration]
            const derivative = (s) => [s[1], -1.0]; // v = v, a = -1
            const dt = 0.1;
            
            const newState = Integrators.velocityVerlet(state, derivative, dt);
            
            assert.strictEqual(newState.length, 2);
            
            // x(t+dt) = x + v*dt + 0.5*a*dt^2 = 1 + 0.5*0.1 + 0.5*(-1)*0.01
            const expectedX = 1.0 + 0.5 * 0.1 + 0.5 * (-1.0) * 0.01;
            assert.ok(Math.abs(newState[0] - expectedX) < 0.0001);
            
            // v should be updated based on average acceleration
            assert.ok(newState[1] < 0.5); // Velocity should decrease
        });

        it('should handle multi-dimensional states', () => {
            // State format: [x, y, vx, vy]
            const state = [1.0, 2.0, 0.5, -0.3];
            
            // Derivative returns [vx, vy, ax, ay]
            const derivative = (s) => {
                const n = s.length / 2;
                const velocity = s.slice(n);
                const acceleration = [0.0, -9.8]; // Gravity
                return [...velocity, ...acceleration];
            };
            const dt = 0.01;
            
            const newState = Integrators.velocityVerlet(state, derivative, dt);
            
            assert.strictEqual(newState.length, 4);
            
            // Position should update
            assert.ok(newState[0] > state[0]); // x increases
            assert.ok(newState[1] < state[1]); // y decreases (gravity)
            
            // Velocity should update
            assert.ok(Math.abs(newState[2] - state[2]) < 0.01); // vx barely changes
            assert.ok(newState[3] < state[3]); // vy decreases (gravity)
        });
    });
});
