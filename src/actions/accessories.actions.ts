/**
 * Accessories Server Actions
 *
 * Server-side actions for accessory management.
 * Handles business logic, authentication, and delegates to the database layer.
 *
 * Architecture:
 * - Single Responsibility: Orchestrates accessory operations
 * - Dependency Inversion: Depends on abstractions (auth, config, db model)
 * - Clean Architecture: Application layer (use cases)
 */

'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getAccessoryById, getAccessoryPrice } from '@/config/accessories.config'
import { subtractKoins } from './wallet.actions'
import {
  getUserAccessories,
  getMonsterAccessories,
  purchaseAccessory as dbPurchaseAccessory,
  equipAccessory as dbEquipAccessory,
  unequipAccessory as dbUnequipAccessory,
  getMonsterEquipment
} from '@/db/models/accessory.model'
import type { OwnedAccessory } from '@/types/accessory.types'
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
 * Purchase an accessory from the catalog
 *
 * Business rules:
 * - User must be authenticated
 * - Accessory must exist in catalog
 * - User must have sufficient Koins
 * - User cannot own duplicate accessories
 *
 * @param accessoryId - The catalog accessory ID (e.g., "hat-cowboy")
 * @returns Result with the new owned accessory or error
 */
export async function purchaseAccessory (
  accessoryId: string
): Promise<ActionResult<OwnedAccessory>> {
  try {
    // 1. Verify authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return { success: false, error: 'Non authentifié' }
    }

    // 2. Verify accessory exists in catalog
    const accessory = getAccessoryById(accessoryId)
    if (accessory == null) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // 3. Calculate price
    const price = getAccessoryPrice(accessory)

    // 4. Check if user already owns this accessory
    const userAccessories = await getUserAccessories(session.user.id)
    const alreadyOwned = userAccessories.some(
      acc => acc.accessoryId === accessoryId
    )

    if (alreadyOwned) {
      return { success: false, error: 'Accessoire déjà possédé' }
    }

    // 5. Debit Koins from user wallet
    const walletResult = await subtractKoins(session.user.id, price)
    if (!walletResult.success) {
      return { success: false, error: walletResult.error ?? 'Pas assez de Koins' }
    }

    // 6. Create the accessory in database
    const newAccessory = await dbPurchaseAccessory(session.user.id, accessoryId)

    return {
      success: true,
      data: newAccessory
    }
  } catch (error) {
    console.error('Error purchasing accessory:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'achat'
    }
  }
}

/**
 * Equip an accessory on a monster
 *
 * Business rules:
 * - User must be authenticated
 * - Accessory must belong to the user
 * - Only one accessory per category can be equipped on a monster
 *
 * @param accessoryDbId - The database ID of the owned accessory (_id)
 * @param monsterId - The monster to equip the accessory on
 * @returns Result indicating success or error
 */
export async function equipAccessory (
  accessoryDbId: string,
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

    // 2. Verify user owns this accessory
    const userAccessories = await getUserAccessories(session.user.id)
    const accessory = userAccessories.find(acc => acc._id === accessoryDbId)

    if (accessory == null) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // 3. Get accessory info from catalog to determine category
    const accessoryInfo = getAccessoryById(accessory.accessoryId)
    if (accessoryInfo == null) {
      return { success: false, error: 'Configuration accessoire introuvable' }
    }

    // 4. TODO: Verify monster belongs to user
    // This requires checking monster ownership
    // For now, we trust the monsterId parameter

    // 5. Equip the accessory
    await dbEquipAccessory(accessoryDbId, monsterId, accessoryInfo.category)

    // 6. Award XP for equipping accessory
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
      console.error('Error awarding XP for accessory:', xpError)
    }

    // 7. Update quest progress for equipping accessory
    await updateQuestProgress('equip_accessory', 1).catch((err: unknown) => {
      console.error('Failed to update quest progress:', err)
    })

    return { success: true }
  } catch (error) {
    console.error('Error equipping accessory:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'équipement'
    }
  }
}

/**
 * Unequip an accessory from its monster
 *
 * Business rules:
 * - User must be authenticated
 * - Accessory must belong to the user
 *
 * @param accessoryDbId - The database ID of the owned accessory (_id)
 * @returns Result indicating success or error
 */
export async function unequipAccessory (
  accessoryDbId: string
): Promise<ActionResult> {
  try {
    // 1. Verify authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return { success: false, error: 'Non authentifié' }
    }

    // 2. Verify user owns this accessory
    const userAccessories = await getUserAccessories(session.user.id)
    const accessory = userAccessories.find(acc => acc._id === accessoryDbId)

    if (accessory == null) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // 3. Unequip the accessory
    await dbUnequipAccessory(accessoryDbId)

    return { success: true }
  } catch (error) {
    console.error('Error unequipping accessory:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors du retrait'
    }
  }
}

/**
 * Get all accessories owned by the current user
 *
 * @returns Array of owned accessories, or empty array if not authenticated
 */
export async function getMyAccessories (): Promise<OwnedAccessory[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return []
    }

    return await getUserAccessories(session.user.id)
  } catch (error) {
    console.error('Error fetching user accessories:', error)
    return []
  }
}

/**
 * Get all accessories equipped on a specific monster
 *
 * @param monsterId - The monster's unique identifier
 * @returns Array of equipped accessories
 */
export async function getCreatureAccessories (
  monsterId: string
): Promise<OwnedAccessory[]> {
  try {
    return await getMonsterAccessories(monsterId)
  } catch (error) {
    console.error('Error fetching monster accessories:', error)
    return []
  }
}

/**
 * Get accessories equipped on a monster, grouped by category
 *
 * @param monsterId - The monster's unique identifier
 * @returns Object with equipped accessories by category
 */
export async function getCreatureEquipment (monsterId: string): Promise<{
  hat: OwnedAccessory | null
  glasses: OwnedAccessory | null
  shoes: OwnedAccessory | null
}> {
  try {
    return await getMonsterEquipment(monsterId)
  } catch (error) {
    console.error('Error fetching monster equipment:', error)
    return {
      hat: null,
      glasses: null,
      shoes: null
    }
  }
}
