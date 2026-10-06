const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'PDF',
        'Image',
        'Document',
        'Video',
        'Website',
        'GitHub Repository',
        'Notes',
        'Presentation',
        'Other',
      ],
      default: 'Document',
    },
    semester: {
      type: String,
      default: '',
      trim: true,
    },
    topic: {
      type: String,
      default: '',
      trim: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    externalUrl: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
    originalFileName: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
