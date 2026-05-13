const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const { sanitizeUser } = require('../utils/sanitize');
const MESSAGES = require('../constants/messages');
const { ROLES } = require('../constants/roles');

/**
 * Register a new regular user.
 */
const register = async ({ name, email, password, avatarUrl = '' }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict(MESSAGES.AUTH.EMAIL_IN_USE);

  const user = await User.create({ name, email, password, avatar: avatarUrl });
  const token = generateToken(user._id);
  return { user: sanitizeUser(user), token };
};

/**
 * Register a new admin — requires a valid invite code.
 */
const registerAdmin = async ({ name, email, password, avatarUrl = '', inviteCode }) => {
  const validCode = process.env.ADMIN_INVITE_CODE;
  if (!validCode || inviteCode !== validCode) {
    throw ApiError.forbidden('Invalid admin invite code');
  }

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict(MESSAGES.AUTH.EMAIL_IN_USE);

  const user = await User.create({
    name, email, password, avatar: avatarUrl, role: ROLES.ADMIN,
  });
  const token = generateToken(user._id);
  return { user: sanitizeUser(user), token };
};

/**
 * Authenticate any user. Optionally enforce role.
 * @param {{ email, password, requiredRole? }} payload
 */
const login = async ({ email, password, requiredRole }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (requiredRole && user.role !== requiredRole) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  const token = generateToken(user._id);
  return { user: sanitizeUser(user), token };
};

/**
 * Return the sanitized profile of the currently authenticated user.
 */
const getMe = (user) => sanitizeUser(user);

module.exports = { register, registerAdmin, login, getMe };
