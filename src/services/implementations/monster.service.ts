/**
 * Monster Service Implementation
 *
 * Implements business logic for monster operations.
 * This service orchestrates between repositories and enforces business rules.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Handles only monster business logic
 * - Dependency Inversion: Depends on repository interface, not implementation
 * - Open/Closed: Can be extended without modification
 */

import type { IMonsterRepository } from '@/db/repositories/interfaces/monster.repository.interface'
import type { IMonsterService, OperationResult } from '../interfaces/monster.service.interface'
import type { Monster, CreateMonsterDto, MonsterTemplate, MonsterAction, MonsterState } from '@/types/monster.types'
import { MonsterTemplates, MONSTER_STATES, MONSTER_ACTIONS } from '@/types/monster.types'
import { initializeMonsterTiming, computeCurrentState } from '@/utils/monster-state-decay'
import { addXP, XP_PER_ACTION } from '@/utils/xp-system'

export class MonsterService implements IMonsterService {
  constructor (
    private readonly monsterRepository: IMonsterRepository
  ) {}

  /**
   * Validates monster name
   * @param name - Name to validate
   * @returns true if valid
   * @private
   */
  private validateMonsterName (name: string): boolean {
    return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 50
  }

  /**
   * Validates template ID
   * @param templateId - Template ID to validate
   * @returns true if valid
   * @private
   */
  private validateTemplateId (templateId: string): boolean {
    return templateId in MonsterTemplates
  }

  /**
   * Retrieves template by ID
   * @param templateId - Template ID
   * @returns Template or undefined
   * @private
   */
  private getTemplate (templateId: string): MonsterTemplate | undefined {
    return MonsterTemplates[templateId]
  }

  /**
   * Validates monster state
   * @param state - State to validate
   * @returns true if valid
   * @private
   */
  private validateMonsterState (state: string): boolean {
    return MONSTER_STATES.includes(state as never)
  }

  /**
   * Creates a new monster for a user
   */
  async createMonster (userId: string, monsterData: CreateMonsterDto): Promise<OperationResult<Monster>> {
    try {
      // Validate inputs
      if (!this.validateMonsterName(monsterData.name)) {
        return {
          success: false,
          error: 'Monster name must be between 2 and 50 characters'
        }
      }

      if (!this.validateTemplateId(monsterData.templateId)) {
        return {
          success: false,
          error: 'Invalid monster template'
        }
      }

      // Get template
      const template = this.getTemplate(monsterData.templateId)
      if (template === undefined) {
        return {
          success: false,
          error: 'Monster template not found'
        }
      }

      // Initialize timing for individual state changes
      const timing = initializeMonsterTiming('happy')

      // Create monster
      const monster = await this.monsterRepository.create({
        ownerId: userId,
        name: monsterData.name.trim(),
        draw: template.draw,
        state: timing.state,
        level: 1,
        lastStateChange: timing.lastStateChange,
        nextStateChangeAt: timing.nextStateChangeAt
      })

      return {
        success: true,
        data: monster
      }
    } catch (error) {
      console.error('Error creating monster:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create monster'
      }
    }
  }

  /**
   * Retrieves all monsters owned by a user
   */
  async getUserMonsters (userId: string): Promise<OperationResult<Monster[]>> {
    try {
      const monsters = await this.monsterRepository.findByOwnerId(userId)

      return {
        success: true,
        data: monsters
      }
    } catch (error) {
      console.error('Error fetching user monsters:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch monsters',
        data: []
      }
    }
  }

  /**
   * Retrieves a specific monster by ID with lazy state decay applied
   *
   * This method implements the LAZY UPDATE PATTERN:
   *
   * How it works:
   * - State computed only when monster is fetched
   * - Low database load: O(1) per read
   * - Only updates active/viewed monsters
   * - Simple, elegant, and scalable
   *
   * Flow:
   * 1. Fetch monster from database
   * 2. Check if now >= nextStateChangeAt
   * 3. If yes: compute new random state + schedule next change
   * 4. If yes: update database with new state
   * 5. Return always up-to-date monster
   *
   * Benefits:
   * ✅ State is always accurate when read
   * ✅ Only updates monsters that are actively viewed
   * ✅ Scales linearly with usage, not with total monsters
   * ✅ Simpler architecture and easier to maintain
   *
   * @param userId - Owner of the monster
   * @param monsterId - ID of the monster to fetch
   * @returns Operation result with monster data or error
   */
  async getMonsterById (userId: string, monsterId: string): Promise<OperationResult<Monster>> {
    try {
      // Step 1: Fetch monster from database
      const monster = await this.monsterRepository.findByIdAndOwner(monsterId, userId)

      if (monster === null) {
        return {
          success: false,
          error: 'Monster not found'
        }
      }

      // Step 2: Apply lazy state decay computation
      // This checks if it's time for a state change based on nextStateChangeAt
      const stateResult = computeCurrentState(monster)

      // Step 3: If state changed, persist to database
      if (stateResult.changed) {
        const updatedMonster = await this.monsterRepository.update(monsterId, userId, {
          state: stateResult.state,
          lastStateChange: stateResult.lastStateChange,
          nextStateChangeAt: stateResult.nextStateChangeAt
        })

        if (updatedMonster !== null) {
          return {
            success: true,
            data: updatedMonster
          }
        }

        // Fallback: Return original monster if update fails
        // This should rarely happen, but ensures graceful degradation
        console.warn('State decay update failed, returning original monster with computed state')
      }

      // Step 4: Return monster (either updated or unchanged)
      return {
        success: true,
        data: monster
      }
    } catch (error) {
      console.error('Error fetching monster by ID:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch monster'
      }
    }
  }

