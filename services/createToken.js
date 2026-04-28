import jwt from 'jsonwebtoken';
import redisClient from './redis.js';
export { createToken,generateRefreshToken };

const createToken = (id,expire,role) => {
    const payload = {
        id:id,
        role:role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expire });
}


const generateRefreshToken = async(id,expire) => {
  const token= jwt.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expire
    }
  );
    await redisClient.setEx(`refresh:${token}`,30* 24 * 60 * 60, id.toString());
  return token;
};