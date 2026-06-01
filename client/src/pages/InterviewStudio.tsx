import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { 
  Search,
  ArrowRight,
  FileText,
  CircleDollarSign,
  Bell,
  Briefcase,
  Home,
  Video,
  Plus,
  BarChart3,
  User as UserIcon
} from 'lucide-react';
import moxHappy from '../assets/Owl_with_laptop.png';

// ============================================================================
// HIGH-FIDELITY VECTOR ILLUSTRATIONS FOR CATEGORIES
// ============================================================================
export const renderCategorySvg = (title: string, isHighlighted: boolean) => {
  const blobColorClass = isHighlighted ? 'fill-white opacity-20' : 'fill-current opacity-15';
  const detailOpacity = isHighlighted ? 'opacity-90' : 'opacity-100';

  switch (title) {
    case 'Behavioral Interviews':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M15,50 C15,25 35,15 60,15 C85,15 90,35 90,55 C90,75 75,85 50,85 C25,85 15,75 15,50 Z" className={`${blobColorClass} text-orange-500 transition-colors duration-300`} />
          <rect x="25" y="32" width="36" height="24" rx="6" fill={isHighlighted ? '#ffffff' : '#f97316'} className={detailOpacity} />
          <path d="M52,56 L58,63 L58,56 Z" fill={isHighlighted ? '#ffffff' : '#f97316'} className={detailOpacity} />
          <rect x="42" y="46" width="36" height="24" rx="6" fill={isHighlighted ? '#ffedd5' : '#3b82f6'} opacity="0.9" />
          <path d="M50,70 L44,77 L44,70 Z" fill={isHighlighted ? '#ffedd5' : '#3b82f6'} opacity="0.9" />
          {/* Conversation dots */}
          <circle cx="37" cy="44" r="2.5" fill={isHighlighted ? '#f97316' : '#ffffff'} />
          <circle cx="43" cy="44" r="2.5" fill={isHighlighted ? '#f97316' : '#ffffff'} />
          <circle cx="49" cy="44" r="2.5" fill={isHighlighted ? '#f97316' : '#ffffff'} />
          <circle cx="54" cy="58" r="2.5" fill={isHighlighted ? '#3b82f6' : '#ffffff'} />
          <circle cx="60" cy="58" r="2.5" fill={isHighlighted ? '#3b82f6' : '#ffffff'} />
          <circle cx="66" cy="58" r="2.5" fill={isHighlighted ? '#3b82f6' : '#ffffff'} />
        </svg>
      );

    case 'Advertising and Marketing':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M20,45 C20,20 40,10 65,15 C90,20 95,45 85,70 C75,95 50,90 35,80 C20,70 20,70 20,45 Z" className={`${blobColorClass} text-sky-500 transition-colors duration-300`} />
          {/* Megaphone */}
          <path d="M26,50 L46,40 L46,68 L26,58 Z" fill={isHighlighted ? '#ffffff' : '#0284c7'} className={detailOpacity} />
          <path d="M46,40 C53,40 59,45 59,54 C59,63 53,68 46,68 Z" fill={isHighlighted ? '#e0f2fe' : '#38bdf8'} className={detailOpacity} />
          <rect x="31" y="58" width="6" height="15" rx="2" fill={isHighlighted ? '#ffffff' : '#0369a1'} transform="rotate(-15 31 58)" className={detailOpacity} />
          {/* Soundwaves */}
          <path d="M68,44 C74,48 74,60 68,64" stroke={isHighlighted ? '#ffffff' : '#0284c7'} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M76,38 C85,45 85,63 76,70" stroke={isHighlighted ? '#e0f2fe' : '#38bdf8'} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'Agriculture':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M30,35 C30,15 55,10 70,25 C85,40 85,65 70,80 C55,95 25,85 20,65 C15,45 30,55 30,35 Z" className={`${blobColorClass} text-emerald-500 transition-colors duration-300`} />
          {/* Soil Pot */}
          <path d="M34,70 L66,70 L61,82 L39,82 Z" fill={isHighlighted ? '#ffffff' : '#b45309'} className={detailOpacity} />
          {/* Plant Stem */}
          <path d="M50,70 Q50,45 42,32" stroke={isHighlighted ? '#ffffff' : '#10b981'} strokeWidth="4.5" strokeLinecap="round" />
          {/* Sprouted Leaves */}
          <path d="M42,32 C35,28 35,18 48,22 C48,22 45,30 42,32 Z" fill={isHighlighted ? '#d1fae5' : '#10b981'} className={detailOpacity} />
          <path d="M46,45 C58,40 62,48 50,54 C50,54 48,48 46,45 Z" fill={isHighlighted ? '#ffffff' : '#059669'} className={detailOpacity} />
          <path d="M48,58 C38,55 36,62 46,65 C46,65 47,60 48,58 Z" fill={isHighlighted ? '#ffffff' : '#059669'} className={detailOpacity} />
        </svg>
      );

    case 'Animal Ethology':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M40,25 C40,10 65,15 80,30 C95,45 85,75 65,85 C45,95 25,80 25,60 C25,40 40,40 40,25 Z" className={`${blobColorClass} text-amber-500 transition-colors duration-300`} />
          {/* Paw print */}
          <path d="M35,62 C35,50 65,50 65,62 C65,74 58,78 50,78 C42,78 35,74 35,62 Z" fill={isHighlighted ? '#ffffff' : '#f59e0b'} className={detailOpacity} />
          <circle cx="32" cy="44" r="7.5" fill={isHighlighted ? '#fef3c7' : '#d97706'} className={detailOpacity} />
          <circle cx="44" cy="35" r="8.5" fill={isHighlighted ? '#ffffff' : '#f59e0b'} className={detailOpacity} />
          <circle cx="56" cy="35" r="8.5" fill={isHighlighted ? '#ffffff' : '#f59e0b'} className={detailOpacity} />
          <circle cx="68" cy="44" r="7.5" fill={isHighlighted ? '#fef3c7' : '#d97706'} className={detailOpacity} />
        </svg>
      );

    case 'Architecture and Design':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M25,30 C25,15 45,10 70,20 C95,30 90,60 80,75 C70,90 40,90 30,80 C20,70 25,45 25,30 Z" className={`${blobColorClass} text-indigo-500 transition-colors duration-300`} />
          <rect x="33" y="32" width="34" height="42" rx="4" fill={isHighlighted ? '#ffffff' : '#6366f1'} className={detailOpacity} />
          {/* Architectural Drafting Blueprint grid */}
          <line x1="33" y1="42" x2="67" y2="42" stroke={isHighlighted ? '#6366f1' : 'white'} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          <line x1="33" y1="52" x2="67" y2="52" stroke={isHighlighted ? '#6366f1' : 'white'} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          <line x1="33" y1="62" x2="67" y2="62" stroke={isHighlighted ? '#6366f1' : 'white'} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          <line x1="44" y1="32" x2="44" y2="74" stroke={isHighlighted ? '#6366f1' : 'white'} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          <line x1="56" y1="32" x2="56" y2="74" stroke={isHighlighted ? '#6366f1' : 'white'} strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          {/* Compass tool */}
          <path d="M50,22 L38,65" stroke={isHighlighted ? '#e0e7ff' : '#4338ca'} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M50,22 L62,65" stroke={isHighlighted ? '#e0e7ff' : '#4338ca'} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="50" cy="22" r="5" fill={isHighlighted ? '#e0e7ff' : '#4338ca'} />
        </svg>
      );

    case 'Art':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M20,50 C20,20 45,15 70,20 C95,25 90,55 80,75 C70,95 40,90 25,80 C10,70 20,80 20,50 Z" className={`${blobColorClass} text-rose-500 transition-colors duration-300`} />
          {/* Painter's Palette */}
          <path d="M25,55 C25,35 48,28 68,34 C80,38 85,55 75,70 C65,82 35,82 28,72 C23,66 25,60 25,55 Z" fill={isHighlighted ? '#ffffff' : '#f43f5e'} className={detailOpacity} />
          {/* Thumbhole */}
          <circle cx="38" cy="62" r="5.5" fill={isHighlighted ? '#f43f5e' : '#f8fafc'} />
          {/* Paint droplets */}
          <circle cx="44" cy="42" r="4.5" fill={isHighlighted ? '#f43f5e' : '#3b82f6'} />
          <circle cx="55" cy="40" r="4.5" fill={isHighlighted ? '#f43f5e' : '#10b981'} />
          <circle cx="65" cy="46" r="4.5" fill={isHighlighted ? '#f43f5e' : '#eab308'} />
          <circle cx="68" cy="58" r="4.5" fill={isHighlighted ? '#f43f5e' : '#a855f7'} />
          {/* Brush */}
          <path d="M68,22 L52,50" stroke={isHighlighted ? '#ffe4e6' : '#be123c'} strokeWidth="4.5" strokeLinecap="round" transform="rotate(15 68 22)" />
          <path d="M52,50 L48,58" stroke={isHighlighted ? '#ffffff' : '#111827'} strokeWidth="6.5" strokeLinecap="round" transform="rotate(15 68 22)" />
        </svg>
      );

    case 'Audio and Video Technology':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M30,30 C30,10 60,15 80,30 C100,45 85,75 70,85 C55,95 25,85 20,65 C15,45 30,50 30,30 Z" className={`${blobColorClass} text-purple-500 transition-colors duration-300`} />
          {/* Studio camera */}
          <rect x="25" y="38" width="36" height="24" rx="4" fill={isHighlighted ? '#ffffff' : '#4f3df5'} className={detailOpacity} />
          <path d="M61,44 L75,34 L75,66 L61,56 Z" fill={isHighlighted ? '#f3e8ff' : '#3b2dc3'} className={detailOpacity} />
          {/* Film Reels */}
          <circle cx="34" cy="29" r="8" fill={isHighlighted ? '#ffffff' : '#3b2dc3'} stroke={isHighlighted ? '#3b2dc3' : '#4f3df5'} strokeWidth="2.5" />
          <circle cx="52" cy="29" r="8" fill={isHighlighted ? '#ffffff' : '#3b2dc3'} stroke={isHighlighted ? '#3b2dc3' : '#4f3df5'} strokeWidth="2.5" />
        </svg>
      );

    case 'Aviation':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M15,50 C15,25 35,15 60,15 C85,15 90,35 90,55 C90,75 75,85 50,85 C25,85 15,75 15,50 Z" className={`${blobColorClass} text-cyan-500 transition-colors duration-300`} />
          {/* Clouds */}
          <circle cx="34" cy="65" r="12" fill={isHighlighted ? '#ffffff' : '#e2e8f0'} opacity="0.8" />
          <circle cx="55" cy="72" r="10" fill={isHighlighted ? '#ffffff' : '#cbd5e1'} opacity="0.9" />
          <circle cx="70" cy="65" r="12" fill={isHighlighted ? '#ffffff' : '#e2e8f0'} opacity="0.8" />
          {/* Commercial Airplane */}
          <path d="M22,48 L58,40 L72,40 C75,40 78,42 78,45 C78,48 75,50 72,50 L58,50 L22,52 Z" fill={isHighlighted ? '#ffffff' : '#06b6d4'} className={detailOpacity} />
          {/* Aviation Wings */}
          <path d="M48,45 L35,20 L42,20 L58,45 Z" fill={isHighlighted ? '#ecfeff' : '#0891b2'} className={detailOpacity} />
          <path d="M48,50 L35,75 L42,75 L58,50 Z" fill={isHighlighted ? '#ecfeff' : '#0891b2'} className={detailOpacity} />
          <path d="M24,49 L15,30 L20,30 L28,49 Z" fill={isHighlighted ? '#ecfeff' : '#0891b2'} className={detailOpacity} />
        </svg>
      );

    case 'Business Management':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M25,25 C25,10 50,15 75,20 C100,25 95,55 85,75 C75,95 45,95 30,80 C15,65 25,40 25,25 Z" className={`${blobColorClass} text-rose-500 transition-colors duration-300`} />
          {/* Corporate Briefcase */}
          <rect x="28" y="42" width="44" height="30" rx="6" fill={isHighlighted ? '#ffffff' : '#f43f5e'} className={detailOpacity} />
          <path d="M40,42 L40,34 C40,32 42,30 45,30 L55,30 C58,30 60,32 60,34 L60,42 Z" stroke={isHighlighted ? '#ffffff' : '#be123c'} strokeWidth="4.5" />
          {/* Lock clasp */}
          <circle cx="50" cy="54" r="4.5" fill={isHighlighted ? '#f43f5e' : '#eab308'} />
          {/* Analytics Chart Line */}
          <path d="M20,78 L42,52 L62,58 L85,32" stroke={isHighlighted ? '#ffe4e6' : '#eab308'} strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="85,32 75,34 85,44" fill={isHighlighted ? '#ffe4e6' : '#eab308'} />
        </svg>
      );

    case 'Communication':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M30,35 C30,15 55,10 70,25 C85,40 85,65 70,80 C55,95 25,85 20,65 C15,45 30,55 30,35 Z" className={`${blobColorClass} text-fuchsia-500 transition-colors duration-300`} />
          {/* Dialogue chat bubbles */}
          <rect x="24" y="30" width="38" height="24" rx="8" fill={isHighlighted ? '#ffffff' : '#d946ef'} className={detailOpacity} />
          <path d="M34,54 L29,62 L41,54 Z" fill={isHighlighted ? '#ffffff' : '#d946ef'} className={detailOpacity} />
          <rect x="42" y="46" width="38" height="24" rx="8" fill={isHighlighted ? '#fdf4ff' : '#ec4899'} opacity="0.95" />
          <path d="M66,70 L72,78 L68,70 Z" fill={isHighlighted ? '#fdf4ff' : '#ec4899'} opacity="0.95" />
          {/* Typing dots */}
          <circle cx="44" cy="42" r="2.5" fill={isHighlighted ? '#d946ef' : '#ffffff'} />
          <circle cx="50" cy="42" r="2.5" fill={isHighlighted ? '#d946ef' : '#ffffff'} />
          <circle cx="56" cy="42" r="2.5" fill={isHighlighted ? '#d946ef' : '#ffffff'} />
        </svg>
      );

    case 'Construction':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M40,25 C40,10 65,15 80,30 C95,45 85,75 65,85 C45,95 25,80 25,60 C25,40 40,40 40,25 Z" className={`${blobColorClass} text-slate-500 transition-colors duration-300`} />
          {/* Builder Helmet */}
          <path d="M25,58 C25,41 40,33 50,33 C60,33 75,41 75,58 Z" fill={isHighlighted ? '#ffffff' : '#475569'} className={detailOpacity} />
          <rect x="20" y="56" width="60" height="5.5" rx="2" fill={isHighlighted ? '#cbd5e1' : '#334155'} className={detailOpacity} />
          <rect x="46" y="29" width="8" height="26" rx="2.5" fill={isHighlighted ? '#ffffff' : '#334155'} className={detailOpacity} />
          {/* Stripe warnings */}
          <rect x="18" y="70" width="64" height="8" fill={isHighlighted ? '#ffffff' : '#eab308'} className={detailOpacity} />
          <line x1="22" y1="70" x2="30" y2="78" stroke={isHighlighted ? '#475569' : '#1e293b'} strokeWidth="3.5" />
          <line x1="34" y1="70" x2="42" y2="78" stroke={isHighlighted ? '#475569' : '#1e293b'} strokeWidth="3.5" />
          <line x1="46" y1="70" x2="54" y2="78" stroke={isHighlighted ? '#475569' : '#1e293b'} strokeWidth="3.5" />
          <line x1="58" y1="70" x2="66" y2="78" stroke={isHighlighted ? '#475569' : '#1e293b'} strokeWidth="3.5" />
          <line x1="70" y1="70" x2="78" y2="78" stroke={isHighlighted ? '#475569' : '#1e293b'} strokeWidth="3.5" />
        </svg>
      );

    case 'Cyber Security':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M20,45 C20,20 40,10 65,15 C90,20 95,45 85,70 C75,95 50,90 35,80 C20,70 20,70 20,45 Z" className={`${blobColorClass} text-red-600 transition-colors duration-300`} />
          {/* Lock Shield */}
          <path d="M30,30 C42,26 50,22 50,22 C50,22 58,26 70,30 C70,55 58,74 50,78 C42,74 30,55 30,30 Z" fill={isHighlighted ? '#ffffff' : '#dc2626'} className={detailOpacity} />
          {/* White security Padlock */}
          <rect x="40" y="46" width="20" height="15" rx="3.5" fill={isHighlighted ? '#dc2626' : 'white'} />
          <path d="M44,46 L44,38 C44,34 46,31 50,31 C54,31 56,34 56,38 L56,46 Z" stroke={isHighlighted ? '#dc2626' : 'white'} strokeWidth="3.5" fill="none" />
          <circle cx="50" cy="53.5" r="3" fill={isHighlighted ? '#ffffff' : '#dc2626'} />
        </svg>
      );

    case 'Data Science & Analytics':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M30,35 C30,15 55,10 70,25 C85,40 85,65 70,80 C55,95 25,85 20,65 C15,45 30,55 30,35 Z" className={`${blobColorClass} text-indigo-600 transition-colors duration-300`} />
          {/* Analytical Charts */}
          <path d="M22,74 L40,50 L58,58 L80,28" stroke={isHighlighted ? '#ffffff' : '#4f46e5'} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="40" cy="50" r="4.5" fill={isHighlighted ? '#ffffff' : '#4f46e5'} />
          <circle cx="58" cy="58" r="4.5" fill={isHighlighted ? '#ffffff' : '#4f46e5'} />
          <circle cx="80" cy="28" r="4.5" fill={isHighlighted ? '#e0e7ff' : '#3b82f6'} />
          {/* Translucent visualizer bars */}
          <rect x="34" y="58" width="12" height="16" rx="2" fill={isHighlighted ? '#ffffff' : '#6366f1'} opacity={isHighlighted ? '0.3' : '0.2'} />
          <rect x="52" y="64" width="12" height="10" rx="2" fill={isHighlighted ? '#ffffff' : '#6366f1'} opacity={isHighlighted ? '0.3' : '0.2'} />
          <rect x="74" y="38" width="12" height="36" rx="2" fill={isHighlighted ? '#ffffff' : '#6366f1'} opacity={isHighlighted ? '0.3' : '0.2'} />
        </svg>
      );

    case 'Healthcare Operations':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M25,30 C25,15 45,10 70,20 C95,30 90,60 80,75 C70,90 40,90 30,80 C20,70 25,45 25,30 Z" className={`${blobColorClass} text-teal-500 transition-colors duration-300`} />
          {/* Medical Cross Shield */}
          <path d="M30,30 C42,26 50,22 50,22 C50,22 58,26 70,30 C70,55 58,74 50,78 C42,74 30,55 30,30 Z" fill={isHighlighted ? '#ffffff' : '#0d9488'} className={detailOpacity} />
          {/* Heartbeat pulse */}
          <path d="M20,68 L38,68 L44,55 L50,78 L56,62 L74,68" stroke={isHighlighted ? '#ffffff' : '#14b8a6'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="46" y="36" width="8" height="24" rx="2" fill={isHighlighted ? '#0d9488' : 'white'} />
          <rect x="38" y="44" width="24" height="8" rx="2" fill={isHighlighted ? '#0d9488' : 'white'} />
        </svg>
      );

    case 'Hospitality & Tourism':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M20,45 C20,20 40,10 65,15 C90,20 95,45 85,70 C75,95 50,90 35,80 C20,70 20,70 20,45 Z" className={`${blobColorClass} text-amber-500 transition-colors duration-300`} />
          {/* Luggage bag */}
          <rect x="28" y="44" width="44" height="30" rx="6" fill={isHighlighted ? '#ffffff' : '#f59e0b'} className={detailOpacity} />
          <path d="M42,44 L42,36 C42,34 44,32 46,32 L54,32 C56,32 58,34 58,36 L58,44 Z" stroke={isHighlighted ? '#ffffff' : '#d97706'} strokeWidth="4.5" />
          {/* Palm leaves */}
          <path d="M72,74 Q68,48 58,38" stroke={isHighlighted ? '#ffffff' : '#059669'} strokeWidth="4" strokeLinecap="round" />
          <path d="M58,38 C52,32 42,34 48,42 C48,42 54,42 58,38 Z" fill={isHighlighted ? '#ffffff' : '#10b981'} className={detailOpacity} />
          <path d="M58,38 C62,30 72,28 66,38 C66,38 62,38 58,38 Z" fill={isHighlighted ? '#ffffff' : '#10b981'} className={detailOpacity} />
        </svg>
      );

    case 'FinTech Engineering':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M30,30 C30,10 60,15 80,30 C100,45 85,75 70,85 C55,95 25,85 20,65 C15,45 30,50 30,30 Z" className={`${blobColorClass} text-purple-600 transition-colors duration-300`} />
          {/* Credit Card layout */}
          <rect x="25" y="38" width="46" height="28" rx="4.5" fill={isHighlighted ? '#ffffff' : '#a855f7'} className={detailOpacity} />
          <rect x="25" y="44" width="46" height="6.5" fill={isHighlighted ? '#7e22ce' : '#6b21a8'} className={detailOpacity} />
          <rect x="32" y="54" width="8" height="6" rx="1.5" fill={isHighlighted ? '#a855f7' : '#eab308'} className={detailOpacity} />
          {/* Golden transaction coins */}
          <circle cx="68" cy="32" r="8" fill={isHighlighted ? '#ffffff' : '#eab308'} stroke={isHighlighted ? '#7e22ce' : '#ca8a04'} strokeWidth="1.5" />
          <circle cx="78" cy="44" r="6" fill={isHighlighted ? '#ffffff' : '#eab308'} stroke={isHighlighted ? '#7e22ce' : '#ca8a04'} strokeWidth="1.5" />
        </svg>
      );

    case 'Software Development':
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M20,40 C20,15 40,10 65,15 C90,20 95,45 85,70 C75,95 50,90 35,80 C20,70 20,65 20,40 Z" className={`${blobColorClass} text-blue-500 transition-colors duration-300`} />
          {/* Laptop / Screen */}
          <rect x="24" y="32" width="52" height="34" rx="4" fill={isHighlighted ? '#ffffff' : '#3b82f6'} className={detailOpacity} />
          <rect x="29" y="37" width="42" height="24" rx="2" fill={isHighlighted ? '#e0e7ff' : '#1e1b4b'} className={detailOpacity} />
          {/* Base of Laptop */}
          <path d="M18,68 L82,68 L76,74 L24,74 Z" fill={isHighlighted ? '#ffffff' : '#1d4ed8'} className={detailOpacity} />
          {/* Code tags inside screen */}
          <path d="M42,43 L36,49 L42,55" stroke={isHighlighted ? '#3b82f6' : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M58,43 L64,49 L58,55" stroke={isHighlighted ? '#3b82f6' : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="52" y1="42" x2="48" y2="56" stroke={isHighlighted ? '#3b82f6' : '#f43f5e'} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg className="w-24 h-24 mx-auto transition-all duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
          <path d="M15,50 C15,25 35,15 60,15 C85,15 90,35 90,55 C90,75 75,85 50,85 C25,85 15,75 15,50 Z" className={`${blobColorClass} text-indigo-500 transition-colors duration-300`} />
          <circle cx="50" cy="50" r="16" stroke={isHighlighted ? '#ffffff' : '#4f3df5'} strokeWidth="4.5" />
          <path d="M50,30 L50,42 M50,58 L50,70 M30,50 L42,50 M58,50 L70,50" stroke={isHighlighted ? '#ffffff' : '#4f3df5'} strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
  }
};

