const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signUserToken } = require('../services/jwt');

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ token: signUserToken(user._id), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    return res.json({ token: signUserToken(user._id), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
