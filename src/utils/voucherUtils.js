/**
 * Utility functions for voucher handling
 */

/**
 * Safely get points required from a voucher, with fallback
 * @param {Object} voucher - The voucher object
 * @param {number} defaultValue - Default value if points_required is missing
 * @returns {number} The points required value
 */
export const getPointsRequired = (voucher, defaultValue = 100) => {
  if (!voucher) return defaultValue;
  
  // Handle different data formats
  const points = voucher.points_required || voucher.pointsRequired || defaultValue;
  return parseInt(points) || defaultValue;
};

/**
 * Check if user has enough points for a voucher
 * @param {Object} user - The user object
 * @param {Object} voucher - The voucher object
 * @returns {boolean} True if user has enough points
 */
export const hasEnoughPoints = (user, voucher) => {
  const userPoints = user?.profile?.points || 0;
  const requiredPoints = getPointsRequired(voucher);
  
  return userPoints >= requiredPoints;
};
