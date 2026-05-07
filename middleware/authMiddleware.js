import jwt from 'jsonwebtoken'
import redisClient from '../services/redis.js';
export {verifyToken,isAdmin,verifyRefreshToken}
const verifyToken=(req,res,next)=>{
   try{
    const accessToken = req.cookies.accessToken;
    console.log('accessToken là',accessToken)
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole=decoded.role

    if (!req.userId||!req.userRole) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ. User không tồn tại.'
                });
            }
    next()}
    catch(err){
            if (err.name === 'TokenExpiredError') {
                console.log("access_token hết hạn")
                return res.status(401).json({ 
                    success: false, 
                    code: 'TOKEN_EXPIRED',
                    message: 'Token đã hết hạn',
                    expiredAt: err.expiredAt
                });
            }
            
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ 
                    success: false, 
                    code: 'INVALID_TOKEN',
                    message: 'Token không hợp lệ' 
                });
            }
        return res.status(401).json({ message: 'Invalid token' });
    }
}
const isAdmin=(req,res,next)=>{
    try{
        console.log('role là',req.userRole)
        if(req.userRole !=='admin'){
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền hạn làm điều này'
                });
        }
        next()
    }catch(err){

    }
}
const verifyRefreshToken=async(req,res,next)=>{
   try{
    const tokenId = req.cookies.tokenId;
    const clientRefreshToken=req.cookies.refreshToken
    console.log('TokenId là',tokenId)
    console.log("client refresh token",clientRefreshToken)
    if(!tokenId||!clientRefreshToken){
        return res.status(401).json({
            success:false,
        })
    }
    const decoded = jwt.verify(clientRefreshToken, process.env.JWT_SECRET);
    console.log("đến đây")
    req.userId = decoded.userId;
    req.refreshToken=clientRefreshToken
    if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ. User không tồn tại.'
                });
        }
    const serverRefreshToken=await redisClient.get(`user:${req.userId}:${tokenId}`)
    console.log("server token",serverRefreshToken)
    if(!serverRefreshToken){
            return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ.'
                });
    }
    console.log("userID",decoded.userId)

    next()}
    catch(err){
        console.log(err)
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    code: 'TOKEN_EXPIRED',
                    message: 'Token đã hết hạn',
                    expiredAt: err.expiredAt
                });
            }
            
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ 
                    success: false, 
                    code: 'INVALID_TOKEN',
                    message: 'Token không hợp lệ' 
                });
            }
        return res.status(401).json({ message: 'Invalid token' });
    }
}