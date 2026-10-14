const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function resolveUser(req, token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (!payload.sub) return null;
  return User.findById(payload.sub).select('name email createdAt');
}

async function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const user = await resolveUser(req, token);
    if (!user) return res.status(401).json({ message: 'User account no longer exists.' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

async function optionalAuth(req, res, next) {
  const header = req.get('authorization') || '';
  if (!header) return next();
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Invalid authorization header.' });
  try {
    const user = await resolveUser(req, header.slice(7));
    if (!user) return res.status(401).json({ message: 'User account no longer exists.' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

module.exports = { requireAuth, optionalAuth };
