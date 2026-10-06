const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      default: 'Sahithsai Pasupula',
    },
    title: {
      type: String,
      default: 'Artificial Intelligence & Machine Learning Student',
    },
    subTitle: {
      type: String,
      default: 'Aspiring AI/ML Engineer | Software Developer | Problem Solver',
    },
    bio: {
      type: String,
      default: 'Undergraduate student passionate about Artificial Intelligence, Machine Learning, Deep Learning, and Full-Stack Software Engineering. Dedicated to building intelligent systems and scalable software applications.',
    },
    careerObjective: {
      type: String,
      default: 'To leverage strong analytical, mathematical, and algorithmic skills to build production-grade AI/ML applications and robust software systems while pursuing continuous academic and technological excellence.',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'India',
    },
    email: {
      type: String,
      default: 'sahithsai.aiml@gmail.com',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    github: {
      type: String,
      default: 'https://github.com',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com',
    },
    twitter: {
      type: String,
      default: '',
    },
    leetcode: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    // Visibility toggles
    isEmailPublic: {
      type: Boolean,
      default: true,
    },
    isPhonePublic: {
      type: Boolean,
      default: false,
    },
    isDobPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
