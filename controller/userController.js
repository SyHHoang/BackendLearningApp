import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import {createToken} from '../services/createToken.js'
export { createUser,login };
const createUser= async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body)
        //kiểm tra thông tin bắt buộc
        if(!email && !password){
            return res.status(400).json({
                succsess: false,
                message: 'Thiếu thông tin bắt buộc'
            })}
        //kiểm tra tồn tại
        const existingUser= await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }
        //hash mật khẩu
        const salt= await bcrypt.genSalt(10);
        const passwordHash= await bcrypt.hash(password, salt);
        //tạo user
        const newUser = new User({
            username,
            email,
            passwordHash,
        });
        const create=await newUser.save();
        if(create){        
           return  res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            user: newUser,
            token: createToken(newUser._id,'30h',newUser.role)
        })}
            return res.status(400).json({
            success: false,
            message: 'Tạo người dùng không thành công',
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({  
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
}

const login= async (req, res) => {
    try{
        const { email, password } = req.body;
        //kiểm tra thông tin
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Thiếu thông tin đăng nhập',
            });
        }
        //kiểm tra tồn tại
        const user= await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                success:false,
                message:'Người dùng không tồn tại',
            });
        }
        //kiểm tra mk hash
        const isMatch= await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:'Mật khẩu không đúng',
            });
        }
        //đăng nhập thành công
        res.status(200).json({
            success:true,
            message:'Đăng nhập thành công',
            user:user,
            role:user.role,
            token:createToken(user._id,'30h',user.role)
        });
    }catch(err){
         res.status(500).json({
            success:false,
            message:'Lỗi máy chủ',
        })
    }
}