import jwt from 'jsonwebtoken'
export {veryfireToken}
const veryfireToken=(req,res,next)=>{
   try{ const authHeader = req.headers.authorization;
    console.log('token là',req.headers.authorization)
    if (!authHeader)
    return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id;
    req.userRole=decoded.role
    next()}
    catch(err){
        return res.status(401).json({ message: 'Invalid token' });
    }
}