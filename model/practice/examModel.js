// models/Exam.js
import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    examCategory: {
      type: String,
      enum: ['toeic', 'ielts', 'toefl', 'other'],
      default: 'other',
      required: true
    },
    examType: {
      type: String,
      enum: ['free', 'order'],
      default: 'free',
      required: true
    },
    totalTime:{
      type: Number,
      required: true
    },
    level: {
      type: String,
      enum: ['A1','A2','B1','B2','C1','C2','None'],
      default:'None',
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", ExamSchema);
