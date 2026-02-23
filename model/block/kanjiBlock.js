import mongoose from "mongoose";
const kanjiSchema=new mongoose.Schema({
    pattern:{
        type:String,
        required:true,
        trim:true
    },
    explaination:{//giải thích
        type: String,
        required:true,
        trim:true
    },  
    latin:{//cách viết latin
        type:String,
        required:true,
        trim:true
    },
    level:{
        type:String,
        enum:['N1','N2','N3','N4','N5']
    },
    example:String,
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})
const Kanji= new mongoose.model('Kanji',kanjiSchema)
export default Kanji