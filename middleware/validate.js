const { validationResult } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Runs after express-validator chains.
 * Collects all errors and returns a 422 with a structured errors array.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
