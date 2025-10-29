/**
 * Repository Factory
 *
 * Provides a centralized way to create repository instances.
 * This follows the Factory pattern and makes it easy to switch
 * implementations or mock repositories for testing.
 */

import { MongooseMonsterRepository } from './implementations/mongoose-monster.repository'
import type { IMonsterRepository } from './interfaces/monster.repository.interface'

/**
 * Creates and returns a monster repository instance
 * @returns Monster repository implementation
 */
export function createMonsterRepository (): IMonsterRepository {
  return new MongooseMonsterRepository()
}
