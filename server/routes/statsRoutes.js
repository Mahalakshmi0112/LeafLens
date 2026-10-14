const express = require('express');
const { stats } = require('../controllers/scanController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, stats);

module.exports = router;
