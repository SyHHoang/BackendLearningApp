import express from 'express';
import { veryfireToken } from '../../middleware/authMiddleware.js';
import { createExam, getAllExams, getExamById, updateExam, deleteExam } from '../../controller/practice/examController.js';

const router = express.Router();
router.get('/', veryfireToken, getAllExams);
router.get('/:id', veryfireToken, getExamById);
router.post('/', veryfireToken, createExam);
router.put('/:id', veryfireToken, updateExam);
router.delete('/:id', veryfireToken, deleteExam);

export default router;
