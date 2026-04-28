import { createCourse, updateCourse, deleteCourse, getAllCourse, getCourseDetail } from '../../controller/course/courseController.js'
import { createLesson } from '../../controller/course/lessonController.js'
import express from 'express'
import { veryfireToken,isAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router();
router.use(veryfireToken)
router.get('/', getAllCourse)
router.get('/:id', getCourseDetail)

router.use(isAdmin)
router.post('/', createCourse)
router.post('/:courseId/lessons', createLesson)
router.patch('/:id', updateCourse)
router.delete('/:id', deleteCourse)
export default router