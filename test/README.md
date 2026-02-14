# Running Tests

This project includes unit and integration tests for the **infrastructure** components to ensure the framework works correctly.

## Testing Philosophy

Following the project's principle of separation of concerns, tests focus on:
- **Infrastructure components**: Interfaces, base classes, renderers, integrators, module system
- **NOT simulation-specific implementations**: Tests do not validate physics correctness

As long as a simulation implements the required interfaces (ISimulation, ISimulationEngine, etc.), it will work within the framework. Physics accuracy is the responsibility of individual simulation implementations.

## Test Structure

```
test/
├── unit/                       # Unit tests for infrastructure modules
│   ├── integrators.test.js     # Tests for numerical integration methods
│   └── base-renderer.test.js   # Tests for renderer factory
└── integration/                # Integration tests for complete features
    └── module-imports.test.js  # Tests for ES6 module system
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run Specific Test File
```bash
node --test test/unit/integrators.test.js
```

## Test Coverage

### Unit Tests

- **Integrators** (`test/unit/integrators.test.js`)
  - Tests all numerical integration methods (Euler, RK4, Verlet, Velocity Verlet)
  - Validates accuracy against known ODE solutions
  - Tests scalar and array state handling
  - These are infrastructure components used by all simulations

- **BaseRenderer** (`test/unit/base-renderer.test.js`)
  - Tests factory pattern for creating Canvas/SVG renderers
  - Tests delegation to concrete renderer implementations
  - Core infrastructure for all visualizations

### Integration Tests

- **Module Imports** (`test/integration/module-imports.test.js`)
  - Tests ES6 module imports and exports
  - Tests interface exports (ISimulation, ISimulationEngine, ISimulationConfig, ISimulationControls)
  - Tests renderer module exports
  - Tests barrel export from `rainchart.js`
  - Tests selective imports
  - Infrastructure module system validation

## Testing Philosophy

Following the project's "no build step" philosophy:
- Tests use Node.js built-in test runner (available in Node.js 18+)
- No external testing frameworks required
- Tests are written as ES6 modules
- Tests can run directly without compilation or transpilation

## Continuous Integration

Tests should be run:
- Before committing changes
- As part of CI/CD pipeline
- When adding new features
- When fixing bugs

## Writing New Tests

When adding new tests:
1. Follow the existing test structure and naming conventions
2. Use descriptive test names that explain what is being tested
3. Test both happy paths and edge cases
4. Keep tests focused and independent
5. Use `beforeEach` for test setup when needed
6. Mock external dependencies when appropriate

Example test structure:
```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('ModuleName', () => {
    describe('methodName', () => {
        it('should do something specific', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = method(input);
            
            // Assert
            assert.strictEqual(result, 'expected');
        });
    });
});
```

## Known Limitations

- Renderer tests are limited in Node.js environment due to lack of DOM
- Some D3Renderer tests cannot run without a browser environment
- Browser-specific integration tests should use `test-selective-import.html`
- **Simulation implementations are not tested**: Physics accuracy is the responsibility of individual simulations

## Browser Testing

For browser-specific testing, open `test-selective-import.html` in a browser to verify:
- Module imports work in browser context
- Renderers work with actual DOM elements
- Visual output is correct
