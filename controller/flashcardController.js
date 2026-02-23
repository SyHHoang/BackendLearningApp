import ListFlashcardModel from "../model/flashcard/listFlashcardModel.js";
import FlashcardModel from "../model/flashcard/flashcardModel.js";
export  {
    createListFlashcard,
    addFlashcardToList,
    getFlashcardsLists,
    //updateFlashcardStatus,
   
}
//tạo list flashcard
const createListFlashcard = async (req,res) => {
   try{
    const {title, description} = req.body;
    const userId=req.userId
    console.log(req.body);
    const newListFlashcard = new ListFlashcardModel({
        title,
        description,
        user:userId
    });
    const savedListFlashcard = await newListFlashcard.save();
    return res.status(201).json({
        success: true,
        message: 'List flashcard created successfully',
        data: savedListFlashcard
    });
    //FE nhận thông tin list để render lại giao diện list flashcard
   }catch(err){
    console.log(err);
    return  res.status(500).json({
        success: false,
        error: 'Internal server error'});
   }
}
//tạo các flashcard và thêm vào list flashcard
const addFlashcardToList = async (req,res) => {
    try{
        const {listId} = req.params;
        const {listFlashcard} = req.body;
        if(!Array.isArray(listFlashcard) || listFlashcard.length === 0||!listId){
            return res.status(400).json({
                success: false,
                error: 'Invalid flashcard list'});
        }
        const createFlashcard = await FlashcardModel.insertMany(listFlashcard);
        const refFlashcards = createFlashcard.map(card => card._id);
        await ListFlashcardModel.findByIdAndUpdate(listId, {
            $push: {flashcards: {$each: refFlashcards}}
        });
        return res.status(201).json({
            success: true,
            message: 'Flashcard added to list successfully',
        });
    }catch(err){
        return  res.status(500).json({
            success: false,
            error: 'Internal server error'});
    }
}
//cập nhật trạng thái của flashcard
//lấy tất cả list flashcard cùng với các flashcard bên trong
const getFlashcardsLists = async (req,res) => {
    try{
        const userId=req.userId
        const lists = await ListFlashcardModel.find({user:userId});
        return res.status(200).json(lists);
    }catch(err){
        return  res.status(500).json({
            success: false,
            error: 'Internal server error'});
    }}