/**
 * Quest Service Interface
 *
 * Defines the contract for quest management operations.
 * Following Dependency Inversion Principle: depend on abstractions.
 *
 * @module services/interfaces
 */

import type {
  Quest,
  ClaimQuestResult,
  QuestProgressResult,
  QuestStats
} from '@/types/quest.types'
import type { QuestType, QuestPeriod } from '@/config/quests.config'

export interface IQuestService {
  /**
   * Get all quests for a user and period
   * Generates new quests if they don't exist or are expired
   */
  getQuests: (userId: string, period: QuestPeriod) => Promise<Quest[]>

  /**
   * Get all quests for a user (both daily and weekly)
   */
  getAllQuests: (userId: string) => Promise<Quest[]>

  /**
   * Update progress on a quest
   * Can complete multiple quests of the same type
   */
  updateQuestProgress: (
    userId: string,
    questType: QuestType,
    increment?: number
  ) => Promise<QuestProgressResult>

  /**
   * Claim reward for a completed quest
   * Awards koins or gifts to the user
   */
  claimQuestReward: (userId: string, questId: string) => Promise<ClaimQuestResult>

  /**
   * Get quest statistics for dashboard
   */
  getQuestStats: (userId: string, period?: QuestPeriod) => Promise<QuestStats>

  /**
   * Generate new quests for a user
   * Called automatically when quests are expired or missing
   */
  generateQuests: (userId: string, period: QuestPeriod) => Promise<Quest[]>

  /**
   * Clean up expired quests (maintenance task)
   */
  cleanupExpiredQuests: () => Promise<number>
}
