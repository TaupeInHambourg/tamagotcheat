/**
 * Quest Type Definitions
 *
 * Defines TypeScript interfaces for the quest system.
 * These types provide compile-time safety for quest operations.
 *
 * Architecture:
 * - Interface Segregation: Separate interfaces for different concerns
 * - Type Safety: Strict typing for all quest operations
 *
 * @module types
 */

import type { QuestType, QuestPeriod, RewardType } from '@/config/quests.config'
import type { ObjectId } from 'mongodb'

/**
 * Quest document structure in MongoDB
 */
export interface QuestDocument {
  _id?: ObjectId
  userId: string
  questType: QuestType
  period: QuestPeriod
  targetCount: number
  currentCount: number
  rewardType: RewardType
  rewardAmount: number
  completed: boolean
  claimed: boolean
  questDate: string // ISO date string (YYYY-MM-DD)
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Quest data returned to the client
 */
export interface Quest {
  id: string
  userId: string
  questType: QuestType
  period: QuestPeriod
  targetCount: number
  currentCount: number
  rewardType: RewardType
  rewardAmount: number
  completed: boolean
  claimed: boolean
  questDate: string
  expiresAt: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Result of claiming a quest reward
 */
export interface ClaimQuestResult {
  success: boolean
  error?: string
  newKoinsBalance?: number
  newGiftsBalance?: number
}

/**
 * Quest progress update result
 */
export interface QuestProgressResult {
  success: boolean
  questsUpdated: number
  questsCompleted: number
  error?: string
}

/**
 * Quest statistics for dashboard
 */
export interface QuestStats {
  totalQuests: number
  completedQuests: number
  claimedQuests: number
  completionPercentage: number
}
