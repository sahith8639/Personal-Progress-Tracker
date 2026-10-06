const mongoose = require('mongoose');

const gradeSettingSchema = new mongoose.Schema(
  {
    grade: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    point: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GradeSetting', gradeSettingSchema);
