const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true,
    },
    academicYear: {
      type: String,
      default: '2024 - 2025',
      trim: true,
    },
    category: {
      type: String,
      default: 'Core Computer Science',
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 0,
      default: 3,
    },
    grade: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    gradePoint: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['Completed', 'Currently Learning', 'Not Completed', 'Dropped', 'Planned'],
      default: 'Currently Learning',
    },
    instructor: {
      type: String,
      default: '',
      trim: true,
    },
    institution: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: String,
      default: '',
    },
    completionDate: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    topics: {
      type: [topicSchema],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
