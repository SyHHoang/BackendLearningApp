import { saveUserExamResult, getUserExamResult, getUserExamHistory} from "../../controller/practice/userExamController.js";
import express from "express";
import { veryfireToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post('/:ExamId', veryfireToken, saveUserExamResult);
router.get('/result/:id', veryfireToken, getUserExamResult);
router.get('/history', veryfireToken, getUserExamHistory);
export default router;