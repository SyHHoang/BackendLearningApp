import express from 'express'
import {refreshToken} from '../controller/refreshToken.js'
import {verifyRefreshToken} from '../middleware/authMiddleware.js'
const router= express.Router()
router.post('/',verifyRefreshToken,refreshToken)
export default router