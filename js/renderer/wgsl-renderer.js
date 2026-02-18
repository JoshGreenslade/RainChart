/**
 * WGSL Renderer - WebGPU-based renderer for high-performance visualization
 * Capable of rendering 10,000+ objects using GPU acceleration
 * 
 * Note: This renderer implements a subset of the IRenderer interface
 * focused on high-performance primitive rendering (circles primarily)
 */

import { IRenderer } from './renderer-interface.js';

export class WGSLRenderer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.width = options.width || 800;
        this.height = options.height || 600;
        this.background = options.background || '#000000';
        
        // WebGPU state
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.initialized = false;
        this.initError = null;
        
        // Rendering state
        this.circles = [];
        this.maxCircles = options.maxCircles || 100000;
        
        // Color scheme
        this.colorScheme = {
            background: this.background,
            foreground: '#ffffff',
            accent: '#3498db'
        };
        
        // Initialize WebGPU asynchronously
        // Note: Constructor completes synchronously, but rendering won't work until initialized
        // Expose initialization promise so callers can wait for readiness
        this.initPromise = this._initWebGPU().catch(err => {
            console.error('Failed to initialize WebGPU:', err);
            this.initError = err;
            // WebGPU initialization failed - renderer will be non-functional
        });
    }
    
    /**
     * Initialize WebGPU context and pipeline
     * @private
     */
    async _initWebGPU() {
        // Check for WebGPU support
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in this browser');
        }
        
        // Get container element
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container element with id '${this.containerId}' not found`);
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.innerHTML = '';
        container.appendChild(canvas);
        this.canvas = canvas;
        
        // Request adapter and device
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('No WebGPU adapter found');
        }
        
        this.device = await adapter.requestDevice();
        
        // Get canvas context
        this.context = canvas.getContext('webgpu');
        if (!this.context) {
            throw new Error('Failed to get WebGPU context');
        }
        
        // Configure context
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: presentationFormat,
            alphaMode: 'opaque',
        });
        
        // Create shader module
        const shaderModule = this.device.createShaderModule({
            label: 'Circle Shader',
            code: this._getShaderCode()
        });
        
        // Create render pipeline
        this.pipeline = this.device.createRenderPipeline({
            label: 'Circle Pipeline',
            layout: 'auto',
            vertex: {
                module: shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                    arrayStride: 32, // 8 floats * 4 bytes
                    stepMode: 'instance', // Per-instance data
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: 'float32x2' },  // position
                        { shaderLocation: 1, offset: 8, format: 'float32' },     // radius
                        { shaderLocation: 2, offset: 12, format: 'float32x4' },  // color
                        { shaderLocation: 3, offset: 28, format: 'float32' }     // opacity
                    ]
                }]
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fragmentMain',
                targets: [{
                    format: presentationFormat,
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        }
                    }
                }]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });
        
        this.initialized = true;
    }
    
    /**
     * Get WGSL shader code for rendering circles
     * Note: This embeds width and height into the shader at initialization time.
     * The resize() method reinitializes the entire pipeline to update these values.
     * @private
     */
    _getShaderCode() {
        return `
            struct VertexInput {
                @location(0) position: vec2f,
                @location(1) radius: f32,
                @location(2) color: vec4f,
                @location(3) opacity: f32,
                @builtin(vertex_index) vertexIndex: u32
            };
            
            struct VertexOutput {
                @builtin(position) position: vec4f,
                @location(0) color: vec4f,
                @location(1) circlePos: vec2f,
                @location(2) radius: f32
            };
            
            @vertex
            fn vertexMain(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;
                
                // Convert screen coordinates to NDC
                let ndcX = (input.position.x / ${this.width}.0) * 2.0 - 1.0;
                let ndcY = 1.0 - (input.position.y / ${this.height}.0) * 2.0;
                
                // Generate quad vertices (6 vertices per circle)
                let vertices = array<vec2f, 6>(
                    vec2f(-1.0, -1.0),
                    vec2f(1.0, -1.0),
                    vec2f(1.0, 1.0),
                    vec2f(-1.0, -1.0),
                    vec2f(1.0, 1.0),
                    vec2f(-1.0, 1.0)
                );
                
                let vertexOffset = vertices[input.vertexIndex % 6u];
                let radiusNDC = input.radius / ${Math.max(this.width, this.height)}.0 * 2.0;
                
                output.position = vec4f(
                    ndcX + vertexOffset.x * radiusNDC,
                    ndcY + vertexOffset.y * radiusNDC,
                    0.0,
                    1.0
                );
                
                output.color = vec4f(input.color.rgb, input.color.a * input.opacity);
                output.circlePos = vertexOffset;
                output.radius = 1.0;
                
                return output;
            }
            
            @fragment
            fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
                let dist = length(input.circlePos);
                if (dist > input.radius) {
                    discard;
                }
                
                // Smooth antialiasing
                let alpha = 1.0 - smoothstep(input.radius - 0.1, input.radius, dist);
                
                return vec4f(input.color.rgb, input.color.a * alpha);
            }
        `;
    }
    
    /**
     * Check if the renderer is ready to render
     * @returns {boolean} True if initialized and no errors, false otherwise
     */
    isReady() {
        return this.initialized && !this.initError;
    }
    
    /**
     * Wait for renderer initialization to complete
     * @returns {Promise<void>} Resolves when initialized, rejects if initialization failed
     */
    async waitForReady() {
        await this.initPromise;
        if (this.initError) {
            throw this.initError;
        }
    }
    
    /**
     * Parse color string to RGBA values
     * @private
     */
    _parseColor(colorStr) {
        // Handle hex colors
        if (colorStr.startsWith('#')) {
            const hex = colorStr.substring(1);
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;
            return [r, g, b, 1.0];
        }
        
        // Handle HSL colors
        if (colorStr.startsWith('hsl')) {
            // Simple conversion - for production, use a proper color library
            return [0.5, 0.5, 0.8, 1.0]; // Fallback
        }
        
        // Default to white
        return [1.0, 1.0, 1.0, 1.0];
    }
    
    /**
     * Add a circle to the scene
     * Note: Returns 'pending' if WebGPU is still initializing
     */
    addCircle(x, y, radius, style = {}) {
        if (!this.initialized) {
            console.warn('WGSLRenderer not initialized yet, circle will not be rendered');
            return `pending-circle-${Date.now()}`;
        }
        
        const color = this._parseColor(style.fill || '#ffffff');
        const opacity = style.opacity !== undefined ? style.opacity : 1.0;
        
        this.circles.push({
            x, y, radius, color, opacity
        });
        
        return `circle-${this.circles.length - 1}`;
    }
    
    /**
     * Add a line to the scene (not efficiently supported in WGSL renderer)
     */
    addLine(x1, y1, x2, y2, style = {}) {
        console.warn('addLine is not optimized in WGSL renderer');
        return 'line-unsupported';
    }
    
    /**
     * Add a rectangle (not efficiently supported in WGSL renderer)
     */
    addRectangle(x, y, width, height, style = {}) {
        console.warn('addRectangle is not optimized in WGSL renderer');
        return 'rect-unsupported';
    }
    
    /**
     * Add a curve (not supported in WGSL renderer)
     */
    addCurve(points, style = {}) {
        console.warn('addCurve is not supported in WGSL renderer');
        return 'curve-unsupported';
    }
    
    /**
     * Add a path (not supported in WGSL renderer)
     */
    addPath(pathData, style = {}) {
        console.warn('addPath is not supported in WGSL renderer');
        return 'path-unsupported';
    }
    
    /**
     * Add an axis (not supported in WGSL renderer)
     */
    addAxis(type, position, min, max, options = {}) {
        console.warn('addAxis is not supported in WGSL renderer');
        return 'axis-unsupported';
    }
    
    /**
     * Update an existing element (not supported - requires full redraw)
     */
    updateElement(id, attributes) {
        // WGSL renderer requires full redraw
    }
    
    /**
     * Remove an element (not supported - requires full redraw)
     */
    removeElement(id) {
        // WGSL renderer requires full redraw
    }
    
    /**
     * Clear all elements and render
     */
    clear() {
        if (!this.initialized || !this.device || !this.context) {
            return;
        }
        
        try {
            // Store circles to render, then clear the array for next frame
            const circlesToRender = this.circles;
            this.circles = [];
            
            // Create vertex buffer
            if (circlesToRender.length === 0) {
                // Just clear the canvas
                const commandEncoder = this.device.createCommandEncoder();
                const textureView = this.context.getCurrentTexture().createView();
                
                const bg = this._parseColor(this.background);
                const renderPass = commandEncoder.beginRenderPass({
                    colorAttachments: [{
                        view: textureView,
                        clearValue: { r: bg[0], g: bg[1], b: bg[2], a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store'
                    }]
                });
                
                renderPass.end();
                this.device.queue.submit([commandEncoder.finish()]);
                return;
            }
            
            // Prepare vertex data (8 floats per circle)
            const vertexData = new Float32Array(circlesToRender.length * 8);
            for (let i = 0; i < circlesToRender.length; i++) {
                const circle = circlesToRender[i];
                const offset = i * 8;
                vertexData[offset + 0] = circle.x;
                vertexData[offset + 1] = circle.y;
                vertexData[offset + 2] = circle.radius;
                vertexData[offset + 3] = circle.color[0];
                vertexData[offset + 4] = circle.color[1];
                vertexData[offset + 5] = circle.color[2];
                vertexData[offset + 6] = circle.color[3];
                vertexData[offset + 7] = circle.opacity;
            }
            
            const vertexBuffer = this.device.createBuffer({
                label: 'Circle Vertices',
                size: vertexData.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
            
            this.device.queue.writeBuffer(vertexBuffer, 0, vertexData);
            
            // Render
            const commandEncoder = this.device.createCommandEncoder();
            const textureView = this.context.getCurrentTexture().createView();
            
            const bg = this._parseColor(this.background);
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: textureView,
                    clearValue: { r: bg[0], g: bg[1], b: bg[2], a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }]
            });
            
            renderPass.setPipeline(this.pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.draw(6, circlesToRender.length, 0, 0); // vertexCount=6, instanceCount=circlesToRender.length
            renderPass.end();
            
            this.device.queue.submit([commandEncoder.finish()]);
            
        } catch (err) {
            console.error('Error rendering with WebGPU:', err);
        }
    }
    
    /**
     * Resize the rendering surface
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        
        // Mark as not initialized during reinit to prevent rendering with stale state
        if (this.initialized) {
            this.initialized = false;
            this._initWebGPU().catch(err => {
                console.error('Failed to reinitialize WebGPU after resize:', err);
            });
        }
    }
    
    /**
     * Get the current color scheme
     */
    getColorScheme() {
        return this.colorScheme;
    }
}

// Note: WGSL renderer implements IRenderer but some methods are not optimized
// It's designed specifically for high-performance circle rendering