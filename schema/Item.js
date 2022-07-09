import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

export default mongoose.model('Item', itemSchema)
