import {getFlashcardsLists,createListFlashcard} from '../controller/flashcardController.js';
import {veryfireToken} from '../middleware/authMiddleware.js'
import express from 'express';
const router = express.Router();
router.get('/getlists',veryfireToken, getFlashcardsLists);
router.post('/createList',veryfireToken, createListFlashcard);
export default router;