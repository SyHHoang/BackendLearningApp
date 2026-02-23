//phần khởi động ở đầu mỗi bài học (hội thoại, v...v)
import mongoose from "mongoose";
const grammarSchema=new mongoose.Schema({
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
const WarmUp= new mongoose.model('WarmUp',WarmUpSchema)
export default WarmUp