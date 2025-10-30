/**
 * Monster Mongoose Model
 *
 * Defines the database schema and model for monsters.
 * This is the data layer representation of a monster entity.
 *
 * Schema fields:
 * - name: The monster's display name
 * - level: Current level of the monster (default: 1)
 * - draw: Path to the monster's visual representation
 * - state: Current emotional/physical state of the monster
 * - ownerId: Reference to the user who owns this monster
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Monster state enum values
 * Represents the possible emotional/physical states a monster can be in
 */
const MONSTER_STATES = ['happy', 'angry', 'sleepy', 'hungry', 'sad'] as const

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
    enum: MONSTER_STATES,
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  lastStateChange: {
    type: Date,
    required: false,
    default: Date.now
  },
  nextStateChangeAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
