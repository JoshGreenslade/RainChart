/**
 * D3 Renderer - Customization-focused rendering using D3.js
 * Implements the common renderer interface
 * Optimized for interactivity and rich customization
 * 
 * Note: Requires D3.js v7+ to be loaded
 */

class D3Renderer {
    constructor() {
        this._svgs = new Map();
        
        // Check if D3 is available
        if (typeof d3 === 'undefined') {
            console.error('D3.js is not loaded. D3Renderer requires D3.js v7+');
        }
    }
    
    /**
     * Render gravity simulation (implements interface)
     */
    renderGravity(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 600;
        const config = { ...ChartConfig.gravity, ...(options.config || {}) };
        
        const container = d3.select(`#${containerId}`);
        
        // Create or get SVG
        let svg = container.select('svg');
        if (svg.empty()) {
            container.html('');
            svg = container.append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', config.backgroundColor)
                .style('border', `${config.borderWidth || 1}px solid ${config.borderColor}`);
        }
        
        // Draw grid if enabled
        if (config.showGrid) {
            this._drawD3Grid(svg, width, height, config.gridSize, config.gridColor);
        }
        
        // Bind data to circles
        const circles = svg.selectAll('circle.body')
            .data(state.bodies.slice(0, config.maxBodies), d => d.id);
        
        // Enter new circles
        circles.enter()
            .append('circle')
            .attr('class', 'body')
            .attr('r', d => Math.sqrt(d.mass) * config.bodySizeMultiplier)
            .attr('fill', (d, i) => config.bodyColors[i % config.bodyColors.length])
            .attr('stroke', config.bodyStrokeColor)
            .attr('stroke-width', config.bodyStrokeWidth)
            .attr('opacity', config.bodyOpacity)
            .merge(circles)
            .transition()
            .duration(16)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        // Remove old circles
        circles.exit().remove();
        
        // Show count if exceeding limit
        if (state.bodies.length > config.maxBodies) {
            svg.select('text.count-label').remove();
            svg.append('text')
                .attr('class', 'count-label')
                .attr('x', 10)
                .attr('y', 20)
                .attr('fill', '#e74c3c')
                .attr('font-weight', 'bold')
                .attr('font-size', '14px')
                .text(`Showing ${config.maxBodies} of ${state.bodies.length} bodies`);
        }
    }
    
