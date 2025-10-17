const mongoose = require('mongoose')
const { Schema } = mongoose
const monsterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  draw: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'angry', 'sleeping', 'hungry', 'sad'],
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
})

export default mongoose.model('Monster', monsterSchema) ?? mongoose.models.Monster
