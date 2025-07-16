// utils/scoringAlgorithm.js
/**
 * Calculate node score using modified Bayesian algorithm
 * @param {number} k - Number of completed leaves in subtree
 * @param {number} n - Total leaves in subtree
 * @param {number} parentScore - Parent node's existing score
 * @returns {number} Updated score (0-1)
 */
exports.calculateNodeScoreBayesian = (k, n, parentScore) => {
  if (n === 0) return 0;
  if (k === 0) return parentScore; // Use existing score if no completions yet
  
  // Modified Bayesian formula for gradual confidence
  const p = k / n;  // Direct proportion of completed leaves
  const weight = Math.sqrt(k); // Weight based on evidence
  const prior = parentScore || 0.5; // Default prior probability
  
  // Confidence-adjusted Bayesian update
  return (weight * p + 1 * prior) / (weight + 1);
};