const categories = [
  { title: 'Behavioral Interviews', count: 7, color: 'from-orange-400 to-orange-500', role: 'Behavioral Interview Specialist', positions: 7 },
  { title: 'Advertising and Marketing', count: 11, color: 'from-sky-500 to-blue-500', role: 'Marketing Strategist', positions: 11 },
  { title: 'Agriculture', count: 5, color: 'from-emerald-500 to-teal-500', role: 'Agriculture Consultant', positions: 5 },
  { title: 'Animal Ethology', count: 5, color: 'from-amber-500 to-orange-500', role: 'Animal Ethology Researcher', positions: 5 },
  { title: 'Architecture and Design', count: 6, color: 'from-sky-500 to-indigo-500', role: 'Design Architect', positions: 6 },
  { title: 'Art', count: 5, color: 'from-rose-500 to-pink-500', role: 'Creative Art Director', positions: 5 },
  { title: 'Audio and Video Technology', count: 8, color: 'from-violet-500 to-purple-500', role: 'Media Engineer', positions: 8 },
  { title: 'Aviation', count: 6, color: 'from-cyan-500 to-sky-500', role: 'Aviation Operations Lead', positions: 6 },
  { title: 'Business Management', count: 14, color: 'from-red-500 to-rose-500', role: 'Business Program Manager', positions: 14 },
  { title: 'Communication', count: 6, color: 'from-fuchsia-500 to-pink-500', role: 'Communication Specialist', positions: 6 },
  { title: 'Construction', count: 9, color: 'from-slate-500 to-slate-700', role: 'Construction Manager', positions: 9 },
  { title: 'Cyber Security', count: 4, color: 'from-red-600 to-red-800', role: 'Cybersecurity Analyst', positions: 4 },
  { title: 'Data Science & Analytics', count: 8, color: 'from-indigo-500 to-blue-600', role: 'Data Scientist', positions: 8 },
  { title: 'Healthcare Operations', count: 6, color: 'from-teal-400 to-emerald-500', role: 'Healthcare Administrator', positions: 6 },
  { title: 'Hospitality & Tourism', count: 9, color: 'from-amber-400 to-orange-500', role: 'Hospitality Manager', positions: 9 },
  { title: 'FinTech Engineering', count: 12, color: 'from-rose-500 to-purple-600', role: 'FinTech Software Engineer', positions: 12 },
  { title: 'Software Development', count: 18, color: 'from-blue-500 to-indigo-600', role: 'Software Developer', positions: 18 }
];

