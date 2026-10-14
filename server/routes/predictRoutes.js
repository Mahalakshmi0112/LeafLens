const express = require('express');
const multer = require('multer');
const { param } = require('express-validator');
const { predict } = require('../controllers/predictionController');
const { optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, WebP, or GIF image uploads are accepted.');
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

router.post('/:cropId', optionalAuth, upload.single('file'), [
  param('cropId').isIn(['tomato', 'potato', 'grape', 'corn']).withMessage('Unsupported crop.'),
  validate,
], predict);

module.exports = router;
