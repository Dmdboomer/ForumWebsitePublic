/**
 * Piecewise function implementation
 * @param {number} x - Input value x
 * @param {number} y - Input value y
 * @returns {number} Result based on piecewise conditions
 */
function VoteCountToPercentage(x, y) {
    // Handle (0, 0) case
    if (x === 0 && y === 0) return 0.5;
    
    // Handle y = 0 case (x-axis)
    if (y === 0) return 1;
    
    // Handle x = 0 case (y-axis)
    if (x === 0) return 0;
    
    // Default case for non-zero x and y
    return x / y;
}

export default VoteCountToPercentage;