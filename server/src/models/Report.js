import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true
  },
  technicalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  communicationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  problemSolvingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  recommendations: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
