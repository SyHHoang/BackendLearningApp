import express from 'express';
import { veryfireToken,isAdmin } from '../../middleware/authMiddleware.js';
import { createLesson, updateLesson, deleteLesson, getLessonById } from '../../controller/course/lessonController.js';

const router = express.Router();
router.post('/:courseId', veryfireToken,isAdmin, createLesson);
router.get('/:id', veryfireToken, getLessonById);
router.put('/:courseId/:lessonId', veryfireToken,isAdmin, updateLesson);
router.delete('/:id', veryfireToken,isAdmin, deleteLesson);

export default router;
