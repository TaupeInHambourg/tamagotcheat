/**
 * Monster Server Actions
 *
 * Next.js server actions for monster operations.
 * These actions serve as the presentation layer, handling authentication
 * and delegating business logic to the service layer.
 *
 * Architecture layers:
 * 1. Actions (this file) - Authentication & request handling
 * 2. Services - Business logic & validation
 * 3. Repositories - Data access
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles auth and HTTP concerns
 * - Dependency Inversion: Depends on service interface
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createMonsterService } from '@/services'
import { giveGiftToMonster, updateQuestProgress } from '@/actions/quests.actions'
import { addXP } from '@/utils/xp-system'
import MonsterModel from '@/db/models/monster.model'
import { connectMongooseToDatabase } from '@/db'
import type { CreateMonsterDto, Monster } from '@/types/monster.types'
import type { QuestType } from '@/config/quests.config'

/**
 * Retrieves the authenticated user's session
 * @returns User session or null if not authenticated
 * @throws Error if authentication check fails
 */
async function getAuthenticatedUser (): Promise<{ id: string, email: string }> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  return {
    id: session.user.id,
    email: session.user.email
  }
}

/**
 * Creates a new monster for the authenticated user
 * @param monsterData - Data to create the monster with
 * @throws Error if creation fails or user is not authenticated
 */
export async function createMonster (monsterData: CreateMonsterDto): Promise<void> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Create monster via service
    const monsterService = createMonsterService()
    const result = await monsterService.createMonster(user.id, monsterData)

    if (!result.success) {
      throw new Error(result.error ?? 'Failed to create monster')
    }

    // Revalidate dashboard to show new monster
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error in createMonster action:', error)
    throw error
  }
}

/**
 * Retrieves all monsters owned by the authenticated user
 * @returns Array of monsters or empty array if none found
 */
export async function getMonsters (): Promise<Monster[]> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Fetch monsters via service
    const monsterService = createMonsterService()
    const result = await monsterService.getUserMonsters(user.id)

    if (!result.success) {
      console.error('Error fetching monsters:', result.error)
      return []
    }

    return result.data ?? []
  } catch (error) {
    console.error('Error in getMonsters action:', error)
    return []
  }
}

/**
 * Retrieves a specific monster by ID for the authenticated user
 * @param id - The monster's unique identifier
 * @returns The monster or null if not found
 */
export async function getMonsterById (id: string): Promise<Monster | null> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Fetch monster via service
    const monsterService = createMonsterService()
    const result = await monsterService.getMonsterById(user.id, id)

    if (!result.success) {
      console.error('Error fetching monster:', result.error)
      return null
    }

    return result.data ?? null
  } catch (error) {
    console.error('Error in getMonsterById action:', error)
    return null
  }
}

/**
 * Interacts with a monster using a specific action
 * @param monsterId - The monster's unique identifier
 * @param action - The interaction action ('feed', 'sleep', 'play', 'cuddle')
 * @returns Result with success status and optional error message
 */
export async function interactWithMonster (
  monsterId: string,
  action: string
): Promise<{ success: boolean, error?: string, monster?: Monster }> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Perform interaction via service
    const monsterService = createMonsterService()
    const result = await monsterService.interactWithMonster(user.id, monsterId, action)

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    // Update quest progress based on action
    const questTypeMap: Record<string, QuestType> = {
      feed: 'feed',
      play: 'play',
      cuddle: 'hug'
      // sleep, wash, heal n'ont pas de quêtes actuellement
    }

    const questType = questTypeMap[action]
    if (questType !== undefined) {
      await updateQuestProgress(questType, 1).catch((err: unknown) => {
        console.error('Failed to update quest progress:', err)
      })
    }

    // Revalidate the monster page to show updated state
    revalidatePath(`/creatures/${monsterId}`)

    return {
      success: true,
      monster: result.data
    }
  } catch (error) {
    console.error('Error in interactWithMonster action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to interact with monster'
    }
  }
}

/**
 * Updates the public visibility of a monster
 * @param monsterId - The monster's unique identifier
 * @param isPublic - Whether the monster should be publicly visible
 * @returns Result with success status and optional error message
 */
