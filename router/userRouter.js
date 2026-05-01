import {createUser,login,getUsers,
        getUserById,
        updateUser,
        deleteUser,
        } from '../controller/userController.js';
import {verifyToken,isAdmin} from '../middleware/authMiddleware.js'
import express from 'express';
const router= express.Router();

router.post('/createUser', createUser);
router.post('/login',login)
router.use(verifyToken)
router.get('/',isAdmin,getUsers)
router.get('/:id',getUserById)
router.patch('/:id',isAdmin,updateUser)
router.delete('/:id',isAdmin,deleteUser)
export default router;