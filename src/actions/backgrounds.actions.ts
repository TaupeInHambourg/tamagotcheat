/**
 * Backgrounds Server Actions
 *
 * Server-side actions for background management.
 * Handles business logic, authentication, and delegates to the database layer.
 *
 * Architecture:
 * - Single Responsibility: Orchestrates background operations
 * - Dependency Inversion: Depends on abstractions (auth, config, db model)
 * - Clean Architecture: Application layer (use cases)
 *
 * @module actions/backgrounds
 */

'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getBackgroundById, getBackgroundPrice } from '@/config/backgrounds.config'
import { subtractKoins } from './wallet.actions'
import {
  getUserBackgrounds,
  getMonsterBackground,
  purchaseBackground as dbPurchaseBackground,
  equipBackground as dbEquipBackground,
  unequipBackground as dbUnequipBackground,
  userOwnsBackground
} from '@/db/models/background.model'
import type { BackgroundDB } from '@/types/background.types'
import { createMonsterRepository } from '@/db/repositories'
import { addXP, XP_PER_ACCESSORY } from '@/utils/xp-system'
import { updateQuestProgress } from './quests.actions'

/**
 * Result type for server actions
 */
interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Purchase a background from the catalog
 *
 * Business rules:
 * - User must be authenticated
 * - Background must exist in catalog
 * - User must have sufficient Koins
 * - User cannot own duplicate backgrounds
 *
 * @param backgroundId - The catalog background ID (e.g., "bg-autumn-forest")
 * @returns Result with the new owned background or error
 */
export async function purchaseBackground (
  backgroundId: string
): Promise<ActionResult<BackgroundDB>> {
  try {
    // 1. Verify authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return { success: false, error: 'Non authentifié' }
    }

    // 2. Verify background exists in catalog
    const background = getBackgroundById(backgroundId)
    if (background == null) {
      return { success: false, error: 'Background introuvable' }
    }

    // 3. Calculate price
    const price = getBackgroundPrice(background)

    // 4. Users can now purchase the same background multiple times
    // Each purchase creates a unique instance that can be equipped separately

    // 5. Debit Koins from user wallet
    const walletResult = await subtractKoins(session.user.id, price)
    if (!walletResult.success) {
      return { success: false, error: walletResult.error ?? 'Pas assez de Koins' }
    }

    // 6. Create the background in database
    const newBackground = await dbPurchaseBackground(session.user.id, backgroundId)

    return {
      success: true,
      data: newBackground
    }
  } catch (error) {
    console.error('Error purchasing background:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'achat'
    }
  }
}

/**
 * Equip a background on a monster
 *
 * Business rules:
 * - User must be authenticated
 * - Background must belong to the user
 * - Only one background can be equipped per monster
 *
 * @param backgroundDbId - The database ID of the owned background (_id)
 * @param monsterId - The monster to equip the background on
 * @returns Result indicating success or error
 */
export async function equipBackground (
  backgroundDbId: string,
  monsterId: string
): Promise<ActionResult> {
  try {
    // 1. Verify authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return { success: false, error: 'Non authentifié' }
    }

    // 2. Verify user owns this background
    const userBackgrounds = await getUserBackgrounds(session.user.id)
    const background = userBackgrounds.find(bg => bg._id === backgroundDbId)

    if (background == null) {
      return { success: false, error: 'Background introuvable' }
    }

    // 3. TODO: Verify monster belongs to user
    // This requires checking monster ownership
    // For now, we trust the monsterId parameter

    // 4. Equip the background
    await dbEquipBackground(backgroundDbId, monsterId)

    // 5. Award XP for equipping background (same as accessory)
    try {
      const monsterRepository = createMonsterRepository()
      const monster = await monsterRepository.findByIdAndOwner(monsterId, session.user.id)

      if (monster !== null) {
        const currentTotalXP = monster.totalExperience ?? 0
        const xpResult = addXP(currentTotalXP, XP_PER_ACCESSORY)

        await monsterRepository.update(monsterId, session.user.id, {
          level: xpResult.newLevel,
          experience: xpResult.newCurrentXP,
          totalExperience: xpResult.newTotalXP
        })
      }
    } catch (xpError) {
      // Log XP error but don't fail the entire operation
      console.error('Error awarding XP for background:', xpError)
    }

    // 6. Update quest progress for customization (could be a new quest type)
    await updateQuestProgress('equip_accessory', 1).catch((err: unknown) => {
      console.error('Failed to update quest progress:', err)
    })

    return { success: true }
  } catch (error) {
    console.error('Error equipping background:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'équipement'
    }
  }
}

/**
 * Unequip a background from its monster
 *
 * Business rules:
 * - User must be authenticated
 * - Background must belong to the user
 *
 * @param backgroundDbId - The database ID of the owned background (_id)
 * @returns Result indicating success or error
 */
export async function unequipBackground (
  backgroundDbId: string
): Promise<ActionResult> {
  try {
    // 1. Verify authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return { success: false, error: 'Non authentifié' }
    }

    // 2. Verify user owns this background
    const userBackgrounds = await getUserBackgrounds(session.user.id)
    const background = userBackgrounds.find(bg => bg._id === backgroundDbId)

    if (background == null) {
      return { success: false, error: 'Background introuvable' }
    }

    // 3. Unequip the background
    await dbUnequipBackground(backgroundDbId)

    return { success: true }
  } catch (error) {
    console.error('Error unequipping background:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors du retrait'
    }
  }
}

/**
 * Get all backgrounds owned by the current user
 *
 * @returns Array of owned backgrounds, or empty array if not authenticated
 */
export async function getMyBackgrounds (): Promise<BackgroundDB[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return []
    }

    return await getUserBackgrounds(session.user.id)
  } catch (error) {
    console.error('Error fetching user backgrounds:', error)
    return []
  }
}

/**
 * Get the background equipped on a specific monster
 *
 * @param monsterId - The monster's unique identifier
 * @returns The equipped background or null if none
 */
export async function getCreatureBackground (
  monsterId: string
): Promise<BackgroundDB | null> {
  try {
    return await getMonsterBackground(monsterId)
  } catch (error) {
    console.error('Error fetching monster background:', error)
    return null
  }
}

/**
 * Check if current user owns a specific background
 *
 * @param backgroundId - The catalog background ID
 * @returns True if the user owns the background
 */
export async function checkOwnership (
  backgroundId: string
): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return false
    }

    return await userOwnsBackground(session.user.id, backgroundId)
  } catch (error) {
    console.error('Error checking background ownership:', error)
    return false
  }
}
