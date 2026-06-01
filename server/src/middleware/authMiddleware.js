import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');

      // Get user from database (exclude password field) or memoryStore
      if (global.dbConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = memoryStore.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system.' });
      }

      next();
    } catch (error) {
      console.error('❌ JWT Authentication failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};
