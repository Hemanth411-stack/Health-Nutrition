import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`decoded value`,decoded);
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// same file (middlewares/auth.js)
export const authorize = (...allowedRoles) => {
  // Validate allowedRoles at middleware creation time
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error('Please specify at least one allowed role');
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'UNAUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied - '${req.user.role}' role not authorized`,
        error: 'UNAUTHORIZED',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};
