const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const emailRule = body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail();

router.post('/register', [
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters.'),
  emailRule,
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters.'),
  validate,
], register);
router.post('/login', [emailRule, body('password').isString().notEmpty().withMessage('Password is required.'), validate], login);
router.get('/me', requireAuth, me);

module.exports = router;
