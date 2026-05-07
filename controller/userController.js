import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import {createToken,generateRefreshToken} from '../services/createToken.js'
export { createUser,login };
import redis from '../services/redis.js'
const createUser= async (req, res) => {
    try {
        const { username, email, password } = req.body;
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
        })}
            return res.status(400).json({
            success: false,
            message: 'Tạo người dùng không thành công',
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({  
            success: false,
            message: 'Lỗi máy chủ',
        });
    }
}

const login= async (req, res) => {
    try{
        const { email, password,rememberMe } = req.body;
        console.log("req là",req.body)
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
        const refreshToken = await generateRefreshToken(user._id, rememberMe);
        res.cookie('accessToken', createToken(user._id,'1m',user.role), {
            httpOnly: true,
            secure: false, // dev
            sameSite: 'lax'
            });
    if(refreshToken.rememberMe){
        res.cookie('refreshToken', refreshToken.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: refreshToken.expireTime* 1000
        });
        res.cookie('tokenId', refreshToken.tokenId, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: refreshToken.expireTime* 1000
        });}
    else{
        res.cookie('refreshToken', refreshToken.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
        });
        res.cookie('tokenID', refreshToken.tokenId, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
        }); 
        }
        //đăng nhập thành công
        res.status(200).json({
            success:true,
            message:'Đăng nhập thành công',
            role:user.role
        });
    }catch(err){
        console.log(err)
         res.status(500).json({
            success:false,
            message:'Lỗi máy chủ',
        })
    }
}

// @desc    Lấy tất cả users (có phân trang)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Xây dựng filter
        const filter = {};

        // Lọc theo các trường
        if (req.query.role) filter.role = req.query.role;
        if (req.query.level) filter.level = req.query.level;

        // Tìm kiếm theo keyword (nếu có)
        if (req.query.keyword) {
            filter.$or = [
                { username: { $regex: req.query.keyword, $options: 'i' } },
                { email: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        // Lọc theo khoảng thời gian (nếu cần)
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        // Xây dựng sort
        const sort = {};
        if (req.query.sortBy) {
            const order = req.query.order === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = order;
        } else {
            sort.createdAt = -1; // Mặc định sort theo createdAt giảm dần
        }

        // Thực hiện query
        const users = await User.find(filter)
            .select('-passwordHash')
            .skip(skip)
            .limit(limit)
            .sort(sort);

        // Đếm tổng số records (cho phân trang)
        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            filters: {
                keyword: req.query.keyword || null,
                role: req.query.role || null,
                status: req.query.status || null,
                level: req.query.level || null,
                sortBy: req.query.sortBy || 'createdAt',
                order: req.query.order || 'desc'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách users',
            error: error.message
        });
    }
};

// @desc    Lấy user theo ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin user',
            error: error.message
        });
    }
};


// @desc    Cập nhật user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const { username, email, password, level, avatarUrl, status, role } = req.body;
        
        // Tìm user cần cập nhật
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        // Kiểm tra email/username đã tồn tại chưa (nếu có thay đổi)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng bởi user khác'
                });
            }
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Username đã được sử dụng bởi user khác'
                });
            }
        }

        // Cập nhật thông tin
        if (username) user.username = username;
        if (email) user.email = email;
        if (level) user.level = level;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        if (status) user.status = status;
        if (role) user.role = role;
        
        // Cập nhật password nếu có
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }

        user.updateAt = Date.now();
        await user.save();

        // Không trả về passwordHash
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(200).json({
            success: true,
            message: 'Cập nhật user thành công',
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật user',
            error: error.message
        });
    }
};

// @desc    Xóa user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        // Không cho phép xóa chính mình
        if (req.user && req.user.id === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa tài khoản của chính mình'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Xóa user thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa user',
            error: error.message
        });
    }
};
export const logout=async(req,res)=>{
    try{
        await redis.del('name')
    }catch(err){

    }
}
export const autoLogin=async(req,res)=>{
    try{
        const userId=req.userId
        const resUser=await User.findById(userId).lean()
        if(!resUser){
         res.status(400).json({
            success: false,
            message: 'Không tìm thấy User',
            error: error.message
        });           
        }
        else{
            res.status(200).json({
                success:true,
                role:resUser.role
            })
        }
    }catch(err){
         res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });  
    }
}