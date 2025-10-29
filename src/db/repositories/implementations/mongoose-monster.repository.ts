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
   * Finds all monsters belonging to a specific owner
   */
  async findByOwnerId (ownerId: string): Promise<MonsterType[]> {
    await this.ensureConnection()

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const monsters = await Monster.find({ ownerId }).exec()
    return this.serialize<MonsterType[]>(monsters)
  }

  /**
   * Finds a single monster by its ID and owner
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
}
