const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdValidator } = require('../validators/product.validator');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard stats (user count, product count)
 * @access  Admin
 */
router.get('/stats', adminController.getStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users
 * @access  Admin
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user by ID
 * @access  Admin
 */
router.delete('/users/:id', mongoIdValidator('id'), validate, adminController.deleteUser);

module.exports = router;
