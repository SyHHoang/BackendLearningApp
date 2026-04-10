import express from 'express'
import {
    getCardList,
  createFlashcard,
  createManyFlashCard,
  updateFlashcard,
  deleteFlashcard,
} from '../../controller/flashcard/flashCardController.js'
import {veryfireToken} from '../../middleware/authMiddleware.js'
const router = express.Router()
router.get('/:id',getCardList)
router.use(veryfireToken)
router.post('/:id', createFlashcard)
router.post('/many/:id',createManyFlashCard)                                                   
router.put('/:id', updateFlashcard)                     
router.delete('/:deckId/:id', deleteFlashcard)                 

export default router