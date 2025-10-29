/**
 * Monster Cron Service Interface
 *
 * Defines the contract for automated monster state updates.
 * This service handles the business logic for periodic state changes.
 *
 * Responsibilities:
 * - Select monsters eligible for updates
 * - Apply random state changes according to game rules
 * - Track update metrics and performance
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles cron update logic
 * - Dependency Inversion: Depends on IMonsterRepository abstraction
 */

/**
 * Options for cron update operations
 */
export interface CronUpdateOptions {
  /** Filter by specific user ID */
  userId?: string
  /** Maximum number of monsters to update in one batch */
  batchSize?: number
  /** Whether to exclude 'happy' state from random selection */
  excludeHappy?: boolean
}

/**
 * Summary of a cron update operation
 */
export interface CronUpdateSummary {
  /** Number of monsters processed */
  updated: number
  /** Duration of the operation in milliseconds */
  durationMs: number
  /** Timestamp when the update started */
  timestamp: Date
  /** Any errors encountered (non-fatal) */
  errors?: string[]
}

/**
 * Operation result wrapper
 */
export type OperationResult<T> =
  | { success: true, data: T }
  | { success: false, error: string }

/**
 * Service interface for automated monster updates
 */
export interface IMonsterCronService {
  /**
   * Updates all monsters (or filtered subset) with random states
   *
   * @param options - Configuration for the update operation
   * @returns Promise resolving to operation result with summary
   *
   * @example
   * const result = await service.updateAll({ batchSize: 100 })
   * if (result.success) {
   *   console.log(`Updated ${result.data.updated} monsters`)
   * }
   */
  updateAll: (options?: CronUpdateOptions) => Promise<OperationResult<CronUpdateSummary>>

  /**
   * Updates monsters for a specific user
   *
   * @param userId - The unique identifier of the user
   * @param options - Additional configuration options
   * @returns Promise resolving to operation result with summary
   *
   * @example
   * const result = await service.updateForUser('user123')
   * if (result.success) {
   *   console.log(`Updated ${result.data.updated} monsters for user`)
   * }
   */
  updateForUser: (userId: string, options?: CronUpdateOptions) => Promise<OperationResult<CronUpdateSummary>>
}
