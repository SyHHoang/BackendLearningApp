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
},{ timestamps: true })
const Lesson =  mongoose.model('Lesson',lessonSchema)
export default Lesson