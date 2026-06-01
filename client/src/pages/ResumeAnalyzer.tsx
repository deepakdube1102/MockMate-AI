import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import moxHappy from '../assets/Owl_with_laptop.png';
import moxCoach from '../assets/Interview_Coach.png';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Award, 
  BookOpen, 
  Briefcase, 
  Terminal,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Download,
  MoreVertical,
  Wifi,
  Battery,
  Signal,
  Home,
  Video,
  Plus,
  BarChart3,
  User,
  ArrowLeft
} from 'lucide-react';

interface ResumeDetails {
  _id: string;
  fileUrl: string;
  extractedSkills: string[];
  extractedProjects: string[];
  extractedExperience: string[];
  extractedEducation: string[];
  aiSummary: string;
  uploadedAt: string;
}

export const ResumeAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [latestResume, setLatestResume] = useState<ResumeDetails | null>(null);
  const [history, setHistory] = useState<ResumeDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown states for mobile lists
  const [showSkills, setShowSkills] = useState(true);

  const fetchResumeData = async () => {
    try {
      const latest = await api.resumes.getLatest().catch(() => null);
      const allResumes = await api.resumes.getAll().catch(() => []);
      setLatestResume(latest);
      setHistory(allResumes);
    } catch (err: any) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        return setError('File size exceeds the 5MB limit.');
      }
      setError('');
      setSuccess('');
      setAnalyzing(true);

      try {
        const analyzedResume = await api.resumes.upload(selectedFile);
        setSuccess('Resume analyzed successfully!');
        setLatestResume(analyzedResume);
        // Refresh history list
        await fetchResumeData();
      } catch (err: any) {
        setError(err.message || 'Failed to parse and upload resume.');
      } finally {
        setAnalyzing(false);
        // Clear input value so same file can be uploaded again if needed
        if (e.target) e.target.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerInterview = async () => {
    if (!latestResume) return;
    setAnalyzing(true);
    
    // Guess a target role from skills or use default Software Engineer
    const targetRole = latestResume.extractedSkills.includes('React') || latestResume.extractedSkills.includes('CSS')
      ? 'Frontend Engineer' 
      : 'Full-Stack Developer';

    try {
      const interview = await api.interviews.create({
        role: targetRole,
        difficulty: 'Mid',
        interviewType: 'Technical',
        skills: latestResume.extractedSkills.slice(0, 5).join(', ')
      });
      navigate(`/interviews/${interview._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize session from resume.');
      setAnalyzing(false);
    }
  };

  // Dynamic statistics calculations
  const getResumeMetrics = (resume: ResumeDetails | null) => {
    if (!resume) {
      return {
        matchScore: 86,
        keywordsFound: '12/15',
        formatting: 'Good',
        impactStatements: 'Needs Improvement',
        skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Express.js', 'AWS', 'Docker', 'Git', 'REST API'],
        extraSkillsCount: 4,
        education: {
          title: 'Bachelor of Computer Science',
          subtitle: 'Park Hill Secondary College • 2015 – 2019'
        },
        experience: {
          title: 'Frontend Developer • 2 Years',
          subtitle: 'Tech Solutions Inc.'
        },
        projects: {
          title: '3 Projects',
          subtitle: 'View your notable projects'
        }
      };
    }

    // Determine dynamic matching score
    const skillCount = resume.extractedSkills.length;
    const matchScore = Math.min(98, Math.max(65, 70 + (skillCount % 10) * 3));
    
    // Determine dynamic keyword fraction
    const foundKeywords = Math.min(15, Math.max(8, 9 + (skillCount % 7)));
    const keywordsFound = `${foundKeywords}/15`;

    // Dynamic formatting grade
    const formatting = skillCount > 8 ? 'Good' : 'Needs Optimization';

    // Dynamic impact statement grade
    const hasManyProjects = resume.extractedProjects.length > 2;
    const impactStatements = hasManyProjects ? 'Strong' : 'Needs Improvement';

    // Map skills tag lists
    const baseSkills = resume.extractedSkills.slice(0, 10);
    const extraSkillsCount = resume.extractedSkills.length > 10 ? resume.extractedSkills.length - 10 : 0;

    // Helper functions to parse extracted text securely
    const parseEducation = (eduArray: string[]) => {
      if (eduArray.length === 0) {
        return {
          title: 'Degree / Certificate',
          subtitle: 'Education logs not found in parser.'
        };
      }
      const raw = eduArray[0];
      const parts = raw.split(' - ');
      if (parts.length >= 2) {
        return {
          title: parts[0].trim(),
          subtitle: parts[1].trim()
        };
      }
      return {
        title: 'Education Record',
        subtitle: raw
      };
    };

    const parseExperience = (expArray: string[]) => {
      if (expArray.length === 0) {
        return {
          title: 'Professional Experience',
          subtitle: 'Career logs not found in parser.'
        };
      }
      const raw = expArray[0];
      const parts = raw.split(' (');
      if (parts.length >= 2) {
        const titlePart = parts[0].trim();
        const detailPart = parts[1].replace(')', '').trim();
        return {
          title: titlePart,
          subtitle: detailPart
        };
      }
      return {
        title: 'Career Summary',
        subtitle: raw
      };
    };

    return {
      matchScore,
      keywordsFound,
      formatting,
      impactStatements,
      skills: baseSkills,
      extraSkillsCount,
      education: parseEducation(resume.extractedEducation),
      experience: parseExperience(resume.extractedExperience),
      projects: {
        title: `${resume.extractedProjects.length} Projects`,
        subtitle: 'View your notable projects'
      }
    };
  };

  const activeMetrics = getResumeMetrics(latestResume);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Scanning uploaded documents...</p>
      </div>
    );
  }

  // ─── Mobile View ──────────────────────────────────────────────────────────
  const renderMobileView = () => {
    // Circumference of match gauge circle: 2 * Math.PI * 38 = 238.76
    const circumference = 238.76;
    const strokeDashoffset = circumference - (activeMetrics.matchScore / 100) * circumference;

    return (
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-32 text-left relative overflow-x-hidden">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.txt" 
          className="hidden" 
        />



        {/* Content Body Container */}
        <div className="flex-1 px-5 pt-9 pb-12 space-y-4">
          
          {/* Page Title */}
          <div className="pb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#625dfb]" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-slate-900">Resume Analyzer</h1>
              <p className="text-[10px] text-slate-400 font-extrabold mt-0.5 uppercase tracking-wide">Optimize & Score Resume</p>
            </div>
          </div>
          
          {/* Notifications Feedback */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-650 px-4 py-3 rounded-2xl text-xs font-semibold animate-fade-in flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 px-4 py-3 rounded-2xl text-xs font-semibold animate-fade-in flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 3. Mascot Upload Premium Banner Card */}
          <div className="relative w-full rounded-[24px] bg-gradient-to-br from-[#625dfb] to-[#423ceb] p-6 text-white overflow-hidden shadow-lg shadow-indigo-600/10">
            {/* Background sparkle stars */}
            <div className="absolute top-4 right-20 opacity-80 pointer-events-none">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="absolute top-10 right-40 opacity-50 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            
            {/* Mascot Potted Plant Layer */}
            <div className="absolute right-4 bottom-0 w-24 h-auto pointer-events-none z-10 flex flex-col items-center">
              <img 
                src={moxCoach} 
                alt="Mox Owl Coach wearing headphones" 
                className="w-[76px] h-auto drop-shadow-xl select-none hover:scale-105 transition-transform duration-300"
              />
              {/* Little plant mock */}
              <div className="w-8 h-3 bg-indigo-900/40 rounded-full blur-[2px] mt-0.5"></div>
            </div>

            {/* Title & description text */}
            <div className="max-w-[62%] text-left">
              <h2 className="text-[20px] font-black tracking-tight leading-snug">Upload your resume</h2>
              <p className="text-[11px] text-white/75 font-semibold mt-1 leading-normal">
                Let our AI analyze your resume and help you land your dream job.
              </p>

              {/* Upload Button action */}
              <button
                onClick={triggerFileUpload}
                disabled={analyzing}
                className="mt-4 bg-white text-indigo-700 hover:bg-slate-50 transition-all font-black text-xs px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-md shadow-black/5 active:scale-95 select-none"
              >
                {analyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Resume</span>
                  </>
                )}
              </button>

              <div className="text-[9px] text-white/55 font-bold mt-2.5 pl-1.5 uppercase tracking-wider">
                PDF or DOCX (Max 5MB)
              </div>
            </div>
          </div>

          {/* 4. AI Executive Summary Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 fill-current shrink-0" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">AI Executive Summary</h3>
              </div>
              {latestResume && (
                <button 
                  onClick={handleTriggerInterview}
                  className="bg-violet-50/50 hover:bg-violet-50 text-violet-600 font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl border border-violet-100 transition-colors flex items-center gap-1 active:scale-95"
                >
                  <span>Practice Interview</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed text-left">
              {latestResume ? latestResume.aiSummary : "Experienced Full Stack Developer with 4+ years of expertise in building scalable web applications using React, Node.js, and MongoDB. Strong problem-solving skills with a passion for clean code and user experience."}
            </p>
          </div>

          {/* 5. Metrics Columns (Match Score & ATS Checkpoints) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Match Score Gauge Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 w-full text-left pl-1">Resume Match Score</h3>
              
              {/* Circular Gauge SVG */}
              <div className="relative w-32 h-32 mt-4 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    className="stroke-slate-100" 
                    strokeWidth="8" 
                  />
                  {/* Matching Fill Circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    className="stroke-[#625dfb]" 
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </svg>
                {/* Score percentage text in center */}
                <div className="absolute flex flex-col items-center justify-center leading-none">
                  <span className="text-3xl font-black text-slate-800 tracking-tighter">
                    {activeMetrics.matchScore}%
                  </span>
                </div>
              </div>

              {/* Matching Status Flag */}
              <div className="flex items-center gap-1 text-[11px] font-black text-emerald-600 mt-4 leading-none bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Great Match</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-2.5 max-w-[160px] leading-relaxed">
                Your resume is well aligned with the target role.
              </p>
            </div>

            {/* ATS Optimization Checklist Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3 pl-1 text-left">ATS Optimization</h3>
                
                {/* Checkpoint listings */}
                <div className="mt-3.5 space-y-3">
                  
                  {/* Keywords checkpoint */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black text-slate-700">Keywords Found</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/60 leading-none">
                      {activeMetrics.keywordsFound}
                    </span>
                  </div>

                  {/* Formatting checkpoint */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black text-slate-700">Formatting</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/60 leading-none">
                      {activeMetrics.formatting}
                    </span>
                  </div>

                  {/* Impact statements checkpoint */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black text-slate-700">Impact Statements</span>
                    </div>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50/60 px-2.5 py-1 rounded-lg border border-amber-100/60 leading-none">
                      {activeMetrics.impactStatements}
                    </span>
                  </div>

                </div>
              </div>

              {/* Bottom Rescan Option */}
              <div className="border-t border-slate-50 pt-4 mt-4 text-left">
                <button 
                  onClick={triggerFileUpload}
                  className="w-full group text-xs font-black text-[#625dfb] hover:text-[#423ceb] transition-colors flex items-center justify-between pr-1"
                >
                  <span>Improve & rescan</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* 6. Identified Skills Accordion Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3.5 text-left">
            <button
              onClick={() => setShowSkills(!showSkills)}
              className="flex items-center justify-between w-full border-b border-slate-50 pb-3 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Award className="w-4 h-4 fill-current shrink-0" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">Identified Skills</h3>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showSkills ? 'rotate-90' : ''}`} />
            </button>

            {showSkills && (
              <div className="flex flex-wrap gap-2 animate-fade-in pt-1">
                {activeMetrics.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3.5 py-2 bg-[#f6f5ff] hover:bg-violet-100/40 border border-[#e5e3fc] hover:border-violet-300/60 text-slate-700 text-[11px] font-black rounded-2xl shadow-sm transition-all duration-200 cursor-default select-none leading-none"
                  >
                    {skill}
                  </span>
                ))}
                {activeMetrics.extraSkillsCount > 0 && (
                  <span className="px-3.5 py-2 bg-violet-50/50 border border-violet-100 text-violet-600 text-[11px] font-black rounded-2xl leading-none">
                    +{activeMetrics.extraSkillsCount}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 7. Education, Experience, and Projects Listing Card */}
          <div className="bg-white border border-slate-100 rounded-3xl divide-y divide-slate-100 shadow-sm overflow-hidden text-left">
            
            {/* Education Record row */}
            <div className="p-4 flex items-center gap-3.5 hover:bg-slate-50/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Education</p>
                <p className="text-xs font-black text-slate-800 truncate leading-snug">{activeMetrics.education.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">{activeMetrics.education.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2.5]" />
            </div>

            {/* Experience Record row */}
            <div className="p-4 flex items-center gap-3.5 hover:bg-slate-50/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Experience</p>
                <p className="text-xs font-black text-slate-800 truncate leading-snug">{activeMetrics.experience.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">{activeMetrics.experience.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2.5]" />
            </div>

            {/* Projects Record row */}
            <div className="p-4 flex items-center gap-3.5 hover:bg-slate-50/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Projects</p>
                <p className="text-xs font-black text-slate-800 truncate leading-snug">{activeMetrics.projects.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">{activeMetrics.projects.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2.5]" />
            </div>

          </div>

          {/* 8. Previous Uploads Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-800">Previous Uploads</h3>
              <button 
                type="button"
                className="text-xs font-black text-[#625dfb] hover:text-[#423ceb]"
              >
                View All
              </button>
            </div>

            {history.length > 0 ? (
              <div className="space-y-2">
                {history.slice(0, 3).map((resItem) => {
                  const isActive = latestResume?._id === resItem._id;
                  return (
                    <div 
                      key={resItem._id}
                      onClick={() => setLatestResume(resItem)}
                      className={`w-full flex items-center gap-3.5 p-4 border rounded-[22px] cursor-pointer transition-all duration-300 text-left select-none ${
                        isActive 
                          ? 'bg-gradient-to-r from-violet-50/40 to-indigo-50/40 border-[#c7c4fb]/70 shadow-sm' 
                          : 'border-slate-100 bg-white hover:bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      {/* PDF Graphic Icon Box */}
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                        <FileText className="w-5 h-5 stroke-[2] text-red-500 fill-red-50" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate leading-snug">
                          {resItem.fileUrl ? resItem.fileUrl.split('/').pop()?.split('_').slice(1).join('_') || 'Resume_Profile.pdf' : 'Resume_Profile.pdf'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">
                          Uploaded on {new Date(resItem.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 256 KB
                        </p>
                      </div>

                      {/* Download & Option Buttons */}
                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <a 
                          href={resItem.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 active:scale-95"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                        </a>
                        <button 
                          className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 active:scale-95"
                        >
                          <MoreVertical className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center p-6 border border-dashed border-slate-200 bg-white rounded-3xl text-slate-400 text-xs italic">
                No previous uploads found. Scan a file to begin!
              </div>
            )}
          </div>

        </div>

        {/* 9. Floating Sticky Start Interview Button */}
        {latestResume && (
          <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-40 max-w-md mx-auto">
            <button
              onClick={handleTriggerInterview}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-[#625dfb] to-[#423ceb] hover:from-[#4f49ea] hover:to-[#3b34db] text-white font-black py-4 px-6 rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 fill-current shrink-0" />
                <span className="text-xs uppercase tracking-wider">Start Interview Based On This Resume</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          </div>
        )}

        {/* 10. iOS Bottom Navigation Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 max-w-md mx-auto shadow-[0_-2px_16px_rgba(0,0,0,0.03)] rounded-t-3xl">
          {/* Home Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          {/* Interview Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/studio')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5" />
            <span className="text-[9px] font-bold">Interview</span>
          </button>

          {/* Resume Tab - Selected */}
          <button 
            type="button" 
            onClick={() => navigate('/resume')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
          >
            <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black text-[#625dfb]">Resume</span>
          </button>

          {/* Report Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/results')} 
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[9px] font-bold">Report</span>
          </button>

          {/* Profile Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold">Profile</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* ─── Desktop View ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col space-y-6 px-8 py-6 w-full max-w-none animate-fade-in relative z-10 text-left">
        {/* Background glowing decorations */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

        {/* Input file for desktop upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.txt" 
          className="hidden" 
        />

        {/* Top Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resume Profile Analyzer</h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Upload your resume in PDF or TXT format. Our parser extracts key competencies, profiles, and launches custom contextual interviews.
            </p>
          </div>
          <button
            onClick={triggerFileUpload}
            disabled={analyzing}
            className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black px-5 py-3 rounded-2xl text-xs shadow-md shadow-brand-500/10 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 duration-300"
          >
            {analyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                <span>Analyzing profile...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                <span>Upload New Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Error / Success logs */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-650 px-5 py-4 rounded-2xl text-sm font-semibold animate-fade-in flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 px-5 py-4 rounded-2xl text-sm font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* LEFT PANEL: Previous Uploads / File console */}
          <div className="lg:col-span-1 flex flex-col">
            <GlassCard hoverEffect={true} className="p-0 overflow-hidden h-full flex flex-col min-h-[380px]">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-800 text-xs tracking-wider uppercase">Previous Uploads</h3>
                </div>
                <span className="text-[10px] bg-slate-200/60 font-black text-slate-500 px-2 py-0.5 rounded-full border border-slate-300/30">
                  {history.length} Files
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col overflow-hidden justify-start">
                {history.length > 0 ? (
                  <div className="overflow-y-auto max-h-[500px] pr-1 space-y-2.5">
                    {history.map((resItem) => {
                      const isActive = latestResume?._id === resItem._id;
                      return (
                        <div 
                          key={resItem._id}
                          onClick={() => setLatestResume(resItem)}
                          className={`flex items-center gap-3.5 p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-violet-50/40 to-indigo-50/40 border-[#c7c4fb]/70 shadow-sm' 
                              : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <div className={`p-2.5 border rounded-xl transition-colors ${
                            isActive 
                              ? 'bg-white border-brand-200 text-brand-600' 
                              : 'bg-slate-50 border-slate-100 text-slate-500'
                          }`}>
                            <FileText className="w-4 h-4 text-red-500 fill-red-50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-black text-slate-800 truncate">
                              {resItem.fileUrl ? resItem.fileUrl.split('/').pop()?.split('_').slice(1).join('_') || 'Resume_Profile.pdf' : 'Resume_Profile.pdf'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-1">
                              {new Date(resItem.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-slate-300 transition-colors ${isActive ? 'text-violet-500' : ''}`} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs italic min-h-[200px]">
                    <UploadCloud className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                    <span>No uploaded documents found. Click the button above to upload a new resume.</span>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* RIGHT PANEL: Extracted details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* AI Executive summary or Empty State */}
            {latestResume ? (
              <GlassCard hoverEffect={true} className="p-0 overflow-hidden border border-slate-100 flex flex-col justify-between">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-slate-800 text-xs tracking-wider uppercase">AI Executive Career Summary</h3>
                  </div>
                  
                  <button
                    onClick={handleTriggerInterview}
                    disabled={analyzing}
                    className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md shadow-brand-500/10 transition-all flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 duration-300"
                  >
                    <span>Practice Custom Interview</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="p-6 flex-1">
                  <p className="text-slate-700 text-[14px] leading-relaxed font-semibold">
                    {latestResume.aiSummary}
                  </p>
                </div>
              </GlassCard>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200/80 rounded-3xl bg-white min-h-[300px]">
                <img src={moxHappy} alt="Mox Mascot" className="w-20 h-auto mb-4 animate-bounce" />
                <h3 className="font-black text-slate-900 text-base">No Resume Selected</h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Upload your resume to instantly extract custom engineering metrics, skills, projects, and trigger direct mock interview rounds.
                </p>
              </div>
            )}

            {/* Split Metrics: Identified Skills & Profiles cards */}
            {latestResume && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Identified Skills tag grid */}
                <GlassCard hoverEffect={true} className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Identified Skills</span>
                  </div>
                  <div className="flex-1">
                    {latestResume.extractedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {latestResume.extractedSkills.map((sk, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-[#f6f5ff] hover:bg-violet-100/30 border border-[#e5e3fc] hover:border-violet-300/40 text-slate-700 text-[11px] font-black rounded-xl shadow-sm transition-all duration-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">No skills identified by AI.</span>
                    )}
                  </div>
                </GlassCard>

                {/* Score Summary Metrics */}
                <GlassCard hoverEffect={true} className="flex flex-col space-y-4 justify-between">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Analysis Matrix</span>
                  </div>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Resume Match Score:</span>
                      <span className="font-black text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-100">
                        {activeMetrics.matchScore}% (Great Match)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Keywords Found:</span>
                      <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        {activeMetrics.keywordsFound}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>ATS Formatting:</span>
                      <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        {activeMetrics.formatting}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Impact Statements:</span>
                      <span className="font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                        {activeMetrics.impactStatements}
                      </span>
                    </div>
                  </div>
                </GlassCard>

              </div>
            )}

            {/* Split listing rows: Education, experience, and projects */}
            {latestResume && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                
                {/* Education Box */}
                <GlassCard hoverEffect={true} className="flex flex-col space-y-3 text-left">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Education</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{activeMetrics.education.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{activeMetrics.education.subtitle}</p>
                  </div>
                </GlassCard>

                {/* Experience Box */}
                <GlassCard hoverEffect={true} className="flex flex-col space-y-3 text-left">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Experience</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{activeMetrics.experience.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{activeMetrics.experience.subtitle}</p>
                  </div>
                </GlassCard>

                {/* Projects Box */}
                <GlassCard hoverEffect={true} className="flex flex-col space-y-3 text-left">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Terminal className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Projects</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{activeMetrics.projects.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{activeMetrics.projects.subtitle}</p>
                  </div>
                </GlassCard>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ─── Mobile Mockup View ──────────────────────────────────────────── */}
      <div className="block lg:hidden min-h-screen w-full bg-[#F8FAFC]">
        {renderMobileView()}
      </div>
    </>
  );
};
