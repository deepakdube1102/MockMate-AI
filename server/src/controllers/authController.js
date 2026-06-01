import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Report from '../models/Report.js';
import Resume from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecretkey', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Helper: shape a user object for API responses (includes all onboarding fields)
const formatUser = (user, withToken = false) => {
  const formatted = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    username: user.username || '',
    country: user.country || '',
    linkedinUrl: user.linkedinUrl || '',
    githubUrl: user.githubUrl || '',
    portfolioUrl: user.portfolioUrl || '',
    phoneNumber: user.phoneNumber || '',
    targetRole: user.targetRole,
    experienceLevel: user.experienceLevel,
    skills: user.skills,
    preferredInterviewType: user.preferredInterviewType || '',
    careerGoal: user.careerGoal || '',
    onboardingCompleted: user.onboardingCompleted || false,
    interviewsCompleted: user.interviewsCompleted,
    averageScore: user.averageScore,
    streak: user.streak || 0,
  };
  if (withToken) {
    formatted.token = generateToken(user._id);
  }
  return formatted;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const userExists = memoryStore.findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      const user = memoryStore.createUser({ name, email, password });
      return res.status(201).json(formatUser(user, true));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json(formatUser(user, true));
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const user = memoryStore.findUserByEmail(email);
      if (user && (await user.comparePassword(password))) {
        return res.json(formatUser(user, true));
      } else {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
    }

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      res.json(formatUser(user, true));
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const user = memoryStore.findUserById(req.user._id);
      if (user) {
        return res.json(formatUser(user));
      } else {
        return res.status(404).json({ message: 'User profile not found.' });
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json(formatUser(user));
    } else {
      res.status(404).json({ message: 'User profile not found.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile settings
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const user = memoryStore.findUserById(req.user._id);
      if (user) {
        const updateData = {
          name: req.body.name || user.name,
          targetRole: req.body.targetRole || user.targetRole,
          experienceLevel: req.body.experienceLevel || user.experienceLevel,
          username: req.body.username !== undefined ? req.body.username : user.username,
          country: req.body.country !== undefined ? req.body.country : user.country,
          linkedinUrl: req.body.linkedinUrl !== undefined ? req.body.linkedinUrl : user.linkedinUrl,
          githubUrl: req.body.githubUrl !== undefined ? req.body.githubUrl : user.githubUrl,
          portfolioUrl: req.body.portfolioUrl !== undefined ? req.body.portfolioUrl : user.portfolioUrl,
          phoneNumber: req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber,
          preferredInterviewType: req.body.preferredInterviewType !== undefined ? req.body.preferredInterviewType : user.preferredInterviewType,
          careerGoal: req.body.careerGoal !== undefined ? req.body.careerGoal : user.careerGoal,
        };
        
        if (req.body.skills) {
          updateData.skills = Array.isArray(req.body.skills) 
            ? req.body.skills 
            : req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        
        if (req.body.avatar) {
          updateData.avatar = await uploadToCloudinary(req.body.avatar);
        }

        if (req.body.password) {
          updateData.password = req.body.password;
        }

        const updatedUser = memoryStore.updateUser(user._id, updateData);
        return res.json(formatUser(updatedUser, true));
      } else {
        return res.status(404).json({ message: 'User not found.' });
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.targetRole = req.body.targetRole || user.targetRole;
      user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
      if (req.body.username !== undefined) user.username = req.body.username;
      if (req.body.country !== undefined) user.country = req.body.country;
      if (req.body.linkedinUrl !== undefined) user.linkedinUrl = req.body.linkedinUrl;
      if (req.body.githubUrl !== undefined) user.githubUrl = req.body.githubUrl;
      if (req.body.portfolioUrl !== undefined) user.portfolioUrl = req.body.portfolioUrl;
      if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
      if (req.body.preferredInterviewType !== undefined) user.preferredInterviewType = req.body.preferredInterviewType;
      if (req.body.careerGoal !== undefined) user.careerGoal = req.body.careerGoal;
      
      if (req.body.skills) {
        user.skills = Array.isArray(req.body.skills) 
          ? req.body.skills 
          : req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
      }

      if (req.body.avatar) {
        user.avatar = await uploadToCloudinary(req.body.avatar);
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json(formatUser(updatedUser, true));
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Complete onboarding — save profile + career info, mark onboardingCompleted = true
 * @route   POST /api/auth/onboarding
 * @access  Private
 */
export const completeOnboarding = async (req, res, next) => {
  try {
    const {
      // Step 1: Profile
      name, username, avatar, country, linkedinUrl, githubUrl, portfolioUrl, phoneNumber,
      // Step 2: Career
      targetRole, experienceLevel, skills, preferredInterviewType, careerGoal,
    } = req.body;

    let uploadedAvatar = avatar;
    if (avatar) {
      uploadedAvatar = await uploadToCloudinary(avatar);
    }

    // IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const user = memoryStore.findUserById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      const updateData = {
        onboardingCompleted: true,
        name: name || user.name,
        username: username || user.username,
        avatar: uploadedAvatar || user.avatar,
        country: country || user.country,
        linkedinUrl: linkedinUrl || user.linkedinUrl,
        githubUrl: githubUrl || user.githubUrl,
        portfolioUrl: portfolioUrl || user.portfolioUrl,
        phoneNumber: phoneNumber || user.phoneNumber,
        targetRole: targetRole || user.targetRole,
        experienceLevel: experienceLevel || user.experienceLevel,
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : user.skills),
        preferredInterviewType: preferredInterviewType || user.preferredInterviewType,
        careerGoal: careerGoal || user.careerGoal,
      };

      const updatedUser = memoryStore.updateUser(user._id, updateData);
      return res.json(formatUser(updatedUser, true));
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.onboardingCompleted = true;
    if (name) user.name = name;
    if (username) user.username = username;
    if (avatar) user.avatar = uploadedAvatar;
    if (country) user.country = country;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (targetRole) user.targetRole = targetRole;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (preferredInterviewType) user.preferredInterviewType = preferredInterviewType;
    if (careerGoal) user.careerGoal = careerGoal;

    const updatedUser = await user.save();
    res.json(formatUser(updatedUser, true));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account and all associated data
 * @route   DELETE /api/auth/profile
 * @access  Private
 */
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!global.dbConnected) {
      // Synchronous stateful in-memory fallback
      // Find user interviews to get their IDs
      const userInterviews = memoryStore.interviews.filter(
        (i) => i.userId && i.userId.toString() === userId.toString()
      );
      const interviewIds = userInterviews.map((i) => i._id.toString());

      // Cascade reports associated with these interviews
      memoryStore.reports = memoryStore.reports.filter(
        (r) => !r.interviewId || !interviewIds.includes(r.interviewId.toString())
      );

      // Delete user's interviews
      memoryStore.interviews = memoryStore.interviews.filter(
        (i) => !i.userId || i.userId.toString() !== userId.toString()
      );

      // Delete user's resumes
      memoryStore.resumes = memoryStore.resumes.filter(
        (r) => !r.userId || r.userId.toString() !== userId.toString()
      );

      // Delete user
      memoryStore.users = memoryStore.users.filter(
        (u) => u._id.toString() !== userId.toString()
      );
    } else {
      // MongoDB Deletion Flow
      // 1. Find all interviews to collect their IDs
      const interviews = await Interview.find({ userId });
      const interviewIds = interviews.map((i) => i._id);

      // 2. Wipes all performance reports linked to those interview IDs in one batch
      await Report.deleteMany({ interviewId: { $in: interviewIds } });

      // 3. Wipes the user's interviews
      await Interview.deleteMany({ userId });

      // 4. Manually queries and deletes all of the user's Resumes
      await Resume.deleteMany({ userId });

      // 5. Deletes the user User document
      await User.findByIdAndDelete(userId);
    }

    // Clear session cookies if any
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Account and all associated records have been successfully and permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate with Google OAuth Access Token
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  const { accessToken } = req.body;

  try {
    if (!accessToken) {
      return res.status(400).json({ message: 'Please provide Google OAuth access token.' });
    }

    // Verify token & fetch user profile from Google UserInfo endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      return res.status(401).json({ message: 'Invalid or expired Google access token.' });
    }

    const profile = await response.json();
    const { name, email, picture } = profile;

    if (!email) {
      return res.status(400).json({ message: 'Google account does not provide an email address.' });
    }

    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      let user = memoryStore.findUserByEmail(email);
      
      if (!user) {
        // Create in-memory user
        user = memoryStore.createUser({
          name,
          email,
          avatar: picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=mockmate',
          password: `google_fallback_pw_${Math.random().toString(36).substring(2)}`
        });
      } else if (picture && (!user.avatar || user.avatar.includes('dicebear.com'))) {
        // Upgrade avatar if they have the default and Google provides a picture
        user.avatar = picture;
      }
      
      return res.status(200).json(formatUser(user, true));
    }

    // MongoDB Flow
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with Google credentials
      const randomPassword = `google_oauth_pw_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      user = await User.create({
        name,
        email,
        avatar: picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=mockmate',
        password: randomPassword,
        onboardingCompleted: false
      });
    } else if (picture && (!user.avatar || user.avatar.includes('dicebear.com'))) {
      // Upgrade avatar if they have the default and Google provides a picture
      user.avatar = picture;
      await user.save();
    }

    res.status(200).json(formatUser(user, true));
  } catch (error) {
    next(error);
  }
};

