import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, BarChart2, ChevronDown, LogOut, User, Sparkles, Trophy, Play } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const FloatingHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const getPageTag = () => {
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          icon: <BarChart2 className="w-4.5 h-4.5" />
        };
      case '/profile':
        return {
          title: 'Profile',
          icon: <User className="w-4.5 h-4.5" />
        };
      case '/studio':
        return {
          title: 'Interview Studio',
          icon: <Briefcase className="w-4.5 h-4.5" />
        };
      case '/resume':
        return {
          title: 'Resume Analyzer',
          icon: <Sparkles className="w-4.5 h-4.5" />
        };
      case '/results':
        return {
          title: 'Results',
          icon: <Trophy className="w-4.5 h-4.5" />
        };
      default:
        if (pathname.includes('/studio/')) {
          return {
            title: 'Category Details',
            icon: <Briefcase className="w-4.5 h-4.5" />
          };
        }
        if (pathname.includes('/report')) {
          return {
            title: 'Interview Report',
            icon: <Trophy className="w-4.5 h-4.5" />
          };
        }
        if (pathname.includes('/interviews/')) {
          return {
            title: 'Interview Session',
            icon: <Play className="w-4.5 h-4.5" />
          };
        }
        return null;
    }
  };

  const pageTag = getPageTag();

  return (
    <div className="hidden md:flex absolute top-8 left-8 right-8 z-40 items-center justify-between animate-fade-in pointer-events-auto select-none no-print">
      {/* Left side: Page Title / Tag with Theme-Colored Rounded Icon Box */}
      {pageTag ? (
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="p-2.5 bg-[#4F3DF5]/10 text-[#4F3DF5] rounded-2xl border border-[#4F3DF5]/20 flex items-center justify-center shadow-sm">
            {pageTag.icon}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight leading-none">
            {pageTag.title}
          </h1>
        </div>
      ) : (
        <div></div>
      )}

      {/* Right side: Pills */}
      <div className="flex items-center gap-3">
        {/* Target Role Pill */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#ECEEF4]/60 text-xs font-semibold text-[#111827]">
          <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B]">Target:</span>
          <span className="text-[#111827] font-bold">{user.targetRole || 'Software Engineer'}</span>
        </div>

        {/* Average Score Pill */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#ECEEF4]/60 text-xs font-semibold text-[#111827]">
          <BarChart2 className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B]">Avg Score:</span>
          <span className="text-[#4F3DF5] font-extrabold">
            {(user.averageScore ?? 0) > 0 ? `${user.averageScore}%` : '—'}
          </span>
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md pl-1.5 pr-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#ECEEF4]/60 hover:bg-white transition-all duration-200 cursor-pointer group"
          >
            <img 
              src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Deepak'} 
              alt={user.name} 
              className="w-7 h-7 rounded-full bg-brand-50 object-cover border border-[#ECEEF4]"
            />
            <div className="text-left leading-none">
              <div className="text-[11px] font-extrabold text-[#111827] group-hover:text-[#4F3DF5] transition-colors">
                {user.name || 'Deepak Dubey'}
              </div>
              <div className="text-[9px] text-[#64748B] font-semibold mt-0.5 capitalize">
                {user.experienceLevel || 'Mid'} Level
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#111827] transition-colors" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#ECEEF4] py-2 z-20 animate-scale-up">
                <Link 
                  to="/profile" 
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
