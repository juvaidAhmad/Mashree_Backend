const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for the given user id.
 * @param {string} id - MongoDB ObjectId as string
 * @returns {string} signed JWT
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
