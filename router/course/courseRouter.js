import { createCourse, updateCourse, deleteCourse, getAllCourse, getCourseDetail } from '../../controller/course/courseController.js'
import { createLesson } from '../../controller/course/lessonController.js'
import express from 'express'
import { veryfireToken,isAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router();
router.get('/', veryfireToken, getAllCourse)
router.get('/:id', veryfireToken, getCourseDetail)

router.use(isAdmin)
router.post('/', veryfireToken, createCourse)
router.post('/:courseId/lessons', veryfireToken, createLesson)
router.patch('/:id', veryfireToken, updateCourse)
router.delete('/:id', veryfireToken, deleteCourse)
export default router