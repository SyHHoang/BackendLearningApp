import mongoose from 'mongoose'

const cardProgressSchema = new mongoose.Schema(
  {
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

    //(0=chưa biết, 1=khó, 2=dễ)
    rating: {
      type: Number,
      enum: [0, 1, 2],
      default: null,
    },

    //phần  SM-2 
    ease_factor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    interval_days: {
      type: Number,
      default: 0,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    lapse_count: {
      type: Number,
      default: 0,
    },
    is_suspended: {
      type: Boolean,
      default: false,
    },

    next_review_at: {
      type: Date,
      default: () => new Date(),
    },
    last_reviewed_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// unique per user-card
cardProgressSchema.index({ user_id: 1, card_id: 1 }, { unique: true })

// query ôn tập
cardProgressSchema.index({
  user_id: 1,
  next_review_at: 1,
  is_suspended: 1,
})

// SM-2 algorithm
cardProgressSchema.methods.applyReview = function (rating) {
  const now = new Date()

  // 🚫 chống spam review (trong 1h)
  if (
    this.last_reviewed_at &&
    now - this.last_reviewed_at < 1000 * 60 * 60
  ) {
    return this
  }

  const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  // map rating 0–2 -> quality 0–5 (SM-2)
  const qualityMap = {
    0: 2, // fail
    1: 3, // hard
    2: 5, // easy
  }

  const q = qualityMap[rating]

  // ❗ nếu fail → reset
  if (q < 3) {
    this.review_count = 0
    this.interval_days = 1
    this.lapse_count += 1
  } else {
    this.review_count += 1

    if (this.review_count === 1) {
      this.interval_days = 1
    } else if (this.review_count === 2) {
      this.interval_days = 6
    } else {
      this.interval_days = Math.round(
        this.interval_days * this.ease_factor
      )
    }
  }

  // update ease factor theo SM-2
  this.ease_factor =
    this.ease_factor +
    (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  this.ease_factor = Math.max(1.3, this.ease_factor)

  // update time
  this.rating = rating
  this.last_reviewed_at = now
  this.next_review_at = addDays(now, this.interval_days)

  return this
}

export default mongoose.model('CardProgress', cardProgressSchema)