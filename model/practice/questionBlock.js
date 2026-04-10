import mongoose from "mongoose";

const questionBlockSchema = new mongoose.Schema({
  partId:String,
  content: {
    type: String,
    default: ''
  },
  order:{
    type: Number
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageId: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  },

  audioId: {
    type: String,
    default: ''
  },

  question: [
    {
      questionText: {
        type: String,
        default: ''
      },

      options: {
        type: [String],
        default: []
      },

      correctAnswer: {
        type: Number,
        default: 0
      },

      explaination: {
        type: String,
        default: ''
      },

      score: {
        type: Number,
        default: 0
      }
    }
  ]

}, { timestamps: true });


const QuestionBlock = new mongoose.model('QuestionBlock', questionBlockSchema);
export default QuestionBlock