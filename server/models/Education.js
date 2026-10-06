const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    university: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    cgpa: {
      type: Number,
      default: null,
    },
    percentage: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    achievements: {
      type: [String],
      default: [],
    },
    relevantCoursework: {
      type: [String],
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

module.exports = mongoose.model('Education', educationSchema);
