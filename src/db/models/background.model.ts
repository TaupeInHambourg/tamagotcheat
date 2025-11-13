/**
 * Background Model
 *
 * Database layer for background persistence and retrieval.
 * Implements CRUD operations for the backgrounds collection.
 *
 * Architecture:
 * - Single Responsibility: Only handles database operations for backgrounds
 * - Dependency Inversion: Depends on database abstraction (clientPromise)
 * - Clean Architecture: Infrastructure layer (data persistence)
 *
 * @module db/models/background
 */

import { client } from '@/db'
import type { BackgroundDB } from '@/types/background.types'
import type { Collection } from 'mongodb'

/**
 * Get MongoDB backgrounds collection
 * @returns The backgrounds collection
 */
async function getBackgroundsCollection (): Promise<Collection<BackgroundDB>> {
  const db = client.db() // Uses database name from connection URI
  return db.collection<BackgroundDB>('backgrounds')
}

/**
 * Serialize MongoDB document to plain object
 * Converts ObjectId to string and Date to ISO string
 */
function serializeBackground (doc: Record<string, unknown> & { _id: { toString: () => string }, userId: string, backgroundId: string, purchasedAt: unknown, equippedTo?: string | null }): BackgroundDB {
  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    backgroundId: doc.backgroundId,
    purchasedAt: doc.purchasedAt instanceof Date ? doc.purchasedAt : new Date(doc.purchasedAt as string | number | Date),
    equippedTo: doc.equippedTo ?? null
  }
}

/**
 * Get all backgrounds owned by a user
 *
 * @param userId - The user's unique identifier
 * @returns Array of owned backgrounds
 */
export async function getUserBackgrounds (userId: string): Promise<BackgroundDB[]> {
  const collection = await getBackgroundsCollection()
  const docs = await collection
    .find({ userId })
    .toArray()
  return docs.map(serializeBackground)
}

/**
 * Get the background equipped on a specific monster
 *
 * @param monsterId - The monster's unique identifier
 * @returns The equipped background or null if none
 */
export async function getMonsterBackground (monsterId: string): Promise<BackgroundDB | null> {
  const collection = await getBackgroundsCollection()
  const doc = await collection.findOne({ equippedTo: monsterId })

  return doc != null ? serializeBackground(doc) : null
}

/**
 * Purchase a background for a user
 *
 * Creates a new owned background record in the database.
 * The background starts unequipped (equippedTo is null).
 *
 * @param userId - The user purchasing the background
 * @param backgroundId - The catalog background ID (e.g., "bg-autumn-forest")
 * @returns The newly created owned background
 * @throws Error if the background already exists for this user
 */
export async function purchaseBackground (
  userId: string,
  backgroundId: string
): Promise<BackgroundDB> {
  const collection = await getBackgroundsCollection()

  // Users can now purchase the same background multiple times
  // Each purchase creates a unique owned instance

  // Create new background
  const newBackground: Omit<BackgroundDB, '_id'> = {
    backgroundId,
    userId,
    equippedTo: null,
    purchasedAt: new Date()
  }

  const result = await collection.insertOne(newBackground as any)

  return {
    _id: result.insertedId.toString(),
    ...newBackground
  }
}

/**
 * Equip a background on a monster
 *
 * Ensures only one background is equipped per monster.
 * Automatically unequips any existing background from this monster.
 *
 * @param backgroundDbId - The database ID of the owned background (_id)
 * @param monsterId - The monster to equip the background on
 */
export async function equipBackground (
  backgroundDbId: string,
  monsterId: string
): Promise<void> {
  const collection = await getBackgroundsCollection()

  // First, unequip any existing background from this monster
  await collection.updateMany(
    { equippedTo: monsterId },
    { $set: { equippedTo: null } }
  )

  // Then equip the new background
  const { ObjectId } = await import('mongodb')
  await collection.updateOne(
    { _id: new ObjectId(backgroundDbId) as any },
    { $set: { equippedTo: monsterId } }
  )
}

/**
 * Unequip a background from its monster
 *
 * @param backgroundDbId - The database ID of the owned background (_id)
 */
export async function unequipBackground (backgroundDbId: string): Promise<void> {
  const collection = await getBackgroundsCollection()
  const { ObjectId } = await import('mongodb')

  await collection.updateOne(
    { _id: new ObjectId(backgroundDbId) as any },
    { $set: { equippedTo: null } }
  )
}

/**
 * Delete a background (for testing or admin purposes)
 *
 * @param backgroundDbId - The database ID of the owned background
 */
export async function deleteBackground (backgroundDbId: string): Promise<void> {
  const collection = await getBackgroundsCollection()
  const { ObjectId } = await import('mongodb')

  await collection.deleteOne({ _id: new ObjectId(backgroundDbId) as any })
}

/**
 * Check if a user owns at least one unequipped instance of a specific background
 * Used to determine if a background can be equipped (must have an available instance)
 *
 * @param userId - The user's unique identifier
 * @param backgroundId - The catalog background ID
 * @returns True if the user owns at least one unequipped instance
 */
export async function userOwnsBackground (
  userId: string,
  backgroundId: string
): Promise<boolean> {
  const collection = await getBackgroundsCollection()
  const doc = await collection.findOne({
    userId,
    backgroundId,
    equippedTo: null // Only count unequipped backgrounds as available
  })
  return doc != null
}

/**
 * Get all backgrounds owned by a user with their equipped status
 *
 * @param userId - The user's unique identifier
 * @returns Array of backgrounds with equipped monster info
 */
export async function getUserBackgroundsWithEquipment (
  userId: string
): Promise<Array<BackgroundDB & { isEquipped: boolean }>> {
  const backgrounds = await getUserBackgrounds(userId)
  return backgrounds.map(bg => ({
    ...bg,
    isEquipped: bg.equippedTo != null
  }))
}
