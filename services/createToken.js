import jwt from 'jsonwebtoken';
import redisClient from './redis.js';
import { v4 as uuidv4 } from "uuid";
export { createToken,generateRefreshToken };

const createToken = (id,expire,role) => {//access token
    const payload = {
        id:id,
        role:role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expire });
}

const generateRefreshToken = async(id,rememberMe) => {
  let expire='1d'
  let expireTime=1
  if(rememberMe){
    expire='30d'
    expireTime=30
  }
  const token= jwt.sign(
          {
            userId: id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: expire
          }
        );
    const tokenId = uuidv4();
    await redisClient.set(`user:${id}:${tokenId}`,
      token,{EX:expireTime* 24 * 60 * 60}
    )
  
  return {token:token,
          tokenId:tokenId,
          expireTime:expireTime* 24 * 60 * 60,
          rememberMe:rememberMe
         };
};