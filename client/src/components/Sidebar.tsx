import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tv, 
  FileText, 
  Award,
  User, 
  ChevronRight,
  ChevronLeft,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import owlMascot from '../assets/Owl_with_laptop.png';
import favicon from '../assets/Favicon.png';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleToggleMobileSidebar = () => {
      setIsMobileOpen(prev => !prev);
    };
    window.addEventListener('toggle-mobile-sidebar', handleToggleMobileSidebar);
    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggleMobileSidebar);
    };
  }, []);

  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/studio', label: 'Interview Studio', icon: Tv },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/results', label: 'Reports', icon: Award },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  const renderMoxMini = () => (
    <svg className="w-10 h-10 flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#EEF2FF" />
      {/* Body */}
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#4F3DF5" />
      <ellipse cx="32" cy="38" rx="10" ry="9" fill="#ffffff" />
      {/* Head */}
      <circle cx="32" cy="24" r="11" fill="#4F3DF5" />
      {/* Eyes */}
      <circle cx="28" cy="23" r="4.5" fill="#ffffff" />
      <circle cx="28" cy="23" r="2" fill="#000000" />
      <circle cx="36" cy="23" r="4.5" fill="#ffffff" />
      <circle cx="36" cy="23" r="2" fill="#000000" />
      {/* Beak */}
      <path d="M30,26 L34,26 L32,29 Z" fill="#f59e0b" />
      {/* Wings */}
      <path d="M16,36 C14,38 15,44 19,42 Z" fill="#6D5DFB" />
      <path d="M48,36 C50,38 49,44 45,42 Z" fill="#6D5DFB" />
    </svg>
  );

  const renderSidebarContent = (collapsed: boolean, isMobile: boolean) => {
    return (
      <>
        {/* TOP SECTION GROUP */}
        <div className="flex flex-col flex-shrink-0 w-full text-left">
          
          {/* Brand Header */}
          <div className={`flex items-center flex-shrink-0 ${collapsed ? 'flex-col w-full items-center justify-center' : 'gap-4'}`}>
            <img 
              src={favicon} 
              alt="MockMate Owl mascot" 
              className="w-12 h-12 object-contain flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
              onClick={() => {
                if (isMobile) {
                  setIsMobileOpen(false);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            />
            {!collapsed && (
              <>
                <div className="text-left leading-none">
                  <h1 className="text-base font-black text-black tracking-tight">MockMate AI</h1>
                  <p className="text-[10px] text-black font-extrabold mt-1.5 uppercase tracking-wider opacity-70">Practice. Improve. Get Hired.</p>
                </div>
                <button 
                  onClick={() => {
                    if (isMobile) {
                      setIsMobileOpen(false);
                    } else {
                      setIsCollapsed(!isCollapsed);
                    }
                  }} 
                  className="p-1.5 rounded-xl hover:bg-[#EEF2FF] text-[#64748B] hover:text-[#4F3DF5] transition-all duration-200 ml-auto cursor-pointer flex items-center justify-center"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Welcome Card */}
          {!collapsed && (
            <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFF] border border-[#ECEEF4]/60 rounded-[20px] p-4 text-center shadow-sm relative overflow-hidden flex flex-col items-center flex-shrink-0 mt-5 h-[225px] justify-between">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#4F3DF5]/5 rounded-full blur-2xl"></div>
              
              <div className="leading-none">
                <h3 className="text-[13px] font-black text-black leading-none">
                  Welcome, {user.name ? user.name.split(' ')[0] : 'User'} 👋
                </h3>
                <p className="text-[11px] text-black/85 font-extrabold mt-1">
                  Ready to practice today?
                </p>
              </div>

              {/* mascot illustration */}
              <div className="w-24 h-24 flex items-center justify-center my-1">
                 <img src={owlMascot} alt="Mox the Owl sitting with laptop" className="max-w-full max-h-full object-contain" />
              </div>

              <button
                onClick={() => {
                  if (isMobile) setIsMobileOpen(false);
                  navigate('/studio');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full w-full py-2.5 bg-[#4F3DF5] hover:bg-[#3B2DC3] text-white text-[11px] font-black tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                Start Interview
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <div className={`flex flex-col flex-shrink-0 mt-5 ${collapsed ? 'gap-2 items-center w-full' : 'gap-1'}`}>
            {!collapsed && (
              <span className="text-[9px] font-black text-black uppercase tracking-widest pl-1 opacity-60">
                Main Menu
              </span>
            )}

            <nav className={`flex flex-col w-full ${collapsed ? 'gap-2 items-center' : 'gap-0.5'}`}>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      if (isMobile) setIsMobileOpen(false);
                    }}
                    title={collapsed ? link.label : undefined}
                    className={({ isActive }) => 
                      collapsed
                        ? `flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 group border ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#4F3DF5] to-[#6D5DFB] border-transparent text-white shadow-[0_4px_15px_rgba(79,61,245,0.2)]' 
                              : 'border-transparent bg-white text-black hover:bg-[#EEF2FF]/60'
                          }`
                        : `flex items-center h-[42px] gap-2 px-3 rounded-[10px] text-[13px] font-black transition-all duration-200 group border whitespace-nowrap flex-shrink-0 ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#4F3DF5] to-[#6D5DFB] border-transparent text-white shadow-[0_4px_15px_rgba(79,61,245,0.2)]' 
                              : 'border-transparent bg-white text-black hover:bg-[#EEF2FF]/60'
                          }`
                    }
                  >
                    <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                    {!collapsed && <span className="leading-none">{link.label}</span>}
                    {!collapsed && <ChevronRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />}
                  </NavLink>
                );
              })}
            </nav>
          </div>

        </div>

        {/* BOTTOM PANEL PINNED */}
        <div className={`mt-auto pt-3 border-t border-[#ECEEF4] flex flex-col bg-white flex-shrink-0 ${collapsed ? 'items-center w-full justify-center gap-0' : 'gap-3 text-left'}`}>
          {/* Mascot Footer Card */}
          {collapsed ? (
            <div className="flex items-center justify-center p-1.5">
              {renderMoxMini()}
            </div>
          ) : (
            <div className="flex items-start gap-3 flex-shrink-0">
              {renderMoxMini()}
              <div className="flex-1 bg-white border border-[#ECEEF4] p-3 rounded-[12px] rounded-tl-none relative shadow-sm">
                <div className="absolute -left-1.5 top-0 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent filter drop-shadow-[-1px_0_0_#ECEEF4]"></div>
                <p className="text-[11px] text-black font-black leading-snug">
                  One interview a day keeps rejection away.
                </p>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${isCollapsed ? 'w-[96px] max-w-[96px] min-w-[96px] p-4 items-center' : 'w-[330px] max-w-[330px] min-w-[330px] p-6'} h-screen sticky top-0 bg-white border-r border-[#ECEEF4] flex-col justify-between shrink-0 overflow-y-hidden z-30 select-none text-black transition-all duration-300 ease-in-out`}>
        {renderSidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-all duration-300 animate-fade-in"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] max-w-[280px] bg-white border-r border-[#ECEEF4] flex flex-col justify-between z-50 p-5 text-black select-none transition-transform duration-300 ease-in-out md:hidden ${
        isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        {renderSidebarContent(false, true)}
      </aside>
    </>
  );
};
