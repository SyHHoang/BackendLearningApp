
import jwt from "jsonwebtoken";
import { createToken,generateRefreshToken } from "../services/createToken.js";
import redis from "../config/redis.js"; 
 export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    // verify JWT
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET
    );

    // check Redis
    const stored = await redis.get(`refresh:${refresh_token}`);
    if (!stored) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // tạo access token mới
    const newAccessToken = createToken(decoded.userId, '1h', decoded.role);

    res.json({
      access_token: newAccessToken
    });
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};