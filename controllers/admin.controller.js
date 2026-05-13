const adminService = require('../services/admin.service');
const ApiResponse = require('../utils/ApiResponse');
const MESSAGES = require('../constants/messages');

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  const users = await adminService.getAllUsers();
  return ApiResponse.success(res, MESSAGES.USER.FETCHED, { users });
};

/**
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user._id);
  return ApiResponse.success(res, MESSAGES.USER.DELETED);
};

/**
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
  const stats = await adminService.getStats();
  return ApiResponse.success(res, MESSAGES.ADMIN.STATS_FETCHED, { stats });
};

module.exports = { getAllUsers, deleteUser, getStats };
