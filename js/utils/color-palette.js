/**
 * Color Palette - Shared color constants for the application
 * 
 * Provides a consistent color palette across renderers and simulations.
 * This ensures visual consistency and reduces duplication.
 */

/**
 * Standard color palette used across the application
 * @constant {string[]}
 */
export const DEFAULT_COLOR_PALETTE = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
    '#1abc9c', '#e67e22', '#34495e', '#16a085', '#27ae60',
    '#c0392b', '#2980b9', '#27ae60', '#d35400', '#8e44ad'
];

/**
 * Base 10-color palette for basic use cases
 * @constant {string[]}
 */
export const BASE_COLOR_PALETTE = DEFAULT_COLOR_PALETTE.slice(0, 10);
