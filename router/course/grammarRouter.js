import express from 'express'
import {veryfireToken} from '../../middleware/authMiddleware.js'
import {addGrammar,getGrammar,updateGrammar,deleteGrammar} from '../../controller/course/grammarController.js'
const router= express.Router()

router.post('/',veryfireToken,addGrammar)
router.get('/',veryfireToken,getGrammar)
router.patch('/:id',veryfireToken,updateGrammar)
router.delete('/:id',veryfireToken,deleteGrammar)
export default router