import Exam from '../model/practice/examModel.js'
import Course from '../model/course/courseModel.js'
export const getMostPopularCourse=async(req,res)=>{
    try{
        const data=await Course.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            data:data,
            success:true,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:"Lỗi server"
        })
    }
}
export const getLatestExam=async(req,res)=>{
    try{
        const data=await Exam.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            data:data,
            success:true,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:"Lỗi server"
        })
    }
}