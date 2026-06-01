import express from 'express';
import multer from 'multer';
import { 
  uploadAndAnalyzeResume, 
  getUserResumes, 
  getLatestResume 
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All routes are protected
router.use(protect);

router.post('/upload', upload.single('resume'), uploadAndAnalyzeResume);
router.get('/', getUserResumes);
router.get('/latest', getLatestResume);

export default router;
