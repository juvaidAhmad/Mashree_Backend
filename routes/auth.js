const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  registerAdminValidator,
  loginValidator,
} = require('../validators/auth.validator');
const { upload } = require('../config/cloudinary');

/** POST /api/auth/register — public user registration */
router.post('/register', authLimiter, upload.single('avatar'), registerValidator, validate, authController.register);

/** POST /api/auth/register-admin — invite-code-protected admin registration */
router.post('/register-admin', authLimiter, upload.single('avatar'), registerAdminValidator, validate, authController.registerAdmin);

/** POST /api/auth/login — user login */
router.post('/login', authLimiter, loginValidator, validate, authController.login);

/** POST /api/auth/admin-login — admin-only login (rejects non-admin credentials) */
router.post('/admin-login', authLimiter, loginValidator, validate, authController.adminLogin);

/** GET /api/auth/me */
router.get('/me', protect, authController.getMe);

module.exports = router;
