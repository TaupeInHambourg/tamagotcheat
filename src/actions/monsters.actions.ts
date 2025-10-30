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
import type { CreateMonsterDto, Monster } from '@/types/monster.types'

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
