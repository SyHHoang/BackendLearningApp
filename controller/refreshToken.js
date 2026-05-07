
import jwt from "jsonwebtoken";
import { createToken,generateRefreshToken } from "../services/createToken.js";
import redis from "../services/redis.js"; 
import User from '../model/userModel.js'
 export const refreshToken = async (req, res) => {
  try {
    // check Redis
    const stored = await redis.get(`refresh:${req.refreshToken}`);
    if (!stored) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    const checkUser=await User.findOne({_id:req.userId}).select('role').lean()
    if(!checkUser){
      return res.status(403).json({ error: "Không tìm thấy người dùng" });
    }
    // tạo access token mới

        res.cookie('accessToken', createToken(req.userId,'1m',checkUser.role), {
  httpOnly: true,
  secure: false, // dev
  sameSite: 'lax'
});
    res.json({
      success:true
    });
  } catch (err) {
    console.log("err",err)
    return res.status(403).json({ error: "Invalid token" });
  }
};