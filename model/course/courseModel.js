import mongoose from 'mongoose'

const courseSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    imgUrl:{
        type:String,
        required:true
    },
    imgId:{
        type:String,
        required:true
    },
    oldImgId:{
        type: String,
        default:''
    },
    description:{
        type:String,
        required:true
    },
    lesson:[
        {   
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lesson"
        }
    ],
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})
const Course= new mongoose.model('Course',courseSchema)
export default Course