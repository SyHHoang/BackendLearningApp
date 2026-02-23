import {createUser,login} from '../controller/userController.js';
import {veryfireToken} from '../middleware/authMiddleware.js'
import express from 'express';
const router= express.Router();

router.post('/createUser', createUser);
router.post('/login',login)
export default router;