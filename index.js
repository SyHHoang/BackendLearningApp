import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './router/userRouter.js';
import flashcardRouter from './router/flashcardRouter.js';
import courseRouter from './router/course/courseRouter.js'
import imageKitRouter from './router/imgKitRouter.js'
import vocabularyRouter from './router/course/vocabularyRouter.js'
import grammarRouter from './router/course/grammarRouter.js'
import examRouter from './router/practice/examRouter.js'
dotenv.config();        
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/users',userRouter);
app.use('/flashcards',flashcardRouter);
app.use('/courses',courseRouter)
app.use('/imgUpload',imageKitRouter)
app.use('/vocabulary',vocabularyRouter)
app.use('/grammar',grammarRouter)
app.use('/exams', examRouter)
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
