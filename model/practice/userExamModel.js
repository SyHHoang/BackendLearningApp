// models/Attempt.js
import mongoose from "mongoose";

const UserExamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    examId: {
      type: String,
      required: true
    },
    examInfo: {
      type: Object,
      required: true
    },
    answersList: [],
    questionPartCountList: [],
    totalScore: {
      type: Number,
      default: 0
    },
    correctCount: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Date,
      default: Date.now
    },

    submitTime: {
      type: Date
    },
    time: {
      type: Number 
    },

  },
  { timestamps: true }
);

const UserExam = mongoose.model("UserExam", UserExamSchema);
export default UserExam;
