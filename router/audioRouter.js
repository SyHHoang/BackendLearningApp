import express from 'express';
import { audioAuth } from '../services/audioServices.js';
import {verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', verifyToken, audioAuth);
export default router;