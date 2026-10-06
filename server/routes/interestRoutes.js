const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/interests
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const interests = await Interest.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: interests.length, data: interests });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/interests
router.post('/', protect, async (req, res, next) => {
  try {
    const interest = await Interest.create(req.body);
    await ActivityLog.create({
      action: 'Added Interest',
      entityType: 'Interest',
      entityTitle: interest.name,
      details: `${interest.interestLevel} priority in ${interest.category}`,
    });
    res.status(201).json({ success: true, data: interest });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/interests/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const interest = await Interest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found' });
    }
    await ActivityLog.create({
      action: 'Updated Interest',
      entityType: 'Interest',
      entityTitle: interest.name,
      details: `Updated ${interest.name}`,
    });
    res.json({ success: true, data: interest });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/interests/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const interest = await Interest.findByIdAndDelete(req.params.id);
    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Interest',
      entityType: 'Interest',
      entityTitle: interest.name,
      details: `Deleted interest ${interest.name}`,
    });
    res.json({ success: true, message: 'Interest removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
