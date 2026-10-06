const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/projects
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { status, category, technology, search } = req.query;

    if (status) query.status = status;
    if (category) query.category = category;
    if (technology) query.technologies = { $in: [new RegExp(technology, 'i')] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { detailedDescription: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (!req.user && !project.isPublic) {
      return res.status(403).json({ success: false, message: 'Project is private' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects
router.post('/', protect, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    await ActivityLog.create({
      action: 'Added Project',
      entityType: 'Project',
      entityTitle: project.name,
      details: `${project.category} - ${project.status}`,
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/projects/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await ActivityLog.create({
      action: 'Updated Project',
      entityType: 'Project',
      entityTitle: project.name,
      details: `Updated project ${project.name}`,
    });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Project',
      entityType: 'Project',
      entityTitle: project.name,
      details: `Deleted project ${project.name}`,
    });
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
