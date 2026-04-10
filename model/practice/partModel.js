import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  examId:String,
  title:{
    type:String
  },
  type:{
    type:String,
    enum:['one','many'],
    default:'one'
  },
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
  time: {
    type: Number,
    required: true,
    default: 0
  },
  audioId: {
    type: String,
    default: ''
  },
}, { timestamps: true });


const PartModel = new mongoose.model('PartModel', partSchema);
export default PartModel