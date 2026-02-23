import Course from '../../model/course/courseModel.js'
import {deleteImageKit} from '../../services/imageKitServices.js'
export{createCourse,updateCourse,deleteCourse,getAllCourse,getCourseDetail}
const getAllCourse = async(req,res)=>{
    try{
        const getAll=await Course.find().select('-lesson').lean()
        return res.status(200).json({
            success:true,
            message:'Lấy thành công tất cả khóa học',
            data:getAll
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Lỗi server',
            err:err
        }) 
    }
}
const getCourseDetail=async(req,res)=>{
    try{
        const {_id} =req.params
        const getCourse=await Course.findById(_id).populate('lesson','name').lean()
        return res.status(200).json({
            success:true,
            message:"Lấy thông tin chi tiết khóa học",
            data:getCourse
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Lỗi server',
            err:err
        }) 
    }
}
const createCourse =async(req,res)=>{
    try{
        const {name,imgUrl,description}=req.body
        if(!name||!imgUrl||!description){
                return res.status(400).json({
                success:false,
                message:'Thiếu thông tin'
            })
        }
        const isExist=await Course.findOne({name:name}).lean()
        if(isExist){
            return res.status(409).json({
                success:false,
                message:'Đã tồn tại khóa học'
            })
        }
        const newCourse=new Course({
            name:name,
            imgUrl:imgUrl,
            description:description,
            oldImgUrlLocal:imgUrl
        })
        const createNewCourse=await newCourse.save()
        if(createNewCourse){
            return res.status(200).json({
                success:true,
                message:'Tạo khóa học thành công'
            })
        }
        res.status(500).json({
            success:false,
            message:'Lỗi database'
        })
    }catch(err){
        console.log('err',err)
        return res.status(500).json({
            success:false,
            message:'Lỗi server',
            err:err
        }) 
    }
}

const deleteCourse = async(req,res)=>{
    try{
        const {id}=req.params
        const{oldImgUrlLocal}=reg.body
        const find=await Course.findByIdAndDelete(id);
        if(find){
            
            return res.status(200).json({
                success:true,
                message:'Xóa khóa học thành công'
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Lỗi server',
            err:err
        }) 
    }
}
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imgUrl, description,oldImgUrlLocal} = req.body;

        // Kiểm tra xem course có tồn tại không
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khóa học'
            });
        }
        // Cập nhật các trường
        const updateData = {};
        if (name) updateData.name = name;
        if (imgUrl) {updateData.imgUrl = imgUrl;
            updateData.oldImgUrlLocal=oldImgUrlLocal
        }
        if (description) updateData.description = description;
        updateData.updateAt = Date.now();

        // Cập nhật course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, // trả về document sau khi update
                runValidators: true // chạy validation
            }
        );
        return res.status(200).json({
            success: true,
            message: 'Cập nhật khóa học thành công',
            data: updatedCourse
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật khóa học:', error);
        
        // Xử lý lỗi duplicate key (tên khóa học đã tồn tại)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Tên khóa học đã tồn tại'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật khóa học',
            error: error.message
        });
    }
};