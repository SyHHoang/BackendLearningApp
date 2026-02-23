// models/Attempt.js
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    selectedAnswer: {
      type: String,
      required: true
    },

    isCorrect: {
      type: Boolean
    },

    score: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const AttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    answers: [AnswerSchema],

    totalScore: {
      type: Number,
      default: 0
    },

    correctCount: {
      type: Number,
      default: 0
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    submittedAt: {
      type: Date
    },

    timeSpent: {
      type: Number // giây
    },

    analysis: {
      vocab: { type: Number, default: 0 },
      grammar: { type: Number, default: 0 },
      reading: { type: Number, default: 0 },
      listening: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", AttemptSchema);
