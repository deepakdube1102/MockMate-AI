const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const errorMsg = data.message || 'Something went wrong. Please try again.';
    throw new Error(errorMsg);
  }
  
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    
    register: async (name: string, email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password })
      });
      return handleResponse(res);
    },
    
    googleLogin: async (accessToken: string) => {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ accessToken })
      });
      return handleResponse(res);
    },
    
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    
    updateProfile: async (data: { 
      name?: string; 
      username?: string;
      country?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
      avatar?: string;
      targetRole?: string; 
      experienceLevel?: string; 
      skills?: string[] | string; 
      preferredInterviewType?: string;
      careerGoal?: string;
      password?: string 
    }) => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },

    completeOnboarding: async (data: {
      name?: string;
      username?: string;
      avatar?: string;
      country?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
      phoneNumber?: string;
      targetRole?: string;
      experienceLevel?: string;
      skills?: string[];
      preferredInterviewType?: string;
      careerGoal?: string;
    }) => {
      const res = await fetch(`${BASE_URL}/auth/onboarding`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },

    deleteAccount: async () => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },


  // Mock Interviews
  interviews: {
    create: async (data: { role: string; difficulty: string; interviewType: string; skills?: string }) => {
      const res = await fetch(`${BASE_URL}/interviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    
    submit: async (interviewId: string, answers: string[]) => {
      const res = await fetch(`${BASE_URL}/interviews/${interviewId}/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ answers })
      });
      return handleResponse(res);
    },
    
    getById: async (id: string) => {
      const res = await fetch(`${BASE_URL}/interviews/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    
    getReport: async (id: string) => {
      const res = await fetch(`${BASE_URL}/interviews/${id}/report`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    
    getHistory: async () => {
      const res = await fetch(`${BASE_URL}/interviews/history`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    
    getMetrics: async () => {
      const res = await fetch(`${BASE_URL}/interviews/dashboard/metrics`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Resume Parsing
  resumes: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const res = await fetch(`${BASE_URL}/resumes/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      return handleResponse(res);
    },
    
    getLatest: async () => {
      const res = await fetch(`${BASE_URL}/resumes/latest`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  }
};
