import express from 'express';
import { 
  createInterview, 
  submitInterviewAnswers, 
  getInterviewById, 
  getReportByInterviewId, 
  getUserInterviews, 
  getDashboardMetrics 
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.post('/', createInterview);
router.get('/history', getUserInterviews);
router.get('/dashboard/metrics', getDashboardMetrics);

router.get('/:id', getInterviewById);
router.post('/:id/submit', submitInterviewAnswers);
router.get('/:id/report', getReportByInterviewId);

export default router;
