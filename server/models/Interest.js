const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Interest name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Technology & AI',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    interestLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High'],
      default: 'High',
    },
    relatedSkills: {
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

module.exports = mongoose.model('Interest', interestSchema);
