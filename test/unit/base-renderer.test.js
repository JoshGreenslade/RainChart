/**
 * Unit tests for BaseRenderer
 * Tests the factory pattern and delegation to concrete renderers
 * 
 * Note: Renderer tests requiring DOM are skipped in Node.js environment
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BaseRenderer } from '../../js/renderer/base-renderer.js';

describe('BaseRenderer', () => {
    describe('constructor', () => {
        it('should create a Canvas renderer when renderMode is canvas', { skip: true }, () => {
            // Skipped: Requires DOM environment (window object)
            // This test should be run in browser using test-selective-import.html
        });

        it('should default to SVG mode when renderMode is not specified', { skip: true }, () => {
            // Skipped: Requires DOM environment (document object and D3.js)
            // This test should be run in browser using test-selective-import.html
        });
    });

    describe('delegation methods', () => {
        it('should have all required renderer methods', () => {
            const renderer = { renderMode: 'canvas', renderer: null };
            Object.setPrototypeOf(renderer, BaseRenderer.prototype);
            
            // Check that all required methods exist
            assert.ok(typeof renderer.addCircle === 'function');
            assert.ok(typeof renderer.addLine === 'function');
            assert.ok(typeof renderer.addRectangle === 'function');
            assert.ok(typeof renderer.addCurve === 'function');
            assert.ok(typeof renderer.clear === 'function');
            assert.ok(typeof renderer.resize === 'function');
        });
    });
});
