import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import moxHappy from '../assets/Owl_with_laptop.png';
import { GlassCard } from '../components/GlassCard';
import { 
  Play, 
  UploadCloud, 
  Sparkles, 
  Compass, 
  UserCheck, 
  Award, 
  Activity, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Menu,
  Bell,
  Rocket,
  FileText,
  LineChart,
  Target,
  User,
  BarChart3,
  Home,
  Plus,
  Video,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface MetricData {
  totalInterviews: number;
  averageScore: number;
  skills: string[];
  radarMetrics: {
    technical: number;
    communication: number;
    confidence: number;
    problemSolving: number;
  };
  scoreTrend: Array<{
    name: string;
    score: number;
    role?: string;
    date: string;
  }>;
}

interface InterviewHistoryItem {
  _id: string;
  role: string;
  interviewType: string;
  difficulty: string;
  score: number;
  status: string;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const metricsRes = await api.interviews.getMetrics();
        const historyRes = await api.interviews.getHistory();
        setMetrics(metricsRes);
        setHistory(historyRes.slice(0, 5)); // show top 5 recent interviews
      } catch (err: any) {
        console.error('Failed to load dashboard metrics:', err);
        setError('Could not fetch active performance metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Syncing preparation performance...</p>
      </div>
    );
  }

  // Map radar chart data
  const radarData = metrics ? [
    { subject: 'Technical', A: metrics.radarMetrics.technical, fullMark: 100 },
    { subject: 'Communication', A: metrics.radarMetrics.communication, fullMark: 100 },
    { subject: 'Confidence', A: metrics.radarMetrics.confidence, fullMark: 100 },
    { subject: 'Problem Solving', A: metrics.radarMetrics.problemSolving, fullMark: 100 },
  ] : [];

  // ─── Mobile Dashboard View ──────────────────────────────────────────────────
  const renderMobileView = () => {
    const chartData = metrics && metrics.scoreTrend && metrics.scoreTrend.length >= 3 
      ? metrics.scoreTrend.map((t, idx) => ({
          name: t.name || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx] || t.date,
          score: t.score
        }))
      : [
          { name: 'Mon', score: 10 },
          { name: 'Tue', score: 23 },
          { name: 'Wed', score: 35 },
          { name: 'Thu', score: 50 },
          { name: 'Fri', score: 62 },
          { name: 'Sat', score: 68 },
          { name: 'Sun', score: 95 },
        ];

    const mockSessions = history.length > 0 
      ? history.map(item => ({
          _id: item._id,
          role: item.role,
          sub: item.interviewType === 'Technical' ? 'React • JavaScript • CSS' : item.interviewType + ' Round',
          score: item.score,
          date: item.createdAt === 'Today' || item.createdAt.includes('ago') ? item.createdAt : new Date(item.createdAt).toLocaleDateString(),
          type: item.interviewType
        }))
      : [
          {
            _id: '1',
            role: 'Frontend Developer Mock',
            sub: 'React • JavaScript • CSS',
            score: 72,
            date: 'Today',
            type: 'Technical'
          },
          {
            _id: '2',
            role: 'Behavioral Interview',
            sub: 'HR Round',
            score: 68,
            date: '2 days ago',
            type: 'Behavioral'
          }
        ];

    return (
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-24 text-left pt-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-30">
          {/* Left: User Profile Avatar to open sidebar */}
          <button 
            type="button" 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
            className="flex items-center justify-center p-1 focus:outline-none cursor-pointer"
            title="Open Menu"
          >
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Deepak'} 
              alt="User profile" 
              className="w-8 h-8 rounded-full object-cover border border-slate-150 shadow-sm active:scale-95 transition-all bg-slate-50"
            />
          </button>

          <div className="flex items-center gap-1.5 flex-grow justify-center mr-1">
            <img src={moxHappy} alt="MockMate logo" className="w-7 h-7 object-contain" />
            <span className="text-lg font-black text-slate-800 tracking-tight">
              MockMate <span className="text-violet-600">AI</span>
            </span>
          </div>

          <button type="button" className="relative text-slate-600 hover:text-slate-900 transition-colors p-1 cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 px-5 pt-2 pb-5 space-y-3.5">
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#F5F3FF] border border-violet-100 rounded-3xl p-5 flex flex-col relative overflow-hidden shadow-sm">
            <div className="flex items-start justify-between gap-4 z-10">
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-500 leading-none">Welcome back,</p>
                <h2 className="text-xl font-black text-violet-600 mt-1 leading-snug flex items-center gap-1.5">
                  {user?.name || 'Sumeet Mishra'}! <span className="animate-bounce">👋</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2 max-w-[170px]">
                  Your interview preparation journey is on track.
                </p>
              </div>
              <img 
                src={moxHappy} 
                alt="MockMate Owl" 
                className="w-24 object-contain drop-shadow-lg -mr-1" 
              />
            </div>

            {/* Action buttons inside banner */}
            <div className="grid grid-cols-2 gap-3 mt-5 z-10">
              <button
                onClick={() => navigate('/studio')}
                className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-violet-500/10 text-xs cursor-pointer"
              >
                <Rocket className="w-4 h-4 fill-current shrink-0" />
                <span>Launch Studio</span>
              </button>
              <button
                onClick={() => navigate('/resume')}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Analyze Resume</span>
              </button>
            </div>
          </div>

          {/* Overview Grid Section */}
          <div className="space-y-3 -mt-4.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Overview</h3>
              <button 
                onClick={() => navigate('/studio')}
                className="text-xs font-bold text-violet-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Interviews Practiced */}
              <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-3.5 shadow-sm text-left">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate leading-none mb-1">Interviews</p>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">
                    {metrics?.totalInterviews || 12}
                  </p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">↑ 20% this week</p>
                </div>
              </div>

              {/* Average Evaluation */}
              <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-3.5 shadow-sm text-left">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate leading-none mb-1">Average Eval</p>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">
                    {metrics?.averageScore ? `${metrics.averageScore}%` : '72%'}
                  </p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">↑ 12% this week</p>
                </div>
              </div>

              {/* Active Target Role */}
              <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-3.5 shadow-sm text-left">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate leading-none mb-1">Target Role</p>
                  <p className="text-sm font-extrabold text-slate-900 leading-none truncate mt-0.5">
                    {user?.targetRole || 'Developer'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 leading-none">Frontend</p>
                </div>
              </div>

              {/* Skills Tracked */}
              <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-3.5 shadow-sm text-left">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate leading-none mb-1">Skills</p>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">
                    {metrics?.skills.length || 8}
                  </p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">↑ 2 new skills</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Preparation Progress</h3>
              <div className="flex items-center gap-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="text-xs font-bold text-slate-500">This Week</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Preparation Chart Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-1">
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mobileScoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderColor: '#f1f5f9',
                        borderRadius: '16px',
                        color: '#1e293b',
                        fontSize: '11px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#mobileScoreColor)" 
                      dot={{ r: 3, strokeWidth: 1.5, fill: '#fff', stroke: '#8b5cf6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Overall Progress box inside card */}
              <div className="flex items-center gap-4 bg-violet-50/40 border border-violet-100/50 rounded-2xl p-3 text-left">
                {/* Custom circular progress badge */}
                <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 flex items-center justify-center font-black text-xs text-violet-700 bg-white">
                  73%
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">Overall Progress</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Keep it up! You're doing great.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Mock Sessions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Recent Mock Sessions</h3>
              <button 
                onClick={() => navigate('/studio')}
                className="text-xs font-bold text-violet-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {mockSessions.map(item => (
                <div 
                  key={item._id} 
                  onClick={() => navigate(`/interviews/${item._id}/report`)}
                  className="p-4 flex items-center gap-3.5 hover:bg-slate-50/50 active:bg-slate-100/30 transition-colors cursor-pointer text-left"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    item.type === 'Technical' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.type === 'Technical' ? (
                      <span className="font-extrabold text-sm">&lt;/&gt;</span>
                    ) : (
                      <Briefcase className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate leading-snug">{item.role}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">{item.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`text-xs font-black leading-none ${
                        item.score >= 70 ? 'text-emerald-600' : 'text-amber-500'
                      }`}>
                        {item.score}%
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1 leading-none">{item.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 max-w-md mx-auto shadow-[0_-2px_16px_rgba(0,0,0,0.03)] rounded-t-3xl">
          {/* Home Tab - Selected */}
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
          >
            <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black text-[#625dfb]">Home</span>
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
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold">Profile</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Desktop & Tablet View */}
      <div className="hidden lg:flex flex-1 px-8 py-4 space-y-4 w-full max-w-none animate-fade-in flex-col">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-50 via-indigo-50/50 to-transparent py-4 px-6 rounded-2xl border border-brand-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <img src={moxHappy} alt="Mox Mascot" className="w-16 h-auto hidden sm:block animate-pulse-slow" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
              Welcome back, <span className="text-brand-600">{user?.name}</span>!
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Your virtual interview preparation pipeline is primed. What would you like to practice today?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/studio')}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 flex items-center gap-2 group whitespace-nowrap text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Studio</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/resume')}
            className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
          >
            <UploadCloud className="w-4 h-4 text-brand-500" />
            <span>Analyze Resume</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hoverEffect={true} className="flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl border border-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-none mb-1">Interviews Practiced</div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">{metrics?.totalInterviews || 0}</div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-600 rounded-xl border border-green-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-none mb-1">Average Evaluation</div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {metrics?.averageScore ? `${metrics.averageScore}%` : '0%'}
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-none mb-1">Active Target Role</div>
            <div className="text-lg font-bold text-slate-900 leading-none truncate max-w-[150px]">{user?.targetRole || 'Software Engineer'}</div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-none mb-1">Target Skills Tracked</div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">{metrics?.skills.length || 0}</div>
          </div>
        </GlassCard>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Progress Line Chart */}
        <GlassCard hoverEffect={false} className="lg:col-span-2 flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Preparation Progress Curve</h3>
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Overall Score Trends</span>
          </div>

          <div className="flex-1 w-full h-[260px]">
            {metrics && metrics.scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                   data={metrics.scoreTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f3df5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f3df5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f3df5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#scoreColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                No interview logs recorded. Complete your first session to map results.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Evaluation Dimension Radar */}
        <GlassCard hoverEffect={false} className="flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Key Preparedness Areas</h3>
            </div>
          </div>

          <div className="flex-1 w-full h-[260px]">
            {metrics && metrics.totalInterviews > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" opacity={0.5} />
                  <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                  <Radar 
                    name="Skills Dimension" 
                    dataKey="A" 
                    stroke="#4f3df5" 
                    fill="#4f3df5" 
                    fillOpacity={0.25} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm px-6 text-center">
                Onboarded dimensions will populate after a completed mock evaluation.
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* History and Quick Activity panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Interviews table */}
        <GlassCard hoverEffect={false} className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" />
                <h3 className="font-extrabold text-slate-900 text-base">Recent Mock Sessions</h3>
              </div>
              <button onClick={() => navigate('/studio')} className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center gap-1">
                <span>Configure New</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {history.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 pr-2">Role Target</th>
                      <th className="pb-3 pr-2 hidden sm:table-cell">Category</th>
                      <th className="pb-3 pr-2 hidden md:table-cell">Difficulty</th>
                      <th className="pb-3 pr-2 text-center">Score</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-all group">
                        <td className="py-3.5 pr-2 font-bold text-slate-800 text-sm truncate max-w-[160px]">{item.role}</td>
                        <td className="py-3.5 pr-2 hidden sm:table-cell text-slate-600 text-xs">{item.interviewType}</td>
                        <td className="py-3.5 pr-2 hidden md:table-cell text-slate-500 text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.difficulty === 'Senior' 
                              ? 'border-red-200 text-red-600 bg-red-50' 
                              : item.difficulty === 'Mid'
                                ? 'border-amber-200 text-amber-600 bg-amber-50'
                                : 'border-blue-200 text-blue-600 bg-blue-50'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-center">
                          {item.status === 'completed' ? (
                            <span className={`font-bold text-sm ${
                              item.score >= 80 
                                ? 'text-green-600' 
                                : item.score >= 60 
                                  ? 'text-amber-600' 
                                  : 'text-red-600'
                            }`}>
                              {item.score}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs font-medium italic">Pending</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          {item.status === 'completed' ? (
                            <button
                              onClick={() => navigate(`/interviews/${item._id}/report`)}
                              className="px-3.5 py-1.5 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ml-auto"
                            >
                              <span>Report</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/interviews/${item._id}`)}
                              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ml-auto"
                            >
                              <span>Resume</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No recent interview records found. Set up your first practice run.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Tips / Target skills tracker */}
        <GlassCard hoverEffect={false} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Tracked Skills Profile</h3>
            </div>
            
            <p className="text-slate-600 text-xs font-medium leading-relaxed mb-4">
              Your preparation skills are compiled automatically from mock interviews and resume uploads.
            </p>

            {metrics && metrics.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {metrics.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs italic">
                Upload a resume or start practicing to extract skills automatically.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60">
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              Configure Target Skills
            </button>
          </div>
        </GlassCard>
      </div>
    </div>

    {/* Mobile View */}
    <div className="block lg:hidden min-h-screen w-full bg-[#f8fafc] overflow-y-auto">
      {renderMobileView()}
    </div>
  </>
);
};
