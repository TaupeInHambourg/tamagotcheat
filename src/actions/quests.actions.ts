/**
 * Quest Server Actions
 *
 * Provides server-side functions for quest management.
 * These are Next.js Server Actions that can be called from client components.
 *
 * Architecture:
 * - Single Responsibility: Quest action handlers only
 * - Dependency Inversion: Uses QuestService abstraction
 * - Error Handling: Proper error handling and user feedback
 *
 * @module actions
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { questService } from '@/services/implementations/quest.service'
import { getUserGifts, spendGifts } from '@/db/models/user.model'
import type { Quest, ClaimQuestResult, QuestStats } from '@/types/quest.types'
import type { QuestType, QuestPeriod } from '@/config/quests.config'

/**
 * Get authenticated user's ID
 * @throws Error if user is not authenticated
 */
async function getAuthenticatedUserId (): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === undefined) {
    throw new Error('Unauthorized')
  }

  return session.user.id
}

/**
 * Get all quests for a specific period
 *
 * @param period - Quest period ('daily' or 'weekly')
 * @returns Array of quests
 */
export async function getQuests (period: QuestPeriod): Promise<Quest[]> {
  try {
    const userId = await getAuthenticatedUserId()
    return await questService.getQuests(userId, period)
  } catch (error) {
    console.error('[Quest Actions] Error getting quests:', error)
    throw error
  }
}

/**
 * Get all quests (both daily and weekly)
 *
 * @returns Array of all quests
 */
export async function getAllQuests (): Promise<Quest[]> {
  try {
    const userId = await getAuthenticatedUserId()
    return await questService.getAllQuests(userId)
  } catch (error) {
    console.error('[Quest Actions] Error getting all quests:', error)
    throw error
  }
}

/**
 * Update quest progress
 *
 * Call this when a user performs an action that counts toward quest completion.
 * Automatically updates all applicable quests.
 *
 * @param questType - Type of quest to update
 * @param increment - Amount to increment (default: 1)
 * @returns Update result with counts
 */
export async function updateQuestProgress (
  questType: QuestType,
  increment: number = 1
): Promise<{ success: boolean, questsCompleted: number }> {
  try {
    const userId = await getAuthenticatedUserId()
    const result = await questService.updateQuestProgress(userId, questType, increment)

    return {
      success: result.success,
      questsCompleted: result.questsCompleted
    }
  } catch (error) {
    console.error('[Quest Actions] Error updating quest progress:', error)
    return { success: false, questsCompleted: 0 }
  }
}

/**
 * Claim a quest reward
 *
 * Marks the quest as claimed and awards the reward (koins or gifts).
 * Shows a toast notification on success.
 *
 * @param questId - ID of the quest to claim
 * @returns Claim result with new balances
 */
export async function claimQuestReward (questId: string): Promise<ClaimQuestResult> {
  try {
    const userId = await getAuthenticatedUserId()
    return await questService.claimQuestReward(userId, questId)
  } catch (error) {
    console.error('[Quest Actions] Error claiming quest reward:', error)
    return {
      success: false,
      error: 'Failed to claim reward'
    }
  }
}

/**
 * Get quest statistics
 *
 * Returns counts and percentages for dashboard display.
 *
 * @param period - Optional period filter
 * @returns Quest statistics
 */
export async function getQuestStats (period?: QuestPeriod): Promise<QuestStats> {
  try {
    const userId = await getAuthenticatedUserId()
    return await questService.getQuestStats(userId, period)
  } catch (error) {
    console.error('[Quest Actions] Error getting quest stats:', error)
    return {
      totalQuests: 0,
      completedQuests: 0,
      claimedQuests: 0,
      completionPercentage: 0
    }
  }
}

/**
 * Get user's current gift balance
 *
 * @returns Number of gifts available
 */
export async function getUserGiftsBalance (): Promise<number> {
  try {
    const userId = await getAuthenticatedUserId()
    return await getUserGifts(userId)
  } catch (error) {
    console.error('[Quest Actions] Error getting gifts balance:', error)
    return 0
  }
}

/**
 * Give a gift to a monster
 *
 * Deducts one gift from user's balance.
 * The calling code should handle XP increase.
 *
 * @returns Success result with new balance
 */
export async function giveGiftToMonster (): Promise<{ success: boolean, newBalance?: number, error?: string }> {
  try {
    const userId = await getAuthenticatedUserId()
    const result = await spendGifts(userId, 1)

    return {
      success: result.success,
      newBalance: result.newBalance,
      error: result.error
    }
  } catch (error) {
    console.error('[Quest Actions] Error giving gift:', error)
    return {
      success: false,
      error: 'Failed to give gift'
    }
  }
}
