import express from 'express';
import { verifyToken,isAdmin } from '../../middleware/authMiddleware.js';
import { createLesson, updateLesson, deleteLesson, getLessonById } from '../../controller/course/lessonController.js';

const router = express.Router();
router.use(verifyToken)
router.post('/:courseId',isAdmin, createLesson);
router.get('/:id', getLessonById);
router.put('/:courseId/:lessonId',isAdmin, updateLesson);
router.delete('/:id',isAdmin, deleteLesson);

export default router;
