import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChevronRight, ChevronLeft, Check, X, User, AtSign, Globe, ArrowRight, Briefcase, Award } from 'lucide-react';

import owlImg from '../assets/Owl_with_laptop.png';
import happyOwl from '../assets/Happy.png';
import symbolLogo from '../assets/Symbol_logo.png';

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

// ─── Avatar Grid ─────────────────────────────────────────────────────────────
// 9 avatars: Professional, modern 3D clay-rendered characters
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

// ─── Skills Catalog ───────────────────────────────────────────────────────────
const ALL_SKILLS = [
  'Active Listening',
  'Adaptability',
  'Agile Methodologies',
  'Algorithms',
  'Analytical Thinking',
  'Angular',
  'AWS',
  'Azure',
  'Behavioral Analysis',
  'Budgeting',
  'Business Development',
  'Business Intelligence',
  'C#',
  'C++',
  'CI/CD',
  'Client Relations',
  'Cloud Architecture',
  'Coaching',
  'Collaboration',
  'Communication',
  'Conflict Resolution',
  'Content Strategy',
  'Critical Thinking',
  'Customer Success',
  'Data Analysis',
  'Data Science',
  'Data Structures',
  'Database Management',
  'Decision Making',
  'Delegation',
  'DevOps',
  'Digital Marketing',
  'Django',
  'Docker',
  'Emotional Intelligence',
  'Empathy',
  'FastAPI',
  'Figma',
  'Financial Analysis',
  'Flutter',
  'GCP',
  'Git',
  'Go',
  'GraphQL',
  'Growth Hacking',
  'Influence',
  'Interpersonal Skills',
  'Java',
  'JavaScript',
  'Kotlin',
  'Kubernetes',
  'Laravel',
  'Leadership',
  'Linux',
  'Machine Learning',
  'Market Research',
  'Mentoring',
  'MongoDB',
  'MySQL',
  'Negotiation',
  'Node.js',
  'PHP',
  'PostgreSQL',
  'Presentation Skills',
  'Problem Solving',
  'Product Management',
  'Project Management',
  'Public Speaking',
  'Python',
  'PyTorch',
  'React',
  'React Native',
  'Recruiting',
  'Redis',
  'REST APIs',
  'Ruby on Rails',
  'Rust',
  'Sales',
  'Scrum',
  'SEO',
  'Software Architecture',
  'Spring Boot',
  'SQL',
  'Stakeholder Management',
  'Strategic Planning',
  'Swift',
  'System Design',
  'Team Management',
  'Teamwork',
  'Technical Writing',
  'TensorFlow',
  'Time Management',
  'TypeScript',
  'UI/UX Design',
  'User Research',
  'Vue.js',
];

const INDIAN_CITIES = [
  'Mumbai, Maharashtra',
  'Thane, Maharashtra',
  'Bengaluru, Karnataka',
  'Delhi, NCR',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Gurugram, Haryana',
  'Noida, Uttar Pradesh',
  'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh',
  'Kochi, Kerala',
  'Visakhapatnam, Andhra Pradesh',
  'Indore, Madhya Pradesh',
  'Patna, Bihar',
  'Chandigarh, Punjab',
  'Coimbatore, Tamil Nadu',
  'Nagpur, Maharashtra',
  'Bhubaneswar, Odisha',
  'Thiruvananthapuram, Kerala',
  'Bhopal, Madhya Pradesh',
  'Surat, Gujarat',
  'Vadodara, Gujarat',
  'Ranchi, Jharkhand',
  'Raipur, Chhattisgarh',
  'Guwahati, Assam',
  'Srinagar, Jammu & Kashmir',
  'Amritsar, Punjab',
  'Jodhpur, Rajasthan',
  'Vijayawada, Andhra Pradesh',
  'Dehradun, Uttarakhand',
  'Shimla, Himachal Pradesh',
  'Panaji, Goa',
  'Mangaluru, Karnataka',
  'Mysuru, Karnataka',
  'Tiruchirappalli, Tamil Nadu',
  'Madurai, Tamil Nadu',
  'Warangal, Telangana',
  'Guntur, Andhra Pradesh',
];

