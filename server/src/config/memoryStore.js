// Stateful in-memory database storage when MongoDB is offline
export const memoryStore = {
  users: [],
  interviews: [],
  reports: [],
  resumes: [],

  // User Operations
  findUserByEmail: (email) => {
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id) => {
    return memoryStore.users.find(u => u._id === id.toString());
  },

  createUser: (userData) => {
    const newUser = {
      _id: `mem_usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      username: '',
      country: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      skills: [],
      preferredInterviewType: '',
      careerGoal: '',
      onboardingCompleted: false,
      interviewsCompleted: 0,
      averageScore: 0,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mockmate',
      targetRole: 'Software Engineer',
      experienceLevel: 'Mid',
      createdAt: new Date(),
      ...userData,
      // Helper function to mock comparePassword
      comparePassword: async function(enteredPassword) {
        return enteredPassword === this.password; // In memory plain comparison for testing
      }
    };
    memoryStore.users.push(newUser);
    return newUser;
  },


  updateUser: (id, updateData) => {
    const idx = memoryStore.users.findIndex(u => u._id === id.toString());
    if (idx !== -1) {
      memoryStore.users[idx] = { ...memoryStore.users[idx], ...updateData };
      return memoryStore.users[idx];
    }
    return null;
  },

  // Interview Operations
  createInterview: (interviewData) => {
    const newInterview = {
      _id: `mem_int_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      answers: [],
      score: 0,
      feedback: '',
      status: 'pending',
      createdAt: new Date(),
      ...interviewData
    };
    memoryStore.interviews.push(newInterview);
    return newInterview;
  },

  findInterviewById: (id) => {
    return memoryStore.interviews.find(i => i._id === id.toString());
  },

  findInterviewsByUserId: (userId) => {
    return memoryStore.interviews
      .filter(i => i.userId.toString() === userId.toString())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Report Operations
  createReport: (reportData) => {
    const newReport = {
      _id: `mem_rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      ...reportData
    };
    memoryStore.reports.push(newReport);
    return newReport;
  },

  findReportByInterviewId: (interviewId) => {
    return memoryStore.reports.find(r => r.interviewId.toString() === interviewId.toString());
  },

  // Resume Operations
  createResume: (resumeData) => {
    const newResume = {
      _id: `mem_res_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      uploadedAt: new Date(),
      ...resumeData
    };
    memoryStore.resumes.push(newResume);
    return newResume;
  },

  findResumesByUserId: (userId) => {
    return memoryStore.resumes
      .filter(r => r.userId.toString() === userId.toString())
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }
};
