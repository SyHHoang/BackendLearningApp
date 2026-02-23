import express from 'express'
import {veryfireToken} from '../../middleware/authMiddleware.js'
import {addVocabulary,getVocabulary,updateVocabulary,deleteVocabulary} from '../../controller/course/vocabularyController.js'
const router= express.Router()

router.post('/',veryfireToken,addVocabulary)
router.get('/',veryfireToken,getVocabulary)
router.patch('/:id',veryfireToken,updateVocabulary)
router.delete('/:id',veryfireToken,deleteVocabulary)
export default router