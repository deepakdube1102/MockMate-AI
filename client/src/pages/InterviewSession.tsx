import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import moxMascot from '../assets/Owl_with_laptop.png';
import moxThinking from '../assets/Loading_Illustration.png';
import { 
  ArrowLeft,
  ArrowRight,
  Clock, 
  AlertCircle,
  Send,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  RotateCcw,
  RotateCw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Eye,
  EyeOff,
  Bookmark,
  Play,
  Check,
  Briefcase
} from 'lucide-react';

export const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState('Frontend Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');

  // Sidebar Visibility Toggle
  const [showCoach, setShowCoach] = useState(true);
  
  // Timer state - Countdown from stored duration or default 60 minutes
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [totalSeconds, setTotalSeconds] = useState(60 * 60);
  const timerRef = useRef<any>(null);

  // Track simple Typing Time in active question
  const [typingSeconds, setTypingSeconds] = useState(0);
  const typingTimerRef = useRef<any>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;
      try {
        const interview = await api.interviews.getById(id);
        
        if (interview.status === 'completed') {
          return navigate(`/interviews/${id}/report`);
        }

        setRole(interview.role || 'Frontend Developer');
        setInterviewType(interview.interviewType || 'Technical');
        setQuestions(interview.questions);
        setAnswers(new Array(interview.questions.length).fill(''));

        // Parse stored duration (e.g. "60 Minutes")
        const storedDuration = localStorage.getItem('profile-int-dur') || '60 Minutes';
        const parsedMinutes = parseInt(storedDuration) || 60;
        const computedSeconds = parsedMinutes * 60;
        setTotalSeconds(computedSeconds);
        setTimeLeft(computedSeconds);
      } catch (err: any) {
        console.error('Failed to load interview session:', err);
        setError('Failed to load active mock session.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  // Global Countdown Timer
  useEffect(() => {
    if (!loading && !evaluating && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Automatically submit when time is up
            handleSubmitInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, evaluating, questions]);

  // Typing elapsed timer inside the response console
  useEffect(() => {
    if (!loading && !evaluating) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      
      setTypingSeconds(0);
      typingTimerRef.current = setInterval(() => {
        setTypingSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [activeIndex, loading, evaluating]);

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = [...answers];
    updatedAnswers[activeIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);

    if (activeIndex < questions.length - 1) {
      setActiveIndex(activeIndex + 1);
      setCurrentAnswer(answers[activeIndex + 1] || '');
    }
  };

  const handlePrev = () => {
    // Save current answer
    const updatedAnswers = [...answers];
    updatedAnswers[activeIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);

    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setCurrentAnswer(answers[activeIndex - 1] || '');
    }
  };

  const handleSkip = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[activeIndex] = ''; // skip leaves blank
    setAnswers(updatedAnswers);

    if (activeIndex < questions.length - 1) {
      setActiveIndex(activeIndex + 1);
      setCurrentAnswer(answers[activeIndex + 1] || '');
    }
  };

  const handleSaveDraft = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[activeIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);
    alert('Progress saved to draft successfully!');
  };

  const handleSubmitInterview = async () => {
    if (!id) return;
    
    // Save final answer
    const finalAnswers = [...answers];
    finalAnswers[activeIndex] = currentAnswer.trim();
    setAnswers(finalAnswers);

    const unansweredCount = finalAnswers.filter(a => !a).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have left ${unansweredCount} questions blank. Are you sure you want to submit for grading?`
      );
      if (!confirmSubmit) return;
    }

    setError('');
    setEvaluating(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    try {
      await api.interviews.submit(id, finalAnswers);
      navigate(`/interviews/${id}/report`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit answers for evaluation.');
      setEvaluating(false);
    }
  };

  // Time format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Real-time Coach Metrics derived dynamically from typed answer
  const coachMetrics = useMemo(() => {
    const text = currentAnswer.trim();
    
    // 1. STAR checkpoints based on word length / parameters
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasSituation = words >= 8;
    const hasTask = words >= 25;
    const hasAction = words >= 55;
    const hasResult = words >= 90;
    const checkedCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;

    // 2. Dynamic Keyword Tag detections
    const query = text.toLowerCase();
    const hasProject = query.includes('project') || query.includes('work') || query.includes('build');
    const hasProblemSolving = query.includes('solve') || query.includes('roadblock') || query.includes('challenge') || query.includes('issue') || query.includes('bug');
    const hasTeam = query.includes('team') || query.includes('collaborate') || query.includes('colleague') || query.includes('member') || query.includes('we');
    const detectedKeywordsCount = [hasProject, hasProblemSolving, hasTeam].filter(Boolean).length;

    // 3. Dynamic radial score percentage
    const baseScore = checkedCount * 20 + detectedKeywordsCount * 5;
    const scorePercent = text ? Math.min(baseScore + 5, 100) : 0;

    // 4. Dynamic feedback tags
    let scoreFeedback = 'Start typing...';
    if (scorePercent > 0 && scorePercent <= 30) scoreFeedback = 'Good start! Keep going.';
    if (scorePercent > 30 && scorePercent <= 65) scoreFeedback = 'Structuring nicely!';
    if (scorePercent > 65 && scorePercent <= 85) scoreFeedback = 'Excellent details added.';
    if (scorePercent > 85) scoreFeedback = 'Fully cohesive structure!';

    return {
      hasSituation,
      hasTask,
      hasAction,
      hasResult,
      checkedCount,
      hasProject,
      hasProblemSolving,
      hasTeam,
      detectedKeywordsCount,
      scorePercent,
      scoreFeedback,
      words
    };
  }, [currentAnswer]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
        <img src={moxMascot} alt="Mox Mascot" className="w-24 h-auto animate-pulse mb-4" />
        <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin mb-2"></div>
        <p className="text-slate-400 font-medium text-sm">Drafting custom interview papers...</p>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px] text-center max-w-lg mx-auto w-full">
        <div className="relative mb-6">
          <img src={moxThinking} alt="Mox Thinking" className="w-32 h-auto mx-auto relative z-10 animate-bounce" />
          <div className="absolute inset-x-0 bottom-0 bg-brand-500/10 rounded-full blur-xl h-8 w-24 mx-auto -z-0"></div>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Analyzing Performance</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
          Mox is scanning your answers, grading technical syntax, evaluating communication scores, and crafting targeted growth maps. This typically takes 5–8 seconds...
        </p>
        <div className="w-full bg-slate-200 border border-slate-300 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full w-[80%] rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="font-bold text-slate-900 text-lg">No Questions Generated</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">Failed to generate or fetch mock questions for this session.</p>
        <button onClick={() => navigate('/studio')} className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs">
          Return to Studio
        </button>
      </div>
    );
  }

  const activeQuestion = questions[activeIndex];
  const progressPercent = Math.round(((activeIndex + 1) / questions.length) * 100);

  // ─── Mobile View ─────────────────────────────────────────────────────────────
  const renderMobileView = () => (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] text-left">
      {/* Sticky Header */}
      <header className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => { if (window.confirm('Exit interview? Progress will be lost.')) navigate('/dashboard'); }}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-black text-slate-900">Interview Session</span>
        <button
          type="button"
          onClick={() => alert('Support ticket compiled. Mox notified!')}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-full px-2.5 py-1 hover:bg-slate-50 cursor-pointer"
        >
          <AlertCircle className="w-3 h-3 text-slate-400" />
          Report Issue
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-3 space-y-3">

        {/* Role + Timer Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-black text-slate-900 leading-snug">{role} Interview</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                {interviewType} Round
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-9 h-9 -rotate-90">
                  <circle cx="18" cy="18" r="15" className="stroke-slate-100 fill-none" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15"
                    className="stroke-[#4f3df5] fill-none transition-all duration-1000"
                    strokeWidth="2.5"
                    strokeDasharray={2 * Math.PI * 15}
                    strokeDashoffset={2 * Math.PI * 15 * (1 - timeLeft / totalSeconds)}
                  />
                </svg>
                <Clock className="absolute w-3.5 h-3.5 text-[#4f3df5] animate-pulse" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 leading-none">{formatTime(timeLeft)}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Time Remaining</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { if (window.confirm('Exit interview?')) navigate('/dashboard'); }}
              className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2 rounded-xl text-[10px] font-black text-slate-600 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Exit Interview
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Progress */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Question Progress</span>
            <span className="text-[10px] font-black text-violet-600">{activeIndex + 1} of {questions.length} ({progressPercent}%)</span>
          </div>
          <div className="flex gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx <= activeIndex ? 'bg-violet-600' : 'bg-slate-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            {/* Question text */}
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-600">Interviewer Question</span>
              <p className="text-sm font-black text-slate-900 leading-snug mt-2">{activeQuestion}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-violet-500" />
                  <span className="text-[10px] font-bold text-slate-500">Est. Answer Time: <span className="text-slate-800">2–3 mins</span></span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full">
                  <Briefcase className="w-3 h-3 text-violet-500" />
                  <span className="text-[10px] font-bold text-slate-500">Category: <span className="text-slate-800">{interviewType}</span></span>
                </div>
              </div>
            </div>
            {/* Mox avatar */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                <img src={moxMascot} alt="Mox" className="w-full h-auto object-contain" />
              </div>
              <p className="text-xs font-black text-slate-900 mt-1.5 leading-none">Mox</p>
              <p className="text-[9px] text-slate-400 font-bold">AI Interviewer</p>
              <span className="mt-1.5 px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 text-[8px] font-black uppercase tracking-wider rounded-full text-center leading-tight">
                AI COACH MODE
              </span>
            </div>
          </div>
        </div>

        {/* Answer Card */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Toolbar Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Your Answer</span>
            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg px-1 py-0.5">
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><Bold className="w-3 h-3" /></button>
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><Italic className="w-3 h-3" /></button>
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><Underline className="w-3 h-3" /></button>
              <span className="w-px h-3 bg-slate-200 mx-0.5" />
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><List className="w-3 h-3" /></button>
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><ListOrdered className="w-3 h-3" /></button>
              <span className="w-px h-3 bg-slate-200 mx-0.5" />
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><RotateCcw className="w-3 h-3" /></button>
              <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-700"><RotateCw className="w-3 h-3" /></button>
            </div>
          </div>
          {/* Textarea */}
          <div className="p-4">
            <textarea
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Start typing your answer here..."
              className="w-full bg-transparent outline-none text-slate-800 text-sm font-medium leading-relaxed placeholder-slate-400 resize-none min-h-[100px]"
            />
            <p className="text-[10px] text-slate-400 font-medium mt-2">
              Tip: Structure your response with background details, specific tools used, metrics and overall result
            </p>
          </div>
        </div>

        {/* AI Interview Coach */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Coach Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">AI Interview Coach</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCoach(!showCoach)}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50 cursor-pointer"
            >
              <EyeOff className="w-3 h-3" />
              Hide
            </button>
          </div>

          {showCoach && (
            <div className="px-4 py-3 space-y-4">
              {/* STAR Framework */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">STAR Framework</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black text-violet-600">{coachMetrics.checkedCount}/4</span>
                </div>
                <ul className="space-y-2">
                  {[
                    { label: 'Situation', checked: coachMetrics.hasSituation },
                    { label: 'Task', checked: coachMetrics.hasTask },
                    { label: 'Action', checked: coachMetrics.hasAction },
                    { label: 'Result', checked: coachMetrics.hasResult }
                  ].map(item => (
                    <li key={item.label} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{item.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${item.checked ? 'bg-green-500 border-transparent text-white' : 'border-slate-200'}`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords Detected */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Keywords Detected</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black text-violet-600">{coachMetrics.detectedKeywordsCount}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {[
                    { tag: 'Project', active: coachMetrics.hasProject },
                    { tag: 'Problem Solving', active: coachMetrics.hasProblemSolving },
                    { tag: 'Team', active: coachMetrics.hasTeam }
                  ].map(item => (
                    <span
                      key={item.tag}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all duration-300 ${
                        item.active
                          ? 'bg-violet-50 border-violet-200 text-violet-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {item.tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold">Add more relevant keywords to improve your answer.</p>
              </div>

              {/* Response Quality */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Response Quality</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="26" className="stroke-slate-100 fill-none" strokeWidth="5" />
                      <circle
                        cx="32" cy="32" r="26"
                        className="stroke-[#4f3df5] fill-none transition-all duration-500"
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - coachMetrics.scorePercent / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black text-slate-900">{coachMetrics.scorePercent}%</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{coachMetrics.scoreFeedback}</span>
                </div>
              </div>

              {/* Tips */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tips for a Strong Answer</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </div>
                <ul className="space-y-1.5">
                  {['Be specific with examples', 'Include numbers and metrics', 'Highlight your impact', 'Use the STAR framework'].map(tip => (
                    <li key={tip} className="flex items-start gap-1.5 text-[10.5px] font-bold text-slate-500">
                      <Check className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0 stroke-[2.5]" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="flex-1 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold text-xs shadow-sm flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          {activeIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-4 pt-2 bg-white border-t border-slate-100 z-40">
        <button
          onClick={handleSubmitInterview}
          className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Submit Answer
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block flex-1 px-8 py-6 w-full max-w-none space-y-6 animate-fade-in text-slate-800 relative z-10">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* TOP CONTROL HEADER ROW */}
        <div className="bg-white rounded-3xl border border-slate-200/80 px-6 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { if (window.confirm('Are you sure you want to exit? Your progress in this session will be lost.')) { navigate('/dashboard'); } }}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 shadow-sm transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
              <span>Exit Interview</span>
            </button>
            <span className="text-[#cbd5e1] text-xs font-bold leading-none">/</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm font-black text-slate-900 leading-none">{role} Interview</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-[#4f3df5] text-[10px] font-black tracking-wider uppercase border border-brand-100/60 leading-none">{interviewType} Round</span>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            <button onClick={() => alert('Support ticket compiled. Mox notified!')} className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 shadow-sm transition-colors">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Report Issue</span>
            </button>
            <span className="text-[#cbd5e1] text-xs font-bold leading-none">/</span>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <svg className="w-9 h-9 -rotate-90">
                  <circle cx="18" cy="18" r="15" className="stroke-slate-100 fill-none" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15" className="stroke-[#4f3df5] fill-none transition-all duration-1000" strokeWidth="2.5" strokeDasharray={2 * Math.PI * 15} strokeDashoffset={2 * Math.PI * 15 * (1 - timeLeft / totalSeconds)} />
                </svg>
                <Clock className="absolute w-3.5 h-3.5 text-[#4f3df5] animate-pulse" />
              </div>
              <div className="text-left leading-none">
                <div className="text-sm font-black text-slate-900 leading-none">{formatTime(timeLeft)}</div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Time Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* TWO COLUMN ARENA GRID */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 flex flex-col space-y-6 w-full">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
                <span>Question Progress</span>
                <span className="text-[#4f3df5]">Question {activeIndex + 1} of {questions.length} ({progressPercent}%)</span>
              </div>
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx <= activeIndex ? 'bg-[#4f3df5]' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
              <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 rounded-full border-4 border-[#4f3df5]/10 p-1 bg-slate-50 overflow-hidden shadow-sm flex items-center justify-center mb-3">
                  <img src={moxMascot} alt="Mox Mascot" className="w-full h-auto object-contain bg-slate-50" />
                </div>
                <div className="font-extrabold text-slate-900 text-sm leading-none">Mox</div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider block">AI Interviewer</span>
                <span className="px-2 py-0.5 mt-3 rounded-full bg-[#4f3df5]/5 text-[#4f3df5] text-[9px] font-black tracking-wider uppercase border border-[#4f3df5]/10 leading-none">AI Coach Mode</span>
              </div>
              <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4f3df5]">Interviewer Question</span>
                  <p className="text-base md:text-lg text-slate-900 font-bold leading-relaxed mt-2">{activeQuestion}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 mt-4">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
                    <Clock className="w-3 h-3 text-[#4f3df5]" />
                    <span>Est. Answer Time: <span className="text-slate-800 font-bold">2-3 mins</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
                    <Briefcase className="w-3 h-3 text-[#4f3df5]" />
                    <span>Category: <span className="text-slate-800 font-bold">{interviewType}</span></span>
                  </div>
                </div>
              </div>
            </div>

            <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-200/80 shadow-sm flex flex-col">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0 select-none">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Your Answer</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-1.5 py-0.5 shadow-sm">
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                  <span className="w-[1px] h-3 bg-slate-200 mx-0.5"></span>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Bulleted List"><List className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
                  <span className="w-[1px] h-3 bg-slate-200 mx-0.5"></span>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Undo"><RotateCcw className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-700" title="Redo"><RotateCw className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="p-6 relative">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Start typing your answer here... (Tip: Structure your response with background details, specific tools used, metrics and overall result)"
                  className="w-full bg-slate-50/20 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-2xl p-4 outline-none text-slate-800 text-sm md:text-base font-semibold leading-relaxed placeholder-slate-400 transition-all resize-y min-h-[220px]"
                />
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 select-none">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Word Count: <span className="text-slate-800 font-black">{coachMetrics.words} words</span></span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">Typing Time: {formatTime(typingSeconds)}</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-[10px] text-green-600 font-black uppercase tracking-wider leading-none">Live</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="flex flex-wrap items-center justify-between gap-4 select-none">
              <button onClick={handlePrev} disabled={activeIndex === 0} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Previous Question</span>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleSaveDraft} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save Draft</span>
                </button>
                <button onClick={handleSkip} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span>Skip Question</span>
                </button>
              </div>
              {activeIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="px-6 py-3 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white font-black text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5">
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a8a1ff]" />
                </button>
              ) : (
                <button onClick={handleSubmitInterview} className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 group">
                  <Send className="w-3.5 h-3.5 text-brand-300" />
                  <span>Submit Interview</span>
                </button>
              )}
            </div>
          </div>

          <div className={`w-full lg:w-[320px] transition-all duration-300 flex-shrink-0 select-none ${showCoach ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4f3df5]" />
                  <h3 className="font-extrabold text-slate-900 text-sm">AI Interview Coach</h3>
                </div>
                <button type="button" onClick={() => setShowCoach(false)} className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1 transition-colors">
                  <EyeOff className="w-3 h-3 text-slate-400" />
                  <span>Hide</span>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1"><span>STAR Framework</span><HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" /></div>
                  <span className="text-[#4f3df5] font-black">{coachMetrics.checkedCount}/4</span>
                </div>
                <ul className="space-y-2">
                  {[{label:'Situation',checked:coachMetrics.hasSituation},{label:'Task',checked:coachMetrics.hasTask},{label:'Action',checked:coachMetrics.hasAction},{label:'Result',checked:coachMetrics.hasResult}].map(item => (
                    <li key={item.label} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{item.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${item.checked ? 'bg-green-500 border-transparent text-white' : 'border-slate-200 text-transparent'}`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1"><span>Keywords Detected</span><HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" /></div>
                  <span className="text-[#4f3df5] font-black">{coachMetrics.detectedKeywordsCount}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[{tag:'Project',active:coachMetrics.hasProject},{tag:'Problem Solving',active:coachMetrics.hasProblemSolving},{tag:'Team',active:coachMetrics.hasTeam}].map(item => (
                    <span key={item.tag} className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all duration-300 ${item.active ? 'bg-[#4f3df5]/10 border-[#4f3df5]/30 text-[#4f3df5] font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-400 font-bold'}`}>{item.tag}</span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1 block">Add more relevant keywords to improve your answer.</p>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100 text-center">
                <div className="flex items-center justify-start text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  <div className="flex items-center gap-1"><span>Response Quality</span><HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" /></div>
                </div>
                <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-slate-100 fill-none" strokeWidth="5.5" />
                    <circle cx="48" cy="48" r="40" className="stroke-[#4f3df5] fill-none transition-all duration-500" strokeWidth="5.5" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - coachMetrics.scorePercent / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center"><span className="text-lg font-black text-slate-900 leading-none">{coachMetrics.scorePercent}%</span></div>
                </div>
                <span className="text-[11px] text-slate-600 font-bold text-center block leading-none">{coachMetrics.scoreFeedback}</span>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-start text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  <div className="flex items-center gap-1"><span>Tips for a Strong Answer</span><HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" /></div>
                </div>
                <ul className="space-y-2">
                  {['Be specific with examples','Include numbers and metrics','Highlight your impact','Use the STAR framework'].map(tip => (
                    <li key={tip} className="flex items-start gap-1.5 text-[10.5px] font-bold text-slate-500">
                      <Check className="w-3.5 h-3.5 text-[#4f3df5] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {!showCoach && (
            <button onClick={() => setShowCoach(true)} className="fixed right-6 bottom-6 z-40 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white p-3 rounded-full shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center justify-center animate-bounce select-none cursor-pointer" title="Show AI Coach">
              <Eye className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden min-h-screen w-full bg-[#f8fafc]">
        {renderMobileView()}
      </div>
    </>
  );
};
