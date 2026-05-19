import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

app.use((err, req, res, next) => {
  console.error('Centralized Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred.',
  });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hireform';

console.log('Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    global.useMockDb = false;
    app.listen(PORT, () => {
      console.log(`HireForm Backend Server running successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ Mongoose connection failed:', err.message);
    console.warn('⚡ Booting Backend in RESILIENT IN-MEMORY MOCK MODE so the app remains fully functional!');
    global.useMockDb = true;
    app.listen(PORT, () => {
      console.log(`HireForm Backend Server running successfully on port ${PORT} (IN-MEMORY MOCK DB MODE)`);
    });
  });
