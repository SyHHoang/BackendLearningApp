import mongoose from 'mongoose'

const lessonSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    warmUp:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"WarmUp"
        }
    ],
    vocabulary:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Vocabulary"
        }
    ],
    video:
        
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        
    ,
    kanji:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Kanji"
        }
    ],
    grammar:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Grammar"
        }
    ],
    practice:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Practice"
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
const Lesson = new mongoose.model('Lesson',lessonSchema)
export default Lesson