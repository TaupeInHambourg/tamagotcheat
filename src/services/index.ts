/**
 * Service Factory
 *
 * Provides centralized creation of service instances with their dependencies.
 * Follows the Factory pattern and Dependency Injection principles.
 */

import { createMonsterRepository } from '@/db/repositories'
import { MonsterService } from './implementations/monster.service'
import type { IMonsterService } from './interfaces/monster.service.interface'

/**
 * Creates and returns a monster service instance with all dependencies
 * @returns Configured monster service
 */
export function createMonsterService (): IMonsterService {
  const monsterRepository = createMonsterRepository()
  return new MonsterService(monsterRepository)
}
