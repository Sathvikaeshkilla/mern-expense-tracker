
import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

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

export default router;
