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
import type { Document } from 'mongoose'
import Monster from '@/db/models/monster.model'
import { connectMongooseToDatabase } from '@/db'
import { computeCurrentState } from '@/utils/monster-state-decay'
import type { Monster as MonsterType } from '@/types/monster.types'
import type { IMonsterRepository, CreateMonsterData } from '../interfaces/monster.repository.interface'

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
   * @param doc - Mongoose document or array of documents
   * @returns Plain JavaScript object with normalized id field
   * @private
   */
  private serialize<T>(doc: unknown): T {
    const obj = JSON.parse(JSON.stringify(doc))

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (item._id !== undefined) {
          item.id = item._id.toString()
        }
        return item
      }) as T
    }

    // Handle single objects - normalize _id to id for consistency
    if (obj._id !== undefined) {
      obj.id = obj._id.toString()
      // Keep _id for backward compatibility, but id is the primary field
    }

    return obj
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
  private async applyStateDecay (monster: Document & Record<string, unknown> & { save: () => Promise<unknown> }): Promise<void> {
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

    console.log('[MonsterRepository] Updating monster:', id, 'with:', updates)

    const monster = await Monster.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: updates },
      { new: true }
    ).exec()

    console.log('[MonsterRepository] Updated result:', monster)

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
   * Finds all public monsters with owner information
   * Uses MongoDB aggregation to join with user collection
   */
  async findPublicWithOwners (): Promise<Array<MonsterType & { ownerName?: string }>> {
    await this.ensureConnection()

    const monsters = await Monster.aggregate([
      {
        $match: { isPublic: true }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          ownerName: '$owner.name'
        }
      },
      {
        $project: {
          owner: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).exec()

    console.log('[MonsterRepository] Public monsters with owners:', JSON.stringify(monsters, null, 2))

    return this.serialize<Array<MonsterType & { ownerName?: string }>>(monsters)
  }
}
