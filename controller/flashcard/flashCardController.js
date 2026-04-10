import Flashcard from '../../model/flashcard/flashcardModel.js'
import FlashCardList from '../../model/flashcard/listFlashcardModel.js'
export const createFlashcard = async (req, res) => {
  try {
    const deckId=req.params.id
    const {order, front, back, audioUrl, audioId, imageUrl, imageId } = req.body
    const card = await Flashcard.create({
      deckId, order, front, back, audioUrl, audioId, imageUrl, imageId,
    })
const deckData=await FlashCardList.findByIdAndUpdate(deckId,{$inc:{card_count:1}})    
    res.status(201).json({
        success:true
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getCardList=async(req,res)=>{
  try{
    const deckId=req.params.id
    const data=await Flashcard.find({deckId:deckId}).lean()
    return res.status(200).json({
        success:true,
        data:data
    })}catch(err){
     return res.status(400).json({
        success:false,
        error:'Lấy danh sách thất bại'
    })
    }
}
export const updateFlashcard = async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!card) return res.status(404).json({ message: 'Flashcard not found' })
    res.status(200).json(card)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const deleteFlashcard = async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndDelete(req.params.id)
    if (!card) return res.status(404).json({ message: 'Flashcard not found' })
    const deckData=await FlashCardList.findByIdAndUpdate(req.params.deckId,{$inc:{card_count:-1}})    
    res.status(200).json({ message: 'Flashcard deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const createManyFlashCard=async(req,res)=>{
  try{  
    const card= await Flashcard.insertMany(req.body)
     if(card)res.status(200).json({ success:true })
      else res.status(400).json({ success:false })
  }catch(err){
    console.log('err',err)
    res.status(500).json({ message: err.message })
  }
}