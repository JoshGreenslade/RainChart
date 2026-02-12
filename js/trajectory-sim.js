/**
 * Trajectory Simulator - Physics Layer
 * Pure physics simulation without any graphing dependencies
 */

class TrajectorySimulator {
    constructor(velocity = 50, angle = 45, resistanceType = 'none', dragCoeff = 0.1) {
        this.initialVelocity = velocity;
        this.angle = angle;
        this.resistanceType = resistanceType;
        this.dragCoeff = dragCoeff;
        this.g = 9.8;
        this.timeStep = 0.01;
        this.trajectory = [];
        this.isRunning = false;
        this.listeners = [];
    }

    /**
     * Register a callback to be notified of state updates
     */
    onUpdate(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify all listeners of state update
     */
    notifyListeners() {
        const state = this.getState();
        this.listeners.forEach(listener => listener(state));
    }

    /**
     * Get current simulation state (pure data)
     */
    getState() {
        return {
            trajectory: [...this.trajectory],
            resistanceType: this.resistanceType,
            isRunning: this.isRunning,
            initialVelocity: this.initialVelocity,
            angle: this.angle,
            dragCoeff: this.dragCoeff
        };
    }

    /**
     * Launch projectile with current settings
     */
    launch() {
        this.stop();
        this.trajectory = [];
        
        // Convert angle to radians and set initial state
        const angleRad = this.angle * Math.PI / 180;
        const state = {
            x: 0,
            y: 0,
            vx: this.initialVelocity * Math.cos(angleRad),
            vy: this.initialVelocity * Math.sin(angleRad)
        };
        
        // Calculate trajectory
        while (state.y >= 0 && this.trajectory.length < 10000) {
            this.trajectory.push({ x: state.x, y: state.y });
            
            const newState = PhysicsEngine.projectileMotion(
                state,
                this.g,
                this.resistanceType,
                this.dragCoeff,
                this.timeStep
            );
            
            state.x = newState.x;
            state.y = newState.y;
            state.vx = newState.vx;
            state.vy = newState.vy;
            
            // Break if projectile has landed
            if (state.y < 0) {
                // Interpolate to find exact landing point
                const prevPoint = this.trajectory[this.trajectory.length - 1];
                const t = prevPoint.y / (prevPoint.y - state.y);
                const landingX = prevPoint.x + t * (state.x - prevPoint.x);
                this.trajectory.push({ x: landingX, y: 0 });
                break;
            }
        }
        
        this.notifyListeners();
    }

    /**
     * Stop/clear current trajectory
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Reset the simulation
     */
    reset() {
        this.stop();
        this.trajectory = [];
        this.notifyListeners();
    }

    /**
     * Update simulation parameters
     */
    setParameters(velocity, angle, resistanceType, dragCoeff) {
        this.initialVelocity = velocity;
        this.angle = angle;
        this.resistanceType = resistanceType;
        this.dragCoeff = dragCoeff;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.listeners = [];
    }
}
