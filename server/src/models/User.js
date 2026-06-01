import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mockmate',
  },
  username: {
    type: String,
    trim: true,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  portfolioUrl: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  targetRole: {
    type: String,
    default: 'Software Engineer',
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior'],
    default: 'Mid',
  },
  skills: {
    type: [String],
    default: [],
  },
  preferredInterviewType: {
    type: String,
    default: '',
  },
  careerGoal: {
    type: String,
    default: '',
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  interviewsCompleted: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'users');
export default User;
