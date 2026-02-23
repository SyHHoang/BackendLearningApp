import mongoose from 'mongoose';
const flashcardSchema = new mongoose.Schema({
  question: {type: String, required: true},
  answer: {type: String, required: true},
  imageUrl: String,
  reading:String,
  status:{
    type: String,
    enum: ['new', 'learning','review'],
    default: 'new'
  }
});

const FlashcardModel = mongoose.model('Flashcard', flashcardSchema);

export default FlashcardModel;

