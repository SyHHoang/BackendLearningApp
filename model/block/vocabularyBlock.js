import mongoose from "mongoose";
const vocabularySchema=new mongoose.Schema({
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
    imageUrl:String,
    imageId:String,//id ảnh cũ để xóa
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
const Vocabulary= new mongoose.model('vocabulary',vocabularySchema)
export default Vocabulary