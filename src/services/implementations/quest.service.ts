/**
 * Quest Service Implementation
 *
 * Handles all quest-related business logic including:
 * - Quest generation with automatic refresh
 * - Progress tracking
 * - Reward claiming
 * - Statistics calculation
 *
 * Architecture:
 * - Single Responsibility: Quest business logic only
 * - Interface Segregation: Implements IQuestService
 * - Dependency Inversion: Depends on abstractions
 *
 * @module services/implementations
 */

import QuestModel from '@/db/models/quest.model'
import { connectMongooseToDatabase } from '@/db'
import { addKoins, addGifts } from '@/db/models/user.model'
import type { Document } from 'mongoose'
import {
  getQuestsByPeriod,
  getQuestDefinition,
  QUEST_REFRESH_INTERVALS,
  type QuestType,
  type QuestPeriod,
  type RewardType
} from '@/config/quests.config'
import type {
  Quest,
  QuestDocument,
  ClaimQuestResult,
  QuestProgressResult,
  QuestStats
} from '@/types/quest.types'
import type { IQuestService } from '../interfaces/IQuestService'

export class QuestService implements IQuestService {
  /**
   * Convert Mongoose document to plain Quest object
   */
  private documentToQuest (doc: Document & Record<string, unknown> & {
    _id: { toString: () => string }
    userId: string
    questType: string
    period: string
    targetCount: number
    currentCount: number
    rewardType: string
    rewardAmount: number
    completed: boolean
    claimed: boolean
    questDate: string
    expiresAt: { toISOString: () => string }
    createdAt?: { toISOString: () => string }
    updatedAt?: { toISOString: () => string }
  }): Quest {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      questType: doc.questType as QuestType,
      period: doc.period as QuestPeriod,
      targetCount: doc.targetCount,
      currentCount: doc.currentCount,
      rewardType: doc.rewardType as RewardType,
      rewardAmount: doc.rewardAmount,
      completed: doc.completed,
      claimed: doc.claimed,
      questDate: doc.questDate,
      expiresAt: doc.expiresAt.toISOString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString()
    }
  }

  /**
   * Get the quest date identifier for today
   * Format: YYYY-MM-DD or YYYY-Www (for weekly)
   */
  private getQuestDate (period: QuestPeriod): string {
    const now = new Date()

    if (period === 'daily') {
      // For daily quests, use the date
      return now.toISOString().split('T')[0]
    } else {
      // For weekly quests, use year + week number
      const year = now.getFullYear()
      const startOfYear = new Date(year, 0, 1)
      const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`
    }
  }

  /**
   * Calculate expiration date for a quest
   */
  private getExpirationDate (period: QuestPeriod): Date {
    const now = new Date()
    return new Date(now.getTime() + QUEST_REFRESH_INTERVALS[period])
  }

  /**
   * Check if quests need to be regenerated
   */
  private shouldRegenerateQuests (quests: QuestDocument[], period: QuestPeriod): boolean {
    if (quests.length === 0) return true

    const currentDate = this.getQuestDate(period)
    const now = new Date()

    // Check if any quest has a different date or is expired
    return quests.some(q =>
      q.questDate !== currentDate ||
      q.expiresAt < now
    )
  }

  /**
   * Generate new quests for a user
   */
  async generateQuests (userId: string, period: QuestPeriod): Promise<Quest[]> {
    await connectMongooseToDatabase()

    const questDefinitions = getQuestsByPeriod(period)
    const questDate = this.getQuestDate(period)
    const expiresAt = this.getExpirationDate(period)

    // Delete old quests for this period
    await QuestModel.deleteMany({ userId, period })

    // Create new quests
    const newQuests = questDefinitions.map(def => ({
      userId,
      questType: def.type,
      period: def.period,
      targetCount: def.targetCount,
      currentCount: 0,
      rewardType: def.rewardType,
      rewardAmount: def.rewardAmount,
      completed: false,
      claimed: false,
      questDate,
      expiresAt
    }))

    const createdQuests = await QuestModel.insertMany(newQuests)
    return createdQuests.map(doc => this.documentToQuest(doc))
  }

  /**
   * Get all quests for a user and period
   */
  async getQuests (userId: string, period: QuestPeriod): Promise<Quest[]> {
    await connectMongooseToDatabase()

    const questDate = this.getQuestDate(period)

    // Get existing quests
    const existingQuests = await QuestModel.find({
      userId,
      period,
      questDate
    }).sort({ createdAt: 1 })

    // Check if we need to regenerate
    if (this.shouldRegenerateQuests(existingQuests, period)) {
      return await this.generateQuests(userId, period)
    }

    return existingQuests.map(doc => this.documentToQuest(doc))
  }

  /**
   * Get all quests for a user (both daily and weekly)
   */
  async getAllQuests (userId: string): Promise<Quest[]> {
    const [dailyQuests, weeklyQuests] = await Promise.all([
      this.getQuests(userId, 'daily'),
      this.getQuests(userId, 'weekly')
    ])

    return [...dailyQuests, ...weeklyQuests]
  }

  /**
   * Update progress on a quest
   */
  async updateQuestProgress (
    userId: string,
    questType: QuestType,
    increment: number = 1
  ): Promise<QuestProgressResult> {
    await connectMongooseToDatabase()

    try {
      // Get current quest dates for both periods
      const dailyDate = this.getQuestDate('daily')
      const weeklyDate = this.getQuestDate('weekly')

      // Update all unclaimed quests of this type for current period
      const quests = await QuestModel.find({
        userId,
        questType,
        claimed: false,
        expiresAt: { $gt: new Date() },
        // Match quests from current daily or weekly period
        $or: [
          { period: 'daily', questDate: dailyDate },
          { period: 'weekly', questDate: weeklyDate }
        ]
      })

      let questsUpdated = 0
      let questsCompleted = 0

      for (const quest of quests) {
        if (quest.completed === true) continue

        quest.currentCount = Math.min(
          Number(quest.currentCount) + increment,
          Number(quest.targetCount)
        )

        if (quest.currentCount >= quest.targetCount) {
          quest.completed = true
          questsCompleted++
        }

        await quest.save()
        questsUpdated++
      }

      return {
        success: true,
        questsUpdated,
        questsCompleted
      }
    } catch (error) {
      console.error('[QuestService] Error updating quest progress:', error)
      return {
        success: false,
        questsUpdated: 0,
        questsCompleted: 0,
        error: 'Failed to update quest progress'
      }
    }
  }

  /**
   * Claim reward for a completed quest
   */
  async claimQuestReward (userId: string, questId: string): Promise<ClaimQuestResult> {
    await connectMongooseToDatabase()

    try {
      const quest = await QuestModel.findById(questId)

      if (quest == null) {
        return {
          success: false,
          error: 'Quest not found'
        }
      }

      if (quest.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized'
        }
      }

      if (quest.completed !== true) {
        return {
          success: false,
          error: 'Quest not completed'
        }
      }

      if (quest.claimed === true) {
        return {
          success: false,
          error: 'Reward already claimed'
        }
      }

      // Mark as claimed
      quest.claimed = true
      await quest.save()

      // Give reward
      if (quest.rewardType === 'koins') {
        const result = await addKoins(userId, quest.rewardAmount)
        return {
          success: result.success,
          newKoinsBalance: result.newBalance,
          error: result.error
        }
      } else {
        // gifts
        const result = await addGifts(userId, quest.rewardAmount)
        return {
          success: result.success,
          newGiftsBalance: result.newBalance,
          error: result.error
        }
      }
    } catch (error) {
      console.error('[QuestService] Error claiming quest reward:', error)
      return {
        success: false,
        error: 'Failed to claim reward'
      }
    }
  }

  /**
   * Get quest statistics for dashboard
   */
  async getQuestStats (userId: string, period?: QuestPeriod): Promise<QuestStats> {
    await connectMongooseToDatabase()

    const query: Record<string, unknown> = { userId }
    if (period !== undefined) {
      query.period = period
      query.questDate = this.getQuestDate(period)
    }

    const quests = await QuestModel.find(query)

    const totalQuests = quests.length
    const completedQuests = quests.filter(q => q.completed).length
    const claimedQuests = quests.filter(q => q.claimed).length
    const completionPercentage = totalQuests > 0
      ? Math.round((completedQuests / totalQuests) * 100)
      : 0

    return {
      totalQuests,
      completedQuests,
      claimedQuests,
      completionPercentage
    }
  }

  /**
   * Clean up expired quests (maintenance task)
   */
  async cleanupExpiredQuests (): Promise<number> {
    await connectMongooseToDatabase()

    const result = await QuestModel.deleteMany({
      expiresAt: { $lt: new Date() }
    })

    return result.deletedCount ?? 0
  }
}

// Export singleton instance
export const questService = new QuestService()
