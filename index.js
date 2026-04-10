import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './router/userRouter.js';
import courseRouter from './router/course/courseRouter.js'
import imageKitRouter from './router/imgKitRouter.js'
import examRouter from './router/practice/examRouter.js'
import lessonRouter from './router/course/lessonRouter.js'
import audioRouter from './router/audioRouter.js'
import userExamRouter from './router/practice/userExamRouter.js'
import flashCardListRouter from './router/flashcard/flashCardListRouter.js'
import flashCard from './router/flashcard/flashcardRouter.js'
dotenv.config();        
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/users',userRouter);
app.use('/courses',courseRouter)
app.use('/imgUpload',imageKitRouter)
app.use('/exams', examRouter)
app.use('/lessons', lessonRouter)
app.use('/audio', audioRouter)
app.use('/userExam', userExamRouter)
app.use('/cardLists', flashCardListRouter)
app.use('/cards',flashCard)
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
