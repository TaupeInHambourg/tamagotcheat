/**
 * Monster Service Interface
 *
 * Defines business operations for monster management.
 * This layer sits between the presentation layer (actions/controllers)
 * and the data layer (repositories).
 *
 * Responsibilities:
 * - Enforce business rules and validation
 * - Coordinate between multiple repositories if needed
 * - Handle domain logic and transformations
 */

import type { Monster, CreateMonsterDto } from '@/types/monster.types'

/**
 * Result type for operations that can fail
 */
export interface OperationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Service interface for monster business operations
 */
export interface IMonsterService {
  /**
   * Creates a new monster for a user
   * @param userId - The ID of the user creating the monster
   * @param monsterData - The data to create the monster with
   * @returns Result containing the created monster or error
   */
  createMonster: (userId: string, monsterData: CreateMonsterDto) => Promise<OperationResult<Monster>>

  /**
   * Retrieves all monsters owned by a user
   * @param userId - The ID of the user
   * @returns Result containing array of monsters or error
   */
  getUserMonsters: (userId: string) => Promise<OperationResult<Monster[]>>

  /**
   * Retrieves a specific monster by ID
   * @param userId - The ID of the user
   * @param monsterId - The ID of the monster
   * @returns Result containing the monster or error
   */
  getMonsterById: (userId: string, monsterId: string) => Promise<OperationResult<Monster>>

  /**
   * Updates a monster's state
   * @param userId - The ID of the user
   * @param monsterId - The ID of the monster
   * @param state - The new state
   * @returns Result containing the updated monster or error
   */
  updateMonsterState: (userId: string, monsterId: string, state: string) => Promise<OperationResult<Monster>>

  /**
   * Interacts with a monster using a specific action
   * Only the correct action for the current state will succeed
   * @param userId - The ID of the user
   * @param monsterId - The ID of the monster
   * @param action - The interaction action ('feed', 'sleep', 'play', 'cuddle')
   * @returns Result containing the updated monster or error
   */
  interactWithMonster: (userId: string, monsterId: string, action: string) => Promise<OperationResult<Monster>>

  /**
   * Updates the public visibility of a monster
   * @param userId - The ID of the user
   * @param monsterId - The ID of the monster
   * @param isPublic - Whether the monster should be publicly visible
   * @returns Result indicating success or error
   */
  updateMonsterVisibility: (userId: string, monsterId: string, isPublic: boolean) => Promise<OperationResult<Monster>>

  /**
   * Retrieves all public monsters for the gallery
   * @returns Result containing array of public monsters with owner info or error
   */
  getPublicMonsters: () => Promise<OperationResult<Array<Monster & { ownerName?: string }>>>
}
