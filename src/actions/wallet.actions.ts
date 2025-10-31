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

import { getUserKoins, spendKoins } from '@/db/models/user.model'

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

/**
 * Spend Koins from user's wallet
 *
 * Server action for deducting Koins during purchases.
 * Validates balance before spending.
 *
 * @param userId - User ID to spend Koins from
 * @param amount - Amount of Koins to spend
 * @returns Result with success status and optional error message
 */
export async function subtractKoins (
  userId: string,
  amount: number
): Promise<{ success: boolean, error?: string }> {
  try {
    // Verify user has sufficient balance
    const currentBalance = await getUserKoins(userId)
    if (currentBalance < amount) {
      return {
        success: false,
        error: `Solde insuffisant. Vous avez ${currentBalance} Koins, mais ${amount} sont nécessaires.`
      }
    }

    // Spend the Koins
    await spendKoins(userId, amount)

    return { success: true }
  } catch (error) {
    console.error('Failed to spend Koins:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la dépense des Koins'
    }
  }
}
