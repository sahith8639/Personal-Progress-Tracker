const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/certificates
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { year, organization, category, skill, courseId, search } = req.query;

    if (year) {
      query.issueDate = { $regex: year, $options: 'i' };
    }
    if (organization) {
      query.issuingOrganization = { $regex: organization, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }
    if (courseId) {
      query.courseId = courseId;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { issuingOrganization: { $regex: search, $options: 'i' } },
        { credentialId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const certificates = await Certificate.find(query)
      .populate('courseId', 'name code')
      .sort({ order: 1, issueDate: -1, createdAt: -1 });

    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/certificates
router.post('/', protect, async (req, res, next) => {
  try {
    const certificate = await Certificate.create(req.body);
    await ActivityLog.create({
      action: 'Added Certificate',
      entityType: 'Certificate',
      entityTitle: certificate.name,
      details: `Issued by ${certificate.issuingOrganization}`,
    });
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/certificates/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    await ActivityLog.create({
      action: 'Updated Certificate',
      entityType: 'Certificate',
      entityTitle: certificate.name,
      details: `Updated certificate details for ${certificate.name}`,
    });
    res.json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/certificates/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Certificate',
      entityType: 'Certificate',
      entityTitle: certificate.name,
      details: `Deleted certificate ${certificate.name}`,
    });
    res.json({ success: true, message: 'Certificate removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
