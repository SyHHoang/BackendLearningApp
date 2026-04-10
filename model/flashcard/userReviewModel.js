import mongoose from 'mongoose';
const userDeckSettingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardList_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListFlashcard',
    required: true,
  },

  is_disabled: {
    type: Boolean,
    default: false,
  },
  is_favorite: Boolean,
  last_studied_at: Date,
})

userDeckSettingSchema.index(
  { user_id: 1, deck_id: 1 },
  { unique: true }
)
export default mongoose.model('UserDeckSetting', userDeckSettingSchema)