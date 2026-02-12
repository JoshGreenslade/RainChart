# Separating into Multiple Repositories

This document explains how to split the current monorepo into separate repositories for physics and visualization, as intended by the architecture.

## Proposed Repository Structure

```
physics-simulations/              (Core physics engine)
├── package.json
├── src/
│   ├── physics-engine.js
│   ├── gravity-sim.js
│   ├── temperature-sim.js
│   └── trajectory-sim.js
├── test/
│   └── (unit tests)
└── README.md

visualization-library/            (Rendering layer)
├── package.json
├── src/
│   └── chart-renderer.js
├── examples/
│   └── (example usage)
└── README.md

physics-web-app/                  (Web application)
├── package.json
├── index.html
├── styles/
│   └── main.css
├── src/
│   └── main.js
└── README.md
```

## Physics Simulations Package

**Purpose:** Pure physics calculations with zero dependencies on visualization

**Export Format (ESM):**
```javascript
// physics-simulations/src/index.js
export { PhysicsEngine } from './physics-engine.js';
export { GravitySimulator } from './gravity-sim.js';
export { TemperatureSimulator } from './temperature-sim.js';
export { TrajectorySimulator } from './trajectory-sim.js';
```

**Usage:**
```javascript
import { GravitySimulator } from '@yourorg/physics-simulations';

const sim = new GravitySimulator(800, 600, 3, 1.0);
sim.onUpdate(state => console.log(state));
sim.start();
```

**Distribution:**
- NPM package for Node.js and bundlers
- UMD build for direct browser usage
- ES modules for modern browsers

**Use Cases:**
- Web applications (this project)
- Mobile apps (React Native, NativeScript)
- Desktop apps (Electron)
- Server-side physics calculations
- CLI tools for physics analysis
- Educational platforms
- Game engines
- Research tools

## Visualization Library Package

**Purpose:** Rendering physics data with various visualization libraries

**Export Format (ESM):**
```javascript
// visualization-library/src/index.js
export { CanvasRenderer } from './canvas-renderer.js';
export { D3Renderer } from './d3-renderer.js';
export { ThreeRenderer } from './three-renderer.js';
```

**Usage:**
```javascript
import { CanvasRenderer } from '@yourorg/physics-viz';

CanvasRenderer.renderGravity('chart-id', physicsState, options);
```

**Multiple Renderer Backends:**
- Canvas (current implementation)
- D3.js (SVG-based, highly interactive)
- Three.js (WebGL, 3D visualizations)
- Chart.js (if building on existing charting)
- Custom renderers for specific needs

**Distribution:**
- NPM package with peer dependencies
- Tree-shakable (import only what you need)
- TypeScript definitions

## Web Application Package

**Purpose:** User-facing application that combines physics and visualization

**Dependencies:**
```json
{
  "dependencies": {
    "@yourorg/physics-simulations": "^1.0.0",
    "@yourorg/physics-viz": "^1.0.0"
  }
}
```

**Usage:**
```javascript
import { GravitySimulator } from '@yourorg/physics-simulations';
import { CanvasRenderer } from '@yourorg/physics-viz';

const sim = new GravitySimulator(800, 600, 3, 1.0);
sim.onUpdate(state => {
    CanvasRenderer.renderGravity('chart', state);
});
```

## Migration Steps

### Step 1: Extract Physics Package

```bash
# Create new repo
mkdir physics-simulations
cd physics-simulations
git init

# Copy physics files
cp ../RainChart/js/physics-engine.js src/
cp ../RainChart/js/gravity-sim.js src/
cp ../RainChart/js/temperature-sim.js src/
cp ../RainChart/js/trajectory-sim.js src/

# Add package.json, tests, docs
# Publish to NPM
```

### Step 2: Extract Visualization Package

```bash
# Create new repo
mkdir visualization-library
cd visualization-library
git init

# Copy renderer
cp ../RainChart/js/chart-renderer.js src/canvas-renderer.js

# Add package.json, examples, docs
# Publish to NPM
```

### Step 3: Update Web App

```bash
# In RainChart repo
npm install @yourorg/physics-simulations @yourorg/physics-viz

# Update imports in main.js
# Remove old js/ files
# Keep only HTML, CSS, and glue code
```

