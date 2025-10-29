/**
 * Monster Cron Service Implementation
 *
 * Implements automated monster state updates with random state selection.
 * This service orchestrates the business logic for periodic updates.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Handles only cron update logic
 * - Open/Closed: Can be extended with new update strategies
 * - Dependency Inversion: Depends on IMonsterRepository interface
 */

import type { IMonsterRepository } from '@/db/repositories/interfaces/monster.repository.interface'
import type {
  IMonsterCronService,
  CronUpdateOptions,
  CronUpdateSummary,
  OperationResult
} from '../interfaces/monster-cron.service.interface'

/**
 * Available monster states for random selection
 * 'happy' is typically excluded from automated updates
 */
const CRON_UPDATE_STATES = ['sad', 'angry', 'hungry', 'sleepy'] as const

/**
 * Default batch size for bulk updates
 */
const DEFAULT_BATCH_SIZE = 500

/**
 * Monster Cron Service implementation
 */
export class MonsterCronService implements IMonsterCronService {
  /**
   * Constructor with dependency injection
   * @param repository - Monster repository for data access
   */
  constructor (private readonly repository: IMonsterRepository) {}

  /**
   * Selects a random state from available states
   * @param excludeHappy - Whether to exclude 'happy' from selection
   * @returns A random monster state
   * @private
   */
  private getRandomState (excludeHappy: boolean = true): string {
    const states = excludeHappy
      ? CRON_UPDATE_STATES
      : [...CRON_UPDATE_STATES, 'happy']

    const randomIndex = Math.floor(Math.random() * states.length)
    return states[randomIndex]
  }

  /**
   * Updates all monsters with random states
   */
  async updateAll (options?: CronUpdateOptions): Promise<OperationResult<CronUpdateSummary>> {
    const startTime = Date.now()
    const errors: string[] = []

    try {
      const batchSize = options?.batchSize ?? DEFAULT_BATCH_SIZE
      const excludeHappy = options?.excludeHappy ?? true

      // Find monsters eligible for update
      const monsters = await this.repository.findForCron({
        ownerId: options?.userId,
        limit: batchSize
      })

      if (monsters.length === 0) {
        return {
          success: true,
          data: {
            updated: 0,
            durationMs: Date.now() - startTime,
            timestamp: new Date()
          }
        }
      }

      // Prepare bulk updates with random states
      const now = new Date()
      const updates = monsters.map(monster => ({
        id: monster.id ?? monster._id ?? '',
        state: this.getRandomState(excludeHappy),
        lastCronUpdate: now
      }))

      // Execute bulk update
      const result = await this.repository.updateStatesBulk(updates)

      const durationMs = Date.now() - startTime

      // Log summary
      console.log(`[CRON] Updated ${result.modified} monsters in ${durationMs}ms`)

      return {
        success: true,
        data: {
          updated: result.modified,
          durationMs,
          timestamp: now,
          errors: errors.length > 0 ? errors : undefined
        }
      }
    } catch (error) {
      const durationMs = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      console.error('[CRON] Error during monster update:', errorMessage)

      return {
        success: false,
        error: `Failed to update monsters: ${errorMessage}`
      }
    }
  }

  /**
   * Updates monsters for a specific user
   */
  async updateForUser (userId: string, options?: CronUpdateOptions): Promise<OperationResult<CronUpdateSummary>> {
    // Validate userId
    if (userId == null || userId.trim() === '') {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Call updateAll with userId filter
    return await this.updateAll({
      ...options,
      userId
    })
  }
}
