import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['choice', 'write'],
      default: 'choice',
      required: true
    },
    partId:String,
    order:Number,//thứ tự cho 1 số chức năng cụ thể
    image:{   
       imageUrl: String,
       imageId: String, //id ảnh cũ để xóa
       },
    audio:{
    audioUrl: String,
    audioId: String, //id audio cũ để xóa
    },
    videoUrl: String,
    options:{
      type: [String],
      required: true
    },
    correctAnswer: {
      type: Number,
      required: true
    },

    explanation: {
      type: String
    },
    score: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);