## Benefits of Separation

### Independent Versioning
- Physics: v1.0.0 → v1.1.0 (add wave simulation)
- Viz: v2.0.0 → v2.1.0 (add D3 renderer)
- App: stays on physics v1.0.0, upgrades viz to v2.1.0

### Independent Development
- Physics team: Focus on algorithms, performance
- Viz team: Focus on UX, graphics, interaction
- App team: Focus on user experience, deployment

### Reuse Across Projects

**Physics Package Used By:**
- Web app (this project)
- Mobile app (React Native)
- Research tools (Node.js CLI)
- Educational platform (different UI)

**Viz Package Used By:**
- This physics app
- Chemistry simulations
- Biology models
- Engineering tools

### Easier Testing

**Physics Package:**
- Pure unit tests (no DOM)
- Performance benchmarks
- Algorithm validation
- Runs in Node.js

**Viz Package:**
- Visual regression tests
- Render performance tests
- Snapshot testing
- Runs in browser

**Web App:**
- Integration tests
- E2E tests
- User acceptance tests

## Current State

✅ **Architecture is ready** - Clean separation already implemented
✅ **No refactoring needed** - Just move files to new repos
✅ **Observer pattern works** - No coupling between layers
✅ **Can be done incrementally** - Start with one package

## Recommended First Steps

1. **Test current separation**
   - Try importing physics files in Node.js
   - Verify no DOM/visualization dependencies
   - Run physics calculations without UI

2. **Add module exports**
   - Convert to ES modules
   - Add proper exports
   - Test imports work

3. **Create physics package**
   - Most valuable for reuse
   - Easiest to test
   - No external dependencies

4. **Publish to NPM**
   - Start with @yourorg/physics-simulations
   - Use in current app via npm
   - Proves separation works

5. **Extract visualization**
   - Once physics package proven
   - Create @yourorg/physics-viz
   - Support multiple renderers

## Example: Using Separated Packages

### In a Node.js Research Tool

```javascript
// No visualization needed!
const { GravitySimulator } = require('@yourorg/physics-simulations');

const sim = new GravitySimulator(1000, 1000, 100, 1.0);

// Collect data for analysis
const data = [];
sim.onUpdate(state => {
    data.push({
        time: Date.now(),
        totalEnergy: calculateEnergy(state.bodies)
    });
});

sim.start();
// Run for 10 seconds, then analyze
setTimeout(() => {
    sim.stop();
    analyzeStability(data);
}, 10000);
```

### In a React Native Mobile App

```javascript
// Different visualization (native components)
import { GravitySimulator } from '@yourorg/physics-simulations';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

function GravityView() {
    const sim = new GravitySimulator(400, 600, 5, 1.0);
    const [bodies, setBodies] = useState([]);
    
    useEffect(() => {
        sim.onUpdate(state => setBodies(state.bodies));
        sim.start();
        return () => sim.stop();
    }, []);
    
    return (
        <Svg width={400} height={600}>
            {bodies.map(body => (
                <Circle 
                    key={body.id}
                    cx={body.x}
                    cy={body.y}
                    r={Math.sqrt(body.mass) * 2}
                    fill="#3498db"
                />
            ))}
        </Svg>
    );
}
```

### In a Three.js 3D Visualization

```javascript
// Different visualization library
import { GravitySimulator } from '@yourorg/physics-simulations';
import * as THREE from 'three';

const sim = new GravitySimulator(100, 100, 10, 1.0);
const scene = new THREE.Scene();

// Create 3D spheres for each body
const meshes = sim.getState().bodies.map(body => {
    const geometry = new THREE.SphereGeometry(body.mass / 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
    return new THREE.Mesh(geometry, material);
});

sim.onUpdate(state => {
    state.bodies.forEach((body, i) => {
        meshes[i].position.set(body.x, body.y, 0);
    });
});
```

## Conclusion

The current architecture is **already designed for separation**. The code can be split into separate repositories with minimal changes:

1. Copy files to new repos
2. Add package.json and module exports
3. Publish to NPM
4. Update main app to use packages

No refactoring required - the clean separation is already implemented!
