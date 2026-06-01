import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, TrendingUp, Target, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import symbolLogo from '../assets/Symbol_logo.png';
import moxMascot from '../assets/Owl_with_laptop.png';

declare global {
  interface Window {
    google?: any;
  }
}

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError('Google Sign-In is loading or could not be loaded. Please refresh.');
      return;
    }

    setError('');

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '1049735994710-724sfs8hthpfd0p9lnbfnjhhq0jbakdj.apps.googleusercontent.com',
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            setSubmitting(true);
            try {
              const res = await loginWithGoogle(tokenResponse.access_token);
              if (res && res.onboardingCompleted) {
                navigate('/dashboard');
              } else {
                navigate('/profile?firstTime=true');
              }
            } catch (err: any) {
              setError(err.message || 'Google Sign-In failed. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }
        },
        error_callback: (err: any) => {
          setError('Google authentication failed. Please try again.');
          console.error(err);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      console.error(err);
      setError('Could not initialize Google authentication.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setError('Please fill in all fields.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/profile?firstTime=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── MOBILE VIEW (Unchanged) ── */}
      <div className="lg:hidden h-[100dvh] w-full flex flex-col justify-between bg-gradient-to-b from-[#EEEBFF] via-[#FAF9FF] to-white relative overflow-hidden select-none">

        {/* Dynamic mesh glow blobs in background */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/4 w-[40%] h-[40%] bg-fuchsia-400/10 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Top Header Logo */}
        <header className="flex items-center justify-start px-6 pt-8 pb-2 z-20 w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <img src={symbolLogo} alt="MockMate AI Logo" className="h-8 w-auto object-contain" />
            <span className="text-slate-900 font-black text-base sm:text-lg tracking-tight">
              MockMate <span className="text-violet-600">AI</span>
            </span>
          </Link>
        </header>

        {/* Mascot & Floating Cards container */}
        <div className="relative w-full flex items-center justify-center py-6 min-h-[220px] max-h-[280px] max-w-md mx-auto z-20">
          <div className="relative w-full max-w-[280px] flex items-center justify-center">
            {/* Owl Glow Background */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />

            {/* Owl Mascot Image */}
            <img
              src={moxMascot}
              alt="Mox Mascot"
              className="w-[200px] h-auto object-contain drop-shadow-2xl z-10"
              style={{ filter: 'drop-shadow(0 0 28px rgba(124, 58, 237, 0.45))' }}
            />

            {/* FLOATING CARD 1: Track Progress */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute top-2 left-[-24px] z-20 bg-white/95 border border-slate-200/50 shadow-lg rounded-2xl p-2 px-3 flex items-center gap-2 hover:scale-[1.03] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight pr-1">
                <div className="text-[10px] font-black text-slate-800">Track</div>
                <div className="text-[8px] text-slate-400 font-bold">Progress</div>
              </div>
            </motion.div>

            {/* FLOATING CARD 2: Improve Score */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1 right-[-24px] z-20 bg-white/95 border border-slate-200/50 shadow-lg rounded-2xl p-2 px-3 flex items-center gap-2 hover:scale-[1.03] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight pr-1">
                <div className="text-[10px] font-black text-slate-800">Improve</div>
                <div className="text-[8px] text-slate-400 font-bold">Score</div>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: AI Feedback */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 left-[-28px] z-20 bg-white/95 border border-slate-200/50 shadow-lg rounded-2xl p-2 px-3 flex items-center gap-2 hover:scale-[1.03] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 fill-violet-500/10" />
              </div>
              <div className="text-left leading-tight pr-1">
                <div className="text-[10px] font-black text-slate-800">AI</div>
                <div className="text-[8px] text-slate-400 font-bold">Feedback</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="hidden sm:block text-center px-6 mt-2 mb-4 w-full max-w-md mx-auto z-20">
          <h1 className="text-[25px] font-black leading-tight text-slate-900 tracking-tight">
            Practice Smarter.<br />
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Get Hired Faster.
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-2.5 leading-relaxed max-w-sm mx-auto">
            Realistic mock interviews, AI feedback, and personalized insights to ace your next interview.
          </p>
        </div>

        {/* White Form Card Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-t-[36px] sm:rounded-[32px] sm:border border-t border-white/40 sm:border-white/50 shadow-[0_-8px_30px_rgba(99,102,241,0.04)] sm:shadow-lg px-6 pt-8 pb-10 flex-1 sm:flex-initial w-full max-w-md mx-auto z-20 mb-0 sm:mb-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Google Social SSO */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 w-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-full transition-all active:scale-[0.98] cursor-pointer text-xs shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* SSO Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50/75 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold flex items-start gap-2 shadow-sm animate-fade-in">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Registration Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF9FF] border border-slate-300 rounded-full focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF9FF] border border-slate-300 rounded-full focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (Min 6 chars)"
                    className="w-full pl-11 pr-11 py-3 bg-[#FAF9FF] border border-slate-300 rounded-full focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-sm cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>{submitting ? 'Creating account...' : 'Create your account'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Create Account Navigation */}
          <div className="text-center pt-6 pb-2">
            <span className="text-xs text-slate-500 font-semibold">Already have an account? </span>
            <Link
              to="/login"
              className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Sign In
            </Link>
          </div>

        </div>

      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden lg:flex h-screen w-full bg-white select-none overflow-hidden">

        {/* LEFT PANE */}
        <div className="w-[50vw] h-full bg-gradient-to-br from-[#DDD6FE] via-[#EDE9FE] to-[#F5F3FF] relative flex flex-col justify-between p-12 overflow-hidden border-r border-slate-100">
          {/* Glow blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-violet-400/25 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-indigo-400/25 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Top Header Logo */}
          <header className="flex items-center justify-start z-20">
            <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
              <img src={symbolLogo} alt="MockMate AI Logo" className="h-11 w-auto object-contain" />
              <span className="text-slate-900 font-black text-xl tracking-tight">
                MockMate <span className="text-violet-600">AI</span>
              </span>
            </Link>
          </header>

          {/* Middle Content */}
          <div className="my-auto z-20 max-w-md mx-auto flex flex-col justify-center items-start w-full transform -translate-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-extrabold rounded-full tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-violet-500 fill-violet-500/10" />
              Your AI Interview Coach
            </div>

            {/* Heading */}
            <h1 className="text-[44px] font-black tracking-tight leading-[1.1] text-slate-900 mt-6">
              Practice Smarter.<br />
              <span className="text-violet-600">Get Hired Faster.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-500 text-sm font-semibold mt-4 leading-relaxed max-w-sm">
              Realistic mock interviews, AI feedback, and personalized insights to help you ace your next interview.
            </p>

            {/* Mascot and floaters */}
            <div className="relative w-full max-w-[360px] mx-auto mt-16 flex items-center justify-center">
              {/* Owl glow background */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />

              {/* Mascot */}
              <img
                src={moxMascot}
                alt="Mox Mascot"
                className="w-[275px] h-auto object-contain drop-shadow-2xl z-10"
                style={{ filter: 'drop-shadow(0 0 32px rgba(124, 58, 237, 0.45))' }}
              />

              {/* Floater 1: Improve (top left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-[-20px] -left-16 z-20 bg-white border border-slate-100/80 shadow-lg rounded-2xl p-2.5 px-4 flex items-center gap-2.5 hover:scale-[1.03] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight pr-1">
                  <div className="text-xs font-black text-slate-800">Improve</div>
                  <div className="text-[10px] text-slate-400 font-bold">Your Score</div>
                </div>
              </motion.div>

              {/* Floater 2: Boost (middle right) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/2 -right-20 -translate-y-1/2 z-20 bg-white border border-slate-100/80 shadow-lg rounded-2xl p-2.5 px-4 flex items-center gap-2.5 hover:scale-[1.03] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Sparkles className="w-5 h-5 fill-amber-500/10" />
                </div>
                <div className="text-left leading-tight pr-1">
                  <div className="text-xs font-black text-slate-800">Boost</div>
                  <div className="text-[10px] text-slate-400 font-bold">Confidence</div>
                </div>
              </motion.div>

              {/* Floater 3: Track (bottom left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-20 z-20 bg-white border border-slate-100/80 shadow-lg rounded-2xl p-2.5 px-4 flex items-center gap-2.5 hover:scale-[1.03] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight pr-1">
                  <div className="text-xs font-black text-slate-800">Track</div>
                  <div className="text-[10px] text-slate-400 font-bold">Progress</div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Footer space to balance */}
          <div className="h-6" />
        </div>

        {/* RIGHT PANE */}
        <div className="w-[50vw] h-full bg-white flex flex-col justify-center p-16 relative overflow-y-auto">
          <div className="w-full max-w-[400px] mx-auto text-left">
            {/* Greeting */}
            <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight mb-2 flex items-center gap-2">
              Create your account! <span className="animate-bounce"></span>
            </h2>
            <p className="text-xs font-bold text-slate-400 tracking-wide mb-8">
              Join thousands of professionals acing their interviews
            </p>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50/75 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2 shadow-sm animate-fade-in mb-4">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (Min 6 chars)"
                    className="w-full pl-11 pr-11 py-3.5 bg-[#FAF9FF] border border-slate-200/80 rounded-2xl focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-semibold text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-sm cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>{submitting ? 'Creating account...' : 'Create your account'}</span>
                </button>
              </div>

            </form>

            {/* SSO Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">OR CONTINUE WITH</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              {/* Google Social SSO */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2.5 w-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer text-xs shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Create Account bottom text */}
            <div className="text-center mt-8">
              <span className="text-xs text-slate-400 font-bold">Already have an account? </span>
              <Link to="/login" className="text-xs font-black text-violet-600 hover:text-violet-700 transition-colors">
                Sign In
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};
