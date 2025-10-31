/**
 * Accessory Database Model
 *
 * Manages accessory data in MongoDB.
 * Handles CRUD operations for user-owned accessories.
 *
 * Architecture:
 * - Data Access Layer (Clean Architecture)
 * - Single Responsibility: Database operations for accessories
 * - Depends on MongoDB connection abstraction
 *
 * Business Rules Enforced:
 * - One accessory per category per monster
 * - User can own multiple accessories
 * - Accessories can be equipped/unequipped
 */

import { getDatabase } from '@/db/index'
import type { OwnedAccessory, AccessoryCategory } from '@/types/accessory.types'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'accessories'

/**
 * Get all accessories owned by a user
 *
 * @param userId - The user's unique identifier
 * @returns Array of owned accessories
 */
export async function getUserAccessories (userId: string): Promise<OwnedAccessory[]> {
  const db = await getDatabase()
  const accessories = await db
    .collection(COLLECTION_NAME)
    .find({ ownerId: userId })
    .toArray()

  return accessories.map(doc => ({
    _id: doc._id.toString(),
    ownerId: doc.ownerId,
    accessoryId: doc.accessoryId,
    equippedOnMonsterId: doc.equippedOnMonsterId ?? null,
    acquiredAt: doc.acquiredAt
  }))
}

/**
 * Get all accessories equipped on a specific monster
 *
 * @param monsterId - The monster's unique identifier
 * @returns Array of equipped accessories
 */
export async function getMonsterAccessories (monsterId: string): Promise<OwnedAccessory[]> {
  const db = await getDatabase()
  const accessories = await db
    .collection(COLLECTION_NAME)
    .find({ equippedOnMonsterId: monsterId })
    .toArray()

  return accessories.map(doc => ({
    _id: doc._id.toString(),
    ownerId: doc.ownerId,
    accessoryId: doc.accessoryId,
    equippedOnMonsterId: doc.equippedOnMonsterId,
    acquiredAt: doc.acquiredAt
  }))
}

/**
 * Get accessories equipped on a monster, grouped by category
 *
 * Returns one accessory per category (hat, glasses, shoes).
 * This enforces the business rule: one accessory per category per monster.
 *
 * @param monsterId - The monster's unique identifier
 * @returns Object with equipped accessories by category
 */
export async function getMonsterEquipment (monsterId: string): Promise<{
  hat: OwnedAccessory | null
  glasses: OwnedAccessory | null
  shoes: OwnedAccessory | null
}> {
  const db = await getDatabase()

  // Get all accessories equipped on this monster
  const accessories = await db
    .collection(COLLECTION_NAME)
    .find({ equippedOnMonsterId: monsterId })
    .toArray()

  const equipment: {
    hat: OwnedAccessory | null
    glasses: OwnedAccessory | null
    shoes: OwnedAccessory | null
  } = {
    hat: null,
    glasses: null,
    shoes: null
  }

  // We need to know the category of each accessory
  // This requires importing the config to get category info
  const { getAccessoryById } = await import('@/config/accessories.config')

  for (const doc of accessories) {
    const accessoryInfo = getAccessoryById(doc.accessoryId)
    if (accessoryInfo != null) {
      const category = accessoryInfo.category
      equipment[category] = {
        _id: doc._id.toString(),
        ownerId: doc.ownerId,
        accessoryId: doc.accessoryId,
        equippedOnMonsterId: doc.equippedOnMonsterId,
        acquiredAt: doc.acquiredAt
      }
    }
  }

  return equipment
}

/**
 * Purchase an accessory for a user
 *
 * Creates a new owned accessory record in the database.
 * Does NOT handle payment - that's the responsibility of the caller.
 *
 * @param userId - The user purchasing the accessory
 * @param accessoryId - The catalog accessory ID
 * @returns The newly created owned accessory
 */
export async function purchaseAccessory (
  userId: string,
  accessoryId: string
): Promise<OwnedAccessory> {
  const db = await getDatabase()

  const newAccessory = {
    ownerId: userId,
    accessoryId,
    equippedOnMonsterId: null,
    acquiredAt: new Date()
  }

  const result = await db.collection(COLLECTION_NAME).insertOne(newAccessory)

  return {
    _id: result.insertedId.toString(),
    ...newAccessory
  }
}

/**
 * Equip an accessory on a monster
 *
 * Business Rule: Only one accessory per category per monster.
 * Before equipping, unequips any other accessory of the same category
 * that is currently equipped on this monster.
 *
 * @param accessoryDbId - The database ID of the owned accessory
 * @param monsterId - The monster to equip the accessory on
 * @param category - The category of the accessory (hat, glasses, shoes)
 */
export async function equipAccessory (
  accessoryDbId: string,
  monsterId: string,
  category: AccessoryCategory
): Promise<void> {
  const db = await getDatabase()

  // Step 1: Unequip any accessory of the same category currently equipped on this monster
  // This enforces the "one accessory per category" rule
  const { getAccessoryById } = await import('@/config/accessories.config')

  const currentlyEquipped = await db
    .collection(COLLECTION_NAME)
    .find({ equippedOnMonsterId: monsterId })
    .toArray()

  // Find and unequip any accessory of the same category
  for (const equipped of currentlyEquipped) {
    const info = getAccessoryById(equipped.accessoryId)
    if (info != null && info.category === category) {
      await db.collection(COLLECTION_NAME).updateOne(
        { _id: equipped._id },
        { $set: { equippedOnMonsterId: null } }
      )
    }
  }

  // Step 2: Equip the new accessory
  await db.collection(COLLECTION_NAME).updateOne(
    { _id: new ObjectId(accessoryDbId) },
    { $set: { equippedOnMonsterId: monsterId } }
  )
}

/**
 * Unequip an accessory from its monster
 *
 * @param accessoryDbId - The database ID of the owned accessory
 */
export async function unequipAccessory (accessoryDbId: string): Promise<void> {
  const db = await getDatabase()

  await db.collection(COLLECTION_NAME).updateOne(
    { _id: new ObjectId(accessoryDbId) },
    { $set: { equippedOnMonsterId: null } }
  )
}
