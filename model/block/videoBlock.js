import mongoose from "mongoose";

const videoSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    videoUrl:{
        type:String,
        required:true,
        trim:true
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})
const Video= new mongoose.model('Video',videoSchema)
export default Video