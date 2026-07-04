const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'itqan-secret-key-123';

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Register a new user
 */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id as uid, name, email, user_type as "userType"`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Generate token (no MFA on registration — user is immediately logged in)
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Log registration
    await db.query(
      `INSERT INTO system_logs (user_id, action_type, details) VALUES ($1, 'register', 'New user registered')`,
      [user.uid]
    ).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user,
    });
  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

/**
 * Login user — Step 1: Validate credentials, then issue MFA challenge
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store OTP in mfa_tokens table
    await db.query(
      `INSERT INTO mfa_tokens (user_id, otp_code, expires_at) VALUES ($1, $2, $3)`,
      [user.user_id, otp, expiresAt]
    );

    // Generate a temporary token (short-lived, only for MFA verification)
    const tempToken = jwt.sign(
      { uid: user.user_id, email: user.email, purpose: 'mfa' },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Log the OTP to console (in production, this would be sent via email/SMS)
    console.log(`\n========================================`);
    console.log(`  MFA OTP for ${user.email}: ${otp}`);
    console.log(`  Expires at: ${expiresAt.toISOString()}`);
    console.log(`========================================\n`);

    // Log login attempt
    await db.query(
      `INSERT INTO system_logs (user_id, action_type, details) VALUES ($1, 'loginAttempt', 'MFA challenge issued')`,
      [user.user_id]
    ).catch(() => {});

    res.json({
      success: true,
      mfaRequired: true,
      tempToken,
      message: 'Credentials verified. Please enter the OTP code sent to your email.',
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

/**
 * Verify MFA — Step 2: Validate OTP and issue real JWT
 */
exports.verifyMfa = async (req, res) => {
  const { tempToken, otpCode } = req.body;

  try {
    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'MFA session expired. Please login again.' });
    }

    if (decoded.purpose !== 'mfa') {
      return res.status(401).json({ success: false, message: 'Invalid MFA token.' });
    }

    // Check OTP in database
    const otpResult = await db.query(
      `SELECT * FROM mfa_tokens 
       WHERE user_id = $1 AND otp_code = $2 AND used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [decoded.uid, otpCode]
    );

    if (otpResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Mark OTP as used
    await db.query(
      `UPDATE mfa_tokens SET used = TRUE WHERE id = $1`,
      [otpResult.rows[0].id]
    );

    // Fetch user data
    const userResult = await db.query(
      'SELECT user_id as uid, name, email, user_type as "userType" FROM users WHERE user_id = $1',
      [decoded.uid]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Generate real JWT
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Log successful login
    await db.query(
      `INSERT INTO system_logs (user_id, action_type, details) VALUES ($1, 'login', 'MFA verified, login successful')`,
      [user.uid]
    ).catch(() => {});

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('MFA verification error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get current user (me)
 */
exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT user_id as uid, name, email, user_type as "userType" FROM users WHERE user_id = $1',
      [req.user.uid]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
