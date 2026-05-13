const User = require('../models/User');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { sanitizeUser } = require('../utils/sanitize');
const MESSAGES = require('../constants/messages');
const { ROLES } = require('../constants/roles');

/**
 * Fetch all regular users only (excludes admins).
 */
const getAllUsers = async () => {
  const users = await User.find({ role: ROLES.USER }).select('-password').sort({ createdAt: -1 }).lean();
  return users.map(sanitizeUser);
};

/**
 * Delete a user by ID. Prevents self-deletion.
 * @param {string} targetId - ID of user to delete
 * @param {string} requesterId - ID of the admin making the request
 */
const deleteUser = async (targetId, requesterId) => {
  if (targetId === requesterId.toString()) {
    throw ApiError.badRequest(MESSAGES.USER.CANNOT_DELETE_SELF);
  }

  const user = await User.findByIdAndDelete(targetId);
  if (!user) throw ApiError.notFound(MESSAGES.USER.NOT_FOUND);
};

/**
 * Return aggregate stats for the dashboard.
 */
const getStats = async () => {
  const [totalUsers, totalProducts] = await Promise.all([
    User.countDocuments({ role: ROLES.USER }),
    Product.countDocuments(),
  ]);
  return { totalUsers, totalProducts };
};

module.exports = { getAllUsers, deleteUser, getStats };
