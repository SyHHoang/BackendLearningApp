import express from "express";

import {
  createVocabulary,
  getAllVocabulary,
  getVocabularyById,
  updateVocabulary,
  deleteVocabulary,
  getRandomWord
} from "../controller/vocabularyController.js";

import {veryfireToken} from '../middleware/authMiddleware.js'

const router = express.Router();


/* PUBLIC */
router.get("/", getAllVocabulary);

router.get("/random", getRandomWord);

router.get("/:id", getVocabularyById);



/* PROTECTED */
router.post("/", veryfireToken, createVocabulary);

router.patch("/:id", veryfireToken, updateVocabulary);

router.delete("/:id", veryfireToken, deleteVocabulary);


export default router;