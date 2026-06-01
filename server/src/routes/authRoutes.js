import express from 'express';
import { registerUser, loginUser, googleLogin, getUserProfile, updateUserProfile, completeOnboarding, deleteUserAccount } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

// Onboarding — called once after first login/register
router.post('/onboarding', protect, completeOnboarding);

export default router;
