const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certificate name is required'],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
    },
    credentialId: {
      type: String,
      default: '',
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'AI & Data Science',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
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

module.exports = mongoose.model('Certificate', certificateSchema);
