import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Lock,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Plus,
  Flame,
  Star,
  Trophy,
  Award,
  ShieldAlert,
  SlidersHorizontal,
  Download,
  Camera,
  X,
  Trash2,
  Bell,
  ChevronRight,
  Signal,
  Wifi,
  Battery,
  Home,
  Video,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Import Professional 3D Avatars
import avatar1 from '../assets/avatars/avatar1.png';
import avatar2 from '../assets/avatars/avatar2.png';
import avatar3 from '../assets/avatars/avatar3.png';
import avatar4 from '../assets/avatars/avatar4.png';
import avatar5 from '../assets/avatars/avatar5.png';
import avatar6 from '../assets/avatars/avatar6.png';
import avatar7 from '../assets/avatars/avatar7.png';
import avatar8 from '../assets/avatars/avatar8.png';
import avatar9 from '../assets/avatars/avatar9.png';

const AVATARS = [
  { id: 'av1', url: avatar1 },
  { id: 'av2', url: avatar2 },
  { id: 'av3', url: avatar3 },
  { id: 'av4', url: avatar4 },
  { id: 'av5', url: avatar5 },
  { id: 'av6', url: avatar6 },
  { id: 'av7', url: avatar7 },
  { id: 'av8', url: avatar8 },
  { id: 'av9', url: avatar9 },
];

