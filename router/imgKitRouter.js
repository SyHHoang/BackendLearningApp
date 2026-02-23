import express from 'express';
import { getTokenImageKit } from "../services/imageKitServices.js";
import {veryfireToken} from "../middleware/authMiddleware.js"
const router = express.Router();
router.get('/imageKitToken',veryfireToken,getTokenImageKit);
export default router;