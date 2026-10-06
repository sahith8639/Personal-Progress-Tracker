const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Programming Languages',
        'Web Development',
        'AI/ML',
        'Data Science',
        'Databases',
        'Tools',
        'Cloud',
        'Version Control',
        'Other',
      ],
      default: 'Programming Languages',
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    experience: {
      type: String,
      default: '1 year',
    },
    status: {
      type: String,
      enum: ['Learning', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    technologies: {
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

module.exports = mongoose.model('Skill', skillSchema);
