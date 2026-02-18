# Testing WebGPU Loading Indicator and Fallback

This document describes how to manually test the WebGPU loading indicator and graceful fallback functionality.

## Test Scenarios

### Scenario 1: WebGPU Supported (Success Path)

**Prerequisites:**
- Chrome 113+ or Edge 113+ or Firefox 128+
- Compatible GPU hardware
- WebGPU enabled (default in Chrome/Edge, may need flag in Firefox)

**Steps:**
1. Open `index.html` in a WebGPU-compatible browser
2. Select "WebGPU" from the renderer dropdown
3. Click "Reset" to trigger renderer initialization

**Expected Results:**
- ✅ Brief "Initializing WebGPU..." message appears
- ✅ Message disappears quickly (<1 second)
- ✅ Simulation renders normally with particles visible
- ✅ No error notifications appear

### Scenario 2: WebGPU Not Supported (Fallback Path)

**Prerequisites:**
- Older browser (e.g., Safari, older Chrome/Firefox versions)
- OR Firefox with WebGPU disabled
- OR GPU blacklisted/disabled

**Steps:**
1. Open `index.html` in a non-WebGPU browser
2. Select "WebGPU" from the renderer dropdown
3. Click "Reset" to trigger renderer initialization

**Expected Results:**
- ✅ "Initializing WebGPU..." message appears briefly
- ✅ Orange warning notification appears with message:
  - "WebGPU not available - using Canvas mode instead. For best performance with 10k+ objects, use a WebGPU-compatible browser."
- ✅ Dropdown automatically switches to "Canvas"
- ✅ Simulation renders correctly in Canvas mode
- ✅ Notification auto-dismisses after 5 seconds

### Scenario 3: Mode Switching

**Steps:**
1. Start with any renderer mode
2. Switch between different modes (Canvas → WebGPU → SVG → Canvas)
3. Observe behavior for each transition

**Expected Results:**
- ✅ Loading indicator only appears for WebGPU transitions
- ✅ If WebGPU fails, automatic fallback to Canvas occurs
- ✅ No crashes or blank screens
- ✅ Simulation continues to work after mode changes

## Testing in Firefox (Forced Failure)

To test fallback behavior in Firefox:

1. Open Firefox
2. Type `about:config` in address bar
3. Search for `dom.webgpu.enabled`
4. Set to `false`
5. Refresh the page
6. Select WebGPU mode
7. Verify fallback notification and Canvas mode activation

## Checking Browser Console

During testing, check the browser console for:

**Success case:**
- No errors
- Optional info logs about WebGPU initialization

**Fallback case:**
- Error log: "Failed to initialize WebGPU: [error details]"
- Warning log: "Falling back to Canvas renderer"
- No unhandled exceptions

## Known Edge Cases

1. **GPU Blacklisted**: Some GPUs are disabled for security/stability
   - Expected: Fallback to Canvas with notification
   
2. **Firefox Flags Required**: Firefox needs `dom.webgpu.enabled` flag
   - Expected: If disabled, fallback to Canvas
   
3. **Rapid Mode Switching**: Quickly changing modes multiple times
   - Expected: Last selected mode wins, proper cleanup of previous renderers

## Performance Testing

After fallback to Canvas:

1. Increase body count to 1000+ using controls
2. Verify:
   - ✅ Simulation still runs (may be slower than WebGPU)
   - ✅ No crashes or freezing
   - ✅ UI remains responsive

## Success Criteria

✅ Users see loading feedback during WebGPU init  
✅ Clear error messages when WebGPU unavailable  
✅ Automatic fallback to Canvas mode  
✅ Notification explains what happened  
✅ No silent failures or blank screens  
✅ Dropdown reflects actual renderer mode  
✅ Simulation continues to work after fallback
