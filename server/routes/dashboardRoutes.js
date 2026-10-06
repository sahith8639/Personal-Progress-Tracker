const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const LearningItem = require('../models/LearningItem');
const Resource = require('../models/Resource');
const ActivityLog = require('../models/ActivityLog');
const StudyLog = require('../models/StudyLog');
const { optionalAuth } = require('../middleware/auth');

// @route   GET /api/dashboard/overview
router.get('/overview', optionalAuth, async (req, res, next) => {
  try {
    const isAuth = !!req.user;
    const filter = isAuth ? {} : { isPublic: true };

    const [courses, certs, projects, skills, learningItems, recentActivities] = await Promise.all([
      Course.find(filter),
      Certificate.find(filter),
      Project.find(filter),
      Skill.find(filter),
      LearningItem.find(filter),
      ActivityLog.find().sort({ timestamp: -1 }).limit(10),
    ]);

    // Calculate CGPA & credits
    let totalCredits = 0;
    let completedCredits = 0;
    let gradePointsSum = 0;
    let gpaCreditsSum = 0;

    courses.forEach((c) => {
      const cr = Number(c.credits) || 0;
      totalCredits += cr;
      if (c.status === 'Completed') {
        completedCredits += cr;
        if (c.gradePoint !== null && c.gradePoint !== undefined) {
          gradePointsSum += cr * Number(c.gradePoint);
          gpaCreditsSum += cr;
        }
      }
    });

    const cgpa = gpaCreditsSum > 0 ? (gradePointsSum / gpaCreditsSum).toFixed(2) : '0.00';

    // Learning metrics
    const activeLearning = learningItems.filter((l) => l.status === 'Learning').length;
    const avgProgress =
      learningItems.length > 0
        ? (learningItems.reduce((acc, curr) => acc + (curr.currentProgress || 0), 0) / learningItems.length).toFixed(1)
        : 0;

    // Project metrics
    const projectsCompleted = projects.filter((p) => p.status === 'Completed').length;
    const projectsInProgress = projects.filter((p) => p.status === 'In Progress').length;

    res.json({
      success: true,
      data: {
        academics: {
          cgpa: parseFloat(cgpa),
          completedCredits,
          totalCredits,
          completedCourses: courses.filter((c) => c.status === 'Completed').length,
          totalCourses: courses.length,
        },
        learning: {
          activeLearning,
          totalSkills: skills.length,
          skillsLearning: skills.filter((s) => s.status === 'Learning').length,
          avgProgress: parseFloat(avgProgress),
        },
        certificates: {
          total: certs.length,
        },
        projects: {
          total: projects.length,
          completed: projectsCompleted,
          inProgress: projectsInProgress,
        },
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/search
// @desc    Global search across entire system
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ success: true, results: { courses: [], skills: [], projects: [], certificates: [], resources: [], learning: [] } });
    }

    const reg = { $regex: q, $options: 'i' };
    const isAuth = !!req.user;
    const filter = isAuth ? {} : { isPublic: true };

    const [courses, skills, projects, certificates, resources, learning] = await Promise.all([
      Course.find({ ...filter, $or: [{ name: reg }, { code: reg }, { instructor: reg }, { category: reg }] }).limit(10),
      Skill.find({ ...filter, $or: [{ name: reg }, { category: reg }, { technologies: reg }] }).limit(10),
      Project.find({ ...filter, $or: [{ name: reg }, { shortDescription: reg }, { technologies: reg }, { category: reg }] }).limit(10),
      Certificate.find({ ...filter, $or: [{ name: reg }, { issuingOrganization: reg }, { skills: reg }, { category: reg }] }).limit(10),
      Resource.find({ ...filter, $or: [{ title: reg }, { subject: reg }, { topic: reg }, { type: reg }] }).limit(10),
      LearningItem.find({ ...filter, $or: [{ title: reg }, { category: reg }, { notes: reg }] }).limit(10),
    ]);

    res.json({
      success: true,
      results: {
        courses,
        skills,
        projects,
        certificates,
        resources,
        learning,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
