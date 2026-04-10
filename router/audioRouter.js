import express from 'express';
import { audioAuth } from '../services/audioServices.js';
import { veryfireToken } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', veryfireToken, audioAuth);
export default router;