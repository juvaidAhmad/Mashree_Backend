const MESSAGES = {
  // Auth
  AUTH: {
    REGISTER_SUCCESS: 'Account created successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_IN_USE: 'Email is already registered',
    NOT_AUTHORIZED: 'Not authorized, token missing or invalid',
    TOKEN_EXPIRED: 'Session expired, please login again',
    FORBIDDEN: 'Access denied, insufficient permissions',
    USER_NOT_FOUND: 'Authenticated user not found',
  },

  // User
  USER: {
    FETCHED: 'Users fetched successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
    CANNOT_DELETE_SELF: 'You cannot delete your own account',
  },

  // Product
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
    FETCHED: 'Products fetched successfully',
    SINGLE_FETCHED: 'Product fetched successfully',
    NOT_FOUND: 'Product not found',
    CATEGORIES_FETCHED: 'Categories fetched successfully',
  },

  // Admin
  ADMIN: {
    STATS_FETCHED: 'Stats fetched successfully',
  },

  // Validation
  VALIDATION: {
    REQUIRED: (field) => `${field} is required`,
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    PRICE_POSITIVE: 'Price must be a positive number',
    INVALID_CATEGORY: 'Invalid category selected',
    INVALID_ROLE: 'Invalid role value',
    INVALID_ID: 'Invalid resource ID',
    PAGE_POSITIVE: 'Page must be a positive integer',
    LIMIT_RANGE: 'Limit must be between 1 and 100',
  },

  // Server
  SERVER: {
    ERROR: 'An unexpected error occurred',
    NOT_FOUND_ROUTE: 'Route not found',
  },
};

module.exports = MESSAGES;
