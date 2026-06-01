import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoSecondary from '../assets/Horizontal_logo.png';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass border-b border-slate-200/80 sticky top-0 z-40 px-8 py-5 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSecondary} alt="MockMate AI Logo" className="h-11 w-auto hover:opacity-90 transition-opacity" />
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-5 bg-slate-100/80 px-5 py-2.5 rounded-full border border-slate-200 text-[15px]">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5 text-brand-500" />
              <span>Target: <span className="font-semibold text-slate-800">{user.targetRole}</span></span>
            </div>
            <div className="h-5 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-slate-500">Avg Score:</span>
              <span className="font-bold text-brand-600">
                {(user.averageScore ?? 0) > 0 ? `${user.averageScore}%` : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3.5 group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-12 h-12 rounded-full border-2 border-brand-500/50 group-hover:border-brand-400 transition-colors bg-slate-100"
              />
              <div className="hidden sm:block text-left">
                <div className="text-base font-semibold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">{user.name}</div>
                <div className="text-[13px] text-slate-500 leading-tight capitalize">{user.experienceLevel} Level</div>
              </div>
            </Link>

            <button 
              onClick={logout}
              className="p-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all border border-transparent hover:border-red-200"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
