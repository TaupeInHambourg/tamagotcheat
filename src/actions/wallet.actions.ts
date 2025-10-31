/**
 * Wallet Server Actions
 *
 * Provides server-side operations for wallet balance management.
 * All database operations must remain on the server.
 *
 * Architecture:
 * - Single Responsibility: Wallet balance queries only
 * - Clean Architecture: Application layer (use cases)
 *
 * @module actions
 */

'use server'

import { getUserKoins } from '@/db/models/user.model'

/**
 * Get user's current Koins balance
 *
 * Server action to safely fetch balance without exposing MongoDB to client.
 *
 * @param userId - User ID to fetch balance for
 * @returns Current Koins balance
 */
export async function getKoinsBalance (userId: string): Promise<number> {
  try {
    return await getUserKoins(userId)
  } catch (error) {
    console.error('Failed to fetch Koins balance:', error)
    return 0
  }
}
