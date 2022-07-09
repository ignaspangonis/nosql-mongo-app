import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthDate: String,
  wallet: walletSchema,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

export default mongoose.model('User', userSchema)
