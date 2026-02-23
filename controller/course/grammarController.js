import Grammar from '../../model/block/grammarBlock.js'
import {deleteImageKit} from '../../services/imageKitServices.js'
export{addGrammar,getGrammar,updateGrammar,deleteGrammar}

const addGrammar=async(req,res)=>{
    try{
        const {pattern,explaination,latin,imageUrl,level,example,imageId}=req.body
        console.log("req.body",req.body)
        if(!pattern||!explaination||!latin){
            return res.status(409).json({
                success:false,
                message:'Thiếu thông tin'
            })           
        }
        const isExist = await Grammar.findOne({pattern:pattern}).lean()
        if(isExist){
            return res.status(409).json({
                success:false,
                message:'Đã tồn tại'
            })
        }
        const newGrammar= new Grammar({
            pattern,explaination,latin,imageUrl,level,example,imageId
        })
        const addNew= await newGrammar.save()
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
const getGrammar=async(req,res)=>{
    try{
        const response= await Grammar.find().lean()
        if(response){
            return res.status(200).json({
                success:true,
                message:"Danh sách ngữ pháp",
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
const updateGrammar=async(req,res)=>{
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
        const oldWord = await Grammar.findOne({_id:id})
        console.log("oldww",oldWord)
        if (imageId && oldWord.imageId) {
        await deleteImageKit(oldWord.imageId)
        }

        const findWord= await Grammar.findByIdAndUpdate(
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
const deleteGrammar=async (req,res) => {
    try{
        const {id} =req.params
        const deleteVoca= await Grammar.findByIdAndDelete(
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