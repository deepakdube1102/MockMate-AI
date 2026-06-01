import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  extractedSkills: {
    type: [String],
    default: []
  },
  extractedProjects: {
    type: [String],
    default: []
  },
  extractedExperience: {
    type: [String],
    default: []
  },
  extractedEducation: {
    type: [String],
    default: []
  },
  aiSummary: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
