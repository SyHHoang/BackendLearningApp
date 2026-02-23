import mongoose from 'mongoose';

const listFlashcardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    description: String,
    flashcards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashcard", 
    }]
});

const ListFlashcardModel = mongoose.model('ListFlashcard', listFlashcardSchema);
export default ListFlashcardModel;