  /**
   * Updates a monster's state
   */
  async updateMonsterState (userId: string, monsterId: string, state: string): Promise<OperationResult<Monster>> {
    try {
      // Validate state
      if (!this.validateMonsterState(state)) {
        return {
          success: false,
          error: `Invalid monster state. Must be one of: ${MONSTER_STATES.join(', ')}`
        }
      }

      // Update monster with type-safe state
      const monster = await this.monsterRepository.update(monsterId, userId, {
        state: state as typeof MONSTER_STATES[number]
      })

      if (monster === null) {
        return {
          success: false,
          error: 'Monster not found'
        }
      }

      return {
        success: true,
        data: monster
      }
    } catch (error) {
      console.error('Error updating monster state:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update monster'
      }
    }
  }

  /**
   * Interacts with a monster using a specific action
   *
   * Business rule: Only the correct action for the current state succeeds
   * - hungry → feed
   * - sleepy → sleep
   * - sad → play
   * - angry → cuddle
   * - happy → no action needed (all actions are ignored)
   *
   * If the correct action is used, the monster becomes happy and timing is reset.
   *
   * @param userId - The ID of the user performing the action
   * @param monsterId - The ID of the monster to interact with
   * @param action - The interaction type ('feed', 'sleep', 'play', 'cuddle')
   * @returns Result with updated monster or error
   */
  async interactWithMonster (userId: string, monsterId: string, action: string): Promise<OperationResult<Monster>> {
    try {
      // Step 1: Fetch current monster
      const monsterResult = await this.getMonsterById(userId, monsterId)

      if (!monsterResult.success || monsterResult.data === undefined) {
        return {
          success: false,
          error: monsterResult.error ?? 'Monster not found'
        }
      }

      const monster = monsterResult.data

      // Step 2: Define action-to-state mapping (business rule)
      const actionStateMap: Record<MonsterAction, MonsterState> = {
        feed: 'hungry',
        sleep: 'sleepy',
        play: 'sad',
        cuddle: 'angry'
      }

      // Step 3: Validate action
      if (!MONSTER_ACTIONS.includes(action as MonsterAction)) {
        return {
          success: false,
          error: `Invalid action. Must be one of: ${MONSTER_ACTIONS.join(', ')}`
        }
      }

      const typedAction = action as MonsterAction

      // Step 4: Check if monster is already happy (no action needed)
      if (monster.state === 'happy') {
        return {
          success: false,
          error: 'Monster is already happy!'
        }
      }

      // Step 5: Check if action matches current state
      const requiredState = actionStateMap[typedAction]
      if (monster.state !== requiredState) {
        // Wrong action for current state - do nothing
        return {
          success: false,
          error: `Wrong action! Monster is ${monster.state}, not ${requiredState}`
        }
      }

      // Step 6: Action is correct! Update to happy and reset timing
      const timing = initializeMonsterTiming('happy')

      // Step 7: Calculate XP gain
      const currentTotalXP = monster.totalExperience ?? 0
      const xpGain = XP_PER_ACTION[typedAction]
      const xpResult = addXP(currentTotalXP, xpGain)

      const updatedMonster = await this.monsterRepository.update(monsterId, userId, {
        state: timing.state,
        lastStateChange: timing.lastStateChange,
        nextStateChangeAt: timing.nextStateChangeAt,
        level: xpResult.newLevel,
        experience: xpResult.newCurrentXP,
        totalExperience: xpResult.newTotalXP
      })

      if (updatedMonster === null) {
        return {
          success: false,
          error: 'Failed to update monster'
        }
      }

      return {
        success: true,
        data: updatedMonster
      }
    } catch (error) {
      console.error('Error interacting with monster:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to interact with monster'
      }
    }
  }

  /**
   * Updates the public visibility of a monster
   *
   * @param userId - The ID of the user who owns the monster
   * @param monsterId - The ID of the monster
   * @param isPublic - Whether the monster should be publicly visible in the gallery
   * @returns Result with updated monster or error
   */
  async updateMonsterVisibility (userId: string, monsterId: string, isPublic: boolean): Promise<OperationResult<Monster>> {
    try {
      console.log('[MonsterService] Updating visibility for monster:', monsterId, 'to:', isPublic)

      const updatedMonster = await this.monsterRepository.update(monsterId, userId, {
        isPublic
      })

      console.log('[MonsterService] Updated monster:', updatedMonster)

      if (updatedMonster === null) {
        return {
          success: false,
          error: 'Monster not found or unauthorized'
        }
      }

      return {
        success: true,
        data: updatedMonster
      }
    } catch (error) {
      console.error('Error updating monster visibility:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update monster visibility'
      }
    }
  }

  /**
   * Retrieves all public monsters for the gallery with owner information
   *
   * @returns Result containing array of public monsters with owner names
   */
  async getPublicMonsters (): Promise<OperationResult<Array<Monster & { ownerName?: string }>>> {
    try {
      const monsters = await this.monsterRepository.findPublicWithOwners()

      return {
        success: true,
        data: monsters
      }
    } catch (error) {
      console.error('Error fetching public monsters:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch public monsters',
        data: []
      }
    }
  }
}
