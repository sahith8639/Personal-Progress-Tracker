const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const GradeSetting = require('../models/GradeSetting');
const Resource = require('../models/Resource');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// Default Grade Points table
const DEFAULT_GRADES = [
  { grade: 'S', point: 10, description: 'Outstanding / Exceptional' },
  { grade: 'A', point: 9, description: 'Excellent' },
  { grade: 'B', point: 8, description: 'Very Good' },
  { grade: 'C', point: 7, description: 'Good' },
  { grade: 'D', point: 6, description: 'Average' },
  { grade: 'E', point: 5, description: 'Satisfactory / Pass' },
  { grade: 'F', point: 0, description: 'Fail' },
];

// Helper to get grade points lookup map
const getGradeMap = async () => {
  let settings = await GradeSetting.find();
  if (!settings || settings.length === 0) {
    settings = await GradeSetting.insertMany(DEFAULT_GRADES);
  }
  const map = {};
  settings.forEach((s) => {
    map[s.grade.toUpperCase()] = s.point;
  });
  return { map, settings };
};

// @route   GET /api/courses/grades-config
router.get('/grades-config', async (req, res, next) => {
  try {
    const { settings } = await getGradeMap();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/courses/grades-config
router.put('/grades-config', protect, async (req, res, next) => {
  try {
    const { mappings } = req.body; // Array of { grade, point, description }
    if (!Array.isArray(mappings)) {
      return res.status(400).json({ success: false, message: 'Mappings must be an array' });
    }

    await GradeSetting.deleteMany({});
    const newSettings = await GradeSetting.insertMany(mappings);

    // Sync all existing courses' gradePoint based on new mapping
    const gradeMap = {};
    newSettings.forEach((s) => {
      gradeMap[s.grade.toUpperCase()] = s.point;
    });

    const courses = await Course.find();
    for (const c of courses) {
      if (c.grade && gradeMap[c.grade.toUpperCase()] !== undefined) {
        c.gradePoint = gradeMap[c.grade.toUpperCase()];
        await c.save();
      }
    }

    res.json({ success: true, data: newSettings, message: 'Grade mappings updated and courses synced' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/courses/stats
// @desc    Calculate GPA, CGPA, credit breakdown, status counts, etc.
router.get('/stats', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const courses = await Course.find(query);

    let totalCredits = 0;
    let completedCredits = 0;
    let earnedGradePointsSum = 0;
    let gpaCreditsSum = 0;

    const statusCounts = {
      'Completed': 0,
      'Currently Learning': 0,
      'Not Completed': 0,
      'Dropped': 0,
      'Planned': 0,
    };

    const semesterMap = {};
    const gradeDistribution = {};

    courses.forEach((c) => {
      const cr = Number(c.credits) || 0;
      totalCredits += cr;

      // Status count
      if (statusCounts[c.status] !== undefined) {
        statusCounts[c.status]++;
      } else {
        statusCounts[c.status] = 1;
      }

      // Completed courses calculation
      if (c.status === 'Completed') {
        completedCredits += cr;
        if (c.gradePoint !== null && c.gradePoint !== undefined) {
          earnedGradePointsSum += cr * Number(c.gradePoint);
          gpaCreditsSum += cr;
        }
      }

      // Grade distribution
      if (c.grade) {
        gradeDistribution[c.grade] = (gradeDistribution[c.grade] || 0) + 1;
      }

      // Group by Semester
      if (!semesterMap[c.semester]) {
        semesterMap[c.semester] = {
          semester: c.semester,
          coursesCount: 0,
          totalCredits: 0,
          completedCredits: 0,
          gradePointsSum: 0,
          gpaCredits: 0,
        };
      }
      semesterMap[c.semester].coursesCount++;
      semesterMap[c.semester].totalCredits += cr;
      if (c.status === 'Completed') {
        semesterMap[c.semester].completedCredits += cr;
        if (c.gradePoint !== null && c.gradePoint !== undefined) {
          semesterMap[c.semester].gradePointsSum += cr * Number(c.gradePoint);
          semesterMap[c.semester].gpaCredits += cr;
        }
      }
    });

    const overallCGPA = gpaCreditsSum > 0 ? (earnedGradePointsSum / gpaCreditsSum).toFixed(2) : '0.00';
    const remainingCredits = Math.max(0, totalCredits - completedCredits);

    const semesterAnalytics = Object.values(semesterMap).map((sem) => ({
      semester: sem.semester,
      coursesCount: sem.coursesCount,
      totalCredits: sem.totalCredits,
      completedCredits: sem.completedCredits,
      gpa: sem.gpaCredits > 0 ? (sem.gradePointsSum / sem.gpaCredits).toFixed(2) : 'N/A',
    }));

    res.json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalCredits,
        completedCredits,
        remainingCredits,
        cgpa: parseFloat(overallCGPA),
        statusCounts,
        gradeDistribution,
        semesterAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/courses
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = req.user ? {} : { isPublic: true };
    const { semester, status, category, academicYear, search } = req.query;

    if (semester) query.semester = semester;
    if (status) query.status = status;
    if (category) query.category = category;
    if (academicYear) query.academicYear = academicYear;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ semester: 1, order: 1, code: 1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/courses/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const resQuery = { courseId: course._id };
    if (!req.user) resQuery.isPublic = true;
    const resources = await Resource.find(resQuery);

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        resources,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/courses
router.post('/', protect, async (req, res, next) => {
  try {
    const courseData = { ...req.body };

    // Auto calculate gradePoint if grade is provided and gradePoint is empty
    if (courseData.grade && (courseData.gradePoint === null || courseData.gradePoint === undefined || courseData.gradePoint === '')) {
      const { map } = await getGradeMap();
      const pt = map[courseData.grade.toUpperCase()];
      if (pt !== undefined) {
        courseData.gradePoint = pt;
      }
    }

    const course = await Course.create(courseData);

    await ActivityLog.create({
      action: 'Added Course',
      entityType: 'Course',
      entityTitle: `${course.code}: ${course.name}`,
      details: `${course.credits} Credits, ${course.semester}`,
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/courses/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const courseData = { ...req.body };

    if (courseData.grade && (courseData.gradePoint === null || courseData.gradePoint === undefined || courseData.gradePoint === '')) {
      const { map } = await getGradeMap();
      const pt = map[courseData.grade.toUpperCase()];
      if (pt !== undefined) {
        courseData.gradePoint = pt;
      }
    }

    const course = await Course.findByIdAndUpdate(req.params.id, courseData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await ActivityLog.create({
      action: 'Updated Course',
      entityType: 'Course',
      entityTitle: `${course.code}: ${course.name}`,
      details: `Status: ${course.status}, Grade: ${course.grade || 'N/A'}`,
    });

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/courses/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Optional: unlink or keep resources
    await ActivityLog.create({
      action: 'Deleted Course',
      entityType: 'Course',
      entityTitle: `${course.code}: ${course.name}`,
      details: `Deleted course ${course.name}`,
    });

    res.json({ success: true, message: 'Course removed successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/courses/:id/topics
router.post('/:id/topics', protect, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Topic title is required' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.topics.push({ title, completed: !!completed });
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/courses/:id/topics/:topicId
router.put('/:id/topics/:topicId', protect, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const topic = course.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    if (req.body.title !== undefined) topic.title = req.body.title;
    if (req.body.completed !== undefined) topic.completed = req.body.completed;

    await course.save();
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/courses/:id/topics/:topicId
router.delete('/:id/topics/:topicId', protect, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.topics.pull({ _id: req.params.topicId });
    await course.save();

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
