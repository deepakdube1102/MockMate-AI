import pdfParse from 'pdf-parse';
import { v2 as cloudinary } from 'cloudinary';
import Resume from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { analyzeResumeText } from '../services/geminiService.js';

// Configure Cloudinary
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️ Cloudinary credentials not fully specified in environment. Using fallback URL storage.');
    return false;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });
    return true;
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error);
    return false;
  }
};

const isCloudinaryActive = configureCloudinary();

/**
 * Upload resume to Cloudinary buffer stream
 */
const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryActive || !global.dbConnected) {
      // Fallback local mockup file path
      return resolve(`/uploads/resumes/${Date.now()}_${originalname}`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mockmate_resumes',
        resource_type: 'raw', // Support PDF / Docx
        public_id: `resume_${Date.now()}_${originalname.replace(/\.[^/.]+$/, "")}`
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload failed:', error);
          // Return fallback local path even if upload fails
          return resolve(`/uploads/resumes/${Date.now()}_${originalname}`);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Normalize and clean extracted text to remove layout spacing, redundant newlines,
 * control characters, and collapse tabs/multiple spaces for perfect AI parse readability.
 */
const normalizeExtractedText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n') // normalize newlines
    .replace(/[ \t]+/g, ' ') // collapse multiple spaces and tabs
    .replace(/\n\s*\n+/g, '\n\n') // collapse multiple empty lines into double newlines
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // clean binary/unreadable control characters
    .trim();
};

/**
 * @desc    Upload, parse, and analyze resume using Gemini
 * @route   POST /api/resumes/upload
 * @access  Private
 */
export const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file (.pdf or .txt).' });
    }

    const { originalname, buffer, mimetype } = req.file;
    let extractedText = '';

    console.log(`📂 Processing uploaded file: ${originalname} (${mimetype})`);

    // Parse text in memory based on mime type
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      try {
        const parsedPdf = await pdfParse(buffer);
        extractedText = parsedPdf.text || '';
      } catch (pdfError) {
        console.error('❌ PDF parsing failed in pdf-parse:', pdfError.message);
        // Fallback: convert buffer slice to basic string or throw readable error
        extractedText = buffer.toString('utf8', 0, Math.min(buffer.length, 10000))
          .replace(/[^\x20-\x7E\n\r\t]/g, ' '); // Clean binary control characters
      }
    } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ 
        message: 'Unsupported file type. Please upload a PDF (.pdf) or text (.txt) file.' 
      });
    }

    // Sanitize and clean extracted text
    extractedText = normalizeExtractedText(extractedText);

    if (!extractedText || extractedText.length < 50) {
      console.warn('⚠️ Extracted text is very small or empty. Proceeding with fallback parsing.');
      extractedText = `Extracted resume content from file named ${originalname}. Please process it as an empty profile.`;
    }

    // Call Gemini AI resume analytics parsing
    const parsedData = await analyzeResumeText(extractedText);

    // Save PDF file (Cloudinary stream or fallback local URL)
    const fileUrl = await uploadToCloudinary(buffer, originalname);

    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const resume = memoryStore.createResume({
        userId: req.user._id,
        fileUrl,
        extractedSkills: parsedData.extractedSkills,
        extractedProjects: parsedData.extractedProjects,
        extractedExperience: parsedData.extractedExperience,
        extractedEducation: parsedData.extractedEducation,
        aiSummary: parsedData.aiSummary
      });

      // Populate skills to memory user
      const user = memoryStore.findUserById(req.user._id);
      if (user) {
        const merged = [...new Set(user.skills.concat(parsedData.extractedSkills))].filter(Boolean);
        user.skills = merged.slice(0, 10);
      }

      return res.status(201).json(resume);
    }

    // Create database Resume entry
    const resume = await Resume.create({
      userId: req.user._id,
      fileUrl,
      extractedSkills: parsedData.extractedSkills,
      extractedProjects: parsedData.extractedProjects,
      extractedExperience: parsedData.extractedExperience,
      extractedEducation: parsedData.extractedEducation,
      aiSummary: parsedData.aiSummary
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all resumes uploaded by user
 * @route   GET /api/resumes
 * @access  Private
 */
export const getUserResumes = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const resumes = memoryStore.findResumesByUserId(req.user._id);
      return res.json(resumes);
    }

    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest analyzed resume
 * @route   GET /api/resumes/latest
 * @access  Private
 */
export const getLatestResume = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const resumes = memoryStore.findResumesByUserId(req.user._id);
      if (resumes.length === 0) {
        return res.status(404).json({ message: 'No resumes found.' });
      }
      return res.json(resumes[0]); // first element is sorted as latest
    }

    const resume = await Resume.findOne({ userId: req.user._id })
      .sort({ uploadedAt: -1 });
    
    if (!resume) {
      return res.status(404).json({ message: 'No resumes found.' });
    }
    
    res.json(resume);
  } catch (error) {
    next(error);
  }
};
