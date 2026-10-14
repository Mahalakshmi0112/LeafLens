const mongoose = require('mongoose');
const Scan = require('../models/Scan');

function serialize(scan) {
  const item = scan.toObject ? scan.toObject() : scan;
  return {
    id: item._id ? item._id.toString() : item.id,
    timestamp: item.createdAt || item.timestamp,
    cropId: item.cropId,
    cropName: item.cropName,
    rawLabel: item.rawLabel,
    friendlyName: item.friendlyName,
    confidence: item.confidence,
    isHealthy: item.isHealthy,
    severity: item.severity || '',
    thumbnail: item.thumbnail || null,
    notes: item.notes || '',
    checklistProgress: item.checklistProgress instanceof Map ? Object.fromEntries(item.checklistProgress) : (item.checklistProgress || {}),
  };
}

async function list(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = { user: req.user._id };
    if (req.query.cropId) filter.cropId = req.query.cropId;
    const [scans, total] = await Promise.all([
      Scan.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Scan.countDocuments(filter),
    ]);
    return res.json({ scans: scans.map(serialize), page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { return next(error); }
}

async function getById(req, res, next) {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    return res.json({ scan: serialize(scan) });
  } catch (error) { return next(error); }
}

async function update(req, res, next) {
  try {
    const updates = {};
    if (Object.prototype.hasOwnProperty.call(req.body, 'notes')) updates.notes = req.body.notes;
    if (Object.prototype.hasOwnProperty.call(req.body, 'checklistProgress')) updates.checklistProgress = req.body.checklistProgress;
    const scan = await Scan.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: updates }, { new: true, runValidators: true });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    return res.json({ scan: serialize(scan) });
  } catch (error) { return next(error); }
}

async function remove(req, res, next) {
  try {
    const scan = await Scan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    return res.json({ message: 'Scan deleted.' });
  } catch (error) { return next(error); }
}

async function clear(req, res, next) {
  try {
    const result = await Scan.deleteMany({ user: req.user._id });
    return res.json({ message: 'Scan history cleared.', deletedCount: result.deletedCount });
  } catch (error) { return next(error); }
}

async function importHistory(req, res, next) {
  try {
    const documents = req.body.scans.map((item) => {
      const timestamp = item.timestamp && Number.isFinite(Date.parse(item.timestamp)) ? new Date(item.timestamp) : new Date();
      const thumbnail = typeof item.thumbnail === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(item.thumbnail)
        && Buffer.from(item.thumbnail.split(',')[1], 'base64').length <= 40 * 1024 ? item.thumbnail : null;
      return {
        user: req.user._id,
        cropId: item.cropId,
        cropName: item.cropName,
        rawLabel: item.rawLabel,
        friendlyName: item.friendlyName,
        confidence: item.confidence,
        isHealthy: item.isHealthy,
        severity: item.severity || '',
        thumbnail,
        notes: item.notes || '',
        checklistProgress: item.checklistProgress || {},
        createdAt: timestamp,
      };
    });
    const imported = documents.length ? await Scan.insertMany(documents, { ordered: false }) : [];
    return res.status(201).json({ importedCount: imported.length, scans: imported.map(serialize) });
  } catch (error) { return next(error); }
}

async function stats(req, res, next) {
  try {
    const match = { user: new mongoose.Types.ObjectId(req.user._id) };
    const [total, health, crops, diseases] = await Promise.all([
      Scan.countDocuments(match),
      Scan.aggregate([{ $match: match }, { $group: { _id: '$isHealthy', count: { $sum: 1 } } }]),
      Scan.aggregate([{ $match: match }, { $group: { _id: { cropId: '$cropId', cropName: '$cropName' }, count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Scan.aggregate([{ $match: { ...match, isHealthy: false } }, { $group: { _id: '$friendlyName', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);
    const healthCounts = { healthy: 0, diseased: 0 };
    health.forEach((item) => { healthCounts[item._id ? 'healthy' : 'diseased'] = item.count; });
    return res.json({ total, healthy: healthCounts.healthy, diseased: healthCounts.diseased, scansPerCrop: crops.map((item) => ({ cropId: item._id.cropId, cropName: item._id.cropName, count: item.count })), topDiseases: diseases.map((item) => ({ disease: item._id, count: item.count })) });
  } catch (error) { return next(error); }
}

module.exports = { list, getById, update, remove, clear, importHistory, stats };
