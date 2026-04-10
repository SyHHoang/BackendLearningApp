import mongoose from 'mongoose';
const flashcardSchema = new mongoose.Schema({
  deckId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  front:{
      word:       { type: String, required: true, trim: true },
      phonetic:   { type: String },                             

  },
  back:{
      definition: { type: String, required: true, trim: true },
      example:    { type: String },
  },
      audioUrl:   { type: String },  
      audioId:    { type: String },                          
      imageUrl:   { type: String },
      imageId:    { type: String },
});

const FlashcardModel = mongoose.model('Flashcard', flashcardSchema);

export default FlashcardModel;

