const Scan = require('../models/Scan');
const { requestPrediction } = require('../services/predictionService');

const CROP_NAMES = { tomato: 'Tomato', potato: 'Potato', grape: 'Grape', corn: 'Corn (Maize)' };
const FRIENDLY_NAMES = {
  'Tomato___healthy': 'Healthy Leaf', 'Potato___healthy': 'Healthy Leaf', 'Grape___healthy': 'Healthy Leaf', 'Corn_(maize)___healthy': 'Healthy Leaf',
};

function hasValidImageSignature(file) {
  const bytes = file.buffer;
  if (file.mimetype === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.mimetype === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (file.mimetype === 'image/gif') return bytes.subarray(0, 3).toString() === 'GIF';
  if (file.mimetype === 'image/webp') return bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return false;
}

function readableLabel(label) {
  if (FRIENDLY_NAMES[label]) return FRIENDLY_NAMES[label];
  return String(label || 'Unknown Condition').replace(/^Corn_\(maize\)___|^(Tomato|Potato|Grape)___/i, '').replace(/_+/g, ' ')
    .split(' ').filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

async function predict(req, res, next) {
  try {
    const { cropId } = req.params;
    if (!CROP_NAMES[cropId]) return res.status(400).json({ message: 'Unsupported crop. Choose tomato, potato, grape, or corn.' });
    if (!req.file) return res.status(400).json({ message: 'An image file is required in multipart field "file".' });
    if (!hasValidImageSignature(req.file)) return res.status(400).json({ message: 'Uploaded file is not a valid JPEG, PNG, WebP, or GIF image.' });

    const result = await requestPrediction(cropId, req.file);
    if (!result.class || !Number.isFinite(result.confidence) || result.confidence < 0 || result.confidence > 1) {
      return res.status(502).json({ message: 'Inference service returned an invalid prediction.' });
    }

    if (req.user) {
      const isHealthy = /healthy/i.test(result.class);
      const record = {
        user: req.user._id,
        cropId,
        cropName: CROP_NAMES[cropId],
        rawLabel: result.class,
        friendlyName: readableLabel(result.class),
        confidence: result.confidence,
        isHealthy,
        severity: isHealthy ? 'Healthy' : '',
        thumbnail: req.body.thumbnail || null,
      };
      if (record.thumbnail) {
        const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+=*)$/.exec(record.thumbnail);
        if (!match || Buffer.from(match[1], 'base64').length > 40 * 1024) record.thumbnail = null;
      }
      await Scan.create(record);
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { predict };
