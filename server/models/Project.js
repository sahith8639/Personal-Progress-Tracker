const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    detailedDescription: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'Machine Learning',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    liveDemoUrl: {
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
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planned', 'Paused'],
      default: 'In Progress',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    docUrl: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Project', projectSchema);
