import Vocabulary from '../../model/block/vocabularyBlock.js'
import {deleteImageKit} from '../../services/imageKitServices.js'
export{addVocabulary,getVocabulary,updateVocabulary,deleteVocabulary}

const addVocabulary=async(req,res)=>{
    try{
        const {pattern,explaination,latin,imageUrl,level,example,imageId}=req.body
        console.log("req.body",req.body)
        if(!pattern||!explaination||!latin){
            return res.status(409).json({
                success:false,
                message:'Thiếu thông tin'
            })           
        }
        const isExist = await Vocabulary.findOne({pattern:pattern}).lean()
        if(isExist){
            return res.status(409).json({
                success:false,
                message:'Đã tồn tại'
            })
        }
        const newVocabulary= new Vocabulary({
            pattern,explaination,latin,imageUrl,level,example,imageId
        })
        const addNew= await newVocabulary.save()
        if(addNew){
            return res.status(201).json({
                success:true,
                message:'Thêm thành công'
            })           
        }
            return res.status(409).json({
                success:false,
                message:'Thêm không thành công, lỗi database'
            })
    }catch(err){
            return res.status(500).json({
                success:false,
                message:'Lỗi server'
            })
    }
}
const getVocabulary=async(req,res)=>{
    try{
        const response= await Vocabulary.find().lean()
        if(response){
            return res.status(200).json({
                success:true,
                message:"Danh sách từ vựng",
                data:response
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
                success:false,
                message:'Lỗi server'
            })
    }
}
const updateVocabulary=async(req,res)=>{
    try{
        const {id} =req.params
        const {pattern,explaination,latin,imageUrl,level,example,imageId}=req.body
        const check={pattern,explaination,latin,imageUrl,level,example,imageId}
        //không dùng if để check underfine vì giá trị 0,false,'' đều được if coi là false nên nó bỏ qua giá trị
        const data= {}
        Object.entries(check).forEach(([key, value]) => {
            if (value !== undefined) {
                data[key] = value
            }
            })
        console.log(data)
        const oldWord = await Vocabulary.findOne({_id:id})
        console.log("oldww",oldWord)
        if (imageId && oldWord.imageId) {
        await deleteImageKit(oldWord.imageId)
        }

        const findWord= await Vocabulary.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        )

        if(findWord){
            return res.status(200).json({
                success:true,
                message:'Cập nhật thành công',
                data:findWord//trả dữ liệu để cập nhật cho thông tin đó, ko nên render lại trang
            })
        }
        return res.status(400).json({
                success:false,
                message:'Cập nhật thất bại'
            })
    }catch(err){
        console.log(err)
        return res.status(500).json({
                success:false,
                message:'Lỗi server'
            })
    }
}
const deleteVocabulary=async (req,res) => {
    try{
        const {id} =req.params
        const deleteVoca= await Vocabulary.findByIdAndDelete(
            id
        )
        const deleteOldImage=await deleteImageKit(deleteVoca.imageId)
        console.log("xóa thành công",deleteOldImage)
        if (!deleteVoca) {
            return res.status(404).json({
                success:false,
                message: "Không tìm thấy từ vựng"
            })
            }
        return res.status(200).json({
            success:true,
            message: "Xóa từ vựng thành công"
            })
    }
    catch(err){

    }
    
}