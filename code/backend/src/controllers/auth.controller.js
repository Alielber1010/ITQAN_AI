const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'itqan-secret-key-123';

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
 * Login user — validates credentials and issues a JWT directly.
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

    const token = jwt.sign({ uid: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, details) VALUES ($1, 'login', 'Login successful')`,
      [user.user_id]
    ).catch(() => {});

    res.json({
      success: true,
      token,
      user: {
        uid: user.user_id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
      },
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