export const InterviewStudio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return categories.filter((category) =>
      category.title.toLowerCase().includes(normalized)
    );
  }, [searchTerm]);

  // Badge color helpers for mobile cards
  const getBadgeColor = (color: string) => {
    if (color.includes('orange')) return { bg: '#FF6B35', text: '#fff' };
    if (color.includes('sky') || color.includes('blue')) return { bg: '#0EA5E9', text: '#fff' };
    if (color.includes('emerald') || color.includes('teal')) return { bg: '#10B981', text: '#fff' };
    if (color.includes('amber')) return { bg: '#F59E0B', text: '#fff' };
    if (color.includes('indigo')) return { bg: '#6366F1', text: '#fff' };
    if (color.includes('rose') || color.includes('pink')) return { bg: '#F43F5E', text: '#fff' };
    if (color.includes('violet') || color.includes('purple')) return { bg: '#8B5CF6', text: '#fff' };
    if (color.includes('cyan')) return { bg: '#06B6D4', text: '#fff' };
    if (color.includes('red')) return { bg: '#EF4444', text: '#fff' };
    if (color.includes('fuchsia')) return { bg: '#D946EF', text: '#fff' };
    if (color.includes('slate')) return { bg: '#64748B', text: '#fff' };
    return { bg: '#4F3DF5', text: '#fff' };
  };

  // ─── Mobile View ────────────────────────────────────────────────────────────
  const renderMobileView = () => (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-24 text-left">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-9">
        {/* Page Title */}
        <div className="px-5 pb-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Interview Studio</h1>
        </div>

        {/* Hero Banner */}
        <div className="mx-5 mt-0 mb-2 bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-between shadow-sm overflow-hidden relative">
          <div className="flex-1 z-10">
            <p className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest mb-1">
              {filteredCategories.length} Categories Found
            </p>
            <h2 className="text-base font-black text-slate-900 leading-snug">
              Explore the best<br />interview tracks
            </h2>
            <p className="text-[10px] text-slate-400 font-medium mt-1 max-w-[170px] leading-relaxed">
              Pick a category and launch a practice session tailored to your role or domain.
            </p>
          </div>
          <img
            src={moxHappy}
            alt="MockMate Owl"
            className="w-24 object-contain drop-shadow-lg -mr-1 flex-shrink-0"
          />
        </div>

        {/* Search Bar */}
        <div className="mx-5 mb-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles or keywords..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm"
          />
        </div>

        {/* Category Grid */}
        <div className="px-5 pb-6 grid grid-cols-2 gap-3">
          {filteredCategories.map((category) => {
            const badge = getBadgeColor(category.color);
            return (
              <button
                key={category.title}
                type="button"
                onClick={() => navigate(`/studio/${encodeURIComponent(category.title)}`)}
                className="bg-white border border-slate-100 rounded-3xl p-3.5 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex flex-col gap-2 cursor-pointer"
              >
                {/* Icon + Badge Row */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden">
                    <div className="scale-[0.38] origin-center w-24 h-24 flex items-center justify-center">
                      {renderCategorySvg(category.title, false)}
                    </div>
                  </div>
                  <span
                    className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {category.count} Positions
                  </span>
                </div>

                {/* Title + Desc */}
                <div>
                  <p className="text-xs font-black text-slate-900 leading-snug">{category.title}</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5 leading-relaxed line-clamp-2">
                    Practice role-based interview sessions for {category.title.toLowerCase()}.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-end mt-auto">
                  <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-violet-600" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
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

        {/* Interview Tab - Selected */}
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
        >
          <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black text-[#625dfb]">Interview</span>
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
          <span className="text-[9px] font-bold">Report</span>
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block flex-1 px-8 py-6 w-full max-w-none animate-fade-in">
        <main className="space-y-6">
          <div className="glass-card rounded-[32px] border border-slate-200/80 p-6 shadow-xl shadow-slate-200/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{categories.length} categories found</p>
                <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Explore the best interview tracks</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">Pick a category and launch a practice session tailored to that role or domain.</p>
              </div>
              <div className="relative w-full md:w-[420px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search career roles or keywords..."
                  className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCategories.map((category) => {
              const isHighlighted = hoveredCategory === category.title;
              const cardBgClass = isHighlighted
                ? `bg-gradient-to-br ${category.color} border-transparent shadow-xl scale-[1.02] text-white`
                : "bg-white border-slate-200 text-slate-800 hover:border-transparent hover:shadow-xl hover:scale-[1.02]";
              const textTitleClass = isHighlighted ? "text-white" : "text-slate-800";
              const textDescClass = isHighlighted ? "text-white/80" : "text-slate-500";
              const textFooterClass = isHighlighted ? "text-white" : "text-slate-600";
              const badgeClass = isHighlighted
                ? "bg-white/20 text-white border border-white/30"
                : `bg-gradient-to-r ${category.color} text-white`;

              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() => navigate(`/studio/${encodeURIComponent(category.title)}`)}
                  onMouseEnter={() => setHoveredCategory(category.title)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`group rounded-[32px] border p-5 text-left transition-all duration-500 flex flex-col justify-between min-h-[290px] ${cardBgClass}`}
                >
                  <div className="flex justify-between items-center w-full flex-shrink-0">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isHighlighted ? 'text-white/60' : 'text-slate-400 group-hover:text-white/60'}`}>Track</span>
                    <div className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-sm transition-all duration-300 ${badgeClass}`}>
                      {category.count} positions
                    </div>
                  </div>
                  <div className="my-4 flex items-center justify-center min-h-[80px] flex-1">
                    {renderCategorySvg(category.title, isHighlighted)}
                  </div>
                  <div className="space-y-2 flex-shrink-0">
                    <h3 className={`text-lg font-extrabold leading-snug transition-colors duration-300 ${textTitleClass}`}>{category.title}</h3>
                    <p className={`text-xs leading-normal transition-colors duration-300 ${textDescClass}`}>
                      Practice role-based interview sessions tailored for {category.title.toLowerCase()}.
                    </p>
                    <div className={`pt-4 border-t ${isHighlighted ? 'border-white/20' : 'border-slate-100 group-hover:border-white/20'} flex items-center justify-between text-xs font-bold transition-all duration-300 ${textFooterClass}`}>
                      <span>Explore Interviews</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <GlassCard className="p-6" hoverEffect={false}>
              <div className="flex items-start gap-3">
                <div className="rounded-3xl bg-brand-500/10 p-3 text-brand-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Custom Session</p>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">Build a custom interview playlist.</h3>
                  <p className="mt-2 text-sm text-slate-500">If you need a more specific role or skill focus, use the studio form below to create your own custom experience.</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6" hoverEffect={false}>
              <div className="flex items-start gap-3">
                <div className="rounded-3xl bg-brand-500/10 p-3 text-brand-600">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Why Practice?</p>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">Boost your confidence and score.</h3>
                  <p className="mt-2 text-sm text-slate-500">Every session is designed to improve your response clarity, technical fluency, and delivery under pressure.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden min-h-screen w-full bg-[#f8fafc]">
        {renderMobileView()}
      </div>
    </>
  );
};
