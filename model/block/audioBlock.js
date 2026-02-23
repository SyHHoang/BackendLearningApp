import mongoose from "mongoose";

const audioSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    audioUrl:{
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
const Audio= new mongoose.model('Audio',audioSchema)
export default Audio