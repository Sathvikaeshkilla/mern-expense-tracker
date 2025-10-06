

const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);

module.exports = router;
