/**
 * Monster Repository Interface
 *
 * Defines the contract for monster data access operations.
 * Follows the Dependency Inversion Principle (DIP) - high-level modules
 * depend on this abstraction, not on concrete implementations.
 *
 * This interface enables:
 * - Easy testing with mock implementations
 * - Switching database providers without changing business logic
 * - Clear separation between data access and business logic
 */

import { Monster } from '@/types/monster.types'

/**
 * Data Transfer Object for creating a new monster
 */
export interface CreateMonsterData {
  ownerId: string
  name: string
  draw: string
  state: string
  level: number
  lastStateChange?: Date
  nextStateChangeAt?: Date
}

/**
 * Filter criteria for cron updates
 */
export interface CronFilter {
  ownerId?: string
  limit?: number
}

/**
 * Bulk state update data
 */
export interface BulkStateUpdate {
  id: string
  state: string
  lastCronUpdate: Date
}

/**
 * Result of bulk update operation
 */
export interface BulkUpdateResult {
  matched: number
  modified: number
}

/**
 * Repository interface for monster data operations
 */
export interface IMonsterRepository {
  /**
   * Creates a new monster in the database
   * @param monsterData - The data required to create a monster
   * @returns Promise resolving to the created monster
   * @throws Error if creation fails
   */
  create: (monsterData: CreateMonsterData) => Promise<Monster>

  /**
   * Finds all monsters belonging to a specific owner
   * @param ownerId - The unique identifier of the owner
   * @returns Promise resolving to an array of monsters
   */
  findByOwnerId: (ownerId: string) => Promise<Monster[]>

  /**
   * Finds a single monster by its ID and owner
   * @param id - The unique identifier of the monster
   * @param ownerId - The unique identifier of the owner
   * @returns Promise resolving to the monster or null if not found
   */
  findByIdAndOwner: (id: string, ownerId: string) => Promise<Monster | null>

  /**
   * Updates a monster's data
   * @param id - The unique identifier of the monster
   * @param ownerId - The unique identifier of the owner
   * @param updates - Partial monster data to update
   * @returns Promise resolving to the updated monster or null if not found
   */
  update: (id: string, ownerId: string, updates: Partial<Monster>) => Promise<Monster | null>

  /**
   * Deletes a monster
   * @param id - The unique identifier of the monster
   * @param ownerId - The unique identifier of the owner
   * @returns Promise resolving to true if deleted, false otherwise
   */
  delete: (id: string, ownerId: string) => Promise<boolean>

  /**
   * Finds monsters eligible for cron updates
   * @param filter - Optional filter criteria (ownerId, limit)
   * @returns Promise resolving to an array of monsters
   */
  findForCron: (filter?: CronFilter) => Promise<Monster[]>

  /**
   * Updates multiple monsters' states in bulk
   * @param updates - Array of state updates to apply
   * @returns Promise resolving to the result of bulk operation
   */
  updateStatesBulk: (updates: BulkStateUpdate[]) => Promise<BulkUpdateResult>
}
