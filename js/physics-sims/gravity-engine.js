/**
 * Gravity Engine - Pure physics calculations for N-body gravity simulation
 * Handles all physics logic: forces, positions, velocities, and body generation
 */

import { Integrators } from '../integrators/integrators.js';

export class GravityEngine {
    static CONFIG = {
        softening_factor: 5,
        integrator: Integrators.rk4,
        minMass: 2,
        maxMass: 10000,
        massPowerLawScaling: 2.35
    };

    constructor(width, height, bodyCount = 3, G = 1.0) {
        this.width = width;
        this.height = height;
        this.G = G;
        this.bodies = [];
        this.timeStep = 0.016; // ~60 FPS

        this.initialize(bodyCount);
    }

    /**
     * Generate mass using power law distribution
     */
    static generatePowerLawMass() {
        const minMass = GravityEngine.CONFIG.minMass;
        const maxMass = GravityEngine.CONFIG.maxMass;
        const alpha = GravityEngine.CONFIG.massPowerLawScaling;
        const u = Math.random();
        const exp = 1 - alpha;
        
        // The formula derived from Inverse Transform Sampling
        const mass = Math.pow(
            (Math.pow(maxMass, exp) - Math.pow(minMass, exp)) * u + Math.pow(minMass, exp),
            1 / exp
        );
        
        return mass;
    }

    /**
     * Generate random bodies for gravity simulation
     */
    static generateRandomBodies(count, width, height) {
        const bodies = [];
        for (let i = 0; i < count; i++) {
            bodies.push({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                mass: GravityEngine.generatePowerLawMass()
            });
        }
        return bodies;
    }

    /**
     * Calculate gravitational force between two bodies
     */
    static calculateGravitationalForce(body1, body2, G = 1) {
        const dx = body2.x - body1.x;
        const dy = body2.y - body1.y;
        const distanceSquared = dx * dx + dy * dy;

        // The softened distance ensures we don't encounter errors when distance = 0
        const softenedDistanceSquared = distanceSquared + GravityEngine.CONFIG.softening_factor * GravityEngine.CONFIG.softening_factor;
        const softenedDistance = Math.sqrt(softenedDistanceSquared);
        
        const forceMagnitude = G * body1.mass * body2.mass / softenedDistanceSquared;
        const fx = forceMagnitude * dx / softenedDistance;
        const fy = forceMagnitude * dy / softenedDistance;
        
        return { fx, fy };
    }

    /**
     * Update body position using numerical integration
     */
    static updatePosition(body, fx, fy, dt) {
        // Define the state as [x, y, vx, vy]
        const state = [body.x, body.y, body.vx, body.vy];
        
        // Define the derivative function (equations of motion)
        const derivative = (s) => {
            const [x, y, vx, vy] = s;
            const ax = fx / body.mass;
            const ay = fy / body.mass;
            return [vx, vy, ax, ay]; // [dx/dt, dy/dt, dvx/dt, dvy/dt]
        };
        
        // Integrate using configured method
        const newState = GravityEngine.CONFIG.integrator(state, derivative, dt);
        
        // Update body state
        [body.x, body.y, body.vx, body.vy] = newState;
    }

    /**
     * Initialize bodies for simulation
     */
    initialize(bodyCount) {
        this.bodies = GravityEngine.generateRandomBodies(
            bodyCount, 
            this.width, 
            this.height
        );
    }

    /**
     * Update simulation by one time step
     */
    step() {
        // Calculate forces between all pairs of bodies
        const forces = this.bodies.map(() => ({ fx: 0, fy: 0 }));
        
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const force = GravityEngine.calculateGravitationalForce(
                    this.bodies[i],
                    this.bodies[j],
                    this.G
                );
                
                forces[i].fx += force.fx;
                forces[i].fy += force.fy;
                forces[j].fx -= force.fx;
                forces[j].fy -= force.fy;
            }
        }
        
        // Update positions
        for (let i = 0; i < this.bodies.length; i++) {
            GravityEngine.updatePosition(
                this.bodies[i],
                forces[i].fx,
                forces[i].fy,
                this.timeStep
            );
            
            // Boundary conditions - wrap around edges
            if (this.bodies[i].x < 0) this.bodies[i].x += this.width;
            if (this.bodies[i].x > this.width) this.bodies[i].x -= this.width;
            if (this.bodies[i].y < 0) this.bodies[i].y += this.height;
            if (this.bodies[i].y > this.height) this.bodies[i].y -= this.height;
        }
    }

    /**
     * Get current state
     */
    getState() {
        return {
            bodies: this.bodies.map(b => ({
                id: b.id,
                x: b.x,
                y: b.y,
                vx: b.vx,
                vy: b.vy,
                mass: b.mass
            })),
            width: this.width,
            height: this.height
        };
    }

    /**
     * Reset the engine
     */
    reset(bodyCount) {
        this.initialize(bodyCount || this.bodies.length);
    }

    /**
     * Update gravitational constant
     */
    setG(newG) {
        this.G = newG;
    }

    /**
     * Update dimensions
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }
}
