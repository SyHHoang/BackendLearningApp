import CardList from '../../model/flashcard/listFlashcardModel.js'

export const createCardList = async (req, res) => {
  try {
    const { name, description, is_public } = req.body

    const cardList = await CardList.create({
      name,
      description,
      is_public,
      owner_id: req.userId,
    })

    res.status(201).json(cardList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyCardLists = async (req, res) => {
  try {
    const lists = await CardList.find({
      owner_id: req.userId,
    }).sort({ createdAt: -1 })

    res.json(lists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPublicCardLists = async (req, res) => {
  try {
    const lists = await CardList.find({
      is_public: true,
    })
      .populate('owner_id', 'name email')
      .sort({ createdAt: -1 })

    res.json(lists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCardListById = async (req, res) => {
  try {
    const list = await CardList.findById(req.params.id)

    if (!list) {
      return res.status(404).json({ message: 'Deck not found' })
    }
    res.json(list)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateCardList = async (req, res) => {
  try {
    const list = await CardList.findById(req.params.id)

    if (!list) {
      return res.status(404).json({ message: 'Deck not found' })
    }
    if (list.owner_id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { name, description, is_public } = req.body

    list.name = name ?? list.name
    list.description = description ?? list.description
    list.is_public = is_public ?? list.is_public
    await list.save()

    res.json(list)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCardList = async (req, res) => {
  try {
    const list = await CardList.findById(req.params.id)

    if (!list) {
      return res.status(404).json({ message: 'Deck not found' })
    }

    if (list.owner_id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await list.deleteOne()

    res.json({ message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}