const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const MESSAGES = require('../constants/messages');
const { ROLES } = require('../constants/roles');

/**
 * Verifies the Bearer JWT and attaches req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized(MESSAGES.AUTH.NOT_AUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? MESSAGES.AUTH.TOKEN_EXPIRED
        : MESSAGES.AUTH.NOT_AUTHORIZED;
    return next(ApiError.unauthorized(message));
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) return next(ApiError.unauthorized(MESSAGES.AUTH.USER_NOT_FOUND));

  req.user = user;
  next();
};

/**
 * Restricts access to admin role only. Must be used after `protect`.
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN));
  }
  next();
};

module.exports = { protect, adminOnly };
