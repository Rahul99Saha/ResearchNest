const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No user' });
  if (req.user.role === 'Faculty') return next();
  if (Array.isArray(role) ? role.includes(req.user.role) : req.user.role === role) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = { auth, requireRole };

