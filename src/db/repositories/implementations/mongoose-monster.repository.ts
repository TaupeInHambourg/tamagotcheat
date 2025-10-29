/**
 * Mongoose Monster Repository Implementation
 *
 * Concrete implementation of IMonsterRepository using Mongoose ODM.
 * Handles all database operations related to monsters.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles database operations
 * - Dependency Inversion: Implements the IMonsterRepository interface
 * - Open/Closed: Can be extended without modifying existing code
 */

import { Types } from 'mongoose'
import Monster from '@/db/models/monster.model'
import { connectMongooseToDatabase } from '@/db'
import { computeCurrentState } from '@/utils/monster-state-decay'
import type { Monster as MonsterType } from '@/types/monster.types'
import type { IMonsterRepository, CreateMonsterData, CronFilter, BulkStateUpdate, BulkUpdateResult } from '../interfaces/monster.repository.interface'

export class MongooseMonsterRepository implements IMonsterRepository {
  /**
   * Ensures database connection before operations
   * @private
   */
  private async ensureConnection (): Promise<void> {
    await connectMongooseToDatabase()
  }

  /**
   * Serializes Mongoose document to plain JavaScript object
   * @param doc - Mongoose document
   * @returns Plain JavaScript object
   * @private
   */
  private serialize<T>(doc: unknown): T {
    return JSON.parse(JSON.stringify(doc))
  }

  /**
   * Validates MongoDB ObjectId format
   * @param id - String to validate
   * @returns true if valid ObjectId
   * @private
   */
  private isValidObjectId (id: string): boolean {
    return Types.ObjectId.isValid(id)
  }

  /**
   * Creates a new monster in the database
   */
  async create (monsterData: CreateMonsterData): Promise<MonsterType> {
    await this.ensureConnection()

    const monster = new Monster({
      ownerId: monsterData.ownerId,
      name: monsterData.name,
      draw: monsterData.draw,
      state: monsterData.state,
      level: monsterData.level
    })

    const savedMonster = await monster.save()
    return this.serialize<MonsterType>(savedMonster)
  }

  /**
   * Applies state decay to a monster and updates if needed
   * @param monster - Mongoose document to check and update
   * @private
   */
  private async applyStateDecay (monster: any): Promise<void> {
    const monsterData = this.serialize<MonsterType>(monster)
    const result = computeCurrentState(monsterData)

    if (result.changed) {
      // State has changed, update in database
      monster.state = result.state
      monster.lastStateChange = result.lastStateChange
      monster.nextStateChangeAt = result.nextStateChangeAt
      await monster.save()
    }
  }

  /**
   * Finds all monsters belonging to a specific owner
   * Applies state decay to each monster before returning
   */
  async findByOwnerId (ownerId: string): Promise<MonsterType[]> {
    await this.ensureConnection()

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const monsters = await Monster.find({ ownerId }).exec()

    // Apply state decay to each monster
    await Promise.all(monsters.map(async monster => await this.applyStateDecay(monster)))

    return this.serialize<MonsterType[]>(monsters)
  }

  /**
   * Finds a single monster by its ID and owner
   * Applies state decay before returning
   */
  async findByIdAndOwner (id: string, ownerId: string): Promise<MonsterType | null> {
    await this.ensureConnection()

    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid monster ID format: ${id}`)
    }

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const monster = await Monster.findOne({ _id: id, ownerId }).exec()

    if (monster === null) {
      return null
    }

    // Apply state decay
    await this.applyStateDecay(monster)

    return this.serialize<MonsterType>(monster)
  }

  /**
   * Updates a monster's data
   */
  async update (id: string, ownerId: string, updates: Partial<MonsterType>): Promise<MonsterType | null> {
    await this.ensureConnection()

    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid monster ID format: ${id}`)
    }

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const monster = await Monster.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: updates },
      { new: true }
    ).exec()

    if (monster === null) {
      return null
    }

    return this.serialize<MonsterType>(monster)
  }

  /**
   * Deletes a monster
   */
  async delete (id: string, ownerId: string): Promise<boolean> {
    await this.ensureConnection()

    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid monster ID format: ${id}`)
    }

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const result = await Monster.deleteOne({ _id: id, ownerId }).exec()
    return result.deletedCount > 0
  }

  /**
   * Finds monsters eligible for cron updates
   * Can filter by ownerId and apply a limit
   */
  async findForCron (filter?: CronFilter): Promise<MonsterType[]> {
    await this.ensureConnection()

    let query = Monster.find()

    // Apply owner filter if provided
    if (filter?.ownerId != null) {
      if (!this.isValidObjectId(filter.ownerId)) {
        throw new Error(`Invalid owner ID format: ${filter.ownerId}`)
      }
      query = query.where('ownerId').equals(filter.ownerId)
    }

    // Apply limit if provided
    if (filter?.limit != null && filter.limit > 0) {
      query = query.limit(filter.limit)
    }

    const monsters = await query.exec()
    return monsters.map(doc => this.serialize<MonsterType>(doc))
  }

  /**
   * Updates multiple monsters' states in bulk
   * Uses MongoDB bulkWrite for efficient batch operations
   */
  async updateStatesBulk (updates: BulkStateUpdate[]): Promise<BulkUpdateResult> {
    await this.ensureConnection()

    if (updates.length === 0) {
      return { matched: 0, modified: 0 }
    }

    // Validate all IDs before processing
    for (const update of updates) {
      if (!this.isValidObjectId(update.id)) {
        throw new Error(`Invalid monster ID format: ${update.id}`)
      }
    }

    // Prepare bulk operations
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: {
          $set: {
            state: update.state,
            lastCronUpdate: update.lastCronUpdate,
            updatedAt: new Date()
          }
        }
      }
    }))

    // Execute bulk write
    const result = await Monster.bulkWrite(bulkOps, { ordered: false })

    return {
      matched: result.matchedCount,
      modified: result.modifiedCount
    }
  }
}
