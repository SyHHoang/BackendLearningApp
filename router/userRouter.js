import {createUser,login,getUsers,
        getUserById,
        updateUser,
        deleteUser,
        logout,autoLogin
        } from '../controller/userController.js';
import {verifyToken,isAdmin,verifyRefreshToken} from '../middleware/authMiddleware.js'
import express from 'express';
const router= express.Router();

router.post('/createUser', createUser);
router.post('/login',login)
router.post('/a/login',verifyRefreshToken,autoLogin)
router.post('/logout',verifyToken,logout)
router.get('/',verifyToken,isAdmin,getUsers)
router.get('/:id',verifyToken,getUserById)
router.patch('/:id',verifyToken,isAdmin,updateUser)
router.delete('/:id',verifyToken,isAdmin,deleteUser)
export default router;