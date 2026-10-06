const express = require('express');
const router = express.Router();
const LearningItem = require('../models/LearningItem');
const StudyLog = require('../models/StudyLog');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/learning/stats
// @desc    Calculate study hours (this week, this month), streak, active counts
router.get('/stats', optionalAuth, async (req, res, next) => {
  try {
    const itemQuery = req.user ? {} : { isPublic: true };
    const items = await LearningItem.find(itemQuery);

    const activeCount = items.filter((i) => i.status === 'Learning').length;
    const completedCount = items.filter((i) => i.status === 'Completed').length;
    const pausedCount = items.filter((i) => i.status === 'Paused').length;
    const notStartedCount = items.filter((i) => i.status === 'Not Started').length;

    const avgProgress =
      items.length > 0
        ? (items.reduce((acc, curr) => acc + (curr.currentProgress || 0), 0) / items.length).toFixed(1)
        : 0;

    // Study logs calculations
    const logs = await StudyLog.find().sort({ date: -1 });

    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diffToMonday = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let weekHours = 0;
    let monthHours = 0;
    let totalStudyHours = 0;

    const uniqueStudyDays = new Set();

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      const hours = Number(log.hoursStudied) || 0;
      totalStudyHours += hours;

      if (logDate >= startOfWeek) {
        weekHours += hours;
      }
      if (logDate >= startOfMonth) {
        monthHours += hours;
      }

      uniqueStudyDays.add(logDate.toISOString().split('T')[0]);
    });

    // Calculate streak
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // If no log today, check if yesterday had one
    const todayStr = checkDate.toISOString().split('T')[0];
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let cursor = uniqueStudyDays.has(todayStr) ? checkDate : uniqueStudyDays.has(yesterdayStr) ? yesterday : null;

    if (cursor) {
      while (true) {
        const dateStr = cursor.toISOString().split('T')[0];
        if (uniqueStudyDays.has(dateStr)) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalItems: items.length,
        activeCount,
        completedCount,
        pausedCount,
        notStartedCount,
        avgProgress: parseFloat(avgProgress),
        weekHours: parseFloat(weekHours.toFixed(1)),
        monthHours: parseFloat(monthHours.toFixed(1)),
        totalStudyHours: parseFloat(totalStudyHours.toFixed(1)),
        streak,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/learning
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { status, category, priority, search } = req.query;

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await LearningItem.find(query).sort({ order: 1, currentProgress: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/learning
router.post('/', protect, async (req, res, next) => {
  try {
    const item = await LearningItem.create(req.body);
    await ActivityLog.create({
      action: 'Added Learning Item',
      entityType: 'Learning',
      entityTitle: item.title,
      details: `Started tracking ${item.title} (${item.category})`,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/learning/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const item = await LearningItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Learning item not found' });
    }
    await ActivityLog.create({
      action: 'Updated Learning Item',
      entityType: 'Learning',
      entityTitle: item.title,
      details: `Updated progress to ${item.currentProgress}% (${item.status})`,
    });
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/learning/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const item = await LearningItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Learning item not found' });
    }
    await ActivityLog.create({
      action: 'Deleted Learning Item',
      entityType: 'Learning',
      entityTitle: item.title,
      details: `Deleted ${item.title}`,
    });
    res.json({ success: true, message: 'Learning item removed successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/learning/logs
// @desc    Get study activity logs
router.get('/logs', optionalAuth, async (req, res, next) => {
  try {
    const logs = await StudyLog.find()
      .populate('learningItemId', 'title category')
      .sort({ date: -1 })
      .limit(50);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/learning/logs
// @desc    Add a study log
router.post('/logs', protect, async (req, res, next) => {
  try {
    const log = await StudyLog.create(req.body);

    // If learningItemId provided, optionally increment hours
    if (log.learningItemId) {
      const item = await LearningItem.findById(log.learningItemId);
      if (item) {
        item.hoursCompleted = (item.hoursCompleted || 0) + Number(log.hoursStudied || 0);
        await item.save();
      }
    }

    await ActivityLog.create({
      action: 'Logged Study Session',
      entityType: 'StudyLog',
      entityTitle: log.subjectOrTopic,
      details: `${log.hoursStudied} hours studied`,
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/learning/logs/:id
router.delete('/logs/:id', protect, async (req, res, next) => {
  try {
    const log = await StudyLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Study log not found' });
    }
    res.json({ success: true, message: 'Study log removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
