const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/resources
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { courseId, subject, type, semester, topic, search } = req.query;

    if (courseId) query.courseId = courseId;
    if (subject) query.subject = subject;
    if (type) query.type = type;
    if (semester) query.semester = semester;
    if (topic) query.topic = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('courseId', 'name code semester')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/resources/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('courseId', 'name code semester');
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    if (!req.user && !resource.isPublic) {
      return res.status(403).json({ success: false, message: 'Resource is private' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/resources
router.post('/', protect, async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    await ActivityLog.create({
      action: 'Added Resource',
      entityType: 'Resource',
      entityTitle: resource.title,
      details: `${resource.type} for ${resource.subject || 'General'}`,
    });
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/resources/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    await ActivityLog.create({
      action: 'Updated Resource',
      entityType: 'Resource',
      entityTitle: resource.title,
      details: `Updated ${resource.title}`,
    });
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/resources/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // If local file, attempt to delete
    if (resource.fileUrl && resource.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }

    await ActivityLog.create({
      action: 'Deleted Resource',
      entityType: 'Resource',
      entityTitle: resource.title,
      details: `Deleted resource ${resource.title}`,
    });

    res.json({ success: true, message: 'Resource removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
