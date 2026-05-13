const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const MESSAGES = require('../constants/messages');
const { ROLES } = require('../constants/roles');

/** POST /api/auth/register */
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const avatarUrl = req.file?.path || '';
  const { user, token } = await authService.register({ name, email, password, avatarUrl });
  return ApiResponse.created(res, MESSAGES.AUTH.REGISTER_SUCCESS, { user, token });
};

/** POST /api/auth/register-admin */
const registerAdmin = async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  const avatarUrl = req.file?.path || '';
  const { user, token } = await authService.registerAdmin({ name, email, password, avatarUrl, inviteCode });
  return ApiResponse.created(res, MESSAGES.AUTH.REGISTER_SUCCESS, { user, token });
};

/** POST /api/auth/login */
const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  return ApiResponse.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, { user, token });
};

/** POST /api/auth/admin-login */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password, requiredRole: ROLES.ADMIN });
  return ApiResponse.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, { user, token });
};

/** GET /api/auth/me */
const getMe = async (req, res) => {
  const user = authService.getMe(req.user);
  return ApiResponse.success(res, 'Profile fetched successfully', { user });
};

module.exports = { register, registerAdmin, login, adminLogin, getMe };
