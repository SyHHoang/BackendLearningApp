import {createUser,login,getUsers,
        getUserById,
        updateUser,
        deleteUser,
        } from '../controller/userController.js';
import {veryfireToken,isAdmin} from '../middleware/authMiddleware.js'
import express from 'express';
const router= express.Router();

router.post('/createUser', createUser);
router.post('/login',login)
router.get('/',veryfireToken,isAdmin,getUsers)
router.get('/:id',veryfireToken,getUserById)
router.patch('/:id',veryfireToken,isAdmin,updateUser)
router.delete('/:id',veryfireToken,isAdmin,deleteUser)
export default router;