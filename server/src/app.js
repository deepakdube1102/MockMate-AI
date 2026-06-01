import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

// Middlewares
const allowedOrigin = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.replace(/\/$/, '')
  : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Database connection sync middleware for serverless cold starts
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB connection is in progress, waiting...');
    await new Promise((resolve) => {
      mongoose.connection.once('open', () => {
        global.dbConnected = true;
        resolve();
      });
      // Timeout fallback after 3.5 seconds
      setTimeout(() => {
        global.dbConnected = mongoose.connection.readyState === 1;
        resolve();
      }, 3500);
    });
  } else {
    global.dbConnected = mongoose.connection.readyState === 1;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MockMate Server is healthy and running.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
