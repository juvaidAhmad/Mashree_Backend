const rateLimit = require('express-rate-limit');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Strict limiter for auth endpoints to prevent brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  statusCode: HTTP_STATUS.BAD_REQUEST,
});

/**
 * General API limiter.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
  statusCode: HTTP_STATUS.BAD_REQUEST,
});

module.exports = { authLimiter, apiLimiter };
