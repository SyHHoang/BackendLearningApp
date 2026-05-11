import { saveUserExamResult, getUserExamResult, getUserExamHistory,getTotalPage} from "../../controller/practice/userExamController.js";
import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post('/:ExamId', verifyToken, saveUserExamResult);
router.get('/result/:id', verifyToken, getUserExamResult);
router.get('/history', verifyToken, getUserExamHistory);
router.get('/totalPage', verifyToken,getTotalPage)
export default router;