const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/skills
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { category } = req.query;
    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ category: 1, order: 1, proficiency: -1 });

    // Group skills by category for convenience
    const categories = [
      'Programming Languages',
      'Web Development',
      'AI/ML',
      'Data Science',
      'Databases',
      'Tools',
      'Cloud',
      'Version Control',
      'Other',
    ];

    const grouped = {};
    categories.forEach((cat) => {
      grouped[cat] = skills.filter((s) => s.category === cat);
    });

    res.json({ success: true, count: skills.length, data: skills, grouped });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/skills
router.post('/', protect, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    await ActivityLog.create({
      action: 'Added Skill',
      entityType: 'Skill',
      entityTitle: skill.name,
      details: `${skill.name} (${skill.proficiency}%) in ${skill.category}`,
    });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/skills/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    await ActivityLog.create({
      action: 'Updated Skill',
      entityType: 'Skill',
      entityTitle: skill.name,
      details: `Updated ${skill.name} proficiency to ${skill.proficiency}%`,
    });
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/skills/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Skill',
      entityType: 'Skill',
      entityTitle: skill.name,
      details: `Deleted skill ${skill.name}`,
    });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
