/**
 * Strip sensitive fields before sending user data to the client.
 * @param {import('../models/User')} user - Mongoose document
 * @returns {object}
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  createdAt: user.createdAt,
});

module.exports = { sanitizeUser };
