// models/Exam.js
import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    level: {
      type: String,
      enum: ["N5", "N4", "N3", "N2", "N1"],
      required: true
    },
    structure: {
      vocabulary: {
        count: {
          type: Number,
          required: true
        },
        duration:{
          type: Number,
          required: true
        }
      },
      reading: {
       count: {
          type: Number,
          required: true
        },
        duration:{
          type: Number,
          required: true
        }
      },
      listening: {  
       count: {
          type: Number,
          required: true
        },
        duration:{
          type: Number,
          required: true
        }
      },
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],
  },
  { timestamps: true }
);


ExamSchema.virtual('duration').get(function() {
  return (
    this.structure.vocabulary.duration +
    this.structure.reading.duration +
    this.structure.listening.duration
  );
});

ExamSchema.virtual('totalQuestions').get(function() {
  return (
    this.structure.vocabulary.count +
    this.structure.reading.count +
    this.structure.listening.count
  );
});
ExamSchema.set("toJSON", { virtuals: true });
ExamSchema.set("toObject", { virtuals: true });
export default mongoose.model("Exam", ExamSchema);
