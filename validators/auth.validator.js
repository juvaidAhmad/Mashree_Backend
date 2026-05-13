const { body } = require('express-validator');
const MESSAGES = require('../constants/messages');

const registerValidator = [
  body('name').trim().notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Name'))
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Email'))
    .isEmail().withMessage(MESSAGES.VALIDATION.INVALID_EMAIL).normalizeEmail(),
  body('password').notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Password'))
    .isLength({ min: 6 }).withMessage(MESSAGES.VALIDATION.PASSWORD_MIN),
];

const registerAdminValidator = [
  body('name').trim().notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Name'))
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Email'))
    .isEmail().withMessage(MESSAGES.VALIDATION.INVALID_EMAIL).normalizeEmail(),
  body('password').notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Password'))
    .isLength({ min: 6 }).withMessage(MESSAGES.VALIDATION.PASSWORD_MIN),
  body('inviteCode').notEmpty().withMessage('Admin invite code is required'),
];

const loginValidator = [
  body('email').trim().notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Email'))
    .isEmail().withMessage(MESSAGES.VALIDATION.INVALID_EMAIL).normalizeEmail(),
  body('password').notEmpty().withMessage(MESSAGES.VALIDATION.REQUIRED('Password')),
];

module.exports = { registerValidator, registerAdminValidator, loginValidator };
