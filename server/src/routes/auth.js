import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelper } from '../db/database.js';
import { config } from '../config/index.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Helper to sign JWT
const createToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// In-memory OTP storage for phone auth simulation (phone -> { code, expiresAt })
const otpStore = new Map();

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName, avatarUrl } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: true, message: 'Username, email, and password are required.' });
    }

    const existing = dbHelper.get('SELECT id FROM users WHERE email = ? OR username = ?', email, username);
    if (existing) {
      return res.status(409).json({ error: true, message: 'User with this email or username already exists.' });
    }

    const id = `usr-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const name = displayName || username;
    const avatar = avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`;

    dbHelper.run(`
      INSERT INTO users (id, username, email, password_hash, display_name, avatar_url, provider, role)
      VALUES (?, ?, ?, ?, ?, ?, 'local', 'listener')
    `, id, username, email, passwordHash, name, avatar);

    const token = createToken(id);
    const user = dbHelper.get('SELECT id, username, email, phone, display_name, avatar_url, role FROM users WHERE id = ?', id);

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: true, message: 'Failed to create user account.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ error: true, message: 'Email/username and password are required.' });
    }

    const user = dbHelper.get(`
      SELECT * FROM users WHERE email = ? OR username = ?
    `, identifier, identifier);

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: true, message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: true, message: 'Invalid credentials.' });
    }

    const token = createToken(user.id);
    const { password_hash, ...userProfile } = user;

    res.json({
      success: true,
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Login failed.' });
  }
});

/**
 * POST /api/auth/guest
 * Instant friction-free listener session
 */
router.post('/guest', (req, res) => {
  const guestUser = dbHelper.get('SELECT id, username, email, display_name, avatar_url, role FROM users WHERE id = ?', 'usr-guest');
  const token = createToken('usr-guest');
  res.json({
    success: true,
    token,
    user: guestUser
  });
});

/**
 * POST /api/auth/phone-otp/send
 */
router.post('/phone-otp/send', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: true, message: 'Phone number is required.' });
  }

  // Generate 6-digit OTP (e.g. 123456 or random)
  const code = '123456';
  otpStore.set(phoneNumber, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  res.json({
    success: true,
    message: 'OTP sent successfully (Demo code: 123456)',
    demoCode: code
  });
});

/**
 * POST /api/auth/phone-otp/verify
 */
router.post('/phone-otp/verify', (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ error: true, message: 'Phone number and OTP code are required.' });
  }

  const record = otpStore.get(phoneNumber);
  const isValid = (record && record.code === code && record.expiresAt > Date.now()) || code === '123456';

  if (!isValid) {
    return res.status(400).json({ error: true, message: 'Invalid or expired OTP code.' });
  }

  otpStore.delete(phoneNumber);

  // Find or create phone user
  let user = dbHelper.get('SELECT * FROM users WHERE phone = ?', phoneNumber);
  if (!user) {
    const id = `usr-phone-${Date.now()}`;
    const displayName = `Audio Enthusiast (${phoneNumber.slice(-4)})`;
    const avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

    dbHelper.run(`
      INSERT INTO users (id, username, phone, display_name, avatar_url, provider, role)
      VALUES (?, ?, ?, ?, ?, 'phone', 'listener')
    `, id, `phone_${Date.now()}`, phoneNumber, displayName, avatarUrl);

    user = dbHelper.get('SELECT id, username, email, phone, display_name, avatar_url, role FROM users WHERE id = ?', id);
  }

  const token = createToken(user.id);
  res.json({
    success: true,
    token,
    user
  });
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticateUser, (req, res) => {
  const stats = {
    likedCount: dbHelper.get('SELECT COUNT(*) as count FROM liked_songs WHERE user_id = ?', req.user.id)?.count || 0,
    playlistCount: dbHelper.get('SELECT COUNT(*) as count FROM playlists WHERE user_id = ?', req.user.id)?.count || 0,
    historyCount: dbHelper.get('SELECT COUNT(*) as count FROM user_history WHERE user_id = ?', req.user.id)?.count || 0,
    followingCount: dbHelper.get('SELECT COUNT(*) as count FROM followed_artists WHERE user_id = ?', req.user.id)?.count || 0
  };

  res.json({
    success: true,
    user: req.user,
    stats
  });
});

/**
 * PUT /api/auth/me
 */
router.put('/me', authenticateUser, (req, res) => {
  const { displayName, avatarUrl } = req.body;
  
  if (displayName) {
    dbHelper.run('UPDATE users SET display_name = ? WHERE id = ?', displayName, req.user.id);
  }
  if (avatarUrl) {
    dbHelper.run('UPDATE users SET avatar_url = ? WHERE id = ?', avatarUrl, req.user.id);
  }

  const updated = dbHelper.get('SELECT id, username, email, phone, display_name, avatar_url, role FROM users WHERE id = ?', req.user.id);
  res.json({ success: true, user: updated });
});

export default router;
