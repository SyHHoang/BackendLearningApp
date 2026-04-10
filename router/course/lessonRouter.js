import express from 'express';
import { veryfireToken } from '../../middleware/authMiddleware.js';
import { createLesson, updateLesson, deleteLesson, getLessonById } from '../../controller/course/lessonController.js';

const router = express.Router();
router.post('/:courseId', veryfireToken, createLesson);
router.get('/:id', veryfireToken, getLessonById);
router.put('/:courseId/:lessonId', veryfireToken, updateLesson);
router.delete('/:id', veryfireToken, deleteLesson);

export default router;
