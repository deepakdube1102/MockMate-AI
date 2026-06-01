import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FloatingHeader } from './components/FloatingHeader';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { InterviewStudio } from './pages/InterviewStudio';
import { CategoryDetails } from './pages/CategoryDetails';
import { Results } from './pages/Results';
import { InterviewSession } from './pages/InterviewSession';
import { ReportDetails } from './pages/ReportDetails';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { ProfileSettings } from './pages/ProfileSettings';
import { Landing } from './pages/Landing';

/**
 * ProtectedRoute — requires auth AND completed onboarding.
 * New users who haven't finished onboarding are bounced to /onboarding.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mb-4"></div>
        <p className="font-semibold text-xs tracking-wider uppercase">Loading your session...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if not completed yet
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

/**
 * OnboardingRoute — only accessible to authenticated users who haven't completed onboarding.
 * Already-onboarded users are redirected straight to the dashboard.
 */
const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center text-white/50">
        <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-white/60 animate-spin mb-4"></div>
        <p className="font-semibold text-xs tracking-wider uppercase">Preparing your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Already onboarded — skip straight to dashboard
  if (user.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main layout wrapper (sidebar + header)
const AppLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col w-full text-[#111827]">
      <div className="flex-1 flex flex-col md:flex-row w-full items-stretch">
        {user && <Sidebar />}
        <main className="flex-1 flex flex-col overflow-y-auto relative md:pt-16 pb-6">
          {user && <FloatingHeader />}
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/studio" element={<ProtectedRoute><InterviewStudio /></ProtectedRoute>} />
            <Route path="/studio/:categoryName" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
            <Route path="/interviews/:id" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
            <Route path="/interviews/:id/report" element={<ProtectedRoute><ReportDetails /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Onboarding — no sidebar or header, handled by OnboardingRoute guard */}
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            }
          />
          <Route path="*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
