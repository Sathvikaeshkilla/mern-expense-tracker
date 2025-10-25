//server/routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js'; 
import validate from '../middleware/validate.js'; 

const router = express.Router();

require('../config/passport'); // load Google strategy
const { googleAuth } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isString()
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be 8-128 characters'),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isString().isLength({ min: 8 }).withMessage('Password is required'),
  ],
  validate,
  loginUser
);

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuth
);

export default router;