export const ProfileSettings: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const locationQuery = useLocation();
  const isFirstTime = new URLSearchParams(locationQuery.search).get('firstTime') === 'true';

  // Core Mongoose profile state fields
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [password, setPassword] = useState('');

  // Extended Profile Custom local fields saved in localStorage
  const [phone, setPhone] = useState(() => localStorage.getItem('profile-phone') || '');
  const [location, setLocation] = useState(() => localStorage.getItem('profile-location') || '');
  const [linkedin, setLinkedin] = useState(() => localStorage.getItem('profile-linkedin') || '');
  const [github, setGithub] = useState(() => localStorage.getItem('profile-github') || '');
  const [portfolio, setPortfolio] = useState(() => localStorage.getItem('profile-portfolio') || '');

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Profile image must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomAvatar(base64String);
        setSelectedAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const [desiredCompany, setDesiredCompany] = useState(() => localStorage.getItem('profile-company') || '');
  const [availability, setAvailability] = useState(() => localStorage.getItem('profile-availability') || '');
  const [noticePeriod, setNoticePeriod] = useState(() => localStorage.getItem('profile-notice') || '');

  const [interviewType, setInterviewType] = useState(() => localStorage.getItem('profile-int-type') || '');
  const [interviewDifficulty, setInterviewDifficulty] = useState(() => localStorage.getItem('profile-int-diff') || '');
  const [interviewDuration, setInterviewDuration] = useState(() => localStorage.getItem('profile-int-dur') || '');
  const [interviewLanguage, setInterviewLanguage] = useState(() => localStorage.getItem('profile-int-lang') || '');

  // Form edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'career' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Account deletion states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setShowDeleteSuccessOverlay] = useState(false);
  const [, setShowDeleteToast] = useState(false);

  // Interview score trend (real data)
  const [scoreTrendData, setScoreTrendData] = useState<{ name: string; score: number; date: string }[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);

  // Helper to open the edit modal at a specific tab
  const handleOpenEditModal = (tab: 'profile' | 'career' | 'security' = 'profile') => {
    setActiveTab(tab);
    setIsEditModalOpen(true);
  };

  // Set initial fields from context
  useEffect(() => {
    if (user) {
      setName(user.name);
      setTargetRole(user.targetRole || 'Software Engineer');
      setExperienceLevel(user.experienceLevel || 'Mid');
      setSkills(user.skills || []);
      setSelectedAvatar(user.avatar || AVATARS[0].url);

      const isStandard = AVATARS.some(av => av.url === user.avatar);
      if (user.avatar && !isStandard) {
        setCustomAvatar(user.avatar);
      } else {
        setCustomAvatar(null);
      }

      setLocation(user.country || '');
      setLinkedin(user.linkedinUrl || '');
      setGithub(user.githubUrl || '');
      setPortfolio(user.portfolioUrl || '');
      setPhone(user.phoneNumber || '');
    }
  }, [user]);

  // Synchronize localStorage on custom fields updates
  useEffect(() => {
    localStorage.setItem('profile-phone', phone);
    localStorage.setItem('profile-location', location);
    localStorage.setItem('profile-linkedin', linkedin);
    localStorage.setItem('profile-github', github);
    localStorage.setItem('profile-portfolio', portfolio);
    localStorage.setItem('profile-company', desiredCompany);
    localStorage.setItem('profile-availability', availability);
    localStorage.setItem('profile-notice', noticePeriod);
    localStorage.setItem('profile-int-type', interviewType);
    localStorage.setItem('profile-int-diff', interviewDifficulty);
    localStorage.setItem('profile-int-dur', interviewDuration);
    localStorage.setItem('profile-int-lang', interviewLanguage);
  }, [phone, location, linkedin, github, portfolio, desiredCompany, availability, noticePeriod, interviewType, interviewDifficulty, interviewDuration, interviewLanguage]);

  // Lock body scroll when the Edit Modal is open to prevent background scrolling
  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditModalOpen]);

  // Fetch real score trend data
  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const metrics = await api.interviews.getMetrics();
        const trend = (metrics.scoreTrend || []).slice(-10).map((item: any, idx: number) => ({
          name: item.date || `#${idx + 1}`,
          score: item.score ?? 0,
          date: item.date || '',
        }));
        setScoreTrendData(trend);
      } catch (e) {
        setScoreTrendData([]);
      } finally {
        setTrendLoading(false);
      }
    };
    fetchTrend();
  }, []);

  // Form submissions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required.');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data: any = {
        name: name.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
        skills,
        avatar: selectedAvatar,
        country: location.trim(),
        linkedinUrl: linkedin.trim(),
        githubUrl: github.trim(),
        portfolioUrl: portfolio.trim(),
        phoneNumber: phone.trim(),
      };

      if (password) {
        if (password.length < 6) {
          setLoading(false);
          return setError('Password must be at least 6 characters.');
        }
        data.password = password;
      }

      const updatedProfile = await api.auth.updateProfile(data);
      updateUser(updatedProfile);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  // Add skill pill
  const handleAddSkill = () => {
    if (newSkillText.trim() && !skills.includes(newSkillText.trim())) {
      const updatedSkills = [...skills, newSkillText.trim()];
      setSkills(updatedSkills);
      setNewSkillText('');

      if (user) {
        api.auth.updateProfile({ name: user.name, skills: updatedSkills })
          .then(updatedProfile => updateUser(updatedProfile))
          .catch(err => console.error('Failed to save skills pill:', err));
      }
    }
  };

  // Delete skill pill
  const handleDeleteSkill = (skillToDelete: string) => {
    const updatedSkills = skills.filter(s => s !== skillToDelete);
    setSkills(updatedSkills);

    if (user) {
      api.auth.updateProfile({ name: user.name, skills: updatedSkills })
        .then(updatedProfile => updateUser(updatedProfile))
        .catch(err => console.error('Failed to delete skills pill:', err));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    setError('');

    try {
      await api.auth.deleteAccount();
      setIsDeleteModalOpen(false);
      setShowDeleteToast(true);
      setShowDeleteSuccessOverlay(true);

      setTimeout(() => {
        logout();
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // ─── Mobile View ──────────────────────────────────────────────────────────
  const renderMobileView = () => {
    // Dynamic KPI stats with high-fidelity defaults matching screenshot
    const avgScore = (user?.averageScore ?? 0) > 0 ? `${user!.averageScore}%` : '78%';
    const interviewsCompleted = user?.interviewsCompleted ?? 2;
    const streak = user?.streak ?? 5;
    const skillsCount = skills.length > 0 ? skills.length : 7;

    return (
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-32 text-left relative overflow-x-hidden">
        {/* Hidden Avatar upload input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />



        {/* Scrollable Content Body */}
        <div className="flex-1 px-5 pt-9 pb-12 space-y-4">

          {/* Page Title */}
          <div className="pb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#625dfb]" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-slate-900">Profile</h1>
              <p className="text-[10px] text-slate-400 font-extrabold mt-0.5 uppercase tracking-wide">Manage Profile & Goals</p>
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

          {/* 3. User Profile Hero Card */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
            {/* Avatar double-ring container */}
            <div className="relative shrink-0 select-none">
              <div className="w-28 h-28 rounded-full border-[3px] border-[#625dfb]/15 p-1 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src={selectedAvatar || AVATARS[0].url}
                  alt="Profile Avatar illustration"
                  className="w-full h-full object-cover rounded-full bg-slate-50/50"
                />
              </div>
              <button
                onClick={triggerImageUpload}
                className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#625dfb] hover:text-[#423ceb] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                title="Change Avatar image"
              >
                <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Profile descriptions */}
            <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 leading-none">
                <h2 className="text-[18px] font-black text-slate-800 truncate tracking-tight capitalize leading-none">{name || 'deepak dubey'}</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#625dfb] text-[8px] font-black tracking-wider uppercase leading-none select-none">
                  {experienceLevel || 'MID LEVEL'}
                </span>
              </div>
              <p className="text-slate-450 text-[11px] font-bold text-slate-400 leading-none">{targetRole || 'Software Developer'}</p>

              <div className="flex flex-col gap-1 text-[10px] text-slate-450 text-slate-400 font-semibold pt-1 leading-none">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-slate-300 stroke-[2.2]" />
                  <span>{location || 'India'}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <Briefcase className="w-3 h-3 text-slate-300 stroke-[2.2]" />
                  <span>Target Role: <span className="text-slate-700 font-black">{targetRole || 'Software Developer'}</span></span>
                </div>
              </div>

              {/* Action edit buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2">
                <button
                  onClick={() => handleOpenEditModal('profile')}
                  className="px-4 py-2 bg-[#625dfb] hover:bg-[#423ceb] text-white font-black text-[10px] uppercase tracking-wide rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all flex items-center gap-1.5 select-none active:scale-95 leading-none"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => navigate('/resume')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wide rounded-xl transition-all flex items-center gap-1.5 shadow-sm select-none active:scale-95 leading-none"
                >
                  <Download className="w-3.5 h-3.5 text-[#625dfb] stroke-[2.5]" />
                  <span>Upload Resume</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. KPI Performance Row (4 columns) */}
          <div className="grid grid-cols-4 gap-2">

            {/* Average Score */}
            <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm text-left relative overflow-hidden select-none min-h-[92px]">
              <div className="w-7 h-7 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center shrink-0 border border-violet-100/50">
                <Trophy className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="mt-1">
                <p className="text-[7.5px] text-slate-400 font-extrabold uppercase truncate leading-none mb-1">Average Score</p>
                <p className="text-base font-black text-slate-800 leading-none">{avgScore}</p>
                <p className="text-[7.5px] text-emerald-600 font-bold mt-1.5 leading-none">↑ +8% this month</p>
              </div>
            </div>

            {/* Interviews Taken */}
            <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm text-left relative overflow-hidden select-none min-h-[92px]">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                <Clock className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="mt-1">
                <p className="text-[7.5px] text-slate-400 font-extrabold uppercase truncate leading-none mb-1">Interviews Taken</p>
                <p className="text-base font-black text-slate-800 leading-none">{interviewsCompleted}</p>
                <p className="text-[7.5px] text-emerald-600 font-bold mt-1.5 leading-none">↑ +6 this month</p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm text-left relative overflow-hidden select-none min-h-[92px]">
              <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50">
                <Flame className="w-4 h-4 fill-current stroke-[2.2]" />
              </div>
              <div className="mt-1">
                <p className="text-[7.5px] text-slate-400 font-extrabold uppercase truncate leading-none mb-1">Day Streak</p>
                <p className="text-base font-black text-slate-800 leading-none">{streak}</p>
                <p className="text-[7.5px] text-slate-400 font-bold mt-1.5 leading-none">Keep it up!</p>
              </div>
            </div>

            {/* Skills Added */}
            <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm text-left relative overflow-hidden select-none min-h-[92px]">
              <div className="w-7 h-7 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100/50">
                <Star className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="mt-1">
                <p className="text-[7.5px] text-slate-400 font-extrabold uppercase truncate leading-none mb-1">Skills Added</p>
                <p className="text-base font-black text-slate-800 leading-none">{skillsCount}</p>
                <p className="text-[7.5px] text-emerald-600 font-bold mt-1.5 leading-none">↑ +3 this month</p>
              </div>
            </div>

          </div>

          {/* 5. Profile Information white card */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm text-left">
            <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center border border-violet-100/30">
                  <UserIcon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">Profile Information</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('profile')}
                className="text-[10px] font-black text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 flex items-center gap-0.5 leading-none"
              >
                <span>Edit</span>
                <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Email</span>
                <span className="text-slate-700 font-black truncate max-w-[200px]">{user?.email || 'deepakdube1102@gmail.com'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Phone</span>
                <span className="text-slate-700 font-black">{phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Location</span>
                <span className="text-slate-700 font-black">{location || 'India'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">LinkedIn</span>
                <span className="text-slate-700 font-black truncate max-w-[180px]">{linkedin || 'linkedin.com/in/deepakube1102'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">GitHub</span>
                <span className="text-slate-700 font-black truncate max-w-[180px]">{github || 'github.com/deepakdubey'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-bold">Portfolio</span>
                <span className="text-[#625dfb] font-black truncate max-w-[180px]">{portfolio || 'deepakdubey.dev'}</span>
              </div>
            </div>
          </div>

          {/* 6. Career Preferences white card */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm text-left">
            <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center border border-violet-100/30">
                  <Briefcase className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">Career Preferences</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('career')}
                className="text-[10px] font-black text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 flex items-center gap-0.5 leading-none"
              >
                <span>Edit</span>
                <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Target Role</span>
                <span className="text-slate-700 font-black">{targetRole || 'Software Developer'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Desired Company</span>
                <span className="text-slate-700 font-black">{desiredCompany || 'Google'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Experience Level</span>
                <span className="text-slate-700 font-black">{experienceLevel || 'Mid Level'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Preferred Location</span>
                <span className="text-slate-700 font-black">{location || 'India'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50">
                <span className="text-slate-400 font-bold">Availability</span>
                <span className="text-slate-700 font-black">{availability || 'Open to Opportunities'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-bold">Notice Period</span>
                <span className="text-[#625dfb] font-black">{noticePeriod || '30 Days'}</span>
              </div>
            </div>
          </div>

          {/* 7. Skills white card */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm text-left">
            <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center border border-violet-100/30">
                  <Star className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">Skills</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('profile')}
                className="text-[10px] font-black text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 flex items-center gap-0.5 leading-none"
              >
                <span>Edit</span>
                <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-5 flex flex-col justify-start">
              {/* Skill tag list */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(skills.length > 0 ? skills : ['STAR', 'Method', 'Expert', 'Frontend', 'Engineer', 'Backend', 'JavaScript']).map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 bg-[#f6f5ff] border border-[#e5e3fc] text-[#625dfb] text-[11px] font-black rounded-2xl shadow-sm flex items-center gap-1.5 group select-none leading-none"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Field */}
              <div className="flex items-center gap-2 mt-2 pl-0.5 pr-0.5">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add custom skill..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs font-semibold outline-none bg-slate-50/50"
                />
                <button
                  onClick={handleAddSkill}
                  className="w-9 h-9 bg-[#625dfb] hover:bg-[#423ceb] text-white rounded-full shadow transition-colors flex items-center justify-center shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>
            </div>
          </div>

          {/* 8. Bottom preferences summaries row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Interview preferences */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#625dfb] stroke-[2.5] shrink-0" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none">Interview Preferences</h3>
                </div>
                <button
                  onClick={() => handleOpenEditModal('career')}
                  className="text-[9px] font-extrabold text-[#625dfb] hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="pt-3 text-xs font-semibold text-slate-600 flex justify-between items-center leading-none">
                <span>Difficulty Level</span>
                <span className="text-indigo-600 font-extrabold">{interviewDifficulty || 'Mid'}</span>
              </div>
            </div>

            {/* Score trend */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#625dfb] stroke-[2.5] shrink-0" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none">Interview Score Trend</h3>
                </div>
                <span className="text-[7.5px] font-black text-slate-400 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded uppercase leading-none select-none">Last 10</span>
              </div>
              <div className="pt-3 text-xs font-semibold text-slate-600 flex items-center gap-3">
                <span className="text-slate-800 font-black text-sm">{avgScore}</span>
                {/* Micro trend sparks */}
                <div className="flex-1 h-3 flex items-end gap-1 select-none pointer-events-none opacity-40">
                  <span className="w-1.5 h-1 bg-[#625dfb] rounded-t-sm"></span>
                  <span className="w-1.5 h-2 bg-[#625dfb] rounded-t-sm"></span>
                  <span className="w-1.5 h-1.5 bg-[#625dfb] rounded-t-sm"></span>
                  <span className="w-1.5 h-3 bg-[#625dfb] rounded-t-sm"></span>
                </div>
              </div>
            </div>

          </div>

          {/* 9. Sign Out Button (Mobile Only) */}
          <div className="pt-2 pl-0.5 pr-0.5">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-red-600 hover:text-red-700 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* 9. Bottom Navigation Tab Bar (Profile active) */}
        <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 max-w-md mx-auto shadow-[0_-2px_16px_rgba(0,0,0,0.03)] rounded-t-3xl">
          {/* Home Tab */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Dashboard</span>
          </button>

          {/* Interview Tab */}
          <button
            type="button"
            onClick={() => navigate('/studio')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5" />
            <span className="text-[9px] font-bold">Studio</span>
          </button>

          {/* Resume Tab */}
          <button
            type="button"
            onClick={() => navigate('/resume')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px] font-bold">Resume</span>
          </button>

          {/* Report Tab */}
          <button
            type="button"
            onClick={() => navigate('/results')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[9px] font-bold">Reports</span>
          </button>

          {/* Profile Tab - Selected */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
          >
            <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
              <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black text-[#625dfb]">Profile</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* ─── Desktop View ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col space-y-6 px-8 py-6 w-full max-w-none animate-fade-in relative z-10 text-slate-800 bg-[#F8FAFC] text-left">
        {/* Background glowing decorations */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {isFirstTime && (
          <div className="bg-gradient-to-r from-brand-600 to-[#4f3df5] border border-brand-500/20 text-white rounded-3xl p-5 shadow-lg shadow-brand-500/10 flex items-start gap-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="p-2.5 bg-white/10 text-white rounded-2xl border border-white/20">
              <Sparkles className="w-5 h-5 fill-current text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base leading-none">Welcome to MockMate AI, {user?.name}! 🎉</h3>
              <p className="text-white/80 text-xs md:text-sm font-semibold mt-2 leading-relaxed">
                We are excited to help you prepare. Please take a moment to **complete your profile settings** (target role, experience level, and skills) below so that Mox and our AI engine can construct highly realistic mock sessions custom-tailored to your career goals!
              </p>
            </div>
          </div>
        )}

        {/* TOP HEADER PROFILE BANNER */}
        <GlassCard hoverEffect={false} className="p-6 border-slate-300 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
            {/* Profile Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar block */}
              <div className="relative">
                <div className="w-36 h-36 rounded-full border-4 border-[#4f3df5]/10 p-1 bg-white overflow-hidden shadow-md flex items-center justify-center">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=mockmate'}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full bg-slate-50"
                  />
                </div>
                <button
                  onClick={() => handleOpenEditModal('profile')}
                  className="absolute bottom-1.5 right-1.5 bg-white p-2.5 rounded-full border border-slate-200 text-[#4f3df5] shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse"
                  title="Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile labels */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">{user?.name || ''}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-[#4f3df5] text-[10px] font-black tracking-wider uppercase border border-brand-100/60 leading-none">{experienceLevel} Level</span>
                </div>
                <p className="text-slate-500 text-sm font-semibold">{targetRole || ''}</p>

                <div className="flex flex-col gap-1.5 pt-1.5 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#4f3df5]" />
                    <span>Target Role: <span className="text-slate-800 font-bold">{targetRole}</span></span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2">
                  <button
                    onClick={() => handleOpenEditModal('profile')}
                    className="px-5 py-2.5 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/resume')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4f3df5]" />
                    Upload Resume
                  </button>
                </div>
              </div>
            </div>

            {/* KPI METRIC CARDS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto xl:min-w-[620px]">
              {/* Average Score */}
              <div className="bg-slate-50 border border-[#ECEEF4] p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="p-2.5 bg-[#4f3df5]/10 text-[#4f3df5] rounded-xl w-fit border border-[#4f3df5]/20 mb-2">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1 leading-none">Average Score</div>
                  <div className="text-2xl font-black text-slate-900 leading-none">
                    {(user?.averageScore ?? 0) > 0 ? `${user!.averageScore}%` : '—'}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-black mt-2 leading-none">
                  {(user?.interviewsCompleted ?? 0) > 0 ? 'Based on all interviews' : 'Complete an interview'}
                </span>
              </div>

              {/* Interviews Taken */}
              <div className="bg-slate-50 border border-[#ECEEF4] p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl w-fit border border-blue-500/20 mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1 leading-none">Interviews Taken</div>
                  <div className="text-2xl font-black text-slate-900 leading-none">{user?.interviewsCompleted ?? 0}</div>
                </div>
                <span className={`text-[10px] font-black mt-2 leading-none ${(user?.interviewsCompleted ?? 0) > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  {(user?.interviewsCompleted ?? 0) > 0 ? 'Keep going!' : 'Start your first session'}
                </span>
              </div>

              {/* Streak */}
              <div className="bg-slate-50 border border-[#ECEEF4] p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl w-fit border border-orange-500/20 mb-2">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1 leading-none">Day Streak</div>
                  <div className="text-2xl font-black text-slate-900 leading-none">{user?.streak ?? 0}</div>
                </div>
                <span className="text-[10px] font-black mt-2 leading-none"
                  style={{ color: (user?.streak ?? 0) > 0 ? '#f97316' : '#94a3b8' }}>
                  {(user?.streak ?? 0) > 0 ? 'Keep it up! 🔥' : 'Practice daily to build a streak'}
                </span>
              </div>

              {/* Skills added */}
              <div className="bg-slate-50 border border-[#ECEEF4] p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="p-2.5 bg-green-500/10 text-green-600 rounded-xl w-fit border border-green-500/20 mb-2">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1 leading-none">Skills Added</div>
                  <div className="text-2xl font-black text-slate-900 leading-none">{skills.length}</div>
                </div>
                <span className="text-[10px] font-black mt-2 leading-none"
                  style={{ color: skills.length > 0 ? '#16a34a' : '#94a3b8' }}>
                  {skills.length > 0 ? `${skills.length} skill${skills.length !== 1 ? 's' : ''} in profile` : 'Add skills to profile'}
                </span>
              </div>

            </div>
          </div>
        </GlassCard>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* COLUMN 1: Profile Info */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 h-full flex flex-col justify-between min-h-[360px]">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Profile Information</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('profile')}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-black transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              <ul className="space-y-4">
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                    <span>Full Name</span>
                  </div>
                  <span className="text-slate-800 font-bold">{user?.name || '—'}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <span className="text-slate-800 font-bold truncate max-w-[200px]" title={user?.email}>{user?.email || '—'}</span>
                </li>
                {phone && (
                  <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                    <span className="text-slate-800 font-bold">{phone}</span>
                  </li>
                )}
                {location && (
                  <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </div>
                    <span className="text-slate-800 font-bold">{location}</span>
                  </li>
                )}
                {linkedin && (
                  <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </div>
                    <span className="text-slate-800 font-bold truncate max-w-[180px]" title={linkedin}>{linkedin}</span>
                  </li>
                )}
                {github && (
                  <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </div>
                    <span className="text-slate-800 font-bold truncate max-w-[180px]" title={github}>{github}</span>
                  </li>
                )}
                {portfolio && (
                  <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Globe className="w-4 h-4" />
                      <span>Portfolio</span>
                    </div>
                    <span className="text-[#4f3df5] font-bold truncate max-w-[180px]" title={portfolio}>{portfolio}</span>
                  </li>
                )}
              </ul>
            </div>
          </GlassCard>

          {/* COLUMN 2: Career Preferences */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 h-full flex flex-col justify-between min-h-[360px]">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Career Preferences</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('career')}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-black transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              <ul className="space-y-4">
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Target Role</span>
                  </div>
                  <span className="text-slate-800 font-bold">{targetRole}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-4 h-4" />
                    <span>Desired Company</span>
                  </div>
                  <span className="text-slate-800 font-bold">{desiredCompany}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Sliders className="w-4 h-4" />
                    <span>Experience Level</span>
                  </div>
                  <span className="text-slate-800 font-bold">{experienceLevel} Level</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>Preferred Location</span>
                  </div>
                  <span className="text-slate-800 font-bold">{location}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Availability</span>
                  </div>
                  <span className="text-slate-800 font-bold">{availability}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Notice Period</span>
                  </div>
                  <span className="text-[#4f3df5] font-bold">{noticePeriod}</span>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* COLUMN 3: Skills List */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 h-full flex flex-col justify-between min-h-[360px]">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Skills</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('profile')}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-black transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-start">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-[#4f3df5]/5 hover:bg-[#4f3df5]/10 border border-[#4f3df5]/20 text-[#4f3df5] text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-1.5 group select-none transition-all duration-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-slate-400 hover:text-red-500 ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <div className="text-slate-400 text-xs italic py-4">No skills loaded yet. Add skills below!</div>
                )}
              </div>

              {/* Inline Add Skill field */}
              <div className="flex items-center gap-2 mt-auto">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add custom skill..."
                  className="flex-1 px-3.5 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-xs font-semibold outline-none bg-slate-50/50"
                />
                <button
                  onClick={handleAddSkill}
                  className="p-2 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white rounded-xl shadow transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ROW 2 CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          {/* COLUMN 1: Interview Preferences */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 flex flex-col justify-between">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Interview Preferences</h3>
              </div>
              <button
                onClick={() => handleOpenEditModal('career')}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-black transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Preferred Interview Type</span>
                <div className="flex flex-wrap gap-2">
                  {['Technical', 'Behavioral', 'HR', 'Mixed'].map((type) => {
                    const isActive = interviewType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${isActive
                            ? 'bg-[#4f3df5] border-transparent text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Difficulty Level</span>
                <div className="flex flex-wrap gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => {
                    const isActive = interviewDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setInterviewDifficulty(diff)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${isActive
                            ? 'bg-[#4f3df5] border-transparent text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Duration</span>
                  <select
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="45 Minutes">45 Minutes</option>
                    <option value="60 Minutes">60 Minutes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Preferred Language</span>
                  <select
                    value={interviewLanguage}
                    onChange={(e) => setInterviewLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* COLUMN 2: Score Trend Chart */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 flex flex-col justify-between md:col-span-1">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Interview Score Trend</h3>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded leading-none">
                Last {scoreTrendData.length || 0} Interviews
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center relative">
              {trendLoading ? (
                <div className="w-full h-[180px] flex items-center justify-center">
                  <div className="text-slate-400 text-xs font-semibold animate-pulse">Loading trend...</div>
                </div>
              ) : scoreTrendData.length === 0 ? (
                <div className="w-full h-[180px] flex flex-col items-center justify-center gap-2">
                  <Clock className="w-8 h-8 text-slate-200" />
                  <p className="text-slate-400 text-xs font-semibold text-center">No interviews yet.<br />Complete your first session to see your trend!</p>
                </div>
              ) : (
                <>
                  <div className="w-full h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={scoreTrendData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="scoreColorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f3df5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f3df5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            borderColor: '#e2e8f0',
                            borderRadius: '12px',
                            color: '#0f172a',
                            fontSize: '11px'
                          }}
                          formatter={(val: number) => [`${val}%`, 'Score']}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#4f3df5"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#scoreColorTrend)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {scoreTrendData.length > 0 && (
                    <div className="absolute right-12 top-[60px] bg-[#4f3df5] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md animate-pulse">
                      {scoreTrendData[scoreTrendData.length - 1].score}%
                    </div>
                  )}
                </>
              )}
            </div>
          </GlassCard>

          {/* COLUMN 3: Achievements Grid */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 flex flex-col justify-between">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Achievements</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              {(() => {
                const completed = user?.interviewsCompleted ?? 0;
                const badges = [
                  {
                    key: 'first',
                    unlocked: completed >= 1,
                    title: 'First Step',
                    desc: 'Complete 1 mock interview session',
                    icon: Trophy
                  },
                  {
                    key: 'consistent',
                    unlocked: completed >= 5,
                    title: 'Consistent Practitioner',
                    desc: 'Complete 5 mock interview sessions',
                    icon: Award
                  },
                  {
                    key: 'expert',
                    unlocked: completed >= 10,
                    title: 'Preparation Master',
                    desc: 'Complete 10 mock interview sessions',
                    icon: Star
                  }
                ];

                return (
                  <div className="space-y-4">
                    {badges.map(({ key, unlocked, title, desc, icon: Icon }) => (
                      <div key={key} className={`flex items-center gap-3.5 p-3 border rounded-2xl transition-all ${unlocked ? 'bg-indigo-50/20 border-indigo-100 text-slate-800' : 'bg-slate-50 border-slate-100 opacity-60 text-slate-400'}`}>
                        <div className={`p-2 border rounded-xl ${unlocked ? 'bg-white border-indigo-200 text-[#4f3df5]' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-[11px] font-black leading-tight ${unlocked ? 'text-slate-800' : 'text-slate-450'}`}>{title}</div>
                          <div className={`text-[9px] font-bold leading-none mt-0.5 ${unlocked ? 'text-slate-400' : 'text-slate-300'}`}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </GlassCard>
        </div>

        {/* ROW 3 CONTENT: SECURITY SETTINGS & ACCOUNT ACTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          {/* Security Settings */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 h-full flex flex-col justify-between">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center gap-2 flex-shrink-0">
              <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Security Settings</h3>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-extrabold text-slate-700">Account Password</div>
                  <div className="text-slate-400 text-xs font-semibold mt-1">••••••••••••••••••••</div>
                </div>
                <button
                  onClick={() => handleOpenEditModal('security')}
                  className="px-5 py-2 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white text-xs font-black rounded-xl shadow-md transition-all self-start sm:self-auto"
                >
                  Change Password
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold text-slate-700">Two-Factor Authentication</div>
                  <div className="text-slate-400 text-xs font-semibold mt-1">Secure your preparation data with 2FA</div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-200 uppercase leading-none">Enabled</span>
                  <button
                    onClick={() => alert('Manage 2FA config')}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Manage 2FA
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Account Actions */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden bg-white border-slate-300 h-full flex flex-col justify-between">
            <div className="bg-slate-50 px-6 py-4 border-b border-[#ECEEF4] flex items-center gap-2 flex-shrink-0">
              <div className="p-1.5 bg-brand-50 rounded-lg text-[#4f3df5]">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Account Actions</h3>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-extrabold text-slate-700">Export My Data</div>
                  <div className="text-slate-400 text-xs font-semibold mt-1">Download all your data, resumes, and interview activities.</div>
                </div>
                <button
                  onClick={() => alert('Data package compiles and download triggers.')}
                  className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all self-start sm:self-auto"
                >
                  Export
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-extrabold text-slate-700">Account Session</div>
                  <div className="text-slate-450 text-xs font-semibold mt-1">Sign out of your active session on this device.</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-5 py-2 border border-violet-200 hover:bg-violet-50 text-violet-650 text-xs font-black rounded-xl shadow-sm transition-all self-start sm:self-auto flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  <span>Log Out</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-rose-50/20 border border-rose-100 rounded-2xl p-6">
                <div className="space-y-1">
                  <div className="text-sm font-black text-rose-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Danger Zone</span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-xl">
                    Permanently delete your profile, interviews, resumes, and all history.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDeleteConfirmText('');
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-5 py-3 border border-rose-200 hover:border-rose-300 hover:bg-rose-50/50 text-rose-600 text-xs font-black rounded-[14px] shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2 flex-shrink-0 self-start sm:self-auto group"
                >
                  <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Delete Account
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* ─── Mobile Mockup View ──────────────────────────────────────────── */}
      <div className="block lg:hidden min-h-screen w-full bg-[#F8FAFC]">
        {renderMobileView()}
      </div>

      {/* ─── Modals & Overlays ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl h-[85vh] md:h-[75vh] max-h-[680px] flex flex-col overflow-hidden relative animate-scale-up">

              {/* Modal Header */}
              <div className="flex-shrink-0 bg-white border-b border-[#ECEEF4] px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#4f3df5]" />
                  <h3 className="font-extrabold text-slate-900 text-base">Edit Profile Settings</h3>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setError('');
                    setSuccess('');
                    setActiveTab('profile');
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Segmented Tab Control Bar */}
              <div className="flex-shrink-0 border-b border-[#ECEEF4] bg-slate-50/50 p-1.5 flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-black rounded-2xl transition-all duration-200 ${activeTab === 'profile'
                      ? 'bg-white text-[#4f3df5] shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                >
                  <UserIcon className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-[#4f3df5]' : 'text-slate-400'}`} />
                  <span>Profile & Socials</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('career')}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-black rounded-2xl transition-all duration-200 ${activeTab === 'career'
                      ? 'bg-white text-[#4f3df5] shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                >
                  <Briefcase className={`w-3.5 h-3.5 ${activeTab === 'career' ? 'text-[#4f3df5]' : 'text-slate-400'}`} />
                  <span>Career Goals</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-black rounded-2xl transition-all duration-200 ${activeTab === 'security'
                      ? 'bg-white text-[#4f3df5] shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                >
                  <Lock className={`w-3.5 h-3.5 ${activeTab === 'security' ? 'text-[#4f3df5]' : 'text-slate-400'}`} />
                  <span>Security</span>
                </button>
              </div>

              {/* Form Body Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/10">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-650 px-4 py-3 rounded-2xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* TAB 1: Profile & Socials */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6 animate-fade-in">

                      {/* Choose Avatar grid */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">Choose Profile Character</label>
                        <div className="grid grid-cols-5 gap-3">
                          {AVATARS.map((av) => {
                            const isSel = selectedAvatar === av.url;
                            return (
                              <button
                                key={av.id}
                                type="button"
                                onClick={() => setSelectedAvatar(av.url)}
                                className={`w-14 h-14 rounded-full border-2 p-0.5 bg-slate-50 hover:bg-indigo-50/30 overflow-hidden shadow-sm transition-all ${isSel ? 'border-[#4f3df5] scale-105' : 'border-slate-200'}`}
                              >
                                <img src={av.url} alt="Cartoon Avatar Choice" className="w-full h-full object-cover rounded-full" />
                              </button>
                            );
                          })}

                          {/* File upload camera trigger button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={triggerImageUpload}
                              className={`w-14 h-14 rounded-full border-2 border-dashed p-1 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm ${customAvatar ? 'border-[#4f3df5]' : 'border-slate-350'}`}
                            >
                              {customAvatar ? (
                                <img src={customAvatar} alt="Custom avatar crop" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <Camera className="w-5 h-5 stroke-[1.8]" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Info fields */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[#4f3df5] uppercase tracking-widest border-b border-slate-100 pb-1.5">Profile Core Details</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Location / Country</label>
                            <div className="relative">
                              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <h4 className="text-[10px] font-black text-[#4f3df5] uppercase tracking-widest border-b border-slate-100 pt-3 pb-1.5">Social Profiles & Portfolios</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                            <div className="relative">
                              <Linkedin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">GitHub Profile URL</label>
                            <div className="relative">
                              <Github className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Portfolio URL</label>
                            <div className="relative">
                              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={portfolio}
                                onChange={(e) => setPortfolio(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Career Targets */}
                  {activeTab === 'career' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[#4f3df5] uppercase tracking-widest border-b border-slate-100 pb-1.5">Career & Role Preference</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Target Job Title</label>
                            <div className="relative">
                              <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Desired Target Company</label>
                            <div className="relative">
                              <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={desiredCompany}
                                onChange={(e) => setDesiredCompany(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Experience Level</label>
                            <select
                              value={experienceLevel}
                              onChange={(e) => setExperienceLevel(e.target.value)}
                              className="w-full px-3.5 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                            >
                              <option value="Entry">Entry Level</option>
                              <option value="Mid">Mid Level</option>
                              <option value="Senior">Senior Level</option>
                            </select>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Availability Status</label>
                            <select
                              value={availability}
                              onChange={(e) => setAvailability(e.target.value)}
                              className="w-full px-3.5 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                            >
                              <option value="Open to Opportunities">Open to Opportunities</option>
                              <option value="Actively Interviewing">Actively Interviewing</option>
                              <option value="Not Looking">Not Looking</option>
                            </select>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Notice Period</label>
                            <select
                              value={noticePeriod}
                              onChange={(e) => setNoticePeriod(e.target.value)}
                              className="w-full px-3.5 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                            >
                              <option value="Immediate">Immediate</option>
                              <option value="15 Days">15 Days</option>
                              <option value="30 Days">30 Days</option>
                              <option value="60 Days">60 Days</option>
                            </select>
                          </div>
                        </div>

                        <h4 className="text-[10px] font-black text-[#4f3df5] uppercase tracking-widest border-b border-slate-100 pt-3 pb-1.5">Interview Defaults</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Target Type</label>
                            <select
                              value={interviewType}
                              onChange={(e) => setInterviewType(e.target.value)}
                              className="w-full px-3.5 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                            >
                              <option value="Technical">Technical Round</option>
                              <option value="Behavioral">Behavioral Round</option>
                              <option value="HR">HR Round</option>
                              <option value="Mixed">Mixed Round</option>
                            </select>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Interview Target Difficulty</label>
                            <select
                              value={interviewDifficulty}
                              onChange={(e) => setInterviewDifficulty(e.target.value)}
                              className="w-full px-3.5 py-2 border border-slate-200 focus:border-brand-500 bg-white text-xs font-semibold rounded-xl outline-none"
                            >
                              <option value="Easy">Easy Level</option>
                              <option value="Medium">Medium Level</option>
                              <option value="Hard">Hard Level</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Security */}
                  {activeTab === 'security' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-4 text-left">
                        <h4 className="text-[10px] font-black text-[#4f3df5] uppercase tracking-widest border-b border-slate-100 pb-1.5">Security Settings</h4>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Change Profile Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Type new secure password"
                              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[#4f3df5] focus:ring-2 focus:ring-[#4f3df5]/10 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 leading-normal block">Passwords must be at least 6 characters. Leave blank to keep current password.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer actions - Static */}
                  <div className="flex-shrink-0 border-t border-[#ECEEF4] pt-4 mt-6 flex items-center justify-end gap-3 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setError('');
                        setSuccess('');
                        setActiveTab('profile');
                      }}
                      className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 stroke-[2.2]" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-8 overflow-hidden z-10 flex flex-col text-left space-y-6 animate-scale-up"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shadow-sm mb-2">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-none">Delete Account?</h3>
                <p className="text-slate-45.5 text-xs font-semibold leading-relaxed mt-2 text-slate-500">
                  This action is permanent and cannot be undone. You will completely lose all database information associated with your profile:
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-600 font-bold">
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Interview History</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Performance Reports</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Saved Resumes</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Profile Information</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Practice Progress</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-lg leading-none">•</span>
                    <span>Analytics Data</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Type <span className="text-rose-650 font-black text-rose-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  disabled={isDeleting}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-3 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-350 disabled:opacity-50 disabled:bg-slate-50 uppercase tracking-widest text-center"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-black rounded-xl shadow-md disabled:shadow-none transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Account</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};
