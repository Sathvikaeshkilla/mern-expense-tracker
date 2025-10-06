const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    err.message = 'Registration failed: ' + err.message;
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    if (user.isLocked()) {
      const error = new Error('Account is locked due to too many failed login attempts');
      error.statusCode = 423; // Locked
      return next(error);
    }

    if (!(await user.matchPassword(password))) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= 5) {
        user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
      }
      await user.save();
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Successful login
    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    err.message = 'Login failed: ' + err.message;
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
