const express = require('express');
const { body, param, query } = require('express-validator');
const { list, getById, update, remove, clear, importHistory, stats } = require('../controllers/scanController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);
router.get('/stats', stats);
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('cropId').optional().isIn(['tomato', 'potato', 'grape', 'corn']).withMessage('Invalid crop filter.'),
  validate,
], list);
router.post('/import', [
  body('scans').isArray({ max: 60 }).withMessage('Provide up to 60 scans to import.'),
  body('scans.*.cropId').isIn(['tomato', 'potato', 'grape', 'corn']).withMessage('Imported scan has an invalid crop.'),
  body('scans.*.cropName').isString().trim().isLength({ min: 1, max: 80 }),
  body('scans.*.rawLabel').isString().trim().isLength({ min: 1, max: 160 }),
  body('scans.*.friendlyName').isString().trim().isLength({ min: 1, max: 120 }),
  body('scans.*.confidence').isFloat({ min: 0, max: 1 }).toFloat(),
  body('scans.*.isHealthy').isBoolean().toBoolean(),
  body('scans.*.notes').optional().isString().isLength({ max: 2000 }),
  body('scans.*.checklistProgress').optional().isObject(),
  validate,
], importHistory);
router.delete('/', clear);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid scan ID.'), validate], getById);
router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid scan ID.'),
  body().custom((value) => Object.keys(value).every((key) => ['notes', 'checklistProgress'].includes(key))).withMessage('Only notes and checklistProgress may be updated.'),
  body('notes').optional().isString().isLength({ max: 2000 }).withMessage('Notes must be 2,000 characters or fewer.'),
  body('checklistProgress').optional().isObject().custom((value) => Object.values(value).every((item) => typeof item === 'boolean')).withMessage('Checklist values must be booleans.'),
  validate,
], update);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid scan ID.'), validate], remove);

module.exports = router;
