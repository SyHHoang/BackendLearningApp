import express from 'express';
import { verifyToken,isAdmin } from '../../middleware/authMiddleware.js';
import { createExam, getAllExams, getExamById, updateExam, deleteExam,getExamByIdForUser} from '../../controller/practice/examController.js';

const router = express.Router();
router.use(verifyToken)
router.get('/user/:id', getExamByIdForUser);
router.get('/', getAllExams);

router.use(isAdmin)
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