export async function updateMonsterVisibility (
  monsterId: string,
  isPublic: boolean
): Promise<{ success: boolean, error?: string }> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Update visibility via service
    const monsterService = createMonsterService()
    const result = await monsterService.updateMonsterVisibility(user.id, monsterId, isPublic)

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    // Revalidate pages to reflect visibility change
    revalidatePath(`/creatures/${monsterId}`)
    revalidatePath('/creatures')
    revalidatePath('/gallery')

    return { success: true }
  } catch (error) {
    console.error('Error in updateMonsterVisibility action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update monster visibility'
    }
  }
}

/**
 * Retrieves all public monsters for the gallery
 * @returns Array of public monsters with owner information
 */
export async function getPublicMonsters (): Promise<Array<Monster & { ownerName?: string }>> {
  try {
    const monsterService = createMonsterService()
    const result = await monsterService.getPublicMonsters()

    if (!result.success) {
      console.error('Error fetching public monsters:', result.error)
      return []
    }

    return result.data ?? []
  } catch (error) {
    console.error('Error in getPublicMonsters action:', error)
    return []
  }
}

/**
 * Give a gift to a monster to increase its XP
 * Uses one gift from the user's balance and adds XP to the monster
 * @param monsterId - The monster's unique identifier
 * @returns Result with success status, new balances, and XP gained
 */
export async function giveGiftToMonsterAction (
  monsterId: string
): Promise<{ success: boolean, error?: string, xpGained?: number, newLevel?: number }> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Spend a gift
    const giftResult = await giveGiftToMonster()
    if (!giftResult.success) {
      return {
        success: false,
        error: giftResult.error
      }
    }

    // Get the monster
    const monsterService = createMonsterService()
    const monsterResult = await monsterService.getMonsterById(user.id, monsterId)

    if (!monsterResult.success || monsterResult.data == null) {
      return {
        success: false,
        error: 'Monster not found'
      }
    }

    const monster = monsterResult.data

    // Calculate XP to add (gifts give 50 XP)
    const XP_PER_GIFT = 50
    const currentTotalXP = monster.totalExperience ?? 0
    const xpResult = addXP(currentTotalXP, XP_PER_GIFT)

    // Update monster XP in database
    await connectMongooseToDatabase()
    await MonsterModel.findByIdAndUpdate(monsterId, {
      totalExperience: xpResult.newTotalXP,
      level: xpResult.newLevel,
      experience: xpResult.newCurrentXP
    })

    // Update quest progress
    await updateQuestProgress('gift', 1)

    // Revalidate pages
    revalidatePath(`/creatures/${monsterId}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      xpGained: XP_PER_GIFT,
      newLevel: xpResult.newLevel
    }
  } catch (error) {
    console.error('Error in giveGiftToMonsterAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to give gift'
    }
  }
}

/**
 * Retrieves navigation IDs for the current monster (previous and next monsters)
 * @param currentMonsterId - The current monster's unique identifier
 * @returns Object containing previousId and nextId (null if at boundaries)
 */
export async function getMonsterNavigationIds (currentMonsterId: string): Promise<{ previousId: string | null, nextId: string | null }> {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Fetch all monsters via service
    const monsterService = createMonsterService()
    const result = await monsterService.getUserMonsters(user.id)

    if (!result.success || result.data == null || result.data.length === 0) {
      return { previousId: null, nextId: null }
    }

    const monsters = result.data

    // Find current monster index
    const currentIndex = monsters.findIndex(m => m._id?.toString() === currentMonsterId)

    if (currentIndex === -1) {
      return { previousId: null, nextId: null }
    }

    // Get previous and next IDs with wrapping
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : monsters.length - 1
    const nextIndex = currentIndex < monsters.length - 1 ? currentIndex + 1 : 0

    const previousId = monsters[previousIndex]?._id?.toString() ?? null
    const nextId = monsters[nextIndex]?._id?.toString() ?? null

    return {
      previousId: monsters.length > 1 ? previousId : null,
      nextId: monsters.length > 1 ? nextId : null
    }
  } catch (error) {
    console.error('Error in getMonsterNavigationIds:', error)
    return { previousId: null, nextId: null }
  }
}
