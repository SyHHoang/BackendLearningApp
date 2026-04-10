import mongoose from 'mongoose'

const cardListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    is_public: {
      type: Boolean,
      default: false,
    },
    card_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

cardListSchema.index({ owner_id: 1 })
cardListSchema.index({ is_public: 1 })
cardListSchema.index({ name: 'text', tags: 'text' })

export default mongoose.model('ListFlashcard', cardListSchema)