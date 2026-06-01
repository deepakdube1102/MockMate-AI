import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Github,
  Linkedin,
  Trophy,
  TrendingUp,
  FileText,
  MessageSquare,
  Check,
  Bot,
  BarChart3,
  Calendar,
  Star,
  Target,
  Zap,
  Users,
} from 'lucide-react';
import logoImg from '../assets/Horizontal_logo.png';
import symbolLogo from '../assets/Symbol_logo.png';
import owlWithLaptop from '../assets/Owl_with_laptop.png';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Software Engineer at Google",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "MockMate was a game changer for me. The behavioral mock questions were exactly what I faced in my actual loop. Mox gave me critical tips to structure my answers!"
    },
    {
      name: "David Chen",
      role: "Product Manager at Stripe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      text: "The resume analyzer matched me perfectly with industry-standard product criteria. The detailed metrics chart showed my confidence scoring growing over a week."
    },
    {
      name: "Elena Rostova",
      role: "Backend Lead at Linear",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      text: "I loved the live code-feedback panel. Preparing with real-time analytics helped me calm my nerves and land an incredible lead role!"
    }
  ];

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-violet-100 text-violet-600',
      title: "AI Mock Interviews",
      description: "Practice role-specific interviews with our AI interviewer.",
      learn: true,
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      title: "Smart Feedback",
      description: "Get instant, detailed feedback on your answers.",
      learn: true,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      title: "Performance Insights",
      description: "Track your progress with advanced analytics and insights.",
      learn: true,
    },
    {
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-500',
      title: "Interview Resources",
      description: "Access curated resources to boost your interview skills.",
      learn: true,
    },
  ];

  const pricing = [
    {
      tier: "Basic Prep",
      price: "$0",
      period: "forever free",
      description: "Kickstart your prep journey with essential AI resources.",
      features: [
        "2 AI Mock Interviews monthly",
        "Basic resume keyword feedback",
        "Entry-level general role templates",
        "7-day performance logs history"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      tier: "Pro Prep",
      price: "$19",
      period: "per month",
      description: "Unlock absolute dominance in technical and behavioral rounds.",
      features: [
        "Unlimited AI Mock interviews",
        "Deep Resume Parser & skill-gap reports",
        "Custom difficulty & time duration setup",
        "Granular metrics & speech analytics",
        "Personalized improvement suggestions"
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      tier: "Enterprise",
      price: "Custom",
      period: "tailored billing",
      description: "Scale premium engineering prep across university/bootcamp groups.",
      features: [
        "Custom administrative panels",
        "Bulk seat licenses & group metrics",
        "Bespoke company-specific question banks",
        "Dedicated account support",
        "Unlimited exports & integrations"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does MockMate AI simulate realistic rounds?",
      answer: "We leverage state-of-the-art Large Language Models customized with hundreds of top tech company rubrics. Mox, your digital coach, dynamically adjusts difficulty based on your answers."
    },
    {
      question: "Can I parse my resume and get specific role blueprints?",
      answer: "Absolutely! Simply drag and drop your resume file inside our Resume Analyzer. The system reads your core skills, extracts key projects, and builds specialized mock session modules."
    },
    {
      question: "Is there support for behavioral and technical interviews?",
      answer: "Yes, MockMate supports multiple interview tracks: Technical, HR, Behavioral, and Mixed. You can select your preference before starting any session."
    },
    {
      question: "Can I access my practice statistics over time?",
      answer: "Definitely. In your Profile Settings, you have access to an Interview Score Trend chart which visually monitors your performance changes across all sessions."
    }
  ];


  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-violet-500/20 selection:text-violet-900 overflow-x-hidden antialiased">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}>
            <img src={logoImg} alt="MockMate AI" className="h-16 w-auto" />
          </div>

          {/* CTA Buttons (Only Get Started / Go to Dashboard remains) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-full shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-full shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started Free
              </button>
            )}
          </div>


        </div>
      </header>


      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white lg:min-h-[85vh] flex items-center">
        {/* Background mesh aurora curvy wave */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base background solid to soft gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF5FF] via-white to-white" />

          {/* Curvy Fluid Wave SVG */}
          <svg className="absolute bottom-0 right-0 w-full h-[85%] pointer-events-none" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
            {/* Soft blurred wave shape to create a rich, curvy fluid edge */}
            <path
              d="M-100 800 C 300 800, 450 700, 680 500 C 950 250, 1150 150, 1540 80 L 1540 800 Z"
              fill="url(#waveFluidGradient)"
              filter="url(#waveBlur)"
              opacity="0.75"
            />

            {/* Additional overlay wave for rich blending and depth */}
            <path
              d="M200 800 C 500 850, 700 680, 950 480 C 1150 300, 1300 200, 1540 120 L 1540 800 Z"
              fill="url(#waveIndigoGradient)"
              filter="url(#waveBlur)"
              opacity="0.62"
            />

            <defs>
              {/* Gaussian Blur Filter for the organic paint effect */}
              <filter id="waveBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="80" />
              </filter>

              {/* Rich primary wave gradient */}
              <linearGradient id="waveFluidGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3730A3" />
                <stop offset="30%" stopColor="#4F46E5" />
                <stop offset="60%" stopColor="#7C3AED" />
                <stop offset="85%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>

              {/* Deep secondary wave gradient */}
              <linearGradient id="waveIndigoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#312E81" />
                <stop offset="50%" stopColor="#4338CA" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Soft top-right highlight */}
          <div className="absolute -top-[15%] right-[5%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-[#E9D5FF] to-[#C084FC] opacity-35 blur-[100px]" />

          {/* Elegant background grid overlay */}
          <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* ── MOBILE HERO (visible only below lg) ─────────────────────────── */}
        <div className="block lg:hidden relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-between" style={{ background: 'linear-gradient(160deg, #0d0517 0%, #130a2e 40%, #1a0a3d 70%, #0f0520 100%)' }}>

          {/* Background glow blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="absolute bottom-1/3 left-0 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
          <div className="absolute top-1/2 right-4 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

          {/* Mobile Navbar */}
          <header className="flex items-center justify-between px-5 pt-[calc(1.85rem+env(safe-area-inset-top))] pb-3 w-full max-w-md mx-auto z-30">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={symbolLogo} alt="MockMate AI" className="h-15 w-auto object-contain" />
              <span className="text-white font-black text-2xl tracking-tight">MockMate <span className="text-violet-400">AI</span></span>
            </div>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-900/40 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </header>

          {/* Main content wrapper */}
          <div className="flex-1 flex flex-col justify-between px-5 py-4 w-full max-w-[min(100%,480px)] mx-auto z-20 gap-[clamp(16px,3.5vh,32px)]">

            {/* Heading & Subtitle */}
            <div className="w-full text-center sm:text-left mt-[clamp(8px,2vh,20px)]">
              <h1 className="text-[clamp(2.2rem,8.8vw,3.6rem)] font-black leading-[1.06] tracking-tight text-white mb-3">
                Ace Every Interview<br />with{" "}
                <span style={{ background: 'linear-gradient(90deg, #c084fc, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  MockMate AI
                </span>
              </h1>
              <p className="text-slate-400 text-[clamp(1.05rem,3.2vw,1.3rem)] font-medium leading-relaxed max-w-xs mx-auto sm:mx-0">
                Realistic AI interviews, personalized feedback, and smart insights to help you land your dream job.
              </p>
            </div>

            {/* Mascot & Floating Cards container */}
            <div className="flex-1 w-full relative flex items-center justify-center my-[clamp(4px,1.5vh,16px)] min-h-[220px] max-h-[460px]">
              <div className="relative w-full h-full max-w-[clamp(290px,80vw,455px)] mx-auto flex items-center justify-center">
                {/* Owl glow */}
                <div className="absolute inset-0 rounded-full blur-3xl opacity-35 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />

                {/* Owl mascot */}
                <img
                  src={owlWithLaptop}
                  alt="MockMate AI Mascot"
                  className="w-[clamp(270px,55vw,410px)] h-auto object-contain drop-shadow-2xl z-10"
                  style={{ filter: 'drop-shadow(0 0 32px rgba(124,58,237,0.5))' }}
                />

                {/* Floating Card 1: Interview Score (top left) */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute top-[-8px] left-[clamp(-32px,-6vw,-12px)] z-20 rounded-xl p-[clamp(12px,3vw,16px)] w-[clamp(165px,40vw,205px)]"
                  style={{ background: 'rgba(20,10,45,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 15px rgba(124,58,237,0.2)' }}
                >
                  <div className="text-[clamp(11px,3vw,13px)] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7c3aed" strokeWidth="3.5"
                          strokeDasharray="73 27" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[clamp(12px,3.5vw,16px)] font-black text-white">73%</div>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-bold text-[clamp(10px,2.8vw,12px)] leading-tight">↑12%</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 2: Next Interview (top right) */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-2 right-[clamp(-32px,-6vw,-12px)] z-20 rounded-xl p-[clamp(12px,3vw,16px)] w-[clamp(165px,40vw,205px)]"
                  style={{ background: 'rgba(20,10,45,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 15px rgba(124,58,237,0.2)' }}
                >
                  <div className="text-[clamp(11px,3vw,13px)] font-bold text-slate-400 uppercase tracking-wider mb-1">Next</div>
                  <div className="flex items-center gap-2">
                    <div className="w-[clamp(28px,8vw,38px)] h-[clamp(28px,8vw,38px)] rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.3)' }}>
                      <Calendar className="w-4.5 h-4.5 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[clamp(12px,3.5vw,15px)] font-black text-white leading-tight truncate">Frontend Dev</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 4: Progress Tracking (bottom right) */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute bottom-2 right-[clamp(-32px,-6vw,-12px)] z-20 rounded-xl p-[clamp(12px,3vw,16px)] w-[clamp(165px,40vw,205px)]"
                  style={{ background: 'rgba(20,10,45,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 15px rgba(124,58,237,0.2)' }}
                >
                  <div className="text-[clamp(11px,3vw,13px)] font-bold text-slate-400 uppercase tracking-wider mb-1">Analytics</div>
                  <div className="flex items-center gap-2">
                    <div className="w-[clamp(28px,8vw,38px)] h-[clamp(28px,8vw,38px)] rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Target className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[clamp(12px,3.5vw,15px)] font-black text-white leading-tight">Track Progress</div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Bottom CTA */}
            <div className="w-full flex flex-col items-center pt-2 -mt-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] space-y-4 transform -translate-y-12 z-30">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-[min(90%,420px)] h-[clamp(52px,7vh,68px)] flex items-center justify-center rounded-full text-white font-black text-[clamp(14px,3.5vw,17px)] transition-all cursor-pointer shadow-lg active:scale-95 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #5b21b6 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.45)' }}
              >
                <span>Start Free Practice</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── DESKTOP HERO (visible only on lg and above) ──────────────────── */}
        <div className="hidden lg:grid relative w-full max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-36 grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 border border-violet-200/60 text-violet-600 text-xs sm:text-sm font-extrabold rounded-full tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              Your AI-Powered Interview Coach
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.02] text-slate-900">
              Ace Every Interview<br />
              with <span className="text-violet-600">MockMate AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
              Realistic AI interviews. Personalized feedback. Smart insights. Everything you need to land your dream job.
            </p>

            {/* CTAs */}
            <div className="flex justify-start">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[size:200%_auto] hover:bg-right text-white text-base sm:text-lg font-black rounded-full shadow-[0_10px_35px_rgba(124,58,237,0.35)] hover:shadow-[0_15px_40px_rgba(124,58,237,0.5)] border border-violet-500/20 transition-all duration-500 hover:-translate-y-0.5 flex items-center justify-center cursor-pointer relative overflow-hidden group"
              >
                {/* Glass shine sweep reflection */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                <span className="relative z-10 flex items-center gap-2">
                  Start Free Practice
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </button>
            </div>

            {/* 3 mini feature bullets */}
            <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 pt-3">
              {[
                { icon: <Star className="w-4.5 h-4.5 text-violet-500 fill-current" />, text: 'AI-Powered Feedback', sub: 'Instant & actionable' },
                { icon: <Target className="w-4.5 h-4.5 text-violet-500" />, text: 'Realistic Interviews', sub: 'Role-specific questions' },
                { icon: <BarChart3 className="w-4.5 h-4.5 text-violet-500" />, text: 'Track Your Progress', sub: 'Detailed performance insights' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 bg-violet-50 border border-violet-100/50 rounded-xl flex items-center justify-center shadow-sm">
                    {b.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black text-slate-800">{b.text}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-semibold">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Mascot + Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center lg:translate-x-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -left-2 top-16 z-20 bg-white rounded-2xl shadow-xl border border-slate-100/80 p-4 w-46"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Interview Score</div>
              {/* Circular gauge */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#EDE9FE" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7C3AED" strokeWidth="3"
                      strokeDasharray="73 27" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-violet-700">73%</div>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">73%</div>
                  <div className="text-[10px] text-emerald-500 font-bold">+12% vs last week</div>
                </div>
              </div>
              {/* Strong areas */}
              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Strong Areas</div>
                {['Problem Solving', 'Communication', 'System Design'].map(a => (
                  <div key={a} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-violet-500 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mascot image */}
            <div className="relative z-10 mx-auto">
              <img
                src={owlWithLaptop}
                alt="MockMate AI Mascot"
                className="w-[320px] sm:w-[400px] lg:w-[480px] h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Floating card: Next Interview (top right) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-8 top-4 z-20 bg-white rounded-2xl shadow-xl border border-slate-100/80 p-3.5 w-50"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Next Interview</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 leading-tight">Frontend Developer</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">in 2 days</div>
                </div>
              </div>
            </motion.div>

            {/* Floating card: Recent Feedback (bottom right) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-12 bottom-12 z-20 bg-white rounded-2xl shadow-xl border border-slate-100/80 p-3.5 w-54"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Feedback</div>
              <p className="text-[10px] font-semibold text-slate-600 leading-relaxed italic">
                "Great explanation of concepts! Add more real-world examples."
              </p>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" />)}
                <Star className="w-3.5 h-3.5 text-slate-200 fill-current" />
              </div>
            </motion.div>

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-[45%] text-violet-300">
              <Sparkles className="w-5 h-5 opacity-50" />
            </div>
            <div className="absolute bottom-16 left-[38%] text-indigo-300">
              <Zap className="w-4 h-4 opacity-40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DESKTOP-ONLY SECTIONS (hidden on mobile) ──────────────────────── */}
      <div className="hidden lg:block">

        {/* ── TRUST BAR ──────────────────────────────────────────────────────── */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white border border-[#ECEEF4]/60 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-8">

              {/* Left label */}
              <div className="flex items-center gap-6 w-full lg:w-auto">
                <p className="text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider max-w-[200px] leading-relaxed">
                  Trusted by aspiring professionals from top companies
                </p>
                <div className="hidden lg:block w-px h-12 bg-slate-200/80" />
              </div>

              {/* Middle: Brand Logos */}
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 flex-1">
                {[
                  { name: 'Google', font: 'font-sans font-bold text-slate-400 text-xl tracking-tight' },
                  { name: 'amazon', font: 'font-serif font-black text-slate-400 text-xl italic' },
                  { name: 'Microsoft', font: 'font-sans font-semibold text-slate-400 text-lg' },
                  { name: 'Adobe', font: 'font-sans font-extrabold text-slate-400 text-lg tracking-wider' },
                  { name: 'tcs', font: 'font-sans font-black text-slate-400 text-base uppercase tracking-widest' },
                ].map(brand => (
                  <span key={brand.name} className={`${brand.font} select-none cursor-default hover:text-slate-600 transition-colors`}>
                    {brand.name}
                  </span>
                ))}
              </div>

              {/* Right: Avatar group */}
              <div className="flex items-center gap-3 bg-violet-50/50 px-4 py-2.5 rounded-2xl border border-violet-100/40">
                <div className="flex -space-x-2">
                  {[
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikhil',
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
                  ].map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="User Face"
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex-shrink-0"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white flex-shrink-0 select-none">
                    10K+
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-800 leading-tight">10K+ Practiced</div>
                  <div className="text-[9px] text-slate-400 font-semibold leading-tight">Interviews Practiced</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-6 space-y-14">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold rounded-full">
                Why MockMate AI?
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Everything You Need to Succeed
              </h2>
              <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">
                AI-driven tools and insights to help you prepare, practice, and perform your best.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1">{feat.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{feat.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 mt-auto"
                  >
                    Learn more <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold rounded-full">
                Simple 3-Step Process
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                From Signup to Interview Ready
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
              <div className="hidden lg:block absolute top-[28px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200" />
              {[
                { num: '01', title: 'Setup Your Profile', desc: 'Select your target role, experience level, and upload your resume to create a personalized prep plan.' },
                { num: '02', title: 'Start AI Session', desc: 'Take realistic mock interviews powered by AI. Answer technical, behavioral, or HR questions in real time.' },
                { num: '03', title: 'Review & Improve', desc: 'Get instant detailed feedback and track your progress with score trends and performance analytics.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                    {step.num}
                  </div>
                  <h3 className="text-base font-black text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
        <section className="bg-white py-12 border-t border-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: '10K+',
                label: 'Interviews Practiced',
                icon: <Users className="w-5 h-5 text-violet-600" />,
                color: 'bg-violet-100/60',
              },
              {
                value: '95%',
                label: 'User Satisfaction',
                icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
                color: 'bg-emerald-100/60',
              },
              {
                value: '4.9/5',
                label: 'Average Rating',
                icon: <Star className="w-5 h-5 text-amber-500 fill-current" />,
                color: 'bg-amber-100/60',
              },
              {
                value: '50+',
                label: 'Roles Supported',
                icon: <Trophy className="w-5 h-5 text-sky-600" />,
                color: 'bg-sky-100/60',
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-[#ECEEF4]/60 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-md transition-all flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{s.value}</div>
                  <div className="text-xs font-semibold text-slate-400 leading-tight mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-6 space-y-14">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold rounded-full">
                Candidate Success
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Recommended by Top Engineers
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((test, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />)}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed flex-1">"{test.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50" />
                    <div>
                      <div className="text-xs font-black text-slate-900">{test.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-14">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold rounded-full">
                Pricing
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Simple, Transparent Plans
              </h2>
              <p className="text-slate-500 text-sm font-medium">No commitments. Start free and upgrade when ready.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {pricing.map((plan, idx) => (
                <div key={idx} className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative shadow-sm transition-all duration-300 hover:scale-[1.01] ${plan.popular ? 'border-violet-500 ring-2 ring-violet-500/10 scale-[1.02] shadow-md' : 'border-slate-100'
                  }`}>
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-[9px] font-black tracking-widest rounded-full uppercase shadow-sm">
                      Most Popular
                    </span>
                  )}
                  <div className="space-y-5 text-left">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{plan.tier}</h3>
                      <p className="text-slate-400 text-xs font-medium mt-0.5">{plan.description}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium">/ {plan.period}</span>
                    </div>
                    <ul className="space-y-3 pt-5 border-t border-slate-50">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-8">
                    <button
                      onClick={() => navigate(user ? '/dashboard' : '/register')}
                      className={`w-full py-3.5 text-sm font-bold rounded-xl transition-all ${plan.popular
                          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-[#FAFAFA]">
          <div className="max-w-3xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isActive = activeFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(isActive ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                    >
                      <span className="text-sm font-bold text-slate-900 leading-snug">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-violet-600' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-5 text-slate-500 text-sm font-medium leading-relaxed border-t border-slate-50 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 text-white text-center py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready to Land Your Dream Job?</h2>
            <p className="text-white/75 text-sm font-medium leading-relaxed">
              Join thousands of successful engineers who prepared with MockMate AI and landed offers at top companies.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-violet-700 text-sm font-black rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
            >
              Get Started for Free →
            </button>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <footer className="border-t border-slate-100 bg-white py-10 text-slate-500 text-xs font-medium">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={symbolLogo} alt="MockMate AI" className="h-7 w-auto" />
              <span className="font-black text-slate-900 tracking-tight text-sm">MockMate AI</span>
            </div>
            <div className="flex items-center gap-6">
              <span>© 2026 MockMate AI Inc. All rights reserved.</span>
              <a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-violet-600 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-violet-600 transition-colors"><Github className="w-4 h-4" /></a>
            </div>
          </div>
        </footer>

      </div>{/* end desktop-only sections */}

    </div>
  );
};
