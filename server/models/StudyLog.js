const mongoose = require('mongoose');

const studyLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    subjectOrTopic: {
      type: String,
      required: [true, 'Subject or topic is required'],
      trim: true,
    },
    hoursStudied: {
      type: Number,
      required: [true, 'Hours studied is required'],
      min: 0.1,
    },
    topicsCompleted: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    learningItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningItem',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyLog', studyLogSchema);