    /**
     * Render temperature simulation (implements interface)
     */
    renderTemperature(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const config = { ...ChartConfig.temperature, ...(options.config || {}) };
        
        const container = d3.select(`#${containerId}`);
        container.html('');
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', config.backgroundColor)
            .style('border', `1px solid ${config.borderColor}`);
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, state.points - 1])
            .range([0, chartWidth]);
        
        const maxTemp = d3.max(state.temperatures);
        const yScale = d3.scaleLinear()
            .domain([0, Math.max(maxTemp, 1)])
            .range([chartHeight, 0]);
        
        // Draw temperature bars
        const barWidth = chartWidth / state.points;
        g.selectAll('rect')
            .data(state.temperatures)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => yScale(d))
            .attr('width', barWidth)
            .attr('height', d => chartHeight - yScale(d))
            .attr('fill', (d, i) => getTemperatureColor(d, maxTemp, config))
            .attr('opacity', config.barOpacity);
        
        // Add axes if enabled
        if (config.showAxes) {
            const xAxis = d3.axisBottom(xScale).ticks(10);
            const yAxis = d3.axisLeft(yScale).ticks(config.tickMarkCount);
            
            g.append('g')
                .attr('transform', `translate(0,${chartHeight})`)
                .call(xAxis)
                .append('text')
                .attr('x', chartWidth / 2)
                .attr('y', 40)
                .attr('fill', config.axisColor)
                .attr('text-anchor', 'middle')
                .text(config.xAxisLabel);
            
            g.append('g')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -chartHeight / 2)
                .attr('y', -40)
                .attr('fill', config.axisColor)
                .attr('text-anchor', 'middle')
                .text(config.yAxisLabel);
        }
    }
    
    /**
     * Render trajectory simulation (implements interface)
     */
    renderTrajectory(containerId, state, options = {}) {
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        const config = { ...ChartConfig.trajectory, ...(options.config || {}) };
        
        const container = d3.select(`#${containerId}`);
        container.html('');
        
        if (state.trajectory.length === 0) {
            container.append('p')
                .style('text-align', 'center')
                .style('padding', '50px')
                .style('color', '#7f8c8d')
                .text('Click "Launch" to see the trajectory');
            return;
        }
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', config.backgroundColor)
            .style('border', `1px solid ${config.borderColor}`);
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create scales
        const maxX = d3.max(state.trajectory, d => d.x) * 1.1;
        const maxY = d3.max(state.trajectory, d => d.y) * 1.1;
        
        const xScale = d3.scaleLinear()
            .domain([0, maxX])
            .range([0, chartWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([chartHeight, 0]);
        
        // Add grid if enabled
        if (config.showGrid) {
            g.append('g')
                .attr('class', 'grid')
                .attr('transform', `translate(0,${chartHeight})`)
                .call(d3.axisBottom(xScale).tickSize(-chartHeight).tickFormat(''))
                .style('stroke', config.gridColor)
                .style('opacity', config.gridOpacity);
            
            g.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale).tickSize(-chartWidth).tickFormat(''))
                .style('stroke', config.gridColor)
                .style('opacity', config.gridOpacity);
        }
        
        // Draw trajectory line
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveLinear);
        
        const pathColor = config.pathColors[state.resistanceType] || config.pathColors.none;
        
        g.append('path')
            .datum(state.trajectory)
            .attr('d', line)
            .attr('stroke', pathColor)
            .attr('stroke-width', config.pathWidth)
            .attr('fill', 'none')
            .attr('opacity', config.pathOpacity);
        
        // Draw projectile marker if enabled
        if (config.showProjectile && state.trajectory.length > 0) {
            const start = state.trajectory[0];
            g.append('circle')
                .attr('cx', xScale(start.x))
                .attr('cy', yScale(start.y))
                .attr('r', config.projectileSize)
                .attr('fill', config.projectileColor);
        }
        
        // Add axes if enabled
        if (config.showAxes) {
            const xAxis = d3.axisBottom(xScale).ticks(10);
            const yAxis = d3.axisLeft(yScale).ticks(10);
            
            g.append('g')
                .attr('transform', `translate(0,${chartHeight})`)
                .call(xAxis)
                .append('text')
                .attr('x', chartWidth / 2)
                .attr('y', 40)
                .attr('fill', '#000')
                .attr('text-anchor', 'middle')
                .text('Horizontal Distance (m)');
            
            g.append('g')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -chartHeight / 2)
                .attr('y', -40)
                .attr('fill', '#000')
                .attr('text-anchor', 'middle')
                .text('Height (m)');
        }
        
        // Add legend if enabled
        if (config.showLegend && config.legendPosition === 'topRight') {
            g.append('text')
                .attr('x', chartWidth - 150)
                .attr('y', 10)
                .attr('font-weight', 'bold')
                .attr('font-size', `${config.fontSize}px`)
                .text(`Air Resistance: ${state.resistanceType}`);
        }
    }
    
    /**
     * Draw grid helper for D3 (private method)
     */
    _drawD3Grid(svg, width, height, gridSize, color) {
        svg.selectAll('.grid-line').remove();
        
        const gridGroup = svg.append('g').attr('class', 'grid-line');
        
        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            gridGroup.append('line')
                .attr('x1', x)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', height)
                .attr('stroke', color)
                .attr('stroke-width', 0.5);
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            gridGroup.append('line')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)
                .attr('stroke', color)
                .attr('stroke-width', 0.5);
        }
    }
    
    /**
     * Clear a specific chart
     */
    clear(containerId) {
        const container = d3.select(`#${containerId}`);
        container.html('');
    }
    
    /**
     * Destroy renderer and clean up resources
     */
    destroy() {
        this._svgs.clear();
    }
}
