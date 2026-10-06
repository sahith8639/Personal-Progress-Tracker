const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/education
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const educationList = await Education.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: educationList.length, data: educationList });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/education
router.post('/', protect, async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    await ActivityLog.create({
      action: 'Added Education',
      entityType: 'Education',
      entityTitle: education.degree,
      details: `${education.degree} at ${education.institution}`,
    });
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/education/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!education) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    await ActivityLog.create({
      action: 'Updated Education',
      entityType: 'Education',
      entityTitle: education.degree,
      details: `Updated details for ${education.degree}`,
    });
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/education/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Education',
      entityType: 'Education',
      entityTitle: education.degree,
      details: `Deleted education record ${education.degree}`,
    });
    res.json({ success: true, message: 'Education record removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
