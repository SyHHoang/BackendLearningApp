import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectRedis } from './services/redis.js';
// routers
import userRouter from './router/userRouter.js';
import courseRouter from './router/course/courseRouter.js';
import imageKitRouter from './router/imgKitRouter.js';
import examRouter from './router/practice/examRouter.js';
import lessonRouter from './router/course/lessonRouter.js';
import audioRouter from './router/audioRouter.js';
import userExamRouter from './router/practice/userExamRouter.js';
import flashCardListRouter from './router/flashcard/flashCardListRouter.js';
import flashCard from './router/flashcard/flashcardRouter.js';
import userDashboard from './router/userDasdboardRouter.js';
import courseCategory from './router/course/categoryRouter.js';
import  refreshToken  from './router/refreshTokenRouter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

// routes
app.use('/users', userRouter);
app.use('/courses', courseRouter);
app.use('/imgUpload', imageKitRouter);
app.use('/exams', examRouter);
app.use('/lessons', lessonRouter);
app.use('/audio', audioRouter);
app.use('/userExam', userExamRouter);
app.use('/cardLists', flashCardListRouter);
app.use('/cards', flashCard);
app.use('/userDashboard', userDashboard);
app.use('/courseCategories', courseCategory);
app.use('/refreshToken',refreshToken)
async function startApp() {
  try {
    await connectRedis();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server chạy tại http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Failed to start app:", err);
    process.exit(1);
  }
}

startApp();