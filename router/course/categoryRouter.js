import express from 'express'
import {verifyToken,isAdmin} from '../../middleware/authMiddleware.js'
import  {  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory} from '../../controller/course/courseCategoryController.js'

const router= express.Router()
router.get("/", getAllCategories); 

router.use(verifyToken,isAdmin)
router.post("/", createCategory); 
router.put("/:id", updateCategory); 
router.delete("/:id", deleteCategory);
export default router