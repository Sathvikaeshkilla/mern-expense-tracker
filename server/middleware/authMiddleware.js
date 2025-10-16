import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ✅ Don't forget return here
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token provided
  return res.status(401).json({ message: 'Not authorized, no token' });
};

export default protect;

