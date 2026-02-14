# Running Tests

This project includes both unit and integration tests to ensure code quality and correctness.

## Test Structure

```
test/
├── unit/                       # Unit tests for individual modules
│   ├── integrators.test.js     # Tests for numerical integration methods
│   ├── gravity-engine.test.js  # Tests for gravity physics engine
│   └── base-renderer.test.js   # Tests for renderer factory
└── integration/                # Integration tests for complete features
    ├── gravity-simulation.test.js  # Tests for complete simulation lifecycle
    └── module-imports.test.js      # Tests for ES6 module system
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

- **GravityEngine** (`test/unit/gravity-engine.test.js`)
  - Tests body generation with power-law mass distribution
  - Tests gravitational force calculations
  - Tests position updates and boundary conditions
  - Tests Newton's third law (equal and opposite forces)

- **BaseRenderer** (`test/unit/base-renderer.test.js`)
  - Tests factory pattern for creating Canvas/SVG renderers
  - Tests delegation to concrete renderer implementations

### Integration Tests

- **GravitySimulation** (`test/integration/gravity-simulation.test.js`)
  - Tests complete simulation lifecycle (start, stop, reset)
  - Tests state management and updates
  - Tests observer pattern for callbacks
  - Tests integration with engine and renderer
  - Tests edge cases (zero bodies, single body, many bodies)

- **Module Imports** (`test/integration/module-imports.test.js`)
  - Tests ES6 module imports and exports
  - Tests barrel export from `rainchart.js`
  - Tests selective imports
  - Tests cross-module dependencies
  - Tests module instantiation

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

## Browser Testing

For browser-specific testing, open `test-selective-import.html` in a browser to verify:
- Module imports work in browser context
- Renderers work with actual DOM elements
- Visual output is correct
