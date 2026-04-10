import mongoose from 'mongoose'

const lessonSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    practice:{
        title:{
        type:String,
        required:true,
        trim:true
        },
        description:String,
        content: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Question"
        }
    ]},
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
},)
const Lesson =  mongoose.model('Lesson',lessonSchema)
export default Lesson