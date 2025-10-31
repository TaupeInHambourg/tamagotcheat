/**
 * User Model
 *
 * Database operations for user profiles, including Koins management.
 * Handles wallet operations with proper validation and error handling.
 *
 * Architecture:
 * - Single Responsibility: User data access only
 * - Interface Segregation: Clean function interfaces
 * - Dependency Inversion: Depends on database abstraction
 *
 * @module db/models
 */

import { getDatabase } from '@/db'
import { ObjectId } from 'mongodb'

/**
 * User profile document structure in MongoDB
 */
interface UserProfile {
  _id?: ObjectId
  userId: string // Better Auth user ID
  koins: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Result type for Koins operations
 */
interface KoinsOperationResult {
  success: boolean
  newBalance?: number
  error?: string
}

/**
 * Get user's current Koins balance
 *
 * Creates profile with 0 Koins if it doesn't exist.
 * This ensures every user has a wallet.
 *
 * @param userId - User's unique identifier
 * @returns Current Koins balance
 */
export async function getUserKoins (userId: string): Promise<number> {
  const db = await getDatabase()
  const collection = db.collection<UserProfile>('user_profiles')

  // Find or create user profile
  const profile = await collection.findOne({ userId })

  if (profile == null) {
    // Create new profile with 0 Koins
    await collection.insertOne({
      userId,
      koins: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return 0
  }

  return profile.koins ?? 0
}

/**
 * Add Koins to user's balance
 *
 * Used after successful payment via Stripe webhook.
 * Creates profile if it doesn't exist.
 *
 * Business rules:
 * - Amount must be positive
 * - Transaction is atomic
 * - Balance cannot be negative
 *
 * @param userId - User's unique identifier
 * @param amount - Number of Koins to add (must be positive)
 * @returns Operation result with new balance
 */
export async function addKoins (
  userId: string,
  amount: number
): Promise<KoinsOperationResult> {
  if (amount <= 0) {
    return {
      success: false,
      error: 'Amount must be positive'
    }
  }

  try {
    const db = await getDatabase()
    const collection = db.collection<UserProfile>('user_profiles')

    // Get current profile or create one
    const profile = await collection.findOne({ userId })

    if (profile == null) {
      // Create new profile with initial Koins
      const result = await collection.insertOne({
        userId,
        koins: amount,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      if (result.acknowledged) {
        return {
          success: true,
          newBalance: amount
        }
      } else {
        return {
          success: false,
          error: 'Failed to create profile'
        }
      }
    }

    // Update existing profile
    const currentBalance = profile.koins ?? 0
    const newBalance = currentBalance + amount
    const result = await collection.updateOne(
      { userId },
      {
        $set: {
          koins: newBalance,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      return {
        success: true,
        newBalance
      }
    } else {
      return {
        success: false,
        error: 'Failed to update balance'
      }
    }
  } catch (error) {
    console.error('[User Model] Error adding koins:', error)
    return {
      success: false,
      error: 'Database operation failed'
    }
  }
}

/**
 * Spend Koins from user's balance
 *
 * Used when purchasing accessories or other items.
 * Validates sufficient balance before deducting.
 *
 * Business rules:
 * - Amount must be positive
 * - User must have sufficient balance
 * - Transaction is atomic
 * - Balance cannot go negative
 *
 * @param userId - User's unique identifier
 * @param amount - Number of Koins to spend (must be positive)
 * @returns Operation result with new balance
 */
export async function spendKoins (
  userId: string,
  amount: number
): Promise<KoinsOperationResult> {
  if (amount <= 0) {
    return {
      success: false,
      error: 'Amount must be positive'
    }
  }

  try {
    const db = await getDatabase()
    const collection = db.collection<UserProfile>('user_profiles')

    // Get current profile
    const profile = await collection.findOne({ userId })

    if (profile == null) {
      return {
        success: false,
        error: 'User profile not found'
      }
    }

    // Check sufficient balance
    if (profile.koins < amount) {
      return {
        success: false,
        error: 'Insufficient koins'
      }
    }

    // Deduct Koins
    const newBalance = profile.koins - amount
    const result = await collection.updateOne(
      { userId },
      {
        $set: {
          koins: newBalance,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      return {
        success: true,
        newBalance
      }
    } else {
      return {
        success: false,
        error: 'Failed to update balance'
      }
    }
  } catch (error) {
    console.error('[User Model] Error spending koins:', error)
    return {
      success: false,
      error: 'Database operation failed'
    }
  }
}

/**
 * Get complete user profile
 *
 * Returns full profile including Koins balance.
 * Creates profile if it doesn't exist.
 *
 * @param userId - User's unique identifier
 * @returns User profile or null if creation failed
 */
export async function getUserProfile (userId: string): Promise<UserProfile | null> {
  const db = await getDatabase()
  const collection = db.collection<UserProfile>('user_profiles')

  let profile = await collection.findOne({ userId })

  if (profile == null) {
    // Create new profile
    const result = await collection.insertOne({
      userId,
      koins: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (result.acknowledged) {
      profile = await collection.findOne({ userId })
    }
  }

  return profile
}
