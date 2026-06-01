import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
  country: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  phoneNumber?: string;
  targetRole: string;
  experienceLevel: string;
  skills: string[];
  preferredInterviewType: string;
  careerGoal: string;
  onboardingCompleted: boolean;
  interviewsCompleted: number;
  averageScore: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<any>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if token is in localStorage
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await api.auth.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to load user profile on startup:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.register(name, email, password);
      localStorage.setItem('token', response.token);
      setUser(response);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const loginWithGoogle = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await api.auth.googleLogin(accessToken);
      localStorage.setItem('token', response.token);
      setUser(response);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.auth.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
