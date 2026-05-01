import express from 'express';
import { getTokenImageKit } from "../services/imageKitServices.js";
import {verifyToken} from "../middleware/authMiddleware.js"
const router = express.Router();
router.get('/imageKitToken',verifyToken,getTokenImageKit);
export default router;