const EXPERIENCE_LEVELS = [
  { value: 'Entry', label: 'Entry Level', sub: '0 – 2 yrs' },
  { value: 'Mid', label: 'Mid Level', sub: '2 – 5 yrs' },
  { value: 'Senior', label: 'Senior Level', sub: '5+ yrs' },
];

const INTERVIEW_TYPES = [
  { value: 'Technical', label: 'Technical', icon: '⚙️', desc: 'DSA, coding & system design' },
  { value: 'Behavioral', label: 'Behavioral', icon: '🤝', desc: 'Soft skills & STAR stories' },
  { value: 'HR', label: 'HR Round', icon: '📋', desc: 'Culture fit & career goals' },
  { value: 'System Design', label: 'System Design', icon: '🏗️', desc: 'Architecture & scalability' },
  { value: 'Case Study', label: 'Case Study', icon: '📊', desc: 'Problem solving & analysis' },
];

const FEATURES = [
  { icon: '🎯', title: 'AI-tailored interview questions', sub: 'Personalized to your role and experience' },
  { icon: '📊', title: 'Detailed performance reports', sub: 'Know your strengths and improve faster' },
  { icon: '📈', title: 'Track your growth over time', sub: 'Monitor progress and stay consistent' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [sliding, setSliding] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  // Step 1
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].url);
  const [fullName, setFullName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [country, setCountry] = useState(user?.country || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [phone, setPhone] = useState(user?.phoneNumber || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

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

  // Step 2
  const [targetRole, setTargetRole] = useState('');
  const [expLevel, setExpLevel] = useState(user?.experienceLevel || 'Mid');
  const [selSkills, setSelSkills] = useState<string[]>(user?.skills || []);
  const [intType, setIntType] = useState(user?.preferredInterviewType || '');
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || '');

  const transition = (toStep: number) => {
    setSlideDir(toStep > step ? 'left' : 'right');
    setSliding(true);
    setTimeout(() => {
      setStep(toStep);
      setSliding(false);
    }, 280);
  };

  const goNext = () => {
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!country.trim()) { setError('Please enter your location.'); return; }
    setError('');
    transition(2);
  };

  const goBack = () => { setError(''); transition(1); };

  const toggleSkill = (s: string) =>
    setSelSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleFinish = async () => {
    if (!targetRole.trim()) { setError('Target role is required.'); return; }
    if (!intType) { setError('Please select an interview type.'); return; }
    setError('');
    setSaving(true);
    try {
      const res = await api.auth.completeOnboarding({
        name: fullName, username, avatar: selectedAvatar, country,
        linkedinUrl, githubUrl, portfolioUrl, phoneNumber: phone,
        targetRole, experienceLevel: expLevel, skills: selSkills,
        preferredInterviewType: intType, careerGoal,
      });
      if (res.token) localStorage.setItem('token', res.token);
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = ALL_SKILLS.filter(
    s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selSkills.includes(s)
  );

  // ─── Shared input className ───────────────────────────────────────────────
  const inputCls = `
    w-full px-4 py-2.5 rounded-2xl border border-[#e8eaf0] bg-white
    text-[#1a1a2e] text-sm font-semibold placeholder:text-[#a0a8bf]
    focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/20 focus:border-[#6D5DFB]
    transition-all duration-200
  `;

  // ─── Left panel (shared across steps) ─────────────────────────────────────
  const renderLeftPanel = () => (
    <aside className="hidden lg:flex flex-col justify-between w-[42%] h-full bg-gradient-to-b from-[#6D5DFB] to-[#4c3dd4] px-10 py-8 relative overflow-hidden flex-shrink-0">
      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Decorative plus signs */}
      <span className="absolute top-[38%] right-8 text-white/20 text-2xl font-light select-none">+</span>
      <span className="absolute top-[55%] right-14 text-white/15 text-xl font-light select-none">+</span>

      {/* Happy owl — floating in the right portion of the purple space */}
      <img
        src={happyOwl}
        alt="Happy Owl"
        className="absolute z-10 w-80 object-contain drop-shadow-2xl pointer-events-none"
        style={{ right: '40px', top: '50%', transform: 'translateY(-50%)' }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg overflow-hidden">
          <img src={symbolLogo} alt="MockMate" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <p className="text-white font-extrabold text-base leading-tight">MockMate AI</p>
          <p className="text-white/60 text-[11px] font-medium">Practice. Improve. Get Hired.</p>
        </div>
      </div>

      {/* Center copy */}
      <div className="relative z-10 space-y-7">
        <div>
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-3">
            WELCOME ABOARD 👋
          </p>
          <h2 className="text-[2.1rem] font-extrabold text-white leading-snug">
            Let's set up your<br />
            <span className="text-white/50">career</span>{' '}
            <span className="text-white">profile</span>
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mt-3 max-w-[270px]">
            Your personalized mock interview experience starts with a few details about you and your career goals.
          </p>
        </div>

        {/* Feature list */}
        <ul className="space-y-3.5">
          {FEATURES.map(f => (
            <li key={f.title} className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <span className="text-base">{f.icon}</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">{f.title}</p>
                <p className="text-white/55 text-[11px] font-medium mt-0.5">{f.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: owl + step indicator */}
      <div className="relative z-10 flex items-end justify-between">
        <img
          src={owlImg}
          alt="MockMate Owl"
          className="w-28 object-contain drop-shadow-2xl"
          style={{ transform: 'translateY(8px)' }}
        />
        {/* Step pills */}
        <div className="flex flex-col gap-1.5 pb-2">
          <div className="flex items-center gap-3">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shadow-md transition-all duration-300 ${step === s
                    ? 'bg-white text-[#6D5DFB]'
                    : step > s
                      ? 'bg-white/30 text-white'
                      : 'bg-white/15 text-white/50'
                  }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 2 && (
                  <div className={`w-10 h-0.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-white/50' : 'bg-white/20'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-white/55 text-[11px] font-semibold text-right">
            Step {step} of 2
          </p>
          <p className="text-white font-bold text-xs text-right">
            {step === 1 ? 'Profile Setup' : 'Career Setup'}
          </p>
        </div>
      </div>
    </aside>
  );

  // ─── Right panel wrapper (light bg + centered card) ────────────────────────
  const renderRightPanel = (children: React.ReactNode) => (
    <div className="w-[58%] bg-[#f0f2fa] flex items-center justify-center h-full overflow-hidden py-8 px-8">
      <div
        className={`w-full max-w-[580px] bg-white rounded-3xl shadow-[0_8px_48px_rgba(109,93,251,0.10)] overflow-hidden transition-all duration-280 ${sliding
            ? slideDir === 'left'
              ? 'opacity-0 -translate-x-6'
              : 'opacity-0 translate-x-6'
            : 'opacity-100 translate-x-0'
          }`}
      >
        {/* Progress bar */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1 bg-[#6D5DFB] transition-all duration-500" />
          <div className={`flex-1 transition-all duration-500 ${step === 2 ? 'bg-[#6D5DFB]' : 'bg-[#e8eaf0]'}`} />
        </div>

        {/* Card header */}
        <div className="px-8 pt-5 pb-3 border-b border-[#f0f2fa]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6D5DFB]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#6D5DFB] text-xl">{step === 1 ? '👤' : '💼'}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9ba3bf] uppercase tracking-widest leading-none">
                STEP {step} OF 2
              </p>
              <h1 className="text-xl font-extrabold text-[#1a1a2e] mt-1.5 leading-none">
                {step === 1 ? 'Profile Setup' : 'Career Setup'}
              </h1>
              <p className="text-[#9ba3bf] text-xs font-semibold mt-1 leading-none">
                {step === 1 ? 'Tell us a bit about yourself' : 'Share your career aspirations'}
              </p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-4">
          {children}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-8 mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 text-red-600 text-xs font-bold">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Footer */}
        <div className="px-8 pb-5 flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-bold text-[#9ba3bf] hover:text-[#6D5DFB] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {step === 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2.5 bg-[#6D5DFB] hover:bg-[#5849e0] text-white text-sm font-extrabold px-7 py-3.5 rounded-2xl shadow-lg shadow-[#6D5DFB]/30 hover:shadow-[#6D5DFB]/40 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="flex items-center gap-2.5 bg-[#6D5DFB] hover:bg-[#5849e0] text-white text-sm font-extrabold px-7 py-3.5 rounded-2xl shadow-lg shadow-[#6D5DFB]/30 hover:shadow-[#6D5DFB]/40 transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <> Launch MockMate</>
              )}
            </button>
          )}
        </div>

        {/* Skip note */}
        <p className="text-center text-[#b0b8cc] text-[11px] font-semibold pb-3">
          You can update all of this later in{' '}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-[#6D5DFB] hover:underline font-bold"
          >
            Profile Settings
          </button>
        </p>
      </div>
    </div>
  );

  // ─── STEP 1: Profile Setup ─────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Avatar grid */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-[#9ba3bf] uppercase tracking-widest">
            CHOOSE YOUR AVATAR
          </p>
          {customAvatar && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-[#6D5DFB] hover:underline"
            >
              Upload another photo
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-3">
          {AVATARS.map(av => (
            <button
              key={av.id}
              type="button"
              onClick={() => setSelectedAvatar(av.url)}
              className={`relative rounded-xl p-1 border-2 transition-all duration-200 hover:scale-105 bg-[#f8f9ff] ${selectedAvatar === av.url
                  ? 'border-[#6D5DFB] shadow-md shadow-[#6D5DFB]/20 bg-white'
                  : 'border-[#eef0f8] hover:border-[#d0d4f0]'
                }`}
            >
              <img
                src={av.url}
                alt="avatar"
                className="w-full aspect-square rounded-lg object-cover"
              />
              {selectedAvatar === av.url && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#6D5DFB] flex items-center justify-center shadow-md">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </button>
          ))}

          {/* Custom Avatar Upload Button */}
          <button
            type="button"
            onClick={() => {
              if (customAvatar) {
                setSelectedAvatar(customAvatar);
              } else {
                fileInputRef.current?.click();
              }
            }}
            className={`relative rounded-xl p-1 border-2 border-dashed transition-all duration-200 hover:scale-105 bg-[#f8f9ff] flex items-center justify-center aspect-square ${customAvatar && selectedAvatar === customAvatar
                ? 'border-[#6D5DFB] bg-white border-solid shadow-md shadow-[#6D5DFB]/20'
                : 'border-[#cbd2e0] hover:border-[#6D5DFB] hover:bg-[#6D5DFB]/5'
              }`}
          >
            {customAvatar ? (
              <img
                src={customAvatar}
                alt="Custom uploaded avatar"
                className="w-full aspect-square rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#6D5DFB] text-center">
                <span className="text-base font-extrabold leading-none">+</span>
                <span className="text-[8px] font-bold leading-none mt-1">Upload</span>
              </div>
            )}
            {customAvatar && selectedAvatar === customAvatar && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#6D5DFB] flex items-center justify-center shadow-md">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full Name + Username — 2 col */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-xs font-extrabold text-[#1a1a2e] mb-1.5">
            FULL NAME <span className="text-[#6D5DFB]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3bf]">👤</span>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="username" className="block text-xs font-extrabold text-[#1a1a2e] mb-1.5">
            USERNAME <span className="text-[#6D5DFB]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3bf] font-bold text-sm">@</span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
              placeholder="choose.username"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>
      </div>

      {/* Location & Phone Number — 2 col */}
      <div className="grid grid-cols-2 gap-4">
        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="country" className="block text-xs font-extrabold text-[#1a1a2e]">
              LOCATION <span className="text-[#6D5DFB]">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCustomLocation(!isCustomLocation);
                setCountry('');
              }}
              className="text-[11px] font-bold text-[#6D5DFB] hover:underline"
            >
              {isCustomLocation ? 'Select from list' : 'Type custom location'}
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3bf]">🌐</span>
            {isCustomLocation ? (
              <input
                id="country"
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. Thane, Maharashtra"
                className={`${inputCls} pl-9`}
              />
            ) : (
              <>
                <select
                  id="country"
                  value={country}
                  onChange={e => {
                    if (e.target.value === 'Other') {
                      setIsCustomLocation(true);
                      setCountry('');
                    } else {
                      setCountry(e.target.value);
                    }
                  }}
                  className={`${inputCls} pl-9 cursor-pointer appearance-none`}
                >
                  <option value="">Select your location</option>
                  {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="Other">✍️ Other (Type custom location)</option>
                </select>
                <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ba3bf] rotate-90 pointer-events-none" />
              </>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-extrabold text-[#1a1a2e] mb-1.5 h-[16.5px] flex items-center">
            PHONE NUMBER
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3bf]">📞</span>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>
      </div>

      {/* Optional links row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔗', label: 'LinkedIn', value: linkedinUrl, set: setLinkedinUrl, ph: 'linkedin.com/in/…' },
          { icon: '🐙', label: 'GitHub', value: githubUrl, set: setGithubUrl, ph: 'github.com/…' },
          { icon: '🌐', label: 'Portfolio', value: portfolioUrl, set: setPortfolioUrl, ph: 'yoursite.dev' },
        ].map(({ icon, label, value, set, ph }) => (
          <div key={label}>
            <label className="block text-[10px] font-extrabold text-[#9ba3bf] uppercase tracking-wider mb-1.5">
              {label}
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ba3bf] text-sm">{icon}</span>
              <input
                type="url"
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                className={`${inputCls} pl-7 text-xs py-2`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── STEP 2: Career Setup ──────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-3.5">
      {/* Target Role & Experience Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetRole" className="block text-xs font-extrabold text-[#1a1a2e] mb-1.5">
            TARGET ROLE <span className="text-[#6D5DFB]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba3bf]">🎯</span>
            <input
              id="targetRole"
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold text-[#1a1a2e] mb-1.5">
            EXPERIENCE LEVEL <span className="text-[#6D5DFB]">*</span>
          </p>
          <div className="flex bg-[#f8f9ff] border border-[#eef0f8] rounded-xl p-1 gap-1 h-[42px]">
            {EXPERIENCE_LEVELS.map(lvl => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setExpLevel(lvl.value)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center font-extrabold text-xs transition-all duration-200 ${expLevel === lvl.value
                    ? 'bg-[#6D5DFB] text-white shadow-sm'
                    : 'text-[#555e80] hover:text-[#6D5DFB] hover:bg-[#6D5DFB]/5'
                  }`}
              >
                {lvl.value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs font-extrabold text-[#1a1a2e] mb-1.5">SKILLS</p>

        {selSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 max-h-16 overflow-y-auto scrollbar-thin">
            {selSkills.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 bg-[#6D5DFB]/10 text-[#6D5DFB] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#6D5DFB]/20">
                {s}
                <button type="button" onClick={() => toggleSkill(s)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          value={skillSearch}
          onChange={e => setSkillSearch(e.target.value)}
          placeholder="Search skills..."
          className={`${inputCls} mb-2 py-2`}
        />

        {/* Horizontal scroll for skill suggestions */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filteredSkills.slice(0, 20).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSkill(s)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#f0f2fa] text-[#555e80] border border-[#e8eaf0] hover:bg-[#6D5DFB]/10 hover:border-[#6D5DFB]/25 hover:text-[#6D5DFB] transition-all flex-shrink-0"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Interview Type */}
      <div>
        <p className="text-xs font-extrabold text-[#1a1a2e] mb-1.5">
          PREFERRED INTERVIEW TYPE <span className="text-[#6D5DFB]">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {INTERVIEW_TYPES.map((t, idx) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setIntType(t.value)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border-2 transition-all duration-200 text-left ${idx === 4 ? 'col-span-2' : ''
                } ${intType === t.value
                  ? 'border-[#6D5DFB] bg-[#6D5DFB]/5 text-[#6D5DFB]'
                  : 'border-[#eef0f8] hover:border-[#d0d4f0] bg-[#f8f9ff] text-[#1a1a2e]'
                }`}
            >
              <span className="text-xl flex-shrink-0">{t.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold truncate leading-tight">
                  {t.label}
                </p>
                <p className="text-[10px] text-[#9ba3bf] font-semibold truncate leading-none mt-1">{t.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${intType === t.value ? 'border-[#6D5DFB] bg-[#6D5DFB]' : 'border-[#c8cde0]'
                }`}>
                {intType === t.value && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Career Goal */}
      <div>
        <label htmlFor="careerGoal" className="block text-xs font-extrabold text-[#1a1a2e] mb-1.5">
          CAREER GOAL
        </label>
        <textarea
          id="careerGoal"
          value={careerGoal}
          onChange={e => setCareerGoal(e.target.value)}
          placeholder="e.g. Land a senior role at a top tech company in 6 months..."
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>
    </div>
  );

  // ─── Mobile View ────────────────────────────────────────────────────────────
  const renderMobileView = () => {
    const mobileAvatars = [
      { id: 'av1', url: avatar1 },
      { id: 'av2', url: avatar2 },
      { id: 'av3', url: avatar3 },
      { id: 'av4', url: avatar4 },
      { id: 'av5', url: avatar5 },
      { id: 'av6', url: avatar6 },
      { id: 'av7', url: avatar7 },
      { id: 'av_owl', url: happyOwl },
    ];

    return (
      <div className="w-full max-w-md mx-auto flex flex-col h-full justify-between pb-2">
        {/* Mobile Header / Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 justify-center">
            <img src={happyOwl} alt="MockMate" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black text-slate-800">
              MockMate <span className="text-violet-600">AI</span>
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
            Your AI Interview Companion
          </p>
        </div>

        {/* Mobile Stepper Indicator */}
        <div className="mt-6 flex flex-col items-center w-full max-w-[280px] mx-auto">
          <div className="flex items-center justify-between w-full relative">
            {/* Background gray line connecting the circles */}
            <div className="absolute left-[16px] right-[16px] h-[3px] bg-slate-100 top-1/2 -translate-y-1/2 z-0" />
            {/* Active colored line */}
            <div 
              className="absolute left-[16px] h-[3px] bg-violet-600 top-1/2 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ 
                width: step === 1 ? '0%' : 'calc(100% - 32px)' 
              }}
            />

            {/* Step 1 Circle */}
            <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 shadow-sm ${
              step >= 1 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>

            {/* Step 2 Circle */}
            <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 shadow-sm ${
              step === 2 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-between w-full mt-2 text-[10px] font-black uppercase tracking-wider px-1">
            <span className={step >= 1 ? 'text-violet-600' : 'text-slate-400'}>
              Profile Setup
            </span>
            <span className={step === 2 ? 'text-violet-600' : 'text-slate-400'}>
              Career Setup
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-8 text-left">
          <h2 className="text-[25px] font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
            {step === 1 ? (
              <>Let's set your profile 👋</>
            ) : (
              <>Let's set your career 🚀</>
            )}
          </h2>
          {step === 2 && (
            <p className="text-slate-400 font-medium text-[13px] leading-relaxed mt-2">
              Tell us about your target role and experience to customize your questions.
            </p>
          )}
        </div>

        {/* Errors */}
        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-xs font-bold">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form Body */}
        {step === 1 ? (
          <div className="mt-6 space-y-6">
            {/* Choose your avatar */}
            <div>
              <p className="text-[11px] font-black text-slate-800 tracking-wider uppercase mb-3">
                Choose your avatar
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {mobileAvatars.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative rounded-2xl p-0.5 border-2 transition-all duration-200 bg-[#FAF9FF] ${
                      selectedAvatar === av.url
                        ? 'border-violet-600 shadow-md shadow-violet-500/10'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt="avatar"
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                    {selectedAvatar === av.url && (
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-extrabold text-[#555e80] tracking-wider uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-extrabold text-[#555e80] tracking-wider uppercase">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                    placeholder="choose.username"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-extrabold text-[#555e80] tracking-wider uppercase">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 font-semibold text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select your country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {/* Target Role */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-extrabold text-[#555e80] tracking-wider uppercase">Target Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                  required
                />
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-extrabold text-[#555e80] tracking-wider uppercase">Experience Level</label>
              <div className="flex bg-[#FAF9FF] border border-slate-200/80 rounded-2xl p-0.5 gap-1 w-full">
                {EXPERIENCE_LEVELS.map(lvl => (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setExpLevel(lvl.value)}
                    className={`flex-1 py-1.5 rounded-xl text-center font-extrabold text-[11px] transition-all duration-200 ${
                      expLevel === lvl.value
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-[#555e80] hover:text-violet-600'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold text-[#555e80] tracking-wider uppercase">Skills</label>
                {selSkills.length > 0 && (
                  <span className="text-[9px] text-slate-400 font-bold">{selSkills.length} added</span>
                )}
              </div>
              <div className="relative">
                <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value=""
                  onChange={e => {
                    const skill = e.target.value;
                    if (skill && !selSkills.includes(skill)) {
                      setSelSkills([...selSkills, skill]);
                    }
                  }}
                  className="w-full pl-10 pr-10 py-2 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 font-semibold text-sm appearance-none cursor-pointer"
                >
                  <option value="">Choose a skill to add...</option>
                  {ALL_SKILLS.filter(s => !selSkills.includes(s)).map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
              {selSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 max-h-[38px] overflow-y-auto scrollbar-thin">
                  {selSkills.map(s => (
                    <span key={s} className="inline-flex items-center gap-0.5 bg-violet-600/10 text-violet-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-violet-600/20">
                      {s}
                      <button type="button" onClick={() => toggleSkill(s)} className="hover:text-red-500 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Interview Type */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-extrabold text-[#555e80] tracking-wider uppercase">Preferred Interview Type</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">⚙️</span>
                <select
                  value={intType}
                  onChange={e => setIntType(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 font-semibold text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select interview format</option>
                  {INTERVIEW_TYPES.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label} ({t.desc})
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Career Goal */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-extrabold text-[#555e80] tracking-wider uppercase">Career Goal</label>
              <input
                type="text"
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                placeholder="e.g. Land a senior role in 6 months..."
                className="w-full px-4 py-2 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
              />
            </div>
          </div>
        )}

        {/* Mobile Continue/Submit Button */}
        <button
          type="button"
          onClick={step === 1 ? goNext : handleFinish}
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-violet-500/20 mt-4 cursor-pointer text-sm"
        >
          {step === 1 ? (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <>
                <span>Launch MockMate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )
          )}
        </button>

        {/* Footer Navigation */}
        {step === 1 ? (
          <p className="text-center text-slate-400 text-xs font-semibold mt-4">
            You can update all of this later in{' '}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-violet-600 hover:underline font-bold"
            >
              Profile Settings
            </button>
          </p>
        ) : (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Desktop & Tablet View */}
      <div className="hidden lg:flex h-screen w-full overflow-hidden">
        {renderLeftPanel()}
        {renderRightPanel(
          step === 1 ? renderStep1() : renderStep2()
        )}
      </div>

      {/* Mobile & Small Screens View */}
      <div className="block lg:hidden h-screen w-full bg-white overflow-hidden px-6 py-6 flex flex-col">
        {renderMobileView()}
      </div>
    </>
  );
};
