import express from 'express'
import {
  createCardList,
  getMyCardLists,
  getPublicCardLists,
  getCardListById,
  updateCardList,
  deleteCardList,
} from '../../controller/flashcard/cardListController.js'
import { veryfireToken } from '../../middleware/authMiddleware.js'
const router = express.Router()
router.get('/public', getPublicCardLists)
router.get('/me/:id', getCardListById)

router.use(veryfireToken) 
router.post('/', createCardList)
router.get('/me', getMyCardLists)
router.put('/:id', updateCardList)
router.delete('/:id', deleteCardList)

export default router