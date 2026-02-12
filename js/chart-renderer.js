/**
 * Chart Renderers - Visualization Layer using Canvas API
 * Completely separate from physics - consumes physics data and renders it
 * Using Canvas instead of D3.js to avoid external dependencies
 */

const ChartRenderer = {
    /**
     * Render gravity simulation state
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from GravitySimulator
     * @param {Object} options - Rendering options (colors, sizes, etc.)
     */
    renderGravitySimulation(containerId, state, options = {}) {
        const container = document.getElementById(containerId);
        const width = options.width || 800;
        const height = options.height || 600;
        
        // Create or get canvas
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.border = '1px solid #bdc3c7';
            canvas.style.background = '#f8f9fa';
            container.innerHTML = '';
            container.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Define color palette
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
                        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#27ae60'];
        
        // Draw bodies
        state.bodies.forEach((body, i) => {
            ctx.fillStyle = colors[i % colors.length];
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            
            const radius = Math.sqrt(body.mass) * 2;
            
            ctx.beginPath();
            ctx.arc(body.x, body.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        });
    },

    /**
     * Render temperature distribution
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from TemperatureSimulator
     * @param {Object} options - Rendering options
     */
    renderTemperature(containerId, state, options = {}) {
        const container = document.getElementById(containerId);
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        
        // Create or get canvas
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.border = '1px solid #bdc3c7';
            canvas.style.background = '#fff';
            container.innerHTML = '';
            container.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Find max temperature for scaling
        const maxTemp = Math.max(...state.temperatures, 1);
        
        // Draw temperature bars
        const barWidth = chartWidth / state.points;
        
        state.temperatures.forEach((temp, i) => {
            const x = margin.left + i * barWidth;
            const barHeight = (temp / maxTemp) * chartHeight;
            const y = margin.top + chartHeight - barHeight;
            
            // Create color based on temperature (blue = cold, red = hot)
            const ratio = temp / maxTemp;
            const r = Math.floor(255 * ratio);
            const b = Math.floor(255 * (1 - ratio));
            ctx.fillStyle = `rgb(${r}, 100, ${b})`;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
        
        // Draw axes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, height - margin.bottom);
        ctx.lineTo(width - margin.right, height - margin.bottom);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, height - margin.bottom);
        ctx.stroke();
        
        // Labels
        ctx.textAlign = 'center';
        ctx.fillText('Position along bar', width / 2, height - 10);
        
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Temperature', 0, 0);
        ctx.restore();
        
        // Y-axis tick marks
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (chartHeight * i / 5);
            const value = maxTemp * (1 - i / 5);
            ctx.fillText(value.toFixed(1), margin.left - 5, y + 3);
        }
    },

    /**
     * Render trajectory path
     * @param {string} containerId - DOM element ID for the chart
     * @param {Object} state - Physics state from TrajectorySimulator
     * @param {Object} options - Rendering options
     */
    renderTrajectory(containerId, state, options = {}) {
        const container = document.getElementById(containerId);
        const width = options.width || 800;
        const height = options.height || 400;
        const margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
        
        // Create or get canvas
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.border = '1px solid #bdc3c7';
            canvas.style.background = '#fff';
            container.innerHTML = '';
            container.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        
        if (state.trajectory.length === 0) {
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Click "Launch" to see the trajectory', width / 2, height / 2);
            return;
        }
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Find max values for scaling
        const maxX = Math.max(...state.trajectory.map(p => p.x)) * 1.1;
        const maxY = Math.max(...state.trajectory.map(p => p.y)) * 1.1;
        
        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            // Vertical grid lines
            const x = margin.left + (chartWidth * i / 10);
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, height - margin.bottom);
            ctx.stroke();
            
            // Horizontal grid lines
            const y = margin.top + (chartHeight * i / 10);
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(width - margin.right, y);
            ctx.stroke();
        }
        
        // Draw trajectory
        const colorMap = {
            'none': '#3498db',
            'linear': '#e74c3c',
            'quadratic': '#f39c12'
        };
        
        ctx.strokeStyle = colorMap[state.resistanceType] || '#3498db';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        state.trajectory.forEach((point, i) => {
            const x = margin.left + (point.x / maxX) * chartWidth;
            const y = height - margin.bottom - (point.y / maxY) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw axes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, height - margin.bottom);
        ctx.lineTo(width - margin.right, height - margin.bottom);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, height - margin.bottom);
        ctx.stroke();
        
        // Labels
        ctx.textAlign = 'center';
        ctx.fillText('Horizontal Distance (m)', width / 2, height - 10);
        
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Height (m)', 0, 0);
        ctx.restore();
        
        // Tick marks
        ctx.textAlign = 'center';
        for (let i = 0; i <= 5; i++) {
            const x = margin.left + (chartWidth * i / 5);
            const value = maxX * i / 5;
            ctx.fillText(value.toFixed(1), x, height - margin.bottom + 15);
        }
        
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (chartHeight * i / 5);
            const value = maxY * (1 - i / 5);
            ctx.fillText(value.toFixed(1), margin.left - 5, y + 3);
        }
        
        // Legend
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Air Resistance: ${state.resistanceType}`, width - margin.right - 150, margin.top + 10);
    }
};

