const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, verifyMfaSchema } = require('../validators');

/**
 * POST /api/auth/register
 * Handles user registration.
 */
router.post('/register', validate(registerSchema), authController.signup);

/**
 * POST /api/auth/login
 * Handles user login (Step 1 — credentials, issues MFA challenge).
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * POST /api/auth/verify-mfa
 * Handles MFA verification (Step 2 — OTP, issues real JWT).
 */
router.post('/verify-mfa', validate(verifyMfaSchema), authController.verifyMfa);

/**
 * GET /api/auth/me
 * Returns the current authenticated user's data.
 */
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
