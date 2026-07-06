const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators');

/**
 * POST /api/auth/register
 * Handles user registration.
 */
router.post('/register', validate(registerSchema), authController.signup);

/**
 * POST /api/auth/login
 * Handles user login — validates credentials and issues a JWT.
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * GET /api/auth/me
 * Returns the current authenticated user's data.
 */
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
