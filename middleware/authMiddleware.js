import jwt from 'jsonwebtoken'
export {veryfireToken,isAdmin}
const veryfireToken=(req,res,next)=>{
   try{ const authHeader = req.headers.authorization;
    console.log('token là',req.headers.authorization)
    if (!authHeader)
    return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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