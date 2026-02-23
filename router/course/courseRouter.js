import {createCourse,updateCourse,deleteCourse,getAllCourse,getCourseDetail} from '../../controller/course/courseController.js'
import express from 'express'
import {veryfireToken} from '../../middleware/authMiddleware.js'

const router = express.Router();
router.get('/',veryfireToken,getAllCourse)
router.get('/:id',veryfireToken,getCourseDetail)
router.post('/',veryfireToken,createCourse)
router.put('/:id',veryfireToken,updateCourse)
router.delete('/:id',veryfireToken,deleteCourse)
export default router