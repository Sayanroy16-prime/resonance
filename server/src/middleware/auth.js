import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { dbHelper } from '../db/database.js';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: true,
      message: 'Authentication required. Missing or malformed Authorization header.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = dbHelper.get(
      'SELECT id, username, email, phone, display_name, avatar_url, role, provider FROM users WHERE id = ?',
      decoded.userId
    );

    if (!user) {
      return res.status(401).json({ error: true, message: 'User account not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: 'Invalid or expired session token.',
      expired: err.name === 'TokenExpiredError'
    });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = dbHelper.get(
        'SELECT id, username, email, phone, display_name, avatar_url, role, provider FROM users WHERE id = ?',
        decoded.userId
      );
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token decode errors for optional auth
    }
  }
  next();
};
