import jwt from 'jsonwebtoken'
export {veryfireToken,isAdmin}


const veryfireToken=(req,res,next)=>{
   try{
    const accessToken = req.cookies.accessToken;
    console.log('accessToken là',accessToken)
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log('decoded token là',decoded)
    req.userId = decoded.id;
    req.userRole=decoded.role
    console.log('userId là',req.userId)
    console.log('role là',req.userRole)

    if (!req.userId||!req.userRole) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ. User không tồn tại.'
                });
            }
    next()}
    catch(err){
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