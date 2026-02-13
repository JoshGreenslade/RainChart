/**
 * Color Scheme Utility
 * Generates HSL color schemes for renderers
 */

export class ColorScheme {
    static OBJECT_COLOR_COUNT = 10;
    
    /**
     * Generate HSL color scheme with random hue, 50% saturation, 20%/80% lightness
     * @returns {Object} Color scheme with background, foreground, and object colors
     */
    static generate() {
        const hue = Math.floor(Math.random() * 360);
        const background = `hsl(${hue}, 50%, 20%)`; // Dark background
        const foreground = `hsl(${hue}, 50%, 80%)`; // Light foreground
        
        // Generate object colors with different hues but same saturation/lightness rules
        const objectColors = [];
        const hueStep = 360 / ColorScheme.OBJECT_COLOR_COUNT; // Spread hues evenly
        
        for (let i = 0; i < ColorScheme.OBJECT_COLOR_COUNT; i++) {
            const objectHue = (hue + (i * hueStep)) % 360;
            // Use 80% lightness for objects to contrast with 20% dark background
            const lightness = 80;
            objectColors.push(`hsl(${objectHue}, 50%, ${lightness}%)`);
        }
        
        return {
            hue,
            background,
            foreground,
            objectColors
        };
    }
}
