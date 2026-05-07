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
    category:{
        
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseCategory"
             
    },
    lesson:[
        {   
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lesson"
        }
    ],
},{ timestamps: true })
courseSchema.index({ category: 1 });
const Course= new mongoose.model('Course',courseSchema)

export default Course