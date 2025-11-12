/**
 * Quest Mongoose Model
 *
 * Defines the database schema and model for quests.
 * Handles both daily and weekly quests with automatic expiration.
 *
 * Schema fields:
 * - userId: Reference to the user who owns this quest
 * - questType: Type of quest (feed, play, gift, etc.)
 * - period: Quest period (daily or weekly)
 * - targetCount: Number of completions required
 * - currentCount: Current progress
 * - rewardType: Type of reward (koins or gifts)
 * - rewardAmount: Amount of reward
 * - completed: Whether the quest is completed
 * - claimed: Whether the reward has been claimed
 * - questDate: ISO date string for quest identification
 * - expiresAt: When the quest expires
 *
 * @module db/models
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Quest state enum values
 */
const QUEST_TYPES = ['feed', 'play', 'gift', 'hug', 'login_streak', 'create_monster', 'equip_accessory'] as const
const QUEST_PERIODS = ['daily', 'weekly'] as const
const REWARD_TYPES = ['koins', 'gifts'] as const

const questSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  questType: {
    type: String,
    required: true,
    enum: QUEST_TYPES
  },
  period: {
    type: String,
    required: true,
    enum: QUEST_PERIODS
  },
  targetCount: {
    type: Number,
    required: true,
    min: 1
  },
  currentCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rewardType: {
    type: String,
    required: true,
    enum: REWARD_TYPES
  },
  rewardAmount: {
    type: Number,
    required: true,
    min: 1
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  claimed: {
    type: Boolean,
    required: true,
    default: false
  },
  questDate: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
})

// Compound index for efficient querying
questSchema.index({ userId: 1, questDate: 1, period: 1 })
questSchema.index({ userId: 1, completed: 1, claimed: 1 })

export default mongoose.models.Quest ?? mongoose.model('Quest', questSchema)
