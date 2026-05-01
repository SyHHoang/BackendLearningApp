import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js'
import {getMostPopularCourse,getLatestExam} from '../controller/userDashboard.js'
const router= express.Router()
router.use(verifyToken)
router.get('/course',getMostPopularCourse)
router.get('/exam',getLatestExam)
export default router