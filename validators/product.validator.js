const { body, query, param } = require('express-validator');
const MESSAGES = require('../constants/messages');
const { CATEGORIES } = require('../constants/roles');

const createProductValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.REQUIRED('Title'))
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.REQUIRED('Description'))
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('price')
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.REQUIRED('Price'))
    .isFloat({ min: 0 })
    .withMessage(MESSAGES.VALIDATION.PRICE_POSITIVE),

  body('category')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.VALIDATION.REQUIRED('Category'))
    .isIn(CATEGORIES)
    .withMessage(MESSAGES.VALIDATION.INVALID_CATEGORY),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),
];

const updateProductValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage(MESSAGES.VALIDATION.PRICE_POSITIVE),

  body('category')
    .optional()
    .trim()
    .isIn(CATEGORIES)
    .withMessage(MESSAGES.VALIDATION.INVALID_CATEGORY),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),
];

const listProductsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage(MESSAGES.VALIDATION.PAGE_POSITIVE),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(MESSAGES.VALIDATION.LIMIT_RANGE),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number'),

  query('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(MESSAGES.VALIDATION.INVALID_CATEGORY),
];

const mongoIdValidator = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(MESSAGES.VALIDATION.INVALID_ID),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  listProductsValidator,
  mongoIdValidator,
};
