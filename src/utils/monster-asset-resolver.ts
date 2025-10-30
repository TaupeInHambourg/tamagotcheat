/**
 * Monster Asset Resolver Utility
 *
 * Provides utilities to resolve the correct asset paths for monsters
 * based on their current state.
 *
 * Each monster has a set of SVG assets, one for each possible state:
 * - happy.svg
 * - sad.svg
 * - angry.svg
 * - hungry.svg
 * - sleepy.svg
 *
 * This utility constructs the correct path dynamically based on:
 * 1. Monster's folder path (e.g., "chat-cosmique")
 * 2. Monster's current state (e.g., "happy")
 *
 * Example:
 * ```typescript
 * const asset = getMonsterAssetPath("chat-cosmique", "happy")
 * // Returns: "/assets/tamagocheats/chat-cosmique/happy.svg"
 * ```
 */

import type { MonsterState } from '@/types/monster.types'

/**
 * Base path for all monster assets
 */
const ASSETS_BASE_PATH = '/assets/tamagocheats'

/**
 * Resolves the correct asset path for a monster based on its state
 *
 * @param folderPath - The monster's folder name (e.g., "chat-cosmique", "dino-nuage")
 * @param state - The current state of the monster
 * @returns The full path to the SVG asset
 *
 * @example
 * ```typescript
 * getMonsterAssetPath("chat-cosmique", "happy")
 * // => "/assets/tamagocheats/chat-cosmique/happy.svg"
 *
 * getMonsterAssetPath("dino-nuage", "sleepy")
 * // => "/assets/tamagocheats/dino-nuage/sleepy.svg"
 * ```
 */
export function getMonsterAssetPath (folderPath: string, state: MonsterState): string {
  return `${ASSETS_BASE_PATH}/${folderPath}/${state}.svg`
}

/**
 * Extracts the folder path from a full asset path
 *
 * This is useful when you have a full path stored in the database
 * and need to extract just the folder name.
 *
 * @param fullPath - The full asset path
 * @returns The folder path only
 *
 * @example
 * ```typescript
 * extractFolderPath("/assets/tamagocheats/chat-cosmique/happy.svg")
 * // => "chat-cosmique"
 * ```
 */
export function extractFolderPath (fullPath: string): string {
  const parts = fullPath.split('/')
  // Path format: /assets/tamagocheats/{folderPath}/{state}.svg
  // We want the folder path which is at index -2
  return parts[parts.length - 2]
}

/**
 * Validates if an asset path exists for a given state
 *
 * @param folderPath - The monster's folder name
 * @param state - The state to validate
 * @returns True if the path is valid (follows expected pattern)
 */
export function isValidAssetPath (folderPath: string, state: MonsterState): boolean {
  // Basic validation: check that folder path and state are not empty
  return folderPath.length > 0 && state.length > 0
}
