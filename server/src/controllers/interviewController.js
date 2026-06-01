import Interview from '../models/Interview.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';
import { generateQuestions, evaluateInterviewAnswers } from '../services/geminiService.js';

/**
 * @desc    Start / Create a new interview session
 * @route   POST /api/interviews
 * @access  Private
 */
export const createInterview = async (req, res, next) => {
  const { role, difficulty, interviewType, skills } = req.body;

  try {
    if (!role || !difficulty || !interviewType) {
      return res.status(400).json({ message: 'Please specify role, difficulty, and interview type.' });
    }

    const processedSkills = Array.isArray(skills) 
      ? skills 
      : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    // Generate questions via Gemini (or fallback mock)
    const questions = await generateQuestions(role, difficulty, interviewType, processedSkills);

    if (!questions || questions.length === 0) {
      return res.status(500).json({ message: 'Failed to generate interview questions. Please try again.' });
    }

    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const interview = memoryStore.createInterview({
        userId: req.user._id,
        role,
        interviewType,
        difficulty,
        questions,
      });
      return res.status(201).json(interview);
    }

    // Save session in database
    const interview = await Interview.create({
      userId: req.user._id,
      role,
      interviewType,
      difficulty,
      questions,
      status: 'pending'
    });

    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit answers and evaluate an interview
 * @route   POST /api/interviews/:id/submit
 * @access  Private
 */
export const submitInterviewAnswers = async (req, res, next) => {
  const { answers } = req.body;
  const interviewId = req.params.id;

  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const interview = memoryStore.findInterviewById(interviewId);
      if (!interview) {
        return res.status(404).json({ message: 'Interview session not found.' });
      }

      if (interview.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to this interview session.' });
      }

      if (interview.status === 'completed') {
        return res.status(400).json({ message: 'This interview has already been submitted and graded.' });
      }

      const evaluation = await evaluateInterviewAnswers(
        interview.role,
        interview.difficulty,
        interview.interviewType,
        interview.questions,
        answers
      );

      const processedAnswers = interview.questions.map((q, idx) => {
        const gradedItem = evaluation.gradedAnswers && evaluation.gradedAnswers[idx] 
          ? evaluation.gradedAnswers[idx] 
          : { score: evaluation.overallScore || 70, feedback: 'Successfully evaluated.' };

        return {
          questionIndex: idx,
          questionText: q,
          answerText: answers[idx] || '',
          score: gradedItem.score,
          feedback: gradedItem.feedback
        };
      });

      // Update memory interview state
      interview.answers = processedAnswers;
      interview.score = evaluation.overallScore;
      interview.feedback = evaluation.feedback;
      interview.status = 'completed';

      // Create memory report card
      const report = memoryStore.createReport({
        interviewId: interview._id,
        technicalScore: evaluation.technicalScore,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore,
        problemSolvingScore: evaluation.problemSolvingScore,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        recommendations: evaluation.recommendations
      });

      // Update memory user profile stats
      const user = memoryStore.findUserById(req.user._id);
      if (user) {
        const userInterviews = memoryStore.findInterviewsByUserId(user._id)
          .filter(i => i.status === 'completed')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const completedCount = userInterviews.length;
        const totalScoreSum = userInterviews.reduce((acc, curr) => acc + curr.score, 0);
        
        user.interviewsCompleted = completedCount;
        user.averageScore = completedCount > 0 ? Math.round(totalScoreSum / completedCount) : 0;

        // Calculate day streak
        let streak = 0;
        if (userInterviews.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const interviewDays = [...new Set(
            userInterviews.map(i => {
              const d = new Date(i.createdAt);
              d.setHours(0, 0, 0, 0);
              return d.getTime();
            })
          )].sort((a, b) => b - a);
          const ONE_DAY = 24 * 60 * 60 * 1000;
          let expected = today.getTime();
          if (interviewDays[0] === today.getTime() || interviewDays[0] === today.getTime() - ONE_DAY) {
            expected = interviewDays[0];
            for (const day of interviewDays) {
              if (day === expected) { streak++; expected -= ONE_DAY; }
              else break;
            }
          }
        }
        user.streak = streak;

        const mergedSkills = [...new Set(interview.role.split(' ').concat(user.skills))].filter(Boolean);
        user.skills = mergedSkills.slice(0, 10);
      }

      return res.status(200).json({ interview, report });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this interview session.' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'This interview has already been submitted and graded.' });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== interview.questions.length) {
      return res.status(400).json({ 
        message: `Please submit exactly ${interview.questions.length} answers.` 
      });
    }

    // Call Gemini grading service
    const evaluation = await evaluateInterviewAnswers(
      interview.role,
      interview.difficulty,
      interview.interviewType,
      interview.questions,
      answers
    );

    // Save individual graded answers inside Interview model
    const processedAnswers = interview.questions.map((q, idx) => {
      const gradedItem = evaluation.gradedAnswers && evaluation.gradedAnswers[idx] 
        ? evaluation.gradedAnswers[idx] 
        : { score: evaluation.overallScore || 70, feedback: 'Successfully evaluated.' };

      return {
        questionIndex: idx,
        questionText: q,
        answerText: answers[idx],
        score: gradedItem.score,
        feedback: gradedItem.feedback
      };
    });

    interview.answers = processedAnswers;
    interview.score = evaluation.overallScore;
    interview.feedback = evaluation.feedback;
    interview.status = 'completed';
    await interview.save();

    // Create detailed Report card
    const report = await Report.create({
      interviewId: interview._id,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      confidenceScore: evaluation.confidenceScore,
      problemSolvingScore: evaluation.problemSolvingScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      recommendations: evaluation.recommendations
    });

    // Update User Profile Metrics
    const user = await User.findById(req.user._id);
    if (user) {
      const userInterviews = await Interview.find({ userId: user._id, status: 'completed' }).sort({ createdAt: -1 });
      const completedCount = userInterviews.length;
      
      const totalScoreSum = userInterviews.reduce((acc, curr) => acc + curr.score, 0);
      user.interviewsCompleted = completedCount;
      user.averageScore = completedCount > 0 ? Math.round(totalScoreSum / completedCount) : 0;
      
      // Calculate day streak from interview dates
      let streak = 0;
      if (userInterviews.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Get unique interview days (normalized to midnight)
        const interviewDays = [...new Set(
          userInterviews.map(i => {
            const d = new Date(i.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })
        )].sort((a, b) => b - a); // newest first

        const ONE_DAY = 24 * 60 * 60 * 1000;
        let expected = today.getTime();
        // Allow streak to count if most recent session was today or yesterday
        if (interviewDays[0] === today.getTime() || interviewDays[0] === today.getTime() - ONE_DAY) {
          expected = interviewDays[0];
          for (const day of interviewDays) {
            if (day === expected) {
              streak++;
              expected -= ONE_DAY;
            } else {
              break;
            }
          }
        }
      }
      user.streak = streak;
      
      // Merge skills from the interview if they aren't already listed
      const interviewSkills = interview.role.split(' ').concat(user.skills);
      const uniqueSkills = [...new Set(interviewSkills)].filter(Boolean);
      user.skills = uniqueSkills.slice(0, 10); // cap at 10 high-value skills
      
      await user.save();
    }

    res.status(200).json({ interview, report });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed interview session with Q&As
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getInterviewById = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const interview = memoryStore.findInterviewById(req.params.id);
      if (!interview) {
        return res.status(404).json({ message: 'Interview session not found.' });
      }
      if (interview.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to this session.' });
      }
      return res.json(interview);
    }

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this session.' });
    }

    res.json(interview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get report evaluation for an interview
 * @route   GET /api/interviews/:id/report
 * @access  Private
 */
export const getReportByInterviewId = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const report = memoryStore.findReportByInterviewId(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Performance evaluation report not found.' });
      }
      return res.json(report);
    }

    const report = await Report.findOne({ interviewId: req.params.id });

    if (!report) {
      return res.status(404).json({ message: 'Performance evaluation report not found.' });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user interview history log
 * @route   GET /api/interviews/history
 * @access  Private
 */
export const getUserInterviews = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const interviews = memoryStore.findInterviewsByUserId(req.user._id);
      return res.json(interviews);
    }

    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated dashboard performance trends
 * @route   GET /api/interviews/dashboard/metrics
 * @access  Private
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    // STATEFUL IN-MEMORY FALLBACK
    if (!global.dbConnected) {
      const user = memoryStore.findUserById(req.user._id) || req.user;
      const completedInterviews = memoryStore.findInterviewsByUserId(user._id)
        .filter(i => i.status === 'completed')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      const totalInterviews = completedInterviews.length;
      let technicalAvg = 0;
      let communicationAvg = 0;
      let confidenceAvg = 0;
      let problemSolvingAvg = 0;
      let scoreTrend = [];

      if (totalInterviews > 0) {
        const reports = completedInterviews.map(i => memoryStore.findReportByInterviewId(i._id)).filter(Boolean);
        const techSum = reports.reduce((sum, r) => sum + r.technicalScore, 0);
        const commSum = reports.reduce((sum, r) => sum + r.communicationScore, 0);
        const confSum = reports.reduce((sum, r) => sum + r.confidenceScore, 0);
        const probSum = reports.reduce((sum, r) => sum + r.problemSolvingScore, 0);

        technicalAvg = Math.round(techSum / totalInterviews);
        communicationAvg = Math.round(commSum / totalInterviews);
        confidenceAvg = Math.round(confSum / totalInterviews);
        problemSolvingAvg = Math.round(probSum / totalInterviews);

        scoreTrend = completedInterviews.map((item, idx) => ({
          name: `Session ${idx + 1}`,
          score: item.score,
          role: item.role,
          date: new Date(item.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        }));
      } else {
        scoreTrend = [
          { name: 'Start', score: 0, date: 'Baseline' }
        ];
      }

      return res.json({
        totalInterviews,
        averageScore: user.averageScore || 0,
        skills: user.skills || [],
        radarMetrics: {
          technical: technicalAvg || 0,
          communication: communicationAvg || 0,
          confidence: confidenceAvg || 0,
          problemSolving: problemSolvingAvg || 0
        },
        scoreTrend
      });
    }

    const completedInterviews = await Interview.find({ 
      userId: req.user._id, 
      status: 'completed' 
    }).sort({ createdAt: 1 });

    const totalInterviews = completedInterviews.length;

    // Averages across domains
    let technicalAvg = 0;
    let communicationAvg = 0;
    let confidenceAvg = 0;
    let problemSolvingAvg = 0;
    let scoreTrend = [];

    if (totalInterviews > 0) {
      const interviewIds = completedInterviews.map(i => i._id);
      const reports = await Report.find({ interviewId: { $in: interviewIds } });
      
      const techSum = reports.reduce((sum, r) => sum + r.technicalScore, 0);
      const commSum = reports.reduce((sum, r) => sum + r.communicationScore, 0);
      const confSum = reports.reduce((sum, r) => sum + r.confidenceScore, 0);
      const probSum = reports.reduce((sum, r) => sum + r.problemSolvingScore, 0);

      technicalAvg = Math.round(techSum / totalInterviews);
      communicationAvg = Math.round(commSum / totalInterviews);
      confidenceAvg = Math.round(confSum / totalInterviews);
      problemSolvingAvg = Math.round(probSum / totalInterviews);

      // Score trends
      scoreTrend = completedInterviews.map((item, idx) => ({
        name: `Session ${idx + 1}`,
        score: item.score,
        role: item.role,
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
    } else {
      // Return default onboarding data so Recharts doesn't render empty
      scoreTrend = [
        { name: 'Start', score: 0, date: 'Baseline' }
      ];
    }

    res.json({
      totalInterviews,
      averageScore: req.user.averageScore || 0,
      skills: req.user.skills || [],
      radarMetrics: {
        technical: technicalAvg || 0,
        communication: communicationAvg || 0,
        confidence: confidenceAvg || 0,
        problemSolving: problemSolvingAvg || 0
      },
      scoreTrend
    });
  } catch (error) {
    next(error);
  }
};
