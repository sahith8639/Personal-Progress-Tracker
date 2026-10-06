const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  targetDate: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
});

const learningItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Programming',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      default: '',
    },
    targetDate: {
      type: String,
      default: '',
    },
    currentProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Not Started', 'Learning', 'Paused', 'Completed'],
      default: 'Learning',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    hoursCompleted: {
      type: Number,
      default: 0,
    },
    totalEstimatedHours: {
      type: Number,
      default: 50,
    },
    currentLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    targetLevel: {
      type: String,
      enum: ['Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    notes: {
      type: String,
      default: '',
    },
    roadmap: {
      type: [roadmapStepSchema],
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

module.exports = mongoose.model('LearningItem', learningItemSchema);
