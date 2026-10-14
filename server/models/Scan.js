const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cropId: { type: String, required: true, enum: ['tomato', 'potato', 'grape', 'corn'] },
  cropName: { type: String, required: true, trim: true, maxlength: 80 },
  rawLabel: { type: String, required: true, trim: true, maxlength: 160 },
  friendlyName: { type: String, required: true, trim: true, maxlength: 120 },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  isHealthy: { type: Boolean, required: true },
  severity: { type: String, trim: true, maxlength: 32, default: '' },
  thumbnail: {
    type: String,
    default: null,
    validate: {
      validator(value) {
        if (!value) return true;
        if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(value)) return false;
        const payload = value.slice(value.indexOf(',') + 1);
        return Math.floor((payload.length * 3) / 4) <= 40 * 1024;
      },
      message: 'Thumbnail must be a base64 JPEG no larger than 40 KB.',
    },
  },
  notes: { type: String, trim: true, maxlength: 2000, default: '' },
  checklistProgress: { type: Map, of: Boolean, default: () => new Map() },
  createdAt: { type: Date, default: Date.now, immutable: true },
}, { minimize: false });

scanSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);
