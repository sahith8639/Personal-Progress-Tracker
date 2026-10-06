const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const LearningItem = require('../models/LearningItem');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const { optionalAuth } = require('../middleware/auth');

// Utility to escape CSV fields
const escapeCSV = (str) => {
  if (str === null || str === undefined) return '""';
  const stringified = String(str).replace(/"/g, '""');
  return `"${stringified}"`;
};

// @route   GET /api/export/courses/csv
router.get('/courses/csv', optionalAuth, async (req, res, next) => {
  try {
    const filter = req.user ? {} : { isPublic: true };
    const courses = await Course.find(filter).sort({ semester: 1, code: 1 });

    const headers = ['Course Name', 'Code', 'Semester', 'Academic Year', 'Category', 'Credits', 'Grade', 'Grade Point', 'Status', 'Instructor'];
    const rows = courses.map((c) => [
      escapeCSV(c.name),
      escapeCSV(c.code),
      escapeCSV(c.semester),
      escapeCSV(c.academicYear),
      escapeCSV(c.category),
      escapeCSV(c.credits),
      escapeCSV(c.grade || 'N/A'),
      escapeCSV(c.gradePoint !== null ? c.gradePoint : 'N/A'),
      escapeCSV(c.status),
      escapeCSV(c.instructor || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="academic-courses.csv"');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/export/certificates/csv
router.get('/certificates/csv', optionalAuth, async (req, res, next) => {
  try {
    const filter = req.user ? {} : { isPublic: true };
    const certs = await Certificate.find(filter).sort({ issueDate: -1 });

    const headers = ['Certificate Name', 'Issuing Organization', 'Issue Date', 'Category', 'Credential ID', 'Credential URL', 'Skills'];
    const rows = certs.map((c) => [
      escapeCSV(c.name),
      escapeCSV(c.issuingOrganization),
      escapeCSV(c.issueDate),
      escapeCSV(c.category),
      escapeCSV(c.credentialId || ''),
      escapeCSV(c.credentialUrl || ''),
      escapeCSV((c.skills || []).join('; ')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="certificates-record.csv"');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/export/learning/csv
router.get('/learning/csv', optionalAuth, async (req, res, next) => {
  try {
    const filter = req.user ? {} : { isPublic: true };
    const items = await LearningItem.find(filter).sort({ currentProgress: -1 });

    const headers = ['Topic / Skill', 'Category', 'Status', 'Progress (%)', 'Priority', 'Hours Completed', 'Total Estimated Hours', 'Current Level', 'Target Level'];
    const rows = items.map((i) => [
      escapeCSV(i.title),
      escapeCSV(i.category),
      escapeCSV(i.status),
      escapeCSV(i.currentProgress),
      escapeCSV(i.priority),
      escapeCSV(i.hoursCompleted),
      escapeCSV(i.totalEstimatedHours),
      escapeCSV(i.currentLevel),
      escapeCSV(i.targetLevel),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="learning-progress.csv"');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/export/academic-summary
// @desc    Full printable academic profile summary data
router.get('/academic-summary', optionalAuth, async (req, res, next) => {
  try {
    const filter = req.user ? {} : { isPublic: true };

    const [profile, education, courses, certs, skills, projects] = await Promise.all([
      Profile.findOne(),
      Education.find(filter).sort({ order: 1 }),
      Course.find(filter).sort({ semester: 1, code: 1 }),
      Certificate.find(filter).sort({ issueDate: -1 }),
      Skill.find(filter).sort({ category: 1, proficiency: -1 }),
      Project.find(filter).sort({ order: 1 }),
    ]);

    // Calculate GPA / CGPA summary
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

    res.json({
      success: true,
      data: {
        profile,
        metrics: {
          cgpa: parseFloat(cgpa),
          completedCredits,
          totalCredits,
          completedCourses: courses.filter((c) => c.status === 'Completed').length,
          totalCourses: courses.length,
        },
        education,
        courses,
        certificates: certs,
        skills,
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
